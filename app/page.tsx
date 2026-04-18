import Navbar from "./components/Navbar";
import PriceTicker from "./components/PriceTicker";
import HeroSection from "./components/HeroSection";
import StatsSection from "./components/StatsSection";
import PriceSection from "./components/PriceSection";
import ArtikelSection from "./components/ArtikelSection";
import EdukasiSection from "./components/EdukasiSection";
import KonverterSection from "./components/KonverterSection";
import FAQSection from "./components/FAQSection";
import Footer from "./components/Footer";
import SectionObserver from "./components/SectionObserver";

export default function Home() {
  return (
    <main className="min-h-screen">
      <SectionObserver />
      <Navbar />
      <PriceTicker />
      <HeroSection />
      <StatsSection />
      <PriceSection />
      <ArtikelSection />
      <EdukasiSection />
      <KonverterSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
