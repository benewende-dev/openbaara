import { useTranslations } from "next-intl";
import { HeroSection } from "@/components/sections/HeroSection";
import { OutioSpotlight } from "@/components/sections/OutioSpotlight";
import { ThesisSection } from "@/components/sections/ThesisSection";
import { DivisionsSection } from "@/components/sections/DivisionsSection";
import { SequenceSection } from "@/components/sections/SequenceSection";
import { ToolsSection } from "@/components/sections/ToolsSection";
import { CTARecruitSection } from "@/components/sections/CTARecruitSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <OutioSpotlight />
      <ThesisSection />
      <DivisionsSection />
      <SequenceSection />
      <ToolsSection />
      <CTARecruitSection />
    </>
  );
}
