// =============================
// 📘 Backend API: api.js
// ใช้ Node.js + Express + Firebase Firestore
// =============================

import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import serviceAccount from './firebase/palm-1006-5-firebase-adminsdk-fbsvc-9b2af0e0a4.json' with { type: 'json' };

// -------------------------
// 🔹 ตั้งค่า Firebase Admin SDK
// -------------------------
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// -------------------------
// 🔹 สร้าง Express App
// -------------------------
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// -------------------------
// 🔹 ฟังก์ชัน CRUD สำหรับเมนูอาหาร
// -------------------------

// ✅ ดึงเมนูทั้งหมด
async function fetchAllMenu() {
  const result = [];
  const menuRef = db.collection('Menu');
  const snapshot = await menuRef.get();
  snapshot.forEach((doc) => {
    result.push({
      id: doc.id,
      ...doc.data()
    });
  });
  return result;
}

// ✅ เพิ่มเมนูใหม่
async function addMenu(newMenu) {
  const docRef = db.collection('Menu').doc();
  await docRef.set(newMenu);
  console.log('✅ เมนูถูกเพิ่มสำเร็จ!');
}

// ✅ อัปเดตเมนู
async function updateMenu(menuId, menuData) {
  const docRef = db.collection('Menu').doc(menuId);
  await docRef.update(menuData);
}

// ✅ ลบเมนู
async function deleteMenu(menuId) {
  const docRef = db.collection('Menu').doc(menuId);
  await docRef.delete();
}

// -------------------------
// 🔹 ROUTES
// -------------------------

// ✅ ทดสอบ API
app.get('/', (req, res) => {
  res.send('🍽️ Hello from Restaurant API!');
});

// ✅ GET: ดึงเมนูทั้งหมด
// URL: http://localhost:3000/api/getMenu
app.get('/api/getMenu', (req, res) => {
  res.set('Content-type', 'application/json');
  fetchAllMenu()
    .then((jsonData) => res.status(200).json(jsonData))
    .catch((error) =>
      res.status(500).json({ success: false, message: error.message })
    );
});

// ✅ POST: เพิ่มเมนูใหม่
// URL: http://localhost:3000/api/addMenu
app.post('/api/addMenu', async (req, res) => {
  try {
    const { name, price, category, status } = req.body;

    if (!name || !price || !category) {
      return res
        .status(400)
        .json({ success: false, message: 'กรุณากรอกข้อมูลให้ครบ' });
    }

    const newMenu = {
      name,
      price,
      category,
      status: status || 'available',
      createdAt: new Date().toISOString()
    };

    await addMenu(newMenu);
    res
      .status(201)
      .json({ success: true, message: '✅ เพิ่มเมนูสำเร็จ!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ POST: อัปเดตเมนู
// URL: http://localhost:3000/api/updateMenu
app.post('/api/updateMenu', async (req, res) => {
  try {
    const { menuId, name, price, category, status } = req.body;
    if (!menuId) {
      return res
        .status(400)
        .json({ success: false, message: 'กรุณาระบุ menuId' });
    }

    await updateMenu(menuId, { name, price, category, status });
    res
      .status(200)
      .json({ success: true, message: '📝 อัปเดตเมนูสำเร็จ!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ DELETE: ลบเมนู
// URL: http://localhost:3000/api/deleteMenu/:id
app.delete('/api/deleteMenu/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await deleteMenu(id);
    res.status(200).json({ success: true, message: '🗑️ ลบเมนูสำเร็จ!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------
// 🔹 เริ่มรันเซิร์ฟเวอร์
// -------------------------
app.listen(port, () => {
  console.log(`🚀 Server running on: http://localhost:${port}`);
});
