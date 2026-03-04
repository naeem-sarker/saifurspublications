import FloatingContact from "@/components/common/FloatingContact";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar />
      
        {children}
      
      <Footer />
      <FloatingContact />
    </div>
  );
}
