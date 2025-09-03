import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (keyword: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      onSearch(keyword.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter keywords for your moodboard (e.g., 'modern minimalist', 'vintage luxury', 'forest nature')..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-12 pr-32 h-14 text-lg bg-card/50 backdrop-blur-sm border-2 focus:border-primary shadow-soft"
          />
          <Button
            type="submit"
            size="lg"
            className="absolute right-2 bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate
          </Button>
        </div>
      </form>
      
      {/* Quick suggestions */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <span className="text-sm text-foreground/70">Quick idea:</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setKeyword("Modern Minimalist");
            onSearch("Modern Minimalist");
          }}
          className="text-xs hover:bg-accent/50"
        >
          Modern Minimalist
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;