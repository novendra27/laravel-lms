<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Roles
        $admin = Role::firstOrCreate(
            ['name' => 'admin'],
            ['display_name' => 'Administrator', 'description' => 'Akses penuh ke seluruh sistem']
        );

        $instructor = Role::firstOrCreate(
            ['name' => 'instructor'],
            ['display_name' => 'Instruktur', 'description' => 'Dapat membuat & mengelola kursus serta menilai tugas']
        );

        $student = Role::firstOrCreate(
            ['name' => 'student'],
            ['display_name' => 'Peserta', 'description' => 'Dapat mendaftar kursus, belajar, dan mengumpulkan tugas']
        );

        // 2. Granular Permissions defined in context.md
        $permissions = [
            // User Management
            ['name' => 'users.view',        'display_name' => 'Lihat User',         'group' => 'User Management'],
            ['name' => 'users.create',      'display_name' => 'Buat User',          'group' => 'User Management'],
            ['name' => 'users.edit',        'display_name' => 'Edit User',          'group' => 'User Management'],
            ['name' => 'users.delete',      'display_name' => 'Hapus User',         'group' => 'User Management'],

            // Course Management
            ['name' => 'courses.view',      'display_name' => 'Lihat Course',       'group' => 'Course Management'],
            ['name' => 'courses.create',    'display_name' => 'Buat Course',        'group' => 'Course Management'],
            ['name' => 'courses.edit',      'display_name' => 'Edit Course',        'group' => 'Course Management'],
            ['name' => 'courses.delete',    'display_name' => 'Hapus Course',       'group' => 'Course Management'],

            // Lesson Management
            ['name' => 'lessons.create',    'display_name' => 'Buat Lesson',        'group' => 'Lesson Management'],
            ['name' => 'lessons.edit',      'display_name' => 'Edit Lesson',        'group' => 'Lesson Management'],
            ['name' => 'lessons.delete',    'display_name' => 'Hapus Lesson',       'group' => 'Lesson Management'],

            // Assignment & Submissions
            ['name' => 'assignments.manage', 'display_name' => 'Kelola Tugas',      'group' => 'Assignment'],
            ['name' => 'submissions.grade', 'display_name' => 'Nilai Tugas',        'group' => 'Assignment'],

            // Reports & Settings
            ['name' => 'activity_logs.view', 'display_name' => 'Lihat Audit Log',    'group' => 'Reports & Audit'],
            ['name' => 'settings.manage',   'display_name' => 'Kelola Pengaturan',  'group' => 'System Settings'],
        ];

        foreach ($permissions as $p) {
            Permission::firstOrCreate(
                ['name' => $p['name']],
                ['display_name' => $p['display_name'], 'group' => $p['group']]
            );
        }

        // 3. Assign permissions to Admin (All permissions)
        $admin->permissions()->sync(Permission::all()->pluck('id'));

        // 4. Assign permissions to Instructor
        $instructorPermissions = Permission::whereIn('name', [
            'courses.view',
            'courses.create',
            'courses.edit',
            'courses.delete',
            'lessons.create',
            'lessons.edit',
            'lessons.delete',
            'assignments.manage',
            'submissions.grade',
        ])->pluck('id');

        $instructor->permissions()->sync($instructorPermissions);
    }
}
