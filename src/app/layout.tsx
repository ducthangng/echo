import type { Metadata } from "next";
import { Inter, Lexend } from "next/font/google";
import "./globals.css";
import Layout from "@/src/components/Layout";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// Load Lexend font
const lexend = Lexend({ 
  subsets: ["latin"], 
  variable: "--font-lexend",
  weight: ["400", "500", "600"] 
});

export const metadata: Metadata = {
  title: "EduFun - Student Portal",
  description: "A fun educational platform for students",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Apply both font variables to the body */}
      <body className={`${inter.variable} ${lexend.variable} font-sans`}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}