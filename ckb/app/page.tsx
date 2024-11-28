import Link from "next/link";
import { XpubkeyForm } from "./xpubkey";

export default function Home() {
  return (
    <>
      <div className="bg-slate-100 w-full text-right px-8 py-2">
        <Link href="https://github.com/yanguoyu/web3-tools/tree/main/ckb">
          Source Code
        </Link>
      </div>
      <div className="font-[family-name:var(--font-geist-sans)] flex flex-col gap-4 p-8 items-center">
        <XpubkeyForm />
      </div>
    </>
  );
}
