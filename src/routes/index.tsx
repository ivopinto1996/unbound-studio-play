import { createFileRoute } from "@tanstack/react-router";
import { CupolaShell } from "@/components/cupola/Shell";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cupola — Suite de módulos de IA" },
      { name: "description", content: "Protótipo da shell do Cupola: separadores de intenção, Operations, LeadFlow e BOMify." },
      { property: "og:title", content: "Cupola — Suite de módulos de IA" },
      { property: "og:description", content: "Protótipo da shell do Cupola com LeadFlow e BOMify." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <>
      <CupolaShell />
      <Toaster position="bottom-center" />
    </>
  ),
});
