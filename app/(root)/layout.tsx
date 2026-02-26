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
      <div className="max-w-[1224px] mx-auto">
        {children}
      </div>
      <Footer />
    </div>
  );
}
