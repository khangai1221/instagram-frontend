import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { UserContextProvider } from "./providers/UserProvider";

export const metadata: Metadata = {
  title: "Instagram",
  description:
    "Instagram is a popular social media platform where users can share photos, videos, and stories with their followers. It allows people to connect, discover, and engage with content from friends, creators, and brands around the world. Instagram offers features like Reels for short videos, Stories for temporary updates, Direct Messages for private chats, and Explore for discovering trending content. It’s a visual-first platform that emphasizes creativity, self-expression, and community interaction.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <UserContextProvider>
          {children}
          <Toaster richColors position="top-center" />
        </UserContextProvider>
      </body>
    </html>
  );
}
