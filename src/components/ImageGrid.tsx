import { ImageIcon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Image {
  url: string;
  alt: string;
}

interface ImageGridProps {
  images: Image[];
  onRefresh: () => void;
}

const ImageGrid = ({ images, onRefresh }: ImageGridProps) => {
  return (
    <Card className="shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            Visual Inspiration
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="hover:bg-accent/50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-lg shadow-soft cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-creative"
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageGrid;