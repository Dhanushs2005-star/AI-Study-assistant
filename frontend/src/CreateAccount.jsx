import { useState, useMemo } from "react";
import axios from "axios";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Check,
  Sparkles,
  BookOpen,
  ShieldCheck,
} from "lucide-react";

function CreateAccount({ onNavigate }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [studyFocus, setStudyFocus] = useState("Computer Science");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const strengthScore = useMemo(() => {
    const p = formData.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  }, [formData.password]);

  const strengthMeta = [
    { label: "Too short", bar: "bg-gray-200", text: "text-gray-400" },
    { label: "Weak", bar: "bg-red-500", text: "text-red-500" },
    { label: "Fair", bar: "bg-amber-500", text: "text-amber-500" },
    { label: "Good", bar: "bg-blue-600", text: "text-blue-600" },
    { label: "Strong", bar: "bg-emerald-600", text: "text-emerald-600" },
  ][strengthScore];

  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!passwordsMatch || !formData.agreeTerms) return;

  setIsSubmitting(true);

  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/register",
      {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        studyFocus: studyFocus,
      }
    );

    console.log("Registration successful:", response.data);

    // Store JWT
    localStorage.setItem("token", response.data.token);

    // Store user if needed
    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );

    onNavigate?.("dashboard");

  } catch (error) {
    console.error(
      "Registration failed:",
      error.response?.data || error.message
    );

    alert(
      error.response?.data?.message ||
      "Something went wrong while creating your account."
    );
  } finally {
    setIsSubmitting(false);
  }
};
  const domains = [
    "Computer Science",
    "Engineering",
    "Medicine",
    "Business",
    "Sciences",
    "Other",
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 sm:px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black">
            <GraduationCap size={22} strokeWidth={2.2} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-black">StudyAI</span>
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
            <Sparkles size={11} className="text-gray-500" />
            RAG Workspace
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="hidden sm:inline">Already have an account?</span>
          <button
            type="button"
            onClick={() => onNavigate?.("login")}
            className="rounded-xl border border-gray-200 px-3.5 py-1.5 font-medium text-black transition-all hover:border-black hover:bg-gray-50"
          >
            Sign in
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-6 pb-12">
        <div className="w-full max-w-[460px]">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-black">
              Create your account
            </h1>
            <p className="mt-1.5 text-sm text-gray-500">
              Upload notes, synthesize PDFs, and study with grounded AI.
            </p>
          </div>

          {/* CARD */}
          <div className="rounded-[24px] border border-gray-200 bg-white p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* FULL NAME */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">
                  Full name
                </label>
                <div className="group flex items-center rounded-xl border border-gray-200 px-3.5 transition-all focus-within:border-black focus-within:shadow-[0_0_0_2px_rgba(0,0,0,0.05)]">
                  <User size={17} className="mr-2.5 text-gray-400 group-focus-within:text-black" />
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Alex Johnson"
                    className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">
                  Email address
                </label>
                <div className="group flex items-center rounded-xl border border-gray-200 px-3.5 transition-all focus-within:border-black focus-within:shadow-[0_0_0_2px_rgba(0,0,0,0.05)]">
                  <Mail size={17} className="mr-2.5 text-gray-400 group-focus-within:text-black" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="alex@university.edu"
                    className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* STUDY FOCUS CHIPS */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-700">Primary study focus</label>
                  <span className="text-[11px] text-gray-400">Personalizes AI answers</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {domains.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setStudyFocus(tag)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                        studyFocus === tag
                          ? "bg-black text-white"
                          : "border border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:text-black"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">
                  Password
                </label>
                <div className="group flex items-center rounded-xl border border-gray-200 px-3.5 transition-all focus-within:border-black focus-within:shadow-[0_0_0_2px_rgba(0,0,0,0.05)]">
                  <Lock size={17} className="mr-2.5 text-gray-400 group-focus-within:text-black" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-1 p-1 text-gray-400 hover:text-black"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {formData.password && (
                  <div className="mt-2">
                    <div className="mb-1 flex justify-between text-[11px]">
                      <span className="text-gray-400">Strength:</span>
                      <span className={`font-semibold ${strengthMeta.text}`}>{strengthMeta.label}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-1 rounded-full transition-all ${
                            step <= strengthScore ? strengthMeta.bar : "bg-gray-100"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">
                  Confirm password
                </label>
                <div className="group flex items-center rounded-xl border border-gray-200 px-3.5 transition-all focus-within:border-black focus-within:shadow-[0_0_0_2px_rgba(0,0,0,0.05)]">
                  <Lock size={17} className="mr-2.5 text-gray-400 group-focus-within:text-black" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="ml-1 p-1 text-gray-400 hover:text-black"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <p className="mt-1.5 flex items-center gap-1 text-[11px]">
                    {passwordsMatch ? (
                      <span className="text-emerald-600 font-medium flex items-center gap-1">
                        <Check size={12} strokeWidth={3} /> Passwords match
                      </span>
                    ) : (
                      <span className="text-amber-600">Passwords do not match yet</span>
                    )}
                  </p>
                )}
              </div>

              {/* TERMS CHECKBOX */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  required
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-0.5 h-3.5 w-3.5 cursor-pointer accent-black"
                />
                <label htmlFor="agreeTerms" className="cursor-pointer text-[11px] text-gray-500 leading-snug">
                  I agree to the <span className="font-semibold text-black">Terms</span>,{" "}
                  <span className="font-semibold text-black">Privacy Policy</span>, and{" "}
                  <span className="font-semibold text-black">Academic Integrity Code</span>.
                </label>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting || (formData.confirmPassword && !passwordsMatch)}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-gray-800 disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>Create free account</span>
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              {/* DIVIDER */}
              <div className="flex items-center gap-3 pt-1">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-[11px] text-gray-400">OR</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              {/* GOOGLE BUTTON */}
              <button
                type="button"
                onClick={() => onNavigate?.("dashboard")}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-800 transition-all hover:bg-gray-50 hover:border-gray-400"
              >
                <span className="font-bold">G</span>
                Continue with Google
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-gray-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => onNavigate?.("login")}
                className="font-semibold text-black hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>

          {/* HIGHLIGHTS */}
          <div className="mt-6 flex justify-center gap-4 text-[11px] text-gray-400">
            <span className="flex items-center gap-1"><BookOpen size={12} /> RAG Citations</span>
            <span>•</span>
            <span className="flex items-center gap-1"><GraduationCap size={12} /> Quiz Engine</span>
            <span>•</span>
            <span className="flex items-center gap-1"><ShieldCheck size={12} /> Private Notes</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateAccount;
