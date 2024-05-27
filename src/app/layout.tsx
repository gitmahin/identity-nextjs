import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import "./globals.css";
import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    absolute:"",
    default:"Identity - NextJs",
    template:"%s | Identity"
  },
  description: "NextJS App with full Authentication. Share your identity to people and explore other identities.",
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header/>
        {children}
        <Toaster
          position="bottom-center"
          reverseOrder={false}
          toastOptions={
            {duration: 2000}
          }
        />
      </body>
    </html>
  );
}
