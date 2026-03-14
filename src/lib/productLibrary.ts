// Comprehensive Nigerian wholesale drink product library
// Each entry represents a specific product variant with its pack size

export interface LibraryProduct {
  name: string;        // e.g. "Fanta Orange 35cl"
  brand: string;       // e.g. "Fanta"
  category: string;
  packSize: string;    // e.g. "Crate (24 bottles)"
}

export const productLibrary: LibraryProduct[] = [
  // ─── COCA-COLA FAMILY ──────────────────────────────────────
  { name: 'Coca-Cola 35cl', brand: 'Coca-Cola', category: 'Soft Drink', packSize: 'Crate (24 bottles)', defaultPrice: 4800 },
  { name: 'Coca-Cola 50cl', brand: 'Coca-Cola', category: 'Soft Drink', packSize: 'Pack (12 bottles)', defaultPrice: 3600 },
  { name: 'Coca-Cola 60cl PET', brand: 'Coca-Cola', category: 'Soft Drink', packSize: 'Pack (12 bottles)', defaultPrice: 4200 },
  { name: 'Coca-Cola 1L PET', brand: 'Coca-Cola', category: 'Soft Drink', packSize: 'Pack (12 bottles)', defaultPrice: 6000 },
  { name: 'Coca-Cola 1.5L PET', brand: 'Coca-Cola', category: 'Soft Drink', packSize: 'Pack (8 bottles)', defaultPrice: 5600 },
  { name: 'Coca-Cola 33cl Can', brand: 'Coca-Cola', category: 'Soft Drink', packSize: 'Pack (24 cans)', defaultPrice: 7200 },

  // ─── FANTA ─────────────────────────────────────────────────
  { name: 'Fanta Orange 35cl', brand: 'Fanta', category: 'Soft Drink', packSize: 'Crate (24 bottles)', defaultPrice: 4800 },
  { name: 'Fanta Orange 50cl', brand: 'Fanta', category: 'Soft Drink', packSize: 'Pack (12 bottles)', defaultPrice: 3600 },
  { name: 'Fanta Orange 60cl PET', brand: 'Fanta', category: 'Soft Drink', packSize: 'Pack (12 bottles)', defaultPrice: 4200 },
  { name: 'Fanta Orange 1L PET', brand: 'Fanta', category: 'Soft Drink', packSize: 'Pack (12 bottles)', defaultPrice: 6000 },
  { name: 'Fanta Orange 1.5L PET', brand: 'Fanta', category: 'Soft Drink', packSize: 'Pack (8 bottles)', defaultPrice: 5600 },
  { name: 'Fanta Lemon 35cl', brand: 'Fanta', category: 'Soft Drink', packSize: 'Crate (24 bottles)', defaultPrice: 4800 },
  { name: 'Fanta Chapman 35cl', brand: 'Fanta', category: 'Soft Drink', packSize: 'Crate (24 bottles)', defaultPrice: 4800 },
  { name: 'Fanta Blackcurrant 35cl', brand: 'Fanta', category: 'Soft Drink', packSize: 'Crate (24 bottles)', defaultPrice: 4800 },

  // ─── SPRITE ────────────────────────────────────────────────
  { name: 'Sprite 35cl', brand: 'Sprite', category: 'Soft Drink', packSize: 'Crate (24 bottles)', defaultPrice: 4800 },
  { name: 'Sprite 50cl', brand: 'Sprite', category: 'Soft Drink', packSize: 'Pack (12 bottles)', defaultPrice: 3600 },
  { name: 'Sprite 60cl PET', brand: 'Sprite', category: 'Soft Drink', packSize: 'Pack (12 bottles)', defaultPrice: 4200 },
  { name: 'Sprite 1.5L PET', brand: 'Sprite', category: 'Soft Drink', packSize: 'Pack (8 bottles)', defaultPrice: 5600 },

  // ─── PEPSI / 7UP / MIRINDA ─────────────────────────────────
  { name: 'Pepsi 35cl', brand: 'Pepsi', category: 'Soft Drink', packSize: 'Crate (24 bottles)', defaultPrice: 4500 },
  { name: 'Pepsi 50cl', brand: 'Pepsi', category: 'Soft Drink', packSize: 'Pack (12 bottles)', defaultPrice: 3400 },
  { name: 'Pepsi 60cl PET', brand: 'Pepsi', category: 'Soft Drink', packSize: 'Pack (12 bottles)', defaultPrice: 4000 },
  { name: '7Up 35cl', brand: '7Up', category: 'Soft Drink', packSize: 'Crate (24 bottles)', defaultPrice: 4500 },
  { name: '7Up 50cl', brand: '7Up', category: 'Soft Drink', packSize: 'Pack (12 bottles)', defaultPrice: 3400 },
  { name: '7Up 60cl PET', brand: '7Up', category: 'Soft Drink', packSize: 'Pack (12 bottles)', defaultPrice: 4000 },
  { name: 'Mirinda Orange 35cl', brand: 'Mirinda', category: 'Soft Drink', packSize: 'Crate (24 bottles)', defaultPrice: 4500 },
  { name: 'Mirinda Orange 50cl', brand: 'Mirinda', category: 'Soft Drink', packSize: 'Pack (12 bottles)', defaultPrice: 3400 },
  { name: 'Mountain Dew 35cl', brand: 'Mountain Dew', category: 'Soft Drink', packSize: 'Crate (24 bottles)', defaultPrice: 4500 },
  { name: 'Teem Bitter Lemon 35cl', brand: 'Teem', category: 'Soft Drink', packSize: 'Crate (24 bottles)', defaultPrice: 4500 },

  // ─── BEER ──────────────────────────────────────────────────
  { name: 'Star Lager 60cl', brand: 'Star', category: 'Beer', packSize: 'Crate (12 bottles)', defaultPrice: 4500 },
  { name: 'Star Lager 33cl', brand: 'Star', category: 'Beer', packSize: 'Crate (24 bottles)', defaultPrice: 7500 },
  { name: 'Star Lager 50cl Can', brand: 'Star', category: 'Beer', packSize: 'Pack (24 cans)', defaultPrice: 8500 },
  { name: 'Gulder Lager 60cl', brand: 'Gulder', category: 'Beer', packSize: 'Crate (12 bottles)', defaultPrice: 4500 },
  { name: 'Gulder Lager 33cl', brand: 'Gulder', category: 'Beer', packSize: 'Crate (24 bottles)', defaultPrice: 7500 },
  { name: 'Trophy Lager 60cl', brand: 'Trophy', category: 'Beer', packSize: 'Crate (12 bottles)', defaultPrice: 4200 },
  { name: 'Heineken 33cl', brand: 'Heineken', category: 'Beer', packSize: 'Pack (6 bottles)', defaultPrice: 4800 },
  { name: 'Heineken 50cl Can', brand: 'Heineken', category: 'Beer', packSize: 'Pack (24 cans)', defaultPrice: 18000 },
  { name: 'Budweiser 33cl Can', brand: 'Budweiser', category: 'Beer', packSize: 'Pack (6 cans)', defaultPrice: 4200 },
  { name: 'Budweiser 50cl Can', brand: 'Budweiser', category: 'Beer', packSize: 'Pack (24 cans)', defaultPrice: 14000 },
  { name: 'Life Lager 60cl', brand: 'Life', category: 'Beer', packSize: 'Crate (12 bottles)', defaultPrice: 3800 },
  { name: '33 Export Lager 60cl', brand: '33 Export', category: 'Beer', packSize: 'Crate (12 bottles)', defaultPrice: 4000 },
  { name: 'Hero Lager 60cl', brand: 'Hero', category: 'Beer', packSize: 'Crate (12 bottles)', defaultPrice: 4300 },
  { name: 'Goldberg Lager 60cl', brand: 'Goldberg', category: 'Beer', packSize: 'Crate (12 bottles)', defaultPrice: 4200 },
  { name: 'Tiger Lager 50cl Can', brand: 'Tiger', category: 'Beer', packSize: 'Pack (24 cans)', defaultPrice: 14000 },

  // ─── STOUT ─────────────────────────────────────────────────
  { name: 'Guinness FES 60cl', brand: 'Guinness', category: 'Stout', packSize: 'Crate (12 bottles)', defaultPrice: 5500 },
  { name: 'Guinness FES 33cl', brand: 'Guinness', category: 'Stout', packSize: 'Crate (24 bottles)', defaultPrice: 9500 },
  { name: 'Guinness Smooth 50cl Can', brand: 'Guinness', category: 'Stout', packSize: 'Pack (24 cans)', defaultPrice: 16000 },
  { name: 'Legend Extra Stout 60cl', brand: 'Legend', category: 'Stout', packSize: 'Crate (12 bottles)', defaultPrice: 5200 },
  { name: 'Legend Extra Stout 33cl', brand: 'Legend', category: 'Stout', packSize: 'Crate (24 bottles)', defaultPrice: 9000 },
  { name: 'Orijin 60cl', brand: 'Orijin', category: 'Stout', packSize: 'Crate (12 bottles)', defaultPrice: 5000 },
  { name: 'Orijin 33cl', brand: 'Orijin', category: 'Stout', packSize: 'Crate (24 bottles)', defaultPrice: 8500 },

  // ─── MALT DRINKS ───────────────────────────────────────────
  { name: 'Maltina 33cl', brand: 'Maltina', category: 'Malt', packSize: 'Pack (24 bottles)', defaultPrice: 5500 },
  { name: 'Maltina 50cl PET', brand: 'Maltina', category: 'Malt', packSize: 'Pack (12 bottles)', defaultPrice: 3500 },
  { name: 'Maltina Can 33cl', brand: 'Maltina', category: 'Malt', packSize: 'Pack (24 cans)', defaultPrice: 6500 },
  { name: 'Amstel Malta 33cl', brand: 'Amstel Malta', category: 'Malt', packSize: 'Pack (24 bottles)', defaultPrice: 5800 },
  { name: 'Amstel Malta 50cl PET', brand: 'Amstel Malta', category: 'Malt', packSize: 'Pack (12 bottles)', defaultPrice: 3800 },
  { name: 'Hi-Malt 33cl', brand: 'Hi-Malt', category: 'Malt', packSize: 'Pack (24 bottles)', defaultPrice: 5200 },
  { name: 'Dubic Malt 33cl', brand: 'Dubic', category: 'Malt', packSize: 'Pack (24 bottles)', defaultPrice: 4800 },
  { name: 'Beta Malt 33cl', brand: 'Beta Malt', category: 'Malt', packSize: 'Pack (24 bottles)', defaultPrice: 5000 },
  { name: 'Grand Malt 33cl', brand: 'Grand Malt', category: 'Malt', packSize: 'Pack (24 bottles)', defaultPrice: 5200 },

  // ─── ENERGY DRINKS ─────────────────────────────────────────
  { name: 'Fearless Energy 33cl Can', brand: 'Fearless', category: 'Energy', packSize: 'Pack (24 cans)', defaultPrice: 6000 },
  { name: 'Fearless Red Berry 33cl Can', brand: 'Fearless', category: 'Energy', packSize: 'Pack (24 cans)', defaultPrice: 6000 },
  { name: 'Power Horse 25cl Can', brand: 'Power Horse', category: 'Energy', packSize: 'Pack (24 cans)', defaultPrice: 7200 },
  { name: 'Bullet Energy 33cl Can', brand: 'Bullet', category: 'Energy', packSize: 'Pack (24 cans)', defaultPrice: 5500 },
  { name: 'Predator Energy 25cl Can', brand: 'Predator', category: 'Energy', packSize: 'Pack (24 cans)', defaultPrice: 5800 },
  { name: 'Climax Energy 33cl Can', brand: 'Climax', category: 'Energy', packSize: 'Pack (24 cans)', defaultPrice: 5200 },
  { name: 'Red Bull 25cl Can', brand: 'Red Bull', category: 'Energy', packSize: 'Pack (24 cans)', defaultPrice: 18000 },
  { name: 'Monster Energy 50cl Can', brand: 'Monster', category: 'Energy', packSize: 'Pack (12 cans)', defaultPrice: 12000 },

  // ─── WATER ─────────────────────────────────────────────────
  { name: 'Eva Water 75cl', brand: 'Eva', category: 'Water', packSize: 'Pack (12 bottles)', defaultPrice: 2000 },
  { name: 'Eva Water 1.5L', brand: 'Eva', category: 'Water', packSize: 'Pack (12 bottles)', defaultPrice: 3200 },
  { name: 'Eva Water 50cl', brand: 'Eva', category: 'Water', packSize: 'Pack (20 bottles)', defaultPrice: 2500 },
  { name: 'Aquafina 50cl', brand: 'Aquafina', category: 'Water', packSize: 'Pack (20 bottles)', defaultPrice: 2800 },
  { name: 'Aquafina 75cl', brand: 'Aquafina', category: 'Water', packSize: 'Pack (12 bottles)', defaultPrice: 2200 },
  { name: 'Aquafina 1.5L', brand: 'Aquafina', category: 'Water', packSize: 'Pack (12 bottles)', defaultPrice: 3500 },
  { name: 'Nestle Pure Life 50cl', brand: 'Nestle', category: 'Water', packSize: 'Pack (20 bottles)', defaultPrice: 2600 },
  { name: 'Nestle Pure Life 1.5L', brand: 'Nestle', category: 'Water', packSize: 'Pack (12 bottles)', defaultPrice: 3400 },
  { name: 'Cway Water 50cl', brand: 'Cway', category: 'Water', packSize: 'Pack (20 bottles)', defaultPrice: 2200 },
  { name: 'Cway Water 1.5L', brand: 'Cway', category: 'Water', packSize: 'Pack (12 bottles)', defaultPrice: 3000 },

  // ─── JUICE / YOGHURT ──────────────────────────────────────
  { name: 'Five Alive Pulpy Orange 35cl', brand: 'Five Alive', category: 'Juice', packSize: 'Pack (24 cartons)', defaultPrice: 8500 },
  { name: 'Five Alive Pulpy Orange 1L', brand: 'Five Alive', category: 'Juice', packSize: 'Pack (12 cartons)', defaultPrice: 7200 },
  { name: 'Five Alive Citrus Burst 35cl', brand: 'Five Alive', category: 'Juice', packSize: 'Pack (24 cartons)', defaultPrice: 8500 },
  { name: 'Chi Exotic 1L', brand: 'Chi Exotic', category: 'Juice', packSize: 'Pack (12 cartons)', defaultPrice: 7500 },
  { name: 'Chi Exotic 35cl', brand: 'Chi Exotic', category: 'Juice', packSize: 'Pack (24 cartons)', defaultPrice: 9000 },
  { name: 'Hollandia Yoghurt 50cl', brand: 'Hollandia', category: 'Juice', packSize: 'Pack (12 bottles)', defaultPrice: 4800 },
  { name: 'Hollandia Yoghurt 1L', brand: 'Hollandia', category: 'Juice', packSize: 'Pack (12 bottles)', defaultPrice: 7500 },
  { name: 'Cway Juice 1L', brand: 'Cway', category: 'Juice', packSize: 'Pack (12 cartons)', defaultPrice: 4200 },
  { name: 'Chivita 100% 1L', brand: 'Chivita', category: 'Juice', packSize: 'Pack (12 cartons)', defaultPrice: 7800 },

  // ─── WINE / SPIRITS ───────────────────────────────────────
  { name: 'Smirnoff Ice 33cl', brand: 'Smirnoff', category: 'Spirit', packSize: 'Pack (24 bottles)', defaultPrice: 12000 },
  { name: 'Small Stout 20cl', brand: 'Small Stout', category: 'Spirit', packSize: 'Carton (24 bottles)', defaultPrice: 7200 },
  { name: 'Origin Zero 25cl', brand: 'Origin', category: 'Spirit', packSize: 'Carton (24 bottles)', defaultPrice: 6500 },
  { name: 'Orijin Bitters 60cl', brand: 'Orijin', category: 'Spirit', packSize: 'Carton (12 bottles)', defaultPrice: 8000 },
  { name: 'Trophy Stout 30cl Can', brand: 'Trophy', category: 'Stout', packSize: 'Pack (24 cans)', defaultPrice: 8500 },
];

export const libraryCategories = [
  'All', 'Soft Drink', 'Beer', 'Stout', 'Malt', 'Energy', 'Water', 'Juice', 'Spirit',
];
