"use server";
import { NextResponse } from "next/server";

import { STABLE_DIFFUSION_API } from "@/constants/stableDiffusion";

export async function POST(request: Request) {
  console.log("POST /api/stableDiffusion");
  const { prompt } = await request.json();
  const res = await fetch(`${STABLE_DIFFUSION_API}/sdapi/v1/txt2img`, {
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
