import { Link } from '@inertiajs/react';

export default function AppFooter({ className = '' }: { className?: string }) {
    return (
        <footer className={`bg-slate-950 pt-16 pb-8 px-8 ${className}`}>
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 mb-12">
                    {/* Brand */}
                    <div className="text-center md:text-left">
                        <div className="h-16 flex items-center justify-center md:justify-start gap-3 mb-4 cursor-pointer" onClick={() => window.location.href = '/'}>
                            <div className="w-16 h-16 shrink-0">
                                <img className="w-full h-full" src="/logo.svg" alt="Logo" />
                            </div>
                            <span className="font-lora font-semibold italic leading-tight tracking-tight text-sm text-sky-700">
                                San Antonio Water System Association
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto md:mx-0 md:pl-[76px]">
                            The official website of the San Antonio Water System Association.
                            Convenient online water billing and reliable water services for the San Antonio community.
                        </p>
                    </div>

                    {/* Organization */}
                    <div className="text-center md:text-left md:ml-auto">
                        <div className="h-16 flex items-center justify-center md:justify-start mb-4">
                            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-[0.08em]">
                                Organization
                            </p>
                        </div>
                        <ul className="flex flex-col gap-3">
                            <li>
                                <Link href="/about" className="text-slate-500 text-sm hover:text-slate-300 transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-slate-500 text-sm hover:text-slate-300 transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/feedback" className="text-slate-500 text-sm hover:text-slate-300 transition-colors">
                                    Feedback
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="text-center md:text-left md:ml-auto">
                        <div className="h-16 flex items-center justify-center md:justify-start mb-4">
                            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-[0.08em]">
                                Legal
                            </p>
                        </div>
                        <ul className="flex flex-col gap-3">
                            <li>
                                <Link href="/terms" className="text-slate-500 text-sm hover:text-slate-300 transition-colors">
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-slate-500 text-sm hover:text-slate-300 transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-6 text-center">
                    <p className="text-slate-600 text-xs">
                        © 2026 San Antonio Water System Association | All Rights Reserved
                    </p>
                </div>
            </div>
        </footer>
    );
}