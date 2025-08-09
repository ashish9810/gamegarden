import { motion } from "framer-motion";
import { Zap, Users, Smartphone } from "lucide-react";

export default function FeatureHighlights() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "No downloads, no waiting. Jump into any game instantly and start playing within seconds.",
      gradient: "from-electric-blue to-vibrant-pink"
    },
    {
      icon: Users,
      title: "Play Together",
      description: "Challenge friends or make new ones. Our games are designed for both solo and group fun.",
      gradient: "from-neon-green to-sunny-yellow"
    },
    {
      icon: Smartphone,
      title: "Any Device",
      description: "Perfect on phone, tablet, or desktop. Your games sync across all your devices seamlessly.",
      gradient: "from-vibrant-pink to-electric-blue"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-gray-900 mb-4">
            Why Choose
            <span className="bg-gradient-to-r from-electric-blue to-vibrant-pink bg-clip-text text-transparent">
              {" "}GameHub?
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform duration-300`}
              >
                <feature.icon className="text-3xl text-white" />
              </motion.div>
              <h3 className="font-display font-bold text-xl text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
