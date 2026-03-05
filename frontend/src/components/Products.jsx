import { useState, useEffect } from 'react';
import { productAPI } from '../api/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ product_name: '', price: '' });
  const [editId, setEditId] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchProducts();
    // ✅ Trigger slide-down animation when page loads
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const fetchProducts = async () => {
    const res = await productAPI.getAll();
    setProducts(res.data);
  };

  const handleSubmit = async () => {
    if (editId) {
      await productAPI.update(editId, form);
      setEditId(null);
    } else {
      await productAPI.create(form);
    }
    setForm({ product_name: '', price: '' });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this product?')) {
      await productAPI.delete(id);
      fetchProducts();
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ product_name: '', price: '' });
  };

  return (
    <div
      className="min-h-screen -m-6 p-6"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.85)), url('/factory.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* ✅ Slide-down wrapper */}
      <div
        style={{
          transform: visible ? 'translateY(0)' : 'translateY(-40px)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.6s ease, opacity 0.6s ease',
        }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Products</h2>
          <div className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white/70">
            Total: {products.length} Items
          </div>
        </div>

        {/* Form Card */}
        <div
          style={{
            transform: visible ? 'translateY(0)' : 'translateY(-30px)',
            opacity: visible ? 1 : 0,
            transition: 'transform 0.7s ease 0.1s, opacity 0.7s ease 0.1s',
          }}
          className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-sm"
        >
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">
            {editId ? 'Edit Product Details' : 'Register New Product'}
          </h3>
          <div className="flex flex-wrap gap-4">
            <input
              className="flex-1 min-w-[240px] bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm text-white placeholder-white/40 focus:ring-2 focus:ring-[#635BFF]/50 outline-none transition-all"
              placeholder="Product Name"
              value={form.product_name}
              onChange={e => setForm({ ...form, product_name: e.target.value })}
            />
            <div className="relative">
              <span className="absolute left-3 top-2 text-white/40 text-sm">$</span>
              <input
                className="w-32 bg-white/10 border border-white/20 rounded-lg pl-7 pr-4 py-2 text-sm text-white placeholder-white/40 focus:ring-2 focus:ring-[#635BFF]/50 outline-none"
                placeholder="0.00"
                type="number"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <button
              onClick={handleSubmit}
              className="bg-[#635BFF] text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-[#5851e5] shadow-sm transition-all">
              {editId ? 'Update Product' : 'Add Product'}
            </button>
            {editId && (
              <button
                onClick={handleCancel}
                className="bg-white/10 text-white/70 px-4 py-2 rounded-lg font-bold text-sm hover:bg-white/20 transition-all border border-white/20">
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div
          style={{
            transform: visible ? 'translateY(0)' : 'translateY(-20px)',
            opacity: visible ? 1 : 0,
            transition: 'transform 0.8s ease 0.2s, opacity 0.8s ease 0.2s',
          }}
          className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm overflow-hidden"
        >
          <table className="w-full text-left">
            <thead className="border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold text-white/40 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-4 text-[11px] font-bold text-white/40 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-right text-[11px] font-bold text-white/40 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {products.map((p, index) => (
                <tr
                  key={p.product_id}
                  className="hover:bg-white/5 transition-colors group"
                  style={{
                    transform: visible ? 'translateY(0)' : 'translateY(-10px)',
                    opacity: visible ? 1 : 0,
                    transition: `transform 0.5s ease ${0.3 + index * 0.05}s, opacity 0.5s ease ${0.3 + index * 0.05}s`,
                  }}
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-white">{p.product_name}</div>
                    <div className="text-[10px] text-white/40 font-mono">ID: {p.product_id}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-white/70">${p.price}</td>
                  <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setEditId(p.product_id); setForm({ product_name: p.product_name, price: p.price }); }}
                      className="text-[#635BFF] font-bold text-xs mr-4 hover:underline">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.product_id)}
                      className="text-red-400 font-bold text-xs hover:text-red-300">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}