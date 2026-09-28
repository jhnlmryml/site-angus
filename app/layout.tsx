import type { Metadata, Viewport } from "next";
import {
    Geist,
    Geist_Mono,
    Noto_Sans,
    Raleway,
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toast";
import { AuthProvider } from "@/components/context/AuthProvider";

const notoSansHeading = Noto_Sans({
    subsets: ["latin"],
    variable: "--font-heading",
    display: "swap",
});

const raleway = Raleway({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});

const geistSans = Geist({
    subsets: ["latin"],
    variable: "--font-geist-sans",
    display: "swap",
});

const geistMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-geist-mono",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Site VIP | Angus Shield",
    description: "Keep your tradie business in the black. Out-simple them.",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: "#020617",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={cn(
                "h-full select-none font-sans antialiased dark",
                geistSans.variable,
                geistMono.variable,
                raleway.variable,
                notoSansHeading.variable
            )}
        >
        <body className="h-full min-h-0 overflow-hidden bg-[#020617] text-slate-100 antialiased">
        <AuthProvider>
            {children}
            <Toaster />
        </AuthProvider>
        </body>
        </html>
    );
}