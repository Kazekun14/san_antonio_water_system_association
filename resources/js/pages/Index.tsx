import { Head, Link } from '@inertiajs/react';
import { ReactNode, useState, useEffect, useRef } from 'react';
import AppFooter from '@/components/AppFooter';
import { Pin, ArrowRight } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Service {
    icon: ReactNode;
    title: string;
    desc: string;
    iconBg: string;
    iconColor: string;
}

interface Stat {
    val: string;
    lbl: string;
}

interface PayStep {
    text: string;
}

interface FooterLink {
    label: string;
    href: string;
}

interface ContactItem {
    icon: string;
    text: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function ServiceCard({ service }: { service: Service }) {
    return (
        <div className="group bg-white border border-slate-200 rounded-2xl p-6 transition-all duration-200 hover:border-sky-200 hover:shadow-[0_8px_32px_rgba(14,165,233,0.10)] hover:-translate-y-1 cursor-default">
            <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${service.iconBg} ${service.iconColor} transition-transform duration-200 group-hover:scale-110`}
            >
                {service.icon}
            </div>
            <p className="text-sm font-semibold text-slate-900 tracking-tight mb-1.5">
                {service.title}
            </p>
            <p className="text-sm text-slate-500 leading-relaxed">{service.desc}</p>
        </div>
    );
}

function StepItem({
    index,
    text,
    variant,
}: {
    index: number;
    text: string;
    variant: 'primary' | 'secondary';
}) {
    return (
        <li className="flex items-start gap-3">
            <span
                className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5 ${variant === 'primary'
                    ? 'bg-sky-700 text-white'
                    : 'bg-sky-100 text-sky-700 border border-sky-200'
                    }`}
            >
                {index + 1}
            </span>
            <span className="text-sm text-slate-600 leading-relaxed pt-0.5">{text}</span>
        </li>
    );
}

