export default function AmbientGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden -z-10"
    >
      <div
        className="absolute top-[-15%] right-[-10%] w-[50rem] h-[50rem] rounded-full blur-[160px] opacity-[0.10] animate-drift"
        style={{
          background:
            "radial-gradient(circle, rgba(124,147,255,0.9) 0%, rgba(124,147,255,0) 65%)",
        }}
      />
    </div>
  );
}
