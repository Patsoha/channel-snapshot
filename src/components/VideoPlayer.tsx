
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";

interface VideoPlayerProps {
  videoId: string;
  onBackClick: () => void;
}

const VideoPlayer = ({ videoId, onBackClick }: VideoPlayerProps) => {
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="p-4 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBackClick}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="flex-1" />
        <a 
          href={`https://www.youtube.com/watch?v=${videoId}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-white/70 hover:text-white"
        >
          <span>Смотреть на YouTube</span>
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
      <div className="flex-1 w-full">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          title="YouTube video player"
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
