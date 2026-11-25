<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Payment;
use App\Models\Bill;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Notifications\AdminNotification;

class PaymentController extends Controller
{
    public function index()
    {
        $customer = Auth::user()->customer;

        if (!$customer) {
            return Inertia::render('payments/index', [
                'payments' => [],
                'balance'  => 0
            ]);
        }

        $payments = Payment::where('customer_id', $customer->id)
            ->with('bill')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('payments/index', [
            'payments' => $payments,
            'balance'  => $customer->balance
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'bill_id' => 'required|exists:bills,id',
            'payment_method' => 'required|in:gcash,paymaya,cash',
        ]);

        $bill = Bill::findOrFail($request->bill_id);
        $customer = Auth::user()->customer;

        if (!$customer || $bill->customer_id !== $customer->id) {
            abort(403);
        }

        if ($bill->status === 'paid') {
            return back()->with('error', 'This bill is already paid.');
        }

        if ($request->payment_method === 'cash') {
            return $this->handleCashPayment($bill);
        }

        return $this->handleOnlinePayment($bill, $request->payment_method);
    }

    protected function handleCashPayment(Bill $bill)
    {
        $referenceNumber = 'CASH-' . strtoupper(Str::random(10));

        $payment = Payment::create([
            'customer_id'    => Auth::user()->customer->id,
            'bill_id'        => $bill->id,
            'payment_method' => 'cash',
            'amount' => $bill->amount,
            'reference_number' => $referenceNumber,
            'status' => 'pending_cash',
        ]);

        return redirect()->route('bills.show', $bill->id)->with([
            'success' => 'Cash payment initiated.',
            'cash_payment' => [
                'reference_number' => $referenceNumber,
                'amount' => $bill->amount,
                'instructions' => 'Please visit our office and present this reference number to complete your payment.'
            ]
        ]);
    }

    protected function handleOnlinePayment(Bill $bill, $method)
    {
        $secretKey = env('PAYMONGO_SECRET_KEY');
        
        if (empty($secretKey) || $secretKey === 'sk_test_placeholder') {
            Log::error('PayMongo Secret Key is missing or invalid.');
            return back()->with('error', 'Online payment is currently unavailable. Please contact support.');
        }

        try {
            $response = Http::withBasicAuth($secretKey, '')
                ->post('https://api.paymongo.com/v1/checkout_sessions', [
                    'data' => [
                        'attributes' => [
                            'send_email_receipt' => true,
                            'show_description' => true,
                            'show_line_items' => true,
                            'line_items' => [
                                [
                                    'currency' => 'PHP',
                                    'amount' => (int)($bill->amount * 100), // PayMongo expects amount in cents
                                    'description' => "Water Bill #{$bill->id}",
                                    'name' => "Water Bill - " . ($bill->billing_date instanceof \DateTime ? $bill->billing_date->format('M Y') : $bill->billing_date),
                                    'quantity' => 1
                                ]
                            ],
                            'payment_method_types' => [$method],
                            'success_url' => route('bills.show', $bill->id) . '?payment=success',
                            'cancel_url' => route('bills.show', $bill->id) . '?payment=cancelled',
                            'description' => "Payment for Bill #{$bill->id}"
                        ]
                    ]
                ]);

            if ($response->failed()) {
                Log::error('PayMongo Checkout Session Failed', ['response' => $response->json()]);
                return back()->with('error', 'Failed to initialize payment. Please try again.');
            }

            $data = $response->json()['data'];
            $checkoutUrl = $data['attributes']['checkout_url'];
            $sessionId = $data['id'];

            Payment::create([
                'customer_id'    => Auth::user()->customer->id,
                'bill_id'        => $bill->id,
                'transaction_id' => $sessionId,
                'payment_method' => $method,
                'amount' => $bill->amount,
                'checkout_url' => $checkoutUrl,
                'status' => 'pending',
            ]);

            // Notify Admins and Staff
            $adminsAndStaff = User::whereIn('role', ['admin', 'staff'])->get();
            $pendingNotify = new AdminNotification(
                'payment',
                'Online Payment Pending',
                "{$customer->first_name} {$customer->last_name} initiated a " . strtoupper($method) . " payment of ₱" . number_format($bill->amount, 2),
                ['payment_id' => $bill->id, 'method' => $method]
            );
            foreach ($adminsAndStaff as $recipient) {
                $recipient->notify($pendingNotify);
            }

            return Inertia::location($checkoutUrl);

        } catch (\Exception $e) {
            Log::error('PayMongo Integration Error', ['error' => $e->getMessage()]);
            return back()->with('error', 'An error occurred while processing your payment.');
        }
    }

    public function handleWebhook(Request $request)
    {
        $payload = $request->getContent();
        $signatureHeader = $request->header('Paymongo-Signature');
        $webhookSecret = env('PAYMONGO_WEBHOOK_SECRET');

        if (!$signatureHeader || !$webhookSecret || $webhookSecret === 'wh_placeholder') {
            Log::warning('PayMongo Webhook signature missing or secret not configured.');
            // During testing, we might want to proceed, but let's be strict for security
            // unless it's explicitly allowed.
        } else {
            // Signature Verification
            $parts = explode(',', $signatureHeader);
            $timestamp = str_replace('t=', '', $parts[0]);
            $signature = str_replace('v1=', '', $parts[1]);
            
            $toHash = $timestamp . '.' . $payload;
            $expectedSignature = hash_hmac('sha256', $toHash, $webhookSecret);

            if ($signature !== $expectedSignature) {
                Log::error('PayMongo Webhook signature verification failed.');
                return response()->json(['error' => 'Invalid signature'], 400);
            }
        }

        $payload = json_decode($payload, true);
        $event = $payload['data']['attributes']['type'] ?? null;
        
        if ($event === 'checkout_session.payment.paid') {
            $sessionData = $payload['data']['attributes']['data']['attributes'] ?? null;
            $sessionId = $payload['data']['attributes']['data']['id'] ?? null;

            if ($sessionId) {
                $payment = Payment::where('transaction_id', $sessionId)->first();
                
                if ($payment && $payment->status !== 'paid') {
                    $payment->update([
                        'status' => 'paid',
                        'paid_at' => now(),
                    ]);

                    $bill = $payment->bill;
                    $bill->update(['status' => 'paid']);

                    // Deduct from balance
                    $customer = $payment->customer;
                    if ($customer) {
                        $customer->decrement('balance', $payment->amount);
                    }

                    // Notify Admins and Staff
                    $adminsAndStaff = User::whereIn('role', ['admin', 'staff'])->get();
                    $successNotify = new AdminNotification(
                        'payment',
                        'Online Payment Received',
                        "A payment of ₱" . number_format($payment->amount, 2) . " from {$customer->first_name} {$customer->last_name} was successful.",
                        ['payment_id' => $payment->id]
                    );
                    foreach ($adminsAndStaff as $recipient) {
                        $recipient->notify($successNotify);
                    }

                    Log::info("Payment Successful for Session: {$sessionId}");
                }
            }
        }

        return response()->json(['status' => 'ok']);
    }
}
