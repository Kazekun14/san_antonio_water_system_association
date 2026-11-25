<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\AnnouncementView;
use Illuminate\Http\Request;

class PublicAnnouncementController extends Controller
{
    public function index()
    {
        $announcements = Announcement::active()
            ->pinnedFirst()
            ->latest()
            ->take(6)
            ->get()
            ->map(function ($announcement) {
                return [
                    'id' => $announcement->id,
                    'title' => $announcement->title,
                    'content' => $announcement->content,
                    'image' => $announcement->image_path ? asset('storage/' . $announcement->image_path) : null,
                    'is_pinned' => $announcement->is_pinned,
                    'created_at' => $announcement->created_at->format('M d, Y'),
                ];
            });

        return response()->json($announcements);
    }

    public function markAsRead(Request $request, Announcement $announcement)
    {
        if ($request->user()) {
            AnnouncementView::updateOrCreate([
                'announcement_id' => $announcement->id,
                'user_id' => $request->user()->id,
            ], [
                'viewed_at' => now(),
            ]);
        }

        return response()->json(['success' => true]);
    }
}
