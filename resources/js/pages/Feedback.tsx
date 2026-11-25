import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import AppFooter from '@/components/AppFooter';

// ─── Main Component ───────────────────────────────────────────────────────────

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

export default function Feedback() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <Head title="Feedback" />
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
                    {/* ══════════════════════ FEEDBACK ══════════════════════ */}
                    <section className="py-24 px-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-50 rounded-full blur-[100px] -mr-40 -mt-40 opacity-70 pointer-events-none" />
                        
                        <div className="max-w-2xl mx-auto relative z-10 text-center">
                            <SectionBadge label="We value your input" />
                            <h1 className="text-[40px] sm:text-[48px] font-light text-slate-900 tracking-tight leading-[1.1] mb-6">
                                Send us <span className="font-lora italic text-sky-700 font-normal">Feedback</span>
                            </h1>
                            <p className="text-lg text-slate-500 leading-relaxed mx-auto mb-12">
                                We are constantly looking to improve our water billing portal. Let us know what you think, or report any issues you have experienced.
                            </p>

                            <form className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm text-left">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                                        <input type="text" id="name" placeholder="Juan Dela Cruz" className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all" />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                                        <input type="email" id="email" placeholder="juan@example.com" className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all" />
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="topic" className="block text-sm font-semibold text-slate-700 mb-2">Topic</label>
                                    <select id="topic" className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all">
                                        <option>General Feedback</option>
                                        <option>Bug Report</option>
                                        <option>Feature Request</option>
                                        <option>Billing Inquiry</option>
                                    </select>
                                </div>
                                <div className="mb-8">
                                    <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                                    <textarea id="message" rows={5} placeholder="Tell us what you think..." className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all"></textarea>
                                </div>
                                <button type="button" className="w-full bg-sky-700 hover:bg-sky-800 text-white font-semibold py-4 rounded-xl shadow-md transition-colors text-sm tracking-wide">
                                    Submit Feedback
                                </button>
                            </form>
                        </div>
                    </section>
                </main>

                {/* ══════════════════════ FOOTER ══════════════════════ */}
                <AppFooter className="mt-auto" />
            </div>
        </>
    );
}
