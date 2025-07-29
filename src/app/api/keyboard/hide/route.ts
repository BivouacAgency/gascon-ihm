import { NextResponse } from "next/server";
import { hideKeyboard } from "../actions";

export async function GET() {
  try {
    const result = await hideKeyboard();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 