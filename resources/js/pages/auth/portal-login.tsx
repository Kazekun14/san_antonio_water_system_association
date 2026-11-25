import { FormEventHandler, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

// ─── Shared: Water Drop Logo ──────────────────────────────────────────────────

function WaterDropLogo({ className = 'h-[60px] w-auto' }: { className?: string }) {
    return (
        <div className={className}>
            <img src="/logo.svg" alt="Logo" className="w-full h-full shrink-0" />
        </div>
    );
}

// ─── Feature Item (dark panel variant) ───────────────────────────────────────

function Feature({ icon, label, accent = 'sky' }: { icon: React.ReactNode; label: string; accent?: 'sky' | 'cyan' }) {
    return (
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 backdrop-blur-md ${accent === 'sky' ? 'text-sky-300' : 'text-cyan-300'}`}>
                {icon}
            </div>
            <span className="text-[14px] font-medium text-slate-100">{label}</span>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PortalLogin({ status }: { status?: string }) {
    const [activeTab, setActiveTab] = useState<'admin' | 'staff'>('admin');
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm<{
        username: string;
        password: string;
        remember: boolean;
        intended_role: string;
    }>({
        username: '',
        password: '',
        remember: false,
        intended_role: 'admin',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('portal.login'));
    };

    // Keeps activeTab and intended_role in sync so the server always
    // receives the correct role without any async race conditions.
    const switchTab = (tab: 'admin' | 'staff') => {
        setActiveTab(tab);
        setData('intended_role', tab);
    };

    const isAdmin = activeTab === 'admin';

    return (
        <>
            <Head title={`Portal Access`} />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&family=Lora:ital@1&display=swap');
                body { font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
                .font-lora { font-family: 'Lora', serif; }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-up   { animation: fadeUp 0.55s ease both; }
                .animate-fade-up-1 { animation: fadeUp 0.55s 0.07s ease both; }
                .animate-fade-up-2 { animation: fadeUp 0.55s 0.14s ease both; }
                .animate-fade-down { animation: fadeDown 0.4s ease both; }

                .panel-slide {
                    transition: transform 0.72s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .panel-content-slide {
                    transition: transform 0.72s cubic-bezier(0.4, 0, 0.2, 1);
                }

                /* Switcher glow */
                .switcher-glow {
                    box-shadow: 0 8px 32px rgba(7, 89, 133, 0.45), 0 2px 8px rgba(0,0,0,0.25);
                }
            `}</style>


            {/* ══ Full-screen container ══ */}
            <div className="min-h-screen relative overflow-hidden bg-white font-sans">

                {/* ══════════ BLUE INFO PANEL ══════════
                    Admin  → left  (translateX 0)
                    Staff  → right (translateX 150%)               */}
                <div
                    className="panel-slide absolute inset-y-0 left-0 w-[40%] overflow-hidden flex flex-col justify-between p-12 lg:p-14 z-20"
                    style={{
                        background: 'linear-gradient(135deg, #0c1a2e 0%, #0e3d62 50%, #0369a1 100%)',
                        transform: isAdmin ? 'translateX(0%)' : 'translateX(150%)',
                    }}
                >
                    {/* Blobs */}
                    <div className="absolute -top-24 -right-20 w-[480px] h-[480px] rounded-full bg-sky-400/40 blur-[80px] pointer-events-none" />
                    <div className="absolute bottom-10 -left-16 w-72 h-72 rounded-full bg-sky-950/60 blur-[72px] pointer-events-none" />
                    <div className="absolute top-1/3 left-[42%] w-48 h-48 rounded-full bg-sky-300/30 blur-[60px] pointer-events-none" />
                    {/* Dot grid — matches Index.tsx hero section */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage: 'radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px)',
                            backgroundSize: '28px 28px',
                        }}
                    />

                    {/* ── Centre content (grows to fill remaining space) ── */}
                    <div className="relative z-10 flex-1 flex items-start mt-4">
                        {/* Admin content */}
                        <div
                            className="max-w-xs panel-content-slide w-full absolute left-0 top-0"
                            style={{
                                transform: isAdmin ? 'translateX(0%)' : 'translateX(-220%)',
                            }}
                        >
                            {/* Logo */}
                            <div className="mb-12">
                                <Link href="/" className="flex items-center gap-3 no-underline group w-fit">
                                    <WaterDropLogo className="h-[60px] w-auto transition-transform group-hover:scale-105" />
                                    <div>
                                        <p className="font-lora font-semibold italic leading-tight tracking-tight text-sm text-white">
                                            San Antonio Water System Association
                                        </p>
                                    </div>
                                </Link>
                            </div>

                            <h2 className="text-[40px] font-light text-white tracking-tight leading-[1.1] mb-4">
                                Management &{' '}
                                <span className="font-lora italic text-sky-400 font-normal">control</span>
                                {' '}portal
                            </h2>
                            <p className="text-slate-300 text-[14px] font-light leading-relaxed mb-8">
                                Secure access for administrators to manage accounts, process bills, and oversee real-time system dashboards.
                            </p>
                            <div className="space-y-3.5">
                                <Feature accent="sky" label="Resident Meter & Profile Management" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>} />
                                <Feature accent="sky" label="Billing Generation & Tracking" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>} />
                                <Feature accent="sky" label="System Audit Logs & Controls" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>} />
                            </div>
                        </div>

                        {/* Staff content */}
                        <div
                            className="max-w-xs panel-content-slide w-full absolute left-0 top-0"
                            style={{
                                transform: isAdmin ? 'translateX(220%)' : 'translateX(0%)',
                            }}
                        >
                            {/* Logo */}
                            <div className="mb-12">
                                <Link href="/" className="flex items-center gap-3 no-underline group w-fit">
                                    <WaterDropLogo className="h-[60px] w-auto transition-transform group-hover:scale-105" />
                                    <div>
                                        <p className="font-lora font-semibold italic leading-tight tracking-tight text-sm text-white">
                                            San Antonio Water System Association
                                        </p>
                                    </div>
                                </Link>
                            </div>

                            <h2 className="text-[40px] font-light text-white tracking-tight leading-[1.1] mb-4">
                                Staff{' '}
                                <span className="font-lora italic text-cyan-400 font-normal">portal</span>
                            </h2>
                            <p className="text-slate-300 text-[14px] font-light leading-relaxed mb-8">
                                Streamlined access for field operators to process payments, update meter readings, and manage daily billing tasks.
                            </p>
                            <div className="space-y-3.5">
                                <Feature accent="cyan" label="Payment Processing & Collection" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>} />
                                <Feature accent="cyan" label="Meter Reading & Field Updates" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /></svg>} />
                                <Feature accent="cyan" label="Daily Activity Report" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>} />
                            </div>
                        </div>
                    </div>

                </div>

                {/* ══════════ WHITE FORM PANEL ══════════
                    Admin  → right (translateX 0, since it is right-0)
                    Staff  → left  (translateX -66.6667%)                */}
                <div
                    className="panel-slide absolute inset-y-0 right-0 w-[60%] bg-slate-50 flex items-center justify-center overflow-y-auto p-8 sm:p-12 z-10"
                    style={{
                        transform: isAdmin ? 'translateX(0%)' : 'translateX(-66.6667%)',
                    }}
                >
                    <div className="w-full max-w-[420px] py-8 relative z-10">

                        {/* Mobile brand (small screens only) */}
                        <div className="flex items-center justify-center gap-3 mb-6 lg:hidden">
                            <WaterDropLogo className="h-[56px] w-auto" />
                            <div className="text-left">
                                <p className="text-[15px] font-bold text-slate-900 leading-tight">San Antonio Water</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Management Portal</p>
                            </div>
                        </div>

                        {/* Heading */}
                        <div className="animate-fade-up text-center mb-5">
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest mb-3 ${isAdmin
                                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                                }`}>
                                {isAdmin ? (
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                ) : (
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                                    </svg>
                                )}
                                {isAdmin ? 'Administrator' : 'Staff'}
                            </div>
                            <h1 className="text-[28px] font-light text-slate-900 tracking-tight leading-tight mb-1">
                                Portal <span className="font-lora italic text-sky-700 font-normal">access</span>
                            </h1>
                            <p className="text-[13px] text-slate-500 font-light">
                                {isAdmin
                                    ? 'Sign in to your administrator account.'
                                    : 'Sign in to your staff account.'}
                            </p>
                        </div>

                        {/* Status message */}
                        {status && (
                            <div className="mb-4 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-2.5 flex items-start gap-3 animate-fade-up">
                                <svg className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-[13px] font-medium text-emerald-800 leading-snug">{status}</p>
                            </div>
                        )}

                        {/* Form card */}
                        <div className="animate-fade-up-1 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                            <form onSubmit={submit}>
                                <div className="p-6 space-y-4">

                                    {/* Username */}
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-[0.07em] mb-1.5">
                                            Username
                                        </label>
                                        <div className="relative group">
                                            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 transition-colors ${isAdmin ? 'group-focus-within:text-sky-500' : 'group-focus-within:text-cyan-500'
                                                }`}>
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
                                                style={{ outline: 'none' }}
                                                className={`w-full pl-11 pr-4 py-3 text-sm text-slate-800 bg-slate-50/50 rounded-xl border border-slate-200 transition-all placeholder:text-slate-300 focus:bg-white ${errors.username ? 'border-red-300 bg-red-50' : ''
                                                    } ${isAdmin
                                                        ? 'focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10'
                                                        : 'focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                    {/* Password */}
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-[0.07em] mb-1.5">
                                            Password
                                        </label>
                                        <div className="relative group">
                                            {/* Eye toggle button — left side, before the placeholder */}
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(v => !v)}
                                                className={`absolute inset-y-0 left-0 pl-4 flex items-center transition-colors text-slate-400 ${isAdmin ? 'hover:text-sky-500 group-focus-within:text-sky-500' : 'hover:text-cyan-500 group-focus-within:text-cyan-500'}`}
                                                tabIndex={-1}
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showPassword ? (
                                                    /* Eye-open */
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                        <circle cx="12" cy="12" r="3" />
                                                    </svg>
                                                ) : (
                                                    /* Eye-off */
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                                        <line x1="1" y1="1" x2="23" y2="23" />
                                                    </svg>
                                                )}
                                            </button>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="••••••••"
                                                required
                                                style={{ outline: 'none' }}
                                                className={`w-full pl-11 pr-4 py-3 text-sm text-slate-800 bg-slate-50/50 rounded-xl border border-slate-200 transition-all placeholder:text-slate-300 focus:bg-white ${errors.password ? 'border-red-300 bg-red-50' : ''
                                                    } ${isAdmin
                                                        ? 'focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10'
                                                        : 'focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10'
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    {/* Remember */}
                                    <div className="flex items-center">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={data.remember}
                                                onChange={(e) => setData('remember', e.target.checked)}
                                                className={`w-4 h-4 rounded border-slate-300 transition-all ${isAdmin ? 'text-sky-600 focus:ring-sky-500' : 'text-cyan-600 focus:ring-cyan-500'
                                                    }`}
                                            />
                                            <span className="text-[13px] text-slate-500 font-medium group-hover:text-slate-700 transition-colors">
                                                Trust this device for 30 days
                                            </span>
                                        </label>
                                    </div>

                                    {/* Validation Error Message */}
                                    {(errors.username || errors.password) && (
                                        <div className="p-3 bg-red-50 border border-red-200/60 rounded-xl text-xs text-red-600 font-medium">
                                            {errors.username || errors.password}
                                        </div>
                                    )}
                                </div>

                                {/* Submit */}
                                <div className="px-6 py-4 bg-slate-50/60 border-t border-slate-100">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className={`cursor-pointer w-full py-3.5 rounded-2xl text-[13px] font-bold text-white tracking-widest uppercase transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 ${isAdmin
                                            ? 'bg-sky-700 hover:bg-sky-600 shadow-sky-700/15'
                                            : 'bg-cyan-700 hover:bg-cyan-600 shadow-cyan-700/15'
                                            }`}
                                    >
                                        {processing ? 'Signing in…' : `Sign In →`}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Switch button */}
                        <div className="animate-fade-up-2 mt-4 text-center">
                            <button
                                type="button"
                                onClick={() => switchTab(isAdmin ? 'staff' : 'admin')}
                                className="cursor-pointer text-slate-500 font-semibold hover:text-slate-600 transition-colors no-underline inline-flex items-center gap-2 text-[13px]"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="16 3 21 8 16 13" />
                                    <line x1="21" y1="8" x2="9" y2="8" />
                                    <polyline points="8 21 3 16 8 11" />
                                    <line x1="3" y1="16" x2="15" y2="16" />
                                </svg>
                                {isAdmin ? 'Switch to Staff' : 'Switch to Administrator'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}