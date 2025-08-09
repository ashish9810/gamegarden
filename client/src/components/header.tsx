import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Gamepad2, Menu, X } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="relative z-50 bg-white/95 backdrop-blur-sm shadow-lg sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/">
            <motion.div 
              className="flex items-center space-x-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-electric-blue to-vibrant-pink rounded-xl flex items-center justify-center">
                <Gamepad2 className="text-white text-xl" />
              </div>
              <span className="font-display font-bold text-2xl bg-gradient-to-r from-electric-blue to-vibrant-pink bg-clip-text text-transparent">
                GameHub
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#games" className="font-medium text-gray-700 hover:text-electric-blue transition-colors duration-200">
              Games
            </a>
            <a href="#about" className="font-medium text-gray-700 hover:text-electric-blue transition-colors duration-200">
              About
            </a>
            <a href="#contact" className="font-medium text-gray-700 hover:text-electric-blue transition-colors duration-200">
              Contact
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-electric-blue transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="text-xl" /> : <Menu className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-t"
        >
          <div className="px-4 py-2 space-y-2">
            <a href="#games" className="block py-2 text-gray-700 hover:text-electric-blue transition-colors duration-200">
              Games
            </a>
            <a href="#about" className="block py-2 text-gray-700 hover:text-electric-blue transition-colors duration-200">
              About
            </a>
            <a href="#contact" className="block py-2 text-gray-700 hover:text-electric-blue transition-colors duration-200">
              Contact
            </a>
          </div>
        </motion.div>
      )}
    </header>
  );
}
