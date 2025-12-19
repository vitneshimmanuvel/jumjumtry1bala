
import React, { useState, useMemo } from 'react';
import { Guest, PackageType, Amenity, Room, FoodOrder, AdminSubView } from '../types';
import { PACKAGES, AMENITIES, GST_RATE, ROOMS } from '../constants';
import { 
  Users, TrendingUp, Activity, Search, ArrowRight, Wallet, Bed,
  UserPlus, Utensils, Receipt, Calendar, Printer, X, Download,
  LayoutDashboard, Dumbbell, Coffee, ShieldCheck, Gamepad2, Info,
  CheckCircle, PlusCircle, ChefHat, Waves, MapPin, Settings, AlertTriangle
} from 'lucide-react';
import { jsPDF } from 'jspdf';

interface AdminDashboardProps {
  guests: Guest[];
  onRegister: (guest: Partial<Guest>) => void;
  onCheckOut: (guestId: string) => void;
  foodOrders: FoodOrder[];
  onUpdateOrder: (id: string, status: FoodOrder['status']) => void;
  onAddTransaction: (guestId: string, description: string, amount: number) => void;
  onAddFoodOrder: (guestId: string, items: string, amount: number) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  guests, onRegister, onCheckOut, foodOrders, onUpdateOrder, onAddTransaction, onAddFoodOrder 
}) => {
  const [activeTab, setActiveTab] = useState<AdminSubView>('OVERVIEW');
  const [searchTerm, setSearchTerm] = useState('');
  const [showRegModal, setShowRegModal] = useState(false);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [showChargeModal, setShowChargeModal] = useState<{ open: boolean, amenity?: Amenity }>({ open: false });
  const [showAmenityDetail, setShowAmenityDetail] = useState<{ open: boolean, amenity?: Amenity }>({ open: false });
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  const activeGuests = useMemo(() => guests.filter(g => g.status === 'ACTIVE'), [guests]);

  const stats = useMemo(() => {
    const revenueToday = guests.reduce((acc, g) => acc + g.advancePaid, 0);
    const pendingOrders = foodOrders.filter(o => o.status === 'PENDING').length;
    return { activeCount: activeGuests.length, revenueToday, pendingOrders };
  }, [guests, activeGuests, foodOrders]);

  const calculateInvoiceData = (guest: Guest) => {
    const subtotal = guest.transactions.reduce((acc, t) => acc + (t.type === 'DEBIT' ? t.taxableAmount : 0), 0);
    const cgst = guest.transactions.reduce((acc, t) => acc + (t.type === 'DEBIT' ? t.cgst : 0), 0);
    const sgst = guest.transactions.reduce((acc, t) => acc + (t.type === 'DEBIT' ? t.sgst : 0), 0);
    const total = subtotal + cgst + sgst;
    const balance = total - guest.advancePaid;
    return { subtotal, cgst, sgst, total, balance };
  };

  const handleDownloadPDF = (guest: Guest) => {
    const doc = new jsPDF();
    const data = calculateInvoiceData(guest);
    doc.setFontSize(22); doc.setTextColor(22, 101, 52);
    doc.text('KALKI JAM JAM RESORT', 105, 20, { align: 'center' });
    doc.setFontSize(10); doc.setTextColor(100);
    doc.text('Smart Resort System - Bhavani, Tamil Nadu', 105, 28, { align: 'center' });
    doc.line(20, 35, 190, 35);
    doc.setFontSize(12); doc.setTextColor(0);
    doc.text(`INVOICE: #${guest.id}`, 20, 45);
    doc.text(`DATE: ${new Date().toLocaleDateString()}`, 150, 45);
    doc.text(`GUEST: ${guest.name}`, 20, 62);
    let y = 80;
    guest.transactions.filter(t => t.type === 'DEBIT').forEach(t => {
      doc.text(t.description, 25, y);
      doc.text(`Rs. ${t.amount.toLocaleString()}`, 170, y, { align: 'right' });
      y += 8;
    });
    doc.line(20, y, 190, y);
    doc.setFontSize(14); doc.text(`FINAL TOTAL: Rs. ${data.total.toFixed(0)}`, 170, y + 15, { align: 'right' });
    doc.save(`Kalki_Invoice_${guest.id}.pdf`);
  };

  const renderSidebar = () => (
    <div className="w-72 bg-slate-900 min-h-screen text-slate-400 p-6 flex flex-col gap-6 sticky top-0">
      <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-3xl border border-slate-700/50">
        <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-green-900/30">K</div>
        <div>
          <h1 className="text-white font-black text-lg tracking-tight">KALKI / கல்கி</h1>
          <p className="text-[10px] uppercase font-bold tracking-widest text-green-500">Master Portal</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {[
          { id: 'OVERVIEW', label: 'Dashboard / நிலை', icon: <LayoutDashboard size={22} />, color: 'bg-green-600' },
          { id: 'ROOMS', label: 'Rooms / அறைகள்', icon: <Bed size={22} />, color: 'bg-blue-600' },
          { id: 'FOOD', label: 'Food / உணவு', icon: <ChefHat size={22} />, color: 'bg-orange-600' },
          { id: 'AMENITIES', label: 'Amenities / வசதிகள்', icon: <Gamepad2 size={22} />, color: 'bg-purple-600' },
          { id: 'BILLING', label: 'Settlement / பில்லிங்', icon: <Receipt size={22} />, color: 'bg-rose-600' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as AdminSubView)}
            className={`w-full flex items-center gap-4 px-5 py-5 rounded-3xl font-black text-base transition-all ${
              activeTab === item.id 
                ? `${item.color} text-white shadow-2xl scale-105 z-10` 
                : 'hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <span className={activeTab === item.id ? 'text-white' : 'text-slate-500'}>{item.icon}</span>
            <span className="text-left leading-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="bg-slate-800 p-4 rounded-3xl border border-slate-700 text-center">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">System Health</p>
        <div className="flex items-center justify-center gap-2 text-green-500 font-bold">
          <ShieldCheck size={16} /> Online / ஆன்லைன்
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {renderSidebar()}
      
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          
          {activeTab === 'OVERVIEW' && (
            <div className="animate-fadeIn space-y-10">
              <div className="flex justify-between items-center bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div>
                  <h2 className="text-3xl font-black text-slate-800">Quick Actions / முக்கிய பணிகள்</h2>
                  <p className="text-slate-500 font-bold">Use these buttons to start new entries or orders.</p>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setShowRegModal(true)} className="bg-green-600 text-white px-8 py-5 rounded-3xl font-black flex items-center gap-3 shadow-xl hover:bg-green-700 transition-all active:scale-95 text-lg">
                    <UserPlus size={24} /> New Entry / புதிய பதிவு
                  </button>
                  <button onClick={() => setShowFoodModal(true)} className="bg-orange-600 text-white px-8 py-5 rounded-3xl font-black flex items-center gap-3 shadow-xl hover:bg-orange-700 transition-all active:scale-95 text-lg">
                    <Utensils size={24} /> New Order / புதிய ஆர்டர்
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { label: 'Inside Resort / உள்ளே', value: stats.activeCount, icon: <Users size={32} />, color: 'bg-blue-500', text: 'Guests' },
                  { label: 'Collection / வசூல்', value: `₹${stats.revenueToday.toLocaleString()}`, icon: <TrendingUp size={32} />, color: 'bg-green-500', text: 'Total Today' },
                  { label: 'Pending Food / உணவு', value: stats.pendingOrders, icon: <ChefHat size={32} />, color: 'bg-orange-500', text: 'Kitchen Orders' },
                ].map((s, i) => (
                  <div key={i} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden group">
                    <div className="relative z-10">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{s.label}</p>
                      <h4 className="text-5xl font-black text-slate-800 mb-1">{s.value}</h4>
                      <p className="text-sm font-bold text-slate-400">{s.text}</p>
                    </div>
                    <div className={`absolute -right-8 -bottom-8 p-12 rounded-full ${s.color} opacity-10 group-hover:scale-125 transition-transform duration-500`}>
                      {s.icon}
                    </div>
                  </div>
                ))}
              </div>

              {/* Individual Amenity Fast-Charge Panel */}
              <div className="space-y-6">
                 <h3 className="text-2xl font-black text-slate-800">Quick Amenity Billing / உடனடி வசதிகள் பில்லிங்</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {AMENITIES.filter(a => a.basePrice > 0).map(amenity => (
                      <button 
                        key={amenity.id}
                        onClick={() => setShowAmenityDetail({ open: true, amenity })}
                        className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:border-purple-500 hover:shadow-xl transition-all flex flex-col items-center gap-2 group active:scale-95"
                      >
                         <span className="text-4xl group-hover:scale-110 transition-transform">{amenity.icon}</span>
                         <span className="text-[10px] font-black text-slate-400 uppercase">{amenity.name.ta}</span>
                         <span className="text-xs font-black text-slate-900">Details / விவரம்</span>
                      </button>
                    ))}
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'ROOMS' && (
            <div className="animate-fadeIn space-y-8">
              <div className="flex justify-between items-center">
                 <h2 className="text-3xl font-black text-slate-800">Room Status / அறை நிலவரம்</h2>
                 <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Available</div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><span className="w-3 h-3 bg-blue-500 rounded-full"></span> Occupied</div>
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {ROOMS.map(room => (
                  <div key={room.id} className={`p-8 rounded-[2.5rem] border-4 transition-all ${
                    room.status === 'AVAILABLE' ? 'bg-white border-green-100' :
                    room.status === 'OCCUPIED' ? 'bg-slate-50 border-blue-500 shadow-xl' : 'bg-slate-100 border-slate-200 opacity-60'
                  }`}>
                    <div className="flex justify-between items-start mb-6">
                      <div className={`p-4 rounded-2xl ${room.status === 'OCCUPIED' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}><Bed size={32} /></div>
                      <span className={`text-xs font-black px-4 py-2 rounded-xl shadow-sm uppercase ${
                        room.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                        room.status === 'OCCUPIED' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {room.status === 'AVAILABLE' ? 'Available / காலியாக உள்ளது' : room.status}
                      </span>
                    </div>
                    <h4 className="text-4xl font-black text-slate-800">Room {room.number}</h4>
                    <p className="text-sm font-black text-slate-400 mb-6 uppercase tracking-widest">{room.type}</p>
                    
                    <div className="space-y-4 mb-8">
                      <p className="text-[10px] font-black text-slate-400 uppercase">Room Amenities / வசதிகள்</p>
                      <div className="flex flex-wrap gap-2">
                        {room.amenities.map(a => <span key={a} className="text-[10px] font-bold bg-slate-200/50 px-2 py-1 rounded-lg text-slate-600">{a}</span>)}
                      </div>
                    </div>

                    {room.status === 'OCCUPIED' ? (
                      <div className="pt-6 border-t border-slate-200">
                        <p className="text-xs font-black text-slate-400 uppercase mb-1">Current Guest</p>
                        <p className="text-xl font-black text-slate-800 truncate">{guests.find(g => g.id === room.currentGuestId)?.name}</p>
                        <p className="text-xs font-bold text-slate-500">Phone: {guests.find(g => g.id === room.currentGuestId)?.phone}</p>
                      </div>
                    ) : (
                      <button className="w-full bg-green-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-green-100 hover:bg-green-700 active:scale-95 transition-all">Assign Room / அறை ஒதுக்கு</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'FOOD' && (
            <div className="animate-fadeIn space-y-8">
              <div className="flex justify-between items-center">
                 <h2 className="text-3xl font-black text-slate-800">Kitchen Portal / சமையலறை</h2>
                 <button onClick={() => setShowFoodModal(true)} className="bg-orange-600 text-white px-8 py-4 rounded-3xl font-black flex items-center gap-3 shadow-xl active:scale-95">
                    <PlusCircle size={24} /> New Food Order / புதிய ஆர்டர்
                 </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {foodOrders.filter(o => o.status !== 'DELIVERED').map(order => (
                  <div key={order.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border-t-[12px] border-orange-500 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                       <span className="text-sm font-black text-slate-400">Order #{order.id}</span>
                       <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase ${
                         order.status === 'PENDING' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                       }`}>
                         {order.status === 'PENDING' ? 'New / புதியது' : 'Preparing / தயார் செய்கிறது'}
                       </span>
                    </div>
                    <h4 className="text-2xl font-black text-slate-800 mb-2">{order.guestName}</h4>
                    <div className="bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-100">
                       <p className="text-lg font-bold text-slate-700 leading-relaxed italic">"{order.items}"</p>
                    </div>
                    <div className="flex items-center justify-between">
                       <p className="text-2xl font-black text-slate-900">₹{order.amount}</p>
                       <div className="flex gap-3">
                         {order.status === 'PENDING' && (
                           <button onClick={() => onUpdateOrder(order.id, 'PREPARING')} className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-100 flex items-center gap-2 active:scale-95">
                             Start Cooking / தயார் செய்
                           </button>
                         )}
                         {order.status === 'PREPARING' && (
                           <button onClick={() => onUpdateOrder(order.id, 'DELIVERED')} className="px-6 py-3 bg-green-600 text-white rounded-2xl font-black shadow-lg shadow-green-100 flex items-center gap-2 active:scale-95">
                             Ready / டெலிவரி செய்
                           </button>
                         )}
                       </div>
                    </div>
                  </div>
                ))}
                {foodOrders.filter(o => o.status !== 'DELIVERED').length === 0 && (
                  <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                    <ChefHat size={80} className="text-slate-200 mb-6" />
                    <h4 className="text-2xl font-black text-slate-400">No active orders / ஆர்டர்கள் எதுவும் இல்லை</h4>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'AMENITIES' && (
            <div className="animate-fadeIn space-y-12">
              <h2 className="text-3xl font-black text-slate-800">All Amenities / அனைத்து வசதிகள்</h2>
              
              {/* Category-wise View */}
              {(['FUN', 'WELLNESS', 'FOOD', 'FACILITY', 'SPORTS', 'SAFETY'] as const).map(cat => (
                <div key={cat} className="space-y-6">
                   <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest border-b pb-2">{cat}</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {AMENITIES.filter(a => a.category === cat).map(amenity => (
                        <div 
                          key={amenity.id} 
                          onClick={() => setShowAmenityDetail({ open: true, amenity })}
                          className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center gap-4 hover:shadow-2xl transition-all group cursor-pointer"
                        >
                           <div className="text-6xl group-hover:scale-110 transition-transform mb-2">{amenity.icon}</div>
                           <div>
                              <h4 className="text-xl font-black text-slate-800 mb-1">{amenity.name.en}</h4>
                              <p className="text-lg font-bold text-green-600">{amenity.name.ta}</p>
                           </div>
                           <div className="w-full mt-4 pt-4 border-t border-slate-50 flex justify-between items-center px-4">
                              <span className="text-sm font-black text-slate-400">Rate: ₹{amenity.basePrice}</span>
                              <div className="bg-slate-900 text-white p-3 rounded-2xl group-hover:bg-green-600 transition-all">
                                 <PlusCircle size={20} />
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'BILLING' && !selectedGuest && (
            <div className="animate-fadeIn space-y-8">
              <div className="flex justify-between items-center">
                 <h2 className="text-3xl font-black text-slate-800">Guest Settlement / பில்லிங்</h2>
                 <div className="relative w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="text" 
                      value={searchTerm} 
                      onChange={e => setSearchTerm(e.target.value)} 
                      placeholder="Search Name or Phone..." 
                      className="w-full bg-white border-2 border-slate-100 py-5 pl-14 pr-6 rounded-3xl font-bold shadow-sm focus:border-rose-500 outline-none"
                    />
                 </div>
              </div>
              <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-slate-100">
                 <table className="w-full text-left">
                    <thead className="bg-slate-900 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                       <tr>
                          <th className="p-8">Guest Details / விருந்தினர்</th>
                          <th className="p-8">Package / பேக்கேஜ்</th>
                          <th className="p-8">Collection / வசூல்</th>
                          <th className="p-8">Bill Amount / மொத்த பில்</th>
                          <th className="p-8 text-right">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {activeGuests.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase())).map(g => {
                         const { total, balance } = calculateInvoiceData(g);
                         return (
                           <tr key={g.id} className="hover:bg-slate-50 transition-colors group">
                              <td className="p-8">
                                 <p className="text-xl font-black text-slate-800">{g.name}</p>
                                 <p className="text-sm font-bold text-slate-400">{g.phone} • ID: {g.id}</p>
                              </td>
                              <td className="p-8">
                                 <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase ${PACKAGES[g.packageType].color} border shadow-sm`}>
                                    {g.packageType}
                                 </span>
                              </td>
                              <td className="p-8 font-black text-slate-800 text-lg">
                                 ₹{g.advancePaid}
                              </td>
                              <td className="p-8">
                                 <p className="text-2xl font-black text-slate-900">₹{total.toFixed(0)}</p>
                                 <p className={`text-xs font-black ${balance > 0 ? 'text-rose-500' : 'text-green-600'}`}>
                                    {balance > 0 ? `Pending: ₹${balance.toFixed(0)}` : 'Settle & Refund'}
                                 </p>
                              </td>
                              <td className="p-8 text-right">
                                 <button onClick={() => setSelectedGuest(g)} className="bg-rose-600 text-white px-8 py-4 rounded-3xl font-black shadow-lg shadow-rose-100 hover:bg-rose-700 active:scale-95 transition-all text-sm">
                                    Final Settlement
                                 </button>
                              </td>
                           </tr>
                         );
                       })}
                    </tbody>
                 </table>
                 {activeGuests.length === 0 && (
                   <div className="p-32 text-center flex flex-col items-center">
                      <Receipt size={80} className="text-slate-100 mb-4" />
                      <p className="text-xl font-black text-slate-300">No active guests / விருந்தினர்கள் இல்லை</p>
                   </div>
                 )}
              </div>
            </div>
          )}

          {activeTab === 'BILLING' && selectedGuest && (
             <div className="animate-fadeIn max-w-4xl mx-auto pb-20">
                <button onClick={() => setSelectedGuest(null)} className="mb-8 flex items-center gap-3 text-slate-500 font-black hover:text-slate-800 group">
                  <div className="p-2 bg-slate-100 rounded-full group-hover:bg-slate-200"><X size={24} /></div>
                  Back to Guests / பின்செல்லவும்
                </button>
                <div className="bg-white p-12 rounded-[4rem] shadow-2xl space-y-10 border border-slate-100 relative overflow-hidden">
                   <div className="flex justify-between items-start">
                      <div className="space-y-1">
                         <h2 className="text-4xl font-black text-slate-900">KALKI INVOICE</h2>
                         <p className="text-sm font-black text-rose-500 tracking-[0.3em]">RESORT TAX INVOICE</p>
                      </div>
                      <div className="text-right">
                         <p className="text-xl font-black text-slate-800">#{selectedGuest.id}</p>
                         <p className="text-sm font-bold text-slate-400 uppercase">{new Date().toLocaleDateString()}</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-10 border-y-2 border-slate-50 py-10">
                      <div>
                        <p className="text-xs font-black text-slate-400 mb-3 uppercase tracking-widest">Guest Details</p>
                        <p className="text-3xl font-black text-slate-800 mb-1">{selectedGuest.name}</p>
                        <p className="text-lg font-bold text-slate-500">{selectedGuest.phone}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-slate-400 mb-3 uppercase tracking-widest">Package & Stay</p>
                        <p className="text-2xl font-black text-blue-600 mb-1">{PACKAGES[selectedGuest.packageType].name}</p>
                        <p className="text-lg font-bold text-slate-500">Room Number: {selectedGuest.roomNumber || 'Walk-in'}</p>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Usage History / பயன்பாடு</p>
                      <div className="space-y-3">
                        {selectedGuest.transactions.filter(t => t.type === 'DEBIT').map(t => (
                          <div key={t.id} className="flex justify-between items-center py-4 px-6 bg-slate-50 rounded-3xl border border-slate-100 group">
                             <div>
                                <p className="text-lg font-black text-slate-800">{t.description}</p>
                                <p className="text-xs text-slate-400 font-bold">{t.timestamp.toLocaleTimeString()}</p>
                             </div>
                             <p className="text-xl font-black text-slate-900">₹{t.amount.toFixed(0)}</p>
                          </div>
                        ))}
                      </div>
                   </div>

                   <div className="flex justify-end pt-10">
                      <div className="w-80 space-y-4">
                         {(() => {
                           const data = calculateInvoiceData(selectedGuest);
                           return (
                             <>
                               <div className="flex justify-between text-base font-bold text-slate-400">
                                  <span>GST Total (18%)</span>
                                  <span>₹{(data.cgst + data.sgst).toFixed(2)}</span>
                               </div>
                               <div className="flex justify-between text-3xl font-black text-slate-900 pt-6 border-t-2 border-slate-100">
                                  <span>Grand Total</span>
                                  <span>₹{data.total.toFixed(0)}</span>
                               </div>
                               <div className="flex justify-between text-lg font-black text-green-600 pt-2">
                                  <span>Advance Paid</span>
                                  <span>- ₹{selectedGuest.advancePaid}</span>
                               </div>
                               <div className={`flex justify-between p-8 rounded-[2.5rem] mt-8 font-black text-3xl shadow-2xl ${data.balance >= 0 ? 'bg-rose-600 text-white shadow-rose-200' : 'bg-green-600 text-white shadow-green-200'}`}>
                                  <span>{data.balance >= 0 ? 'Collect' : 'Refund'}</span>
                                  <span>₹{Math.abs(data.balance).toFixed(0)}</span>
                               </div>
                             </>
                           );
                         })()}
                      </div>
                   </div>

                   <div className="flex gap-4 justify-end pt-10">
                      <button onClick={() => handleDownloadPDF(selectedGuest)} className="flex items-center gap-3 px-10 py-5 bg-slate-100 rounded-3xl font-black text-slate-700 hover:bg-slate-200 transition-all"><Download size={24} /> Download PDF</button>
                      <button onClick={() => window.print()} className="flex items-center gap-3 px-10 py-5 bg-slate-100 rounded-3xl font-black text-slate-700 hover:bg-slate-200 transition-all"><Printer size={24} /> Print Bill</button>
                      {selectedGuest.status === 'ACTIVE' && (
                        <button 
                          onClick={() => { onCheckOut(selectedGuest.id); setSelectedGuest(null); }} 
                          className="px-12 py-5 bg-green-600 text-white rounded-3xl font-black text-xl shadow-2xl shadow-green-200 hover:bg-green-700 active:scale-95"
                        >
                          Settle & Exit / வெளியேறு
                        </button>
                      )}
                   </div>
                </div>
             </div>
          )}
        </div>
      </main>

      {/* Amenity Detail View Modal */}
      {showAmenityDetail.open && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl animate-fadeIn">
           <div className="bg-white w-full max-w-2xl rounded-[4rem] shadow-2xl overflow-hidden animate-scaleIn border border-white/20">
              <div className="relative h-48 bg-gradient-to-br from-purple-600 to-indigo-700 flex flex-col items-center justify-center text-white">
                 <span className="text-8xl mb-2">{showAmenityDetail.amenity?.icon}</span>
                 <button onClick={() => setShowAmenityDetail({ open: false })} className="absolute top-6 right-6 p-3 bg-white/20 rounded-full hover:bg-white/40"><X size={24} /></button>
              </div>
              <div className="p-12 space-y-8">
                 <div className="text-center">
                    <h3 className="text-4xl font-black text-slate-800">{showAmenityDetail.amenity?.name.en}</h3>
                    <p className="text-xl font-bold text-purple-600">{showAmenityDetail.amenity?.name.ta}</p>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Standard Rate</p>
                       <p className="text-2xl font-black text-slate-800">₹{showAmenityDetail.amenity?.basePrice}</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Status</p>
                       <span className="inline-flex items-center gap-2 text-green-600 font-black text-lg"><span className="w-3 h-3 bg-green-500 rounded-full"></span> OPEN</span>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">Description / விளக்கம்</h4>
                    <p className="text-slate-600 font-medium italic">"{showAmenityDetail.amenity?.description?.en}"</p>
                    <p className="text-slate-500 font-bold">"{showAmenityDetail.amenity?.description?.ta}"</p>
                 </div>

                 {showAmenityDetail.amenity?.rules && (
                   <div className="space-y-4">
                      <h4 className="font-black text-rose-500 uppercase text-xs tracking-widest flex items-center gap-2">
                        <AlertTriangle size={16} /> Important Rules / விதிகள்
                      </h4>
                      <ul className="list-disc list-inside text-sm font-bold text-slate-600 space-y-1">
                        {showAmenityDetail.amenity.rules.map((rule, idx) => <li key={idx}>{rule}</li>)}
                      </ul>
                   </div>
                 )}

                 <div className="pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => {
                        setShowAmenityDetail({ open: false });
                        setShowChargeModal({ open: true, amenity: showAmenityDetail.amenity });
                      }}
                      className="w-full bg-purple-600 py-6 rounded-3xl text-white font-black text-2xl shadow-2xl shadow-purple-100 hover:bg-purple-700 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                       <Receipt size={28} /> Add Charge / கட்டணம் சேர்
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Other Modals... (Keep existing logic for Registration, Food, and Charge) */}
      {showRegModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl animate-fadeIn">
           <div className="bg-white w-full max-w-2xl rounded-[4rem] p-12 shadow-2xl space-y-10 animate-scaleIn border border-white/20">
              <div className="flex justify-between items-center">
                 <div>
                    <h3 className="text-4xl font-black text-slate-800">New Guest / புதியவர்</h3>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Guest Registration Form</p>
                 </div>
                 <button onClick={() => setShowRegModal(false)} className="p-3 bg-slate-100 rounded-full hover:bg-slate-200"><X size={32} /></button>
              </div>
              <form className="space-y-8" onSubmit={e => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                onRegister({
                  name: formData.get('name') as string,
                  phone: formData.get('phone') as string,
                  packageType: formData.get('package') as PackageType,
                  advancePaid: Number(formData.get('advance'))
                });
                setShowRegModal(false);
              }}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-xs font-black text-slate-400 uppercase px-4">Full Name / பெயர்</label>
                       <input name="name" required placeholder="Guest Name" className="w-full bg-slate-50 border-4 border-slate-100 p-6 rounded-3xl font-black text-xl outline-none focus:border-green-500 focus:bg-white transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-slate-400 uppercase px-4">Mobile / போன்</label>
                       <input name="phone" required placeholder="10 Digit Number" className="w-full bg-slate-50 border-4 border-slate-100 p-6 rounded-3xl font-black text-xl outline-none focus:border-green-500 focus:bg-white transition-all" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase px-4">Select Package / பேக்கேஜ்</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                       {Object.values(PackageType).map(t => (
                         <label key={t} className="cursor-pointer group">
                           <input type="radio" name="package" value={t} className="hidden peer" defaultChecked={t === PackageType.BASIC} />
                           <div className="p-4 border-4 border-slate-100 rounded-3xl text-center font-black transition-all peer-checked:border-green-600 peer-checked:bg-green-50 peer-checked:scale-105">
                              <div className="text-[10px] text-slate-400 uppercase">{t}</div>
                              <div className="text-sm">₹{PACKAGES[t].price}</div>
                           </div>
                         </label>
                       ))}
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase px-4">Initial Advance / முன் பணம்</label>
                    <input name="advance" type="number" required placeholder="Ex: 500" className="w-full bg-slate-50 border-4 border-slate-100 p-8 rounded-3xl font-black text-4xl text-green-600 outline-none focus:border-green-500 focus:bg-white transition-all text-center" />
                 </div>
                 <button type="submit" className="w-full bg-green-600 py-6 rounded-3xl text-white font-black text-2xl shadow-2xl shadow-green-100 transition-all hover:bg-green-700 active:scale-95">Complete Registration</button>
              </form>
           </div>
        </div>
      )}

      {showFoodModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl animate-fadeIn">
           <div className="bg-white w-full max-w-xl rounded-[4rem] p-12 shadow-2xl space-y-8 border border-white/20">
              <div className="flex justify-between items-center">
                 <h3 className="text-3xl font-black text-slate-800">New Food Order</h3>
                 <button onClick={() => setShowFoodModal(false)} className="p-2 bg-slate-100 rounded-full"><X size={32} /></button>
              </div>
              <form className="space-y-6" onSubmit={e => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                onAddFoodOrder(
                  formData.get('guestId') as string,
                  formData.get('items') as string,
                  Number(formData.get('amount'))
                );
                setShowFoodModal(false);
              }}>
                 <div className="space-y-4">
                    <select name="guestId" required className="w-full bg-slate-50 border-4 border-slate-100 p-5 rounded-3xl font-black text-lg outline-none focus:border-orange-500">
                       <option value="">Select Guest / விருந்தினர்</option>
                       {activeGuests.map(g => <option key={g.id} value={g.id}>{g.name} (Room: {g.roomNumber || 'None'})</option>)}
                    </select>
                    <textarea name="items" required placeholder="What did they order? (Ex: 2 Dosa, 1 Coffee)" className="w-full bg-slate-50 border-4 border-slate-100 p-5 rounded-3xl font-black text-lg outline-none h-32 focus:border-orange-500" />
                    <input name="amount" type="number" required placeholder="Total Bill Amount ₹" className="w-full bg-slate-50 border-4 border-slate-100 p-8 rounded-3xl font-black text-3xl outline-none focus:border-orange-500 text-center" />
                 </div>
                 <button type="submit" className="w-full bg-orange-600 py-6 rounded-3xl text-white font-black text-2xl shadow-2xl shadow-orange-100 active:scale-95">Submit Order to Kitchen</button>
              </form>
           </div>
        </div>
      )}

      {showChargeModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl animate-fadeIn">
           <div className="bg-white w-full max-w-xl rounded-[4rem] p-12 shadow-2xl space-y-8">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    <span className="text-5xl">{showChargeModal.amenity?.icon}</span>
                    <div>
                       <h3 className="text-3xl font-black text-slate-800">{showChargeModal.amenity?.name.en}</h3>
                       <p className="text-green-600 font-bold">{showChargeModal.amenity?.name.ta}</p>
                    </div>
                 </div>
                 <button onClick={() => setShowChargeModal({ open: false })} className="p-2 bg-slate-100 rounded-full"><X size={32} /></button>
              </div>
              <form className="space-y-8" onSubmit={e => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                onAddTransaction(
                  formData.get('guestId') as string,
                  showChargeModal.amenity?.name.en || 'Amenity Usage',
                  Number(formData.get('amount'))
                );
                setShowChargeModal({ open: false });
              }}>
                 <div className="space-y-4">
                    <select name="guestId" required className="w-full bg-slate-50 border-4 border-slate-100 p-6 rounded-3xl font-black text-xl outline-none focus:border-purple-500">
                       <option value="">Select Guest / விருந்தினர்</option>
                       {activeGuests.map(g => <option key={g.id} value={g.id}>{g.name} (ID: {g.id})</option>)}
                    </select>
                    <div className="space-y-2 text-center">
                       <label className="text-xs font-black text-slate-400 uppercase">Billing Amount / கட்டணம்</label>
                       <input name="amount" type="number" required defaultValue={showChargeModal.amenity?.basePrice} className="w-full bg-slate-50 border-4 border-slate-100 p-8 rounded-3xl font-black text-5xl text-purple-600 outline-none focus:border-purple-500 text-center" />
                    </div>
                 </div>
                 <button type="submit" className="w-full bg-purple-600 py-6 rounded-3xl text-white font-black text-2xl shadow-2xl shadow-purple-100 active:scale-95">Confirm Charge</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
