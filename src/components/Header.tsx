import { Palette, Home, BookmarkCheck, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Palette className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-creative bg-clip-text text-transparent">
              Moodboard Generator
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" className="text-foreground hover:text-primary">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary">
              <BookmarkCheck className="w-4 h-4 mr-2" />
              My Boards
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button variant="outline" size="sm" className="md:hidden">
            Menu
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;