import { NextResponse } from "next/server";
import { getParentBehaviourData } from "@/lib/behaviourData";

export async function GET() {
  const data = getParentBehaviourData();
  return NextResponse.json(data);
}

