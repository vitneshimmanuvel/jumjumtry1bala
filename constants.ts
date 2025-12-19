
import { PackageType, GuestPackage, Amenity, Room } from './types';

export const GST_RATE = 0.09; // 9% CGST + 9% SGST = 18% Total

export const COLORS = {
  palmGreen: '#166534',
  aquaBlue: '#0ea5e9',
  sunYellow: '#facc15',
  resortGold: '#ca8a04',
  hibiscusRed: '#ef4444'
};

export const ROOMS: Room[] = [
  { id: 'r1', number: '101', type: 'DELUXE', status: 'OCCUPIED', currentGuestId: 'KALKI-8829', price: 2500, amenities: ['Living Area', 'Dental Kit', 'Mini Fridge', 'Terrace'] },
  { id: 'r2', number: '102', type: 'DELUXE', status: 'AVAILABLE', price: 2500, amenities: ['Living Area', 'Dental Kit', 'Terrace'] },
  { id: 'r3', number: '103', type: 'SUITE', status: 'CLEANING', price: 4500, amenities: ['Living Area', 'Dining Area', 'Mini Fridge', 'Terrace', 'Balcony'] },
  { id: 'r4', number: '201', type: 'FAMILY', status: 'AVAILABLE', price: 3500, amenities: ['Living Area', 'Dining Area', 'Terrace'] },
  { id: 'r5', number: '202', type: 'DORM', status: 'AVAILABLE', price: 1200, amenities: ['Basic Facilities'] },
  { id: 'r6', number: '203', type: 'DELUXE', status: 'AVAILABLE', price: 2500, amenities: ['Living Area', 'Terrace'] },
  { id: 'r7', number: '301', type: 'SUITE', status: 'AVAILABLE', price: 5000, amenities: ['Private Pool', 'Mini Bar', 'Kitchenette'] },
  { id: 'r8', number: '302', type: 'FAMILY', status: 'AVAILABLE', price: 3800, amenities: ['Double Balcony', 'Kids Bunk Bed'] },
];

