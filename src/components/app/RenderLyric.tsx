import { SongLyric } from "../../../interface";

interface Props {
  songData?: SongLyric;
  hide: boolean;
}

export default function RenderLyric({ songData, hide }: Props) {
  return (
    <div className={`max-w-full ${songData?.text.length ? "" : "opacity-0"}`}>
      <div
        className={`capitalize reference text-4xl font-black pl-24 pr-7 py-3 bg-white text-black w-full text-center duration-300 ease-linear ${hide ? "!text-opacity-0 !opacity-0 !translate-x-12" : ""}`}
      >
        {songData?.text.map((line, index) => <p key={index}>{line}</p>)}
      </div>
    </div>
  );
}
