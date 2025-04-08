import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({
  subsets:["latin"]
})

export const metadata = {
  title: "Vehiql",
  description: "Find Your Dream Vechicles",
  icons: [
    {
      rel: "icon",
      url: "/logo.png",
      sizes: "256x256",
      type: "image/png",
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>

    <html lang="en">
      <body
        className={`${inter.className} `}
      >
        <Header/>
        <main className="min-h-screen ">
        {children}
        </main>
        <Toaster richColors/>
          <footer className="bg-blue-50 py-8">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p>
                Made By Vikram DP
              </p>
            </div>
          </footer>
      </body>
    </html>
        </ClerkProvider>
  );
}
