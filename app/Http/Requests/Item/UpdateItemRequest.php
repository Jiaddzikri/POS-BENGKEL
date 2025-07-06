<?php

namespace App\Http\Requests\Item;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateItemRequest extends FormRequest
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
        $rules = [
            'item_name' => [
                'required',
                'string',
                'max:255',
                'min:3'
            ],
            'category_id' => [
                'required',
                'string',

            ],
            'description' => [
                'required',
                'string',
                'min:5',
                'max:1000'
            ],
            'purchase_price' => [
                'required',
                'numeric',
                'min:0',
                'max:999999999.99'
            ],
            'selling_price' => [
                'required',
                'numeric',
                'min:0',
                'max:999999999.99'
            ],
            'brand' => [
                'required',
                'string',
                'max:100',
                'min:2'
            ],
            'variants' => [
                'nullable',
                'array'
            ],

            'new_image' => [
                'nullable',
                'image',
                'mimes:jpeg,png,jpg,gif,webp',
                'max:2048'
            ]
        ];

        foreach ($this->input('variants', []) as $index => $variant) {

            $uniqueRule = Rule::unique('variant_items', 'sku');

            if (!empty($variant['id'])) {
                $uniqueRule->ignore($variant['id']);
            }

            $rules["variants.{$index}.sku"] = ['required', 'string', 'max:100', $uniqueRule];
            $rules["variants.{$index}.name"] = ['required', 'string', 'max:255'];
            $rules["variants.{$index}.stock"] = ['required', 'numeric'];
            $rules["variants.{$index}.minimum_stock"] = ['required', 'numeric'];

            $rules["variants.{$index}.additional_price"] = ['nullable', 'numeric'];
        }

        return $rules;
    }



    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'item_name.required' => 'Nama produk harus diisi.',
            'item_name.string' => 'Nama produk harus berupa teks.',
            'item_name.max' => 'Nama produk maksimal 255 karakter.',
            'item_name.min' => 'Nama produk minimal 3 karakter.',
            'item_name.unique' => 'Nama produk sudah digunakan.',

            'category_id.required' => 'Kategori harus dipilih.',
            'category_id.integer' => 'Kategori harus berupa angka.',
            'category_id.exists' => 'Kategori yang dipilih tidak valid.',

            'description.required' => 'Deskripsi produk harus diisi.',
            'description.string' => 'Deskripsi harus berupa teks.',
            'description.min' => 'Deskripsi minimal 10 karakter.',
            'description.max' => 'Deskripsi maksimal 1000 karakter.',

            'price.required' => 'Harga produk harus diisi.',
            'price.numeric' => 'Harga harus berupa angka.',
            'price.min' => 'Harga tidak boleh negatif.',
            'price.max' => 'Harga terlalu besar.',

            'brand.required' => 'Brand harus diisi.',
            'brand.string' => 'Brand harus berupa teks.',
            'brand.max' => 'Brand maksimal 100 karakter.',
            'brand.min' => 'Brand minimal 2 karakter.',

            'variants.array' => 'Varian harus berupa array.',

            'new_image.image' => 'File harus berupa gambar.',
            'new_image.mimes' => 'Gambar harus berformat: jpeg, png, jpg, gif, atau webp.',
            'new_image.max' => 'Ukuran gambar maksimal 2MB.'
        ];


    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('price')) {
            $this->merge([
                'price' => (float) str_replace(['Rp', '.', ','], '', $this->price)
            ]);
        }
    }
}