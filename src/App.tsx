import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner, toast } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { onSessionExpired } from "./lib/api"; // Anpassa sökvägen till din api.ts
import Index from "./pages/Index";
import Careers from "./pages/Careers";
import MobilaVaxlar from "./pages/MobilaVaxlar";
import Korjournaler from "./pages/Korjournaler";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import BackToTop from "./components/BackToTop";
import Webbshop from "./pages/Webbshop";

const queryClient = new QueryClient();

// Nollställer scroll-positionen vid varje sidbyte
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}

// Lyssnar globalt på utgångna Django-sessioner (401)
function SessionExpiryListener() {
  const navigate = useNavigate();

  useEffect(() => {
    onSessionExpired(() => {
      // 1. Töm TanStack Query cache så gammal företagsdata inte ligger kvar
      queryClient.clear();

      // 2. Meddela användaren
      toast.error("Din session har löpt ut. Logga in igen.");

      // 3. Navigera till inloggningssidan
      navigate("/webshop");
    });
  }, [navigate]);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <SessionExpiryListener />
        <div className="dark">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/jobba-hos-oss" element={<Careers />} />
            <Route path="/mobila-vaxlar" element={<MobilaVaxlar />} />
            <Route path="/webshop" element={<Webbshop />} />
            <Route path="/korjournaler" element={<Korjournaler />} />
            <Route path="/support" element={<Support />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BackToTop />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;