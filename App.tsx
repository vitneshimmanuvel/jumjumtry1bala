
import React, { useState } from 'react';
import { AppView, Guest, PackageType, Transaction, FoodOrder } from './types';
import { PACKAGES, AMENITIES, GST_RATE } from './constants';
import Layout from './components/Layout';
import MobileApp from './components/MobileApp';
import AdminDashboard from './components/AdminDashboard';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('ADMIN');
  
  const createMockTransactions = (packagePrice: number): Transaction[] => {
    const taxable = packagePrice / (1 + (GST_RATE * 2));
    const tax = taxable * GST_RATE;
    return [{
      id: `tx-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      description: 'Resort Package Entry',
      amount: packagePrice,
      taxableAmount: taxable,
      cgst: tax,
      sgst: tax,
      type: 'DEBIT',
      category: 'ENTRY'
    }];
  };

  const [allGuests, setAllGuests] = useState<Guest[]>([
    {
      id: 'KALKI-8829',
      name: 'Arun Kumar',
      phone: '9876543210',
      packageType: PackageType.FAMILY,
      walletBalance: 0,
      advancePaid: 1500,
      qrCode: 'qr-data',
      checkInTime: new Date(Date.now() - 1000 * 60 * 180),
      status: 'ACTIVE',
      transactions: createMockTransactions(PACKAGES[PackageType.FAMILY].price),
      roomNumber: '101'
    },
    {
      id: 'KALKI-1244',
      name: 'Priya Dharshini',
      phone: '9123456789',
      packageType: PackageType.LUXURY,
      walletBalance: 0,
      advancePaid: 5000,
      qrCode: 'qr-data-2',
      checkInTime: new Date(Date.now() - 1000 * 60 * 45),
      status: 'ACTIVE',
      transactions: createMockTransactions(PACKAGES[PackageType.LUXURY].price),
      roomNumber: '103'
    },
    {
      id: 'KALKI-5521',
      name: 'Selvamani M',
      phone: '8877665544',
      packageType: PackageType.BASIC,
      walletBalance: 0,
      advancePaid: 500,
      qrCode: 'qr-data-3',
      checkInTime: new Date(Date.now() - 1000 * 60 * 120),
      status: 'ACTIVE',
      transactions: createMockTransactions(PACKAGES[PackageType.BASIC].price),
    }
  ]);

  const [foodOrders, setFoodOrders] = useState<FoodOrder[]>([
    { id: 'O-101', guestId: 'KALKI-8829', guestName: 'Arun Kumar', items: '2x Masala Dosa, 1x Filter Coffee', status: 'PENDING', amount: 320, timestamp: new Date() },
    { id: 'O-102', guestId: 'KALKI-1244', guestName: 'Priya Dharshini', items: '1x Veg Biryani, 1x Paneer Butter Masala', status: 'PREPARING', amount: 550, timestamp: new Date(Date.now() - 1000 * 60 * 15) },
    { id: 'O-103', guestId: 'KALKI-5521', guestName: 'Selvamani M', items: '1x Cold Coffee, 1x Sandwich', status: 'PENDING', amount: 210, timestamp: new Date(Date.now() - 1000 * 60 * 5) }
  ]);

  const handleRegisterGuest = (data: Partial<Guest>) => {
    const pType = data.packageType || PackageType.BASIC;
    const price = PACKAGES[pType].price;
    const newGuest: Guest = {
      id: `KALKI-${Math.floor(1000 + Math.random() * 9000)}`,
      name: data.name || 'Unknown',
      phone: data.phone || '0000000000',
      packageType: pType,
      walletBalance: 0,
      advancePaid: data.advancePaid || 0,
      qrCode: 'new-qr-data',
      checkInTime: new Date(),
      status: 'ACTIVE',
      transactions: createMockTransactions(price)
    };
    setAllGuests(prev => [newGuest, ...prev]);
  };

  const handleUpdateOrder = (id: string, status: FoodOrder['status']) => {
    setFoodOrders(prev => prev.map(o => {
      if (o.id === id) {
        if (status === 'DELIVERED' && o.status !== 'DELIVERED') {
          // Auto-post to billing
          handleAddTransaction(o.guestId, `Food: ${o.items.split(',')[0]}...`, o.amount);
        }
        return { ...o, status };
      }
      return o;
    }));
  };

  const handleAddTransaction = (guestId: string, description: string, amount: number) => {
    const taxable = amount / (1 + (GST_RATE * 2));
    const tax = taxable * GST_RATE;
    const newTx: Transaction = {
      id: `tx-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      description,
      amount,
      taxableAmount: taxable,
      cgst: tax,
      sgst: tax,
      type: 'DEBIT'
    };
    
    setAllGuests(prevGuests => prevGuests.map(g => 
      g.id === guestId ? { ...g, transactions: [...g.transactions, newTx] } : g
    ));
  };

  const handleAddFoodOrder = (guestId: string, items: string, amount: number) => {
    const guest = allGuests.find(g => g.id === guestId);
    if (!guest) return;

    const newOrder: FoodOrder = {
      id: `O-${Math.floor(100 + Math.random() * 900)}`,
      guestId,
      guestName: guest.name,
      items,
      status: 'PENDING',
      amount,
      timestamp: new Date()
    };
    setFoodOrders(prev => [...prev, newOrder]);
  };

  const handleCheckOut = (id: string) => {
    setAllGuests(prev => prev.map(g => 
      g.id === id ? { ...g, status: 'CHECKED_OUT', checkOutTime: new Date() } : g
    ));
  };

  return (
    <Layout view={view} setView={setView}>
      {view === 'MOBILE' ? (
        <div className="flex justify-center p-0 md:p-8">
          <MobileApp guest={allGuests[0]} />
        </div>
      ) : (
        <AdminDashboard 
          guests={allGuests} 
          onRegister={handleRegisterGuest}
          onCheckOut={handleCheckOut}
          foodOrders={foodOrders}
          onUpdateOrder={handleUpdateOrder}
          onAddTransaction={handleAddTransaction}
          onAddFoodOrder={handleAddFoodOrder}
        />
      )}
    </Layout>
  );
};

export default App;
