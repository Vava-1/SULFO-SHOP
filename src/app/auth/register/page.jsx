'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handle = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast({ type: 'error', message: 'Passwords do not match' }); return; }
    if (form.password.length < 6) { toast({ type: 'error', message: 'Password must be at least 6 characters' }); return; }
    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password);
      toast({ message: `Account created! Welcome, ${user.name}!` });
      router.push('/');
    } catch (err) {
      toast({ type: 'error', message: err.message });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl font-display">S</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-navy">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join the Sulfo Rwanda family</p>
        </div>
        <div className="card p-7">
          <form onSubmit={handle} className="space-y-4">
            {[
              { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Jean Pierre Habimana' },
              { key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@email.com' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">{label}</label>
                <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  type={type} className="input" placeholder={placeholder} required />
              </div>
            ))}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Password</label>
              <div className="relative">
                <input value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  type={show ? 'text' : 'password'} className="input pr-11" placeholder="Min. 6 characters" required />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Confirm Password</label>
              <input value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                type="password" className="input" placeholder="Repeat password" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 mt-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              {loading ? 'Creating…' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
