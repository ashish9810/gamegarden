import { motion } from "framer-motion";
import { Link } from "wouter";
import { Search, List, Star, Play, Clock } from "lucide-react";

export default function GamesShowcase() {
  return (
    <section id="games" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-gray-900 mb-4">
            Choose Your
            <span className="bg-gradient-to-r from-electric-blue to-vibrant-pink bg-clip-text text-transparent">
              {" "}Adventure
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Pick from our collection of brain-teasing games designed to challenge and entertain
          </p>
        </motion.div>

        {/* Games Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Word Finder Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100"
          >
            {/* Game Image */}
            <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-electric-blue to-vibrant-pink p-1">
              <img
                src="https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=400"
                alt="Crossword puzzle grid with letters"
                className="w-full h-48 object-cover rounded-xl"
              />
              
              {/* Overlay with Game Icon */}
              <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <Search className="text-2xl text-electric-blue" />
                </div>
              </div>
            </div>

            {/* Game Content */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-2xl text-gray-900">Word Finder</h3>
                <div className="flex items-center space-x-1 text-sunny-yellow">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
              
              <p className="text-gray-600 text-lg leading-relaxed">
                Find hidden words in the forest of letters. Challenge your vocabulary and pattern recognition skills in this addictive word search adventure.
              </p>

              {/* Game Features */}
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-3 py-1 bg-electric-blue/10 text-electric-blue rounded-full text-sm font-medium">Solo Play</span>
                <span className="px-3 py-1 bg-neon-green/10 text-green-600 rounded-full text-sm font-medium">Multiple Levels</span>
                <span className="px-3 py-1 bg-vibrant-pink/10 text-pink-600 rounded-full text-sm font-medium">Timed Challenges</span>
              </div>

              {/* CTA Button */}
              <Link href="/word-finder">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full mt-6 bg-gradient-to-r from-electric-blue to-vibrant-pink text-white font-display font-bold py-4 px-6 rounded-2xl hover:shadow-lg transition-all duration-300"
                >
                  <Play className="inline mr-2" size={20} />
                  Start Playing
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* NPAT Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100"
          >
            {/* Game Image */}
            <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-neon-green to-sunny-yellow p-1">
              <img
                src="https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=400"
                alt="Colorful alphabet learning cards"
                className="w-full h-48 object-cover rounded-xl"
              />
              
              {/* Overlay with Game Icon */}
              <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <List className="text-2xl text-neon-green" />
                </div>
              </div>
            </div>

            {/* Game Content */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-2xl text-gray-900">Name, Place, Animal, Thing</h3>
                <div className="flex items-center space-x-1 text-sunny-yellow">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
              
              <p className="text-gray-600 text-lg leading-relaxed">
                The classic NPAT challenge. Test your speed and memory with friends or solo. Race against time to come up with the perfect answers.
              </p>

              {/* Game Features */}
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-3 py-1 bg-neon-green/10 text-green-600 rounded-full text-sm font-medium">Multiplayer</span>
                <span className="px-3 py-1 bg-vibrant-pink/10 text-pink-600 rounded-full text-sm font-medium">Real-time</span>
                <span className="px-3 py-1 bg-electric-blue/10 text-electric-blue rounded-full text-sm font-medium">Categories</span>
              </div>

              {/* CTA Button */}
              <Link href="/npat">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full mt-6 bg-gradient-to-r from-neon-green to-sunny-yellow text-white font-display font-bold py-4 px-6 rounded-2xl hover:shadow-lg transition-all duration-300"
                >
                  <Play className="inline mr-2" size={20} />
                  Start Playing
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Coming Soon Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full text-gray-600 font-medium">
            <Clock className="mr-2" size={20} />
            More exciting games coming soon!
          </div>
        </motion.div>
      </div>
    </section>
  );
}
