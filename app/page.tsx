import { LanguageProvider } from "@/components/LanguageProvider";
import { Landing } from "@/components/Landing";

export default function Home() {
  return (
    <LanguageProvider>
      <Landing />
    </LanguageProvider>
  );
}
