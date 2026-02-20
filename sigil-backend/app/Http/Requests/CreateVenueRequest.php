<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateVenueRequest extends FormRequest
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
        return [
            'name' => 'required|string|max:50',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:50',
            'country' => 'required|string|max:50',
            'postal_code' => 'required|numeric|digits_between:3,5',
            'capacity' => 'required|numeric|max:2000'
        ];
    }
}
