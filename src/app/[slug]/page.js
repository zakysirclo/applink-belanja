import { headers } from "next/headers";

export default function Slug() {
  // Access the request headers
  const headerList = headers();
  const userAgent = headerList.get("user-agent") || "";

  // Detect platform
  const isAndroid = /Android/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

  return (
    <div>
      {isAndroid && <p>You are using an Android device</p>}
      {isIOS && <p>You are using an iOS device</p>}
      {!isAndroid && !isIOS && <p>You are using a different device</p>}
    </div>
  );
}
