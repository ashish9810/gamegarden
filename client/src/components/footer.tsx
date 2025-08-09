import { Gamepad2 } from "lucide-react";
import { SiX, SiFacebook, SiInstagram } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-electric-blue to-vibrant-pink rounded-xl flex items-center justify-center">
                <Gamepad2 className="text-white text-xl" />
              </div>
              <span className="font-display font-bold text-2xl bg-gradient-to-r from-electric-blue to-vibrant-pink bg-clip-text text-transparent">
                GameHub
              </span>
            </div>
            <p className="text-gray-400 text-lg mb-6 max-w-md">
              Your go-to destination for quick, fun, and engaging games. Challenge yourself and friends anytime, anywhere.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-electric-blue transition-colors duration-200">
                <SiX />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-electric-blue transition-colors duration-200">
                <SiFacebook />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-electric-blue transition-colors duration-200">
                <SiInstagram />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#games" className="text-gray-400 hover:text-white transition-colors duration-200">Games</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-white transition-colors duration-200">About Us</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors duration-200">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Games */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Games</h4>
            <ul className="space-y-2">
              <li><a href="/word-finder" className="text-gray-400 hover:text-white transition-colors duration-200">Word Finder</a></li>
              <li><a href="/npat" className="text-gray-400 hover:text-white transition-colors duration-200">NPAT</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Coming Soon</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 mt-12 text-center">
          <p className="text-gray-400">
            &copy; 2024 GameHub. All rights reserved. Built with ❤️ for gamers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
