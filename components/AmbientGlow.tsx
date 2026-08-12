export default function AmbientGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden -z-10"
    >
      <div
        className="absolute top-[-15%] left-[-25%] w-[150%] h-[65%] blur-[110px] opacity-70 animate-streak"
        style={{
          background:
            "linear-gradient(100deg, transparent 8%, rgba(124,147,255,0.28) 42%, rgba(124,147,255,0.4) 50%, rgba(124,147,255,0.22) 58%, transparent 90%)",
        }}
      />
    </div>
  );
}
