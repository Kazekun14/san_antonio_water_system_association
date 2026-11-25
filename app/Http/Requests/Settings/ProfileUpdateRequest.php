<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $user = $this->user();
        if ($user->role === 'customer') {
            $customer = $user->customer;
            return [
                'first_name' => ['required', 'string', 'max:255'],
                'last_name'  => ['required', 'string', 'max:255'],
                'household_address' => ['required', 'string', 'max:255'],
                'phone_number' => ['nullable', 'string', 'max:20', Rule::unique('customers', 'phone_number')->ignore($customer ? $customer->id : null)],
                'email'      => [
                    'nullable',
                    'string',
                    'lowercase',
                    'email',
                    'max:255',
                    Rule::unique('customers', 'email')->ignore($customer ? $customer->id : null),
                ],
            ];
        }

        return [
            'username' => [
                'required',
                'string',
                'max:255',
                Rule::unique('users', 'username')->ignore($user->id),
            ],
        ];
    }
}
