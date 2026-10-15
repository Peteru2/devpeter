import Link from "next/link";
import { Button } from "@/components/ui/Links";

export default function NotFound() {
  return (
    <main className="wrap flex min-h-[70vh] flex-col justify-center py-24">
      <p className="font-mono text-xs tracking-[0.06em] text-muted">404 — PAGE NOT FOUND</p>
      <h1 className="mt-4 max-w-[720px] font-serif text-[clamp(44px,6vw,72px)] leading-[1.02]">
        This page didn’t make it to production.
      </h1>
      <p className="mt-5 max-w-[520px] text-lg text-muted">
        The link may be old or mistyped. Everything else is still running.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3">
        <Button href="/">Back home</Button>
        <Link href="/work" className="inline-flex min-h-11 items-center border-b border-line text-[15px] font-medium hover:border-ink">
          See all work
        </Link>
      </div>
    </main>
  );
}