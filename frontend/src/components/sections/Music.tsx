import Section from "@/components/Section";
import Reveal from "@/components/motion/Reveal";
import { music } from "@/data/music";

function toEmbed(url: string) {
  const m = url.match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(playlist|album|track|artist)\/([A-Za-z0-9]+)/);
  return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=generator&theme=0` : null;
}

export default function Music() {
  const embed = music.playlistUrl ? toEmbed(music.playlistUrl) : null;
  const hasSongs = music.songs.length > 0;
  if (!embed && !hasSongs && process.env.NODE_ENV === "production") return null;

  return (
    <Section id="music" label="Playlist" title="Music while I build.">
      <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <p className="max-w-[44ch] text-[clamp(1.05rem,1.6vw,1.3rem)] font-medium leading-[1.5] text-paper/85">
            The music that keeps me going while I turn ideas into working products. Here is what I have been playing lately.
          </p>
          {music.playlistUrl && (
            <a href={music.playlistUrl} target="_blank" rel="noopener" className="btn mt-8 inline-flex">
              Open on Spotify
            </a>
          )}
        </Reveal>

        <Reveal delay={0.1}>
          <div className="glass rounded-3xl p-3">
            {embed ? (
              <iframe
                title="Spotify playlist"
                src={embed}
                width="100%"
                height="352"
                style={{ border: 0, borderRadius: 14 }}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            ) : hasSongs ? (
              <ul className="divide-y divide-white/10">
                {music.songs.map((s, i) => {
                  const row = (
                    <div className="flex items-center gap-4 px-4 py-3.5">
                      <span className="w-6 text-sm opacity-60">{i + 1}</span>
                      <div>
                        <b className="block font-bold leading-tight">{s.title}</b>
                        <span className="text-[0.95rem] opacity-70">{s.artist}</span>
                      </div>
                    </div>
                  );
                  return (
                    <li key={s.title + s.artist}>
                      {s.url ? <a href={s.url} target="_blank" rel="noopener" className="block hover:bg-white/5">{row}</a> : row}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="p-8 text-center opacity-70">Dev only: set playlistUrl in src/data/music.ts</p>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}