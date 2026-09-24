<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateCheckoutSessionRequest extends FormRequest
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
            'event_id' => 'required|exists:events,id',
            'selections' => 'required|array|min:1',
            'selections.*.ticket_type_id' => 'required|integer|exists:ticket_types,id',
            'selections.*.quantity' => 'required|integer|min:1',
            'selections.*.seats' => 'sometimes|array',
            'selections.*.seats.*' => ['string', 'regex:/^\d+-\d+$/'],
        ];
    }
}
