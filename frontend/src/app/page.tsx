import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Journey from "@/components/sections/Journey";
import Portfolio from "@/components/sections/Portfolio";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <div className="wrap">
      <Nav />
      <main>
        <Hero />
        <About />
        <Journey />
        <Portfolio />
      </main>
      <Contact />
    </div>
  );
}