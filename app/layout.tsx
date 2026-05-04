// anonymat: aucune métadonnée stockée — pas d'analytics, pas de tracking
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "3 Questions",
  description: "Formulaire anonyme — vos réponses sont totalement anonymes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-950 text-gray-100">
        {children}
      </body>
    </html>
  );
}
