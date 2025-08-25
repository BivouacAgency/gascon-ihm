import { NextResponse } from "next/server";
import { showKeyboard } from "../actions";
import { z } from "zod";

const ShowKeyboardResponseSchema = z.object({
  status: z.literal("shown"),
  message: z.string().optional(),
});

export async function GET() {
  try {
    const result = await showKeyboard();
    const parsed = ShowKeyboardResponseSchema.safeParse(result);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid response from showKeyboard" },
        { status: 500 },
      );
    }
    return NextResponse.json(parsed.data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
