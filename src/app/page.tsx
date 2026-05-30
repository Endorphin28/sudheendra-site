import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Hero from "@/components/sections/Hero";
import ProductsPreview from "@/components/sections/ProductsPreview";
import ClinicPreview from "@/components/sections/ClinicPreview";
import ExpertiseSection from "@/components/sections/ExpertiseSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ExpertiseSection />
        <ClinicPreview />
        <ProductsPreview />
      </main>
      <Footer />
    </>
  );
}
