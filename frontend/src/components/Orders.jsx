import { useState, useEffect } from 'react';
import { orderAPI, customerAPI } from '../api/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState('');

  useEffect(() => {
    fetchOrders();
    customerAPI.getAll().then(res => {
      setCustomers(res.data);
      if (res.data.length > 0) setCustomerId(res.data[0].customer_id);
    });
  }, []);

  const fetchOrders = async () => {
    const res = await orderAPI.getAll();
    setOrders(res.data);
  };

  return (
    <div className="space-y-6">
      {/* 1. Hero Status Card (Matching the blue bar in your image) */}
      <div className="bg-[#635BFF] rounded-2xl p-8 text-white shadow-lg flex justify-between items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Total volume</p>
          <h2 className="text-4xl font-medium">{orders.length} <span className="text-lg opacity-60 ml-1">Orders</span></h2>
        </div>
        <div className="flex gap-3">
          <select className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm font-medium outline-none focus:bg-white/20 transition-all"
            value={customerId} onChange={e => setCustomerId(e.target.value)}>
            {customers.map(c => (
              <option key={c.customer_id} value={c.customer_id} className="text-slate-800">{c.customer_name}</option>
            ))}
          </select>
          <button onClick={() => orderAPI.create({ customer: customerId }).then(fetchOrders)}
            className="bg-white text-[#635BFF] px-6 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors">
            + New Order
          </button>
        </div>
      </div>

      {/* 2. Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date Created</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map(o => (
              <tr key={o.order_id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-slate-400">#{o.order_id}</td>
                <td className="px-6 py-4 font-bold text-[#1A1F36]">
                  {customers.find(c => c.customer_id === o.customer)?.customer_name || 'Loading...'}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{new Date(o.order_date).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                   <button onClick={() => orderAPI.delete(o.order_id).then(fetchOrders)} className="text-slate-300 hover:text-red-500 transition-colors">✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}