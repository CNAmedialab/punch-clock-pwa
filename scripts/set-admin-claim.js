#!/usr/bin/env node
/**
 * set-admin-claim.js
 * 
 * 用途：對指定 email 的使用者設定 Firebase custom claim { role: "admin" }
 * 使用方式：node scripts/set-admin-claim.js <email>
 * 
 * 前置需求：
 * 1. 下載 Service Account Key：
 *    Firebase Console → 專案設定 → 服務帳戶 → 產生新的私密金鑰
 *    儲存為 scripts/serviceAccountKey.json
 * 2. 安裝依賴：cd scripts && npm install
 */

const path = require('path');
// firebase-admin is installed at project root
const admin = require(path.join(__dirname, '..', 'node_modules', 'firebase-admin'));

const email = process.argv[2];
if (!email) {
  console.error('❌ 用法：node scripts/set-admin-claim.js <email>');
  process.exit(1);
}

// Load service account key
const keyPath = path.join(__dirname, '..', 'serviceAccountKey.json');
let serviceAccount;
try {
  serviceAccount = require(keyPath);
} catch (err) {
  console.error('❌ 找不到 serviceAccountKey.json');
  console.error('   請至 Firebase Console → 專案設定 → 服務帳戶 → 產生新的私密金鑰');
  console.error('   儲存為：scripts/serviceAccountKey.json');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'medialab-356306'
});

async function setAdminClaim(email) {
  try {
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);
    console.log(`✅ 找到使用者：${user.email} (uid: ${user.uid})`);

    // Set custom claim
    await admin.auth().setCustomUserClaims(user.uid, { role: 'admin' });
    console.log(`✅ 已設定 custom claim: { role: "admin" }`);

    // Verify
    const updatedUser = await admin.auth().getUser(user.uid);
    console.log(`✅ 驗證成功，目前 claims:`, updatedUser.customClaims);

    console.log('\n⚠️  注意：使用者需要重新登入後 custom claims 才會生效。');
  } catch (err) {
    console.error('❌ 設定失敗：', err.message);
    process.exit(1);
  } finally {
    await admin.app().delete();
  }
}

setAdminClaim(email);
