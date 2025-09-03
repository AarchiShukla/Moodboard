import { Shuffle, Replace, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onShuffle: () => void;
  onReplace: () => void;
  onExport: () => void;
}

const ActionButtons = ({ onShuffle, onReplace, onExport }: ActionButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <Button
        variant="outline"
        size="lg"
        onClick={onShuffle}
        className="hover:bg-accent/50 hover:border-primary/50 transition-all duration-300"
      >
        <Shuffle className="w-4 h-4 mr-2" />
        Shuffle Layout
      </Button>
      
      <Button
        variant="outline"
        size="lg"
        onClick={onReplace}
        className="hover:bg-accent/50 hover:border-primary/50 transition-all duration-300"
      >
        <Replace className="w-4 h-4 mr-2" />
        Replace Elements
      </Button>
      
      <Button
        size="lg"
        onClick={onExport}
        className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
      >
        <Download className="w-4 h-4 mr-2" />
        Export Moodboard
      </Button>

      <Button
        variant="outline"
        size="lg"
        className="hover:bg-accent/50 hover:border-primary/50 transition-all duration-300"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share
      </Button>
    </div>
  );
};

export default ActionButtons;