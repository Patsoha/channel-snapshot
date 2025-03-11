
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

interface VideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  onClick: (videoId: string) => void;
}

const VideoCard = ({ id, title, thumbnail, channelTitle, publishedAt, onClick }: VideoCardProps) => {
  const formattedDate = formatDistanceToNow(new Date(publishedAt), {
    addSuffix: true,
    locale: ru,
  });

  return (
    <Card 
      className="overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer glass-morphism hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
      onClick={() => onClick(id)}
    >
      <CardContent className="p-0 relative">
        <div className="relative group">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-100 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <h3 className="text-white font-medium line-clamp-2 text-sm">{title}</h3>
            <p className="text-white/80 text-xs mt-1">{channelTitle}</p>
            <p className="text-white/60 text-xs mt-1">{formattedDate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
