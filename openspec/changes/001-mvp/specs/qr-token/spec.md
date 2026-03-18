# Spec: QR Token 機制

## ADDED Requirements

### Requirement: QR Code 內容格式
QR code 內容 **SHALL** 使用 JSON 格式並包含下列欄位：
```json
{
  "app": "punch-clock",
  "date": "2026-03-18",
  "token": "uuid-v4",
  "exp": 1773878400
}
```

#### Scenario: 掃描 QR code
- Given: 管理端產生的當日 QR code
- When: 使用打卡端掃描
- Then: 取得 JSON 字串並解析

### Requirement: 產生流程（管理端）
管理端 **SHALL** 執行下列產生流程：
1. 開啟 admin.html
2. 自動檢查今日是否已有 token（查 Firestore `tokens/{today}`）
3. 若無 → 產生 uuid v4 token，寫入 Firestore，產生 QR code
4. 若有 → 直接用現有 token 產生 QR code
5. QR code 顯示在畫面上，可供列印或螢幕展示

#### Scenario: 產生今日 token
- Given: 管理端開啟 admin.html
- When: 今天沒有 token
- Then: 產生新 token 並寫入 Firestore

### Requirement: 驗證流程（打卡端）
打卡端 **SHALL** 執行下列驗證流程：
1. 掃描 QR → 解析 JSON
2. 檢查 `app` 欄位是否為 "punch-clock"
3. 檢查 `date` 是否為今日
4. 檢查 `exp` 是否未過期
5. 查詢 Firestore `tokens/{date}` 比對 token 是否一致
6. 全部通過 → 進入 GPS 取得與打卡流程
7. 任一失敗 → 顯示錯誤訊息

#### Scenario: 驗證 token
- Given: 掃碼後取得 token
- When: 檢查 token 有效性與過期時間
- Then: 通過驗證方可打卡

## 安全考量
- token 每日更換，防止截圖隔日重用
- exp 設定為當日 23:59:59
- MVP 不做加密，日後可加 HMAC 簽名
