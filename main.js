
// DOM Elements
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const channelsGrid = document.getElementById('channels-grid');
const trendingGrid = document.getElementById('trending-grid');
const videoPlayer = document.getElementById('video-player');
const backButton = document.getElementById('back-button');
const youtubeIframe = document.getElementById('youtube-iframe');
const youtubeLink = document.getElementById('youtube-link');
const toast = document.getElementById('toast');

// Current active tab
let activeTab = 'channels';

// Форматирование даты
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Сегодня';
  } else if (diffDays === 1) {
    return 'Вчера';
  } else if (diffDays < 7) {
    return `${diffDays} дн. назад`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} нед. назад`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} мес. назад`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} г. назад`;
  }
}

// Создание карточки видео
function createVideoCard(video) {
  const card = document.createElement('div');
  card.className = 'video-card glass-morphism';
  card.innerHTML = `
    <img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail">
    <div class="video-info">
      <h3 class="video-title">${video.title}</h3>
      <p class="video-channel">${video.channelTitle}</p>
      <p class="video-date">${formatDate(video.publishedAt)}</p>
    </div>
  `;
  
  card.addEventListener('click', () => {
    openVideoPlayer(video.id);
  });
  
  return card;
}

// Показ трендовых видео
async function showTrendingVideos() {
  try {
    trendingGrid.innerHTML = `
      <div class="loading-skeleton">
        <div class="skeleton-item"></div>
        <div class="skeleton-item"></div>
        <div class="skeleton-item"></div>
      </div>
    `;
    
    const videos = await fetchTrendingVideos();
    
    if (videos.length === 0) {
      trendingGrid.innerHTML = '<p class="text-center py-12 text-white/70">Трендовые видео не найдены</p>';
      return;
    }
    
    trendingGrid.innerHTML = '';
    videos.forEach(video => {
      trendingGrid.appendChild(createVideoCard(video));
    });
    
  } catch (error) {
    showToast('Ошибка при загрузке трендовых видео');
    console.error('Error showing trending videos:', error);
    trendingGrid.innerHTML = '<p class="text-center py-12 text-white/70">Ошибка при загрузке трендовых видео</p>';
  }
}

// Показ каналов и их последних видео
async function showChannelVideos() {
  try {
    channelsGrid.innerHTML = `
      <div class="loading-skeleton">
        <div class="skeleton-item"></div>
        <div class="skeleton-item"></div>
        <div class="skeleton-item"></div>
      </div>
    `;
    
    const channelPromises = CHANNEL_URLS.map(url => fetchChannelData(url));
    const channels = await Promise.all(channelPromises);
    const validChannels = channels.filter(channel => channel !== null);
    
    if (validChannels.length === 0) {
      channelsGrid.innerHTML = '<p class="text-center py-12 text-white/70">Каналы не найдены</p>';
      return;
    }
    
    channelsGrid.innerHTML = '';
    validChannels.forEach(channel => {
      const videoData = {
        id: channel.latestVideoId,
        title: channel.latestVideoTitle,
        thumbnail: channel.latestVideoThumbnail,
        channelTitle: channel.title,
        publishedAt: channel.publishedAt
      };
      
      channelsGrid.appendChild(createVideoCard(videoData));
    });
    
  } catch (error) {
    showToast('Ошибка при загрузке каналов');
    console.error('Error showing channel videos:', error);
    channelsGrid.innerHTML = '<p class="text-center py-12 text-white/70">Ошибка при загрузке каналов</p>';
  }
}

// Открытие видеоплеера
function openVideoPlayer(videoId) {
  youtubeIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  youtubeLink.href = `https://www.youtube.com/watch?v=${videoId}`;
  videoPlayer.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

// Закрытие видеоплеера
function closeVideoPlayer() {
  videoPlayer.style.display = 'none';
  youtubeIframe.src = '';
  document.body.style.overflow = '';
}

// Показ уведомления
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  
  setTimeout(() => {
    toast.classList.remove('visible');
  }, 3000);
}

// Event Listeners
tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Изменяем активную вкладку
    activeTab = button.dataset.tab;
    
    // Обновляем UI
    tabButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    tabContents.forEach(content => content.classList.remove('active'));
    document.getElementById(`${activeTab}-content`).classList.add('active');
    
    // Загружаем данные, если нужно
    if (activeTab === 'trending' && trendingGrid.children.length <= 1) {
      showTrendingVideos();
    }
  });
});

backButton.addEventListener('click', closeVideoPlayer);

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  // Устанавливаем активную вкладку
  tabButtons.forEach(button => {
    if (button.dataset.tab === activeTab) {
      button.classList.add('active');
    }
  });
  
  document.getElementById(`${activeTab}-content`).classList.add('active');
  
  // Загружаем данные каналов при загрузке страницы
  showChannelVideos();
});
