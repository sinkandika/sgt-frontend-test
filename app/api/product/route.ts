import axios from "axios";
import { NextResponse } from "next/server";

const BASE_URL = "http://localhost:8001/api/web/v1/product";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const search = searchParams.get("search") || "";

    // Call backend API with pagination and search
    const response = await axios.get(BASE_URL, {
      params: { page, limit, search },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await axios.post(BASE_URL, body);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("POST /api/product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const response = await axios.put(BASE_URL, body);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("PUT /api/product error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const product_id = searchParams.get("id");

    if (!product_id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    // ✅ Backend expects ?product_id= not ?id=
    const response = await axios.delete(`${BASE_URL}?product_id=${product_id}`);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("❌ Delete failed:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
