<?php

namespace Tests\Feature;

use App\Models\ActivityLog;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use DatabaseTransactions;

    protected User $admin;

    protected User $instructor;

    protected User $student;

    protected Role $adminRole;

    protected Role $instructorRole;

    protected Role $studentRole;

    protected function setUp(): void
    {
        parent::setUp();

        // Find or create standard roles
        $this->adminRole = Role::firstOrCreate(
            ['name' => 'admin'],
            ['display_name' => 'Administrator', 'description' => 'Akses penuh ke seluruh sistem']
        );

        $this->instructorRole = Role::firstOrCreate(
            ['name' => 'instructor'],
            ['display_name' => 'Instruktur', 'description' => 'Pengajar kursus']
        );

        $this->studentRole = Role::firstOrCreate(
            ['name' => 'student'],
            ['display_name' => 'Siswa', 'description' => 'Peserta pembelajaran']
        );

        // Find or create test users
        $this->admin = User::firstOrCreate(
            ['email' => 'admin_test@lms.test'],
            ['name' => 'Super Admin Test', 'password' => bcrypt('password')]
        );
        $this->admin->roles()->syncWithoutDetaching([$this->adminRole->id]);

        $this->instructor = User::firstOrCreate(
            ['email' => 'instructor_test@lms.test'],
            ['name' => 'John Instructor Test', 'password' => bcrypt('password')]
        );
        $this->instructor->roles()->syncWithoutDetaching([$this->instructorRole->id]);

        $this->student = User::firstOrCreate(
            ['email' => 'student_test@lms.test'],
            ['name' => 'Alice Student Test', 'password' => bcrypt('password')]
        );
        $this->student->roles()->syncWithoutDetaching([$this->studentRole->id]);
    }

    public function test_guest_cannot_access_user_management(): void
    {
        $response = $this->get('/users');
        $response->assertRedirect('/login');
    }

    public function test_non_admin_cannot_access_user_management(): void
    {
        $response = $this->actingAs($this->student)->get('/users');
        $response->assertStatus(403);
    }

    public function test_admin_can_view_users_list(): void
    {
        $response = $this->actingAs($this->admin)->get('/users');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Users/Index')
            ->has('users.data')
            ->has('availableRoles')
        );
    }

    public function test_admin_can_create_new_user_with_role_and_it_records_activity_log(): void
    {
        $userData = [
            'name' => 'Budi Santoso',
            'email' => 'budi@example.com',
            'role' => 'instructor',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ];

        $response = $this->actingAs($this->admin)->post('/users', $userData);

        $response->assertRedirect('/users');
        $this->assertDatabaseHas('users', [
            'name' => 'Budi Santoso',
            'email' => 'budi@example.com',
        ]);

        $createdUser = User::where('email', 'budi@example.com')->first();
        $this->assertTrue($createdUser->hasRole('instructor'));

        // Verify Activity Log was recorded by UserObserver
        $this->assertDatabaseHas('activity_logs', [
            'event' => 'user.created',
            'user_id' => $this->admin->id,
            'subject_id' => $createdUser->id,
        ]);
    }

    public function test_admin_can_update_user_details_and_role(): void
    {
        $targetUser = User::factory()->create([
            'name' => 'Old Name',
            'email' => 'old@example.com',
        ]);
        $targetUser->roles()->attach($this->studentRole->id);

        $updateData = [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'role' => 'instructor',
        ];

        $response = $this->actingAs($this->admin)->put("/users/{$targetUser->id}", $updateData);

        $response->assertRedirect('/users');
        $this->assertDatabaseHas('users', [
            'id' => $targetUser->id,
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
        ]);

        $targetUser->refresh();
        $this->assertTrue($targetUser->hasRole('instructor'));

        // Verify Activity Log
        $this->assertDatabaseHas('activity_logs', [
            'event' => 'user.updated',
            'user_id' => $this->admin->id,
            'subject_id' => $targetUser->id,
        ]);
    }

    public function test_admin_can_soft_delete_a_user(): void
    {
        $targetUser = User::factory()->create([
            'name' => 'To Delete',
            'email' => 'delete@example.com',
        ]);
        $targetUser->roles()->attach($this->studentRole->id);

        $response = $this->actingAs($this->admin)->delete("/users/{$targetUser->id}");

        $response->assertRedirect('/users');

        // Check soft-deleted
        $this->assertSoftDeleted('users', [
            'id' => $targetUser->id,
        ]);

        // Verify activity log recorded
        $this->assertDatabaseHas('activity_logs', [
            'event' => 'user.deleted',
            'user_id' => $this->admin->id,
        ]);
    }

    public function test_admin_cannot_delete_their_own_account(): void
    {
        $response = $this->actingAs($this->admin)->delete("/users/{$this->admin->id}");

        // Should be forbidden by policy or validation
        $response->assertStatus(403);

        $this->assertNotSoftDeleted('users', [
            'id' => $this->admin->id,
        ]);
    }

    public function test_admin_can_restore_a_soft_deleted_user(): void
    {
        $targetUser = User::factory()->create([
            'name' => 'Trashed User',
            'email' => 'trashed@example.com',
        ]);
        $targetUser->roles()->attach($this->studentRole->id);
        $targetUser->delete(); // Soft-deleted

        $this->assertSoftDeleted('users', ['id' => $targetUser->id]);

        $response = $this->actingAs($this->admin)->post("/users/{$targetUser->id}/restore");

        $response->assertSessionHas('success');
        $this->assertNotSoftDeleted('users', ['id' => $targetUser->id]);

        // Verify restore activity log recorded
        $this->assertDatabaseHas('activity_logs', [
            'event' => 'user.restored',
            'user_id' => $this->admin->id,
            'subject_id' => $targetUser->id,
        ]);
    }

    public function test_admin_can_force_delete_a_soft_deleted_user_permanently(): void
    {
        $targetUser = User::factory()->create([
            'name' => 'Permanent Delete',
            'email' => 'permanent@example.com',
        ]);
        $targetUser->roles()->attach($this->studentRole->id);
        $targetUser->delete(); // Soft-deleted

        $response = $this->actingAs($this->admin)->delete("/users/{$targetUser->id}/force-delete");

        $response->assertSessionHas('success');

        // Completely removed from database
        $this->assertDatabaseMissing('users', [
            'id' => $targetUser->id,
        ]);

        // Verify permanent deletion activity log
        $this->assertDatabaseHas('activity_logs', [
            'event' => 'user.force_deleted',
            'user_id' => $this->admin->id,
        ]);
    }

    public function test_admin_can_view_activity_logs(): void
    {
        ActivityLog::record(
            event: 'test.event',
            subject: $this->student,
            description: 'Testing activity log viewer',
            properties: ['test' => true],
            userId: $this->admin->id
        );

        $response = $this->actingAs($this->admin)->get('/activity-logs');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('ActivityLogs/Index')
            ->has('logs.data')
            ->has('availableEvents')
        );
    }
}
