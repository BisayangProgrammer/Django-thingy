import { useState, useEffect } from 'react';
import { customerAPI } from '../api/api';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ customer_name: '', phone_number: '', email: '' });
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchCustomers();
    // ✅ Trigger slide-down animation when page loads
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const fetchCustomers = async () => {
    const res = await customerAPI.getAll();
    setCustomers(res.data);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.customer_name.trim()) {
      newErrors.customer_name = 'Name is required.';
    } else if (form.customer_name.trim().length < 2) {
      newErrors.customer_name = 'Name must be at least 2 characters.';
    }
    if (!form.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required.';
    } else if (!/^\d{7,15}$/.test(form.phone_number.trim())) {
      newErrors.phone_number = 'Phone must be 7-15 digits only.';
    }
    if (!form.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = 'Enter a valid email address.';
    }
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    if (editId) {
      await customerAPI.update(editId, form);
      setEditId(null);
    } else {
      await customerAPI.create(form);
    }
    setForm({ customer_name: '', phone_number: '', email: '' });
    fetchCustomers();
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this customer?')) {
      await customerAPI.delete(id);
      fetchCustomers();
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setErrors({});
    setForm({ customer_name: '', phone_number: '', email: '' });
  };

  return (
    // ✅ Dark overlay + background image
    <div
      className="min-h-screen -m-6 p-6"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.85)), url('/SolaceOffice.png')`,
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
        {/* Statistics Row */}
        <div
          style={{
            transform: visible ? 'translateY(0)' : 'translateY(-30px)',
            opacity: visible ? 1 : 0,
            transition: 'transform 0.6s ease 0.05s, opacity 0.6s ease 0.05s',
          }}
          className="flex rounded-xl overflow-hidden shadow-md border border-white/20"
        >
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

        {/* Form Card */}
        <div
          style={{
            transform: visible ? 'translateY(0)' : 'translateY(-30px)',
            opacity: visible ? 1 : 0,
            transition: 'transform 0.7s ease 0.1s, opacity 0.7s ease 0.1s',
          }}
          className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm p-6"
        >
          <h3 className="text-sm font-bold text-white mb-4">{editId ? 'Update Customer' : 'Add New Customer'}</h3>
          <div className="flex gap-3 items-start">

            {/* Name */}
            <div className="flex-1">
              <input
                className={`w-full bg-white/10 border rounded-md px-3 py-2 text-sm text-white placeholder-white/40 focus:bg-white/20 focus:ring-2 focus:ring-[#635BFF]/50 outline-none transition-all
                  ${errors.customer_name ? 'border-red-400' : 'border-white/20'}`}
                placeholder="Name"
                value={form.customer_name}
                onChange={e => setForm({ ...form, customer_name: e.target.value })}
              />
              {errors.customer_name && (
                <p className="text-red-400 text-[11px] mt-1">{errors.customer_name}</p>
              )}
            </div>

            {/* Phone */}
            <div className="flex-1">
              <input
                className={`w-full bg-white/10 border rounded-md px-3 py-2 text-sm text-white placeholder-white/40 focus:bg-white/20 focus:ring-2 focus:ring-[#635BFF]/50 outline-none transition-all
                  ${errors.phone_number ? 'border-red-400' : 'border-white/20'}`}
                placeholder="Phone"
                value={form.phone_number}
                onChange={e => setForm({ ...form, phone_number: e.target.value })}
              />
              {errors.phone_number && (
                <p className="text-red-400 text-[11px] mt-1">{errors.phone_number}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex-1">
              <input
                className={`w-full bg-white/10 border rounded-md px-3 py-2 text-sm text-white placeholder-white/40 focus:bg-white/20 focus:ring-2 focus:ring-[#635BFF]/50 outline-none transition-all
                  ${errors.email ? 'border-red-400' : 'border-white/20'}`}
                placeholder="Email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && (
                <p className="text-red-400 text-[11px] mt-1">{errors.email}</p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              className="bg-[#635BFF] text-white px-6 py-2 rounded-md text-sm font-bold hover:bg-[#5851e5] shadow-sm transition-colors">
              {editId ? 'Update' : 'Create'}
            </button>
            {editId && (
              <button
                onClick={handleCancel}
                className="bg-white/10 text-white/70 px-4 py-2 rounded-md text-sm font-bold hover:bg-white/20 transition-colors border border-white/20">
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
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-3 text-[11px] font-bold text-white/40 uppercase tracking-wider">Customer Info</th>
                <th className="px-6 py-3 text-[11px] font-bold text-white/40 uppercase tracking-wider">Contact Details</th>
                <th className="px-6 py-3 text-right text-[11px] font-bold text-white/40 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {customers.map((c, index) => (
                <tr
                  key={c.customer_id}
                  className="hover:bg-white/5 transition-colors group"
                  style={{
                    transform: visible ? 'translateY(0)' : 'translateY(-10px)',
                    opacity: visible ? 1 : 0,
                    transition: `transform 0.5s ease ${0.3 + index * 0.05}s, opacity 0.5s ease ${0.3 + index * 0.05}s`,
                  }}
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-white">{c.customer_name}</div>
                    <div className="text-[11px] text-white/40 font-mono">ID: {c.customer_id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white/70">{c.email}</div>
                    <div className="text-xs text-white/40">{c.phone_number}</div>
                  </td>
                  <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setEditId(c.customer_id); setForm({ customer_name: c.customer_name, phone_number: c.phone_number, email: c.email }); setErrors({}); }}
                      className="text-[#635BFF] font-bold text-xs mr-4 hover:underline">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.customer_id)}
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