const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dataDir = path.join(__dirname, "data");
const usersFile = path.join(dataDir, "users.json");

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, JSON.stringify({ users: [] }, null, 2));
}

function readUsers() {
  ensureDataFile();
  const raw = fs.readFileSync(usersFile, "utf-8");
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.users)) return { users: [] };
    return parsed;
  } catch {
    return { users: [] };
  }
}

function writeUsers(payload) {
  ensureDataFile();
  fs.writeFileSync(usersFile, JSON.stringify(payload, null, 2));
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function validatePassword(password) {
  const p = String(password || "");
  return p.length >= 6;
}

function getUserByEmail(email) {
  const { users } = readUsers();
  const norm = normalizeEmail(email);
  return users.find((u) => normalizeEmail(u.email) === norm);
}

function issueToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      name: user.name,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.auth = payload;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

app.use(express.static(path.join(__dirname, "public")));

app.post("/api/auth/register", async (req, res) => {
  try {
    const name = String(req.body?.name || "").trim();
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || "");

    if (!name) return res.status(400).json({ error: "Name is required" });
    if (!validateEmail(email)) return res.status(400).json({ error: "Valid email is required" });
    if (!validatePassword(password)) return res.status(400).json({ error: "Password must be at least 6 characters" });

    const existing = getUserByEmail(email);
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const id = cryptoLikeId();
    const passwordHash = await bcrypt.hash(password, 10);

    const data = readUsers();
    data.users.push({ id, name, email, passwordHash });
    writeUsers(data);

    return res.json({ message: "Registered successfully" });
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || "");

    if (!validateEmail(email)) return res.status(400).json({ error: "Valid email is required" });
    if (!password) return res.status(400).json({ error: "Password is required" });

    const user = getUserByEmail(email);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = issueToken(user);
    return res.json({ token });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
});

app.get("/dashboard", requireAuth, (req, res) => {
  // Serve dashboard html; frontend reads token payload only if desired.
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// Public pages
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "public", "login.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "public", "register.html")));
app.get("/", (req, res) => res.redirect("/login"));


// Small utility: avoid crypto import to keep dependencies minimal
function cryptoLikeId() {
  return "u_" + Math.random().toString(16).slice(2) + "_" + Date.now().toString(16);
}

app.listen(PORT, () => {
  console.log(`Problem2 server running on http://localhost:${PORT}`);
});

