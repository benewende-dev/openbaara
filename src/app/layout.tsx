// Root layout is handled by src/app/[locale]/layout.tsx
// This file exists only to satisfy Next.js root layout requirement
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
