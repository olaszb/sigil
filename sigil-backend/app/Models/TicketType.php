<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketType extends Model
{

    protected $fillable = [
        'name',
        'price',
    ];

    public function event(){
        return $this->belongsTo(Event::class);
    }
}
