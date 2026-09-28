<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CheckoutSession extends Model
{
    protected $fillable = [
        'user_id',
        'event_id',
        'stripe_session_id',
        'stripe_payment_intent_id',
        'selections',
        'amount_total',
        'currency',
        'status',
        'completed_at',
    ];

    protected $casts = [
        'selections' => 'array',
        'completed_at' => 'datetime',
    ];
}
