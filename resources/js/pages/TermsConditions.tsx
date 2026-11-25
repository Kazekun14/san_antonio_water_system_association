import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import AppFooter from '@/components/AppFooter';

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TermsConditions() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <Head title="Terms & Conditions" />
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
                    {/* ══════════════════════ TERMS AND CONDITIONS ══════════════════════ */}
                    <section className="py-20 px-8">
                        <div className="max-w-3xl mx-auto">
                            <h1 className="text-[32px] sm:text-[40px] font-light text-slate-900 tracking-tight leading-tight mb-8">
                                Terms and <span className="font-lora italic text-sky-700 font-normal">Conditions</span>
                            </h1>

                            <div className="prose prose-slate prose-sky max-w-none">
                                <p className="text-slate-600 leading-relaxed mb-6">
                                    Welcome to the Barangay San Antonio Water Billing Portal. By accessing or using our services, you agree to comply with and be bound by the following terms and conditions.
                                </p>

                                <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">1. Use of the Portal</h3>
                                <p className="text-slate-600 leading-relaxed mb-6">
                                    The portal is provided to residents of Barangay San Antonio solely for the purpose of managing water bills, viewing usage history, and making online payments. You agree to provide accurate and complete registration information.
                                </p>

                                <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">2. Account Responsibility</h3>
                                <p className="text-slate-600 leading-relaxed mb-6">
                                    You are responsible for maintaining the confidentiality of your account credentials. The Barangay is not liable for any unauthorized access resulting from your failure to protect your login information.
                                </p>

                                <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">3. Payments and Billing</h3>
                                <p className="text-slate-600 leading-relaxed mb-6">
                                    All payments made through the portal via GCash, Maya, or card are processed securely. However, the Barangay relies on third-party payment gateways and is not responsible for payment processing delays caused by these external services. Official receipts will be generated once payment is confirmed.
                                </p>

                                <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">4. Service Interruptions</h3>
                                <p className="text-slate-600 leading-relaxed mb-6">
                                    We strive to ensure the portal is available 24/7. However, there may be instances of planned maintenance or unexpected downtime. We will notify residents of any scheduled service interruptions via the Announcements section.
                                </p>

                                <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">5. Amendments</h3>
                                <p className="text-slate-600 leading-relaxed mb-6">
                                    Barangay San Antonio reserves the right to modify these terms at any time. Continued use of the portal following any changes constitutes your acceptance of the revised terms.
                                </p>

                                <p className="text-sm text-slate-400 mt-12">
                                    Last Updated: October 2026
                                </p>
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
