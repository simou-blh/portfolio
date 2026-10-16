import Link from "next/link";
import { site } from "@/data/site";

const links = [
  ["About", "/#about"],
  ["Projects", "/#projects"],
  ["Experience", "/#experience"],
  ["Skills", "/#skills"],
  ["Contact", "/#contact"],
];

export default function Nav() {
  return (
    <nav className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-5 font-medium">
      <Link href="/" className="font-extrabold tracking-tight">{site.short}</Link>
      <div className="flex flex-wrap gap-x-5 gap-y-1.5">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="opacity-85 transition hover:text-mint hover:opacity-100">
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}