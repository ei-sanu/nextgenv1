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

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-white">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-white/80">Page not found</h2>
        <p className="mt-2 text-sm text-white/40 leading-relaxed">
          The security perimeter you're looking for doesn't exist or has been relocated.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-xs font-bold uppercase tracking-widest text-black transition-transform hover:scale-105"
          >
            Return to Base
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-bold tracking-tight text-white uppercase mb-2">
          Protocol Failure
        </h1>
        <p className="mt-2 text-sm text-white/40 leading-relaxed mb-8">
          Something went wrong with the interface rendering. 
          The error has been logged for analysis.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-xs font-bold uppercase tracking-widest text-black transition-transform hover:scale-105"
          >
            Restart Protocol
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-3 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md transition-colors hover:bg-white/10"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

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
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
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
