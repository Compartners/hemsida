import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Careers from "./pages/Careers";
import MobilaVaxlar from "./pages/MobilaVaxlar";
import Korjournaler from "./pages/Korjournaler";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import BackToTop from "./components/BackToTop";
import Webbshop from "./pages/Webbshop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
