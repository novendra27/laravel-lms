<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
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
     * Determine whether the user can delete the user.
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
}
