<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Super Admin bypasses all policy checks except self-deletion.
     */
    public function before(User $user, string $ability): ?bool
    {
        if (in_array($ability, ['delete', 'forceDelete'])) {
            return null;
        }

        return $user->isAdmin() ? true : null;
    }

    /**
     * Determine whether the user can view any users list.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->hasPermission('users.view');
    }

    /**
     * Determine whether the user can view the user profile.
     */
    public function view(User $user, User $model): bool
    {
        return $user->isAdmin()
            || $user->id === $model->id
            || $user->hasPermission('users.view');
    }

    /**
     * Determine whether the user can create users.
     */
    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->hasPermission('users.create');
    }

    /**
     * Determine whether the user can update the user.
     */
    public function update(User $user, User $model): bool
    {
        return $user->isAdmin()
            || $user->id === $model->id
            || $user->hasPermission('users.edit');
    }

    /**
     * Determine whether the user can soft-delete the user.
     * Prevents self-deletion.
     */
    public function delete(User $user, User $model): bool
    {
        // Cannot delete self
        if ($user->id === $model->id) {
            return false;
        }

        return $user->isAdmin() || $user->hasPermission('users.delete');
    }

    /**
     * Determine whether the user can restore a soft-deleted user.
     */
    public function restore(User $user, User $model): bool
    {
        return $user->isAdmin() || $user->hasPermission('users.delete');
    }

    /**
     * Determine whether the user can permanently force-delete the user.
     */
    public function forceDelete(User $user, User $model): bool
    {
        // Cannot force delete self
        if ($user->id === $model->id) {
            return false;
        }

        return $user->isAdmin() || $user->hasPermission('users.delete');
    }
}
