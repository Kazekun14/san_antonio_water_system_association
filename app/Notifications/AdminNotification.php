<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AdminNotification extends Notification
{
    use Queueable;

    public $type;
    public $title;
    public $message;
    public $metadata;

    /**
     * Create a new notification instance.
     */
    public function __construct($type, $title, $message, $metadata = [])
    {
        $this->type = $type;
        $this->title = $title;
        $this->message = $message;
        $this->metadata = $metadata;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => $this->type,
            'title' => $this->title,
            'message' => $this->message,
            'metadata' => $this->metadata,
        ];
    }
}
