<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WaterRate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        $settings = WaterRate::current();

        return Inertia::render('admin/settings/index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'base_rate'            => ['required', 'numeric', 'min:0'],
            'rate_per_cubic_meter' => ['required', 'numeric', 'min:0'],
            'penalty_amount'       => ['required', 'numeric', 'min:0'],
            'billing_cycle_day'    => ['required', 'integer', 'min:1', 'max:28'],
            'barangay_name'        => ['required', 'string', 'max:255'],
            'barangay_address'     => ['required', 'string', 'max:500'],
            'contact_number'       => ['required', 'string', 'max:50'],
        ]);

        $settings = WaterRate::current();
        $settings->update($request->all());

        return back()->with('success', 'Settings updated successfully.');
    }
}
