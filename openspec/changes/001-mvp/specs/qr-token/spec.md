# Spec: QR Token 機制

## QR Code 內容格式
```json
{
  "app": "punch-clock",
  "date": "2026-03-18",
  "token": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "exp": 1773878400
}
```

## 產生流程（管理端）
1. 開啟 admin.html
2. 自動檢查今日是否已有 token（查 Firestore `tokens/{today}`）
3. 若無 → 產生 uuid v4 token，寫入 Firestore，產生 QR code
4. 若有 → 直接用現有 token 產生 QR code
5. QR code 顯示在畫面上，可供列印或螢幕展示

## 驗證流程（打卡端）
1. 掃描 QR → 解析 JSON
2. 檢查 `app` 欄位是否為 "punch-clock"
3. 檢查 `date` 是否為今日
4. 檢查 `exp` 是否未過期
5. 查詢 Firestore `tokens/{date}` 比對 token 是否一致
6. 全部通過 → 進入 GPS 取得與打卡流程
7. 任一失敗 → 顯示錯誤訊息

## 安全考量
- token 每日更換，防止截圖隔日重用
- exp 設定為當日 23:59:59
- MVP 不做加密，日後可加 HMAC 簽名
