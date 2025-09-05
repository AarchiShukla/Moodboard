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
    <div className="w-full max-w-5xl mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center">
          <Search className="absolute left-6 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-luxury" />
          <Input
            type="text"
            placeholder="Enter keywords for your moodboard (e.g., 'modern minimalist', 'vintage luxury', 'forest nature')..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-16 pr-40 h-16 text-lg bg-card/80 backdrop-blur-xl border-2 border-border/20 focus:border-primary shadow-luxury rounded-2xl font-medium placeholder:text-muted-foreground/60 transition-luxury"
          />
          <Button
            type="submit"
            size="lg"
            className="absolute right-3 bg-gradient-primary hover:shadow-glow transition-luxury h-12 px-8 font-medium rounded-xl shadow-gold"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate
          </Button>
        </div>
      </form>
      
      {/* Quick suggestions */}
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <span className="text-sm font-display font-medium text-foreground/80 mb-3 w-full text-center">Quick Inspiration:</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setKeyword("Modern Minimalist");
            onSearch("Modern Minimalist");
          }}
          className="text-sm hover:bg-primary/5 border-border/30 rounded-xl px-4 py-2 font-medium transition-luxury hover:border-primary/50"
        >
          Modern Minimalist
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setKeyword("Vintage Luxury");
            onSearch("Vintage Luxury");
          }}
          className="text-sm hover:bg-primary/5 border-border/30 rounded-xl px-4 py-2 font-medium transition-luxury hover:border-primary/50"
        >
          Vintage Luxury
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setKeyword("Nature Forest");
            onSearch("Nature Forest");
          }}
          className="text-sm hover:bg-primary/5 border-border/30 rounded-xl px-4 py-2 font-medium transition-luxury hover:border-primary/50"
        >
          Nature Forest
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setKeyword("Ocean Beach");
            onSearch("Ocean Beach");
          }}
          className="text-sm hover:bg-primary/5 border-border/30 rounded-xl px-4 py-2 font-medium transition-luxury hover:border-primary/50"
        >
          Ocean Beach
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setKeyword("Urban Industrial");
            onSearch("Urban Industrial");
          }}
          className="text-sm hover:bg-primary/5 border-border/30 rounded-xl px-4 py-2 font-medium transition-luxury hover:border-primary/50"
        >
          Urban Industrial
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setKeyword("Boho Chic");
            onSearch("Boho Chic");
          }}
          className="text-sm hover:bg-primary/5 border-border/30 rounded-xl px-4 py-2 font-medium transition-luxury hover:border-primary/50"
        >
          Boho Chic
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;