import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Color {
  hex: string;
  name: string;
}

interface ColorPaletteProps {
  colors: Color[];
}

const ColorPalette = ({ colors }: ColorPaletteProps) => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
          Color Palette
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-4">
          {colors.map((color, index) => (
            <div key={index} className="group">
              <div
                className="w-full aspect-square rounded-lg shadow-soft cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-creative"
                style={{ backgroundColor: color.hex }}
                onClick={() => copyToClipboard(color.hex)}
              />
              <div className="mt-2 text-center">
                <p className="text-xs font-medium text-foreground">{color.name}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(color.hex)}
                  className="text-xs text-muted-foreground hover:text-foreground mt-1 h-auto p-1"
                >
                  {copiedColor === color.hex ? (
                    <Check className="w-3 h-3 mr-1" />
                  ) : (
                    <Copy className="w-3 h-3 mr-1" />
                  )}
                  {color.hex}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorPalette;