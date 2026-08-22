<?php

namespace App\Http\Controllers;

use App\Http\Requests\Profile\PasswordUpdateRequest;
use App\Http\Requests\Profile\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information and avatar.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        $user->fill($request->only('name', 'email'));

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            $user->avatar = $request->file('avatar')->store('avatars/users', 'public');
        }

        $user->save();

        return redirect()->route('profile.edit')->with('success', 'Profil Anda berhasil diperbarui.');
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(PasswordUpdateRequest $request): RedirectResponse
    {
        $request->user()->update([
            'password' => Hash::make($request->password),
        ]);

        return redirect()->route('profile.edit')->with('success', 'Kata sandi berhasil diperbarui.');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ], [
            'password.required' => 'Kata sandi wajib diisi untuk mengonfirmasi penghapusan akun.',
            'password.current_password' => 'Kata sandi yang Anda masukkan salah.',
        ]);

        $user = $request->user();

        Auth::logout();

        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->to('/')->with('info', 'Akun Anda berhasil dihapus.');
    }
}