export const PACKAGES: Record<PackageType, GuestPackage> = {
  [PackageType.BASIC]: {
    type: PackageType.BASIC,
    name: 'Basic Day Fun Pack',
    price: 499,
    amenities: ['Entry', 'Pool', 'Kids Play', 'Indoor Games'],
    color: 'bg-green-100 text-green-800 border-green-200'
  },
  [PackageType.FAMILY]: {
    type: PackageType.FAMILY,
    name: 'Family Fun Pack',
    price: 999,
    amenities: ['Entry', 'Pool', 'Kids Play', 'Indoor Games', 'Buffet Meals', 'Movie Room'],
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  [PackageType.PREMIUM]: {
    type: PackageType.PREMIUM,
    name: 'Premium Cool & Fun Pack',
    price: 1499,
    amenities: ['All Family Features', 'Unlimited Snacks', 'Gym', 'DJ Zone'],
    color: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  [PackageType.LUXURY]: {
    type: PackageType.LUXURY,
    name: 'Luxury Relax Pack',
    price: 2499,
    amenities: ['All Premium Features', 'Spa', 'Yoga', 'Private Lounge'],
    color: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  [PackageType.EVENT]: {
    type: PackageType.EVENT,
    name: 'Custom Event Pack',
    price: 5000,
    amenities: ['Custom Access'],
    color: 'bg-rose-100 text-rose-800 border-rose-200'
  }
};

export const AMENITIES: (Amenity & { description?: { en: string; ta: string }; rules?: string[] })[] = [
  // Fun & Entertainment
  { 
    id: '1', 
    name: { en: 'Swimming Pool', ta: 'நீச்சல் குளம்' }, 
    icon: '🌊', 
    basePrice: 150, 
    category: 'FUN', 
    includedIn: [PackageType.BASIC, PackageType.FAMILY, PackageType.PREMIUM, PackageType.LUXURY],
    description: { en: 'Crystal clear water park with slides and kids zone.', ta: 'ஸ்லைடுகள் மற்றும் குழந்தைகளுக்கான மண்டலத்துடன் கூடிய சுத்தமான நீச்சல் குளம்.' },
    rules: ['Nylon clothes mandatory', 'Shower before entry', 'No diving in kids area']
  },
  { 
    id: '6', 
    name: { en: 'Movie Room', ta: 'திரையரங்கு அறை' }, 
    icon: '🎬', 
    basePrice: 100, 
    category: 'FUN', 
    includedIn: [PackageType.FAMILY, PackageType.PREMIUM, PackageType.LUXURY],
    description: { en: 'Daily screenings of popular movies in AC comfort.', ta: 'குளிர்சாதன வசதியுடன் கூடிய அறையில் தினசரி திரைப்படங்கள் திரையிடப்படும்.' }
  },
  { 
    id: '7', 
    name: { en: 'Kids Play Area', ta: 'குழந்தைகள் விளையாட்டு' }, 
    icon: '🎡', 
    basePrice: 150, 
    category: 'FUN', 
    includedIn: [PackageType.BASIC, PackageType.FAMILY, PackageType.PREMIUM, PackageType.LUXURY],
    description: { en: 'Safe playground with swings, slides, and sand pit.', ta: 'ஊஞ்சல், ஸ்லைடு மற்றும் மணல் குழி கொண்ட பாதுகாப்பான விளையாட்டு மைதானம்.' }
  },
  { id: '11', name: { en: 'Indoor Games', ta: 'உள்ளரங்கு விளையாட்டுகள்' }, icon: '🎮', basePrice: 50, category: 'FUN', includedIn: [PackageType.BASIC, PackageType.FAMILY] },
  
  // Food & Drinks
  { 
    id: '2', 
    name: { en: 'Restaurant', ta: 'உணவகம்' }, 
    icon: '🍽️', 
    basePrice: 0, 
    category: 'FOOD', 
    includedIn: [],
    description: { en: 'Multi-cuisine Halal & Kosher certified dining.', ta: 'அனைத்து வகை உணவுகளும் கிடைக்கும் ஹலால் அங்கீகரிக்கப்பட்ட உணவகம்.' }
  },
  { id: '8', name: { en: 'Bar & Lounge', ta: 'பார் மற்றும் லவுஞ்ச்' }, icon: '🍸', basePrice: 0, category: 'FOOD', includedIn: [] },
  
  // Wellness
  { 
    id: '3', 
    name: { en: 'Spa', ta: 'ஸ்பா' }, 
    icon: '💆', 
    basePrice: 800, 
    category: 'WELLNESS', 
    includedIn: [PackageType.LUXURY],
    description: { en: 'Professional herbal massage and relaxation therapy.', ta: 'நிபுணத்துவம் வாய்ந்த மூலிகை மசாஜ் மற்றும் ஓய்வு சிகிச்சை.' }
  },
  { id: '12', name: { en: 'Salon', ta: 'சலூன்' }, icon: '💇', basePrice: 300, category: 'WELLNESS', includedIn: [] },
  { id: '13', name: { en: 'Massage', ta: 'மசாஜ்' }, icon: '🧖', basePrice: 600, category: 'WELLNESS', includedIn: [] },
  { id: '4', name: { en: 'Gym', ta: 'ஜிம்' }, icon: '🏋️', basePrice: 200, category: 'WELLNESS', includedIn: [PackageType.PREMIUM, PackageType.LUXURY] },
  { id: '5', name: { en: 'Yoga', ta: 'யோகா' }, icon: '🧘', basePrice: 300, category: 'WELLNESS', includedIn: [PackageType.LUXURY] },
  
  // Facilities
  { id: '9', name: { en: 'Conference Room', ta: 'கூட்ட அரங்கு' }, icon: '🤝', basePrice: 2000, category: 'FACILITY', includedIn: [] },
  { id: '10', name: { en: 'Banquet Hall', ta: 'விருந்து அரங்கம்' }, icon: '🎊', basePrice: 5000, category: 'FACILITY', includedIn: [] },
  
  // Safety
  { id: '15', name: { en: 'First-aid Services', ta: 'முதலுதவி' }, icon: '🚑', basePrice: 0, category: 'SAFETY', includedIn: [] },
  { id: '16', name: { en: 'CCTV Monitoring', ta: 'சிசிடிவி' }, icon: '📹', basePrice: 0, category: 'SAFETY', includedIn: [] },
  { id: '17', name: { en: 'Security Guard', ta: 'பாதுகாப்பு' }, icon: '👮', basePrice: 0, category: 'SAFETY', includedIn: [] },
  
  // Sports
  { id: '18', name: { en: 'Outdoor Sports (Tennis)', ta: 'வெளிப்புற விளையாட்டுகள்' }, icon: '🎾', basePrice: 100, category: 'SPORTS', includedIn: [] },
];
