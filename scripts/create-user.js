#!/usr/bin/env node
/**
 * create-user.js
 * 
 * 一次性 script：建立 Firebase Auth 使用者
 * 使用方式：
 *   export ADMIN_EMAIL="lichuehhuang@gws.cna.com.tw"
 *   export ADMIN_PASSWORD="<new-password>"
 *   export ADMIN_DISPLAY_NAME="李絜珩"
 *   export ADMIN_ROLE="admin"
 *   node scripts/create-user.js
 * 
 * 前置需求：scripts/serviceAccountKey.json
 */

const path = require('path');
const admin = require(path.join(__dirname, '..', 'node_modules', 'firebase-admin'));

const keyPath = path.join(__dirname, '..', 'serviceAccountKey.json');
let serviceAccount;
try {
  serviceAccount = require(keyPath);
} catch (err) {
  console.error('❌ 找不到 serviceAccountKey.json');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'medialab-356306'
});

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const displayName = process.env.ADMIN_DISPLAY_NAME || 'Admin';
const role = process.env.ADMIN_ROLE || 'admin';

if (!email || !password) {
  console.error('❌ 請設定環境變數 ADMIN_EMAIL 與 ADMIN_PASSWORD');
  process.exit(1);
}

const USERS = [
  {
    email,
    password,
    displayName,
    role
  }
];

async function createUsers() {
  for (const userData of USERS) {
    try {
      let user;
      try {
        user = await admin.auth().getUserByEmail(userData.email);
        console.log(`⚠️  使用者已存在：${userData.email} (uid: ${user.uid})`);
      } catch (notFound) {
        user = await admin.auth().createUser({
          email: userData.email,
          password: userData.password,
          displayName: userData.displayName,
          emailVerified: false
        });
        console.log(`✅ 建立使用者：${userData.email} (uid: ${user.uid})`);
        console.log(`   設定密碼：***`);
      }

      if (userData.role) {
        await admin.auth().setCustomUserClaims(user.uid, { role: userData.role });
        console.log(`✅ 設定 role: "${userData.role}"`);
      }
    } catch (err) {
      console.error(`❌ 處理 ${userData.email} 失敗：`, err.message);
    }
  }

  console.log('\n=== 完成 ===');
  await admin.app().delete();
}

createUsers();
