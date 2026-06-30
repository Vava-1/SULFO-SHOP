import fs from 'fs';
import path from 'path';
import { SULFO_PRODUCTS } from './products-data.js';
import { hashPassword } from './auth.js';

const DB_PATH = process.env.DATABASE_PATH || '/tmp/sulfo-db.json';

const DEFAULT_DB = {
  users: [],
  orders: [],
  reviews: [],
  products: [],
};

function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) return null;
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch { return null; }
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

async function seedDB() {
  const hashed = await hashPassword('admin123');
  const db = {
    ...DEFAULT_DB,
    products: SULFO_PRODUCTS.map((p, i) => ({
      ...p,
      id: String(i + 1),
      rating: parseFloat((3.8 + Math.random() * 1.2).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 80) + 5,
      createdAt: new Date().toISOString(),
    })),
    users: [{
      id: 'admin-1',
      name: 'Sulfo Admin',
      email: 'admin@sulfo.rw',
      password: hashed,
      role: 'admin',
      createdAt: new Date().toISOString(),
    }],
  };
  writeDB(db);
  return db;
}

let _db = null;

export async function getDB() {
  if (_db) return _db;
  const raw = readDB();
  if (!raw || !raw.products?.length) {
    _db = await seedDB();
  } else {
    _db = raw;
  }
  return _db;
}

export function saveDB(db) {
  _db = db;
  writeDB(db);
}

// ── Users ────────────────────────────────────────────────────────
export async function findUserByEmail(email) {
  const db = await getDB();
  return db.users.find(u => u.email === email.toLowerCase()) || null;
}

export async function createUser({ name, email, password, role = 'user' }) {
  const db = await getDB();
  const hashed = await hashPassword(password);
  const user = {
    id: `user-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    password: hashed,
    role,
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  saveDB(db);
  return user;
}

export async function getAllUsers() {
  const db = await getDB();
  return db.users.map(u => ({ ...u, password: undefined }));
}

// ── Products ─────────────────────────────────────────────────────
export async function getAllProducts(filter = {}) {
  const db = await getDB();
  let products = db.products;
  if (filter.category) products = products.filter(p => p.category === filter.category);
  if (filter.search) {
    const q = filter.search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }
  if (filter.inStock) products = products.filter(p => p.stock > 0);
  return products;
}

export async function getProductById(id) {
  const db = await getDB();
  return db.products.find(p => p.id === String(id)) || null;
}

export async function createProduct(data) {
  const db = await getDB();
  const product = { ...data, id: String(Date.now()), rating: 0, reviewCount: 0, createdAt: new Date().toISOString() };
  db.products.push(product);
  saveDB(db);
  return product;
}

export async function updateProduct(id, data) {
  const db = await getDB();
  const idx = db.products.findIndex(p => p.id === String(id));
  if (idx === -1) return null;
  db.products[idx] = { ...db.products[idx], ...data, updatedAt: new Date().toISOString() };
  saveDB(db);
  return db.products[idx];
}

export async function deleteProduct(id) {
  const db = await getDB();
  const idx = db.products.findIndex(p => p.id === String(id));
  if (idx === -1) return false;
  db.products.splice(idx, 1);
  saveDB(db);
  return true;
}

// ── Orders ───────────────────────────────────────────────────────
export async function createOrder({ userId, items, total, shippingAddress, paymentMethod }) {
  const db = await getDB();
  const order = {
    id: `ORD-${Date.now()}`,
    userId,
    items,
    total,
    shippingAddress,
    paymentMethod,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  // Reduce stock
  items.forEach(item => {
    const p = db.products.find(p => p.id === String(item.id));
    if (p) p.stock = Math.max(0, p.stock - item.quantity);
  });
  db.orders.push(order);
  saveDB(db);
  return order;
}

export async function getOrdersByUser(userId) {
  const db = await getDB();
  return db.orders.filter(o => o.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getAllOrders() {
  const db = await getDB();
  return db.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function updateOrderStatus(id, status) {
  const db = await getDB();
  const order = db.orders.find(o => o.id === id);
  if (!order) return null;
  order.status = status;
  order.updatedAt = new Date().toISOString();
  saveDB(db);
  return order;
}

export async function getStats() {
  const db = await getDB();
  const revenue = db.orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
  const categories = [...new Set(db.products.map(p => p.category))].length;
  return {
    totalProducts: db.products.length,
    totalUsers: db.users.length,
    totalOrders: db.orders.length,
    revenue,
    categories,
    pendingOrders: db.orders.filter(o => o.status === 'pending').length,
    lowStock: db.products.filter(p => p.stock < 10).length,
  };
}
