# Spec: Firestore Data Model

## Collections

### `tokens/{date}`
每日動態 QR token。

| Field | Type | Description |
|-------|------|-------------|
| token | string | 當日隨機字串 (uuid v4) |
| createdAt | timestamp | 產生時間 |
| expiresAt | timestamp | 過期時間（預設 24hr） |

Key: date 格式 `YYYY-MM-DD`

### `punches/{date}/records/{recordId}`
打卡記錄。

| Field | Type | Description |
|-------|------|-------------|
| userId | string | 使用者識別（MVP 固定 "capo"） |
| type | string | "clock_in" 或 "clock_out" |
| timestamp | timestamp | server timestamp |
| gps | map | `{ lat: number, lng: number, accuracy: number }` |
| token | string | 驗證用，對應 tokens collection |
| userAgent | string | 瀏覽器 UA |

### 自動判定邏輯
- 查詢 `punches/{today}/records` where userId == "capo" order by timestamp
- 記錄數為偶數（0, 2, 4...）→ 本次為 clock_in
- 記錄數為奇數（1, 3, 5...）→ 本次為 clock_out

## Security Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tokens/{date} {
      allow read: if true;
      allow write: if true;  // MVP: 無驗證
    }
    match /punches/{date}/records/{record} {
      allow read: if true;
      allow write: if true;  // MVP: 無驗證
    }
  }
}
```

MVP 階段不做 auth，日後可加 Firebase Auth 限制寫入。
