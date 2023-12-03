const authToken = process.env.ADMIN_TOKEN;
const microserviceUUID = process.env.MICROSERVICE;
const region = process.env.REGION;
const imageName = process.env.IMAGE;
const awsAccountId = process.env.AWS_ACCOUNT_ID;
const tenantUrl = process.env.TENANT_URL;

console.log(
  JSON.stringify(
    {
      authToken,
      microserviceUUID,
      region,
      imageName,
      awsAccountId,
      tenantUrl,
    },
    (k, v) => v === undefined ? null : v, // Replace undefined values with null so they can be logged
    "\t"
  )
);

if (![authToken, microserviceUUID, region, imageName, awsAccountId, tenantUrl].every(Boolean)) {
  throw new Error("ADMIN_TOKEN, MICOSERVICE, REGION, IMAGE, TENANT_URL and AWS_ACCOUNT_ID must be set");
}
const micoserviceUrl = `${tenantUrl}/api/v1/serviceadmin/${microserviceUUID}`;
const headers = { Authorization: `Bearer ${authToken}`, "content-type": "application/json" };
let microservicePayload;

// Get current microservice object to use as a template and validate the admin token
process.stdout.write("Validating admin token");
try {
  const response = await fetch(micoserviceUrl, { headers });
  if (response.status !== 200) {
    throw new Error(`Microservice responded with status code ${response.status}`);
  }
  microservicePayload = (await response.json())[0]["config"];
  process.stdout.write(": ✔\r");
  console.log(`Original microservice config: \n${JSON.stringify(microservicePayload, null, "\t")}`);
} catch (e) {
  process.stdout.write(": x\nFailed to validate admin token\n");
  throw e;
}

// Get the name of the currently running pod. Will be used later to check if redeployment was successful.
process.stdout.write("Getting original pod name");
const podStatus = await (await fetch(`${micoserviceUrl}/status`, { headers })).json();
if (podStatus?.pods.length === 0 || !podStatus.pods[0]?.metadata?.name) {
  throw new Error(`Could not find pod data: ${JSON.stringify(podStatus, null, "\t")}`);
}
const originalPodName = podStatus.pods[0].metadata.name;
process.stdout.write(": ✔\n");
console.log(`Original pod name: ${originalPodName}`);

// Patch the microservice with the new docker image
// This will NOT trigger a redeployment if the new image is the same as the old one
console.log("Deploying microservice");
const payload = {
  config: { ...microservicePayload, dockerImage: `${awsAccountId}.dkr.ecr.${region}.amazonaws.com/${imageName}` },
};
console.log(`New microservice payload: \n${JSON.stringify(payload, null, "\t")}`);

const response = await fetch(micoserviceUrl, { method: "PATCH", body: JSON.stringify(payload), headers });
if (response.status !== 200) throw new Error(`Failed to patch microservice (status code ${response.status})`);

let newPodReady = false;
console.log("Microservice patched, waiting for redeployment");
const waitUntilNewPodIsReady = async () => {
  while (!newPodReady) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    process.stdout.write(".");
    const response = await fetch(`${micoserviceUrl}/status`, { headers });
    const statusBody = await response.json();
    if (!statusBody?.pods || statusBody.pods.length != 1) {
      continue;
    }
    const currentPodName = statusBody.pods[0]?.metadata?.name;
    if (currentPodName === originalPodName || statusBody.pods[0]?.status?.phase !== "Running") {
      continue;
    }
    process.stdout.write(`\nNew pod: ${currentPodName}\n`);
    newPodReady = true;
  }
};

// Give the microservice up to 5 minutes to redeploy
await Promise.race([
  waitUntilNewPodIsReady(),
  new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Timed out waiting for microservice to restart`));
    }, 300000);
  }),
]);
if (newPodReady) {
  console.log("Microservice successfully redeployed");
  process.exit(0);
} else {
  console.log("Something went wrong, check deployment logs");
  process.exit(1);
}
export {};