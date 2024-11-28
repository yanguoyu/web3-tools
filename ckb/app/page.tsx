import { XpubkeyForm } from "./xpubkey";

export default function Home() {
  return (
    <div className="font-[family-name:var(--font-geist-sans)] flex flex-col gap-4 p-8 items-center">
      <XpubkeyForm />
    </div>
  );
}
