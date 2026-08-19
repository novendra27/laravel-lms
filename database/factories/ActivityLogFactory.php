<?php

namespace Database\Factories;

use App\Models\ActivityLog;
use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ActivityLog>
 */
class ActivityLogFactory extends Factory
{
    protected $model = ActivityLog::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory()->admin(),
            'event' => 'course.created',
            'subject_type' => Course::class,
            'subject_id' => Course::factory(),
            'description' => fake()->sentence(),
            'properties' => ['ip' => fake()->ipv4()],
        ];
    }
}
