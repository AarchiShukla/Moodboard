import { Type } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Font {
  name: string;
  family: string;
  weight: string;
}

interface FontPreviewsProps {
  fonts: Font[];
}

const FontPreviews = ({ fonts }: FontPreviewsProps) => {
  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="w-5 h-5 text-primary" />
          Typography
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {fonts.map((font, index) => (
          <div key={index} className="p-4 bg-muted/30 rounded-lg border border-border/50">
            <div className="mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                {font.name} • {font.weight}
              </span>
            </div>
            <div 
              className="space-y-2"
              style={{ fontFamily: font.family, fontWeight: font.weight }}
            >
              <h3 className="text-2xl font-bold text-foreground">
                Sample Brand Text
              </h3>
              <p className="text-lg text-muted-foreground">
                The quick brown fox jumps over the lazy dog
              </p>
              <p className="text-sm text-muted-foreground">
                ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default FontPreviews;