export default function AmbientGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden -z-10"
    >
      <div
        className="absolute top-[-10%] right-[-5%] w-[46rem] h-[46rem] rounded-full blur-[130px] opacity-[0.14] animate-drift"
        style={{
          background:
            "radial-gradient(circle, rgba(124,147,255,0.9) 0%, rgba(124,147,255,0) 70%)",
        }}
      />
    </div>
  );
}
