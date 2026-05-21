import { CTABanner } from "@/components/cta-banner";
import { SobreSection } from "@/components/sections";

export const metadata = { title: "Sobre · I Simpósio CBMAP 2026" };

export default function SobrePage() {
  return (
    <>
      <SobreSection />
      <CTABanner />
    </>
  );
}
