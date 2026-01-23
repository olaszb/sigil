<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    
    protected $fillable = [
        'user_id',
        'event_id',
        'ticket_type_id',
        'seat_number',
        'ticket_code',
        'status',
    ];

    public function event(){
        return $this->belongsTo(Event::class);
    }
    public function user(){
        return $this->belongsTo(User::class);
    }
}
