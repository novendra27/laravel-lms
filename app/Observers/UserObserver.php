<?php

namespace App\Observers;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserObserver
{
    /**
     * Handle the User "created" event.
     */
    public function created(User $user): void
    {
        $actorId = Auth::id() ?? $user->id;

        ActivityLog::record(
            event: 'user.created',
            subject: $user,
            description: "Pengguna baru '{$user->name}' ({$user->email}) telah dibuat.",
            properties: [
                'name' => $user->name,
                'email' => $user->email,
            ],
            userId: $actorId
        );
    }

    /**
     * Handle the User "updated" event.
     */
    public function updated(User $user): void
    {
        // Don't log if only remember_token, deleted_at, or updated_at was updated
        $dirty = $user->getDirty();
        unset($dirty['remember_token'], $dirty['updated_at'], $dirty['deleted_at']);

        if (empty($dirty)) {
            return;
        }

        $actorId = Auth::id() ?? $user->id;

        ActivityLog::record(
            event: 'user.updated',
            subject: $user,
            description: "Data pengguna '{$user->name}' telah diperbarui.",
            properties: [
                'changed_fields' => array_keys($dirty),
                'old' => array_intersect_key($user->getOriginal(), $dirty),
                'new' => $dirty,
            ],
            userId: $actorId
        );
    }

    /**
     * Handle the User "deleted" event (soft-delete and force-delete).
     */
    public function deleted(User $user): void
    {
        $actorId = Auth::id() ?? $user->id;
        $isPermanent = $user->isForceDeleting();

        ActivityLog::record(
            event: $isPermanent ? 'user.force_deleted' : 'user.deleted',
            subject: $user,
            description: $isPermanent
                ? "Pengguna '{$user->name}' ({$user->email}) telah dihapus secara permanen dari sistem."
                : "Pengguna '{$user->name}' ({$user->email}) telah dinonaktifkan (soft-delete).",
            properties: [
                'name' => $user->name,
                'email' => $user->email,
                'is_permanent' => $isPermanent,
            ],
            userId: $actorId
        );
    }

    /**
     * Handle the User "restored" event.
     */
    public function restored(User $user): void
    {
        $actorId = Auth::id() ?? $user->id;

        ActivityLog::record(
            event: 'user.restored',
            subject: $user,
            description: "Pengguna '{$user->name}' ({$user->email}) telah dipulihkan kembali ke sistem.",
            properties: [
                'name' => $user->name,
                'email' => $user->email,
            ],
            userId: $actorId
        );
    }
}
