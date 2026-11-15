import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap py-[20vh]">
      <p className="font-medium text-mint">404</p>
      <h1 className="text-[clamp(2.8rem,10vw,7rem)] font-extrabold leading-[0.92] tracking-[-0.035em]">
        Lost in the grid.
      </h1>
      <Link href="/" className="btn main mt-8">Back home</Link>
    </div>
  );
}