"use client";

import { useEffect, useRef, useState } from "react";
import { FaRegCommentDots, FaRegImage, FaRegPaperPlane, FaRegUser, FaXmark } from "react-icons/fa6";

type Comment = {
  id: string;
  name: string;
  message: string;
  avatar_url: string | null;
  created_at: string;
};

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const api = (q = "") => `${SB_URL}/rest/v1/comments${q}`;

// new sb_publishable_ keys go in the apikey header only; legacy JWT keys also need Bearer
const baseHeaders: Record<string, string> = {
  apikey: SB_KEY ?? "",
  "Content-Type": "application/json",
};
if (SB_KEY?.startsWith("eyJ")) baseHeaders.Authorization = `Bearer ${SB_KEY}`;

const MAX_BYTES = 5 * 1024 * 1024;
const AVATAR_PX = 256;

const field =
  "w-full rounded-xl border border-white/15 bg-white/5 py-3 pl-11 pr-4 font-medium text-paper outline-none transition placeholder:text-paper/45 focus:border-mint";
const sendBtn =
  "flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-mint px-6 py-3.5 text-[1.05rem] font-bold text-white shadow-lg shadow-mint/30 transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-wait disabled:opacity-60";

function timeAgo(iso: string) {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  const m = s / 60;
  if (m < 60) return `${Math.floor(m)} min ago`;
  const h = m / 60;
  if (h < 24) return `${Math.floor(h)}h ago`;
  const d = h / 24;
  if (d < 30) return `${Math.floor(d)}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// center-crop to a square and shrink to 256px JPEG before uploading
async function makeAvatar(file: File): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = () => rej(new Error("image"));
      i.src = url;
    });
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    const canvas = document.createElement("canvas");
    canvas.width = AVATAR_PX;
    canvas.height = AVATAR_PX;
    const g = canvas.getContext("2d")!;
    g.drawImage(
      img,
      (img.naturalWidth - side) / 2,
      (img.naturalHeight - side) / 2,
      side,
      side,
      0,
      0,
      AVATAR_PX,
      AVATAR_PX,
    );
    return await new Promise<Blob>((res, rej) =>
      canvas.toBlob((b) => (b ? res(b) : rej(new Error("blob"))), "image/jpeg", 0.85),
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

function Avatar({ name, src }: { name: string; src: string | null }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" width={44} height={44} loading="lazy" className="h-11 w-11 shrink-0 rounded-full object-cover" />;
  }
  return (
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 font-extrabold uppercase text-mint">
      {name.trim().charAt(0) || "?"}
    </span>
  );
}

export default function Comments() {
  const enabled = Boolean(SB_URL && SB_KEY);
  const [items, setItems] = useState<Comment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(enabled);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [trap, setTrap] = useState("");
  const [photo, setPhoto] = useState<{ blob: Blob; preview: string } | null>(null);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    fetch(api("?select=id,name,message,avatar_url,created_at&order=created_at.desc&limit=50"), {
      headers: { ...baseHeaders, Prefer: "count=exact" },
    })
      .then(async (r) => {
        if (!r.ok) throw new Error("load");
        const range = r.headers.get("content-range");
        const data: Comment[] = await r.json();
        if (!alive) return;
        setItems(data);
        setTotal(Number(range?.split("/")[1]) || data.length);
      })
      .catch(() => alive && setErr("Could not load comments."))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [enabled]);

  function removePhoto() {
    if (photo) URL.revokeObjectURL(photo.preview);
    setPhoto(null);
  }

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (!f.type.startsWith("image/")) return setErr("Please choose an image file.");
    if (f.size > MAX_BYTES) return setErr("This photo is larger than 5 MB.");
    try {
      const blob = await makeAvatar(f);
      removePhoto();
      setPhoto({ blob, preview: URL.createObjectURL(blob) });
      setErr("");
    } catch {
      setErr("Could not read this image.");
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (trap) return; // honeypot
    const n = name.trim();
    const m = message.trim();
    if (n.length < 2 || n.length > 40) return setErr("Name must be 2 to 40 characters.");
    if (m.length < 2 || m.length > 500) return setErr("Comment must be 2 to 500 characters.");
    let last = 0;
    try {
      last = Number(localStorage.getItem("cm_last") ?? 0);
    } catch {}
    if (Date.now() - last < 30000) return setErr("Please wait a few seconds before posting again.");

    setSending(true);
    setErr("");
    try {
      let avatar_url: string | null = null;
      if (photo) {
        const file = `${crypto.randomUUID()}.jpg`;
        const up = await fetch(`${SB_URL}/storage/v1/object/avatars/${file}`, {
          method: "POST",
          headers: { ...baseHeaders, "Content-Type": "image/jpeg" },
          body: photo.blob,
        });
        if (!up.ok) throw new Error("upload");
        avatar_url = `${SB_URL}/storage/v1/object/public/avatars/${file}`;
      }
      const r = await fetch(api(), {
        method: "POST",
        headers: { ...baseHeaders, Prefer: "return=representation" },
        body: JSON.stringify({ name: n, message: m, avatar_url }),
      });
      if (!r.ok) throw new Error("post");
      const [row]: Comment[] = await r.json();
      setItems((p) => [row, ...p]);
      setTotal((t) => t + 1);
      setName("");
      setMessage("");
      removePhoto();
      try {
        localStorage.setItem("cm_last", String(Date.now()));
      } catch {}
    } catch (e2) {
      setErr(
        e2 instanceof Error && e2.message === "upload"
          ? "Could not upload the photo. Remove it or try again."
          : "Could not post your comment. Please try again.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="glass h-full rounded-3xl p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-3.5 border-b border-white/10 pb-5">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-[1.1rem]">
          <FaRegCommentDots aria-hidden="true" />
        </span>
        <h3 className="text-[1.4rem] font-extrabold">
          Comments <span className="font-medium opacity-60">({total})</span>
        </h3>
      </div>

      {!enabled ? (
        <p className="py-10 text-center opacity-70">Comments are coming soon.</p>
      ) : (
        <>
          <form onSubmit={submit} className="grid gap-5" noValidate>
            <div>
              <label htmlFor="cm-name" className="mb-1.5 block font-medium">Name</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-paper/50" aria-hidden="true">
                  <FaRegUser />
                </span>
                <input
                  id="cm-name" value={name} onChange={(e) => setName(e.target.value)}
                  maxLength={40} placeholder="Your name" className={field} autoComplete="name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="cm-msg" className="mb-1.5 block font-medium">Comment</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-4 text-paper/50" aria-hidden="true">
                  <FaRegCommentDots />
                </span>
                <textarea
                  id="cm-msg" value={message} onChange={(e) => setMessage(e.target.value)}
                  maxLength={500} rows={4} placeholder="Write your comment here..." className={`${field} resize-y`}
                />
              </div>
            </div>

            <div>
              <span className="mb-1.5 block font-medium">Profile photo (optional)</span>
              <input ref={fileRef} type="file" accept="image/*" onChange={pick} className="hidden" />
              {photo ? (
                <div className="flex items-center gap-4 rounded-xl border border-white/15 bg-white/5 p-3">
                  <Avatar name="" src={photo.preview} />
                  <span className="grow text-[0.95rem] opacity-80">Photo ready</span>
                  <button
                    type="button" onClick={removePhoto}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-[0.9rem] font-bold transition hover:bg-white/10"
                  >
                    <FaXmark aria-hidden="true" /> Remove
                  </button>
                </div>
              ) : (
                <button
                  type="button" onClick={() => fileRef.current?.click()}
                  className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-dashed border-white/25 bg-white/[0.03] py-4 font-bold transition hover:border-mint/60 hover:bg-white/[0.06]"
                >
                  <FaRegImage aria-hidden="true" /> Choose profile photo
                </button>
              )}
              <p className="mt-2 text-center text-[0.85rem] opacity-60">Max file size 5 MB</p>
            </div>

            {/* honeypot */}
            <input
              value={trap} onChange={(e) => setTrap(e.target.value)} tabIndex={-1}
              autoComplete="off" aria-hidden="true" className="hidden" name="website"
            />

            <button type="submit" disabled={sending} className={sendBtn}>
              <FaRegPaperPlane aria-hidden="true" />
              {sending ? "Sending..." : "Send comment"}
            </button>
            {err && <p role="alert" className="text-coral">{err}</p>}
          </form>

          <div className="mt-6 max-h-[380px] overflow-y-auto pr-2">
            {loading ? (
              <p className="py-6 text-center opacity-60">Loading...</p>
            ) : items.length === 0 ? (
              <p className="py-6 text-center opacity-60">No comments yet. Be the first!</p>
            ) : (
              <ul className="divide-y divide-white/10">
                {items.map((c) => (
                  <li key={c.id} className="flex gap-4 py-4">
                    <Avatar name={c.name} src={c.avatar_url} />
                    <div className="min-w-0 grow">
                      <div className="flex items-baseline justify-between gap-3">
                        <b className="truncate font-bold">{c.name}</b>
                        <span className="shrink-0 text-[0.85rem] opacity-60">{timeAgo(c.created_at)}</span>
                      </div>
                      <p className="mt-0.5 break-words opacity-90">{c.message}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}