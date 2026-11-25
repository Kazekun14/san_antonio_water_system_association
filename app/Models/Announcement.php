<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    protected $fillable = [
        'title',
        'content',
        'image_path',
        'status',
        'is_pinned',
        'expires_at',
        'posted_by',
    ];

    protected $casts = [
        'is_pinned' => 'boolean',
        'expires_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'posted_by');
    }

    public function views()
    {
        return $this->hasMany(AnnouncementView::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active')
            ->where(function ($q) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            });
    }

    public function scopePinnedFirst($query)
    {
        return $query->orderByDesc('is_pinned')->orderByDesc('created_at');
    }
}
