const express = require("express");
const { execSync } = require("child_process");

execSync("rm -f finanzas.db");
execSync("rm -rf .next");
execSync("rm -rf node_modules");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("better-sqlite3")("./finanzas.db");

const createTables = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      notes TEXT,
      paymentMethod TEXT NOT NULL DEFAULT 'Efectivo',
      type TEXT NOT NULL DEFAULT 'Gasto',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

  CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      icon TEXT NOT NULL,
      color TEXT NOT NULL
    );
`;

  createTables();

app.get("/api/expenses", (req, res) => {
  try {
    const expenses = db.prepare("SELECT * FROM expenses ORDER BY date DESC").all();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/expenses", (req, res) => {
  try {
    const body = req.body;
    const result = db
      .prepare(
        "INSERT INTO expenses (title, amount, category, date, notes, paymentMethod, type) VALUES (?, ?, ?, ?, ?, ?, ?)"
      )
      .run(
        body.title,
        body.amount,
        body.category,
        body.date,
        body.notes || "",
        body.paymentMethod || "Efectivo",
        body.type || "Gasto"
      );
    
    const newExpense = db
      .prepare("SELECT * FROM expenses WHERE id = ?")
      .get(result.lastInsertRowid);
    
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/expenses/:id", (req, res) => {
  try {
    db.prepare("DELETE FROM expenses WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/categories", (req, res) => {
  try {
    const categories = db.prepare("SELECT * FROM categories").all();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/payment-methods", (req, res) => {
  try {
    const methods = db.prepare("SELECT * FROM paymentMethods").all();
    res.json(methods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
});
