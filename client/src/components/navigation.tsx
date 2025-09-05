import { Link, useLocation } from "wouter";
import { Home, History } from "lucide-react";

export function Navigation() {
  const [location] = useLocation();
  
  return (
    <nav className="bg-card border-b border-border sticky top-0 z-40">
      <div className="max-w-md mx-auto px-4">
        <div className="flex">
          <Link href="/" className="flex-1">
            <button 
              data-testid="nav-home"
              className={`w-full py-4 px-6 text-center font-medium transition-colors duration-200 border-b-2 ${
                location === "/" 
                  ? "text-primary border-primary" 
                  : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted"
              }`}
            >
              <Home className="inline w-4 h-4 mr-2" />
              Home
            </button>
          </Link>
          <Link href="/history" className="flex-1">
            <button 
              data-testid="nav-history"
              className={`w-full py-4 px-6 text-center font-medium transition-colors duration-200 border-b-2 ${
                location === "/history" 
                  ? "text-primary border-primary" 
                  : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted"
              }`}
            >
              <History className="inline w-4 h-4 mr-2" />
              History
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
