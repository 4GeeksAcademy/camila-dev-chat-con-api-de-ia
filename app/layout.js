import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Levante | Respuestas Rápidas",
  description:
    "Resolvemos tus dudas al instante. Consultá acá sobre nuestros horarios, zonas de envío, stock diario y cómo conservar tus panes de masa madre.",
    openGraph: {
      title: "Levante | Respuestas Rápidas",
      description:
        "Resolvemos tus dudas al instante. Consultá acá sobre nuestros horarios, zonas de envío, stock diario y cómo conservar tus panes de masa madre."
      }
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
