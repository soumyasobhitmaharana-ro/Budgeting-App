import { Link } from "react-router-dom";
import { useState } from "react";
import money1 from "../assets/money1.jpg";
import money2 from "../assets/money2.jpg";
import money3 from "../assets/money3.jpg";
import { Menu, X } from "lucide-react";

const IndexPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-indigo-100 relative">
      {/* Header */}
      <header className="flex justify-between items-center px-6 md:px-12 py-4 bg-white/80 backdrop-blur shadow-md sticky top-0 z-50">
        <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-700 tracking-wide">
          Money Manager
        </h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-4 md:space-x-6">
          <Link
            to="/"
            className="flex items-center h-full bg-amber-400 px-4 py-2 rounded-lg text-indigo-700 font-medium hover:text-indigo-900 transition"
          >
            Home
          </Link>
          <Link
            to="/login"
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="flex items-center px-4 py-2 bg-indigo-700 text-white rounded-lg shadow hover:bg-indigo-800 transition"
          >
            Sign Up
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-indigo-700" onClick={toggleMenu}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </header>

      {/* Mobile Slide-In Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white/90 backdrop-blur shadow-xl z-50 transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col mt-20 space-y-6 px-6">
          <Link
            to="/"
            onClick={closeMenu}
            className="py-3 px-4 bg-indigo-100 rounded-xl text-indigo-700 font-semibold hover:bg-indigo-200 transition"
          >
            Home
          </Link>
          <Link
            to="/login"
            onClick={closeMenu}
            className="py-3 px-4 bg-indigo-600 rounded-xl text-white font-semibold hover:bg-indigo-700 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            onClick={closeMenu}
            className="py-3 px-4 bg-indigo-700 rounded-xl text-white font-semibold hover:bg-indigo-800 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* Overlay when menu is open */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={closeMenu}
        ></div>
      )}

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center flex-1 px-6 py-12 md:py-20">
        <h2 className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight mb-6">
          Manage Your <span className="text-indigo-600">Finances</span>{" "}
          Effortlessly
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8">
          Track your income, expenses, and savings with ease. Stay in control of
          your money with our all-in-one dashboard.
        </p>
        <Link
          to="/signup"
          className="px-8 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 hover:scale-105 transition transform text-lg font-semibold"
        >
          Get Started
        </Link>
      </main>

      {/* Features Section */}
      <section className="px-6 md:px-16 py-12 bg-white">
        <h3 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          Why Choose <span className="text-indigo-600">Money Manager?</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              img: money1,
              title: "Track Expenses",
              desc: "Get detailed insights on where your money goes and cut down on unnecessary spending.",
            },
            {
              img: money2,
              title: "Monitor Income",
              desc: "Stay on top of your earnings and understand your cash flow better than ever before.",
            },
            {
              img: money3,
              title: "Smart Savings",
              desc: "Build wealth with smart saving tips and personalized financial insights.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl shadow-md p-6 hover:shadow-xl transition flex flex-col items-center text-center"
            >
              <img
                src={item.img}
                alt={item.title}
                className="rounded-xl mb-4 w-full h-48 object-cover"
              />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">
                {item.title}
              </h4>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm bg-white border-t mt-10">
        © {new Date().getFullYear()} Money Manager. Made by Soumya. All rights
        reserved.
      </footer>
    </div>
  );
};

export default IndexPage;
