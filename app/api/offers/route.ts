import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "offers.json");

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

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const all = readAll();
  const result = email ? all.filter((o: { customerEmail: string }) => o.customerEmail === email.toLowerCase()) : all;
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const all = readAll();
  const offer = { id: randomUUID(), ...body, used: false, createdAt: new Date().toISOString() };
  all.push(offer);
  writeAll(all);
  return NextResponse.json({ success: true, offer }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { id, used } = await req.json();
  const all = readAll();
  const idx = all.findIndex((o: { id: string }) => o.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (used !== undefined) all[idx].used = used;
  writeAll(all);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const all = readAll();
  const filtered = all.filter((o: { id: string }) => o.id !== id);
  writeAll(filtered);
  return NextResponse.json({ success: true });
}
