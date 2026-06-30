import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow reaching the dev server from these origins (not just localhost).
  // Without this, Next blocks cross-origin dev requests — which breaks the HMR
  // websocket and can stop client JS chunks from loading, leaving the page
  // server-rendered but un-hydrated (visible UI, dead buttons). Add any LAN IPs
  // / hostnames you open the dev server from here.
  allowedDevOrigins: ["192.168.0.14"],
};

export default nextConfig;
