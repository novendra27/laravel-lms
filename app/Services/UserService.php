<?php

namespace App\Services;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class UserService
{
    /**
     * Create a new user with assigned role and optional avatar.
     */
    public function createUser(array $data, ?UploadedFile $avatar = null): User
    {
        return DB::transaction(function () use ($data, $avatar) {
            $avatarPath = null;

            if ($avatar) {
                $avatarPath = $avatar->store('avatars/users', 'public');
            }

            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'avatar' => $avatarPath,
            ]);

            $role = Role::where('name', $data['role'])->firstOrFail();
            $user->roles()->sync([$role->id]);

            return $user->load('roles');
        });
    }

    /**
     * Update an existing user's data, password, role, and avatar.
     *
     * @throws ValidationException
     */
    public function updateUser(User $user, array $data, ?UploadedFile $avatar = null, ?User $actor = null): User
    {
        // Anti Self-Demotion check
        if ($user->isAdmin() && $data['role'] !== 'admin') {
            $adminCount = User::whereHas('roles', fn ($q) => $q->where('name', 'admin'))->count();
            if ($adminCount <= 1) {
                throw ValidationException::withMessages([
                    'role' => 'Tidak dapat mencabut peran Administrator karena pengguna ini adalah satu-satunya Admin aktif di sistem.',
                ]);
            }
        }

        return DB::transaction(function () use ($user, $data, $avatar) {
            $userData = [
                'name' => $data['name'],
                'email' => $data['email'],
            ];

            if (! empty($data['password'])) {
                $userData['password'] = Hash::make($data['password']);
            }

            if ($avatar) {
                if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                    Storage::disk('public')->delete($user->avatar);
                }
                $userData['avatar'] = $avatar->store('avatars/users', 'public');
            }

            $user->update($userData);

            if (isset($data['role'])) {
                $role = Role::where('name', $data['role'])->firstOrFail();
                $user->roles()->sync([$role->id]);
            }

            return $user->load('roles');
        });
    }

    /**
     * Soft-delete user account (account deactivated, avatar kept for restore).
     *
     * @throws ValidationException
     */
    public function deleteUser(User $user, User $actor): bool
    {
        if ($user->id === $actor->id) {
            throw ValidationException::withMessages([
                'error' => 'Anda tidak dapat menghapus akun Anda sendiri.',
            ]);
        }

        return DB::transaction(function () use ($user) {
            return (bool) $user->delete();
        });
    }

    /**
     * Restore a soft-deleted user.
     */
    public function restoreUser(User $user): bool
    {
        return DB::transaction(function () use ($user) {
            return (bool) $user->restore();
        });
    }

    /**
     * Permanently delete user and their stored avatar file.
     *
     * @throws ValidationException
     */
    public function forceDeleteUser(User $user, User $actor): bool
    {
        if ($user->id === $actor->id) {
            throw ValidationException::withMessages([
                'error' => 'Anda tidak dapat menghapus permanen akun Anda sendiri.',
            ]);
        }

        return DB::transaction(function () use ($user) {
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            return (bool) $user->forceDelete();
        });
    }
}
