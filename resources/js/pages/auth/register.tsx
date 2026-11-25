import { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

// ─── Shared: Water Drop Logo ──────────────────────────────────────────────────

function WaterDropLogo() {
    return (
        <div className="w-16 h-16">
            <img src="/logo.svg" alt="Logo" className="w-full h-full shrink-0" />
        </div>
    );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

interface FieldProps {
    label: string;
    error?: string;
    children: React.ReactNode;
    className?: string;
}

function Field({ label, error, children, className = '' }: FieldProps) {
    return (
        <div className={className}>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-[0.07em] mb-1.5">
                {label}
            </label>
            {children}
            {error && (
                <p className="mt-1.5 text-xs text-red-500">{error}</p>
            )}
        </div>
    );
}

// ─── Section divider ──────────────────────────────────────────────────────────

function SectionHeading({ label, icon }: { label: string; icon: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 mb-5">
            <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                {icon}
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.08em]">
                {label}
            </p>
            <div className="flex-1 h-px bg-slate-100" />
        </div>
    );
}

// ─── Input class helper ───────────────────────────────────────────────────────

function inputCls(hasError: boolean): string {
    return [
        'w-full px-4 py-3 text-sm text-slate-800 bg-white rounded-xl border',
        'transition-all placeholder:text-slate-300',
        hasError ? 'border-red-300 bg-red-50' : 'border-slate-200',
    ].join(' ');
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
        password_confirmation: '',
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        house_address: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <>
            <Head title="Create Account" />

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

            <div className="min-h-screen bg-slate-50 font-sans">

                {/* ══════════ NAV ══════════ */}
                <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200">
                    <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 sm:gap-3 no-underline">
                            <WaterDropLogo />
                            <div>
                                <p className="text-[12px] sm:text-[13px] font-semibold text-slate-900 leading-tight tracking-tight">
                                    San Antonio Water Billing
                                </p>
                                <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-[0.08em] mt-px">
                                    Barangay San Antonio
                                </p>
                            </div>
                        </Link>
                        <p className="text-[13px] text-slate-400">
                            Already registered?{' '}
                            <Link
                                href={route('login')}
                                className="text-sky-700 font-semibold hover:text-sky-600 transition-colors no-underline"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </nav>

                {/* ══════════ PAGE BODY ══════════ */}
                <div className="max-w-2xl mx-auto px-6 py-12">

                    {/* Page heading */}
                    <div className="animate-fade-up text-center mb-10">
                        <h1 className="text-[32px] font-light text-slate-900 tracking-tight leading-tight mb-2">
                            Create your{' '}
                            <span className="font-lora italic text-sky-700 font-normal">account</span>
                        </h1>
                        <p className="text-sm text-slate-500 font-light">
                            Please provide your details below to set up your online water billing account.
                        </p>
                    </div>

                    {/* Form card */}
                    <div className="animate-fade-up-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <form onSubmit={submit}>

                            {/* Section 1: Credentials */}
                            <div className="p-7 border-b border-slate-100">
                                <SectionHeading
                                    label="Account Credentials"
                                    icon={
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                    }
                                />
                                <div className="space-y-4">
                                    <Field label="Username" error={errors.username}>
                                        <input
                                            type="text"
                                            value={data.username}
                                            onChange={(e) => setData('username', e.target.value)}
                                            placeholder="Choose a unique username"
                                            required
                                            className={inputCls(!!errors.username)}
                                        />
                                    </Field>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Field label="Password" error={errors.password}>
                                            <input
                                                type="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Min. 8 characters"
                                                required
                                                className={inputCls(!!errors.password)}
                                            />
                                        </Field>
                                        <Field label="Confirm Password" error={errors.password_confirmation}>
                                            <input
                                                type="password"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder="Repeat password"
                                                required
                                                className={inputCls(!!errors.password_confirmation)}
                                            />
                                        </Field>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Personal Information */}
                            <div className="p-7 border-b border-slate-100">
                                <SectionHeading
                                    label="Personal Information"
                                    icon={
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                    }
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="First Name" error={errors.first_name}>
                                        <input
                                            type="text"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            placeholder="Juan"
                                            required
                                            className={inputCls(!!errors.first_name)}
                                        />
                                    </Field>
                                    <Field label="Last Name" error={errors.last_name}>
                                        <input
                                            type="text"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            placeholder="dela Cruz"
                                            required
                                            className={inputCls(!!errors.last_name)}
                                        />
                                    </Field>
                                    <Field label="Email (Optional)" error={errors.email}>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="juan@email.com"
                                            className={inputCls(!!errors.email)}
                                        />
                                    </Field>
                                    <Field label="Phone (Optional)" error={errors.phone_number}>
                                        <input
                                            type="tel"
                                            value={data.phone_number}
                                            onChange={(e) => setData('phone_number', e.target.value)}
                                            placeholder="09XX-XXX-XXXX"
                                            className={inputCls(!!errors.phone_number)}
                                        />
                                    </Field>
                                </div>
                            </div>

                            {/* Section 3: Service Details */}
                            <div className="p-7">
                                <SectionHeading
                                    label="Service Details"
                                    icon={
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                            <polyline points="9 22 9 12 15 12 15 22" />
                                        </svg>
                                    }
                                />
                                <Field label="Service Address" error={errors.house_address}>
                                    <input
                                        type="text"
                                        value={data.house_address}
                                        onChange={(e) => setData('house_address', e.target.value)}
                                        placeholder="House no., Street, Barangay San Antonio"
                                        required
                                        className={inputCls(!!errors.house_address)}
                                    />
                                </Field>
                            </div>

                            <div className="px-7 py-6 bg-slate-50/60 border-t border-slate-100">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-4 rounded-xl text-[15px] font-bold text-white tracking-widest uppercase transition-all bg-sky-700 hover:bg-sky-600 shadow-lg shadow-sky-700/20 active:scale-[0.98] disabled:opacity-50"
                                >
                                    {processing ? 'Creating account...' : 'Create Account →'}
                                </button>
                                <p className="text-center text-[11px] text-slate-400 mt-4 leading-relaxed">
                                    By registering, you agree to the terms of service of the<br />
                                    Barangay San Antonio Water Billing System.
                                </p>
                            </div>
                        </form>
                    </div>

                    <p className="animate-fade-up-2 mt-6 text-center text-[13px] text-slate-400">
                        Already have an account?{' '}
                        <Link
                            href={route('login')}
                            className="text-sky-700 font-semibold hover:text-sky-600 transition-colors no-underline"
                        >
                            Sign in instead
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}