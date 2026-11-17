export default function Logo({ text }: { text: string }) {
  const initial = text.trim().charAt(0).toUpperCase();
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[1.4rem] font-extrabold text-mint"
    >
      {initial}
    </span>
  );
}