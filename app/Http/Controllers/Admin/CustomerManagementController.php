<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\User;
use App\Models\MeterReading;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class CustomerManagementController extends Controller
{
    public function index(Request $request)
    {
        $query = Customer::with('user');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhereRaw("CONCAT(first_name, ' ', last_name) like ?", ["%{$search}%"])
                  ->orWhereHas('user', function($u) use ($search) {
                      $u->where('username', 'like', "%{$search}%");
                  })
                  ->orWhere('household_address', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone_number', 'like', "%{$search}%")
                  ->orWhere('meter_number', 'like', "%{$search}%");
            });
        }

        if ($request->filled('zone')) {
            $query->where('purok', $request->zone);
        }

        if ($request->filled('access_type')) {
            $query->where('access_type', $request->access_type);
        }

        if ($request->filled('status')) {
            $query->where('connection_status', $request->status);
        }

        if ($request->filled('balance_type')) {
            $type = $request->balance_type;
            if ($type === 'overdue') {
                $query->where('balance', '>', 0);
            } elseif ($type === 'zero') {
                $query->where('balance', '=', 0);
            } elseif ($type === 'credit') {
                $query->where('balance', '<', 0);
            }
        }

        $customers = $query->orderBy('created_at', 'desc')->paginate(15)->withQueryString();
        
        // Get unique puroks for filtering
        $zones = Customer::whereNotNull('purok')->distinct()->pluck('purok')->sort()->values();

        return Inertia::render('admin/customers/index', [
            'customers' => $customers,
            'filters'   => $request->only(['search', 'zone', 'access_type', 'balance_type', 'status']),
            'zones'     => $zones,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/customers/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name'  => ['required', 'string', 'max:255'],
            'username'   => ['required_if:access_type,digital', 'nullable', 'string', 'max:255', 'unique:users,username'],
            'household_address' => ['required', 'string', 'max:500'],
            'purok'      => ['nullable', 'string', 'max:255'],
            'meter_number' => ['required', 'string', 'max:255', 'unique:customers,meter_number'],
            'email'      => ['nullable', 'string', 'email', 'max:255'],
            'initial_reading' => ['required', 'numeric', 'min:0'],
            'phone_number' => ['nullable', 'string', 'max:20', 'unique:customers,phone_number'],
            'access_type' => ['required', 'in:digital,physical_only'],
            'connection_status' => ['required', 'in:active,inactive'],
            'password'   => ['required_if:access_type,digital', 'nullable', 'confirmed', Rules\Password::defaults()],
        ]);

        $customer = Customer::create([
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'household_address' => $request->household_address,
            'purok'       => $request->purok,
            'meter_number' => $request->meter_number,
            'email'      => $request->email,
            'initial_reading' => $request->initial_reading,
            'phone_number' => $request->phone_number,
            'access_type' => $request->access_type,
            'connection_status' => $request->connection_status,
        ]);

        if ($request->access_type === 'digital') {
            $user = User::create([
                'username'   => $request->username,
                'password'   => Hash::make($request->password), // Password from form
                'role'       => 'customer',
            ]);

            $customer->update(['user_id' => $user->id]);
        }

        // Create initial meter reading
        MeterReading::create([
            'customer_id'         => $customer->id,
            'meter_reader_id'     => auth()->id(),
            'recorded_by_user_id' => auth()->id(),
            'meter_reading'       => $request->initial_reading,
            'reading_date'        => now(),
        ]);

        return redirect()->route('admin.customers.index')
            ->with('success', 'Customer record created successfully.');
    }

    public function edit(Customer $customer)
    {
        return Inertia::render('admin/customers/edit', ['customer' => $customer->load('user')]);
    }

    public function show(Customer $customer)
    {
        return Inertia::render('admin/customers/show', [
            'customer' => $customer->load('user'),
            'bills' => $customer->bills()->orderBy('billing_date', 'desc')->get(),
            'payments' => $customer->payments()->orderBy('paid_at', 'desc')->get(),
            'readings' => $customer->meterReadings()->orderBy('reading_date', 'asc')->get(),
        ]);
    }

    public function update(Request $request, Customer $customer)
    {
        $rules = [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name'  => ['required', 'string', 'max:255'],
            'household_address' => ['required', 'string', 'max:500'],
            'purok'      => ['nullable', 'string', 'max:255'],
            'meter_number' => ['required', 'string', 'max:255', 'unique:customers,meter_number,' . $customer->id],
            'email'      => ['nullable', 'string', 'email', 'max:255'],
            'initial_reading' => ['required', 'numeric', 'min:0'],
            'phone_number' => ['nullable', 'string', 'max:20', 'unique:customers,phone_number,' . $customer->id],
            'access_type' => ['required', 'in:digital,physical_only'],
            'connection_status' => ['required', 'in:active,inactive'],
        ];
        
        if ($request->access_type === 'digital') {
            if (!$customer->user_id) {
                $rules['username'] = ['required', 'string', 'max:255', 'unique:users,username'];
                $rules['password'] = ['required', 'confirmed', Rules\Password::defaults()];
            } else {
                $rules['username'] = ['required', 'string', 'max:255', 'unique:users,username,' . $customer->user_id];
                
                $hasPasswordAttempt = $request->filled('current_password') || 
                                     $request->filled('password') || 
                                     $request->filled('password_confirmation');
                
                if ($hasPasswordAttempt) {
                    $rules['current_password'] = ['required', function ($attribute, $value, $fail) use ($customer) {
                        if (!Hash::check($value, $customer->user->password)) {
                            $fail('The customer\'s current password is incorrect.');
                        }
                    }];
                    $rules['password'] = ['required', 'confirmed', Rules\Password::defaults()];
                    $rules['password_confirmation'] = ['required'];
                }
            }
        }

        $request->validate($rules);

        if ($request->access_type === 'digital') {
            if (!$customer->user_id) {
                $user = User::create([
                    'username'   => $request->username,
                    'password'   => Hash::make($request->password),
                    'role'       => 'customer',
                ]);
                $customer->user_id = $user->id;
            } else {
                $userData = [
                    'username' => $request->username,
                ];
                if ($request->filled('password')) {
                    $userData['password'] = Hash::make($request->password);
                }
                $customer->user->update($userData);
            }
        }

        $customer->update([
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'household_address' => $request->household_address,
            'purok'       => $request->purok,
            'meter_number' => $request->meter_number,
            'email'      => $request->email,
            'initial_reading' => $request->initial_reading,
            'phone_number' => $request->phone_number,
            'access_type' => $request->access_type,
            'connection_status' => $request->connection_status,
            'user_id' => $customer->user_id,
        ]);

        return redirect()->route('admin.customers.index')
            ->with('success', 'Customer record updated successfully.');
    }

    public function destroy(Customer $customer)
    {
        $user = $customer->user;
        
        $customer->delete();

        if ($user) {
            $user->delete();
        }

        return redirect()->route('admin.customers.index')
            ->with('success', 'Customer record and associated account deleted successfully.');
    }

    public function linkAccount(Request $request, Customer $customer)
    {
        $request->validate([
            'username' => ['required', 'string', 'max:255', 'unique:users,username'],
            'email'    => ['nullable', 'string', 'email', 'max:255', 'unique:customers,email,' . $customer->id],
            'phone_number' => ['nullable', 'string', 'max:20', 'unique:customers,phone_number,' . $customer->id],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'username'   => $request->username,
            'password'   => Hash::make($request->password),
            'role'       => 'customer',
        ]);

        $customer->update([
            'user_id' => $user->id,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'access_type' => 'digital'
        ]);

        return redirect()->route('admin.customers.index')
            ->with('success', 'Online account linked to customer successfully.');
    }
}
