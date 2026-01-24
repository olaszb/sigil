<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;
    protected $fillable = [
        'venue_id',
        'organizer_id',
        'title',
        'description',
        'start_time',
        'image_url',
    ];

    public function tickets(){
        return $this->hasMany(Ticket::class);
    }
}
