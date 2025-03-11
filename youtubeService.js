
const API_KEY = 'AIzaSyAP9cZxzOIelxIjObTuQjhF5jn8nB-lbPc';
const CHANNEL_URLS = [
  'https://youtube.com/@patsoha?si=b7SfAK_wbY64fJ0W',
  'https://youtube.com/@yarik_mart?si=uUaNzMHYpqHpOCpT',
  'https://youtube.com/@alexeyvsl1?si=jIb6beHTw-Ov2Dk4'
];

// Вспомогательная функция для извлечения ID канала из URL
function extractChannelId(url) {
  const channelName = url.split('@')[1]?.split('?')[0];
  return channelName;
}

// Функция для получения данных канала и последнего видео
async function fetchChannelData(url) {
  try {
    const channelName = extractChannelId(url);
    if (!channelName) {
      throw new Error('Не удалось извлечь имя канала из URL');
    }

    // Получаем данные о канале
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&forUsername=${channelName}&key=${API_KEY}`
    );
    
    let channelData = await channelResponse.json();
    
    // Если нет результатов, попробуем найти через поиск
    if (!channelData.items || channelData.items.length === 0) {
      const searchResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${channelName}&type=channel&key=${API_KEY}`
      );
      
      const searchData = await searchResponse.json();
      if (!searchData.items || searchData.items.length === 0) {
        throw new Error(`Канал не найден: ${channelName}`);
      }
      
      const channelId = searchData.items[0].id.channelId;
      
      const newChannelResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&id=${channelId}&key=${API_KEY}`
      );
      
      channelData = await newChannelResponse.json();
    }
    
    if (!channelData.items || channelData.items.length === 0) {
      throw new Error(`Канал не найден: ${channelName}`);
    }
    
    const channel = channelData.items[0];
    const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads;
    
    // Получаем последнее видео из плейлиста загрузок канала
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&playlistId=${uploadsPlaylistId}&key=${API_KEY}`
    );
    
    const videosData = await videosResponse.json();
    
    if (!videosData.items || videosData.items.length === 0) {
      throw new Error(`Видео не найдены для канала: ${channelName}`);
    }
    
    const latestVideo = videosData.items[0].snippet;
    
    return {
      id: channel.id,
      title: channel.snippet.title,
      latestVideoId: latestVideo.resourceId.videoId,
      latestVideoTitle: latestVideo.title,
      latestVideoThumbnail: latestVideo.thumbnails.high.url,
      publishedAt: latestVideo.publishedAt
    };
    
  } catch (error) {
    console.error('Ошибка при получении данных канала:', error);
    return null;
  }
}

// Функция для получения трендовых видео
async function fetchTrendingVideos() {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=RU&maxResults=10&key=${API_KEY}`
    );
    
    const data = await response.json();
    
    if (!data.items) {
      throw new Error('Трендовые видео не найдены');
    }
    
    return data.items.map(item => ({
      id: item.id,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt
    }));
    
  } catch (error) {
    console.error('Ошибка при получении трендовых видео:', error);
    return [];
  }
}
