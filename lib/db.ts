import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join("/app/data", "finanzas.db");
const db = new Database(dbPath);

const cleanSQL = (sql: string) => {
  return sql
    .replace(/\s+/g, " ");
};

const createExpensesTable = cleanSQL(`
  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    notes TEXT,
    paymentMethod TEXT NOT NULL DEFAULT 'Efectivo',
    type TEXT NOT NULL DEFAULT 'Gasto',
    fundId INTEGER,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

const createCategoriesTable = cleanSQL(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL,
    color TEXT NOT NULL
  )
`);

const createFundsTable = cleanSQL(`
  CREATE TABLE IF NOT EXISTS funds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    targetAmount REAL NOT NULL,
    currentAmount REAL NOT NULL DEFAULT 0,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    deadline TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

const createContributionsTable = cleanSQL(`
  CREATE TABLE IF NOT EXISTS contributions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fundId INTEGER NOT NULL,
    amount REAL NOT NULL,
    date TEXT NOT NULL,
    notes TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fundId) REFERENCES funds(id) ON DELETE CASCADE
  )
`);

const createPaymentMethodsTable = cleanSQL(`
  CREATE TABLE IF NOT EXISTS paymentMethods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL,
    color TEXT NOT NULL
  )
`);

const createTransactionTypesTable = cleanSQL(`
  CREATE TABLE IF NOT EXISTS transactionTypes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    classification TEXT NOT NULL DEFAULT 'expense'
  )
