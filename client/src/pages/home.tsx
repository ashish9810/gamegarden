import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import GamesShowcase from "@/components/games-showcase";
import FeatureHighlights from "@/components/feature-highlights";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      <HeroSection />
      <GamesShowcase />
      <FeatureHighlights />
      <Footer />
    </div>
  );
}
