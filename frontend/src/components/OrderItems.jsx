import { useState, useEffect, useCallback } from 'react';
import { orderItemAPI, orderAPI, productAPI, customerAPI } from '../api/api';

export default function OrderItems() {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ order: '', product: '', quantity: 1 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ✅ Fast lookup maps
  const productMap = {};
  products.forEach(p => productMap[p.product_id] = p.product_name);

  const customerMap = {};
  customers.forEach(c => customerMap[c.customer_id] = c.customer_name);

  // ✅ Get customer name from order
  const getCustomerFromOrder = (orderId) => {
    const order = orders.find(o => o.order_id === orderId);
    if (!order) return `Order #${orderId}`;
    return customerMap[order.customer] || `Order #${orderId}`;
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [itemsRes, ordersRes, productsRes, customersRes] = await Promise.all([
        orderItemAPI.getAll(),
        orderAPI.getAll(),
        productAPI.getAll(),
        customerAPI.getAll(),
      ]);
      setItems(itemsRes.data);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      setCustomers(customersRes.data);
      setForm(f => ({
        order: f.order || (ordersRes.data[0]?.order_id ?? ''),
        product: f.product || (productsRes.data[0]?.product_id ?? ''),
        quantity: f.quantity || 1,
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleAdd = async () => {
    if (!form.order || !form.product) return;
    setSubmitting(true);
    try {
      await orderItemAPI.create(form);
      const res = await orderItemAPI.getAll();
      setItems(res.data);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this order item?')) {
      await orderItemAPI.delete(id);
      const res = await orderItemAPI.getAll();
      setItems(res.data);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sidebar */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-[#1A1F36] mb-6">Attach Product to Order</h3>
          <div className="space-y-4">

            {/* ✅ Shows customer name instead of Order # */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer</label>
              <select
                className="w-full mt-1 bg-slate-50 border-slate-200 border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-[#635BFF]/10"
                value={form.order}
                onChange={e => setForm({ ...form, order: e.target.value })}>
                {orders.map(o => (
                  <option key={o.order_id} value={o.order_id}>
                    {customerMap[o.customer] || `Order #${o.order_id}`} — Order #{o.order_id}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product</label>
              <select
                className="w-full mt-1 bg-slate-50 border-slate-200 border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-[#635BFF]/10"
                value={form.product}
                onChange={e => setForm({ ...form, product: e.target.value })}>
                {products.map(p => <option key={p.product_id} value={p.product_id}>{p.product_name}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quantity</label>
              <input
                className="w-full mt-1 bg-slate-50 border-slate-200 border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-[#635BFF]/10"
                type="number" min="1"
                value={form.quantity}
                onChange={e => setForm({ ...form, quantity: e.target.value })} />
            </div>

            <button
              onClick={handleAdd}
              disabled={submitting}
              className="w-full bg-[#635BFF] text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-[#5851e5] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? 'Adding...' : 'Add to Order'}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
            Loading...
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Item Details</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Qty</th>
                <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-400 text-sm">No items yet</td>
                </tr>
              ) : (
                items.map(i => (
                  <tr key={i.order_item_id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-[#1A1F36]">
                        {productMap[i.product] || 'Unknown Product'}
                      </div>
                      <div className="text-xs text-slate-400 font-mono">Item #{i.order_item_id}</div>
                    </td>
                    {/* ✅ Shows customer name in table */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-[#1A1F36] font-medium">
                        {getCustomerFromOrder(i.order)}
                      </div>
                      <div className="text-xs text-[#635BFF]">Order #{i.order}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">x{i.quantity}</span>
                    </td>
                    {/* ✅ Proper delete button */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(i.order_item_id)}
                        className="bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 px-3 py-1 rounded-lg text-xs font-bold transition-colors">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}