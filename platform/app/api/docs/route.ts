// app/api/docs/route.ts
// Serves the raw OpenAPI JSON spec so Swagger UI can consume it.

import { NextResponse } from "next/server";
import { swaggerSpec } from "../../../swagger";

export async function GET() {
  if (!swaggerSpec) {
    console.error("Swagger specification is null or undefined");
    return NextResponse.json({ error: "Swagger spec not found" }, { status: 500 });
  }
  return NextResponse.json(swaggerSpec);
}
