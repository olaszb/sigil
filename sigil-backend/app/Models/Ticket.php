<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    
    protected $fillable = [
        'user_id',
        'event_id',
        'ticket_type_id',
        'section',
        'row',
        'column',
        'ticket_code',
        'status',
        'held_until'
    ];

    protected $casts = [
        'held_until' => 'datetime',
    ];

    public function event(){
        return $this->belongsTo(Event::class);
    }
    public function user(){
        return $this->belongsTo(User::class);
    }

    public function ticketType(){
        return $this->belongsTo(TicketType::class);
    }
}
