<?php

namespace App\Http\Requests\Variant;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVariantItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        // Set ke `true` jika semua pengguna bisa melakukan request ini.
        // Atau tambahkan logika otorisasi Anda di sini.
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $uniqueRule = Rule::unique('variant_items', 'sku');

        if ($this->input('id')) {
            $uniqueRule->ignore($this->input('id'));
        }

        return [
            'sku' => [
                'required',
                'string',
                'max:100',
                $uniqueRule
            ],

            'name' => [
                'required',
                'string',
                'max:255'
            ],
            'additional_price' => [
                'required',
                'numeric',
                'min:0'
            ],

            'stock' => [
                'required',
                'numeric',
                'min:0'
            ],

            'minimum_stock' => [
                'required',
                'numeric',
                'min:0'
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'sku.required' => 'SKU wajib diisi.',
            'sku.unique' => 'SKU :input sudah digunakan, harap gunakan SKU lain.',
            'name.required' => 'Nama varian wajib diisi.',
            'stock.required' => 'Stok wajib diisi.',
            'stock.numeric' => 'Stok harus berupa angka.',
            'minimum_stock.required' => 'Stok minimum wajib diisi.',
            'minimum_stock.numeric' => 'Stok minimum harus berupa angka.',
            'additional_price.required' => 'additional price wajib diisi',
            'additional_price.numeric' => 'additional price harus berupa angka'
        ];
    }

    protected function prepareForValidation(): void
    {

    }
}