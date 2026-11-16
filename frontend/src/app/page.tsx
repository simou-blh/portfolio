import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Journey from "@/components/sections/Journey";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <div className="wrap">
      <Nav />
      <main>
        <Hero />
        <About />
        <Projects />
        <Journey />
        <Skills />
      </main>
      <Contact />
    </div>
  );
}