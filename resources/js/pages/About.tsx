import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import AppFooter from '@/components/AppFooter';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ContactItem {
    icon: string;
    text: string;
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

export default function About() {

    const contactItems: ContactItem[] = [
        { icon: '🏛️', text: 'Barangay San Antonio Hall' },
        { icon: '💧', text: 'Water Billing Office' },
        { icon: '📞', text: '(032) 000-0000' },
        { icon: '✉️', text: 'waterbilling@sanantonio.gov.ph' },
    ];

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <Head title="About Us" />
            {/* Google Fonts — DM Sans + Lora */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Lora:ital@1&display=swap');
                html { scroll-behavior: smooth; }
                body { font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
                .font-lora { font-family: 'Lora', serif; }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50%       { transform: translateY(-10px); }
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50%       { transform: translateY(-15px) rotate(1deg); }
                }
                .animate-float    { animation: float  4s ease-in-out infinite; }
                .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
                .animate-fade-up  { animation: fadeUp 0.7s ease both; }
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
                                <p className="font-lora font-semibold italic leading-tight tracking-tight text-sm text-sky-700">
                                    San Antonio Water System Association
                                </p>
                            </div>
                        </div>

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-7">
                            <Link href="/" className="text-sm font-medium text-slate-500 hover:text-sky-700 transition-colors tracking-tight relative group">
                                Home
                                <span className="absolute -bottom-1 left-0 h-0.5 bg-sky-700 transition-all duration-300 w-0 group-hover:w-full" />
                            </Link>
                            <Link href="/#services" className="text-sm font-medium text-slate-500 hover:text-sky-700 transition-colors tracking-tight relative group">
                                Services
                                <span className="absolute -bottom-1 left-0 h-0.5 bg-sky-700 transition-all duration-300 w-0 group-hover:w-full" />
                            </Link>
                            <Link href="/#how-to-pay" className="text-sm font-medium text-slate-500 hover:text-sky-700 transition-colors tracking-tight relative group">
                                How to Pay
                                <span className="absolute -bottom-1 left-0 h-0.5 bg-sky-700 transition-all duration-300 w-0 group-hover:w-full" />
                            </Link>
                            <Link href="/#announcements" className="text-sm font-medium text-slate-500 hover:text-sky-700 transition-colors tracking-tight relative group">
                                Announcements
                                <span className="absolute -bottom-1 left-0 h-0.5 bg-sky-700 transition-all duration-300 w-0 group-hover:w-full" />
                            </Link>
                            <Link
                                href="/login"
                                className="bg-sky-700 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors tracking-tight"
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

                <main className="flex-1">
                    {/* ══════════════════════ ABOUT ══════════════════════ */}
                    <section id="about" className="py-24 px-8 bg-white relative overflow-hidden h-full">
                        {/* Background Accents */}
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-50 rounded-full blur-[120px] -mr-48 -mt-48 opacity-70 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-50 rounded-full blur-[100px] -ml-32 -mb-32 opacity-60 pointer-events-none" />

                        <div className="max-w-6xl mx-auto relative z-10">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                                {/* Visual Column */}
                                <div className="order-2 lg:order-1 animate-float-slow">
                                    <div className="relative group">
                                        {/* Glass Frame */}
                                        <div className="absolute -inset-4 bg-gradient-to-tr from-sky-100/50 to-white/50 rounded-[40px] blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-700" />

                                        <div className="relative bg-white p-2 rounded-[32px] shadow-[0_24px_80px_rgba(14,165,233,0.12)] border border-slate-100 overflow-hidden">
                                            <img
                                                src="/509347773_719821440749716_8751666760108072775_n.jpg"
                                                alt="About Barangay San Antonio Water Billing"
                                                className="w-full h-auto rounded-[24px] transform transition-transform duration-700 group-hover:scale-[1.02]"
                                            />

                                            {/* Floating Badge Overlay */}
                                            <div className="absolute bottom-6 right-6 bg-white/80 backdrop-blur-md border border-white/50 px-5 py-3 rounded-2xl shadow-xl animate-fade-up">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white shadow-lg shadow-sky-200">
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-[13px] font-bold text-slate-900 leading-tight">Trusted Service</p>
                                                        <p className="text-[11px] text-slate-500">Official Water System Association</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Decorative elements */}
                                        <div className="absolute -top-6 -left-6 w-24 h-24 bg-sky-200/30 rounded-full blur-2xl animate-pulse" />
                                        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-cyan-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                                    </div>
                                </div>

                                {/* Content Column */}
                                <div className="order-1 lg:order-2">
                                    <SectionBadge label="Our Story" />
                                    <h2 className="text-[40px] sm:text-[48px] font-light text-slate-900 tracking-tight leading-[1.1] mb-8">
                                        Dedicated to providing <br />
                                        <span className="font-lora italic text-sky-700 font-normal">transparent</span> &amp; sustainable water.
                                    </h2>

                                    <div className="space-y-6">
                                        <p className="text-lg text-slate-600 leading-relaxed font-light">
                                            Barangay San Antonio has always prioritized the welfare of its residents. Our water billing system is more than just a utility — it's a commitment to modernization and service excellence.
                                        </p>

                                        <div className="h-px bg-gradient-to-r from-sky-100 to-transparent w-full" />

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-2">
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                                                    Our Mission
                                                </h4>
                                                <p className="text-[15px] text-slate-500 leading-relaxed">
                                                    To deliver clean, affordable, and accessible water services through innovative digital solutions that empower every household.
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                                                    Transparency
                                                </h4>
                                                <p className="text-[15px] text-slate-500 leading-relaxed">
                                                    We believe in full accountability. Our system provides real-time tracking of consumption and payments for every resident.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="pt-6">
                                            <Link
                                                href="/#services"
                                                className="inline-flex items-center gap-2 text-sky-700 font-bold text-sm group"
                                            >
                                                Explore our services
                                                <svg className="transform transition-transform group-hover:translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>

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