`);

db.exec(createExpensesTable);
db.exec(createCategoriesTable);
db.exec(createFundsTable);
db.exec(createContributionsTable);
db.exec(createPaymentMethodsTable);
db.exec(createTransactionTypesTable);

const defaultCategories = [
  { name: "Supermercado", icon: "🛒", color: "#ef4444" },
  { name: "Comida", icon: "🍕", color: "#f97316" },
  { name: "Transporte", icon: "🚗", color: "#eab308" },
  { name: "Vivienda", icon: "🏠", color: "#22c55e" },
  { name: "Entretenimiento", icon: "🎮", color: "#22c55e" },
  { name: "Salud", icon: "💊", color: "#06b6d4" },
  { name: "Bills", icon: "📄", color: "#8b5cf6" },
  { name: "Compras", icon: "🛍️", color: "#3b82f6" },
  { name: "Wellness", icon: "🧘", color: "#14b8a6" },
  { name: "Servicios", icon: "💡", color: "#f59e0b" },
  { name: "Inversiones", icon: "📈", color: "#10b981" },
  { name: "Otros", icon: "📦", color: "#6b7280" },
];

const defaultPaymentMethods = [
  { name: "Lulo Bank", icon: "🟣", color: "#9f1239" },
  { name: "Nequi", icon: "💜", color: "#8b5cf6" },
  { name: "Efectivo", icon: "💵", color: "#10b981" },
  { name: "Tarjeta Credito", icon: "💳", color: "#3b82f6" },
  { name: "Tarjeta Debito", icon: "🏧", color: "#8b5cf6" },
  { name: "Transferencia", icon: "📱", color: "#f59e0b" },
  { name: "Cheque", icon: "📝", color: "#6b7280" },
  { name: "PayPal", icon: "🅿️", color: "#003087" },
  { name: "Otros", icon: "❓", color: "#9ca3af" },
];

const defaultFunds = [
  { name: "Regalos Navidad", targetAmount: 500, icon: "🎁", color: "#ef4444" },
  { name: "Impuestos Coche", targetAmount: 800, icon: "🚗", color: "#f97316" },
  { name: "Mantenimiento Coche", targetAmount: 400, icon: "🔧", color: "#eab308" },
  { name: "Vacaciones", targetAmount: 2000, icon: "✈️", color: "#22c55e" },
];

const defaultTransactionTypes = [
  { name: "Gasto", icon: "TrendingDown", color: "#ef4444", classification: "expense" },
  { name: "Ahorro", icon: "PiggyBank", color: "#22c55e", classification: "savings" },
  { name: "Inversión", icon: "TrendingUp", color: "#10b981", classification: "investment" },
  { name: "Anticipo", icon: "Gift", color: "#f59e0b", classification: "transfer" },
];

const insertCategory = db.prepare(
  "INSERT OR IGNORE INTO categories (name, icon, color) VALUES (?, ?, ?)"
);

const insertPaymentMethod = db.prepare(
  "INSERT OR IGNORE INTO paymentMethods (name, icon, color) VALUES (?, ?, ?)"
);

const insertFund = db.prepare(
  "INSERT OR IGNORE INTO funds (name, targetAmount, currentAmount, icon, color, deadline) VALUES (?, ?, ?, ?, ?, ?)"
);

const insertTransactionType = db.prepare(
  "INSERT OR IGNORE INTO transactionTypes (name, icon, color, classification) VALUES (?, ?, ?, ?)"
);

const insertMany = db.transaction((cats) => {
  for (const cat of cats) {
    insertCategory.run(cat.name, cat.icon, cat.color);
  }
});

const insertPaymentMethods = db.transaction((methods) => {
  for (const method of methods) {
    insertPaymentMethod.run(method.name, method.icon, method.color);
  }
});

const insertFunds = db.transaction((funds) => {
  for (const fund of funds) {
    const existing = db.prepare("SELECT id FROM funds WHERE name = ?").get(fund.name);
    if (!existing) {
      insertFund.run(fund.name, fund.targetAmount, fund.currentAmount || 0, fund.icon, fund.color, fund.deadline || null);
    }
  }
});

const insertTransactionTypes = db.transaction((types) => {
  for (const type of types) {
    insertTransactionType.run(type.name, type.icon, type.color, type.classification || 'expense');
  }
});

// Solo insertar datos predeterminados si las tablas están vacías
const hasExistingData = db.prepare("SELECT COUNT(*) as count FROM transactionTypes").get() as { count: number };

// Migración: agregar columna classification si no existe
try {
  db.prepare("SELECT classification FROM transactionTypes LIMIT 1").get();
} catch (error) {
  console.log("Ejecutando migración: agregando columna classification...");
  try {
    db.prepare("ALTER TABLE transactionTypes ADD COLUMN classification TEXT").run();
    
    // Clasificar tipos existentes
    db.prepare("UPDATE transactionTypes SET classification = 'expense' WHERE name IN ('gasto', 'Adelanto', 'Gasto', 'Préstamo', 'Anticipo')").run();
    db.prepare("UPDATE transactionTypes SET classification = 'savings' WHERE name IN ('Ahorro', 'ahorro')").run();
    db.prepare("UPDATE transactionTypes SET classification = 'investment' WHERE name IN ('Inversión', 'inversión')").run();
    db.prepare("UPDATE transactionTypes SET classification = 'transfer' WHERE name IN ('Transferencia', 'transferencia')").run();
    
    // Normalizar nombres a primera letra mayúscula
    db.prepare("UPDATE transactionTypes SET name = 'Gasto' WHERE name = 'gasto'").run();
    
    // Asegurar que todos tengan clasificación
    db.prepare("UPDATE transactionTypes SET classification = 'expense' WHERE classification IS NULL").run();
    
    console.log("Migración completada.");
  } catch (migrateError) {
    console.error("Error durante migración:", migrateError);
  }
}

if (hasExistingData.count === 0) {
  console.log("Base de datos vacía, insertando datos predeterminados...");
  insertMany(defaultCategories);
  insertPaymentMethods(defaultPaymentMethods);
  insertFunds(defaultFunds);
  insertTransactionTypes(defaultTransactionTypes);
} else {
  console.log("Base de datos ya contiene datos, omitiendo inicialización.");
}

export interface Expense {
  id?: number;
  title: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
  paymentMethod?: string;
  type?: string;
  createdAt?: string;
  fundId?: number;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface TransactionType {
  id: number;
  name: string;
  icon: string;
  color: string;
  classification: 'expense' | 'savings' | 'investment' | 'transfer';
}

export interface Contribution {
  id?: number;
  fundId: number;
  amount: number;
  date: string;
  notes?: string;
  createdAt?: string;
}

export interface PaymentMethod {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface Fund {
  id?: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
  color: string;
  deadline?: string;
  createdAt?: string;
}

export const expenseQueries = {
  getAll: db.prepare("SELECT * FROM expenses ORDER BY date DESC"),
  getById: db.prepare("SELECT * FROM expenses WHERE id = ?"),
  create: db.prepare(`
    INSERT INTO expenses (title, amount, category, date, notes, paymentMethod, type, fundId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),
  update: db.prepare(`
    UPDATE expenses
    SET title = ?, amount = ?, category = ?, date = ?, notes = ?, paymentMethod = ?, type = ?, fundId = ?
    WHERE id = ?
  `),
  delete: db.prepare("DELETE FROM expenses WHERE id = ?"),
  getByMonth: db.prepare(`
    SELECT * FROM expenses
    WHERE strftime('%Y-%m', date) = ?
    ORDER BY date DESC
  `),
  getByType: db.prepare(`
    SELECT * FROM expenses
    WHERE strftime('%Y-%m', date) = ? AND type = ?
    ORDER BY date DESC
  `),
  getSummary: db.prepare(`
    SELECT category, SUM(amount) as total
    FROM expenses
    WHERE strftime('%Y-%m', date) = ?
    GROUP BY category
    ORDER BY total DESC
  `),
  getByPaymentMethod: db.prepare(`
    SELECT paymentMethod, SUM(amount) as total
    FROM expenses
    WHERE strftime('%Y-%m', date) = ?
    GROUP BY paymentMethod
    ORDER BY total DESC
  `),
  getTypeSummary: db.prepare(`
    SELECT type, SUM(amount) as total
    FROM expenses
    WHERE strftime('%Y-%m', date) = ?
    GROUP BY type
    ORDER BY total DESC
  `),
  getMonthComparison: db.prepare(`
    SELECT type, SUM(amount) as total
    FROM expenses
    WHERE strftime('%Y-%m', date) = ?
    GROUP BY type
    ORDER BY total DESC
  `),
  getRecent: db.prepare(`
    SELECT * FROM expenses
    ORDER BY date DESC, createdAt DESC
    LIMIT 10
  `),
};

