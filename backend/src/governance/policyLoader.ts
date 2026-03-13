import fs from "fs";
import path from "path";

let cachedPolicies: any = null;

export function loadPolicies() {

  const policyPath = path.join(
    __dirname,
    "../policies/policyRegistry.json"
  );

  const file = fs.readFileSync(policyPath, "utf-8");

  cachedPolicies = JSON.parse(file);

  return cachedPolicies;
}

export function getPolicies() {

  if (!cachedPolicies) {
    return loadPolicies();
  }

  return cachedPolicies;
}