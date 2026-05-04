"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Mail, Lock, Shield, UserCog, User } from 'lucide-react';
import { supabase } from '@/utils/supabase';

import Logo from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';
import { sendOtpEmail } from '@/app/actions/auth';
import { logEvent } from '@/services/packetService';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState(0); // 0: Role, 1: Login, 2: OTP1 (Gmail), 3: OTP2 (Gmail)
  const [role, setRole] = useState<'admin' | 'viewer' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp1: '',
    otp2: ''
  });

  // Admin Verification Data
  const adminEmail1 = { name: "Murtaza Kapadiya", email: "mtkkpd53@gmail.com", masked: "mtk***@gmail.com" };
  const adminEmail2 = { name: "Abdulqadir Kapadiya", email: "abdulqadirmurtazakapadiya@gmail.com", masked: "abd***@gmail.com" };

  const [generatedOTPs, setGeneratedOTPs] = useState({ otp1: '', otp2: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const triggerEmailOTP = async (otpKey: 'otp1' | 'otp2', recipient: { name: string, email: string }) => {
    setLoading(true);
    setError('');
    try {
      const result = await sendOtpEmail(recipient.email, recipient.name);
      if (!result.success) throw new Error(result.error || 'Failed to send email');
      setGeneratedOTPs(prev => ({ ...prev, [otpKey]: result.otp! }));
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(`Failed to send code to ${recipient.email}. ${err.message}`);
      setLoading(false);
      return false;
    }
  };

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (role === 'viewer') {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (authError) throw authError;

        login('viewer');
        await logEvent('LOGIN', 'USER', formData.email, { role: 'viewer' });
        router.push('/dashboard');
      } else {
        // Admin: Trigger FIRST Gmail OTP
        const sent = await triggerEmailOTP('otp1', adminEmail1);
        if (sent) setStep(2);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.otp1 !== generatedOTPs.otp1) {
      setError(`Incorrect code for ${adminEmail1.name}`);
      return;
    }

    // First Gmail OTP verified! Now trigger Step 3 (Second Gmail OTP)
    const sent = await triggerEmailOTP('otp2', adminEmail2);
    if (sent) setStep(3);
  };

  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.otp2 !== generatedOTPs.otp2) {
      setError(`Incorrect code for ${adminEmail2.name}`);
      return;
    }

    setLoading(true);
    try {
      // Both OTPs verified! Now sign into Supabase with the hidden Admin account
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: adminEmail1.email,
        password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'password123', // Falls back to default if env not loaded
      });

      if (authError) throw authError;

      login('admin');
      await logEvent('LOGIN', 'USER', adminEmail1.email, { role: 'admin' });
      router.push('/dashboard');
    } catch (err: any) {
      setError(`OTP verified, but Supabase login failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const selectRole = (selectedRole: 'admin' | 'viewer') => {
    setRole(selectedRole);
    setStep(1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-950 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/30 via-transparent to-blue-950/20 pointer-events-none"></div>

      <div className="w-full max-w-[380px] z-10 animate-snappy">
        <div className="mb-8 flex flex-col items-center">
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center shadow-md shadow-cyan-800">
            <Logo size={26} className="text-zinc-950" />
          </div>
          <h1 className="text-xl font-bold text-zinc-50 mt-4 tracking-tight">Qardan DigiLocker</h1>
          <p className="text-xs font-medium text-zinc-500 mt-1">
            {step === 0 ? "Select access type" : 
             step === 1 ? `Sign in as ${role === 'admin' ? 'Administrator' : 'Public Viewer'}` :
             step === 2 ? "Supabase Identity Verification" : "Final Gmail Verification"}
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl shadow-sm overflow-hidden p-7 md:p-8">
          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-500 text-xs font-bold animate-in fade-in slide-in-from-top-2">
              <Shield size={14} />
              {error}
            </div>
          )}

          {step === 0 ? (
            <div className="space-y-4">
              <button onClick={() => selectRole('admin')} className="w-full group p-4 bg-zinc-800/50 border border-zinc-800 hover:border-cyan-500/50 rounded-xl transition-all text-left flex items-center gap-4">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center text-cyan-500 group-hover:bg-cyan-500 group-hover:text-zinc-950 transition-all"><UserCog size={20} /></div>
                <div>
                  <div className="text-sm font-bold text-zinc-100">Administrator</div>
                  <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Full Access + Cloud Sync</div>
                </div>
              </button>
              <button onClick={() => selectRole('viewer')} className="w-full group p-4 bg-zinc-800/50 border border-zinc-800 hover:border-blue-500/50 rounded-xl transition-all text-left flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-zinc-950 transition-all"><User size={20} /></div>
                <div>
                  <div className="text-sm font-bold text-zinc-100">Public Viewer</div>
                  <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Restricted Mode</div>
                </div>
              </button>
            </div>
          ) : step === 1 ? (
            <div className="space-y-5">
              <button onClick={() => setStep(0)} className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-500 hover:text-zinc-300 uppercase tracking-wider mb-2"><ArrowLeft size={14} />Switch Access Type</button>
              <form onSubmit={handleStep1Submit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="block w-full px-10 py-2.5 bg-zinc-800/50 border border-zinc-800/80 rounded-xl text-sm focus:outline-none focus:border-cyan-500 transition-all" />
                  </div>
                </div>
                {role === 'viewer' && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 ml-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                      <input type="password" name="password" required value={formData.password} onChange={handleInputChange} className="block w-full px-10 py-2.5 bg-zinc-800/50 border border-zinc-800/80 rounded-xl text-sm focus:outline-none focus:border-cyan-500 transition-all" />
                    </div>
                  </div>
                )}
                <button type="submit" disabled={loading} className={`w-full flex items-center justify-center py-3 ${role === 'admin' ? 'bg-cyan-500' : 'bg-blue-500'} text-zinc-950 text-sm font-bold rounded-xl shadow-sm active:scale-[0.98] mt-4`}>
                  {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Continue"}
                </button>
              </form>
            </div>
          ) : step === 2 ? (
            <div className="space-y-5">
              <div className="text-center">
                <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500 mx-auto mb-4 border border-cyan-500/20"><Shield size={28} /></div>
                <h3 className="text-sm font-bold text-zinc-100">Step 1: Supabase Auth</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Sent to {adminEmail1.masked}</p>
              </div>
              <form onSubmit={handleStep2Submit} className="space-y-4">
                <input type="text" name="otp1" required maxLength={6} value={formData.otp1} onChange={handleInputChange} placeholder="000000" className="block w-full px-4 py-3 bg-zinc-800/50 border border-zinc-800/80 rounded-xl text-center text-lg tracking-[0.5em] font-mono font-bold focus:outline-none focus:border-cyan-500 transition-all" />
                <button type="submit" disabled={loading} className="w-full flex items-center justify-center py-3 bg-cyan-500 text-zinc-950 text-sm font-bold rounded-xl shadow-sm active:scale-[0.98] mt-2">
                  {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Verify & Next Step"}
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="text-center">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mx-auto mb-4 border border-blue-500/20"><Mail size={28} /></div>
                <h3 className="text-sm font-bold text-zinc-100">Step 2: Admin Access</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Sent to {adminEmail2.masked}</p>
              </div>
              <form onSubmit={handleStep3Submit} className="space-y-4">
                <input type="text" name="otp2" required maxLength={6} value={formData.otp2} onChange={handleInputChange} placeholder="000000" className="block w-full px-4 py-3 bg-zinc-800/50 border border-zinc-800/80 rounded-xl text-center text-lg tracking-[0.5em] font-mono font-bold focus:outline-none focus:border-blue-500 transition-all" />
                <button type="submit" disabled={loading} className="w-full flex items-center justify-center py-3 bg-blue-500 text-zinc-950 text-sm font-bold rounded-xl shadow-sm active:scale-[0.98] mt-2">
                  {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Complete Login"}
                </button>
              </form>
            </div>
          )}
        </div>
        <p className="mt-8 text-center text-[11px] font-bold text-zinc-600 uppercase tracking-widest">Secure Cloud Portal</p>
      </div>
    </div>
  );
}
