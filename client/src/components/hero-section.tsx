import { motion } from "framer-motion";
import { Link } from "wouter";
import { Search, List, Zap, Brain, Trophy, ChevronDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-electric-blue via-vibrant-pink to-neon-green animate-gradient">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Game Elements */}
        <motion.div
          className="absolute top-20 left-10 w-8 h-8 bg-sunny-yellow rounded-full opacity-80"
          animate={{ y: [-20, 20, -20] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-32 right-20 w-6 h-6 bg-white rounded-full opacity-70"
          animate={{ y: [-15, 25, -15] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: -2 }}
        />
        <motion.div
          className="absolute bottom-32 left-20 w-10 h-10 bg-neon-green rounded-lg opacity-60"
          animate={{ y: [-25, 15, -25], rotate: [0, 180, 360] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: -4 }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-12 h-12 bg-vibrant-pink rounded-full opacity-50"
          animate={{ y: [-10, 30, -10] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: -1 }}
        />
        
        {/* Large Background Shapes */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-display font-bold text-4xl sm:text-5xl lg:text-7xl text-white mb-6 leading-tight"
        >
          Your Playground for
          <motion.span
            className="block bg-gradient-to-r from-sunny-yellow to-white bg-clip-text text-transparent"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            Quick & Fun Games
          </motion.span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl sm:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Challenge yourself or friends in quick, addictive games. New games coming soon!
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/word-finder">
            <motion.button
              className="group relative px-8 py-4 bg-white text-electric-blue font-display font-bold text-lg rounded-2xl shadow-2xl min-w-[200px] overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center justify-center">
                <Search className="mr-2" size={20} />
                Play Word Finder
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-electric-blue to-vibrant-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{ opacity: 1 }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-bold">
                <Search className="mr-2" size={20} />
                Play Word Finder
              </span>
            </motion.button>
          </Link>

          <Link href="/npat">
            <motion.button
              className="group px-8 py-4 bg-transparent border-2 border-white text-white font-display font-bold text-lg rounded-2xl hover:bg-white hover:text-electric-blue min-w-[200px] transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <List className="inline mr-2" size={20} />
              Play NPAT
            </motion.button>
          </Link>
        </motion.div>

        {/* Hero Illustration Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 flex justify-center space-x-8"
        >
          <div className="text-center text-white/80">
            <motion.div
              className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-2 mx-auto"
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Zap className="text-2xl" />
            </motion.div>
            <span className="text-sm font-medium">Word Games</span>
          </div>
          <div className="text-center text-white/80">
            <motion.div
              className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-2 mx-auto"
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: -2 }}
            >
              <Brain className="text-2xl" />
            </motion.div>
            <span className="text-sm font-medium">Memory Tests</span>
          </div>
          <div className="text-center text-white/80">
            <motion.div
              className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-2 mx-auto"
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: -4 }}
            >
              <Trophy className="text-2xl" />
            </motion.div>
            <span className="text-sm font-medium">Challenges</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80"
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="text-2xl" />
      </motion.div>
    </section>
  );
}
