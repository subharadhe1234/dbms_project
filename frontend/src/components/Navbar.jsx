import { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  FileText,
  Shield,
  User,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ active = "" }) => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const { isLoggedIn, role, logout, user } = useAuth();

  const onHomeClick = () => {
    if (!isLoggedIn) {
      navigate("/");
      return;
    }

    if (role === "admin") {
      navigate("/departments");
    } else {
      navigate(`/department/${user.departmentId}`);
    }

    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navBtn = (key) =>
    `flex items-center gap-3 text-xl transition pb-1
     ${
       active === key
         ? "text-black font-semibold"
         : "text-black/70 hover:text-black"
     }`;

  const mobileBtn = (key) =>
    `flex items-center gap-3 text-lg font-medium
     ${active === key ? "text-black" : "text-black/70"}`;

  const go = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-black/10">
      <div className=" mx-auto px-6">
        <div className="flex items-center h-20">
          {/* LOGO */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center cursor-pointer"
          >
            <img src={logo} alt="Logo" className="h-24 w-auto" />
          </div>

          {/* DESKTOP NAV (ONLY IF LOGGED IN) */}
          {isLoggedIn && (
            <div className="hidden md:flex flex-1 justify-center gap-16">
              <button onClick={onHomeClick} className={navBtn("home")}>
                Home
              </button>

              <button
                onClick={() => go("/reports")}
                className={navBtn("reports")}
              >
                Reports
              </button>
            </div>
          )}

          {/* DESKTOP RIGHT */}
          <div className="hidden md:flex items-center gap-6 ml-auto">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 border border-black/30 rounded-md
                         text-black/70 hover:text-black hover:bg-gray-100"
            >
              Know More
            </a>

            {!isLoggedIn ? (
              <button
                onClick={() => go("/login")}
                className="px-6 py-2.5 bg-black text-white rounded-md"
              >
                Login
              </button>
            ) : (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="p-2.5 border border-white bg-black text-white rounded-md"
                >
                  <User size={20} />
                </button>

                {/* PROFILE DROPDOWN */}
                {profileOpen && (
                  <div
                    className="absolute right-0 mt-3 w-40 bg-white border border-black/10
                    rounded-lg shadow-lg z-50"
                  >
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3
                   text-sm text-black hover:bg-gray-100"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MOBILE RIGHT */}
          <div className="flex items-center gap-4 ml-auto md:hidden">
            {!isLoggedIn && (
              <button
                onClick={() => go("/login")}
                className="px-4 py-2 bg-black text-white rounded-md text-sm"
              >
                Login
              </button>
            )}

            <button onClick={() => setOpen(!open)}>
              {open ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />

          {/* DRAWER */}
          <div className="absolute right-0 top-20 w-[50%] bg-white border-l border-black/10 shadow-xl rounded-bl-xl">
            <div className="px-6 py-5 space-y-6">
              {isLoggedIn && (
                <>
                  <button onClick={onHomeClick} className={mobileBtn("home")}>
                    <Home size={20} /> Home
                  </button>

                  <button
                    onClick={() => go("/reports")}
                    className={mobileBtn("reports")}
                  >
                    <FileText size={20} /> Reports
                  </button>

                  <div className="h-px bg-black/10" />
                </>
              )}
              {isLoggedIn && (
                <button
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-3 text-lg font-medium text-black/70 hover:text-black"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              )}

              {/* KNOW MORE */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-lg font-medium text-black/70 hover:text-black"
              >
                <ExternalLink size={20} />
                Know More
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
