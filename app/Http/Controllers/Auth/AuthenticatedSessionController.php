<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Show the portal login page.
     */
    public function createPortal(Request $request): Response
    {
        return Inertia::render('auth/portal-login', [
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $user = Auth::user();

        // Restrict this login page to customers only
        if ($user->role !== 'customer') {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return back()->withErrors([
                'username' => 'This login is for residents only. Please use the official portal.',
            ]);
        }

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Handle an incoming portal authentication request.
     */
    public function storePortal(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $user = Auth::user();

        // Restrict this login page to admin and staff only
        if (!in_array($user->role, ['admin', 'staff'])) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return back()->withErrors([
                'username' => 'Unauthorized. This portal is for authorized personnel only.',
            ]);
        }

        // Enforce that the user is logging into the correct portal tab
        $intendedRole = $request->input('intended_role');
        if ($user->role !== $intendedRole) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            $portalLabel = $intendedRole === 'admin' ? 'Administrator' : 'Staff';

            return back()->withErrors([
                'username' => "These credentials do not match the {$portalLabel} portal.",
            ]);
        }

        $request->session()->regenerate();

        return match($user->role) {
            'admin' => redirect()->intended(route('admin.dashboard')),
            'staff' => redirect()->intended(route('staff.dashboard')),
            default => redirect()->intended(route('dashboard', absolute: false)),
        };
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
