import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "users.json");

export const GET = async () => {
  try {
    const fileData = await fs.readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(fileData));
  } catch {
    return NextResponse.json([]);
  }
};

export const POST = async (req: Request) => {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password required" },
        { status: 400 }
      );
    }

    let users: { id: string; email: string; password: string }[] = [];

    try {
      const fileData = await fs.readFile(filePath, "utf-8");
      users = JSON.parse(fileData);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((err as any).code !== "ENOENT") throw err;
      users = [];
    }

    if (users.find((u) => u.email === email)) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const newUser = { id: nanoid(), email, password };
    users.push(newUser);

    await fs.writeFile(filePath, JSON.stringify(users, null, 2));

    return NextResponse.json({ message: "Account created", data: newUser });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
