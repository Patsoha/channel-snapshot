
import { toast } from "sonner";

const API_KEY = "AIzaSyAP9cZxzOIelxIjObTuQjhF5jn8nB-lbPc";

export interface Channel {
  id: string;
  title: string;
  thumbnail: string;
  latestVideoId: string;
  latestVideoTitle: string;
  latestVideoThumbnail: string;
  publishedAt: string;
}

export interface VideoDetails {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  channelTitle: string;
  thumbnail: string;
}

// Extract channel ID from various YouTube URL formats
export const extractChannelId = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    
    // Handle different URL formats
    if (urlObj.hostname.includes('youtube.com')) {
      if (urlObj.pathname.startsWith('/@')) {
        return urlObj.pathname.substring(2).split('?')[0];
      } else if (urlObj.pathname.includes('/channel/')) {
        return urlObj.pathname.split('/channel/')[1].split('?')[0];
      } else if (urlObj.pathname.includes('/c/')) {
        return urlObj.pathname.split('/c/')[1].split('?')[0];
      }
    }
    return null;
  } catch (error) {
    console.error("Error extracting channel ID:", error);
    return null;
  }
};

// Fetch channel and its latest video
export const fetchChannelData = async (channelUrl: string): Promise<Channel | null> => {
  try {
    const channelIdentifier = extractChannelId(channelUrl);
    
    if (!channelIdentifier) {
      console.error("Invalid channel URL:", channelUrl);
      return null;
    }
    
    // First get the actual channel ID using the search endpoint
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${channelIdentifier}&type=channel&key=${API_KEY}`
    );
    
    if (!channelResponse.ok) {
      throw new Error(`Failed to fetch channel data: ${channelResponse.statusText}`);
    }
    
    const channelData = await channelResponse.json();
    
    if (!channelData.items || channelData.items.length === 0) {
      console.error("No channel found for:", channelIdentifier);
      return null;
    }
    
    const channelId = channelData.items[0].id.channelId;
    const channelTitle = channelData.items[0].snippet.title;
    const channelThumbnail = channelData.items[0].snippet.thumbnails.high.url;
    
    // Get the latest video for this channel
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=1&order=date&type=video&key=${API_KEY}`
    );
    
    if (!videosResponse.ok) {
      throw new Error(`Failed to fetch videos: ${videosResponse.statusText}`);
    }
    
    const videosData = await videosResponse.json();
    
    if (!videosData.items || videosData.items.length === 0) {
      console.error("No videos found for channel:", channelTitle);
      return null;
    }
    
    const latestVideo = videosData.items[0];
    
    return {
      id: channelId,
      title: channelTitle,
      thumbnail: channelThumbnail,
      latestVideoId: latestVideo.id.videoId,
      latestVideoTitle: latestVideo.snippet.title,
      latestVideoThumbnail: latestVideo.snippet.thumbnails.high.url,
      publishedAt: latestVideo.snippet.publishedAt
    };
  } catch (error) {
    console.error("Error fetching channel data:", error);
    toast.error("Ошибка при загрузке данных канала");
    return null;
  }
};

// Fetch trending videos
export const fetchTrendingVideos = async (): Promise<VideoDetails[]> => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=RU&maxResults=10&key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch trending videos: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      console.error("No trending videos found");
      return [];
    }
    
    return data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      channelTitle: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high.url
    }));
  } catch (error) {
    console.error("Error fetching trending videos:", error);
    toast.error("Ошибка при загрузке трендовых видео");
    return [];
  }
};

// Fetch video details by ID
export const fetchVideoById = async (videoId: string): Promise<VideoDetails | null> => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch video details: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      console.error("No video found for ID:", videoId);
      return null;
    }
    
    const video = data.items[0];
    
    return {
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      publishedAt: video.snippet.publishedAt,
      channelTitle: video.snippet.channelTitle,
      thumbnail: video.snippet.thumbnails.high.url
    };
  } catch (error) {
    console.error("Error fetching video details:", error);
    toast.error("Ошибка при загрузке деталей видео");
    return null;
  }
};
