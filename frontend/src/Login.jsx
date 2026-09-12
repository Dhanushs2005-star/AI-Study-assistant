import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import axios from "axios";
import { useState } from "react";

function Login({ onNavigate }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  setIsSubmitting(true);

  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        email,
        password,
      }
    );

    console.log("Login successful:", response.data);

    localStorage.setItem("token", response.data.token);
    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );

    onNavigate?.("dashboard");

  } catch (error) {
    console.error(
      "Login failed:",
      error.response?.data || error.message
    );

    alert(
      error.response?.data?.message ||
      "Login failed. Please try again."
    );

  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-white">

      {/* TOP LOGO */}
      <header className="flex items-center justify-between px-6 sm:px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black">
            <GraduationCap
              size={27}
              strokeWidth={2.2}
              className="text-white"
            />
          </div>

          <span className="text-2xl font-bold tracking-tight text-black">
            StudyAI
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-gray-500 sm:inline">
            New to StudyAI?
          </span>
          <button
            type="button"
            onClick={() => onNavigate?.("register")}
            className="
              rounded-xl
              border border-gray-200
              bg-white
              px-4
              py-2
              text-sm
              font-medium
              text-black
              transition-all duration-200
              hover:border-black
              hover:bg-gray-50
            "
          >
            Create account
          </button>
        </div>
      </header>


      {/* LOGIN SECTION */}
      <main className="flex min-h-[calc(100vh-88px)] items-center justify-center px-6 pb-12">

        <div className="w-full max-w-[430px]">

          {/* HEADING */}
          <div className="mb-8 text-center">

            <h1 className="text-4xl font-bold tracking-tight text-black">
              Welcome back
            </h1>

            <p className="mt-3 text-[15px] text-gray-500">
              Sign in to continue learning smarter.
            </p>

          </div>


          {/* LOGIN CARD */}
          <div
            className="
              rounded-[28px]
              border border-gray-200
              bg-white
              p-8
              shadow-[0_10px_40px_rgba(0,0,0,0.06)]
            "
          >

            {/* EMAIL */}
            <div className="mb-5">

              <label className="mb-2 block text-sm font-medium text-gray-800">
                Email address
              </label>

              <div
                className="
                  group
                  flex items-center
                  rounded-2xl
                  border border-gray-200
                  bg-white
                  px-4
                  transition-all duration-300
                  focus-within:border-black
                  focus-within:shadow-[0_0_0_3px_rgba(0,0,0,0.06)]
                "
              >

                <Mail
                  size={19}
                  className="mr-3 text-gray-400 transition-colors duration-300 group-focus-within:text-black"
                />

               <input
               type="email"
                placeholder="alice@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  h-12
                  w-full
                  bg-transparent
                  text-sm
                  text-black
                  outline-none
                  placeholder:text-gray-400
                "
                />

              </div>

            </div>


            {/* PASSWORD */}
            <div className="mb-3">

              <div className="mb-2 flex items-center justify-between">

                <label className="text-sm font-medium text-gray-800">
                  Password
                </label>

                <button
                  type="button"
                  className="
                    text-xs
                    font-medium
                    text-gray-500
                    transition-colors duration-200
                    hover:text-black
                  "
                >
                  Forgot password?
                </button>

              </div>


              <div
                className="
                  group
                  flex items-center
                  rounded-2xl
                  border border-gray-200
                  bg-white
                  px-4
                  transition-all duration-300
                  focus-within:border-black
                  focus-within:shadow-[0_0_0_3px_rgba(0,0,0,0.06)]
                "
              >

                <Lock
                  size={19}
                  className="mr-3 text-gray-400 transition-colors duration-300 group-focus-within:text-black"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    h-12
                    w-full
                    bg-transparent
                    text-sm
                    text-black
                    outline-none
                    placeholder:text-gray-400
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
                    ml-2
                    rounded-full
                    p-1.5
                    text-gray-400
                    transition-all duration-200
                    hover:bg-gray-100
                    hover:text-black
                  "
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>


            {/* REMEMBER ME */}
            <div className="mb-6 mt-5 flex items-center gap-2">

              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 cursor-pointer accent-black"
              />

              <label
                htmlFor="remember"
                className="cursor-pointer text-sm text-gray-500"
              >
                Remember me
              </label>

            </div>


            {/* LOGIN BUTTON */}
              <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="
                group
                flex w-full
                items-center justify-center gap-2
                rounded-2xl
                bg-black
                py-3.5
                text-[15px]
                font-semibold
                text-white
                shadow-md
                transition-all duration-300
                hover:-translate-y-0.5
                hover:bg-gray-800
                hover:shadow-lg
                active:translate-y-0
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {isSubmitting ? "Signing in..." : "Sign in"}

              {!isSubmitting && (
                <ArrowRight
                  size={18}
                  className="
                    transition-transform duration-300
                    group-hover:translate-x-1
                  "
                />
              )}
            </button>


            {/* DIVIDER */}
            <div className="my-7 flex items-center gap-4">

              <div className="h-px flex-1 bg-gray-200" />

              <span className="text-xs text-gray-400">
                OR
              </span>

              <div className="h-px flex-1 bg-gray-200" />

            </div>


            {/* GOOGLE BUTTON */}
            <button
              className="
                flex w-full
                items-center justify-center gap-3
                rounded-2xl
                border border-gray-200
                bg-white
                py-3.5
                text-[15px]
                font-medium
                text-gray-800
                transition-all duration-300
                hover:-translate-y-0.5
                hover:border-gray-400
                hover:bg-gray-50
                hover:shadow-sm
              "
            >

              <span className="text-base font-bold">
                G
              </span>

              Continue with Google

            </button>


            {/* REGISTER */}
            <p className="mt-7 text-center text-sm text-gray-500">

              Don't have an account?

              <button
                type="button"
                onClick={() => onNavigate?.("register")}
                className="
                  ml-1
                  font-semibold
                  text-black
                  underline-offset-4
                  transition-all duration-200
                  hover:underline
                "
              >
                Create account
              </button>

            </p>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Login;