// middleware.js
import { NextResponse } from "next/server";

// Utility function to detect device
function detectDevice(userAgent) {
  if (/android/i.test(userAgent)) {
    return "android";
  } else if (/iPad|iPhone|iPod/.test(userAgent)) {
    return "ios";
  } else {
    return "other";
  }
}

const redirectUrl = {
  android: "https://play.google.com/store/apps/details?id=id.datascrip.mall",
  ios: "itms-apps://apps.apple.com/id/app/datascripmall/id1594142562?l=id",
  other: "/",
};

export function middleware(request) {
  const userAgent = request.headers.get("user-agent") || "";
  const device = detectDevice(userAgent);
  // console.log("masuk middleware", device);

  if (device === "android" || device === "ios") {
    return NextResponse.redirect(redirectUrl[device]);
  }
  if (device === "other") {
    const url = request.nextUrl.clone(); // Create a clone of the request URL to modify
    // console.log("masuk url", url);
    url.href = `${url.origin}/`;
    return NextResponse.redirect(url);
  }

  // Continue to the requested page if not redirected
  return NextResponse.next();
}

// Configuration to apply middleware to all routes except the root URL, API routes, and static files
export const config = {
  matcher: [
    // Match all paths except the root URL `/`, api/ , next/static , static/
    // .well-known/assetlinks.json , favicon.ico , vercel.svg, next.svg
    "/((?!api|_next/static|static|.well-known/assetlinks\\.json|assets|favicon.ico|vercel.svg|next.svg|$).*)",
  ],
};
