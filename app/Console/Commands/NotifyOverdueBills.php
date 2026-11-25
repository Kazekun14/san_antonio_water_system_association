<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\Models\Bill;
use App\Models\User;
use App\Notifications\AdminNotification;
use Carbon\Carbon;

class NotifyOverdueBills extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bills:notify-overdue';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Notify admins of overdue bills';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $overdueCount = Bill::where('status', 'unpaid')
            ->where('due_date', '<', Carbon::now())
            ->count();

        if ($overdueCount > 0) {
            $admins = User::whereIn('role', ['admin', 'staff'])->get();
            $notification = new AdminNotification(
                'alert',
                'Overdue Bills Detected',
                "There are currently {$overdueCount} unpaid bills past their due date.",
                ['count' => $overdueCount]
            );

            foreach ($admins as $admin) {
                $admin->notify($notification);
            }

            $this->info("Notified admins of {$overdueCount} overdue bills.");
        } else {
            $this->info("No overdue bills found.");
        }
    }
}
