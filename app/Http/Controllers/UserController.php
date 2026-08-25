<?php

namespace App\Http\Controllers;

use App\Http\Requests\Users\StoreUserRequest;
use App\Http\Requests\Users\UpdateUserRequest;
use App\Models\Role;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a paginated listing of users with search and role filter.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', User::class);

        $query = User::with('roles')->latest();

        // Search Filter (name or email)
        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Role Filter
        if ($request->filled('role')) {
            $roleName = $request->string('role');
            $query->whereHas('roles', function ($q) use ($roleName) {
                $q->where('name', $roleName);
            });
        }

        $users = $query->paginate(10)->withQueryString();

        $availableRoles = Role::select('id', 'name', 'display_name', 'description')->get();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role']),
            'availableRoles' => $availableRoles,
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(StoreUserRequest $request, UserService $userService): RedirectResponse
    {
        $user = $userService->createUser(
            $request->validated(),
            $request->file('avatar')
        );

        return redirect()->route('users.index')->with(
            'success',
            "Pengguna baru '{$user->name}' berhasil ditambahkan ke sistem."
        );
    }

    /**
     * Update the specified user in storage.
     */
    public function update(UpdateUserRequest $request, User $user, UserService $userService): RedirectResponse
    {
        Gate::authorize('update', $user);

        $userService->updateUser(
            $user,
            $request->validated(),
            $request->file('avatar'),
            $request->user()
        );

        return redirect()->route('users.index')->with(
            'success',
            "Data pengguna '{$user->name}' berhasil diperbarui."
        );
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(Request $request, User $user, UserService $userService): RedirectResponse
    {
        Gate::authorize('delete', $user);

        $userName = $user->name;
        $userService->deleteUser($user, $request->user());

        return redirect()->route('users.index')->with(
            'success',
            "Pengguna '{$userName}' berhasil dihapus dari sistem."
        );
    }
}
