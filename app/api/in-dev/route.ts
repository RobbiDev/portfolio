import { NextResponse } from "next/server"
import { getAllInDevItems } from "@/lib/in-dev"

export async function GET() {
  try {
    const items = getAllInDevItems()
    return NextResponse.json(items)
  } catch (error) {
    console.error("Error fetching in-dev items:", error)
    return NextResponse.json(
      { error: "Failed to fetch in-dev items" },
      { status: 500 }
    )
  }
}
