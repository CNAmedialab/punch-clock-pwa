# Proposal: MVP 掃碼打卡 PWA

## 目標
建立一個輕量級 PWA 打卡系統，透過掃描每日動態 QR code 搭配 GPS 定位記錄上下班時間。

## 背景
目前僅供單人使用，需求極簡：掃碼、記錄時間與位置、存入 Firebase。不需要複雜的後端或使用者管理系統。

## 範圍

### In Scope
- 管理端：每日動態產生 QR code（含防重複使用 token）
- 打卡端：掃描 QR → 取得 GPS → 寫入 Firestore
- 自動判定上班/下班（當日首次=上班，後續=下班）
- GPS 座標純記錄（不做地理圍欄驗證）
- Firebase Hosting 部署

### Out of Scope
- 多人使用者管理
- 地理圍欄驗證（日後擴充）
- 原生 App
- 後端 API（純前端 + Firebase）

## 技術決策
- 前端：Vanilla JS + PWA manifest
- QR 掃描：html5-qrcode
- 資料庫：Firebase Firestore
- 部署：Firebase Hosting
- 不使用任何前端框架（需求過於簡單，框架是浪費）

## 成功標準
1. 掃碼後 3 秒內完成打卡
2. GPS 精度 < 50m
3. 打卡記錄可在 Firestore console 中查看
4. PWA 可安裝到手機主畫面
