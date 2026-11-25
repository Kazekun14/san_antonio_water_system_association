<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        } else {
            // By default, exclude admins from the general list to prevent accidental deletion, 
            // but let's show everything if requested or just allow all for now as per user request.
            // The user said "shows staff account not users/customers also", so they want everything.
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('username', 'like', "%{$search}%")
                  ->orWhereHas('customer', function($c) use ($search) {
                      $c->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                  });
            });
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(15)->withQueryString();

        return Inertia::render('admin/users/index', [
            'users'   => $users,
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/users/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'username'   => ['required', 'string', 'max:255', 'unique:users,username'],
            'role'       => ['required', 'string', 'in:admin,staff,customer'],
            'position'   => ['required_if:role,staff', 'nullable', 'in:administrator,encoder,meter_reader'],
            'password'   => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        User::create([
            'username'   => $request->username,
            'role'       => $request->role,
            'position'   => $this->resolvePosition($request->role, $request->position),
            'password'   => Hash::make($request->password),
        ]);

        return redirect()->route('admin.users.index')
            ->with('success', 'Staff account created successfully.');
    }

    public function edit(User $user)
    {
        return Inertia::render('admin/users/edit', ['user' => $user]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'username'   => ['required', 'string', 'max:255', 'unique:users,username,' . $user->id],
            'role'       => ['required', 'string', 'in:admin,staff,customer'],
            'position'   => ['required_if:role,staff', 'nullable', 'in:administrator,encoder,meter_reader'],
            'password'   => ['nullable', 'confirmed', Rules\Password::defaults()],
        ]);

        $data = $request->only('username', 'role');
        $data['position'] = $this->resolvePosition($request->role, $request->position);

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return redirect()->route('admin.users.index')
            ->with('success', 'User account updated successfully.');
    }

    public function destroy(User $user)
    {
        if ($user->role === 'admin') {
            return back()->with('error', 'Cannot delete an admin account.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User account deleted successfully.');
    }

    /**
     * Derive the position from the role so the database always stays
     * consistent: admins are Administrators, customers have no position,
     * and staff keep whatever position was chosen.
     */
    private function resolvePosition(string $role, ?string $position): ?string
    {
        return match ($role) {
            'admin'    => 'administrator',
            'customer' => null,
            default    => $position,
        };
    }
}
