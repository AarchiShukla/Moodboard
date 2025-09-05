import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Palette, Home, BookmarkCheck, Download, User as UserIcon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<{ display_name?: string; avatar_url?: string } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user profile when authenticated
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', userId)
        .single();
      
      if (!error && data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Sign Out Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Signed Out",
          description: "You've been signed out successfully.",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Unexpected Error",
        description: "Something went wrong while signing out.",
        variant: "destructive"
      });
    }
  };

  return (
    <header className="bg-card/95 backdrop-blur-xl border-b border-border/20 sticky top-0 z-50 shadow-luxury">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-gold animate-luxury-glow">
              <Palette className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-display font-bold text-luxury tracking-tight">
              Moodboard Generator
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Button 
              variant="ghost" 
              className="text-foreground hover:text-primary font-medium transition-luxury hover:bg-primary/5"
              onClick={() => navigate("/")}
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            {user && (
              <>
                <Button variant="ghost" className="text-foreground hover:text-primary font-medium transition-luxury hover:bg-primary/5">
                  <BookmarkCheck className="w-4 h-4 mr-2" />
                  My Boards
                </Button>
                <Button variant="ghost" className="text-foreground hover:text-primary font-medium transition-luxury hover:bg-primary/5">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </>
            )}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-11 w-11 rounded-full shadow-gold hover:shadow-glow transition-luxury">
                    <Avatar className="h-11 w-11 border-2 border-primary/20">
                      <AvatarImage src={profile?.avatar_url || ""} alt={profile?.display_name || "User"} />
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground font-display font-semibold">
                        {profile?.display_name ? profile.display_name.charAt(0).toUpperCase() : 
                         user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-card/95 backdrop-blur-xl border border-border/20 shadow-luxury" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-3">
                    <p className="text-sm font-display font-semibold leading-none text-foreground">
                      {profile?.display_name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground font-medium">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem className="cursor-pointer hover:bg-primary/5 transition-luxury">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span className="font-medium">Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem 
                    className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/5 transition-luxury"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className="font-medium">Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={() => navigate("/auth")}
                className="bg-gradient-primary hover:shadow-glow transition-luxury font-medium px-6 shadow-gold"
                size="sm"
              >
                Sign In
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button variant="outline" size="sm" className="md:hidden border-border/20 hover:bg-primary/5 transition-luxury">
              Menu
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;