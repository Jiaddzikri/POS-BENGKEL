<?php

namespace App\Http\Requests\User;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserAddRequestValidator extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {

        $user = auth()->user();

        $validationTenant = [
            'required',
            'uuid',
            'exists:tenants,id'
        ];


        return [
            'name' => [
                'required',
                'string',
                'max:255'
            ],
            'email' => [
                'required',
                'string',
                'email',
                'lowercase',
                'max:255',
                'unique:' . User::class . ',email'
            ],
            'password' => [
                'required',
                'string',
                'confirmed',
                Password::default()
            ],
            'role' => [
                'required',
                'in:super_admin,admin,manager,cashier'
            ],
            'tenant_id' => $user->role !== 'super_admin' ? '' : $validationTenant
        ];
    }
}
