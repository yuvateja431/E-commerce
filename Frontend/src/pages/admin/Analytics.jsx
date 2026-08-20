import { useState } from "react";
import { Link } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { FiChevronDown, FiTrendingUp, FiUsers, FiClock, FiActivity, FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";
export const AdminAnalyticsPage = () => {
    const [timeRange, setTimeRange] = useState("This Month");
    // Funnel analysis data representing conversions from visitor to purchaser
    const funnelData = [
        { stage: "Store Visits", count: 12500, percentage: 100, fill: "#6366F1" },
        { stage: "Product Views", count: 8400, percentage: 67, fill: "#4F46E5" },
        { stage: "Add to Cart", count: 3100, percentage: 24, fill: "#3B82F6" },
        { stage: "Checkout Started", count: 1800, percentage: 14, fill: "#10B981" },
        { stage: "Successful Order", count: 1248, percentage: 9.9, fill: "#059669" }
    ];
    // Device type percentage share data
    const deviceData = [
        { name: "Mobile", value: 58, color: "#6366F1" },
        { name: "Desktop", value: 34, color: "#3B82F6" },
        { name: "Tablet", value: 8, color: "#10B981" }
    ];
    // Daily active traffic graph
    const dailyTrafficData = [
        { day: "1 May", visitors: 420, orders: 12 },
        { day: "5 May", visitors: 580, orders: 18 },
        { day: "10 May", visitors: 510, orders: 14 },
        { day: "15 May", visitors: 740, orders: 25 },
        { day: "20 May", visitors: 690, orders: 22 },
        { day: "25 May", visitors: 890, orders: 32 },
        { day: "30 May", visitors: 950, orders: 38 }
    ];
    // Top traffic sources table fallback
    const trafficSources = [
        { source: "Google Organic Search", visitors: "6,240", share: 50, trend: "+12.4%", isPositive: true },
        { source: "Direct Url entry", visitors: "3,120", share: 25, trend: "+8.6%", isPositive: true },
        { source: "Instagram Campaigns", visitors: "1,870", share: 15, trend: "+18.9%", isPositive: true },
        { source: "Referral links", visitors: "750", share: 6, trend: "-3.2%", isPositive: false },
        { source: "Others", visitors: "520", share: 4, trend: "+1.2%", isPositive: true }
    ];
    return (<div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 style={{
            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: 'rgb(17, 24, 39)',
            fontSize: '24px',
            lineHeight: '32px'
        }}>
            Analytics
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <Link to="/admin/dashboard" className="hover:text-indigo-600 transition cursor-pointer">Home</Link>
            <span className="text-slate-400">&gt;</span>
            <Link to="/admin/analytics" className="hover:text-indigo-600 transition cursor-pointer">Orders &amp; Delivery</Link>
            <span className="text-slate-400">&gt;</span>
            <Link to="/admin/analytics" className="text-[#4f39f6] font-bold hover:underline cursor-pointer">Analytics</Link>
          </div>
        </div>

        {/* Dynamic Selector Dropdown */}
        <button className="flex items-center gap-2 self-start px-4.5 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-600 shadow-sm hover:bg-gray-50 transition cursor-pointer">
          <span>{timeRange}</span>
          <FiChevronDown size={14} className="text-gray-400"/>
        </button>
      </div>

      {/* Top Statistical KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI Card 1: Conversion Rate */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition duration-200">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <FiActivity size={18}/>
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Conversion Rate</p>
              <p className="text-xl font-black text-gray-900 mt-1">3.24%</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center gap-1.5 text-[11px] font-semibold">
            <span className="text-emerald-500 flex items-center gap-0.5"><FiArrowUpRight size={13}/> +0.4%</span>
            <span className="text-gray-400 font-medium">from last week</span>
          </div>
        </div>

        {/* KPI Card 2: Avg. Session Duration */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition duration-200">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
              <FiClock size={18}/>
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Avg. Session Duration</p>
              <p className="text-xl font-black text-gray-900 mt-1">4m 32s</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center gap-1.5 text-[11px] font-semibold">
            <span className="text-emerald-500 flex items-center gap-0.5"><FiArrowUpRight size={13}/> +12s</span>
            <span className="text-gray-400 font-medium">from last week</span>
          </div>
        </div>

        {/* KPI Card 3: Bounce Rate */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition duration-200">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
              <FiTrendingUp size={18} className="rotate-180 text-rose-500"/>
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Bounce Rate</p>
              <p className="text-xl font-black text-gray-900 mt-1">42.1%</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center gap-1.5 text-[11px] font-semibold">
            <span className="text-emerald-500 flex items-center gap-0.5"><FiArrowUpRight size={13}/> -2.5%</span>
            <span className="text-gray-400 font-medium">from last week</span>
          </div>
        </div>

        {/* KPI Card 4: Active Visitors */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition duration-200">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 relative">
              <FiUsers size={18}/>
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 animate-ping"/>
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Active Visitors Now</p>
              <p className="text-xl font-black text-gray-900 mt-1">148</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-500">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"/>
            <span>Real-time traffic live tracking active</span>
          </div>
        </div>

      </div>

      {/* Main Charts Array Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        
        {/* Left: Traffic Progression Chart (3/5 wide) */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-base font-extrabold text-gray-900 tracking-tight">Active Traffic Flow</h3>
            <span className="text-[10px] font-extrabold text-gray-400 uppercase bg-gray-50 px-2.5 py-1 rounded-md">
              Daily Visitors & Sales
            </span>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="visitorGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.00}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9"/>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: '600' }}/>
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: '600' }}/>
                <Tooltip contentStyle={{
            background: '#FFFFFF',
            border: 'none',
            borderRadius: '16px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            fontSize: '11px',
            fontWeight: 'bold'
        }}/>
                <Area type="monotone" dataKey="visitors" stroke="#6366F1" strokeWidth={2.5} fillOpacity={1} fill="url(#visitorGrad)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Device divisions Donut (2/5 wide) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6 flex flex-col justify-between h-[380px]">
          <div>
            <h3 className="text-base font-extrabold text-gray-900 tracking-tight mb-6">Device Distribution</h3>
            
            <div className="flex justify-center h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deviceData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
                    {deviceData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color}/>))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Centered Total details overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide">Sessions</span>
                <span className="text-lg font-black text-gray-800">18.4K</span>
              </div>
            </div>
          </div>

          {/* Color swatches keys */}
          <div className="grid grid-cols-3 gap-2 border-t border-gray-50 pt-4 mt-auto">
            {deviceData.map((d, index) => (<div key={index} className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }}/>
                  <span className="text-[10px] font-bold text-gray-500">{d.name}</span>
                </div>
                <p className="text-xs font-black text-gray-800 mt-0.5">{d.value}%</p>
              </div>))}
          </div>
        </div>

      </div>

      {/* Bottom Grid Rows: Conversion Funnel and Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        
        {/* Conversion Funnel Details (3/5 wide) */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6 space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-gray-900 tracking-tight">Conversion Funnel</h3>
            <p className="text-xs text-gray-400 mt-1">Acquisition efficiency details tracing from visit to purchase confirmation</p>
          </div>

          <div className="space-y-4">
            {funnelData.map((stage, idx) => (<div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-700">{stage.stage}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400">{stage.count.toLocaleString()} visits</span>
                    <span className="text-indigo-600 font-black">{stage.percentage}%</span>
                  </div>
                </div>

                {/* Progress bar representer */}
                <div className="w-full h-2.5 bg-gray-50 border border-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${stage.percentage}%`, backgroundColor: stage.fill }}/>
                </div>
              </div>))}
          </div>
        </div>

        {/* Traffic Sources Acquisition channels (2/5 wide) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6 space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-gray-900 tracking-tight">Acquisition Channels</h3>
            <p className="text-xs text-gray-400 mt-1">Traffic shares and user origins</p>
          </div>

          <div className="divide-y divide-gray-50">
            {trafficSources.map((item, idx) => (<div key={idx} className="flex items-center justify-between py-3 gap-4 group">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-800 truncate group-hover:text-indigo-600 transition">
                    {item.source}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                    {item.visitors} Visitors
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs font-black text-gray-900">{item.share}%</span>
                  <span className={`text-[10px] font-bold flex items-center gap-0.5 ${item.isPositive ? "text-emerald-500" : "text-rose-500"}`}>
                    {item.isPositive ? <FiArrowUpRight size={12}/> : <FiArrowDownRight size={12}/>}
                    {item.trend}
                  </span>
                </div>
              </div>))}
          </div>
        </div>

      </div>

    </div>);
};
