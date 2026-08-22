import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Users,
    BookOpen,
    GraduationCap,
    BookOpenCheck,
    CheckSquare,
    Clock,
    Trophy,
    Activity,
    Calendar,
    ArrowRight,
    Sparkles,
    CheckCircle2,
    PlusCircle,
    PlayCircle,
} from 'lucide-react';
import AppLayout from '../Layouts/AppLayout';
import Card from '../Components/UI/Card';
import Badge from '../Components/UI/Badge';
import Button from '../Components/UI/Button';

export default function Dashboard({ stats = {} }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <AppLayout title="Dashboard">
            <Head title="Dashboard" />

            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl mb-8 border border-indigo-700/40">
                <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-5 w-5 text-indigo-300" />
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                                Selamat Datang Kembali
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                            Halo, {user?.name}! 👋
                        </h2>
                        <p className="mt-1 text-xs sm:text-sm text-indigo-100/80 max-w-xl">
                            {user?.is_admin
                                ? 'Kelola seluruh aktivitas pengguna, materi kursus, dan pantau log sistem secara real-time.'
                                : user?.is_instructor
                                ? 'Pantau performa kursus Anda, periksa progres siswa, dan nilai submission tugas yang masuk.'
                                : 'Lanjutkan perjalanan belajarmu hari ini dan raih sertifikat kompetensi baru!'}
                        </p>
                    </div>

                    {user?.is_instructor && (
                        <Link href="/courses/create">
                            <Button variant="primary" icon={PlusCircle} className="bg-white text-indigo-900 hover:bg-indigo-50 shadow-lg">
                                Buat Kursus Baru
                            </Button>
                        </Link>
                    )}

                    {user?.is_student && (
                        <Link href="/catalog">
                            <Button variant="primary" icon={BookOpen} className="bg-white text-indigo-900 hover:bg-indigo-50 shadow-lg">
                                Jelajahi Katalog
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Render Role-Specific Dashboard */}
            {stats.type === 'admin' && <AdminDashboard stats={stats} />}
            {stats.type === 'instructor' && <InstructorDashboard stats={stats} />}
            {stats.type === 'student' && <StudentDashboard stats={stats} />}
        </AppLayout>
    );
}

/* =========================================================================
   1. SUPER ADMIN DASHBOARD
   ========================================================================= */
