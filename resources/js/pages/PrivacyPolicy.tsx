import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import AppFooter from '@/components/AppFooter';

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PrivacyPolicy() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <Head title="Privacy Policy" />
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
                    {/* ══════════════════════ PRIVACY POLICY ══════════════════════ */}
                    <section className="py-20 px-8">
                        <div className="max-w-3xl mx-auto">
                            <h1 className="text-[32px] sm:text-[40px] font-light text-slate-900 tracking-tight leading-tight mb-8">
                                Privacy <span className="font-lora italic text-sky-700 font-normal">Policy</span>
                            </h1>

                            <div className="prose prose-slate prose-sky max-w-none">
                                <p className="text-slate-600 leading-relaxed mb-6">
                                    At Barangay San Antonio, we are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard the data you provide when using our Water Billing Portal.
                                </p>

                                <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">1. Information We Collect</h3>
                                <p className="text-slate-600 leading-relaxed mb-6">
                                    We collect personal information necessary for setting up your account and processing your water bills. This includes your name, contact details (email and phone number), address, and water meter connection details.
                                </p>

                                <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">2. How We Use Your Information</h3>
                                <p className="text-slate-600 leading-relaxed mb-6">
                                    Your information is used strictly to provide you with accurate billing statements, facilitate online payments, notify you of service interruptions, and improve our services. We do not use your data for marketing purposes.
                                </p>

                                <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">3. Data Security</h3>
                                <p className="text-slate-600 leading-relaxed mb-6">
                                    We implement industry-standard security measures to protect your data against unauthorized access, alteration, or disclosure. Online payments are processed through encrypted, secure third-party gateways (GCash, Maya, Stripe); we do not store your raw payment details on our servers.
                                </p>

                                <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">4. Sharing of Information</h3>
                                <p className="text-slate-600 leading-relaxed mb-6">
                                    We do not sell, trade, or otherwise transfer your personal information to outside parties, except as required by law or to trusted third parties who assist us in operating our website, provided those parties agree to keep this information confidential.
                                </p>

                                <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">5. Contact Us</h3>
                                <p className="text-slate-600 leading-relaxed mb-6">
                                    If you have any questions regarding this Privacy Policy or your data, please contact the Barangay San Antonio Water Billing Office.
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
