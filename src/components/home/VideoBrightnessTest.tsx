import { useState } from "react";
import fogVideo from "@/assets/fog_video.mp4";
import fallVideo from "@/assets/fall.mp4";
import winterVideo from "@/assets/winter.mp4";

const videos = [
  { name: "Fog — standard", src: fogVideo },
  { name: "Fall — höst", src: fallVideo },
  { name: "Winter — vinter", src: winterVideo },
];

const VideoBrightnessTest = () => {
  const [brightness, setBrightness] = useState([100, 100, 100]);

  return (
    <div className="min-h-screen bg-[#050607] p-8 text-white">
      <h1 className="mb-6 text-2xl font-semibold">
        Video brightness test
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        {videos.map((video, index) => (
          <div key={video.name} className="space-y-4">
            <h2 className="text-sm font-medium">{video.name}</h2>

            <video
              src={video.src}
              autoPlay
              muted
              loop
              playsInline
              className="aspect-video w-full rounded-lg object-cover"
              style={{ filter: `brightness(${brightness[index]}%)` }}
            />

            <div className="flex items-center justify-between text-sm">
              <label htmlFor={`brightness-${index}`}>
                Brightness
              </label>
              <span>{brightness[index]}%</span>
            </div>

            <input
              id={`brightness-${index}`}
              type="range"
              min="40"
              max="160"
              value={brightness[index]}
              onChange={(event) => {
                const next = [...brightness];
                next[index] = Number(event.target.value);
                setBrightness(next);
              }}
              className="w-full"
            />

            <button
              onClick={() =>
                setBrightness((current) =>
                  current.map((value, i) => i === index ? 100 : value)
                )
              }
              className="text-xs text-white/60 hover:text-white"
            >
              Reset to 100%
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoBrightnessTest;
