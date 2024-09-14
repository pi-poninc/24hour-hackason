"use server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { prompt } = await request.json();
  const res = await fetch(`http://0.0.0.0:8000/image`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
    }),
  });
  try {
    return NextResponse.json(await res.json());
  } catch (error) {
    throw error;
  }
}
