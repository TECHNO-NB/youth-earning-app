"use client";

import React, { useMemo, useRef, useState } from "react";
import { RefreshCw, Sparkles } from "lucide-react";
import logo from "../../../public/logoyeapng.png";
import Image from "next/image";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ParticlesBackground from "@/components/Background";


type Prize = {
  id: number;
  label: string;
  color?: string;
};

const defaultPrizes: Prize[] = [
  { id: 0, label: "10 INR" },
  { id: 1, label: "50 INR" },
  { id: 2, label: "100 INR" },
  { id: 3, label: "200 INR" },
  { id: 4, label: "300 INR" },
  { id: 5, label: "500 INR" },
  { id: 6, label: "Thanks" },
  { id: 7, label: "1000 INR" },
];

export default function LuckyWheel({
  prizes = defaultPrizes,
  size = 320,
}: {
  prizes?: Prize[];
  size?: number;
}) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Prize | null>(null);
  const [angle, setAngle] = useState(0);
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const user = useSelector((state: any) => state.user);
  const router=useRouter();

  const segments = useMemo(() => prizes.length, [prizes.length]);
  const segmentAngle = 360 / segments;

  // bright and vibrant color palette
  const brightColors = [
    "#FF4D4D", // bright red
    "#FFD93D", // yellow
    "#4DFF4D", // neon green
    "#4DB8FF", // sky blue
    "#FF66CC", // pink
    "#FF914D", // orange
    "#AA66FF", // purple
    "#00FFFF", // cyan
  ];

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    const winningIndex = Math.floor(Math.random() * segments);
    const fullTurns = 6 + Math.floor(Math.random() * 3);
    const targetAngle =
      fullTurns * 360 +
      (360 - (winningIndex * segmentAngle + segmentAngle / 2));
    const randomJitter = (Math.random() - 0.5) * 10;
    const finalAngle = targetAngle + randomJitter;

    setAngle((prev) => prev + finalAngle);

    const duration = 6000;
    setTimeout(() => {
      setSpinning(false);
      setResult(prizes[winningIndex]);
    }, duration + 100);
  };

  const reset = () => {
    if (spinning) return;
    setAngle(0);
    setResult(null);
    if (wheelRef.current) {
      wheelRef.current.style.transform = `rotate(0deg)`;
    }
  };

  return (
    <div className="flex flex-col items-center mb-16  min-h-[100vh]  bg-[#050505] text-white px-4 py-0 ">
      <ParticlesBackground/>
      <div className="w-full z-2 flex items-center justify-center mb-10">
        <Image
          src={logo}
          className="flex z-2  mt-2 items-center justify-center "
          alt="logo"
          height={50}
          width={50}
        />
      </div>
      <h1 className="text-3xl z-2 sm:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
        🎯 Lucky Wheel
      </h1>

      <div className="relative z-50" style={{ width: size, height: size }}>
        {/* glow ring */}
        <div
          className="absolute z-4 inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow:
              "0 0 60px rgba(0,255,255,0.3), 0 0 90px rgba(255,0,255,0.2)",
          }}
        />

        {/* wheel */}
        <div
          ref={wheelRef}
          className="rounded-full relative z-0 border-3 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)]"
          style={{
            width: size,
            height: size,
            transform: `rotate(${angle}deg)`,
            transition: spinning
              ? "transform 6s cubic-bezier(0.22, 1, 0.36, 1)"
              : "transform 400ms ease-out",
            background: "radial-gradient(circle, #121212, #050505)",
          }}
        >
          <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
            <g transform={`translate(${size / 2}, ${size / 2})`}>
              {prizes.map((p, i) => {
                const startAngle = (i * segmentAngle - 90) * (Math.PI / 180);
                const endAngle =
                  ((i + 1) * segmentAngle - 90) * (Math.PI / 180);
                const r = size / 2;
                const x1 = Math.cos(startAngle) * r;
                const y1 = Math.sin(startAngle) * r;
                const x2 = Math.cos(endAngle) * r;
                const y2 = Math.sin(endAngle) * r;
                const path = `M 0 0 L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;

                const midAngle =
                  ((i + 0.5) * segmentAngle - 90) * (Math.PI / 180);
                const labelRadius = r * 0.68;
                const lx = Math.cos(midAngle) * labelRadius;
                const ly = Math.sin(midAngle) * labelRadius;

                return (
                  <g key={i}>
                    <path
                      d={path}
                      fill={brightColors[i % brightColors.length]}
                      stroke="rgba(0,0,0,0.3)"
                      strokeWidth={1}
                    />
                    <g transform={`translate(${lx}, ${ly})`}>
                      <text
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#fff"
                        fontSize={Math.max(10, size / 28)}
                        fontWeight={700}
                        transform={`rotate(${-(i + 0.5) * segmentAngle})`}
                      >
                        {p.label}
                      </text>
                    </g>
                  </g>
                );
              })}
              <circle
                cx={0}
                cy={0}
                r={size * 0.13}
                fill="#111"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={2}
              />
              <text
                x={0}
                y={5}
                textAnchor="middle"
                fill="#fff"
                fontSize={Math.max(12, size / 24)}
                fontWeight={700}
              >
                SPIN
              </text>
            </g>
          </svg>
        </div>

        {/* Pointer */}
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2"
          style={{ transform: `translateY(-8px)` }}
        >
          <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[22px] border-b-yellow-400 drop-shadow-[0_0_15px_rgba(255,255,0,0.8)]" />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col z-2 sm:flex-row items-center gap-4 mt-8">
        {user.package === "Y5" ? (
          <button
            onClick={spin}
            disabled={spinning}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold shadow-lg transition-transform active:scale-95 ${
              spinning
                ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 via-yellow-400 to-cyan-400 text-black hover:opacity-90"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {spinning ? "Spinning..." : "Spin"}
          </button>
        ) : (
          <>
            <h1>
              You need package | Level{" "}
              <span className="text-yellow-400 font-bold text-xl">"Y5"</span>{" "}
              for SPIN
            </h1>
            <Button
              onClick={() => router.push("/level")}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-5 py-2 rounded-lg"
            >
              Upgrade Package
            </Button>
          </>
        )}

        <button
          onClick={reset}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition"
        >
          <RefreshCw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="mt-6 px-5 py-3 rounded-xl bg-gradient-to-br from-[#111] to-[#1a1a1a] border border-gray-700 shadow-[0_0_20px_rgba(255,255,255,0.1)] text-center">
          <p className="text-lg font-semibold text-yellow-400">🎉 You Won!</p>
          <p className="text-2xl font-bold text-white mt-1">{result.label}</p>
        </div>
      )}

      {!result && !spinning && (
        <p className="text-gray-400 mt-4 text-sm">Tap Spin to try your luck</p>
      )}
    </div>
  );
}
