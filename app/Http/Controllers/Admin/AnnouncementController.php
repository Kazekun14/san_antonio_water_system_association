<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class AnnouncementController extends Controller
{
    public function index()
    {
        $announcements = Announcement::with('user')->orderByDesc('created_at')->paginate(10);
        return Inertia::render('admin/announcements/index', [
            'announcements' => $announcements
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/announcements/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'status' => 'required|in:active,inactive',
            'is_pinned' => 'required|boolean',
            'expires_at' => 'nullable|date',
        ]);

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('announcements', 'public');
        }

        $validated['posted_by'] = $request->user()->id;

        $announcement = Announcement::create($validated);

        // Notify Admins and Staff
        $adminsAndStaff = \App\Models\User::whereIn('role', ['admin', 'staff'])->get();
        $alertNotify = new \App\Notifications\AdminNotification(
            'system',
            'New Announcement Posted',
            $announcement->title,
            ['announcement_id' => $announcement->id]
        );
        foreach ($adminsAndStaff as $recipient) {
            $recipient->notify($alertNotify);
        }

        return redirect()->route('admin.announcements.index')->with('success', 'Announcement created successfully.');
    }

    public function edit(Announcement $announcement)
    {
        return Inertia::render('admin/announcements/edit', [
            'announcement' => $announcement
        ]);
    }

    public function update(Request $request, Announcement $announcement)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'status' => 'required|in:active,inactive',
            'is_pinned' => 'required|boolean',
            'expires_at' => 'nullable|date',
        ]);

        if ($request->hasFile('image')) {
            if ($announcement->image_path) {
                Storage::disk('public')->delete($announcement->image_path);
            }
            $validated['image_path'] = $request->file('image')->store('announcements', 'public');
        }

        $announcement->update($validated);

        return redirect()->route('admin.announcements.index')->with('success', 'Announcement updated successfully.');
    }

    public function destroy(Announcement $announcement)
    {
        if ($announcement->image_path) {
            Storage::disk('public')->delete($announcement->image_path);
        }
        $announcement->delete();

        return redirect()->route('admin.announcements.index')->with('success', 'Announcement deleted successfully.');
    }
}
