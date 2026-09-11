import { fileURLToPath } from "node:url";
import path from "node:path";

const dir = path.dirname(fileURLToPath(import.meta.url));

/** @type {import("next").NextConfig} */
const nextConfig = {
  // Hostinger checks the app out under nested lockfiles. Pin the workspace
  // root so Next does not treat the parent domain directory as the project.
  outputFileTracingRoot: dir,
  turbopack: {
    root: dir,
  },
};

export default nextConfig;
