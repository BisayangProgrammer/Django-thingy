import { useState, useEffect } from 'react';
import { customerAPI } from '../api/api';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ customer_name: '', phone_number: '', email: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    const res = await customerAPI.getAll();
    setCustomers(res.data);
  };

  const handleSubmit = async () => {
    if (editId) {
      await customerAPI.update(editId, form);
      setEditId(null);
    } else {
      await customerAPI.create(form);
    }
    setForm({ customer_name: '', phone_number: '', email: '' });
    fetchCustomers();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* 1. Statistics Row (The blue boxes in the image) */}
      <div className="flex rounded-xl overflow-hidden shadow-md border border-slate-200">
        <div className="flex-1 bg-[#635BFF] p-6 text-white border-r border-white/10">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Total Customers</p>
          <h2 className="text-3xl font-medium">{customers.length}</h2>
        </div>
        <div className="flex-1 bg-[#7A73FF] p-6 text-white border-r border-white/10">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">New this month</p>
          <h2 className="text-3xl font-medium">12</h2>
        </div>
        <div className="flex-1 bg-[#635BFF] p-6 text-white">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Active Accounts</p>
          <h2 className="text-3xl font-medium">98%</h2>
        </div>
      </div>

      {/* 2. Form Card (Cleaner, minimalist inputs) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-bold text-[#1A1F36] mb-4">{editId ? 'Update Customer' : 'Add New Customer'}</h3>
        <div className="flex gap-3">
          <input className="flex-1 bg-slate-50 border-slate-200 border rounded-md px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-[#635BFF]/20 outline-none transition-all" 
            placeholder="Name" value={form.customer_name} onChange={e => setForm({ ...form, customer_name: e.target.value })} />
          <input className="flex-1 bg-slate-50 border-slate-200 border rounded-md px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-[#635BFF]/20 outline-none transition-all" 
            placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <button onClick={handleSubmit} className="bg-[#635BFF] text-white px-6 py-2 rounded-md text-sm font-bold hover:bg-[#5851e5] shadow-sm transition-colors">
            {editId ? 'Update' : 'Create'}
          </button>
        </div>
      </div>

      {/* 3. The Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Customer Info</th>
              <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Contact Details</th>
              <th className="px-6 py-3 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map(c => (
              <tr key={c.customer_id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-[#1A1F36]">{c.customer_name}</div>
                  <div className="text-[11px] text-slate-400 font-mono">ID: {c.customer_id}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-[#4F566B]">{c.email}</div>
                  <div className="text-xs text-slate-400">{c.phone_number}</div>
                </td>
                <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => {setEditId(c.customer_id); setForm(c)}} className="text-[#635BFF] font-bold text-xs mr-4 hover:underline">Edit</button>
                  <button className="text-red-400 font-bold text-xs hover:text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}