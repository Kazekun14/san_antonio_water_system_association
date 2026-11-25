import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import AppFooter from '@/components/AppFooter';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ContactItem {
    icon: string;
    text: string;
    detail: string;
}

function SectionBadge({ label, dark = false }: { label: string; dark?: boolean }) {
    return (
        <div
            className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 mb-4 ${dark
                ? 'bg-sky-400/20 border border-sky-400/30'
                : 'bg-sky-100 border border-sky-200'
                }`}
        >
            <span
                className={`text-[11px] font-bold uppercase tracking-widest ${dark ? 'text-sky-300' : 'text-sky-700'
                    }`}
            >
                {label}
            </span>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Contact() {

    const contactItems: ContactItem[] = [
        { icon: '🏛️', text: 'Barangay Hall', detail: 'Barangay San Antonio Siquijor, Siquijor' },
        { icon: '💧', text: 'Office', detail: 'Water Billing Office' },
        { icon: '📞', text: 'Phone', detail: '(032) 000-0000' },
        { icon: '✉️', text: 'Email', detail: 'waterbilling@sanantonio.gov.ph' },
    ];

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <Head title="Contact Us" />
            {/* Google Fonts — DM Sans + Lora */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Lora:ital@1&display=swap');
                html { scroll-behavior: smooth; }
                body { font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
                .font-lora { font-family: 'Lora', serif; }
            `}</style>

            <div className="min-h-screen bg-slate-50 font-sans flex flex-col">

                {/* ══════════════════════ NAV ══════════════════════ */}
                <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200">
                    <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">

                        {/* Brand */}
                        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => window.location.href = '/'}>
                            <div className="w-16 h-16">
                                <img className="w-full h-full" src="/logo.svg" alt="Logo" />
                            </div>
                            <div>
                                <p className="text-[12px] sm:text-[13px] font-semibold text-slate-900 leading-tight tracking-tight">
                                    San Antonio Water Billing
                                </p>
                                <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-[0.08em] mt-px">
                                    Barangay San Antonio
                                </p>
                            </div>
                        </div>

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-7">
                            <Link href="/" className="text-sm font-medium text-slate-500 hover:text-sky-700 transition-colors tracking-tight relative group">Home</Link>
                            <Link href="/#services" className="text-sm font-medium text-slate-500 hover:text-sky-700 transition-colors tracking-tight relative group">Services</Link>
                            <Link href="/#how-to-pay" className="text-sm font-medium text-slate-500 hover:text-sky-700 transition-colors tracking-tight relative group">How to Pay</Link>
                            <Link href="/#announcements" className="text-sm font-medium text-slate-500 hover:text-sky-700 transition-colors tracking-tight relative group">Announcements</Link>
                            <Link
                                href="/login"
                                className="bg-sky-700 hover:bg-sky-600 text-white text-[13px] font-semibold px-4 py-2 rounded-lg transition-colors tracking-tight"
                            >
                                Sign In
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-slate-600 hover:text-sky-700 focus:outline-none"
                            aria-label="Toggle Menu"
                        >
                            {isMenuOpen ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            ) : (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="3" y1="12" x2="21" y2="12" />
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <line x1="3" y1="18" x2="21" y2="18" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu Overlay */}
                    <div className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ${isMenuOpen ? 'visible' : 'invisible opacity-0'}`}>
                        {/* Backdrop */}
                        <div
                            className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                            onClick={() => setIsMenuOpen(false)}
                        />

                        {/* Drawer */}
                        <div className={`absolute top-16 right-0 w-64 bg-white border-l border-slate-200 h-[calc(100vh-64px)] shadow-2xl transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                            <div className="flex flex-col p-6 gap-6">
                                <Link href="/" className="text-lg font-medium text-slate-600 hover:text-sky-700 transition-colors">Home</Link>
                                <Link href="/#services" className="text-lg font-medium text-slate-600 hover:text-sky-700 transition-colors">Services</Link>
                                <Link href="/#how-to-pay" className="text-lg font-medium text-slate-600 hover:text-sky-700 transition-colors">How to Pay</Link>
                                <Link href="/#announcements" className="text-lg font-medium text-slate-600 hover:text-sky-700 transition-colors">Announcements</Link>
                                <div className="h-px bg-slate-100 my-2" />
                                <Link
                                    href="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="bg-sky-700 text-white text-center py-3 rounded-xl font-semibold shadow-lg shadow-sky-700/20"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="border border-slate-200 text-slate-700 text-center py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                                >
                                    Register
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="flex-1 bg-white">
                    {/* ══════════════════════ CONTACT ══════════════════════ */}
                    <section className="py-24 px-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-50 rounded-full blur-[100px] -mr-40 -mt-40 opacity-70 pointer-events-none" />

                        <div className="max-w-4xl mx-auto relative z-10 text-center">
                            <SectionBadge label="Get in Touch" />
                            <h1 className="text-[40px] sm:text-[48px] font-light text-slate-900 tracking-tight leading-[1.1] mb-6">
                                We're here to <span className="font-lora italic text-sky-700 font-normal">help</span>
                            </h1>
                            <p className="text-lg text-slate-500 leading-relaxed max-w-xl mx-auto mb-16">
                                Have questions about your bill, need to report a leak, or want to update your account? Reach out to our office.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {contactItems.map((item) => (
                                    <div key={item.text} className="bg-slate-50 border border-slate-100 rounded-2xl p-8 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all text-left">
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-2xl mb-6">
                                            {item.icon}
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">{item.text}</h3>
                                        <p className="text-slate-600 text-[15px]">{item.detail}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>

                {/* ══════════════════════ FOOTER ══════════════════════ */}
                <AppFooter className="mt-auto" />
            </div>
        </>
    );
}
