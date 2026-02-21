import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import bgImage from "../assets/background.jpg";
import bgImage2 from "../assets/bg2.jpg";
import { Database, FileText, University, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, role } = useAuth();

  const onHomeClick = () => {
    console.log("here");
    if (!isLoggedIn) {
      navigate("/");
      return;
    }

    if (role === "admin") {
      navigate("/departments");
    } else {
      navigate(`/department/${user.departmentId}`);
    }
  };

  const fullText = "Tathyakosh";
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let index = 5;
    let timeoutId;

    const type = () => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
        timeoutId = setTimeout(type, 150); // typing speed
      } else {
        // pause after full word
        timeoutId = setTimeout(() => {
          index = 5;
          setTypedText(fullText.slice(0, index));
          type();
        }, 1000); // 1 second pause
      }
    };

    type();

    return () => clearTimeout(timeoutId);
  }, []);

  /* Disable browser scroll restoration */
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  /* Force scroll to top */
  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, []);

  /* Card animation on scroll */
  const [showCards, setShowCards] = useState(false);
  const cardSectionRef = useRef(null);

  useEffect(() => {
    let observer;

    const startObserver = () => {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShowCards(true);
            observer.disconnect();
          }
        },
        { threshold: 0.25 },
      );

      if (cardSectionRef.current) {
        observer.observe(cardSectionRef.current);
      }
    };

    const timeout = setTimeout(startObserver, 200);

    return () => {
      clearTimeout(timeout);
      observer && observer.disconnect();
    };
  }, []);

  return (
    <>
      <Navbar />

      {/* ================= GLOBAL STYLES ================= */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
          @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0; }
        }


        .animate-fade-in {
          animation: fadeIn 1.2s ease-out forwards;
        }

        .feature-card {
          backdrop-filter: blur(12px);
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(0,0,0,0.1);
          transition: all 0.35s ease;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 22px 50px rgba(0,0,0,0.15);
        }

        .card-hidden {
          opacity: 0;
          transform: translateY(40px);
        }

        .card-visible {
          opacity: 1;
          transform: translateY(0);
          transition: all 0.8s ease;
        }
      `}</style>

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[90h] w-full bg-white overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute top-0 left-0 w-full h-[85vh] bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        />

        {/* Gradient Overlay */}
        <div className="absolute top-0 left-0 w-full h-[85vh] bg-gradient-to-r from-black/80 via-black/60 to-transparent" />

        {/* Hero Content */}
        <div className="relative z-10 h-[65vh] flex items-center pt-24 sm:pt-28 md:pt-32">
          <div className="max-w-4xl px-6 sm:px-10 md:px-20 animate-fade-in">
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold tracking-wide uppercase">
              {typedText}
              {/* <span className="animate-cursor">|</span> */}
            </h1>

            <p className="mt-4 text-white/90 text-lg sm:text-xl md:text-2xl font-light">
              University Academic Data Repository
            </p>

            <div className="mt-6 w-80 h-[2px] bg-white" />

            <p className="mt-6 text-white/80 text-lg leading-relaxed max-w-2xl">
              A centralized platform for managing students, teachers, courses,
              departments, and academic projects with institutional accuracy,
              transparency, and control.
            </p>

            {/* Action Buttons */}

            <div className="mt-10 flex gap-6 flex-wrap">
              {!isLoggedIn ? (
                <button
                  onClick={() => navigate("/login")}
                  className="bg-white text-black px-8 py-3 rounded-3xl text-sm font-medium
                           hover:bg-black hover:text-white transition"
                >
                  Login
                </button>
              ) : (
                <button
                  onClick={onHomeClick}
                  className="bg-white text-black px-8 py-3 rounded-3xl text-sm font-medium
                           hover:bg-black hover:text-white transition"
                >
                  Go To Home
                </button>
              )}

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white text-white px-8 py-3 rounded-3xl text-sm font-medium
                           hover:bg-white hover:text-black transition"
              >
                Know More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURE SECTION ================= */}
      <section
        ref={cardSectionRef}
        className="bg-gradient-to-b from-white via-gray-50 to-white py-32"
      >
        <div className=" mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* LEFT IMAGE */}
            <div className="hidden lg:flex items-center justify-center p-20 bg-white">
              <div
                className="relative w-full h-full rounded-2xl bg-cover bg-center"
                style={{ backgroundImage: `url(${bgImage2})` }}
              >
                {/* subtle overlay */}
                <div className="absolute inset-0 rounded-2xl bg-black/20" />
              </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className="px-6 md:px-16 py-24">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Why Tathyakosh?
              </h2>

              <div className="mt-16 grid gap-10 sm:grid-cols-1 md:grid-cols-2">
                {/* CARD 1 */}
                <div
                  className={`feature-card rounded-2xl p-8 md:p-10
                      ${showCards ? "card-visible" : "card-hidden"}`}
                  style={{ transitionDelay: "0.1s" }}
                >
                  <Database size={36} className="mb-5" />
                  <h3 className="text-lg font-semibold mb-3">
                    Structured Academic Records
                  </h3>
                  <p className="text-black/70 leading-relaxed">
                    Maintain authoritative, well-structured records of students,
                    teachers, courses, and projects with institutional
                    consistency.
                  </p>
                </div>

                {/* CARD 2 */}
                <div
                  className={`feature-card rounded-2xl p-8 md:p-10
                    ${showCards ? "card-visible" : "card-hidden"}`}
                  style={{ transitionDelay: "0.25s" }}
                >
                  <FileText size={36} className="mb-5" />
                  <h3 className="text-lg font-semibold mb-3">
                    Academic Reports & Records
                  </h3>
                  <p className="text-black/70 leading-relaxed">
                    Generate structured academic reports including student
                    records, course allocations, and departmental summaries.
                  </p>
                </div>

                {/* CARD 3 */}
                <div
                  className={`feature-card rounded-2xl p-8 md:p-10
                    ${showCards ? "card-visible" : "card-hidden"}`}
                  style={{ transitionDelay: "0.4s" }}
                >
                  <University size={36} className="mb-5" />
                  <h3 className="text-lg font-semibold mb-3">
                    Designed for Universities
                  </h3>
                  <p className="text-black/70 leading-relaxed">
                    Built around real university workflows, academic
                    hierarchies, and institutional governance models.
                  </p>
                </div>

                {/* CARD 4 – ROLE BASED ACCESS */}
                <div
                  className={`feature-card rounded-2xl p-8 md:p-10
                    ${showCards ? "card-visible" : "card-hidden"}`}
                  style={{ transitionDelay: "0.55s" }}
                >
                  <ShieldCheck size={36} className="mb-5" />
                  <h3 className="text-lg font-semibold mb-3">
                    Role Based Access Control
                  </h3>
                  <p className="text-black/70 leading-relaxed">
                    This application supports two access roles:{" "}
                    <strong>Admin</strong> and <strong>Data Manager</strong>,
                    ensuring secure and controlled management of academic data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default LandingPage;
