'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [chain, setChain] = useState<any[]>([]);
  const [formData, setFormData] = useState({ student_name: '', major: '', student_id: '' });

  // Địa chỉ của Backend Flask (Đang chạy ngầm)
  const API_URL = 'http://localhost:5000';

  // 1. Hàm tự động lấy dữ liệu chuỗi khối từ Flask
  const fetchChain = async () => {
    try {
      const res = await fetch(`${API_URL}/chain`);
      const data = await res.json();
      setChain(data.chain);
    } catch (error) {
      console.error("Lỗi kết nối Backend:", error);
    }
  };

  // Gọi hàm fetchChain ngay khi trang web vừa tải xong
  useEffect(() => {
    fetchChain();
  }, []);

  // 2. Hàm gửi chứng chỉ mới lên Hàng đợi
  const handleAddCertificate = async () => {
    if (!formData.student_name || !formData.major || !formData.student_id) {
      alert("Vui lòng nhập đủ thông tin nhé!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/certificates/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      alert(data.message);
      // Xóa trắng form sau khi gửi
      setFormData({ student_name: '', major: '', student_id: '' });
    } catch (error) {
      alert("Oops! Không thể gửi dữ liệu. Kiểm tra lại Backend nhé!");
    }
  };

  // 3. Hàm Đào khối mới (Mine)
  const handleMine = async () => {
    try {
      const res = await fetch(`${API_URL}/mine`);
      const data = await res.json();
      alert(`🎉 ${data.message} (Khối số ${data.index})`);
      fetchChain(); // Tải lại danh sách Sổ cái sau khi đào
    } catch (error) {
      alert("Lỗi khi đào khối!");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-800 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-10 shadow-sm p-4 bg-white rounded-xl">
          Hệ Thống Quản Lý Chứng Chỉ Blockchain (Nhóm 10)
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* CỘT TRÁI: Form Nhập Liệu */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
              <h2 className="text-xl font-bold mb-4 text-gray-700"> 1. Thêm Chứng Chỉ</h2>
              <input
                className="w-full p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Tên sinh viên (VD: Trần Thị Huyền Trang)"
                value={formData.student_name}
                onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
              />
              <input
                className="w-full p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Chuyên ngành..."
                value={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
              />
              <input
                className="w-full p-3 mb-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Mã Sinh Viên..."
                value={formData.student_id}
                onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
              />
              <button
                onClick={handleAddCertificate}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
              >
                Gửi vào Hàng đợi
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 text-center">
              <h2 className="text-xl font-bold mb-2 text-gray-700">⛏️ 2. Đào Khối (Mine)</h2>
              <p className="text-sm text-gray-500 mb-5">Đóng gói chứng chỉ từ hàng đợi vào chuỗi vĩnh viễn bằng Proof of Work.</p>
              <button
                onClick={handleMine}
                className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition shadow-md"
              >
                Bắt đầu Đào Khối Mới
              </button>
            </div>
          </div>

          {/* CỘT PHẢI: Hiển thị Blockchain */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-700">Sổ Cái Hệ Thống (Chuỗi Khối)</h2>
                <button
                  onClick={fetchChain}
                  className="text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 font-semibold px-4 py-2 rounded-lg transition"
                >
                  🔄 Làm mới dữ liệu
                </button>
              </div>

              <div className="bg-[#1e1e1e] text-[#4af626] p-5 rounded-xl flex-grow overflow-x-auto h-[600px] overflow-y-auto font-mono text-sm shadow-inner border border-gray-800">
                <pre>{JSON.stringify(chain, null, 4)}</pre>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}