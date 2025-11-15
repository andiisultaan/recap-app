import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const GRAPQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;
  try {
    const body = await request.json();

    const response = await fetch(`${GRAPQL_ENDPOINT}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("GraphQL Error:", error);
    return NextResponse.json({ error: "GraphQL request failed" }, { status: 500 });
  }
}
