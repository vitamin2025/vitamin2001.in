import { Client, Account, Databases } from "appwrite";

// Safe Appwrite client initializer that avoids build-time errors when env vars are missing.
// During Next.js prerender/export, undefined endpoint can cause appwrite's setEndpoint to
// access string methods (e.g., startsWith) on undefined. We guard against that here.
function createSafeClient() {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

  const c = new Client();

  // Only set endpoint/project if provided as strings
  if (typeof endpoint === "string" && endpoint.length > 0) {
    c.setEndpoint(endpoint);
  }
  if (typeof projectId === "string" && projectId.length > 0) {
    c.setProject(projectId);
  }

  return c;
}

const client = createSafeClient();
const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases };
