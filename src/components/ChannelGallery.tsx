
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Channel, fetchChannelData } from "@/services/youtubeService";
import VideoCard from "./VideoCard";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface ChannelGalleryProps {
  channelUrls: string[];
  onVideoClick: (videoId: string) => void;
}

const ChannelGallery = ({ channelUrls, onVideoClick }: ChannelGalleryProps) => {
  const { data: channels, isLoading, error } = useQuery({
    queryKey: ["channels", channelUrls],
    queryFn: async () => {
      const channelPromises = channelUrls.map(url => fetchChannelData(url));
      const results = await Promise.all(channelPromises);
      return results.filter(channel => channel !== null) as Channel[];
    }
  });

  useEffect(() => {
    if (error) {
      console.error("Error fetching channels:", error);
      toast.error("Ошибка при загрузке каналов");
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
        {Array(6).fill(0).map((_, index) => (
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

  if (!channels || channels.length === 0) {
    return <div className="text-center py-12 text-white/70">Каналы не найдены</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
      {channels.map(channel => (
        <VideoCard
          key={channel.id}
          id={channel.latestVideoId}
          title={channel.latestVideoTitle}
          thumbnail={channel.latestVideoThumbnail}
          channelTitle={channel.title}
          publishedAt={channel.publishedAt}
          onClick={onVideoClick}
        />
      ))}
    </div>
  );
};

export default ChannelGallery;
