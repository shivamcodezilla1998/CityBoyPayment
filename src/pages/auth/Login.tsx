import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react'

export function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit() {
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Please fill in both fields.')
      return
    }

    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      navigate('/dashboard', { replace: true })

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
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Brand header */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-[#E6E8EF]">
            <div
              className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-3"
              style={{ background: 'linear-gradient(135deg, #4C5BE0 0%, #2C36A0 100%)' }}
            >
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-[#0B1020]">CityBoyPayment</h1>
            <p className="text-sm text-[#8189A0] mt-1">Payment Potal</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <h2 className="text-lg font-semibold text-[#0B1020] mb-1">Welcome back</h2>
            <p className="text-sm text-[#8189A0] mb-6">Sign in to your admin account</p>

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
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-[#4A5167]">Password</label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-[#4C5BE0] hover:text-[#3A47C7] font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8189A0]" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={submitting}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E6E8EF] bg-[#F7F8FB] text-sm text-[#0B1020] placeholder:text-[#8189A0] outline-none focus:border-[#4C5BE0] focus:bg-white focus:shadow-[0_0_0_3px_rgba(76,91,224,0.12)] transition-all disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8189A0] hover:text-[#4A5167] transition-colors"
                    tabIndex={-1}
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-[#EF4444] bg-[#FEF2F2] border border-[#FECACA] rounded-lg px-3 py-2"
                >
                  {error}
                </motion.p>
              )}

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-2.5 rounded-xl text-white font-semibold text-sm transition-all active:scale-[0.98] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #4C5BE0 0%, #3A47C7 100%)' }}
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Signing in…
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </div>
        </motion.div>

        <p className="text-center text-white/40 text-xs mt-6">
          © 2026 CityBoyPayment · Payment Potal
        </p>
      </div>
    </div>
  )
}
