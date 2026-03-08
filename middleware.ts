import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // TODO: re-enable when Supabase auth is connected
  // const session = await getSession(request);
  // if (!session) return NextResponse.redirect(new URL("/login", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/(app)/:path*", "/dashboard/:path*"],
};