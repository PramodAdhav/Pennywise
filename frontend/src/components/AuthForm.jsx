import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const navigate = useNavigate();

  // ✅ Name validation
  const handleNameChange = (e) => {
    const val = e.target.value;
    if (/^[A-Za-z\s]*$/.test(val)) setSignupUsername(val);
  };

  // ✅ Password validation
  const isValidPassword = (pass) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/.test(pass);

  // --- LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://pennywise-tan.vercel.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gmail: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/home");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Login failed");
    }
  };

  // --- SIGNUP ---
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!isValidPassword(signupPassword)) {
      toast.error(
        "Password must contain at least 8 characters, an uppercase, a lowercase, a number, and a symbol."
      );
      return;
    }

    try {
      const res = await fetch("http://pennywise-tan.vercel.app/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gmail: signupEmail,
          username: signupUsername.trim(),
          password: signupPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/home");
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Signup failed");
    }
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 bg-white rounded-2xl shadow-lg relative overflow-hidden text-black border border-gray-300">
      {/* Tabs */}
      <div className="flex justify-around mb-6 sm:mb-8 relative z-10">
        <button
          className={`pb-2 text-base sm:text-lg ${
            isLogin ? "border-b-2 border-blue-600 font-semibold" : ""
          } text-black`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={`pb-2 text-base sm:text-lg ${
            !isLogin ? "border-b-2 border-blue-600 font-semibold" : ""
          } text-black`}
          onClick={() => setIsLogin(false)}
        >
          Signup
        </button>
      </div>

      {/* Forms */}
      <div className="relative">
        {/* LOGIN FORM */}
        <form
          onSubmit={handleLogin}
          className={`transition-all duration-500 flex flex-col gap-3 sm:gap-4 ${
            isLogin
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-full absolute top-0 left-0 w-full"
          }`}
        >
          <input
            placeholder="Email"
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            className="border p-2.5 sm:p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black text-sm sm:text-base"
            required
          />
          <div className="relative">
            <input
              placeholder="Password"
              type={showLoginPassword ? "text" : "password"}
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="border p-2.5 sm:p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full pr-10 text-black text-sm sm:text-base"
              required
            />
            <button
              type="button"
              onClick={() => setShowLoginPassword(!showLoginPassword)}
              className="absolute right-3 top-2.5 sm:top-3 text-gray-600"
            >
              {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button className="bg-[#1f1f1f] text-white p-2.5 sm:p-3 rounded-lg font-semibold hover:bg-blue-700 transition text-sm sm:text-base">
            Login
          </button>
        </form>

        {/* SIGNUP FORM */}
        <form
          onSubmit={handleSignup}
          className={`transition-all duration-500 flex flex-col gap-3 sm:gap-4 ${
            !isLogin
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-full absolute top-0 left-0 w-full"
          }`}
        >
          <input
            placeholder="Full Name"
            value={signupUsername}
            onChange={handleNameChange}
            className="border p-2.5 sm:p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black text-sm sm:text-base"
            required
          />
          <input
            placeholder="Email"
            type="email"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
            className="border p-2.5 sm:p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black text-sm sm:text-base"
            required
          />
          <div className="relative">
            <input
              placeholder="Password"
              type={showSignupPassword ? "text" : "password"}
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              className="border p-2.5 sm:p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full pr-10 text-black text-sm sm:text-base"
              required
            />
            <button
              type="button"
              onClick={() => setShowSignupPassword(!showSignupPassword)}
              className="absolute right-3 top-2.5 sm:top-3 text-gray-600"
            >
              {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 -mt-2">
            Must contain uppercase, lowercase, number, and a symbol.
          </p>

          <button className="bg-[#1f1f1f] text-white p-2.5 sm:p-3 rounded-lg font-semibold hover:bg-blue-700 transition text-sm sm:text-base">
            Signup
          </button>
        </form>
      </div>
    </div>
  );
}
