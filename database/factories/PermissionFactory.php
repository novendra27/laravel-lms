<?php

namespace Database\Factories;

use App\Models\Permission;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Permission>
 */
class PermissionFactory extends Factory
{
    protected $model = Permission::class;

    public function definition(): array
    {
        $group = fake()->randomElement(['User Management', 'Course Management', 'Lesson Management', 'Assignment', 'Reports', 'Settings']);
        $action = fake()->randomElement(['view', 'create', 'edit', 'delete', 'manage']);
        $entity = strtolower(fake()->unique()->word());

        return [
            'name' => "{$entity}.{$action}",
            'display_name' => ucfirst($action).' '.ucfirst($entity),
            'group' => $group,
        ];
    }
}
