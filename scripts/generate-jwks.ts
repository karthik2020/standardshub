import { generateKeyPairSync } from "crypto";
import { writeFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const __dirname = join(process.cwd(), "scripts");

const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "spki",
    format: "jwk",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});

const kid = Buffer.from(publicKey.n).toString("hex").slice(0, 16);

const jwks = {
  keys: [
    {
      ...publicKey,
      kid,
      alg: "RS256",
      use: "sig",
    },
  ],
};

const outputPath = join(process.cwd(), "public", ".well-known", "http-message-signatures-directory");

writeFileSync(outputPath, JSON.stringify(jwks, null, 2));
console.log("Generated JWKS at", outputPath);
console.log("Key ID:", kid);
