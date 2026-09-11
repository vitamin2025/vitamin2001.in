import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // 1. Get requested hostname (e.g. 'runachan.vitamin2001.in', 'vitamin2001.in', or 'localhost:3000')
  const hostHeader = request.headers.get("host") || "";
  const url = request.nextUrl.clone();

  // 2. Define domains
  const productionDomain =
    process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || "vitamin2001.in";
  const mainDomain =
    process.env.NODE_ENV === "production"
      ? productionDomain
      : process.env.NEXT_PUBLIC_MAIN_DOMAIN || "localhost:3000";

  // Strip ports for comparison if needed
  const hostWithoutPort = hostHeader.split(":")[0];
  const mainDomainWithoutPort = mainDomain.split(":")[0];

  // 3. Detect if request is targeting a subdomain
  let subdomain: string | null = null;

  if (hostHeader !== mainDomain) {
    if (hostHeader.endsWith(`.${mainDomain}`)) {
      subdomain = hostHeader.replace(`.${mainDomain}`, "");
    } else if (
      hostWithoutPort !== mainDomainWithoutPort &&
      hostWithoutPort.endsWith(`.${mainDomainWithoutPort}`)
    ) {
      subdomain = hostWithoutPort.replace(`.${mainDomainWithoutPort}`, "");
    } else if (
      hostWithoutPort.endsWith(".localhost") &&
      hostWithoutPort !== "localhost"
    ) {
      subdomain = hostWithoutPort.replace(".localhost", "");
    }
  }

  // 4. If request is on a subdomain, rewrite to internal /client/[subdomain] path
  if (subdomain && subdomain !== "www") {
    // Avoid double prefixing if pathname already starts with /client/[subdomain]
    if (!url.pathname.startsWith(`/client/${subdomain}`)) {
      url.pathname = `/client/${subdomain}${url.pathname === "/" ? "" : url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // Continue normally if it is the main domain or already rewritten
  return NextResponse.next();
}

// 5. Optimization: Ignore static assets and APIs
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
