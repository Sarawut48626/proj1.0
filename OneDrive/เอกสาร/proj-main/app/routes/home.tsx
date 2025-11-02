import { useEffect, useState } from "react";

interface Menu {
  id?: string;
  name: string;
  price: number;
  category: string;
  status?: string;
}

function Home() {
  const [menuList, setMenuList] = useState<Menu[]>([]);
  const [newMenu, setNewMenu] = useState<Menu>({ name: "", price: 0, category: "", status: "available" });
  const [editId, setEditId] = useState<string | null>(null);

  const API_URL = "http://localhost:3000";

  // ✅ โหลดข้อมูลจาก API
  const fetchMenu = async () => {
    const res = await fetch(`${API_URL}/api/getMenu`);
    const data = await res.json();
    setMenuList(data);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // ✅ เพิ่มเมนูใหม่
  const handleAddMenu = async () => {
    if (!newMenu.name || !newMenu.price || !newMenu.category) return alert("กรุณากรอกข้อมูลให้ครบ");
    await fetch(`${API_URL}/api/addMenu`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMenu),
    });
    setNewMenu({ name: "", price: 0, category: "", status: "available" });
    fetchMenu();
  };

  // ✅ ลบเมนู
  const handleDelete = async (id: string) => {
    if (!confirm("คุณต้องการลบเมนูนี้หรือไม่?")) return;
    await fetch(`${API_URL}/api/deleteMenu/${id}`, { method: "DELETE" });
    fetchMenu();
  };

  // ✅ ดึงข้อมูลเมนูมาแก้ไข
  const handleEdit = (menu: Menu) => {
    setNewMenu(menu);
    setEditId(menu.id || null);
  };

  // ✅ บันทึกการแก้ไข
  const handleUpdate = async () => {
    if (!editId) return;
    await fetch(`${API_URL}/api/updateMenu`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuId: editId, ...newMenu }),
    });
    setEditId(null);
    setNewMenu({ name: "", price: 0, category: "", status: "available" });
    fetchMenu();
  };

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col items-center p-8">
      <h1 className="text-3xl text-orange-400 font-bold mb-8">🍽️ ร้านอาหารของเรา</h1>

      <div className="bg-[#1a1a1a] p-6 rounded-2xl shadow-md flex gap-3 mb-10">
        <input
          type="text"
          placeholder="ชื่อเมนู"
          className="bg-[#222] px-4 py-2 rounded-lg"
          value={newMenu.name}
          onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="ราคา"
          className="bg-[#222] px-4 py-2 rounded-lg"
          value={newMenu.price}
          onChange={(e) => setNewMenu({ ...newMenu, price: Number(e.target.value) })}
        />
        <input
          type="text"
          placeholder="ประเภท"
          className="bg-[#222] px-4 py-2 rounded-lg"
          value={newMenu.category}
          onChange={(e) => setNewMenu({ ...newMenu, category: e.target.value })}
        />

        {editId ? (
          <button onClick={handleUpdate} className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg">
            บันทึก
          </button>
        ) : (
          <button onClick={handleAddMenu} className="bg-orange-500 hover:bg-orange-600 px-5 py-2 rounded-lg">
            เพิ่มเมนู
          </button>
        )}
      </div>

      <h2 className="text-orange-400 font-semibold mb-4 text-xl">รายการเมนู</h2>

      <table className="w-3/4 text-left border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-orange-500 to-red-500">
            <th className="p-3">ชื่อเมนู</th>
            <th className="p-3">ราคา</th>
            <th className="p-3">ประเภท</th>
            <th className="p-3">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {menuList.map((menu) => (
            <tr key={menu.id} className="bg-[#1a1a1a] border-b border-gray-700">
              <td className="p-3">{menu.name}</td>
              <td className="p-3">{menu.price} บาท</td>
              <td className="p-3">{menu.category}</td>
              <td className="p-3 flex gap-2">
                <button onClick={() => handleEdit(menu)} className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md">
                  แก้ไข
                </button>
                <button onClick={() => handleDelete(menu.id!)} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md">
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Home;
