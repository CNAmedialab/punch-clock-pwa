# Tasks: MVP 掃碼打卡 PWA

## Frontend

- [ ] **F1: 專案骨架** — PWA manifest, service worker, index.html, 基本 CSS
- [ ] **F2: Firebase 初始化** — firebase config, Firestore 連線, security rules
- [ ] **F3: 管理頁 (admin.html)** — 產生每日動態 QR code（含 token + expiry）, 寫入 Firestore tokens collection
- [ ] **F4: 打卡頁 (index.html)** — html5-qrcode 掃描器, 解析 QR 內容, 驗證 token 有效性
- [ ] **F5: GPS 取得** — navigator.geolocation, 精度檢查, 錯誤處理
- [ ] **F6: 打卡寫入** — 組裝 punch record, 自動判定 clock_in/clock_out, 寫入 Firestore
- [ ] **F7: 打卡結果顯示** — 成功/失敗 UI feedback, 顯示打卡時間與類型
- [ ] **F8: Firebase Hosting 部署** — firebase init, deploy script

## QA

- [ ] **Q1: 掃碼流程端對端測試** — 產 QR → 掃碼 → 記錄寫入 Firestore
- [ ] **Q2: Token 過期驗證** — 過期 token 應被拒絕
- [ ] **Q3: GPS 錯誤處理** — 使用者拒絕定位時的 graceful degradation
- [ ] **Q4: PWA 安裝測試** — iOS Safari / Android Chrome add to homescreen
