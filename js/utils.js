// ===== Utility Functions =====

/**
 * Get today's date string in YYYY-MM-DD format (local time)
 */
function getTodayDate() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Get end of today (23:59:59) as Unix timestamp
 */
function getTodayExpiry() {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  return Math.floor(end.getTime() / 1000);
}

/**
 * Generate a UUID v4
 */
function generateUUID() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Format timestamp to locale time string
 */
function formatTime(timestamp) {
  if (!timestamp) return '-';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

/**
 * Format date to locale date string
 */
function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-');
  return `${y}年${parseInt(m)}月${parseInt(d)}日`;
}

/**
 * Show a toast notification
 */
function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'none';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Get GPS coordinates
 * Returns Promise<{lat, lng, accuracy}>
 */
function getGPS() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('此瀏覽器不支援 GPS 定位'));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      pos => resolve({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: Math.round(pos.coords.accuracy)
      }),
      err => {
        let msg = '無法取得 GPS 位置';
        switch (err.code) {
          case err.PERMISSION_DENIED:
            msg = '使用者拒絕 GPS 授權';
            break;
          case err.POSITION_UNAVAILABLE:
            msg = '位置資訊不可用';
            break;
          case err.TIMEOUT:
            msg = 'GPS 定位逾時';
            break;
        }
        reject(new Error(msg));
      },
      options
    );
  });
}

/**
 * Register service worker
 */
async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      console.log('[SW] 已註冊:', reg.scope);
    } catch (err) {
      console.warn('[SW] 註冊失敗:', err);
    }
  }
}
