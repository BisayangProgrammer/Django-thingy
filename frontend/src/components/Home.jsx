import { useState, useEffect } from 'react';
import { orderAPI, customerAPI, productAPI, orderItemAPI } from '../api/api';

export default function Home() {
  const [stats, setStats] = useState({ revenue: 0, customers: 0, orders: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [ordersRes, customersRes, productsRes, itemsRes] = await Promise.all([
          orderAPI.getAll(),
          customerAPI.getAll(),
          productAPI.getAll(),
          orderItemAPI.getAll()
        ]);

        const totalRevenue = itemsRes.data.reduce((sum, item) => {
          const product = productsRes.data.find(p => p.product_id === item.product);
          return sum + (product ? product.price * item.quantity : 0);
        }, 0);

        setStats({
          revenue: totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          customers: customersRes.data.length,
          orders: ordersRes.data.length
        });

        setRecentOrders(ordersRes.data.slice(-5).reverse());
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-pulse text-slate-400 font-medium">Loading Solace Coalition...</div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* 1. Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1F36]">Solace Coalition Inc</h1>
          <p className="text-sm text-slate-500">System Overview & Performance</p>
        </div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-200">
          Live Updates
        </div>
      </div>

      {/* 2. Top Hero Stats - Matching the blue bar in your reference image */}
      <div className="bg-[#635BFF] rounded-2xl shadow-xl shadow-indigo-100 overflow-hidden flex flex-col md:flex-row text-white border border-white/10">
        <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-white/10 hover:bg-white/5 transition-colors cursor-default">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70 mb-2">Gross Volume</p>
          <h2 className="text-4xl font-medium tracking-tight">${stats.revenue}</h2>
        </div>
        <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-white/10 hover:bg-white/5 transition-colors cursor-default">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70 mb-2">New Customers</p>
          <h2 className="text-4xl font-medium tracking-tight">{stats.customers}</h2>
        </div>
        <div className="flex-1 p-8 hover:bg-white/5 transition-colors cursor-default">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70 mb-2">Total Orders</p>
          <h2 className="text-4xl font-medium tracking-tight">{stats.orders}</h2>
        </div>
      </div>

      {/* 3. Main Chart Placeholder - Stripe Style */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex justify-between items-center mb-10">
          <div className="flex gap-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <span className="text-[#635BFF] border-b-2 border-[#635BFF] pb-2 cursor-pointer">1M</span>
            <span className="hover:text-slate-600 cursor-pointer transition-colors pb-2">3M</span>
            <span className="hover:text-slate-600 cursor-pointer transition-colors pb-2">1Y</span>
            <span className="hover:text-slate-600 cursor-pointer transition-colors pb-2">ALL</span>
          </div>
          <div className="bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100 text-[11px] font-medium text-slate-500">
            {new Date().toLocaleDateString()} — {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
        </div>
        
        <div className="h-40 w-full relative group">
           <svg viewBox="0 0 800 100" className="w-full h-full stroke-[#635BFF] stroke-[1.5] fill-none overflow-visible">
             <path d="M0,85 C100,85 150,20 250,50 C350,80 450,10 550,40 C650,70 750,30 800,45" strokeLinecap="round" />
             <circle cx="550" cy="10" r="4" className="fill-[#635BFF] animate-pulse" />
           </svg>
           <div className="absolute top-[-25px] left-[68.75%] -translate-x-1/2 bg-[#1A1F36] text-white px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
             Peak Volume
           </div>
        </div>
      </div>

      {/* 4. Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Recent Activity</h3>
            <button className="text-[11px] text-[#635BFF] font-bold hover:underline">Full Log</button>
          </div>
          <div className="divide-y divide-slate-50">
            {recentOrders.map(order => (
              <div key={order.order_id} className="px-6 py-4 flex justify-between items-center hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-[#635BFF] text-xs font-bold">
                    #{order.order_id}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1A1F36]">Automated Order Fulfillment</p>
                    <p className="text-[11px] text-slate-400 font-mono">{new Date(order.order_date).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                   <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">Processed</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">Coalition Status</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-[11px] font-bold mb-2">
                  <span className="text-slate-500 uppercase tracking-tighter">Database Integrity</span>
                  <span className="text-[#635BFF]">98%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#635BFF] w-[98%] rounded-full"></div>
                </div>
              </div>
              <div className="bg-[#F6F9FC] p-4 rounded-xl border border-slate-100">
                <p className="text-[12px] text-[#424770] leading-relaxed italic">
                  "Solace Coalition Inc is currently maintaining high throughput across all order channels."
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-100 text-[10px] text-slate-400 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            All systems operational
          </div>
        </div>
      </div>
    </div>
  );
}