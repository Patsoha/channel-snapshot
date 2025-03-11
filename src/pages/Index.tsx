
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChannelGallery from "@/components/ChannelGallery";
import TrendingVideos from "@/components/TrendingVideos";
import VideoPlayer from "@/components/VideoPlayer";
import Header from "@/components/Header";

// List of YouTube channel URLs
const channelUrls = [
  "https://youtube.com/@patsoha?si=b7SfAK_wbY64fJ0W",
  "https://youtube.com/@yarik_mart?si=uUaNzMHYpqHpOCpT",
  "https://youtube.com/@alexeyvsl1?si=jIb6beHTw-Ov2Dk4"
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("channels");
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const handleVideoClick = (videoId: string) => {
    setActiveVideoId(videoId);
    console.log("Opening video:", videoId);
  };

  const handleBackClick = () => {
    setActiveVideoId(null);
  };

  return (
    <div className="min-h-screen">
      {activeVideoId ? (
        <VideoPlayer videoId={activeVideoId} onBackClick={handleBackClick} />
      ) : (
        <div className="container mx-auto px-4 py-8">
          <Header activeTab={activeTab} onTabChange={setActiveTab} />
          
          {activeTab === "channels" && (
            <>
              <h2 className="text-2xl font-semibold mb-4 text-white">Последние видео с каналов</h2>
              <ChannelGallery 
                channelUrls={channelUrls} 
                onVideoClick={handleVideoClick} 
              />
            </>
          )}
          
          {activeTab === "trending" && (
            <>
              <h2 className="text-2xl font-semibold mb-4 text-white">Трендовые видео</h2>
              <TrendingVideos onVideoClick={handleVideoClick} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Index;
