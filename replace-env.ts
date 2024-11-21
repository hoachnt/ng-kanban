import fs from "fs";
import path from "path";

// Determine the environment (production or development)
const env = process.env.NODE_ENV || "development"; // Default to 'development'

// Set the target file based on the environment
const targetPath = path.join(
    "./src/environments",
    env === "production" ? "environment.prod.ts" : "environment.dev.ts"
);

// Create the environment configuration file
const envConfigFile = `
export const environment = {
  production: ${env === "production"},
  directusUrl: '${process.env["NG_APP_DIRECTUS_URL"]}',
  userRole: '${process.env["NG_APP_USER_ROLE"]}',
  mainDomain: '${process.env["NG_APP_MAIN_DOMAIN"]}'
};
`;

// Write the environment configuration file
fs.writeFileSync(targetPath, envConfigFile, "utf8");

console.log(`Environment config written to ${targetPath}`);
