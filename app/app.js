const form = document.querySelector("#lendingForm");
const healthBadge = document.querySelector("#healthBadge");
const ltvOutput = document.querySelector("#ltvOutput");
const healthFactorOutput = document.querySelector("#healthFactorOutput");
const borrowDecision = document.querySelector("#borrowDecision");
const liquidationDecision = document.querySelector("#liquidationDecision");
const networkPill = document.querySelector("#networkPill");
const statusDot = document.querySelector("#statusDot");
const deploymentStatus = document.querySelector("#deploymentStatus");
const deploymentDetail = document.querySelector("#deploymentDetail");
const metadataList = document.querySelector("#metadataList");

const deploymentCandidates = [
  "/app/deployment.json",
  "/deployment.json",
  "/deployments/arcium_private_lending.json",
  "/deployments/latest.json",
];

const configCandidates = ["/Anchor.toml", "/Arcium.toml"];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function numberFromForm(name) {
  const value = new FormData(form).get(name);
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function setClassByState(element, state) {
  element.classList.remove("state-ok", "state-warn", "state-danger");
  element.classList.add(state);
}

function updateLendingState() {
  const collateralValue = numberFromForm("collateralValue");
  const currentDebt = numberFromForm("currentDebt");
  const borrowAmount = numberFromForm("borrowAmount");
  const withdrawAmount = numberFromForm("withdrawAmount");
  const maxLtv = numberFromForm("maxLtv") / 100;
  const liquidationLtv = numberFromForm("liquidationLtv") / 100;

  const postCollateral = Math.max(collateralValue - withdrawAmount, 0);
  const postDebt = Math.max(currentDebt + borrowAmount, 0);
  const ltv = postCollateral > 0 ? postDebt / postCollateral : Infinity;
  const healthFactor =
    postDebt > 0 ? (postCollateral * liquidationLtv) / postDebt : Infinity;
  const borrowAllowed = postCollateral > 0 && ltv <= maxLtv;
  const liquidatable = postDebt > 0 && ltv >= liquidationLtv;

  ltvOutput.textContent = Number.isFinite(ltv)
    ? `${(ltv * 100).toFixed(2)}%`
    : "No collateral";
  healthFactorOutput.textContent = Number.isFinite(healthFactor)
    ? `${healthFactor.toFixed(2)}x`
    : "No debt";

  borrowDecision.textContent = borrowAllowed
    ? `Allowed up to ${currency.format(postCollateral * maxLtv)} debt`
    : "Blocked by LTV";
  setClassByState(borrowDecision, borrowAllowed ? "state-ok" : "state-danger");

  liquidationDecision.textContent = liquidatable ? "Eligible" : "Not eligible";
  setClassByState(
    liquidationDecision,
    liquidatable ? "state-danger" : "state-ok"
  );

  if (postDebt === 0) {
    healthBadge.textContent = "No debt";
    healthBadge.className = "health-badge state-ok";
  } else if (healthFactor >= 1.25) {
    healthBadge.textContent = "Healthy";
    healthBadge.className = "health-badge state-ok";
  } else if (healthFactor >= 1) {
    healthBadge.textContent = "Watch";
    healthBadge.className = "health-badge state-warn";
  } else {
    healthBadge.textContent = "At risk";
    healthBadge.className = "health-badge state-danger";
  }
}

async function fetchText(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}`);
  }
  const text = await response.text();
  const normalizedText = text.trim().toLowerCase();
  if (
    normalizedText.startsWith("<!doctype") ||
    normalizedText.startsWith("<html")
  ) {
    throw new Error(`${path} returned the app shell`);
  }
  return text;
}

function readMetadataValue(metadata, keys) {
  for (const key of keys) {
    const value = key
      .split(".")
      .reduce((target, part) => target?.[part], metadata);
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value);
    }
  }
  return "";
}

function parseAnchorConfig(text) {
  const cluster = text.match(
    /\[provider\][\s\S]*?cluster\s*=\s*"([^"]+)"/
  )?.[1];
  const wallet = text.match(/\[provider\][\s\S]*?wallet\s*=\s*"([^"]+)"/)?.[1];
  const localnetProgram = text.match(
    /arcium_private_lending\s*=\s*"([^"]+)"/
  )?.[1];
  return { cluster, wallet, localnetProgram };
}

function renderMetadata(items) {
  metadataList.replaceChildren();
  for (const [label, value] of items) {
    if (!value) continue;
    const row = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = label;
    description.textContent = value;
    row.append(term, description);
    metadataList.append(row);
  }
}

function markNotDeployed(config = {}) {
  statusDot.className = "status-dot not-deployed";
  deploymentStatus.textContent = "not deployed yet";
  deploymentDetail.textContent = config.localnetProgram
    ? "Local Anchor config was found, but no public deployment metadata JSON is present."
    : "No public deployment metadata JSON was found in the app or deployment paths.";
  networkPill.textContent = config.cluster
    ? `Config: ${config.cluster}`
    : "Not deployed";

  renderMetadata([
    ["Config cluster", config.cluster],
    ["Localnet program", config.localnetProgram],
    ["Wallet config", config.wallet],
  ]);
}

async function loadDeploymentState() {
  for (const path of deploymentCandidates) {
    try {
      const metadata = JSON.parse(await fetchText(path));
      const programId = readMetadataValue(metadata, [
        "programId",
        "program_id",
        "address",
        "program.address",
      ]);
      const cluster = readMetadataValue(metadata, [
        "cluster",
        "network",
        "environment",
      ]);

      if (!programId) continue;

      statusDot.className = "status-dot deployed";
      deploymentStatus.textContent = "Verified deployment metadata found";
      deploymentDetail.textContent = `Loaded public metadata from ${path}.`;
      networkPill.textContent = cluster || "Deployed";

      renderMetadata([
        ["Program ID", programId],
        ["Cluster", cluster],
        [
          "Deployment signature",
          readMetadataValue(metadata, ["signature", "tx", "transaction"]),
        ],
        [
          "Deployed at",
          readMetadataValue(metadata, [
            "deployedAt",
            "deployed_at",
            "timestamp",
          ]),
        ],
        [
          "Explorer",
          readMetadataValue(metadata, ["explorerUrl", "explorer", "url"]),
        ],
      ]);
      return;
    } catch {
      // Missing metadata is expected before deployment.
    }
  }

  for (const path of configCandidates) {
    try {
      const config = parseAnchorConfig(await fetchText(path));
      markNotDeployed(config);
      return;
    } catch {
      // Continue through optional config candidates.
    }
  }

  markNotDeployed();
}

form.addEventListener("input", updateLendingState);
updateLendingState();
loadDeploymentState();
