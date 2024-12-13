import { HighlightedVerse } from "@/app/page";

interface Props {
  scriptureData?: HighlightedVerse;
  hide: boolean;
}

export default function RenderScripture({ scriptureData, hide }: Props) {
  return (
    <div className={`max-w-full ${scriptureData?.verse ? "" : "opacity-0"}`}>
      <div
        className={`capitalize reference text-4xl font-black pl-24 pr-7 py-3 bg-white text-black w-1/2 duration-300 ease-linear ${hide ? "!text-opacity-0 !opacity-0 !translate-x-12" : ""}`}
      >
        {scriptureData?.book} {scriptureData?.chapter}:{scriptureData?.verse}{" "}
        {scriptureData?.version?.toUpperCase()}
      </div>
      <div
        className={`verse text-4xl font-semibold outline-[30px] leading-[1.35] tracking-wide pl-20 pr-10 pt-10 pb-10 bg-black bg-opacity-80 duration-300 ease-linear delay-100 ${hide ? "!text-opacity-0 !opacity-0 !-translate-x-12" : ""}`}
      >
        {scriptureData?.text}
      </div>
    </div>
  );
}
