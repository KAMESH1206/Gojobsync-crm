import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import AboutUs from '@/components/landing/AboutUs';
import Services from '@/components/landing/Services';
import Features from '@/components/landing/Features';
import NewsBlog from '@/components/landing/NewsBlog';
import FAQ from '@/components/landing/FAQ';
import ContactUs from '@/components/landing/ContactUs';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans overflow-x-hidden">
      <div className="sticky top-0 z-50 bg-white">
        <Navbar />
      </div>
      <Hero />
      <AboutUs />
      <FAQ />
      <Services />
      <Features />
      <NewsBlog />
      <ContactUs />
      <Footer />
    </main>
  );
}
