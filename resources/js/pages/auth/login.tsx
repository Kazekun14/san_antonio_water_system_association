import { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

// ─── Shared: Water Drop Logo ──────────────────────────────────────────────────

function WaterDropLogo({ className = 'h-[60px] w-auto' }: { className?: string }) {
    return (
        <div className={className}>
            <img src="/logo.svg" alt="Logo" className="w-full h-full shrink-0" />
        </div>
    );
}

// ─── Feature Item ─────────────────────────────────────────────────────────────

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-sky-300 shrink-0 backdrop-blur-md">
                {icon}
            </div>
            <span className="text-[14px] font-medium text-slate-100">{label}</span>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Login({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm<{
        username: string;
        password: string;
        remember: boolean;
    }>({
        username: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Sign In — San Antonio Water Billing" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&family=Lora:ital@1&display=swap');
                body { font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
                .font-lora { font-family: 'Lora', serif; }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-up   { animation: fadeUp 0.55s ease both; }
                .animate-fade-up-1 { animation: fadeUp 0.55s 0.07s ease both; }
                .animate-fade-up-2 { animation: fadeUp 0.55s 0.14s ease both; }

                input:focus {
                    outline: none;
                    border-color: #38bdf8 !important;
                    box-shadow: 0 0 0 3px rgba(56,189,248,0.15);
                }
            `}</style>

            <div className="min-h-screen flex bg-slate-50 font-sans">

                {/* ══════════ LEFT PANEL ══════════ */}
                <aside className="hidden lg:flex w-[40%] relative flex-col justify-between p-12 bg-gradient-to-br from-sky-950 via-sky-900 to-sky-700 overflow-hidden">
                    {/* ── Background: hero blobs ── */}
                    <div className="absolute -top-24 -right-20 w-[480px] h-[480px] rounded-full bg-sky-400/40 blur-[80px] pointer-events-none" />
                    <div className="absolute bottom-10 -left-16 w-72 h-72 rounded-full bg-sky-950/60 blur-[72px] pointer-events-none" />
                    <div className="absolute top-1/3 left-[42%] w-48 h-48 rounded-full bg-sky-300/30 blur-[60px] pointer-events-none" />
                    {/* ── Background: dot grid ── */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage: 'radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px)',
                            backgroundSize: '28px 28px',
                        }}
                    />

                    <div className="relative z-10">
                        <Link href="/" className="flex items-center gap-3 no-underline group">
                            <WaterDropLogo className="h-[60px] w-auto transition-transform group-hover:scale-105" />
                            <div>
                                <p className="font-lora font-semibold italic leading-tight tracking-tight text-sm text-white">
                                    San Antonio Water System Association
                                </p>
                            </div>
                        </Link>

                        <div className="mt-24 max-w-sm">
                            <h2 className="text-5xl font-light text-white tracking-tight leading-[1.1] mb-6">
                                Manage your{' '}
                                <span className="font-lora italic text-sky-400 font-normal">water account</span>
                                {' '}securely
                            </h2>
                            <p className="text-slate-300 text-[16px] font-light leading-relaxed mb-12">
                                Access your bills, track monthly consumption, and make payments with ease through our official resident portal.
                            </p>

                            <div className="space-y-5">
                                <Feature
                                    label="Real-time Bill Tracking"
                                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>}
                                />
                                <Feature
                                    label="Secure Online Payments"
                                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>}
                                />
                                <Feature
                                    label="Usage Analytics"
                                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>}
                                />
                            </div>
                        </div>
                    </div>


                </aside>

                {/* ══════════ RIGHT PANEL ══════════ */}
                <main className="flex-1 flex items-center justify-center p-8 sm:p-12">
                    <div className="w-full max-w-[420px]">

                        {/* Mobile Brand (visible only on small screens) */}
                        <div className="flex items-center justify-center gap-3 mb-10 lg:hidden">
                            <WaterDropLogo className="h-[60px] w-auto" />
                            <div className="text-left">
                                <p className="text-[15px] font-bold text-slate-900 leading-tight">San Antonio Water</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Billing Portal</p>
                            </div>
                        </div>

                        <div className="animate-fade-up text-center mb-8">
                            <h1 className="text-[32px] font-light text-slate-900 tracking-tight leading-tight mb-2">
                                Welcome{' '}
                                <span className="font-lora italic text-sky-700 font-normal">back</span>
                            </h1>
                            <p className="text-sm text-slate-500 font-light">
                                Sign in to your account using your username.
                            </p>
                        </div>

                        {status && (
                            <div className="mb-6 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3 flex items-start gap-3 animate-fade-up">
                                <svg className="w-5 h-5 text-emerald-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-[13px] font-medium text-emerald-800 leading-snug">{status}</p>
                            </div>
                        )}

                        <div className="animate-fade-up-1 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                            <form onSubmit={submit}>
                                <div className="p-8 space-y-6">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-[0.07em] mb-2">
                                            Username
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 transition-colors group-focus-within:text-sky-500">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                value={data.username}
                                                onChange={(e) => setData('username', e.target.value)}
                                                placeholder="Enter your username"
                                                required
                                                autoFocus
                                                className={`w-full pl-11 pr-4 py-3.5 text-sm text-slate-800 bg-slate-50/50 rounded-xl border border-slate-200 transition-all placeholder:text-slate-300 focus:bg-white ${errors.username ? 'border-red-300 bg-red-50' : ''}`}
                                            />
                                        </div>
                                        {errors.username && (
                                            <p className="mt-2 text-xs text-red-500 font-medium">{errors.username}</p>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.07em]">
                                                Password
                                            </label>
                                            <Link href={route('password.request')} className="text-[11px] font-semibold text-sky-700 hover:text-sky-600 transition-colors uppercase tracking-widest">
                                                Forgot?
                                            </Link>
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 transition-colors group-focus-within:text-sky-500">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                                </svg>
                                            </div>
                                            <input
                                                type="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="••••••••"
                                                required
                                                className={`w-full pl-11 pr-4 py-3.5 text-sm text-slate-800 bg-slate-50/50 rounded-xl border border-slate-200 transition-all placeholder:text-slate-300 focus:bg-white ${errors.password ? 'border-red-300 bg-red-50' : ''}`}
                                            />
                                        </div>
                                        {errors.password && (
                                            <p className="mt-2 text-xs text-red-500 font-medium">{errors.password}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={data.remember}
                                                onChange={(e) => setData('remember', e.target.checked)}
                                                className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 transition-all"
                                            />
                                            <span className="text-[13px] text-slate-500 font-medium group-hover:text-slate-700 transition-colors">
                                                Remember me on this device
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <div className="px-8 py-6 bg-slate-50/60 border-t border-slate-100">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-4 rounded-2xl text-[15px] font-bold text-white tracking-widest uppercase transition-all bg-sky-700 hover:bg-sky-600 shadow-lg shadow-sky-700/20 active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {processing ? 'Signing in...' : 'Sign In →'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="animate-fade-up-2 mt-8 text-center">
                            <p className="text-[14px] text-slate-500 font-light">
                                New here?{' '}
                                <Link
                                    href={route('register')}
                                    className="text-sky-700 font-semibold hover:text-sky-600 transition-colors no-underline"
                                >
                                    Create an account
                                </Link>
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}