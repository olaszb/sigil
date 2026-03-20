<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketType extends Model
{

    protected $fillable = [
        'event_id',
        'name',
        'type',
        'section_name',
        'price',
        'quantity_available'
    ];

    public function event(){
        return $this->belongsTo(Event::class);
    }
}
