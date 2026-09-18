import { useEffect } from "react";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { Toaster } from "@/components/ui/toaster";
import {
  Toaster as Sonner,
  toast,
} from "@/components/ui/sonner";

import { TooltipProvider } from "@/components/ui/tooltip";

import { onSessionExpired } from "./lib/api";

/* Pages */
import Index from "./pages/Index";
import Tjanster from "./pages/Tjanster";
import Webbshop from "./pages/Webbshop";
import Careers from "./pages/Careers";
import NotFound from "./pages/NotFound";

/* Global */



const queryClient = new QueryClient();


/* =========================================================
   SCROLL MANAGEMENT
   ========================================================= */

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    /*
     * Om URL:en innehåller t.ex.
     * /tjanster#ai
     *
     * scrollar vi till den sektionen.
     */
    if (hash) {
      const id = hash.replace("#", "");

      const scrollToSection = () => {
        const element = document.getElementById(id);

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      };

      /*
       * Ger sidan en liten stund att renderas
       * innan vi försöker hitta sektionen.
       */
      const timeout = window.setTimeout(
        scrollToSection,
        100
      );

      return () => window.clearTimeout(timeout);
    }

    /*
     * Vanligt sidbyte:
     * börja högst upp.
     */
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname, hash]);

  return null;
}


/* =========================================================
   SESSION EXPIRY
   ========================================================= */

function SessionExpiryListener() {
  const navigate = useNavigate();

  useEffect(() => {
    onSessionExpired(() => {
      /*
       * Töm gammal företagsdata.
       */
      queryClient.clear();

      /*
       * Informera användaren.
       */
      toast.error(
        "Din session har löpt ut. Logga in igen."
      );

      /*
       * Webbshop innehåller fortfarande
       * den autentiserade delen.
       */
      navigate("/webbshop");
    });
  }, [navigate]);

  return null;
}


/* =========================================================
   APP
   ========================================================= */

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>

        <Toaster />
        <Sonner />

        <BrowserRouter>

          <ScrollManager />

          <SessionExpiryListener />

          <Routes>

            {/* Main site */}
            <Route
              path="/"
              element={<Index />}
            />

            <Route
              path="/tjanster"
              element={<Tjanster />}
            />

            <Route
              path="/om-oss"
              element={<Careers />}
            />


            {/* Webbshop / customer area */}
            <Route
              path="/webbshop"
              element={<Webbshop />}
            />


            {/* =========================================
                LEGACY URLS

                Behåll gamla länkar fungerande.
                ========================================= */}

            <Route
              path="/mobila-vaxlar"
              element={
                <Navigate
                  to="/tjanster#telefoni"
                  replace
                />
              }
            />

            <Route
              path="/korjournaler"
              element={
                <Navigate
                  to="/tjanster#mobilitet"
                  replace
                />
              }
            />

            <Route
              path="/support"
              element={
                <Navigate
                  to="/tjanster#support"
                  replace
                />
              }
            />

            <Route
              path="/ai"
              element={
                <Navigate
                  to="/tjanster#ai"
                  replace
                />
              }
            />


            {/* Catch-all */}
            <Route
              path="*"
              element={<NotFound />}
            />

          </Routes>


        </BrowserRouter>

      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;