function AdminDashboard({ stats }) {
    return (
        <div className="space-y-8">
            {/* Metric Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                    title="Total Pengguna"
                    value={stats.total_users || 0}
                    icon={Users}
                    color="indigo"
                    subtitle="Semua role aktif"
                />
                <StatCard
                    title="Total Kursus"
                    value={stats.total_courses || 0}
                    icon={BookOpenCheck}
                    color="purple"
                    subtitle={`${stats.total_published_courses || 0} Terpublikasi`}
                />
                <StatCard
                    title="Total Pendaftaran"
                    value={stats.total_enrollments || 0}
                    icon={GraduationCap}
                    color="blue"
                    subtitle="Pendaftaran siswa"
                />
                <StatCard
                    title="Total Submission"
                    value={stats.total_submissions || 0}
                    icon={CheckSquare}
                    color="green"
                    subtitle="Tugas terkumpul"
                />
            </div>

            {/* 2-Column Split: Recent Activities & Recent Users */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activities */}
                <Card
                    title="Aktivitas Sistem Terbaru"
                    subtitle="Log audit aktivitas pengguna dalam platform."
                    headerRight={
                        <Link
                            href="/activity-logs"
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                        >
                            <span>Semua Log</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    }
                >
                    <div className="divide-y divide-slate-100">
                        {stats.recent_activities && stats.recent_activities.length > 0 ? (
                            stats.recent_activities.map((log) => (
                                <div key={log.id} className="py-3 flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                                        <Activity className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-semibold text-slate-800">
                                            {log.user?.name || 'Sistem'}{' '}
                                            <span className="font-normal text-slate-500">
                                                {log.description}
                                            </span>
                                        </p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">
                                            {new Date(log.created_at).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-slate-500 py-4 text-center">
                                Belum ada log aktivitas.
                            </p>
                        )}
                    </div>
                </Card>

                {/* Recent Registered Users */}
                <Card
                    title="Pengguna Terdaftar Terbaru"
                    subtitle="Pengguna yang baru saja bergabung."
                    headerRight={
                        <Link
                            href="/users"
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                        >
                            <span>Kelola User</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    }
                >
                    <div className="divide-y divide-slate-100">
                        {stats.recent_users && stats.recent_users.length > 0 ? (
                            stats.recent_users.map((u) => (
                                <div key={u.id} className="py-3 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <img
                                            src={
                                                u.avatar_url ||
                                                'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff'
                                            }
                                            alt={u.name}
                                            className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200"
                                        />
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold text-slate-800 truncate">
                                                {u.name}
                                            </p>
                                            <p className="text-[11px] text-slate-400 truncate">
                                                {u.email}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={
                                            u.roles?.[0]?.name === 'admin'
                                                ? 'admin'
                                                : u.roles?.[0]?.name === 'instructor'
                                                ? 'instructor'
                                                : 'student'
                                        }
                                        size="sm"
                                    >
                                        {u.roles?.[0]?.display_name || u.roles?.[0]?.name || 'User'}
                                    </Badge>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-slate-500 py-4 text-center">
                                Belum ada pengguna terdaftar.
                            </p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}

/* =========================================================================
   2. INSTRUCTOR DASHBOARD
   ========================================================================= */
function InstructorDashboard({ stats }) {
    return (
        <div className="space-y-8">
            {/* Metric Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                    title="Kursus Saya"
                    value={stats.my_courses_count || 0}
                    icon={BookOpen}
                    color="purple"
                    subtitle="Kursus dibuat"
                />
                <StatCard
                    title="Kursus Terpublikasi"
                    value={stats.my_published_courses_count || 0}
                    icon={CheckCircle2}
                    color="green"
                    subtitle="Dapat diakses siswa"
                />
                <StatCard
                    title="Total Siswa"
                    value={stats.total_students_enrolled || 0}
                    icon={Users}
                    color="indigo"
                    subtitle="Pendaftaran aktif"
                />
                <StatCard
                    title="Tugas Perlu Dinilai"
                    value={stats.pending_submissions_count || 0}
                    icon={Clock}
                    color="yellow"
                    subtitle="Menunggu review"
                />
            </div>

            {/* My Recent Courses List */}
            <Card
                title="Kursus yang Saya Kelola"
                subtitle="Daftar materi kursus yang aktif Anda ajar."
                headerRight={
                    <Link
                        href="/courses"
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                    >
                        <span>Lihat Semua Kursus</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                }
            >
                {stats.my_recent_courses && stats.my_recent_courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stats.my_recent_courses.map((course) => (
                            <div
                                key={course.id}
                                className="rounded-2xl border border-slate-200 p-4 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between gap-3"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <Badge variant="purple" size="sm">
                                            {course.category?.name || 'Umum'}
                                        </Badge>
                                        <Badge
                                            variant={
                                                course.status === 'published'
                                                    ? 'success'
                                                    : 'gray'
                                            }
                                            size="sm"
                                        >
                                            {course.status === 'published'
                                                ? 'Published'
                                                : 'Draft'}
                                        </Badge>
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900 line-clamp-2">
                                        {course.title}
                                    </h4>
                                </div>

                                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                    <span>{course.lessons_count || 0} Pelajaran</span>
                                    <span>{course.enrollments_count || 0} Siswa</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs text-slate-500 mb-3">
                            Anda belum membuat kursus apapun.
                        </p>
                        <Link href="/courses/create">
                            <Button variant="primary" size="sm" icon={PlusCircle}>
                                Buat Kursus Pertama
                            </Button>
                        </Link>
                    </div>
                )}
            </Card>
        </div>
    );
}

/* =========================================================================
   3. STUDENT DASHBOARD
   ========================================================================= */
function StudentDashboard({ stats }) {
    return (
        <div className="space-y-8">
            {/* Metric Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <StatCard
                    title="Kursus Diikuti"
                    value={stats.enrolled_courses_count || 0}
                    icon={BookOpen}
                    color="indigo"
                    subtitle="Kursus aktif"
                />
                <StatCard
                    title="Kursus Selesai"
                    value={stats.completed_courses_count || 0}
                    icon={Trophy}
                    color="green"
                    subtitle="100% tuntas"
                />
                <StatCard
                    title="Tugas Aktif"
                    value={stats.upcoming_assignments?.length || 0}
                    icon={Calendar}
                    color="purple"
                    subtitle="Mendekati tenggat"
                />
            </div>

            {/* Enrolled Courses Progress */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">
                            Kursus yang Sedang Berjalan
                        </h3>
                        <p className="text-xs text-slate-500">
                            Lanjutkan progres belajarmu dari materi terakhir.
                        </p>
                    </div>

                    <Link
                        href="/my-courses"
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                    >
                        <span>Semua Kursus Saya</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>

                {stats.enrolled_courses && stats.enrolled_courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {stats.enrolled_courses.map((enrollment) => {
                            const course = enrollment.course;
                            const progress = enrollment.progress_percentage || 0;
                            return (
                                <div
                                    key={enrollment.id}
                                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <Badge variant="blue" size="sm">
                                                {course?.category?.name || 'Umum'}
                                            </Badge>
                                            {enrollment.completed_at && (
                                                <Badge variant="success" size="sm">
                                                    Selesai
                                                </Badge>
                                            )}
                                        </div>

                                        <h4 className="text-sm font-bold text-slate-900 line-clamp-2 mb-1">
                                            {course?.title}
                                        </h4>
                                        <p className="text-[11px] text-slate-500 mb-4">
                                            Instruktur: {course?.instructor?.name || 'Pengajar'}
                                        </p>

                                        {/* Progress Bar */}
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1.5">
                                                <span>Progres Belajar</span>
                                                <span className="text-indigo-600">{progress}%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Link href={`/learn/${course?.id}`}>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            icon={PlayCircle}
                                            className="w-full"
                                        >
                                            {progress === 100 ? 'Ulas Materi' : 'Lanjut Belajar'}
                                        </Button>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <Card>
                        <div className="text-center py-8">
                            <GraduationCap className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                            <h4 className="text-sm font-bold text-slate-800">
                                Belum Ada Kursus yang Diikuti
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 mb-4 max-w-sm mx-auto">
                                Temukan kursus pemrograman, desain, dan bisnis terbaik untuk meningkatkan keterampilan Anda.
                            </p>
                            <Link href="/catalog">
                                <Button variant="primary" icon={BookOpen}>
                                    Jelajahi Katalog Kursus
                                </Button>
                            </Link>
                        </div>
                    </Card>
                )}
            </div>

            {/* Upcoming Assignments */}
            {stats.upcoming_assignments && stats.upcoming_assignments.length > 0 && (
                <Card
                    title="Tugas & Penugasan Mendatang"
                    subtitle="Selesaikan tugas sebelum tenggat waktu berakhir."
                >
                    <div className="divide-y divide-slate-100">
                        {stats.upcoming_assignments.map((assignment) => (
                            <div
                                key={assignment.id}
                                className="py-3 flex items-center justify-between gap-4"
                            >
                                <div className="min-w-0">
                                    <h5 className="text-xs font-bold text-slate-900 truncate">
                                        {assignment.title}
                                    </h5>
                                    <p className="text-[11px] text-slate-500">
                                        Kursus: {assignment.course?.title}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <span className="text-[11px] font-semibold text-rose-600 block">
                                            Tenggat: {new Date(assignment.due_date).toLocaleDateString('id-ID')}
                                        </span>
                                    </div>
                                    <Link href={`/assignments/${assignment.id}`}>
                                        <Button variant="outline" size="sm">
                                            Kumpulkan
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}

/* =========================================================================
   HELPER STAT CARD COMPONENT
   ========================================================================= */
function StatCard({ title, value, icon: Icon, color = 'indigo', subtitle = '' }) {
    const colorStyles = {
        indigo: 'bg-indigo-50 text-indigo-600 ring-indigo-500/20',
        purple: 'bg-purple-50 text-purple-600 ring-purple-500/20',
        blue: 'bg-sky-50 text-sky-600 ring-sky-500/20',
        green: 'bg-emerald-50 text-emerald-600 ring-emerald-500/20',
        yellow: 'bg-amber-50 text-amber-600 ring-amber-500/20',
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex items-start justify-between">
            <div>
                <p className="text-xs font-medium text-slate-500">{title}</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
                    {value}
                </h3>
                {subtitle && (
                    <p className="text-[11px] text-slate-400 mt-1 font-medium">{subtitle}</p>
                )}
            </div>

            <div
                className={`h-11 w-11 rounded-2xl flex items-center justify-center ring-1 ${
                    colorStyles[color] || colorStyles.indigo
                }`}
            >
                <Icon className="h-5 w-5" />
            </div>
        </div>
    );
}
