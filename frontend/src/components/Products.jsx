import { useState, useEffect } from 'react';
import { productAPI } from '../api/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ product_name: '', price: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

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

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1A1F36]">Products</h2>
        <div className="flex gap-3">
           <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm text-sm text-slate-500">
             Total: {products.length} Items
           </div>
        </div>
      </div>

      {/* Modern Form Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
          {editId ? 'Edit Product Details' : 'Register New Product'}
        </h3>
        <div className="flex flex-wrap gap-4">
          <input className="flex-1 min-w-[240px] bg-slate-50 border-slate-200 border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#635BFF]/20 outline-none transition-all" 
            placeholder="Product Name" value={form.product_name} onChange={e => setForm({ ...form, product_name: e.target.value })} />
          <div className="relative">
            <span className="absolute left-3 top-2 text-slate-400 text-sm">$</span>
            <input className="w-32 bg-slate-50 border-slate-200 border rounded-lg pl-7 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#635BFF]/20 outline-none" 
              placeholder="0.00" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
          </div>
          <button onClick={handleSubmit} className="bg-[#635BFF] text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-[#5851e5] shadow-sm transition-all">
            {editId ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </div>

      {/* Product Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Product Name</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map(p => (
              <tr key={p.product_id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-bold text-[#1A1F36]">{p.product_name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">ID: {p.product_id}</div>
                </td>
                <td className="px-6 py-4 font-medium text-slate-600">${p.price}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => setForm({ product_name: p.product_name, price: p.price }) || setEditId(p.product_id)} 
                    className="text-[#635BFF] font-bold text-xs mr-4 hover:underline">Edit</button>
                  <button onClick={() => productAPI.delete(p.product_id).then(fetchProducts)} 
                    className="text-red-400 font-bold text-xs hover:text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}