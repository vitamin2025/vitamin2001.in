// server.js - Lightweight production entry point optimized for Hostinger Node.js
// Reduces process and thread consumption to prevent hitting Hostinger's 120 NPROC limit.

process.env.NODE_ENV = process.env.NODE_ENV || "production";
process.env.NEXT_TELEMETRY_DISABLED = "1";
process.env.UV_THREADPOOL_SIZE = process.env.UV_THREADPOOL_SIZE || "2";

const path = require("path");
const fs = require("fs");

const standalonePath = path.join(__dirname, ".next", "standalone", "server.js");

if (fs.existsSync(standalonePath)) {
  require(standalonePath);
} else {
  // Fallback to Next CLI if standalone has not been built yet
  process.argv = [process.argv[0], path.join(__dirname, "node_modules", ".bin", "next"), "start"];
  require("next/dist/bin/next");
}
