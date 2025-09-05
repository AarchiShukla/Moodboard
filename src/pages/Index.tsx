import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import ColorPalette from "@/components/ColorPalette";
import FontPreviews from "@/components/FontPreviews";
import ImageGrid from "@/components/ImageGrid";
import ActionButtons from "@/components/ActionButtons";
import { useToast } from "@/hooks/use-toast";
import creativeBackground from "@/assets/creative-background.jpg";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const saveMoodboard = async (moodboardData: any) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('moodboards')
        .insert({
          user_id: user.id,
          title: moodboardData.title,
          keywords: moodboardData.keywords || [],
          color_palette: moodboardData.colors || [],
          fonts: moodboardData.fonts || [],
          images: moodboardData.images || [],
          is_public: false
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error saving moodboard:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error saving moodboard:', error);
      return null;
    }
  };

  const handleSearch = async (keyword: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to generate moodboards",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Call the AI-powered edge function
      const { data, error } = await supabase.functions.invoke('generate-moodboard', {
        body: { keyword }
      });

      if (error) {
        console.error('Error calling generate-moodboard:', error);
        throw new Error(error.message || 'Failed to generate moodboard');
      }

      if (data?.moodboard) {
        const moodboardData = {
          ...data.moodboard,
          title: data.moodboard.title || `${keyword} Moodboard`
        };
        
        setCurrentMoodboard(moodboardData);
        
        // Save to database
        const savedMoodboard = await saveMoodboard(moodboardData);
        if (savedMoodboard) {
          setCurrentMoodboard({ ...moodboardData, id: savedMoodboard.id });
        }
        
        toast({
          title: "AI Moodboard Generated!",
          description: `Created "${moodboardData.title}" for "${keyword}"`,
        });
      } else {
        throw new Error('No moodboard data received');
      }
    } catch (error) {
      console.error('Error generating moodboard:', error);
      toast({
        title: "Generation Failed",
        description: "Please try again or check your connection",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
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
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `url(${creativeBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background overlay for better content readability */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-[1px]" />
      
      {/* Content */}
      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 text-luxury tracking-tight leading-tight">
            Create Stunning Moodboards
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
            Transform your creative vision into beautiful moodboards with AI-powered design suggestions
          </p>
          
          <SearchBar onSearch={handleSearch} />
          
          {!user && (
            <div className="mt-8 p-6 bg-card/80 backdrop-blur-xl rounded-2xl border border-border/20 shadow-luxury max-w-md mx-auto">
              <p className="text-center text-foreground/80 font-medium">
                <strong className="text-luxury font-display">Sign in</strong> to generate and save your AI-powered moodboards
              </p>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isGenerating && (
          <div className="text-center py-16">
            <div className="inline-flex items-center space-x-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary shadow-gold"></div>
              <span className="text-xl font-display font-medium text-foreground">AI is creating your moodboard...</span>
            </div>
          </div>
        )}

        {/* Generated Moodboard */}
        {currentMoodboard && !isGenerating && (
          <div className="space-y-12">
            {/* Moodboard Title */}
            <div className="text-center">
              <h2 className="text-4xl font-display font-bold text-luxury mb-3 tracking-tight">{currentMoodboard.title}</h2>
              <p className="text-foreground/80 text-lg font-medium">
                Keywords: {currentMoodboard.keywords?.join(", ") || "N/A"}
              </p>
            </div>
            
            <div className="grid gap-12 lg:grid-cols-2">
              <ColorPalette colors={currentMoodboard.colors} />
              <FontPreviews fonts={currentMoodboard.fonts} />
            </div>
            
            <ImageGrid 
              images={currentMoodboard.images} 
              onRefresh={handleRefreshImages}
            />
            
            <div className="pt-12">
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
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-luxury animate-luxury-glow">
              <span className="text-3xl">🎨</span>
            </div>
            <h3 className="text-2xl font-display font-semibold mb-4 text-foreground tracking-tight">Ready to Create?</h3>
            <p className="text-foreground/80 mb-8 text-lg font-medium max-w-md mx-auto">
              {user 
                ? "Enter a keyword above to generate your first AI-powered moodboard"
                : "Sign in to start creating beautiful moodboards with AI"
              }
            </p>
            {!user && (
              <button 
                onClick={() => navigate("/auth")}
                className="px-8 py-4 bg-gradient-primary text-primary-foreground rounded-2xl hover:shadow-glow transition-luxury font-medium text-base shadow-gold"
              >
                Get Started
              </button>
            )}
          </div>
        )}
        </main>
      </div>
    </div>
  );
};

export default Index;