function AnnouncementCard({ item }: { item: any }) {
    const contentRef = useRef<HTMLParagraphElement>(null);
    const [isClamped, setIsClamped] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (isExpanded) return;
        const el = contentRef.current;
        if (!el) return;

        const check = () => {
            if (!el) return;
            // Chrome returns scrollHeight == clientHeight when -webkit-line-clamp
            // is active, so we temporarily strip the clamp via inline styles to
            // read the true full height. Done synchronously — no visual flash.
            const clampedHeight = el.clientHeight;
            if (clampedHeight === 0) return;
            el.style.overflow = 'visible';
            el.style.webkitLineClamp = 'unset';
            el.style.display = 'block';
            const fullHeight = el.scrollHeight;
            el.style.overflow = '';
            el.style.webkitLineClamp = '';
            el.style.display = '';
            setIsClamped(fullHeight > clampedHeight + 2);
        };

        const rafId = requestAnimationFrame(check);
        document.fonts?.ready?.then(() => requestAnimationFrame(check));

        const observer = new ResizeObserver(check);
        observer.observe(el);
        return () => {
            cancelAnimationFrame(rafId);
            observer.disconnect();
        };
    }, [item.content, isExpanded]);

    return (
        <div className="group flex flex-col border border-slate-200 rounded-[32px] overflow-hidden hover:border-sky-200 hover:shadow-xl transition-all duration-500 bg-white">
            {item.image && (
                <div className="h-48 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
            )}
            <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                    {item.is_pinned && (
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                            <Pin className="w-3 h-3" /> Pinned
                        </span>
                    )}
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{item.created_at}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-sky-700 transition-colors tracking-tight">
                    {item.title}
                </h3>
                <p
                    ref={contentRef}
                    className={`text-slate-500 text-[15px] leading-relaxed mb-6 ${isExpanded ? '' : 'line-clamp-3'}`}
                >
                    {item.content}
                </p>
                {isClamped && (
                    <div className="mt-auto">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-sky-700 font-bold text-xs uppercase tracking-widest hover:text-sky-600 transition-colors inline-flex items-center gap-2"
                        >
                            {isExpanded ? 'Read Less' : 'Read More'}
                            <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? '-rotate-90' : ''}`} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Index() {
    const services: Service[] = [
        {
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
            ),
            title: 'Pay Online',
            desc: 'Settle your bill securely via GCash, Maya, or card — anytime, anywhere.',
            iconBg: 'bg-sky-50',
            iconColor: 'text-sky-500',
        },
        {
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
            ),
            title: 'View Bills',
            desc: 'Access current and past statements and download official receipts.',
            iconBg: 'bg-cyan-50',
            iconColor: 'text-cyan-500',
        },
        {
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
            ),
            title: 'Track Payments',
            desc: 'Check if your payment was received and get real-time confirmations.',
            iconBg: 'bg-sky-50',
            iconColor: 'text-sky-600',
        },
        {
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            ),
            title: 'Manage Account',
            desc: 'Update your personal info and manage your registered water connections.',
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600',
        },
        {
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
            ),
            title: 'Usage Analytics',
            desc: 'Monitor monthly consumption trends to manage your water use wisely.',
            iconBg: 'bg-sky-50',
            iconColor: 'text-sky-500',
        },
        {
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
            ),
            title: 'Submit Concerns',
            desc: 'Report leaks, billing disputes, or service issues directly to the office.',
            iconBg: 'bg-cyan-50',
            iconColor: 'text-cyan-500',
        },
    ];

    const stats: Stat[] = [
        { val: '2,400+', lbl: 'Registered Households' },
        { val: 'GCash · Maya · Card', lbl: 'Secure Online Payment' },
        { val: '24 / 7', lbl: 'Access' },
    ];

    const onlineSteps: PayStep[] = [
        { text: 'Log in or create a resident account' },
        { text: 'Go to "Pay Bill" from your dashboard' },
        { text: 'Review your current bill amount' },
        { text: 'Pay via GCash, Maya, or debit/credit card' },
        { text: 'Download your official receipt instantly' },
    ];

    const cashSteps: PayStep[] = [
        { text: 'Visit the Barangay San Antonio Hall' },
        { text: 'Bring your latest water bill statement' },
        { text: 'Proceed to the Water Billing Window' },
        { text: 'Pay the cashier in cash' },
        { text: 'Keep your official receipt for records' },
    ];

    const footerLinks: FooterLink[] = [
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Feedback', href: '/feedback' },
        { label: 'Terms & Conditions', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy' },
    ];

    const contactItems: ContactItem[] = [
        { icon: '🏛️', text: 'Barangay San Antonio Hall' },
        { icon: '💧', text: 'Water Billing Office' },
        { icon: '📞', text: '(032) 000-0000' },
        { icon: '✉️', text: 'waterbilling@sanantonio.gov.ph' },
    ];

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
    const [activeSection, setActiveSection] = useState<string>('home');

    useEffect(() => {
        const sections = ['home', 'services', 'how-to-pay', 'announcements'];
        const observerOptions = {
            root: null,
            rootMargin: '-30% 0px -50% 0px',
            threshold: 0,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, observerOptions);

        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        fetch('/api/announcements')
            .then(res => res.json())
            .then(data => {
                setAnnouncements(data);
                setLoadingAnnouncements(false);
            })
            .catch(err => {
                console.error('Failed to fetch announcements:', err);
                setLoadingAnnouncements(false);
            });
    }, []);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id.replace('#', ''));
        if (element) {
            const offset = 80; // height of sticky nav
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Add highlight animation
            element.classList.remove('section-highlight');
            void element.offsetWidth; // trigger reflow
            element.classList.add('section-highlight');

            // Close mobile menu if open
            setIsMenuOpen(false);
        }
    };

    return (
        <>
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
                @keyframes sectionHighlight {
                    0%   { background-color: transparent; }
                    20%  { background-color: rgba(14, 165, 233, 0.05); }
                    100% { background-color: transparent; }
                }
                .section-highlight { animation: sectionHighlight 2s ease-out; }
                .animate-float    { animation: float  4s ease-in-out infinite; }
                .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
                .animate-fade-up  { animation: fadeUp 0.7s ease both; }
                .animate-fade-up-1 { animation: fadeUp 0.7s 0.1s ease both; }
                .animate-fade-up-2 { animation: fadeUp 0.7s 0.22s ease both; }
                .animate-fade-up-3 { animation: fadeUp 0.7s 0.34s ease both; }
            `}</style>

            <div className="min-h-screen bg-slate-50 font-sans">

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
                            {(['Home', 'Services', 'How to Pay', 'Announcements'] as const).map((label) => {
                                const targetId = label.toLowerCase().replace(/\s+/g, '-');
                                const isActive = activeSection === targetId;
                                return (
                                    <a
                                        key={label}
                                        href={`#${targetId}`}
                                        onClick={(e) => scrollToSection(e, targetId)}
                                        className={`text-sm font-medium transition-colors tracking-tight relative group ${isActive ? 'text-sky-700 font-semibold' : 'text-slate-500 hover:text-sky-700'
                                            }`}
                                    >
                                        {label}
                                        <span
                                            className={`absolute -bottom-1 left-0 h-0.5 bg-sky-700 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'
                                                }`}
                                        />
                                    </a>
                                );
                            })}
                            <Link
                                href="/login"
                                className="bg-sky-700 hover:bg-sky-600 text-sm text-white font-semibold px-4 py-2 rounded-lg transition-colors tracking-tight"
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
                                {(['Home', 'Services', 'How to Pay', 'Announcements'] as const).map((label) => {
                                    const targetId = label.toLowerCase().replace(/\s+/g, '-');
                                    const isActive = activeSection === targetId;
                                    return (
                                        <a
                                            key={label}
                                            href={`#${targetId}`}
                                            onClick={(e) => scrollToSection(e, targetId)}
                                            className={`text-lg font-medium transition-colors ${isActive ? 'text-sky-700 font-semibold' : 'text-slate-600 hover:text-sky-700'
                                                }`}
                                        >
                                            {label}
                                        </a>
                                    );
                                })}
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

                {/* ══════════════════════ HERO ══════════════════════ */}
                <section id="home" className="relative overflow-hidden bg-gradient-to-br from-sky-950 via-sky-900 to-sky-700 pt-20">

                    {/* Blobs */}
                    <div className="absolute -top-24 -right-20 w-[480px] h-[480px] rounded-full bg-sky-400/40 blur-[80px] pointer-events-none" />
                    <div className="absolute bottom-10 -left-16 w-72 h-72 rounded-full bg-sky-950/60 blur-[72px] pointer-events-none" />
                    <div className="absolute top-1/3 left-[42%] w-48 h-48 rounded-full bg-sky-300/30 blur-[60px] pointer-events-none" />

                    {/* Dot grid */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage: 'radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px)',
                            backgroundSize: '28px 28px',
                        }}
                    />

                    <div className="max-w-6xl mx-auto px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

                        {/* ── Left copy ── */}
                        <div className="pt-10 lg:pb-20 text-center lg:text-left">
                            {/* Headline */}
                            <div className="mb-6">
                                <h1 className="animate-fade-up-1 text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-[1.1] tracking-[-0.03em]">
                                    Water billing,<br />
                                    <span className="font-lora italic text-sky-300">made simple.</span>
                                </h1>
                            </div>

                            <p className="animate-fade-up-2 text-base text-sky-200/80 leading-relaxed max-w-md mx-auto lg:mx-0 mb-9 font-light">
                                View usage, track billing history, and pay your water bill from anywhere — fast and secure for all residents of Barangay San Antonio.
                            </p>

                            {/* CTAs */}
                            <div className="animate-fade-up-3 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                                <Link
                                    href="/register"
                                    className="inline-flex items-center justify-center gap-2 bg-white text-sky-800 text-sm font-bold px-6 py-3.5 rounded-xl hover:bg-sky-50 transition-all hover:-translate-y-0.5 hover:shadow-lg tracking-tight"
                                >
                                    Create an Account
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </Link>
                                <a
                                    href="#how-to-pay"
                                    onClick={(e) => scrollToSection(e, 'how-to-pay')}
                                    className="inline-flex items-center justify-center gap-2 text-sky-100 text-sm font-medium px-6 py-3.5 rounded-xl border border-white/25 hover:bg-white/10 transition-colors tracking-tight"
                                >
                                    How to Pay
                                </a>
                            </div>
                        </div>

                        {/* ── Right card ── */}
                        <div className="animate-fade-up-2 animate-float pb-14">
                            <div className="relative rounded-2xl p-7 bg-white/[0.07] backdrop-blur-2xl border border-white/[0.15] overflow-hidden">
                                {/* Shimmer orb */}
                                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-sky-300/20 pointer-events-none" />

                                <p className="text-[11px] font-bold text-sky-300 uppercase tracking-[0.1em] mb-5">
                                    Overview
                                </p>

                                {/* Stats grid */}
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    {[
                                        { val: '2,400+', lbl: 'Households' },
                                        { val: '24 / 7', lbl: 'Access' },
                                    ].map((s) => (
                                        <div
                                            key={s.lbl}
                                            className="rounded-xl p-4 bg-white/[0.07] border border-white/10"
                                        >
                                            <p className="text-[28px] font-bold text-white leading-none tracking-tight">
                                                {s.val}
                                            </p>
                                            <p className="text-[11px] text-sky-300 mt-1.5 font-medium">
                                                {s.lbl}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Payment methods */}
                                <div className="rounded-xl p-4 bg-white/[0.06] border border-white/10 mb-5">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        {['GCash', 'Maya', 'Card'].map((m) => (
                                            <span
                                                key={m}
                                                className="bg-sky-300/15 text-sky-200 text-xs font-semibold px-2.5 py-1 rounded-full"
                                            >
                                                {m}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-[12px] text-sky-300/70">Accepted Payment Methods</p>
                                </div>

                                {/* Footer row */}
                                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                                    <div className="flex items-center gap-2">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                        <span className="text-xs text-sky-300">Encrypted &amp; Secure</span>
                                    </div>
                                    <span className="bg-green-400/15 text-green-300 text-[11px] font-bold px-3 py-1 rounded-full tracking-wide">
                                        ● ACTIVE
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Wave divider */}
                    <svg
                        viewBox="0 0 1440 72"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="block w-full relative z-10 -mb-px"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0,40 C240,72 480,8 720,40 C960,72 1200,8 1440,40 L1440,72 L0,72 Z"
                            fill="#f8fafc"
                        />
                    </svg>
                </section>

                {/* ══════════════════════ STATS STRIP ══════════════════════ */}
                <section className="bg-slate-50 border-b border-slate-200">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
                        {stats.map((s) => (
                            <div key={s.lbl} className="py-6 sm:py-7 px-6 text-center">
                                <p className="text-xl font-bold text-sky-800 tracking-tight">{s.val}</p>
                                <p className="text-[10px] sm:text-xs text-slate-400 mt-1 font-medium tracking-wide uppercase">{s.lbl}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ══════════════════════ SERVICES ══════════════════════ */}
                <section id="services" className="py-20 px-8 bg-white">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-14">
                            <SectionBadge label="Services" />
                            <h2 className="text-[34px] font-light text-slate-900 tracking-tight leading-tight mb-3">
                                Everything in{' '}
                                <span className="font-lora italic text-sky-700 font-normal">
                                    one place
                                </span>
                            </h2>
                            <p className="text-[15px] text-slate-500 max-w-sm mx-auto leading-relaxed">
                                All the tools you need to manage your water account, right at your fingertips.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {services.map((s) => (
                                <ServiceCard key={s.title} service={s} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════ HOW TO PAY ══════════════════════ */}
                <section id="how-to-pay" className="py-20 px-8 bg-sky-50">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-14">
                            <SectionBadge label="Payment" />
                            <h2 className="text-[34px] font-light text-slate-900 tracking-tight leading-tight mb-3">
                                Two ways to{' '}
                                <span className="font-lora italic text-sky-700 font-normal">pay</span>
                            </h2>
                            <p className="text-[15px] text-slate-500 max-w-xs mx-auto">
                                Choose the method that works best for you.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-5">

                            {/* ── Online ── */}
                            <div className="rounded-2xl overflow-hidden border-2 border-sky-700 shadow-[0_12px_40px_rgba(3,105,161,0.12)]">
                                <div className="bg-gradient-to-r from-sky-800 to-sky-500 px-6 py-4 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="2" y="5" width="20" height="14" rx="2" />
                                            <line x1="2" y1="10" x2="22" y2="10" />
                                        </svg>
                                        <span className="text-white text-sm font-semibold">Online Payment</span>
                                    </div>
                                    <span className="bg-white/20 text-white text-[9px] sm:text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                        Recommended
                                    </span>
                                </div>
                                <div className="bg-white p-6">
                                    <ul className="space-y-3.5 mb-6">
                                        {onlineSteps.map((s, i) => (
                                            <StepItem key={s.text} index={i} text={s.text} variant="primary" />
                                        ))}
                                    </ul>
                                    <Link
                                        href="/login"
                                        className="block text-center bg-gradient-to-r from-sky-800 to-sky-500 text-white text-sm font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity tracking-tight"
                                    >
                                        Pay Online Now →
                                    </Link>
                                </div>
                            </div>

                            {/* ── Cash ── */}
                            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white">
                                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-3">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0369a1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="7" width="20" height="14" rx="2" />
                                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                    </svg>
                                    <span className="text-slate-800 text-sm font-semibold">Over-the-Counter (Cash)</span>
                                </div>
                                <div className="p-6">
                                    <ul className="space-y-3.5 mb-6">
                                        {cashSteps.map((s, i) => (
                                            <StepItem key={s.text} index={i} text={s.text} variant="secondary" />
                                        ))}
                                    </ul>
                                    <div className="bg-sky-50 border-l-4 border-sky-400 rounded-r-lg px-4 py-3">
                                        <p className="text-[13px] text-slate-700">
                                            <strong className="font-semibold">Office Hours:</strong>{' '}
                                            Mon – Fri, 8AM – 5PM
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════ ANNOUNCEMENTS ══════════════════════ */}
                <section id="announcements" className="py-20 px-8 bg-white border-t border-slate-200">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-14">
                            <SectionBadge label="Latest News" />
                            <h2 className="text-[34px] font-light text-slate-900 tracking-tight leading-tight mb-3">
                                Recent{' '}
                                <span className="font-lora italic text-sky-700 font-normal">Announcements</span>
                            </h2>
                            <p className="text-[15px] text-slate-500 max-w-sm mx-auto leading-relaxed">
                                Stay up to date with the latest water service updates and news.
                            </p>
                        </div>

                        {loadingAnnouncements ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-700"></div>
                            </div>
                        ) : announcements.length === 0 ? (
                            <div className="text-center py-20 text-slate-400 italic">
                                No active announcements at this time.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {announcements.map((item) => (
                                    <AnnouncementCard key={item.id} item={item} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* ══════════════════════ CTA ══════════════════════ */}
                <section className="relative py-20 text-center bg-gradient-to-br from-sky-950 via-sky-900 to-sky-600 overflow-hidden">
                    {/* Wave top */}
                    <svg
                        viewBox="0 0 1440 60"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute top-0 left-0 w-full z-10"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,20 1440,30 L1440,0 L0,0 Z"
                            fill="#f0f9ff"
                        />
                    </svg>

                    {/* Blobs */}
                    <div className="absolute -top-20 right-0 w-96 h-96 rounded-full bg-sky-400/25 blur-[80px] pointer-events-none" />
                    <div className="absolute -bottom-16 left-10 w-72 h-72 rounded-full bg-sky-950/40 blur-[72px] pointer-events-none" />

                    <div className="relative z-20 px-8">
                        <h2 className="text-[40px] font-light text-white tracking-tight leading-tight mb-2">
                            Ready to get{' '}
                            <span className="font-lora italic text-sky-300 font-normal">started?</span>
                        </h2>
                        <p className="text-[15px] text-sky-200 max-w-sm mx-auto leading-relaxed mb-9 font-light">
                            Register your household today to manage your water bill online. It takes just a few minutes.
                        </p>
                        <div className="flex gap-3 justify-center flex-wrap">
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 bg-white text-sky-800 text-sm font-bold px-7 py-3.5 rounded-xl shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all tracking-tight"
                            >
                                Register Now
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════ FOOTER ══════════════════════ */}
                <AppFooter />
            </div>
        </>
    );
}