import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import CategoryPage from "@/pages/category";
import AccountPage from "@/pages/account";
import AboutPage from "@/pages/about";
import CraftsmanshipPage from "@/pages/craftsmanship";
import InfoPage from "@/pages/info";
import { AdminPage } from "@/pages/admin";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/account" component={AccountPage} />
      <Route path="/category/:slug" component={CategoryPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/craftsmanship" component={CraftsmanshipPage} />
      <Route path="/contact" component={InfoPage} />
      <Route path="/shipping" component={InfoPage} />
      <Route path="/faq" component={InfoPage} />
      <Route path="/size-guide" component={InfoPage} />
      <Route path="/jewelry-care" component={InfoPage} />
      <Route path="/materials" component={InfoPage} />
      <Route path="/privacy" component={InfoPage} />
      <Route path="/terms" component={InfoPage} />
      <Route path="/blog" component={InfoPage} />
      <Route path="/press" component={InfoPage} />
      <Route path="/new-arrivals" component={Home} />
      <Route path="/admin" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
