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
  { name: 'Coca-Cola 35cl', brand: 'Coca-Cola', category: 'Soft Drink', packSize: 'Crate (24 bottles)' },
  { name: 'Coca-Cola 50cl', brand: 'Coca-Cola', category: 'Soft Drink', packSize: 'Pack (12 bottles)' },
  { name: 'Coca-Cola 60cl PET', brand: 'Coca-Cola', category: 'Soft Drink', packSize: 'Pack (12 bottles)' },
  { name: 'Coca-Cola 1L PET', brand: 'Coca-Cola', category: 'Soft Drink', packSize: 'Pack (12 bottles)' },
  { name: 'Coca-Cola 1.5L PET', brand: 'Coca-Cola', category: 'Soft Drink', packSize: 'Pack (8 bottles)' },
  { name: 'Coca-Cola 33cl Can', brand: 'Coca-Cola', category: 'Soft Drink', packSize: 'Pack (24 cans)' },

  // ─── FANTA ─────────────────────────────────────────────────
  { name: 'Fanta Orange 35cl', brand: 'Fanta', category: 'Soft Drink', packSize: 'Crate (24 bottles)' },
  { name: 'Fanta Orange 50cl', brand: 'Fanta', category: 'Soft Drink', packSize: 'Pack (12 bottles)' },
  { name: 'Fanta Orange 60cl PET', brand: 'Fanta', category: 'Soft Drink', packSize: 'Pack (12 bottles)' },
  { name: 'Fanta Orange 1L PET', brand: 'Fanta', category: 'Soft Drink', packSize: 'Pack (12 bottles)' },
  { name: 'Fanta Orange 1.5L PET', brand: 'Fanta', category: 'Soft Drink', packSize: 'Pack (8 bottles)' },
  { name: 'Fanta Lemon 35cl', brand: 'Fanta', category: 'Soft Drink', packSize: 'Crate (24 bottles)' },
  { name: 'Fanta Chapman 35cl', brand: 'Fanta', category: 'Soft Drink', packSize: 'Crate (24 bottles)' },
  { name: 'Fanta Blackcurrant 35cl', brand: 'Fanta', category: 'Soft Drink', packSize: 'Crate (24 bottles)' },

  // ─── SPRITE ────────────────────────────────────────────────
  { name: 'Sprite 35cl', brand: 'Sprite', category: 'Soft Drink', packSize: 'Crate (24 bottles)' },
  { name: 'Sprite 50cl', brand: 'Sprite', category: 'Soft Drink', packSize: 'Pack (12 bottles)' },
  { name: 'Sprite 60cl PET', brand: 'Sprite', category: 'Soft Drink', packSize: 'Pack (12 bottles)' },
  { name: 'Sprite 1.5L PET', brand: 'Sprite', category: 'Soft Drink', packSize: 'Pack (8 bottles)' },

  // ─── PEPSI / 7UP / MIRINDA ─────────────────────────────────
  { name: 'Pepsi 35cl', brand: 'Pepsi', category: 'Soft Drink', packSize: 'Crate (24 bottles)' },
  { name: 'Pepsi 50cl', brand: 'Pepsi', category: 'Soft Drink', packSize: 'Pack (12 bottles)' },
  { name: 'Pepsi 60cl PET', brand: 'Pepsi', category: 'Soft Drink', packSize: 'Pack (12 bottles)' },
  { name: '7Up 35cl', brand: '7Up', category: 'Soft Drink', packSize: 'Crate (24 bottles)' },
  { name: '7Up 50cl', brand: '7Up', category: 'Soft Drink', packSize: 'Pack (12 bottles)' },
  { name: '7Up 60cl PET', brand: '7Up', category: 'Soft Drink', packSize: 'Pack (12 bottles)' },
  { name: 'Mirinda Orange 35cl', brand: 'Mirinda', category: 'Soft Drink', packSize: 'Crate (24 bottles)' },
  { name: 'Mirinda Orange 50cl', brand: 'Mirinda', category: 'Soft Drink', packSize: 'Pack (12 bottles)' },
  { name: 'Mountain Dew 35cl', brand: 'Mountain Dew', category: 'Soft Drink', packSize: 'Crate (24 bottles)' },
  { name: 'Teem Bitter Lemon 35cl', brand: 'Teem', category: 'Soft Drink', packSize: 'Crate (24 bottles)' },

  // ─── BEER ──────────────────────────────────────────────────
  { name: 'Star Lager 60cl', brand: 'Star', category: 'Beer', packSize: 'Crate (12 bottles)' },
  { name: 'Star Lager 33cl', brand: 'Star', category: 'Beer', packSize: 'Crate (24 bottles)' },
  { name: 'Star Lager 50cl Can', brand: 'Star', category: 'Beer', packSize: 'Pack (24 cans)' },
  { name: 'Gulder Lager 60cl', brand: 'Gulder', category: 'Beer', packSize: 'Crate (12 bottles)' },
  { name: 'Gulder Lager 33cl', brand: 'Gulder', category: 'Beer', packSize: 'Crate (24 bottles)' },
  { name: 'Trophy Lager 60cl', brand: 'Trophy', category: 'Beer', packSize: 'Crate (12 bottles)' },
  { name: 'Heineken 33cl', brand: 'Heineken', category: 'Beer', packSize: 'Pack (6 bottles)' },
  { name: 'Heineken 50cl Can', brand: 'Heineken', category: 'Beer', packSize: 'Pack (24 cans)' },
  { name: 'Budweiser 33cl Can', brand: 'Budweiser', category: 'Beer', packSize: 'Pack (6 cans)' },
  { name: 'Budweiser 50cl Can', brand: 'Budweiser', category: 'Beer', packSize: 'Pack (24 cans)' },
  { name: 'Life Lager 60cl', brand: 'Life', category: 'Beer', packSize: 'Crate (12 bottles)' },
  { name: '33 Export Lager 60cl', brand: '33 Export', category: 'Beer', packSize: 'Crate (12 bottles)' },
  { name: 'Hero Lager 60cl', brand: 'Hero', category: 'Beer', packSize: 'Crate (12 bottles)' },
  { name: 'Goldberg Lager 60cl', brand: 'Goldberg', category: 'Beer', packSize: 'Crate (12 bottles)' },
  { name: 'Tiger Lager 50cl Can', brand: 'Tiger', category: 'Beer', packSize: 'Pack (24 cans)' },

  // ─── STOUT ─────────────────────────────────────────────────
  { name: 'Guinness FES 60cl', brand: 'Guinness', category: 'Stout', packSize: 'Crate (12 bottles)' },
  { name: 'Guinness FES 33cl', brand: 'Guinness', category: 'Stout', packSize: 'Crate (24 bottles)' },
  { name: 'Guinness Smooth 50cl Can', brand: 'Guinness', category: 'Stout', packSize: 'Pack (24 cans)' },
  { name: 'Legend Extra Stout 60cl', brand: 'Legend', category: 'Stout', packSize: 'Crate (12 bottles)' },
  { name: 'Legend Extra Stout 33cl', brand: 'Legend', category: 'Stout', packSize: 'Crate (24 bottles)' },
  { name: 'Orijin 60cl', brand: 'Orijin', category: 'Stout', packSize: 'Crate (12 bottles)' },
  { name: 'Orijin 33cl', brand: 'Orijin', category: 'Stout', packSize: 'Crate (24 bottles)' },

  // ─── MALT DRINKS ───────────────────────────────────────────
  { name: 'Maltina 33cl', brand: 'Maltina', category: 'Malt', packSize: 'Pack (24 bottles)' },
  { name: 'Maltina 50cl PET', brand: 'Maltina', category: 'Malt', packSize: 'Pack (12 bottles)' },
  { name: 'Maltina Can 33cl', brand: 'Maltina', category: 'Malt', packSize: 'Pack (24 cans)' },
  { name: 'Amstel Malta 33cl', brand: 'Amstel Malta', category: 'Malt', packSize: 'Pack (24 bottles)' },
  { name: 'Amstel Malta 50cl PET', brand: 'Amstel Malta', category: 'Malt', packSize: 'Pack (12 bottles)' },
  { name: 'Hi-Malt 33cl', brand: 'Hi-Malt', category: 'Malt', packSize: 'Pack (24 bottles)' },
  { name: 'Dubic Malt 33cl', brand: 'Dubic', category: 'Malt', packSize: 'Pack (24 bottles)' },
  { name: 'Beta Malt 33cl', brand: 'Beta Malt', category: 'Malt', packSize: 'Pack (24 bottles)' },
  { name: 'Grand Malt 33cl', brand: 'Grand Malt', category: 'Malt', packSize: 'Pack (24 bottles)' },

  // ─── ENERGY DRINKS ─────────────────────────────────────────
  { name: 'Fearless Energy 33cl Can', brand: 'Fearless', category: 'Energy', packSize: 'Pack (24 cans)' },
  { name: 'Fearless Red Berry 33cl Can', brand: 'Fearless', category: 'Energy', packSize: 'Pack (24 cans)' },
  { name: 'Power Horse 25cl Can', brand: 'Power Horse', category: 'Energy', packSize: 'Pack (24 cans)' },
  { name: 'Bullet Energy 33cl Can', brand: 'Bullet', category: 'Energy', packSize: 'Pack (24 cans)' },
  { name: 'Predator Energy 25cl Can', brand: 'Predator', category: 'Energy', packSize: 'Pack (24 cans)' },
  { name: 'Climax Energy 33cl Can', brand: 'Climax', category: 'Energy', packSize: 'Pack (24 cans)' },
  { name: 'Red Bull 25cl Can', brand: 'Red Bull', category: 'Energy', packSize: 'Pack (24 cans)' },
  { name: 'Monster Energy 50cl Can', brand: 'Monster', category: 'Energy', packSize: 'Pack (12 cans)' },

  // ─── WATER ─────────────────────────────────────────────────
  { name: 'Eva Water 75cl', brand: 'Eva', category: 'Water', packSize: 'Pack (12 bottles)' },
  { name: 'Eva Water 1.5L', brand: 'Eva', category: 'Water', packSize: 'Pack (12 bottles)' },
  { name: 'Eva Water 50cl', brand: 'Eva', category: 'Water', packSize: 'Pack (20 bottles)' },
  { name: 'Aquafina 50cl', brand: 'Aquafina', category: 'Water', packSize: 'Pack (20 bottles)' },
  { name: 'Aquafina 75cl', brand: 'Aquafina', category: 'Water', packSize: 'Pack (12 bottles)' },
  { name: 'Aquafina 1.5L', brand: 'Aquafina', category: 'Water', packSize: 'Pack (12 bottles)' },
  { name: 'Nestle Pure Life 50cl', brand: 'Nestle', category: 'Water', packSize: 'Pack (20 bottles)' },
  { name: 'Nestle Pure Life 1.5L', brand: 'Nestle', category: 'Water', packSize: 'Pack (12 bottles)' },
  { name: 'Cway Water 50cl', brand: 'Cway', category: 'Water', packSize: 'Pack (20 bottles)' },
  { name: 'Cway Water 1.5L', brand: 'Cway', category: 'Water', packSize: 'Pack (12 bottles)' },

  // ─── JUICE / YOGHURT ──────────────────────────────────────
  { name: 'Five Alive Pulpy Orange 35cl', brand: 'Five Alive', category: 'Juice', packSize: 'Pack (24 cartons)' },
  { name: 'Five Alive Pulpy Orange 1L', brand: 'Five Alive', category: 'Juice', packSize: 'Pack (12 cartons)' },
  { name: 'Five Alive Citrus Burst 35cl', brand: 'Five Alive', category: 'Juice', packSize: 'Pack (24 cartons)' },
  { name: 'Chi Exotic 1L', brand: 'Chi Exotic', category: 'Juice', packSize: 'Pack (12 cartons)' },
  { name: 'Chi Exotic 35cl', brand: 'Chi Exotic', category: 'Juice', packSize: 'Pack (24 cartons)' },
  { name: 'Hollandia Yoghurt 50cl', brand: 'Hollandia', category: 'Juice', packSize: 'Pack (12 bottles)' },
  { name: 'Hollandia Yoghurt 1L', brand: 'Hollandia', category: 'Juice', packSize: 'Pack (12 bottles)' },
  { name: 'Cway Juice 1L', brand: 'Cway', category: 'Juice', packSize: 'Pack (12 cartons)' },
  { name: 'Chivita 100% 1L', brand: 'Chivita', category: 'Juice', packSize: 'Pack (12 cartons)' },

  // ─── WINE / SPIRITS ───────────────────────────────────────
  { name: 'Smirnoff Ice 33cl', brand: 'Smirnoff', category: 'Spirit', packSize: 'Pack (24 bottles)' },
  { name: 'Small Stout 20cl', brand: 'Small Stout', category: 'Spirit', packSize: 'Carton (24 bottles)' },
  { name: 'Origin Zero 25cl', brand: 'Origin', category: 'Spirit', packSize: 'Carton (24 bottles)' },
  { name: 'Orijin Bitters 60cl', brand: 'Orijin', category: 'Spirit', packSize: 'Carton (12 bottles)' },
  { name: 'Trophy Stout 30cl Can', brand: 'Trophy', category: 'Stout', packSize: 'Pack (24 cans)' },
];

export const libraryCategories = [
  'All', 'Soft Drink', 'Beer', 'Stout', 'Malt', 'Energy', 'Water', 'Juice', 'Spirit',
];
