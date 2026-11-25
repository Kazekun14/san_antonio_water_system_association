<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Bill;
use NotificationChannels\WebPush\WebPushMessage;
use NotificationChannels\WebPush\WebPushChannel;

class NewBillNotification extends Notification
{
    use Queueable;

    public $bill;

    /**
     * Create a new notification instance.
     */
    public function __construct(Bill $bill)
    {
        $bill->load('customer');
        $this->bill = $bill;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return [WebPushChannel::class, 'database'];
    }

    /**
     * Get the web push representation of the notification.
     */
    public function toWebPush($notifiable, $notification)
    {
        return (new WebPushMessage)
            ->title('New Water Bill Generated')
            ->icon('/logo.png')
            ->body("Hello {$this->bill->customer->first_name}, your bill for " . $this->bill->billing_date->format('M Y') . " of ₱" . number_format($this->bill->amount, 2) . " is now available.")
            ->action('View Bill', 'view_bill', route('bills.show', $this->bill->id))
            ->data(['id' => $this->bill->id]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'bill_id' => $this->bill->id,
            'amount'  => $this->bill->amount,
            'message' => 'New bill generated for ' . $this->bill->billing_date->format('M Y'),
        ];
    }
}
