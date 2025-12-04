import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

type Role = "parent" | "child";

interface UserRecord {
  password: string;
  role: Role;
  name: string;
}

interface UsersFile {
  [username: string]: UserRecord;
}

async function loadUsers(): Promise<UsersFile> {
  // For the MVP we read from a local JSON file to simulate a tiny DB.
  const filePath = path.join(process.cwd(), "data", "users.json");
  const raw = await readFile(filePath, "utf-8");
  const data = JSON.parse(raw) as UsersFile;
  return data;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return NextResponse.json(
      { ok: false, error: "Username and password are required." },
      { status: 400 }
    );
  }

  let users: UsersFile;
  try {
    users = await loadUsers();
  } catch {
    return NextResponse.json(
      { ok: false, error: "User store not available." },
      { status: 500 }
    );
  }

  const user = users[username];

  if (!user || user.password !== password) {
    return NextResponse.json(
      { ok: false, error: "Invalid username or password." },
      { status: 401 }
    );
  }

  // In a real app we would set an httpOnly cookie with a signed session token.
  // For this MVP we simply return the user payload for the frontend to use.
  return NextResponse.json({
    ok: true,
    user: {
      username,
      role: user.role,
      name: user.name
    }
  });
}


