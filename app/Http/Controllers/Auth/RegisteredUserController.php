<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(RegisterRequest $request): RedirectResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Auto-assign 'student' role
        $studentRole = Role::firstOrCreate(
            ['name' => 'student'],
            ['display_name' => 'Peserta', 'description' => 'Dapat mendaftar kursus, belajar, dan mengumpulkan tugas']
        );
        $user->roles()->syncWithoutDetaching([$studentRole->id]);

        event(new Registered($user));

        Auth::login($user);

        return redirect()->route('dashboard')->with(
            'success',
            'Pendaftaran berhasil! Selamat datang di LMS, '.$user->name.'.'
        );
    }
}
