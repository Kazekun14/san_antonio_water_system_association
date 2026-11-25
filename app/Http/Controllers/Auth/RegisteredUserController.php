<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'username'       => ['required', 'string', 'max:255', 'unique:users,username'],
            'password'       => ['required', 'confirmed', Rules\Password::defaults()],
            'first_name'     => ['required', 'string', 'max:255'],
            'last_name'      => ['required', 'string', 'max:255'],
            'household_address'  => ['required', 'string', 'max:500'],
            'email'          => ['nullable', 'string', 'email', 'max:255', 'unique:customers,email'],
            'phone_number'   => ['nullable', 'string', 'max:20', 'unique:customers,phone_number'],
        ]);

        $user = User::create([
            'username'       => $request->username,
            'password'       => Hash::make($request->password),
            'role'           => 'customer',
        ]);

        $customer = \App\Models\Customer::create([
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'household_address' => $request->household_address,
            'email'      => $request->email,
            'phone_number' => $request->phone_number,
            'user_id'    => $user->id,
            'access_type' => 'digital',
            'connection_status' => 'active',
            'meter_number' => 'PENDING-' . strtoupper(uniqid()),
            'initial_reading' => 0,
        ]);

        // Notify Admins
        $admins = User::where('role', 'admin')->get();
        $regNotify = new \App\Notifications\AdminNotification(
            'system',
            'New Resident Registered',
            "{$customer->first_name} {$customer->last_name} has registered a new account.",
            ['user_id' => $user->id]
        );
        foreach ($admins as $admin) {
            $admin->notify($regNotify);
        }

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard'));
    }
}