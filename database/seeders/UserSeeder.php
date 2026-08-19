<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::where('name', 'admin')->first();
        $instructorRole = Role::where('name', 'instructor')->first();
        $studentRole = Role::where('name', 'student')->first();

        // 1. Super Admin Account
        $admin = User::firstOrCreate(
            ['email' => 'admin@lms.test'],
            [
                'name' => 'Super Administrator',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $admin->roles()->syncWithoutDetaching([$adminRole->id]);

        // 2. Instructor Accounts
        $instructors = [
            [
                'name' => 'Budi Santoso',
                'email' => 'instructor@lms.test',
            ],
            [
                'name' => 'Dewi Lestari',
                'email' => 'dewi@lms.test',
            ],
        ];

        foreach ($instructors as $instData) {
            $instructor = User::firstOrCreate(
                ['email' => $instData['email']],
                [
                    'name' => $instData['name'],
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
            $instructor->roles()->syncWithoutDetaching([$instructorRole->id]);
        }

        // 3. Deterministic Student Accounts
        $students = [
            [
                'name' => 'Ahmad Rizky',
                'email' => 'student@lms.test',
            ],
            [
                'name' => 'Siti Nurhaliza',
                'email' => 'siti@lms.test',
            ],
            [
                'name' => 'Fajar Pratama',
                'email' => 'fajar@lms.test',
            ],
        ];

        foreach ($students as $studData) {
            $student = User::firstOrCreate(
                ['email' => $studData['email']],
                [
                    'name' => $studData['name'],
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
            $student->roles()->syncWithoutDetaching([$studentRole->id]);
        }

        // 4. Random Students for Pagination Testing
        User::factory(10)->create()->each(function (User $user) use ($studentRole) {
            $user->roles()->syncWithoutDetaching([$studentRole->id]);
        });
    }
}
