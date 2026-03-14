import { Product } from './types';

export const defaultProducts: Product[] = [
  // Beer
  { id: '1', name: 'Star Lager', category: 'Beer', packSize: 'Crate (12 bottles)', price: 4500, stock: 120, lowStockThreshold: 20 },
  { id: '2', name: 'Gulder Lager', category: 'Beer', packSize: 'Crate (12 bottles)', price: 4500, stock: 95, lowStockThreshold: 20 },
  { id: '3', name: 'Trophy Lager', category: 'Beer', packSize: 'Crate (12 bottles)', price: 4200, stock: 80, lowStockThreshold: 20 },
  { id: '4', name: 'Heineken', category: 'Beer', packSize: 'Pack (6 bottles)', price: 4800, stock: 60, lowStockThreshold: 15 },
  { id: '5', name: 'Budweiser', category: 'Beer', packSize: 'Pack (6 cans)', price: 4200, stock: 55, lowStockThreshold: 15 },
  { id: '6', name: 'Life Lager', category: 'Beer', packSize: 'Crate (12 bottles)', price: 3800, stock: 70, lowStockThreshold: 20 },
  { id: '7', name: '33 Export Lager', category: 'Beer', packSize: 'Crate (12 bottles)', price: 4000, stock: 85, lowStockThreshold: 20 },
  { id: '8', name: 'Hero Lager', category: 'Beer', packSize: 'Crate (12 bottles)', price: 4300, stock: 65, lowStockThreshold: 20 },
  
  // Malt Drinks
  { id: '9', name: 'Maltina', category: 'Malt', packSize: 'Pack (24 bottles)', price: 5500, stock: 90, lowStockThreshold: 15 },
  { id: '10', name: 'Amstel Malta', category: 'Malt', packSize: 'Pack (24 bottles)', price: 5800, stock: 75, lowStockThreshold: 15 },
  { id: '11', name: 'Hi-Malt', category: 'Malt', packSize: 'Pack (24 bottles)', price: 5200, stock: 50, lowStockThreshold: 15 },
  { id: '12', name: 'Dubic Malt', category: 'Malt', packSize: 'Pack (24 bottles)', price: 4800, stock: 40, lowStockThreshold: 15 },
  
  // Soft Drinks
  { id: '13', name: 'Coca-Cola', category: 'Soft Drink', packSize: 'Crate (24 bottles)', price: 4800, stock: 150, lowStockThreshold: 25 },
  { id: '14', name: 'Fanta Orange', category: 'Soft Drink', packSize: 'Crate (24 bottles)', price: 4800, stock: 130, lowStockThreshold: 25 },
  { id: '15', name: 'Sprite', category: 'Soft Drink', packSize: 'Crate (24 bottles)', price: 4800, stock: 120, lowStockThreshold: 25 },
  { id: '16', name: 'Pepsi', category: 'Soft Drink', packSize: 'Crate (24 bottles)', price: 4500, stock: 100, lowStockThreshold: 25 },
  { id: '17', name: '7Up', category: 'Soft Drink', packSize: 'Crate (24 bottles)', price: 4500, stock: 110, lowStockThreshold: 25 },
  { id: '18', name: 'Mirinda', category: 'Soft Drink', packSize: 'Crate (24 bottles)', price: 4500, stock: 85, lowStockThreshold: 25 },
  
  // Energy Drinks
  { id: '19', name: 'Fearless Energy', category: 'Energy', packSize: 'Pack (24 cans)', price: 6000, stock: 45, lowStockThreshold: 10 },
  { id: '20', name: 'Power Horse', category: 'Energy', packSize: 'Pack (24 cans)', price: 7200, stock: 30, lowStockThreshold: 10 },
  { id: '21', name: 'Bullet Energy', category: 'Energy', packSize: 'Pack (24 cans)', price: 5500, stock: 50, lowStockThreshold: 10 },
  { id: '22', name: 'Predator Energy', category: 'Energy', packSize: 'Pack (24 cans)', price: 5800, stock: 35, lowStockThreshold: 10 },
  { id: '23', name: 'Climax Energy', category: 'Energy', packSize: 'Pack (24 cans)', price: 5200, stock: 40, lowStockThreshold: 10 },
  
  // Water
  { id: '24', name: 'Eva Water', category: 'Water', packSize: 'Pack (20 bottles)', price: 2500, stock: 200, lowStockThreshold: 30 },
  { id: '25', name: 'Aquafina', category: 'Water', packSize: 'Pack (20 bottles)', price: 2800, stock: 180, lowStockThreshold: 30 },
  { id: '26', name: 'Nestle Pure Life', category: 'Water', packSize: 'Pack (20 bottles)', price: 2600, stock: 170, lowStockThreshold: 30 },
  
  // Juice
  { id: '27', name: 'Five Alive Pulpy', category: 'Juice', packSize: 'Pack (12 cartons)', price: 4200, stock: 55, lowStockThreshold: 10 },
  { id: '28', name: 'Chi Exotic', category: 'Juice', packSize: 'Pack (12 cartons)', price: 4500, stock: 45, lowStockThreshold: 10 },
  { id: '29', name: 'Hollandia Yoghurt', category: 'Juice', packSize: 'Pack (12 bottles)', price: 4800, stock: 35, lowStockThreshold: 10 },
  
  // Stout
  { id: '30', name: 'Guinness FES', category: 'Stout', packSize: 'Crate (12 bottles)', price: 5500, stock: 70, lowStockThreshold: 15 },
  { id: '31', name: 'Legend Extra Stout', category: 'Stout', packSize: 'Crate (12 bottles)', price: 5200, stock: 55, lowStockThreshold: 15 },
  { id: '32', name: 'Orijin', category: 'Stout', packSize: 'Crate (12 bottles)', price: 5000, stock: 60, lowStockThreshold: 15 },
];

export const categories = ['All', 'Beer', 'Malt', 'Soft Drink', 'Energy', 'Water', 'Juice', 'Stout'];
