# Spec: Firestore Data Model

## ADDED Requirements

### Requirement: Collection `tokens/{date}`
系統 **SHALL** 建立 `tokens/{date}` 集合儲存每日動態 QR token。

| Field | Type | Description |
|-------|------|-------------|
| token | string | 當日隨機字串 (uuid v4) |
| createdAt | timestamp | 產生時間 |
| expiresAt | timestamp | 過期時間（預設 24hr） |

Key: date 格式 `YYYY-MM-DD`

#### Scenario: 查詢當日 token
- Given: 管理端開啟 admin.html
- When: 檢查當日是否已有 token
- Then: 從 Firestore `tokens/{today}` 讀取

### Requirement: Collection `punches/{date}/records/{recordId}`
系統 **SHALL** 建立 `punches/{date}/records/{recordId}` 集合儲存打卡記錄。

| Field | Type | Description |
|-------|------|-------------|
| userId | string | 使用者識別（MVP 固定 "capo"） |
| type | string | "clock_in" 或 "clock_out" |
| timestamp | timestamp | server timestamp |
| gps | map | `{ lat: number, lng: number, accuracy: number }` |
| token | string | 驗證用，對應 tokens collection |
| userAgent | string | 瀏覽器 UA |

#### Scenario: 寫入打卡記錄
- Given: 打卡端掃碼成功且 GPS 取得
- When: 寫入打卡記錄到 Firestore `punches/{today}/records`
- Then: 自動判定 clock_in/clock_out（偶數=上班，奇數=下班）

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
