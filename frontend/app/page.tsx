'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [chain, setChain] = useState<any[]>([]);
  const [formData, setFormData] = useState({ student_name: '', major: '', student_id: '' });

  // State mới: Lưu trữ các chứng chỉ đang nằm trong hàng đợi chờ đào
  const [pendingCerts, setPendingCerts] = useState<any[]>([]);

  // Địa chỉ của Backend Flask
  const API_URL = 'http://localhost:5000';

  const fetchChain = async () => {
    try {
      const res = await fetch(`${API_URL}/chain`);
      const data = await res.json();
      setChain(data.chain);
    } catch (error) {
      console.error("Lỗi kết nối Backend:", error);
    }
  };

  useEffect(() => {
    fetchChain();
  }, []);

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

      // Thêm data vào danh sách Hàng đợi (Mempool) trên UI
      setPendingCerts([...pendingCerts, formData]);

      // Xóa trắng form sau khi gửi
      setFormData({ student_name: '', major: '', student_id: '' });
    } catch (error) {
      alert("Oops! Không thể gửi dữ liệu. Kiểm tra lại Backend nhé!");
    }
  };

  const handleMine = async () => {
    // if (pendingCerts.length === 0) {
    //   alert("Hàng đợi đang trống, không có chứng chỉ nào để đóng gói vào khối!");
    //   return;
    // }

    try {
      const res = await fetch(`${API_URL}/mine`);
      const data = await res.json();
      alert(`🎉 ${data.message} (Khối số ${data.index})`);

      // Thành công thì tải lại Sổ cái và xóa rỗng Hàng đợi
      fetchChain();
      setPendingCerts([]);
    } catch (error) {
      alert("Lỗi khi đào khối!");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8 text-gray-800 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-10 shadow-sm p-5 bg-white rounded-2xl border border-indigo-100">
          Hệ Thống Quản Lý Chứng Chỉ Blockchain (Nhóm 10)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* CỘT TRÁI: Nhập Liệu & Hàng Đợi (Mempool) */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            {/* Box 1: Form Nhập */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold mb-4 text-slate-700 flex items-center gap-2">
                1. Thêm Chứng Chỉ
              </h2>
              <input
                className="w-full p-3 mb-3 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                placeholder="Họ và tên..."
                value={formData.student_name}
                onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
              />
              <input
                className="w-full p-3 mb-3 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                placeholder="Chuyên ngành..."
                value={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
              />
              <input
                className="w-full p-3 mb-5 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                placeholder="Mã Sinh Viên..."
                value={formData.student_id}
                onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
              />
              <button
                onClick={handleAddCertificate}
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition shadow-md"
              >
                Đẩy vào Hàng đợi
              </button>
            </div>

            {/* Box 2: Mempool (Hàng Đợi) */}
            <div className="bg-amber-50 p-6 rounded-2xl shadow-sm border border-amber-200 flex-grow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-amber-800 flex items-center gap-2">
                  2. Hàng Đợi (Mempool)
                </h2>
                <span className="bg-amber-200 text-amber-800 text-xs font-bold px-2 py-1 rounded-full">
                  {pendingCerts.length} chờ xử lý
                </span>
              </div>

              <div className="space-y-3 mb-6 max-h-[250px] overflow-y-auto pr-2">
                {pendingCerts.length === 0 ? (
                  <p className="text-sm text-amber-600/70 italic text-center py-4">Chưa có chứng chỉ nào chờ xử lý.</p>
                ) : (
                  pendingCerts.map((cert, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-amber-300 shadow-sm text-sm">
                      <p className="font-semibold text-slate-800">{cert.student_name} <span className="text-slate-500 font-normal">({cert.student_id})</span></p>
                      <p className="text-slate-600 mt-1">🎓 {cert.major}</p>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={handleMine}
                className={`w-full font-bold py-3 rounded-lg transition shadow-md flex justify-center items-center gap-2
                    bg-emerald-500 text-white hover:bg-emerald-600`}
              >
                <span>⛏️</span> 3. Đào Khối Mới
              </button>
            </div>
          </div>

          {/* CỘT PHẢI: Blockchain (Sổ cái) */}
          <div className="lg:col-span-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                  <span>🔗</span> Sổ Cái Chuỗi Khối (Ledger)
                </h2>
                <button
                  onClick={fetchChain}
                  className="text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 font-semibold px-4 py-2 rounded-lg transition"
                >
                  🔄 Làm mới
                </button>
              </div>

              <div className="flex flex-col items-center flex-grow overflow-y-auto max-h-[750px] w-full p-4 bg-slate-50 rounded-xl border border-slate-200 custom-scrollbar">
                {chain.map((block, index) => (
                  <div key={block.index} className="w-full max-w-2xl flex flex-col items-center">

                    {/* Thẻ Khối (Block Card) */}
                    <div className="w-full bg-white rounded-xl shadow-md border-2 border-slate-300 hover:border-indigo-400 transition-colors duration-300 overflow-hidden">
                      {/* Header của Khối */}
                      <div className="bg-slate-800 text-white p-3 flex justify-between items-center">
                        <span className="font-bold">Khối #{block.index}</span>
                        <span className="text-xs font-mono text-slate-300">
                          {new Date(block.timestamp * 1000).toLocaleString('vi-VN')}
                        </span>
                      </div>

                      {/* Body của Khối */}
                      <div className="p-4">
                        <div className="mb-3">
                          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Dữ liệu (Transactions):</p>
                          {block.data && block.data.length > 0 ? (
                            <div className="bg-slate-50 p-2 rounded border border-slate-200 max-h-[150px] overflow-y-auto">
                              {block.data.map((tx: any, i: number) => (
                                <div key={i} className="text-sm py-1 border-b border-slate-200 last:border-0">
                                  <span className="font-medium text-indigo-700"> {tx.student_name}</span> - {tx.major} ({tx.student_id})
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-slate-400 italic bg-slate-50 p-2 rounded border border-slate-200">Khối nguyên thủy (Genesis Block) - Không có dữ liệu</div>
                          )}
                        </div>

                        {/* Hash Info */}
                        <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 space-y-2">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 font-bold uppercase">Mã băm hiện tại (Hash)</span>
                            <span className="text-xs font-mono text-emerald-600 truncate bg-white p-1 rounded border border-slate-200 mt-1" title={block.hash || block.current_hash || 'Tự động sinh'}>
                              {block.hash || block.current_hash || '...'}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 font-bold uppercase">Mã băm khối trước (Previous Hash)</span>
                            <span className="text-xs font-mono text-rose-600 truncate bg-white p-1 rounded border border-slate-200 mt-1" title={block.previous_hash}>
                              {block.previous_hash}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mũi tên kết nối giữa các khối (chỉ render nếu không phải khối cuối) */}
                    {index < chain.length - 1 && (
                      <div className="h-12 w-1 bg-slate-300 relative my-1">
                        <div className="absolute -bottom-2 -left-[6px] text-slate-400">
                          ▼
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}