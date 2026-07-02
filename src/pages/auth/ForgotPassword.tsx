import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'

export function ForgotPassword() {
  const [step, setStep] = useState<'email' | 'success'>('email')
  const [email, setEmail] = useState('')
  const [emailErr, setEmailErr] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const variants = {
    enter: { x: 48, opacity: 0 },
    center: { x: 0, opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } },
    exit: { x: -48, opacity: 0, transition: { duration: 0.2 } },
  }

  async function handleSubmit() {
    setEmailErr('')

    if (!email.trim()) {
      setEmailErr('Please enter your email address.')
      return
    }
    if (!/^[^s@]+@[^s@]+.[^s@]+$/.test(email)) {
      setEmailErr('Enter a valid email address.')
      return
    }

    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setStep('success')
    }, 1500)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #4C5BE0 0%, #2C36A0 100%)' }}
    >
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Brand header */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-[#E6E8EF]">
            <h1 className="text-xl font-bold text-[#0B1020]">CityBoyPayment</h1>
            <p className="text-sm text-[#8189A0] mt-1">
              {step === 'email' ? 'Reset your password' : 'Check your email'}
            </p>
          </div>

          {/* Step content */}
          <div className="px-8 py-8 overflow-hidden" style={{ minHeight: 240 }}>
            <AnimatePresence mode="wait">
              {step === 'email' && (
                <motion.div
                  key="email"
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <Link
                    to="/login"
                    className="flex items-center gap-1.5 text-sm text-[#8189A0] hover:text-[#4A5167] mb-5 -ml-1 transition-colors w-fit"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to login
                  </Link>

                  <h2 className="text-lg font-semibold text-[#0B1020] mb-1">Forgot your password?</h2>
                  <p className="text-sm text-[#8189A0] mb-6">
                    Enter your admin email and we'll send a password reset link.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#4A5167] mb-1.5">
                        Email address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8189A0]" />
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                          placeholder="admin@cityboy.com"
                          autoComplete="email"
                          disabled={submitting}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E6E8EF] bg-[#F7F8FB] text-sm text-[#0B1020] placeholder:text-[#8189A0] outline-none focus:border-[#4C5BE0] focus:bg-white focus:shadow-[0_0_0_3px_rgba(76,91,224,0.12)] transition-all disabled:opacity-60"
                        />
                      </div>
                      {emailErr && (
                        <p className="text-sm text-[#EF4444] mt-1.5">{emailErr}</p>
                      )}
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="w-full py-2.5 rounded-xl text-white font-semibold text-sm transition-all active:scale-[0.98] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{ background: 'linear-gradient(135deg, #4C5BE0 0%, #3A47C7 100%)' }}
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          Sending…
                        </>
                      ) : (
                        'Send reset link'
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div
                  key="success"
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="flex flex-col items-center justify-center py-6 text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#ECFDF5] mb-4">
                    <CheckCircle2 className="w-8 h-8 text-[#16A34A]" />
                  </div>
                  <h2 className="text-lg font-semibold text-[#0B1020] mb-2">Check your inbox</h2>
                  <p className="text-sm text-[#8189A0] mb-1">
                    If <span className="font-medium text-[#4A5167]">{email}</span> is registered,
                    you'll receive a reset link shortly.
                  </p>

                  <div className="mt-4 mb-6">
                    <Link to="/reset-password" className="text-sm font-medium text-brand-600">[Demo] Go to Reset</Link>
                  </div>

                  <Link
                    to="/login"
                    className="text-sm text-[#4C5BE0] font-medium hover:text-[#3A47C7] transition-colors"
                  >
                    Back to login
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="text-center text-white/40 text-xs mt-6">
          © 2026 CityBoyPayment · Payment Potal
        </p>
      </div>
    </div>
  )
}
