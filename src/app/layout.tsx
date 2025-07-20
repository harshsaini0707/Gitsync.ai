import "~/styles/globals.css";

import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Gitsync",
  description: "Created By Harsh Saini",
  icons: [{ rel: "icon", url: "/logo.png" }],
};

// Load the Geist font with Tailwind variable


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning >
        <body className="min-h-screen font-sans antialiased">
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <Toaster richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
