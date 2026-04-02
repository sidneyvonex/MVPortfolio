import { useEffect, useState } from "react";

const STATUSES = [
  "Connecting to server...",
  "Server is waking up — free tier life ☕",
  "Fetching your data...",
  "Hang tight, almost there...",
  "Still loading... (the server was napping)",
  "Good things take time. Bad things take longer.",
];

const PageLoader = () => {
  const [statusIndex, setStatusIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setStatusIndex((i) => (i + 1) % STATUSES.length);
        setVisible(true);
      }, 350);
    }, 2800);
    return () => clearInterval(cycle);
  }, []);

  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[#060812]">
      {/* Soft radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(26,86,255,0.12),transparent)]" />

      {/* Animated ring */}
      <div className="relative mb-10 h-20 w-20">
        {/* Outer slow ring */}
        <span
          className="absolute inset-0 rounded-full border-2 border-[#1A56FF]/20"
          style={{ animation: "spin 3s linear infinite" }}
        />
        {/* Inner fast arc */}
        <span
          className="absolute inset-1.5 rounded-full border-2 border-transparent border-t-[#6EE7B7] border-r-[#4C7CFF]"
          style={{ animation: "spin 0.9s linear infinite" }}
        />
        {/* Center dot */}
        <span className="absolute inset-[28%] rounded-full bg-[#1A56FF]/60 blur-[2px]" />
      </div>

      {/* Title */}
      <p className="mb-2 text-sm font-semibold tracking-[0.22em] text-white/80 uppercase">
        Loading
      </p>

      {/* Cycling status */}
      <p
        className="h-5 text-center text-xs text-[#7A92CC] transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {STATUSES[statusIndex]}
      </p>

      {/* Thin shimmer bar at the very bottom */}
      <div className="absolute bottom-0 left-0 h-0.5 w-full overflow-hidden bg-[#0C1733]">
        <div
          className="h-full w-1/3 bg-linear-to-r from-transparent via-[#4C7CFF] to-transparent"
          style={{ animation: "shimmer 1.8s ease-in-out infinite" }}
        />
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
};

export default PageLoader;
