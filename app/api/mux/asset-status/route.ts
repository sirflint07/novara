import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const playbackId = searchParams.get("playbackId");

    if (!playbackId) {
      return NextResponse.json({ error: "playbackId is required" }, { status: 400 });
    }

    const muxData = await db.muxData.findFirst({
      where: {
        playbackId: playbackId,
      },
    });

    if (!muxData) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      ready: true, 
      assetId: muxData.assetId,
      playbackId: muxData.playbackId,
    });
  } catch (error) {
    console.error("[MUX_ASSET_STATUS]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}