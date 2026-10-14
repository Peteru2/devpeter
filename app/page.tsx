import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PersonSchema } from "@/components/layout/PersonSchema";
import { Hero } from "@/components/sections/Hero";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { About } from "@/components/sections/About";
import { Principles } from "@/components/sections/Principles";
import { Services } from "@/components/sections/Services";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <PersonSchema />
      <Navbar />
      <main id="top">
        <Hero />
        <SelectedWork />
        <About />
        <Principles />
        <Services />
        <Contact />
      </main>
      <Footer />
    </>
  );
}