
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTrendingVideos } from "@/services/youtubeService";
import VideoCard from "./VideoCard";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface TrendingVideosProps {
  onVideoClick: (videoId: string) => void;
}

const TrendingVideos = ({ onVideoClick }: TrendingVideosProps) => {
  const { data: videos, isLoading, error } = useQuery({
    queryKey: ["trendingVideos"],
    queryFn: fetchTrendingVideos
  });

  useEffect(() => {
    if (error) {
      console.error("Error fetching trending videos:", error);
      toast.error("Ошибка при загрузке трендовых видео");
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
        {Array(3).fill(0).map((_, index) => (
          <div key={index} className="glass-morphism rounded-lg overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return <div className="text-center py-12 text-white/70">Трендовые видео не найдены</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
      {videos.map(video => (
        <VideoCard
          key={video.id}
          id={video.id}
          title={video.title}
          thumbnail={video.thumbnail}
          channelTitle={video.channelTitle}
          publishedAt={video.publishedAt}
          onClick={onVideoClick}
        />
      ))}
    </div>
  );
};

export default TrendingVideos;
