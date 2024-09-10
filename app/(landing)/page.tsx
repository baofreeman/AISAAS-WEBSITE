import Content from "@/components/landing/content";
import Footer from "@/components/landing/footer";
import Hero from "@/components/landing/hero";
import Navbar from "@/components/landing/navbar";

const LandingPage = () => {
  return (
    <div className="h-full">
      <Navbar />
      <Hero />
      <Content />
      <Footer />
    </div>
  );
};

export default LandingPage;
