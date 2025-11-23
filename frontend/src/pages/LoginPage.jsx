import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  MailIcon,
  LockIcon,
  LoaderIcon,
  MessageCircleIcon,
} from "lucide-react";
import { Link } from "react-router";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#E9D8FD] via-[#D6E4FF] to-[#F3E8FF]">
      <div className="w-full max-w-4xl mx-auto">

        {/* Glass Card */}
        <div className="backdrop-blur-xl bg-white/60 shadow-2xl border border-white/30 rounded-3xl overflow-hidden flex flex-col md:flex-row">

          {/* LEFT SECTION (FORM) */}
          <div className="md:w-1/2 p-10 flex flex-col justify-center">

            <div className="text-center mb-8">
              <MessageCircleIcon className="w-12 h-12 mx-auto text-indigo-500 drop-shadow-md" />
              <h2 className="text-3xl font-semibold text-gray-800 mt-3">
                Welcome Back
              </h2>
              <p className="text-gray-500 mt-1">Log in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="text-gray-700 font-medium">Email</label>
                <div className="relative mt-1">
                  <MailIcon className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 
                    focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 
                    bg-white text-gray-800 placeholder-gray-400"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-gray-700 font-medium">Password</label>
                <div className="relative mt-1">
                  <LockIcon className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="password"
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 
                    focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 
                    bg-white text-gray-800 placeholder-gray-400"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 rounded-xl text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 
                transition-all shadow-lg disabled:opacity-60"
              >
                {isLoggingIn ? (
                  <LoaderIcon className="mx-auto h-5 w-5 animate-spin" />
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <p className="text-center text-gray-600 mt-5">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-indigo-600 font-medium hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>

          {/* RIGHT SECTION (ILLUSTRATION) */}
          <div className="md:w-1/2 bg-gradient-to-b from-indigo-500/20 to-purple-500/10 flex items-center justify-center p-10">
            <div className="text-center">
              <img
                src="/login.png"
                className="w-64 mx-auto drop-shadow-xl"
                alt="Login Illustration"
              />
              <h3 className="text-xl mt-6 font-medium text-indigo-700">
                Welcome Again!
              </h3>

              <div className="mt-4 flex justify-center gap-3">
                <span className="px-4 py-1 bg-white/70 rounded-full text-indigo-700 text-sm shadow">
                  Free
                </span>
                <span className="px-4 py-1 bg-white/70 rounded-full text-indigo-700 text-sm shadow">
                  Fast
                </span>
                <span className="px-4 py-1 bg-white/70 rounded-full text-indigo-700 text-sm shadow">
                  Secure
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
