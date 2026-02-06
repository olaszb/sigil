<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateEventRequest extends FormRequest
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
            'venue_id' => 'required|exists:venues,id',
            'organizer_id' => 'required|exists:users,id',
            'title' => 'required|max:255',
            'description' => 'required|max:1000',
            'start_time' => 'required|date',
            'image_url' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ];
    }
}
