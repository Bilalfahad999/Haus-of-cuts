import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createHash } from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "clients.json");

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]", "utf-8");
}

function readAll() {
  ensureFile();
  return JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

function writeAll(data: unknown[]) {
  ensureFile();
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf-8");
}

function hash(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
  const all = readAll();
  const exists = all.some((c: { email: string }) => c.email === email.toLowerCase());
  return NextResponse.json({ exists });
}

export async function POST(req: NextRequest) {
  const { action, email, password, name } = await req.json();
  const all = readAll();
  const lEmail = email?.toLowerCase();

  if (action === "register") {
    if (all.find((c: { email: string }) => c.email === lEmail)) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    const client = { email: lEmail, name, passwordHash: hash(password), createdAt: new Date().toISOString() };
    all.push(client);
    writeAll(all);
    return NextResponse.json({ success: true, name });
  }

  if (action === "login") {
    const client = all.find((c: { email: string; passwordHash: string }) => c.email === lEmail && c.passwordHash === hash(password));
    if (!client) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    return NextResponse.json({ success: true, name: client.name });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
