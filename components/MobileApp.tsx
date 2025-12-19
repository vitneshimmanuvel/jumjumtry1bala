
import React, { useState, useEffect, useRef } from 'react';
import { Guest, PackageType, Amenity } from '../types';
import { PACKAGES, AMENITIES } from '../constants';
import { gemini } from '../services/geminiService';
import { 
  Home, Wallet, QrCode, MessageCircle, Utensils, Waves, 
  MapPin, Sparkles, Send, Mic, Phone, X, History, Info, AlertCircle
} from 'lucide-react';

const MobileApp: React.FC<{ guest: Guest }> = ({ guest }) => {
  const [activeTab, setActiveTab] = useState<'HOME' | 'WALLET' | 'CHAT' | 'MEMORIES'>('HOME');
  const [chatInput, setChatInput] = useState('');
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: `Vanakkam, ${guest.name}! I am Sakhi. How can I make your day at Kalki Jam Jam amazing?` }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [souvenirPrompt, setSouvenirPrompt] = useState('');
  const [souvenirImg, setSouvenirImg] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userText = chatInput;
    setChatInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    try {
      const response = await gemini.chatWithConcierge(
        messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
        userText
      );
      setMessages(prev => [...prev, { role: 'model', text: response || "I'm sorry, I missed that. Can you repeat?" }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Technical hitch! Sakhi is taking a small break. Try again in a bit!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateSouvenir = async () => {
    if (!souvenirPrompt) return;
    setIsTyping(true);
    try {
      const img = await gemini.generateDigitalSouvenir(souvenirPrompt);
      setSouvenirImg(img);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  const renderHome = () => (
    <div className="p-4 space-y-6 animate-fadeIn pb-24">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-green-100 font-medium">Welcome / வருக!</p>
          <h2 className="text-2xl font-bold">{guest.name}</h2>
          <div className="mt-4 flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            {PACKAGES[guest.packageType].name}
          </div>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Waves size={100} />
        </div>
      </div>

      {/* Wallet Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Wallet size={18} />
            </div>
            <span className="text-xs font-bold text-slate-500">Balance / இருப்பு</span>
          </div>
          <p className="text-xl font-bold text-slate-800">₹{guest.walletBalance}</p>
        </div>
        <div 
          onClick={() => setActiveTab('WALLET')}
          className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:border-green-200 transition-colors"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <QrCode size={18} />
            </div>
            <span className="text-xs font-bold text-slate-500">Smart ID / ஐடி</span>
          </div>
          <p className="text-xs text-slate-400 font-medium italic">Scan for Access</p>
        </div>
      </div>

      {/* Recommended for You */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Sparkles size={18} className="text-yellow-500" />
            Fun Checklist / வசதிகள்
          </h3>
          <span className="text-xs font-bold text-green-600">See All</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {AMENITIES.map(amenity => (
            <div 
              key={amenity.id} 
              onClick={() => setSelectedAmenity(amenity)}
              className="min-w-[140px] bg-white rounded-2xl p-4 shadow-sm border border-slate-100 shrink-0 cursor-pointer active:scale-95 transition-transform"
            >
              <div className="text-3xl mb-3">{amenity.icon}</div>
              <div className="mb-2">
                <p className="font-bold text-sm text-slate-800 leading-tight">{amenity.name.en}</p>
                <p className="text-[10px] font-bold text-green-600">{amenity.name.ta}</p>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                {amenity.includedIn.includes(guest.packageType) ? '✅ Included' : `₹${amenity.basePrice}`}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: <Utensils />, label: 'Food', ta: 'உணவு', color: 'bg-orange-50 text-orange-600' },
          { icon: <Waves />, label: 'Pool', ta: 'குளம்', color: 'bg-blue-50 text-blue-600' },
          { icon: <MapPin />, label: 'Map', ta: 'வரைபடம்', color: 'bg-red-50 text-red-600' },
          { icon: <Phone />, label: 'SOS', ta: 'உதவி', color: 'bg-rose-100 text-rose-600' }
        ].map((action, i) => (
          <button key={i} className="flex flex-col items-center gap-1">
            <div className={`p-4 rounded-2xl ${action.color} shadow-sm active:scale-95 transition-transform`}>
              {action.icon}
            </div>
            <span className="text-[10px] font-bold text-slate-800">{action.label}</span>
            <span className="text-[9px] font-bold text-slate-400">{action.ta}</span>
          </button>
        ))}
      </div>

      {/* Amenity Detail Modal */}
      {selectedAmenity && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-[420px] rounded-t-[3rem] p-8 shadow-2xl animate-slideUp space-y-6">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <span className="text-4xl">{selectedAmenity.icon}</span>
                   <div>
                      <h3 className="text-xl font-bold text-slate-800">{selectedAmenity.name.en}</h3>
                      <p className="text-xs text-green-600 font-bold">{selectedAmenity.name.ta}</p>
                   </div>
                </div>
                <button onClick={() => setSelectedAmenity(null)} className="p-2 bg-slate-100 rounded-full"><X size={20} /></button>
             </div>

             <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl">
                   <p className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                      <Info size={14} /> Information
                   </p>
                   <p className="text-sm text-slate-700 italic font-medium leading-relaxed">
                      "{(selectedAmenity as any).description?.en || 'Enjoy our world-class facilities.'}"
                   </p>
                   <p className="text-xs text-slate-500 mt-2 font-bold">
                      "{(selectedAmenity as any).description?.ta || 'எங்கள் உலகத்தரம் வாய்ந்த வசதிகளை அனுபவிக்கவும்.'}"
                   </p>
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl">
                   <span className="text-xs font-bold text-slate-500 uppercase">Rate / விலை</span>
                   <span className="text-lg font-black text-slate-800">
                      {selectedAmenity.includedIn.includes(guest.packageType) ? 'FREE' : `₹${selectedAmenity.basePrice}`}
                   </span>
                </div>

                {(selectedAmenity as any).rules && (
                   <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                      <p className="text-xs font-bold text-rose-600 uppercase mb-2 flex items-center gap-1">
                         <AlertCircle size={14} /> Rules / விதிகள்
                      </p>
                      <ul className="text-xs font-bold text-slate-600 space-y-1">
                         {(selectedAmenity as any).rules.map((rule: string, i: number) => <li key={i}>• {rule}</li>)}
                      </ul>
                   </div>
                )}
             </div>

             <button 
              onClick={() => setSelectedAmenity(null)}
              className="w-full bg-green-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-green-100 active:scale-95 transition-all"
             >
                Got it / சரி
             </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderWallet = () => (
    <div className="p-4 space-y-6 animate-fadeIn pb-24 h-full">
      <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center text-center">
        <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200 mb-6">
          <div className="w-48 h-48 bg-white flex items-center justify-center border border-slate-100 shadow-inner rounded-xl">
            <QrCode size={120} className="text-slate-800" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">{guest.name}</h2>
        <p className="text-sm font-medium text-slate-400">ID: {guest.id}</p>
        
        <div className="mt-8 w-full space-y-4">
          <div className="bg-green-50 p-4 rounded-2xl flex items-center justify-between border border-green-100">
            <div className="text-left">
              <span className="text-xs font-bold text-green-800 block">Balance / இருப்பு</span>
            </div>
            <span className="text-lg font-black text-green-900">₹{guest.walletBalance}</span>
          </div>
          <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-transform">
            <span>Add Balance / பணம் சேர்க்க</span>
            <span className="text-[10px] opacity-70">(UPI / Cash at Counter)</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <History size={18} />
          Usage History / பயன்பாடு
        </h3>
        <div className="space-y-2">
          {guest.transactions.length > 0 ? guest.transactions.map(t => (
            <div key={t.id} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'CREDIT' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {t.type === 'CREDIT' ? '+' : '-'}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{t.description}</p>
                  <p className="text-[10px] text-slate-400">{t.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
              <span className={`text-sm font-bold ${t.type === 'CREDIT' ? 'text-green-600' : 'text-slate-800'}`}>
                ₹{t.amount}
              </span>
            </div>
          )) : (
            <p className="text-center py-8 text-slate-400 font-medium text-sm">No usage yet / பயன்பாடு இல்லை</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderConcierge = () => (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-fadeIn">
      <div className="bg-white border-b p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-black">
          S
        </div>
        <div>
          <h3 className="font-bold text-slate-800">Sakhi AI Concierge / உதவியாளர்</h3>
          <p className="text-[10px] font-bold text-green-600">Always Active • 24/7</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
              m.role === 'user' 
                ? 'bg-green-600 text-white rounded-br-none shadow-md' 
                : 'bg-white text-slate-800 rounded-bl-none border border-slate-100 shadow-sm'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-slate-100 shadow-sm">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75" />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150" />
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 bg-white border-t space-y-3">
        <div className="flex gap-2">
          {['Pool timings?', 'Food menu', 'Contact Staff'].map(hint => (
            <button 
              key={hint} 
              onClick={() => { setChatInput(hint); }}
              className="text-[10px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200"
            >
              {hint}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
          <button className="p-2 text-slate-400 hover:text-green-600">
            <Mic size={20} />
          </button>
          <input 
            type="text" 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask Sakhi / கேள்வி கேட்கவும்..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!chatInput.trim()}
            className="p-2 bg-green-600 text-white rounded-xl active:scale-95 transition-transform disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderMemories = () => (
    <div className="p-4 space-y-6 animate-fadeIn pb-24">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">Memories / நினைவுகள்</h2>
        <p className="text-xs text-slate-500 font-medium">Capture your best moments with Kalki AI</p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Digital Souvenir Creator</label>
          <input 
            type="text" 
            value={souvenirPrompt}
            onChange={(e) => setSouvenirPrompt(e.target.value)}
            placeholder="Me and family at the pool..."
            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm focus:ring-2 focus:ring-green-500 outline-none font-medium"
          />
        </div>
        <button 
          onClick={generateSouvenir}
          disabled={isTyping || !souvenirPrompt}
          className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-200 active:scale-95 transition-transform disabled:opacity-50"
        >
          {isTyping ? 'Generating Art...' : <><Sparkles size={20} /> Create AI Photo / புகைப்படம்</>}
        </button>
      </div>

      {souvenirImg && (
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xl space-y-4 animate-scaleIn">
          <img src={souvenirImg} alt="Souvenir" className="w-full rounded-2xl shadow-md" />
          <div className="flex gap-2">
            <button className="flex-1 bg-slate-100 text-slate-800 py-3 rounded-xl font-bold text-sm active:scale-95 transition-transform">Download</button>
            <button className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm active:scale-95 transition-transform">Share</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="aspect-video bg-slate-200 rounded-2xl overflow-hidden relative group">
          <img src="https://picsum.photos/seed/resort1/400/300" alt="Memory" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-3 flex flex-col justify-end">
            <p className="text-[10px] text-white font-bold">Wave Pool Fun / நீச்சல்</p>
          </div>
        </div>
        <div className="aspect-video bg-slate-200 rounded-2xl overflow-hidden relative group">
          <img src="https://picsum.photos/seed/resort2/400/300" alt="Memory" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-3 flex flex-col justify-end">
            <p className="text-[10px] text-white font-bold">Lunch Buffet / உணவு</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[420px] mx-auto h-[calc(100vh-64px)] bg-slate-50 shadow-2xl overflow-hidden relative flex flex-col">
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {activeTab === 'HOME' && renderHome()}
        {activeTab === 'WALLET' && renderWallet()}
        {activeTab === 'CHAT' && renderConcierge()}
        {activeTab === 'MEMORIES' && renderMemories()}
      </div>

      {/* Floating Bottom Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-slate-900/90 backdrop-blur-md rounded-3xl p-2 flex items-center justify-between shadow-2xl z-50 border border-white/10">
        <button 
          onClick={() => setActiveTab('HOME')}
          className={`p-3 rounded-2xl transition-all ${activeTab === 'HOME' ? 'bg-green-500 text-white' : 'text-slate-400'}`}
        >
          <Home size={20} />
        </button>
        <button 
          onClick={() => setActiveTab('WALLET')}
          className={`p-3 rounded-2xl transition-all ${activeTab === 'WALLET' ? 'bg-blue-500 text-white' : 'text-slate-400'}`}
        >
          <Wallet size={20} />
        </button>
        <button 
          onClick={() => setActiveTab('CHAT')}
          className={`p-3 rounded-2xl transition-all ${activeTab === 'CHAT' ? 'bg-amber-500 text-white' : 'text-slate-400'}`}
        >
          <MessageCircle size={20} />
        </button>
        <button 
          onClick={() => setActiveTab('MEMORIES')}
          className={`p-3 rounded-2xl transition-all ${activeTab === 'MEMORIES' ? 'bg-rose-500 text-white' : 'text-slate-400'}`}
        >
          <Sparkles size={20} />
        </button>
      </div>
    </div>
  );
};

export default MobileApp;
