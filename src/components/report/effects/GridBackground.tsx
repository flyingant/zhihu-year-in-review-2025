// components/effects/GridBackground.tsx
export default function GridBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-transparent">
      <div
        className="absolute inset-0 z-[20] pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #3b82f6 1px, transparent 1px),
            linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
          `,
          backgroundSize: '18px 18px'
        }}
      />
      {children}
    </div>
  );
}