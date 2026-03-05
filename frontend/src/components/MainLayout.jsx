import logo from '../assets/SolaceCoalition.png';

export default function MainLayout({ children, activeTab, setActiveTab }) {
    const menuItems = [
      { name: 'Home', icon: '🏠' },
      { name: 'Customers', icon: '👥' },
      { name: 'Products', icon: '📦' },
      { name: 'Orders', icon: '📋' },
      { name: 'Order Items', icon: '🔗' }
    ];
  
    return (
      <div className="flex min-h-screen bg-[#F6F9FC] font-sans text-[#424770]">
        {/* Sidebar with Logo */}
        <aside className="w-64 bg-[#F6F9FC] flex flex-col fixed h-full border-r border-slate-200">
          <div className="p-6 flex items-center gap-3">
            <div className="w-13 h-13 flex items-center justify-center bg-[#3ECF8E]/10 rounded-lg">
              <img 
                src={logo} 
                alt="SolaceCoalition" 
                className="w-8 h-8 object-contain" 
              />
            </div>
            <span className="font-bold text-[#1A1F36] text-lg tracking-tight">Solace Coalition</span>
          </div>
          
          <nav className="flex-1 px-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                  activeTab === item.name 
                  ? 'bg-white shadow-sm text-[#635BFF]' 
                  : 'text-[#4F566B] hover:text-[#1A1F36] hover:bg-slate-100/50'
                }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </button>
            ))}
          </nav>
        </aside>
  
        {/* Main Content Area */}
        <main className="flex-1 ml-64 flex flex-col">
          {/* Top Header/Search Bar */}
          <header className="h-16 flex items-center justify-between px-10 border-b border-transparent">
            <div className="relative w-96">
              <input 
                className="w-full bg-transparent border-none focus:ring-0 text-sm placeholder-slate-400" 
                placeholder="Search..." 
              />
            </div>
            <div className="flex items-center gap-6 opacity-60">
               <span>🔔</span>
               <span>❓</span>
               <div className="w-8 h-8 bg-slate-300 rounded-full border-2 border-white shadow-sm" />
            </div>
          </header>
  
          {/* Content Body - Where your Products/Orders/Customers live */}
          <div className="px-10 py-8">
            {children}
          </div>
        </main>
      </div>
    );
  }