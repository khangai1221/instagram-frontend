"use client";

import "./globals.css";
import Header from "@/app/components/Header";
import { UserContextProvider } from "@/app/providers/UserProvider";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Pages where we want to hide the left sidebar
  const noSidebarPages = ["/signin", "/signup"];
  const showSidebar = mounted && !noSidebarPages.includes(pathname);

  // Mark as mounted on client
  useEffect(() => setMounted(true), []);

  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white">
        <UserContextProvider>
          <div className={`flex flex-col lg:flex-row min-h-screen`}>
            {/* Left Sidebar Navigation */}
            {showSidebar && <Header />}

            {/* Main Content */}
            <main
              className={`flex-1 min-h-screen overflow-y-auto p-4 ${
                showSidebar ? "lg:ml-64" : ""
              }`}
            >
              {children}
            </main>

            {/* Right Sidebar */}
            {showSidebar && (
              <aside className="hidden xl:block w-80 border-l border-gray-800 p-6">
                <div className="sticky top-6">{/* Sidebar content */}</div>
              </aside>
            )}
          </div>
        </UserContextProvider>
      </body>
    </html>
  );
}
