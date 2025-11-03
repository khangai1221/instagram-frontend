// app/layout.tsx
"use client";

import "./globals.css";
import Header from "@/app/components/Header";
import { UserContextProvider } from "@/app/providers/UserProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white">
        <UserContextProvider>
          <div className="flex">
            {/* Left Sidebar Navigation */}
            <Header />

            {/* Main Content */}
            <main className="flex-1 ml-20 sm:ml-64 min-h-screen overflow-y-auto">
              {children}
            </main>

            {/* Right Sidebar (Suggestions) */}
            <aside className="hidden xl:block w-80 border-l border-gray-800 p-6">
              <div className="sticky top-6">
                {/* Add your Sidebar.tsx or suggestions here */}
              </div>
            </aside>
          </div>
        </UserContextProvider>
      </body>
    </html>
  );
}
