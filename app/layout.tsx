
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Header from "@/components/Header";
import { defaultUrl } from "@/utils/config";
import { Toaster } from "react-hot-toast";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};


const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster
            position="top-center"
            reverseOrder={false}
          />
          <main className="min-h-screen flex flex-col items-center w-full">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
              <Header />

              {/* Main Content */}
              <div className="flex flex-col max-w-5xl p-5">
                {children}
              </div>
            </div>
          </main>
        </ThemeProvider>
      </body >
    </html >
  );
}
