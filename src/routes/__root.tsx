import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import React, { useState, useEffect, createContext, useContext } from "react";

import appCss from "../styles.css?url";
import { MotionProvider } from "@/components/interactive/MotionProvider";
import { CursorSystem } from "@/components/interactive/CursorSystem";
import { DistortionCanvas } from "@/components/interactive/DistortionCanvas";
import { GlobalLoaderProvider } from "@/components/interactive/GlobalLoader";
import { AuthModal } from "@/components/interactive/AuthModal";
import { Navbar } from "@/components/site/Navbar";

type User = {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'analyst';
} | null;

const AuthContext = createContext<{
  user: User;
  setUser: (user: User) => void;
  openAuth: () => void;
  logout: () => void;
}>({ 
  user: null, 
  setUser: () => {}, 
  openAuth: () => {},
  logout: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SENTINEL — Absolute Security" },
      { name: "description", content: "Advanced Cyber Security System" },
      { name: "author", content: "Team NextGen" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));

      const handleAuthFailure = () => {
          handleSetUser(null);
          localStorage.removeItem("accessToken");
      };

      window.addEventListener("auth-failure", handleAuthFailure);
      return () => window.removeEventListener("auth-failure", handleAuthFailure);
  }, []);

  const handleSetUser = (u: User) => {
      setUser(u);
      if (u) localStorage.setItem("user", JSON.stringify(u));
      else localStorage.removeItem("user");
  };

  const logout = async () => {
      try {
          await fetch("/api/auth/logout", { method: "POST" });
      } catch (err) {
          console.error("Logout failed", err);
      } finally {
          handleSetUser(null);
          localStorage.removeItem("accessToken");
      }
  };

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <AuthContext.Provider value={{ user, setUser: handleSetUser, openAuth: () => setIsAuthOpen(true), logout }}>
            <MotionProvider>
                <GlobalLoaderProvider>
                    <Navbar />
                    <AuthModal 
                        isOpen={isAuthOpen} 
                        onClose={() => setIsAuthOpen(false)} 
                        onSuccess={handleSetUser} 
                    />
                    <CursorSystem />
                    <DistortionCanvas />
                    {children}
                </GlobalLoaderProvider>
            </MotionProvider>
        </AuthContext.Provider>
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
