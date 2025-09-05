import { Link, useLocation } from "wouter";
import { Home, History, Settings } from "lucide-react";

export function Navigation() {
  const [location] = useLocation();
  
  return (
    <nav className="bg-card border-b border-border sticky top-0 z-40">
      <div className="max-w-md mx-auto px-4">
        <div className="flex">
          <Link href="/" className="flex-1">
            <button 
              data-testid="nav-home"
              className={`w-full py-3 px-4 text-center font-medium transition-colors duration-200 border-b-2 text-xs sm:text-sm ${
                location === "/" 
                  ? "text-primary border-primary" 
                  : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted"
              }`}
            >
              <Home className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Home
            </button>
          </Link>
          <Link href="/history" className="flex-1">
            <button 
              data-testid="nav-history"
              className={`w-full py-3 px-4 text-center font-medium transition-colors duration-200 border-b-2 text-xs sm:text-sm ${
                location === "/history" 
                  ? "text-primary border-primary" 
                  : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted"
              }`}
            >
              <History className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              History
            </button>
          </Link>
          <Link href="/manage-items" className="flex-1">
            <button 
              data-testid="nav-manage-items"
              className={`w-full py-3 px-4 text-center font-medium transition-colors duration-200 border-b-2 text-xs sm:text-sm ${
                location === "/manage-items" 
                  ? "text-primary border-primary" 
                  : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted"
              }`}
            >
              <Settings className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Manage
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
