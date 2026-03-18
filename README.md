# 掃碼打卡 PWA

輕量級 PWA 打卡系統，透過掃描每日動態 QR code 搭配 GPS 定位記錄上下班時間。

## 架構

- **前端**: Vanilla JS + PWA
- **QR 掃描**: html5-qrcode (CDN)
- **QR 產生**: qrcode.js (CDN)
- **資料庫**: Firebase Firestore (`medialab-356306`)
- **部署**: Firebase Hosting

## 頁面

| 頁面 | 說明 |
|------|------|
| `/` (`index.html`) | 打卡頁：掃 QR → GPS → 寫入 Firestore |
| `/admin.html` | 管理頁：產生每日動態 QR Code |

## 資料模型

### `tokens/{YYYY-MM-DD}`
每日動態 QR token。
- `token`: uuid v4
- `createdAt`: timestamp
- `expiresAt`: timestamp（當日 23:59:59）

### `punches/{YYYY-MM-DD}/records/{recordId}`
打卡記錄。
- `userId`: "capo"（MVP 固定）
- `type`: "clock_in" | "clock_out"
- `timestamp`: server timestamp
- `gps`: `{ lat, lng, accuracy }`
- `token`: 對應 tokens collection
- `userAgent`: 瀏覽器 UA

## QR Code 格式

```json
{
  "app": "punch-clock",
  "date": "2026-03-18",
  "token": "uuid-v4-string",
  "exp": 1773878399
}
```

## 打卡判定邏輯

- 查詢今日 `punches/{today}/records` where userId == "capo"
- 記錄數為**偶數**（0, 2, 4…）→ `clock_in`（上班）
- 記錄數為**奇數**（1, 3, 5…）→ `clock_out`（下班）

## 部署

```bash
# 安裝 Firebase CLI
npm install -g firebase-tools

# 登入
firebase login

# 部署 Hosting
firebase deploy --only hosting

# 部署 Firestore rules
firebase deploy --only firestore:rules
```

## 開發

```bash
# 本地預覽
npx serve .
# 或
firebase serve
```
