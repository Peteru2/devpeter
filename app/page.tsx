import { PersonSchema } from "@/components/layout/PersonSchema";
import { Hero } from "@/components/sections/Hero";
import { Explore } from "@/components/home/Explore";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <PersonSchema />
      <main>
        <Hero />
        <Explore />
        <About />
        <Services />
        <Contact />
      </main>
    </>
  );
}