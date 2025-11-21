import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { MessageCircleIcon, LockIcon, MailIcon, UserIcon, LoaderIcon } from "lucide-react";
import { Link } from "react-router";

function SignUpPage() {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#1a053b] to-[#3b0a87] p-4">
      <div className="relative w-full max-w-6xl md:h-[800px] h-[650px] flex items-center justify-center">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row">

            {/* LEFT FORM SECTION */}
            <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-purple-500/20 bg-[#240b52]">
              <div className="w-full max-w-md">

                {/* HEADING */}
                <div className="text-center mb-8">
                  <MessageCircleIcon className="w-12 h-12 mx-auto text-purple-300 mb-4" />
                  <h2 className="text-2xl font-bold text-purple-100 mb-2">Create Account</h2>
                  <p className="text-purple-300">Join Connectify today</p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* FULL NAME */}
                  <div>
                    <label className="auth-input-label text-purple-200">Full Name</label>
                    <div className="relative">
                      <UserIcon className="auth-input-icon text-purple-300" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="input bg-[#2f1066] border-purple-500/20 text-purple-100 placeholder-purple-400"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="auth-input-label text-purple-200">Email</label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon text-purple-300" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input bg-[#2f1066] border-purple-500/20 text-purple-100 placeholder-purple-400"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label className="auth-input-label text-purple-200">Password</label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon text-purple-300" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="input bg-[#2f1066] border-purple-500/20 text-purple-100 placeholder-purple-400"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    className="auth-btn bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/40"
                    type="submit"
                    disabled={isSigningUp}
                  >
                    {isSigningUp ? (
                      <LoaderIcon className="w-full h-5 animate-spin text-center" />
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                {/* LOGIN LINK */}
                <div className="mt-6 text-center">
                  <Link to="/login" className="auth-link text-purple-300 hover:text-purple-200">
                    Already have an account? Login
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT IMAGE SECTION */}
            <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-[#4c1d95]/40 to-[#1e1b4b]/10">
              <div>
                <img
                  src="/signup.png"
                  alt="Connectify Signup Illustration"
                  className="w-3/4 h-auto object-contain mx-auto"
                />

                <div className="mt-6 text-center">
                  <h3 className="text-xl font-medium text-purple-300">Connect Effortlessly</h3>

                  <div className="mt-4 flex justify-center gap-4">
                    <span className="auth-badge bg-purple-700/40 text-purple-200 border-purple-500/30">Free</span>
                    <span className="auth-badge bg-purple-700/40 text-purple-200 border-purple-500/30">Fast</span>
                    <span className="auth-badge bg-purple-700/40 text-purple-200 border-purple-500/30">Secure</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}

export default SignUpPage;
