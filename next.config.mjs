import { fileURLToPath } from "node:url";
import path from "node:path";

const dir = path.dirname(fileURLToPath(import.meta.url));

/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "standalone",
  // Hostinger checks the app out under nested lockfiles. Pin the workspace
  // root so Next does not treat the parent domain directory as the project.
  outputFileTracingRoot: dir,
  turbopack: {
    root: dir,
  },
  // Limit CPU & worker process count to prevent exhausting Hostinger's process limit (120 max)
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
  // Prevent spawning background image optimization worker threads
  images: {
    unoptimized: true,
  },
  // Disable heavy source-map generation to reduce worker memory and child tasks
  productionBrowserSourceMaps: false,
};

export default nextConfig;
