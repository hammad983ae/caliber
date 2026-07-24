import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { UseCases } from "@/components/landing/use-cases";
import { Automations } from "@/components/landing/automations";
import { Connectors } from "@/components/landing/connectors";
import { Features } from "@/components/landing/features";
import { Teams } from "@/components/landing/teams";
import { Cta } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero />
        <HowItWorks />
        <UseCases />
        <Automations />
        <Connectors />
        <Features />
        <Teams />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
