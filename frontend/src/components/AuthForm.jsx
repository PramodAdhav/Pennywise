import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const navigate = useNavigate();

  // --- LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gmail: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/home"); // redirect to Home page
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  // --- SIGNUP ---
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gmail: signupEmail,
          username: signupUsername,
          password: signupPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // Optionally auto-login after signup
        localStorage.setItem("token", data.token);
        navigate("/home");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Signup failed");
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg relative overflow-hidden text-black">
      {/* Tabs */}
      <div className="flex justify-around mb-6 relative z-10">
        <button
          className={`pb-2 ${isLogin ? "border-b-2 border-blue-600 font-semibold" : ""} text-black`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={`pb-2 ${!isLogin ? "border-b-2 border-blue-600 font-semibold" : ""} text-black`}
          onClick={() => setIsLogin(false)}
        >
          Signup
        </button>
      </div>

      {/* Forms */}
      <div className="relative">
        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className={`transition-all duration-500 flex flex-col gap-4 ${
            isLogin ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full absolute top-0 left-0 w-full"
          }`}
        >
          <input
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
          />
          <input
            placeholder="Password"
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
          />
          <button className="bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Login
          </button>
        </form>

        {/* Signup Form */}
        <form
          onSubmit={handleSignup}
          className={`transition-all duration-500 flex flex-col gap-4 ${
            !isLogin ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full absolute top-0 left-0 w-full"
          }`}
        >
          <input
            placeholder="Full Name"
            value={signupUsername}
            onChange={(e) => setSignupUsername(e.target.value)}
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
          />
          <input
            placeholder="Email"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
          />
          <input
            placeholder="Password"
            type="password"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
          />
          <button className="bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Signup
          </button>
        </form>
      </div>
    </div>
  );
}
