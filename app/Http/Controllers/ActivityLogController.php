<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    /**
     * Display a paginated listing of system audit activity logs.
     */
    public function index(Request $request): Response
    {
        $query = ActivityLog::with('user')->latest();

        // Search Filter (description or user name)
        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        // Event Filter
        if ($request->filled('event')) {
            $query->where('event', $request->string('event'));
        }

        $logs = $query->paginate(15)->withQueryString();

        $availableEvents = ActivityLog::select('event')
            ->distinct()
            ->pluck('event')
            ->values();

        return Inertia::render('ActivityLogs/Index', [
            'logs' => $logs,
            'filters' => $request->only(['search', 'event']),
            'availableEvents' => $availableEvents,
        ]);
    }
}