export const categoryQueries = {
  getAll: db.prepare("SELECT * FROM categories ORDER BY name"),
  getById: db.prepare("SELECT * FROM categories WHERE id = ?"),
  create: db.prepare("INSERT INTO categories (name, icon, color) VALUES (?, ?, ?)"),
  update: db.prepare("UPDATE categories SET name = ?, icon = ?, color = ? WHERE id = ?"),
  delete: db.prepare("DELETE FROM categories WHERE id = ?"),
  checkUsage: db.prepare("SELECT COUNT(*) as count FROM expenses WHERE category = ?"),
};

export const paymentMethodQueries = {
  getAll: db.prepare("SELECT * FROM paymentMethods ORDER BY name"),
  getById: db.prepare("SELECT * FROM paymentMethods WHERE id = ?"),
  create: db.prepare("INSERT INTO paymentMethods (name, icon, color) VALUES (?, ?, ?)"),
  update: db.prepare("UPDATE paymentMethods SET name = ?, icon = ?, color = ? WHERE id = ?"),
  delete: db.prepare("DELETE FROM paymentMethods WHERE id = ?"),
  checkUsage: db.prepare("SELECT COUNT(*) as count FROM expenses WHERE paymentMethod = ?"),
};

export const fundQueries = {
  getAll: db.prepare("SELECT * FROM funds ORDER BY createdAt DESC"),
  getById: db.prepare("SELECT * FROM funds WHERE id = ?"),
  create: db.prepare("INSERT INTO funds (name, targetAmount, currentAmount, icon, color, deadline) VALUES (?, ?, ?, ?, ?, ?)"),
  update: db.prepare("UPDATE funds SET name = ?, targetAmount = ?, icon = ?, color = ?, deadline = ? WHERE id = ?"),
  delete: db.prepare("DELETE FROM funds WHERE id = ?"),
};

export const contributionQueries = {
  getAll: db.prepare("SELECT * FROM contributions ORDER BY date DESC"),
  getById: db.prepare("SELECT * FROM contributions WHERE id = ?"),
  create: db.prepare(`
    INSERT INTO contributions (fundId, amount, date, notes)
    VALUES (?, ?, ?, ?)
  `),
  delete: db.prepare("DELETE FROM contributions WHERE id = ?"),
  getByMonth: db.prepare(`
    SELECT * FROM contributions
    WHERE strftime('%Y-%m', date) = ?
    ORDER BY date DESC
  `),
  getTotalByFund: db.prepare(`
    SELECT SUM(amount) as total
    FROM contributions
    WHERE fundId = ?
  `),
};

export const transactionTypeQueries = {
  getAll: db.prepare("SELECT * FROM transactionTypes ORDER BY name"),
  getById: db.prepare("SELECT * FROM transactionTypes WHERE id = ?"),
  getByClassification: db.prepare("SELECT * FROM transactionTypes WHERE classification = ? ORDER BY name"),
  create: db.prepare("INSERT INTO transactionTypes (name, icon, color, classification) VALUES (?, ?, ?, ?)"),
  update: db.prepare("UPDATE transactionTypes SET name = ?, icon = ?, color = ?, classification = ? WHERE id = ?"),
  delete: db.prepare("DELETE FROM transactionTypes WHERE id = ?"),
  checkUsage: db.prepare("SELECT COUNT(*) as count FROM expenses WHERE type = ?"),
};

export default db;

// Singleton para asegurar una sola instancia de la base de datos
let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!dbInstance) {
    dbInstance = db;
  }
  return dbInstance;
}
