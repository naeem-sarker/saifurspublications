import FloatingContact from "@/components/common/FloatingContact";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import { GoogleTagManager } from '@next/third-parties/google';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-NXG4MQ83" />
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <FloatingContact />
      </body>
    </html>
  );
}