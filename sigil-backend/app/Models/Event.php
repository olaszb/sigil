<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        'venue_id',
        'organizer_id',
        'title',
        'description',
        'start_time',
        'image_url',
        'slug',
    ];

    public function tickets(){
        return $this->hasMany(Ticket::class);
    }

    public function venue(){
        return $this->belongsTo(Venue::class);
    }

    public function users(){
        return $this->belongsToMany(User::class, 'event_user_status')->withPivot('status')->withTimestamps();
    }
}
