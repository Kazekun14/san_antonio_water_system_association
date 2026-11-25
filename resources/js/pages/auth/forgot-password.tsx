import { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f7ff', fontFamily: "'Georgia', serif", padding: '2rem' }}>
            <Head title="Forgot Password" />

            <div style={{ width: '100%', maxWidth: '460px' }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #1a73c7, #0f4c81)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(15,76,129,0.25)' }}>
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M12 2C12 2 5 10.5 5 15a7 7 0 0 0 14 0C19 10.5 12 2 12 2z" /></svg>
                        </div>
                        <span style={{ color: '#0f4c81', fontWeight: 700, fontSize: '17px' }}>San Antonio WBS</span>
                    </Link>
                </div>

                {/* Card */}
                <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #cde0f7', padding: '2.5rem', boxShadow: '0 4px 24px rgba(15,76,129,0.09)' }}>
                    {/* Icon */}
                    <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: '#e8f2fb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a73c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                    </div>

                    <h1 style={{ margin: '0 0 0.5rem', fontSize: '24px', color: '#0f4c81', fontWeight: 700 }}>
                        Forgot your password?
                    </h1>
                    <p style={{ margin: '0 0 2rem', color: '#5a8abf', fontSize: '14px', lineHeight: 1.65, fontFamily: 'sans-serif' }}>
                        No problem. Enter the email address linked to your account and we'll send you a link to reset your password.
                    </p>

                    {/* Success */}
                    {status && (
                        <div style={{ backgroundColor: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: '8px', padding: '12px 16px', marginBottom: '1.5rem' }}>
                            <p style={{ margin: 0, color: '#2e7d32', fontSize: '14px', fontFamily: 'sans-serif' }}>{status}</p>
                        </div>
                    )}

                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#2c4a6b', marginBottom: '6px', fontFamily: 'sans-serif', letterSpacing: '0.02em' }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder="juan@email.com"
                                required
                                style={{
                                    width: '100%', padding: '11px 14px', fontSize: '15px',
                                    border: errors.email ? '1.5px solid #e53935' : '1.5px solid #cde0f7',
                                    borderRadius: '8px', outline: 'none', boxSizing: 'border-box',
                                    backgroundColor: '#fff', color: '#0a2f52', fontFamily: 'sans-serif'
                                }}
                            />
                            {errors.email && (
                                <p style={{ margin: '5px 0 0', color: '#e53935', fontSize: '12px', fontFamily: 'sans-serif' }}>{errors.email}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            style={{
                                width: '100%', padding: '13px', fontSize: '15px', fontWeight: 700,
                                backgroundColor: processing ? '#90bde0' : '#1a73c7',
                                color: '#fff', border: 'none', borderRadius: '8px',
                                cursor: processing ? 'not-allowed' : 'pointer',
                                fontFamily: 'sans-serif', transition: 'background-color 0.2s'
                            }}
                        >
                            {processing ? 'Sending…' : 'Send Reset Link'}
                        </button>
                    </form>

                    <p style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '14px', color: '#5a8abf', fontFamily: 'sans-serif' }}>
                        Remembered it?{' '}
                        <Link href={route('login')} style={{ color: '#1a73c7', fontWeight: 600, textDecoration: 'none' }}>
                            Back to Sign In
                        </Link>
                    </p>
                </div>

                {/* Help note */}
                <div style={{ marginTop: '1.5rem', padding: '14px 18px', backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #cde0f7' }}>
                    <p style={{ margin: 0, fontSize: '12px', color: '#7aadd4', fontFamily: 'sans-serif', lineHeight: 1.6 }}>
                        <strong style={{ color: '#2c4a6b' }}>No email on file?</strong> If you didn't provide an email when you registered, visit the Barangay San Antonio Hall or call <strong style={{ color: '#1a73c7' }}>(032) 000-0000</strong> to recover your account.
                    </p>
                </div>
            </div>
        </div>
    );
}