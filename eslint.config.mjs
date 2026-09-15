import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/app/admin/**/*.{ts,tsx}", "src/components/admin/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/lib/admin/http",
              message: "Import the public @/lib/admin API instead of internals.",
            },
            {
              name: "@/lib/admin/read",
              message: "Import the public @/lib/admin API instead of internals.",
            },
            {
              name: "@/lib/admin/keys",
              message: "Import the public @/lib/admin API instead of internals.",
            },
            {
              name: "@/lib/admin/effects",
              message: "Import the public @/lib/admin API instead of internals.",
            },
            {
              name: "@/lib/admin/command",
              message: "Import the public @/lib/admin API instead of internals.",
            },
          ],
        },
      ],
    },
  },
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
