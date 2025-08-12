import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";
import { AuthProvider } from "./context/AuthContext";
import RouteGuard from "./components/RouteGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Pressing App ",
  description: "Service de pressing écologique de qualité à Douala, nettoyage de vêtements, linge de maison et textiles divers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <RouteGuard>
            <PageTransition>
              {/* <Navbar/> */}
              {children}
              <Footer/>
            </PageTransition>
          </RouteGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
