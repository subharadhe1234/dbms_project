import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import bgImage from "../assets/bg2.jpg";

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [animate, setAnimate] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
    setAnimate(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);

      if (user.role === "admin") {
        navigate("/departments", { replace: true });
      } else {
        navigate(`/department/${user.departmentId}`, { replace: true });
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-6 overflow-hidden">
      {/* LOGIN CARD */}
      <div
        className={`w-full max-w-5xl bg-white border border-black/10 shadow-2xl rounded-3xl overflow-hidden
        grid grid-cols-1 lg:grid-cols-2
        transition-all duration-700 ease-out
        ${animate ? "translate-x-0 opacity-100" : "translate-x-24 opacity-0"}`}
      >
        {/* LEFT — IMAGE */}
        <div
          className="hidden lg:block bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className="h-full w-full bg-black/30" />
        </div>

        {/* RIGHT — FORM */}
        <div className="flex flex-col justify-center px-10 md:px-16 py-20">
          {/* TITLE */}
          <h1
            onClick={() => navigate("/")}
            className="text-4xl font-bold text-black mb-3 cursor-pointer"
          >
            Tathyakosh
          </h1>

          <p className="text-black/60 mb-12">
            University Academic Data Repository
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-black/30 rounded-lg px-4 py-3
                           focus:outline-none focus:border-black"
                placeholder="name@university.edu"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-black/30 rounded-lg px-4 py-3
                           focus:outline-none focus:border-black"
                placeholder="••••••••"
              />
            </div>

            {/* ERROR MESSAGE (requested position) */}
            {error && (
              <p className="text-red-600 text-sm font-medium">{error}</p>
            )}

            {/* ACTION */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-lg text-base font-medium transition
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* FOOTER */}
          <p className="mt-10 text-sm text-black/60">
            Authorized university personnel only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
