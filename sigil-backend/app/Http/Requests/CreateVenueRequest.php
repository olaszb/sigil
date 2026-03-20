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
            'capacity' => 'required|numeric|max:2000',

            'layout' => 'nullable|array',
            'layout.sections' => 'required_with:layout|array',
            'layout.sections.*.name' => 'required|string|max:255',
            'layout.sections.*.type' => 'required|in:standing,seated',
            'layout.sections.*.capacity' => 'nullable|integer|min:1',
            'layout.sections.*.rows' => 'nullable|integer|min:1',
            'layout.sections.*.columns' => 'nullable|integer|min:1',
        ];
    }
}
