import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/ui/Button";
import { motion } from "framer-motion";
import { GraduationCap, User, Shield, Eye, EyeOff, Zap } from "lucide-react";

// Demo account quick-login configs
const DEMO_ACCOUNTS = [
  {
    role: "admin",
    label: "Administrator",
    icon: Shield,
    email: "admin@smartclass.edu",
    password: "admin123",
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-50 hover:bg-violet-100 border-violet-200",
    textColor: "text-violet-700",
    description: "Campus overview, timetables, analytics",
  },
  {
    role: "teacher",
    label: "Teacher",
    icon: User,
    email: "arjun.sharma@smartclass.edu",
    password: "teacher123",
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50 hover:bg-blue-100 border-blue-200",
    textColor: "text-blue-700",
    description: "Classes, attendance, student risk",
  },
  {
    role: "student",
    label: "Student",
    icon: GraduationCap,
    email: "rahul.sharma@student.edu",
    password: "student123",
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50 hover:bg-emerald-100 border-emerald-200",
    textColor: "text-emerald-700",
    description: "Dashboard, assignments, performance",
  },
];

const ROLE_REDIRECTS = {
  admin: "/admin",
  teacher: "/teacher",
  student: "/student",
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(ROLE_REDIRECTS[user.role] || "/");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (account) => {
    setError("");
    setQuickLoading(account.role);
    try {
      const user = await login(account.email, account.password);
      navigate(ROLE_REDIRECTS[user.role] || "/");
    } catch (err) {
      setError(err.message);
    } finally {
      setQuickLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-12 flex-col justify-between relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
            <span className="text-white font-bold text-base">SC</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">SmartClass</h1>
            <p className="text-blue-300 text-xs">SIH1625 — Intelligent Classroom Management</p>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
              From Classroom<br />
              <span className="text-blue-400">Management</span> to<br />
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                Classroom Intelligence.
              </span>
            </h2>
            <p className="mt-5 text-slate-300 text-base leading-relaxed max-w-md">
              An intelligent platform that helps students, teachers, and administrators understand classroom activity, identify problems early, and act with confidence.
            </p>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            className="mt-8 grid grid-cols-2 gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {[
              { label: "Classroom Health Score", desc: "Real-time class wellness tracking" },
              { label: "Early Warning System", desc: "Proactive student risk detection" },
              { label: "Smart Attendance", desc: "QR-based with trend analytics" },
              { label: "AI Classroom Assistant", desc: "Data-driven intelligent insights" },
            ].map((f) => (
              <div key={f.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white text-xs font-semibold">{f.label}</p>
                <p className="text-slate-400 text-xs mt-0.5">{f.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          className="relative flex items-center gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { value: "4,821", label: "Students" },
            { value: "214", label: "Faculty" },
            { value: "126", label: "Active Classes" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-slate-400 text-xs">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Right panel — Login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">SC</span>
            </div>
            <span className="font-bold text-foreground">SmartClass</span>
          </div>

          <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
          <p className="text-muted-foreground text-sm mt-1">Sign in to your SmartClass account</p>

          {/* Quick login demo cards */}
          <div className="mt-6 mb-5">
            <div className="flex items-center gap-1.5 mb-3">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-medium text-muted-foreground">Quick Demo Login</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.role}
                  id={`demo-${account.role}`}
                  onClick={() => handleQuickLogin(account)}
                  disabled={quickLoading !== null}
                  className={`border rounded-xl p-3 text-left transition-all duration-150 cursor-pointer ${account.bg} ${quickLoading === account.role ? "opacity-70" : ""}`}
                >
                  <account.icon className={`w-4 h-4 ${account.textColor} mb-1.5`} />
                  <p className={`text-xs font-semibold ${account.textColor}`}>{account.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{account.description}</p>
                  {quickLoading === account.role && (
                    <p className="text-[10px] text-muted-foreground mt-1">Signing in...</p>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-xs text-muted-foreground">or sign in manually</span>
            </div>
          </div>

          {/* Manual login form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@smartclass.edu"
                className="input w-full"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input w-full pr-10"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="alert-critical rounded-lg p-3 text-sm"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
            >
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            SmartClass — SIH1625 Hackathon Prototype
          </p>
        </motion.div>
      </div>
    </div>
  );
}
