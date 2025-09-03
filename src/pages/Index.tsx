import { useState } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import ColorPalette from "@/components/ColorPalette";
import FontPreviews from "@/components/FontPreviews";
import ImageGrid from "@/components/ImageGrid";
import ActionButtons from "@/components/ActionButtons";
import { useToast } from "@/hooks/use-toast";

// Dummy data for demonstration
const sampleMoodboards = {
  "modern minimalist": {
    colors: [
      { hex: "#FFFFFF", name: "Pure White" },
      { hex: "#F8F9FA", name: "Ghost White" },
      { hex: "#6C757D", name: "Slate Gray" },
      { hex: "#343A40", name: "Charcoal" },
      { hex: "#000000", name: "Pure Black" }
    ],
    fonts: [
      { name: "Inter", family: "Inter, sans-serif", weight: "400" },
      { name: "Playfair Display", family: "Playfair Display, serif", weight: "700" }
    ],
    images: [
      { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400", alt: "Modern office space" },
      { url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400", alt: "Minimalist desk" },
      { url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400", alt: "Clean architecture" },
      { url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400", alt: "Minimal product" },
      { url: "https://images.unsplash.com/photo-1527772482340-7895c3f2b3f7?w=400", alt: "White space design" }
    ]
  },
  "nature zen": {
    colors: [
      { hex: "#8FBC8F", name: "Sage Green" },
      { hex: "#DEB887", name: "Burlywood" },
      { hex: "#F5F5DC", name: "Beige" },
      { hex: "#8B4513", name: "Saddle Brown" },
      { hex: "#2F4F2F", name: "Dark Olive" }
    ],
    fonts: [
      { name: "Poppins", family: "Poppins, sans-serif", weight: "300" },
      { name: "Merriweather", family: "Merriweather, serif", weight: "400" }
    ],
    images: [
      { url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400", alt: "Forest path" },
      { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400", alt: "Mountain lake" },
      { url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400", alt: "Zen garden" },
      { url: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=400", alt: "Bamboo forest" },
      { url: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400", alt: "Natural stones" }
    ]
  }
};

const Index = () => {
  const [currentMoodboard, setCurrentMoodboard] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (keyword: string) => {
    setIsGenerating(true);
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Use sample data based on keyword
    const lowerKeyword = keyword.toLowerCase();
    let moodboard;
    
    if (lowerKeyword.includes("minimal") || lowerKeyword.includes("modern")) {
      moodboard = sampleMoodboards["modern minimalist"];
    } else if (lowerKeyword.includes("nature") || lowerKeyword.includes("zen") || lowerKeyword.includes("forest")) {
      moodboard = sampleMoodboards["nature zen"];
    } else {
      // Default to modern minimalist
      moodboard = sampleMoodboards["modern minimalist"];
    }
    
    setCurrentMoodboard(moodboard);
    setIsGenerating(false);
    
    toast({
      title: "Moodboard Generated!",
      description: `Created a beautiful moodboard for "${keyword}"`,
    });
  };

  const handleShuffle = () => {
    if (currentMoodboard) {
      // Shuffle the order of colors and images
      const shuffledColors = [...currentMoodboard.colors].sort(() => Math.random() - 0.5);
      const shuffledImages = [...currentMoodboard.images].sort(() => Math.random() - 0.5);
      
      setCurrentMoodboard({
        ...currentMoodboard,
        colors: shuffledColors,
        images: shuffledImages
      });
      
      toast({
        title: "Layout Shuffled!",
        description: "Moodboard elements have been rearranged",
      });
    }
  };

  const handleReplace = () => {
    // Generate new random colors for demonstration
    const newColors = [
      { hex: "#FF6B6B", name: "Coral Red" },
      { hex: "#4ECDC4", name: "Turquoise" },
      { hex: "#45B7D1", name: "Sky Blue" },
      { hex: "#FFA07A", name: "Light Salmon" },
      { hex: "#98D8C8", name: "Mint Green" }
    ];
    
    if (currentMoodboard) {
      setCurrentMoodboard({
        ...currentMoodboard,
        colors: newColors
      });
      
      toast({
        title: "Elements Replaced!",
        description: "New colors have been generated",
      });
    }
  };

  const handleExport = () => {
    toast({
      title: "Export Started!",
      description: "Your moodboard is being prepared for download...",
    });
  };

  const handleRefreshImages = () => {
    if (currentMoodboard) {
      // For demo, just shuffle existing images
      const shuffledImages = [...currentMoodboard.images].sort(() => Math.random() - 0.5);
      setCurrentMoodboard({
        ...currentMoodboard,
        images: shuffledImages
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-creative bg-clip-text text-transparent">
            Create Stunning Moodboards
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Transform your creative vision into beautiful moodboards with AI-powered design suggestions
          </p>
          
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Loading State */}
        {isGenerating && (
          <div className="text-center py-12">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="text-lg font-medium">Generating your moodboard...</span>
            </div>
          </div>
        )}

        {/* Generated Moodboard */}
        {currentMoodboard && !isGenerating && (
          <div className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <ColorPalette colors={currentMoodboard.colors} />
              <FontPreviews fonts={currentMoodboard.fonts} />
            </div>
            
            <ImageGrid 
              images={currentMoodboard.images} 
              onRefresh={handleRefreshImages}
            />
            
            <div className="pt-8">
              <ActionButtons
                onShuffle={handleShuffle}
                onReplace={handleReplace}
                onExport={handleExport}
              />
            </div>
          </div>
        )}

        {/* Empty State */}
        {!currentMoodboard && !isGenerating && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Ready to Create?</h3>
            <p className="text-muted-foreground">
              Enter a keyword above to generate your first moodboard
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
