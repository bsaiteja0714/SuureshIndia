import { useEffect, useState } from "react";
import Navbar              from "../components/Navbar";
import Hero                from "../components/Hero";
import AboutSection        from "../components/AboutSection";
import ServicesPreview     from "../components/ServicesPreview";
import StatsSection        from "../components/StatsSection";

import CTASection          from "../components/CTASection";
import Footer              from "../components/Footer";
import { homePageAPI } from "../services/api";

function Home() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    homePageAPI.get()
      .then(data => {
        setContent(data);
      })
      .catch(err => console.error("Error loading home page content:", err));
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <AboutSection content={content} />
      <ServicesPreview />
      <StatsSection content={content} />

      <CTASection />
      <Footer />
    </>
  );
}

export default Home;
