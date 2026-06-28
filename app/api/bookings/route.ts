import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "bookings.json");

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
  const result = email ? all.filter((b: { email: string }) => b.email === email.toLowerCase()) : all;
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const all = readAll();
  const booking = {
    id: randomUUID(),
    ...body,
    email: body.email?.toLowerCase() ?? "",
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  all.push(booking);
  writeAll(all);
  return NextResponse.json({ success: true, booking }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { id, status, notes } = await req.json();
  const all = readAll();
  const idx = all.findIndex((b: { id: string }) => b.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (status) all[idx].status = status;
  if (notes !== undefined) all[idx].notes = notes;
  all[idx].updatedAt = new Date().toISOString();
  writeAll(all);
  return NextResponse.json({ success: true, booking: all[idx] });
}
