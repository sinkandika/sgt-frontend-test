import axios from "axios";
import { NextResponse } from "next/server";

const BASE_URL = "http://localhost:8001/api/web/v1/products";

export async function GET(req: Request) {
  try {
    const { search } = Object.fromEntries(new URL(req.url).searchParams);
    const response = await axios.get(BASE_URL, {
      params: search ? { search } : {},
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
