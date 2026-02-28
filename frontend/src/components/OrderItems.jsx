import { useState, useEffect } from 'react';
import { orderItemAPI, orderAPI, productAPI } from '../api/api';

export default function OrderItems() {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ order: '', product: '', quantity: 1 });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const [itemsRes, ordersRes, productsRes] = await Promise.all([
      orderItemAPI.getAll(),
      orderAPI.getAll(),
      productAPI.getAll(),
    ]);
    setItems(itemsRes.data);
    setOrders(ordersRes.data);
    setProducts(productsRes.data);
    if (ordersRes.data.length > 0) setForm(f => ({ ...f, order: ordersRes.data[0].order_id }));
    if (productsRes.data.length > 0) setForm(f => ({ ...f, product: productsRes.data[0].product_id }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Add Item Sidebar (4 Columns) */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-[#1A1F36] mb-6">Attach Product to Order</h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Order</label>
              <select className="w-full mt-1 bg-slate-50 border-slate-200 border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-[#635BFF]/10"
                value={form.order} onChange={e => setForm({ ...form, order: e.target.value })}>
                {orders.map(o => <option key={o.order_id} value={o.order_id}>Order #{o.order_id}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product</label>
              <select className="w-full mt-1 bg-slate-50 border-slate-200 border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-[#635BFF]/10"
                value={form.product} onChange={e => setForm({ ...form, product: e.target.value })}>
                {products.map(p => <option key={p.product_id} value={p.product_id}>{p.product_name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quantity</label>
              <input className="w-full mt-1 bg-slate-50 border-slate-200 border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-[#635BFF]/10" type="number" min="1"
                value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
            </div>
            <button onClick={() => orderItemAPI.create(form).then(fetchAll)}
              className="w-full bg-[#635BFF] text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-[#5851e5] transition-all">
              Add to Order
            </button>
          </div>
        </div>
      </div>

      {/* Item List (8 Columns) */}
      <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Item Details</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Qty</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map(i => (
              <tr key={i.order_item_id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-[#1A1F36]">
                    {products.find(p => p.product_id === i.product)?.product_name || 'Unknown Product'}
                  </div>
                  <div className="text-xs text-[#635BFF] font-medium">Linked to Order #{i.order}</div>
                </td>
                <td className="px-6 py-4">
                   <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">x{i.quantity}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => orderItemAPI.delete(i.order_item_id).then(fetchAll)} className="text-slate-300 hover:text-red-500">✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}