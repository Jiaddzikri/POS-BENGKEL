<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class UserUpdateRequestValidator extends FormRequest
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
            'role' => [
                'required',
                'in:super_admin,admin,manager,employee'
            ],
            'tenant_id' => $user->role !== 'super_admin' ? ['nullable'] : $validationTenant
        ];
    }
}
