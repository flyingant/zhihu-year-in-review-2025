// components/effects/GridBackground.tsx
export default function GridBackground() {
  return (
    <div
      className="fixed inset-0 z-[1] pointer-events-none opacity-10"
      style={{
        backgroundImage: `
          linear-gradient(to right, #3b82f6 1px, transparent 1px),
          linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
        `,
        backgroundSize: '18px 18px'
      }}
    />
  );
}