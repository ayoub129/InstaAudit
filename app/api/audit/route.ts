import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";

export async function POST(req: NextRequest) {
  const { username } = await req.json();

  // 1. Run the Python script
  const python = spawn("python", ["./python/insta_scrape.py", username]);
  let data = "";
  for await (const chunk of python.stdout) {
    data += chunk;
  }
  await new Promise((resolve) => python.on("close", resolve));
  const profile = JSON.parse(data);

  // 2. TODO: Call OpenAI and Google Vision APIs for analysis

  // 3. Return the raw scraped data for now
  return NextResponse.json({ profile });
}
