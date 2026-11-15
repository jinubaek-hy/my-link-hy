import { NextResponse } from "next/server";
import mockResponse from "@/mocks/mylink-mock.json";


/**
 * GET /api/links
 * 백엔드 Mock API 엔드포인트 — src/mocks/mylink-mock.json 데이터를 반환합니다.
 */
export async function GET() {
  return NextResponse.json(mockResponse, {
    status: 200,
  });
}
