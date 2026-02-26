import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs";

mermaid.initialize({
  startOnLoad: false,
  securityLevel: "strict",
  theme: "base",
  flowchart: {
    htmlLabels: false
  },
  themeVariables: {
    fontFamily: "IBM Plex Sans",
    primaryColor: "#eef6ff",
    primaryBorderColor: "#0059c9",
    primaryTextColor: "#0f172a",
    secondaryColor: "#edf9f2",
    tertiaryColor: "#fffaf1",
    lineColor: "#425466"
  }
});

const ROOT_ONLY_TYPES = new Set([
  "ACTIVITY_TYPE_UPDATE_ROOT_QUORUM",
  "ACTIVITY_TYPE_SET_ORGANIZATION_FEATURE",
  "ACTIVITY_TYPE_REMOVE_ORGANIZATION_FEATURE"
]);

const ACTIONS_BY_RESOURCE = {
  WALLET: ["SIGN", "CREATE", "UPDATE", "DELETE"],
  PRIVATE_KEY: ["SIGN", "EXPORT", "UPDATE", "DELETE"],
  POLICY: ["CREATE", "UPDATE", "DELETE"],
  USER: ["CREATE", "UPDATE", "DELETE"],
  ORGANIZATION: ["UPDATE"]
};

const ROOT_QUORUMS = {
  q_1_1: { need: 1, total: 1, label: "1/1" },
  q_2_3: { need: 2, total: 3, label: "2/3" },
  q_3_5: { need: 3, total: 5, label: "3/5" },
  q_5_7: { need: 5, total: 7, label: "5/7" }
};

const PRESET_NAMES = {
  treasury_transfers: "Treasury transfer controls",
  key_export_controls: "Private key export controls",
  policy_admin_controls: "Policy administration controls",
  user_admin_controls: "User administration controls"
};

const PRESET_CONFIGS = {
  treasury_transfers: {
    scopeMode: "resourceAction",
    resource: "WALLET",
    action: "SIGN",
    chain: "eth",
    consensusMode: "approverCount",
    minApprovers: "2",
    allowlistMode: "treasury_allowlist",
    extraAllowPreset: "none",
    riskProfile: "balanced",
    denyDeleteMode: "auto",
    ethDenyMode: "blocklist_and_cap",
    ethCapPreset: "wei_1e18",
    extraDenyPreset: "none",
    rootQuorumProfile: "q_2_3",
    rootSoloMode: "none",
    rootIdentity: "user_root_primary",
    policySplitMode: "auto",
    contextProfile: "wallet_private_key",
    implicitNotesMode: "show"
  },
  key_export_controls: {
    scopeMode: "resourceAction",
    resource: "PRIVATE_KEY",
    action: "EXPORT",
    chain: "none",
    consensusMode: "userTag",
    userTagPreset: "security",
    allowlistMode: "none",
    extraAllowPreset: "require_webauthn",
    riskProfile: "conservative",
    denyDeleteMode: "always",
    ethDenyMode: "none",
    ethCapPreset: "none",
    extraDenyPreset: "deny_wallet_delete",
    rootQuorumProfile: "q_3_5",
    rootSoloMode: "none",
    rootIdentity: "user_root_primary",
    policySplitMode: "always",
    contextProfile: "user_credential",
    implicitNotesMode: "show"
  },
  policy_admin_controls: {
    scopeMode: "activityType",
    activityType: "ACTIVITY_TYPE_DELETE_POLICY_V3",
    chain: "none",
    consensusMode: "userTag",
    userTagPreset: "security",
    allowlistMode: "none",
    extraAllowPreset: "two_approvers_plus_treasury_tag",
    riskProfile: "conservative",
    denyDeleteMode: "always",
    ethDenyMode: "none",
    ethCapPreset: "none",
    extraDenyPreset: "deny_policy_delete_activity",
    rootQuorumProfile: "q_3_5",
    rootSoloMode: "break_glass_tag",
    rootIdentity: "user_ciso",
    policySplitMode: "always",
    contextProfile: "policy_org",
    implicitNotesMode: "show"
  },
  user_admin_controls: {
    scopeMode: "resourceAction",
    resource: "USER",
    action: "UPDATE",
    chain: "none",
    consensusMode: "userTag",
    userTagPreset: "ops",
    allowlistMode: "none",
    extraAllowPreset: "none",
    riskProfile: "balanced",
    denyDeleteMode: "auto",
    ethDenyMode: "none",
    ethCapPreset: "none",
    extraDenyPreset: "none",
    rootQuorumProfile: "q_2_3",
    rootSoloMode: "none",
    rootIdentity: "user_root_primary",
    policySplitMode: "auto",
    contextProfile: "user_credential",
    implicitNotesMode: "show"
  }
};

const ALLOWLIST_OPTIONS_ETH = [
  { value: "none", label: "No ETH allowlist filter" },
  { value: "known_counterparties", label: "Known counterparties allowlist" },
  { value: "treasury_allowlist", label: "Treasury destinations only" },
  { value: "stablecoin_issuers", label: "Stablecoin issuer addresses only" }
];

const ALLOWLIST_OPTIONS_NON_ETH = [
  { value: "none", label: "No chain-specific allowlist (non-ETH profile)" }
];

const ETH_DENY_OPTIONS_ETH = [
  { value: "none", label: "None" },
  { value: "blocklist", label: "Deny blocklisted ETH recipients" },
  { value: "blocklist_and_cap", label: "Deny blocklisted recipients + value cap" }
];

const ETH_DENY_OPTIONS_NON_ETH = [
  { value: "none", label: "Disabled (non-ETH profile)" }
];

const ETH_CAP_OPTIONS_ETH = [
  { value: "none", label: "No ETH value cap" },
  { value: "wei_500m", label: "0.5 ETH cap (5e17 wei)" },
  { value: "wei_1e18", label: "1 ETH cap (1e18 wei)" },
  { value: "wei_5e18", label: "5 ETH cap (5e18 wei)" },
  { value: "wei_1e19", label: "10 ETH cap (1e19 wei)" }
];

const ETH_CAP_OPTIONS_NON_ETH = [
  { value: "none", label: "Disabled (non-ETH profile)" }
];

const ETH_CAP_WEI = {
  wei_500m: "500000000000000000",
  wei_1e18: "1000000000000000000",
  wei_5e18: "5000000000000000000",
  wei_1e19: "10000000000000000000"
};

const ALLOWLIST_EXPRESSIONS = {
  known_counterparties: "eth.tx.to in ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222']",
  treasury_allowlist: "eth.tx.to in ['0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb']",
  stablecoin_issuers: "eth.tx.to in ['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', '0xdac17f958d2ee523a2206206994597c13d831ec7']"
};

const EXTRA_ALLOW_EXPRESSIONS = {
  none: "",
  require_webauthn: "credentials.any(credential, credential.type == 'CREDENTIAL_TYPE_WEBAUTHN')",
  two_approvers_plus_treasury_tag: "approvers.count() >= 2 && approvers.any(user, user.tags.contains('treasury'))",
  three_approvers: "approvers.count() >= 3"
};

const EXTRA_DENY_EXPRESSIONS = {
  none: "",
  deny_policy_delete_activity: "activity.type == 'ACTIVITY_TYPE_DELETE_POLICY_V3'",
  deny_org_feature_changes: "activity.type == 'ACTIVITY_TYPE_SET_ORGANIZATION_FEATURE' || activity.type == 'ACTIVITY_TYPE_REMOVE_ORGANIZATION_FEATURE'",
  deny_wallet_delete: "activity.resource == 'WALLET' && activity.action == 'DELETE'"
};

const CONTEXT_PROFILE_LABELS = {
  wallet_private_key: "wallet + private_key",
  policy_org: "policy + organization",
  user_credential: "user + credential",
  none: "single context"
};

const COMMON_SCENARIOS = [
  {
    id: "daily_treasury_payments",
    name: "Daily treasury payments",
    description: "Regular non-root signing with 2 approvers, allowlisted ETH destinations, and value cap.",
    meta: "WALLET.SIGN | ETH | balanced",
    preset: "treasury_transfers",
    overrides: {
      minApprovers: "2",
      rootQuorumProfile: "q_2_3",
      riskProfile: "balanced",
      denyDeleteMode: "auto",
      ethDenyMode: "blocklist_and_cap",
      ethCapPreset: "wei_1e18",
      rootSoloMode: "none"
    }
  },
  {
    id: "high_value_treasury_transfer",
    name: "High-value treasury transfer",
    description: "Tighter quorum and conservative guardrails for high-stakes movement.",
    meta: "WALLET.SIGN | ETH | conservative",
    preset: "treasury_transfers",
    overrides: {
      minApprovers: "3",
      rootQuorumProfile: "q_3_5",
      riskProfile: "conservative",
      denyDeleteMode: "always",
      ethDenyMode: "blocklist_and_cap",
      ethCapPreset: "wei_500m",
      policySplitMode: "always"
    }
  },
  {
    id: "key_export_incident",
    name: "Private key export incident",
    description: "Export path restricted to security-tag approvers and strong credential checks.",
    meta: "PRIVATE_KEY.EXPORT | non-ETH | conservative",
    preset: "key_export_controls",
    overrides: {
      consensusMode: "userTag",
      userTagPreset: "security",
      riskProfile: "conservative",
      rootQuorumProfile: "q_3_5",
      rootSoloMode: "none"
    }
  },
  {
    id: "policy_change_lockdown",
    name: "Policy change lockdown",
    description: "Strict controls around policy deletion and organization-level modifications.",
    meta: "ACTIVITY_TYPE_DELETE_POLICY_V3 | conservative",
    preset: "policy_admin_controls",
    overrides: {
      scopeMode: "activityType",
      activityType: "ACTIVITY_TYPE_DELETE_POLICY_V3",
      riskProfile: "conservative",
      denyDeleteMode: "always",
      extraDenyPreset: "deny_policy_delete_activity",
      rootQuorumProfile: "q_3_5"
    }
  },
  {
    id: "user_lifecycle_ops",
    name: "User lifecycle operations",
    description: "Ops-focused user update flow with moderate risk posture.",
    meta: "USER.UPDATE | non-ETH | balanced",
    preset: "user_admin_controls",
    overrides: {
      scopeMode: "resourceAction",
      resource: "USER",
      action: "UPDATE",
      consensusMode: "userTag",
      userTagPreset: "ops",
      riskProfile: "balanced",
      rootSoloMode: "none"
    }
  },
  {
    id: "break_glass_recovery",
    name: "Break-glass recovery",
    description: "Emergency mode with break-glass override and stricter root quorum.",
    meta: "Root-sensitive activity | emergency",
    preset: "policy_admin_controls",
    overrides: {
      scopeMode: "activityType",
      activityType: "ACTIVITY_TYPE_UPDATE_ROOT_QUORUM",
      rootQuorumProfile: "q_5_7",
      rootSoloMode: "break_glass_tag",
      policySplitMode: "always",
      contextProfile: "policy_org"
    }
  }
];

const form = document.getElementById("wizardForm");
const statusEl = document.getElementById("status");
const prescriptionOutEl = document.getElementById("prescriptionOutput");
const rationaleOutEl = document.getElementById("rationaleOutput");
const policyOutEl = document.getElementById("policyOutput");
const mermaidOutEl = document.getElementById("mermaidOutput");
const previewEl = document.getElementById("preview");
const reviewOutEl = document.getElementById("reviewOutput");
const scenarioGridEl = document.getElementById("scenarioGrid");
const stepCounterEl = document.getElementById("stepCounter");
const progressFillEl = document.getElementById("progressFill");
const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");
const generateBtn = document.getElementById("generateBtn");

const steps = Array.from(document.querySelectorAll(".wizard-step"));
const lastStep = steps.length - 1;
let currentStep = 0;

function cleanLabel(value, fallback = "") {
  const text = String(value || fallback)
    .replace(/"/g, "'")
    .replace(/>=/g, " gte ")
    .replace(/<=/g, " lte ")
    .replace(/>/g, " gt ")
    .replace(/</g, " lt ")
    .replace(/\s+/g, " ")
    .trim();
  return text || fallback;
}

function shorten(text, max = 74) {
  const safe = cleanLabel(text, "");
  if (safe.length <= max) {
    return safe;
  }
  return `${safe.slice(0, max - 3)}...`;
}

function setStatus(text, type = "") {
  statusEl.textContent = text;
  statusEl.className = `status ${type}`.trim();
}

function setSelectOptions(select, options) {
  const currentValue = select.value;
  select.innerHTML = "";
  options.forEach((option) => {
    const el = document.createElement("option");
    el.value = option.value;
    el.textContent = option.label;
    select.appendChild(el);
  });
  const values = options.map((opt) => opt.value);
  if (values.includes(currentValue)) {
    select.value = currentValue;
  } else if (options.length > 0) {
    select.value = options[0].value;
  }
}

function setSelectValue(id, value) {
  const select = document.getElementById(id);
  if (!select || value === undefined || value === null) {
    return;
  }
  const hasOption = Array.from(select.options).some((option) => option.value === value);
  if (hasOption) {
    select.value = value;
  }
}

function applyPresetConfig(presetKey, overrides = {}) {
  const baseConfig = PRESET_CONFIGS[presetKey];
  if (!baseConfig) {
    return;
  }
  const config = { ...baseConfig, ...overrides };
  setSelectValue("policyPreset", presetKey);

  if (config.scopeMode) {
    setSelectValue("scopeMode", config.scopeMode);
  }
  syncScopeModeFields();

  if (config.resource) {
    setSelectValue("resource", config.resource);
  }
  syncScopeActionOptions();

  if (config.action) {
    setSelectValue("action", config.action);
  }
  if (config.activityType) {
    setSelectValue("activityType", config.activityType);
  }
  if (config.chain) {
    setSelectValue("chain", config.chain);
  }
  syncChainDependentOptions();

  if (config.consensusMode) {
    setSelectValue("consensusMode", config.consensusMode);
  }
  syncConsensusOptions();

  if (config.minApprovers) {
    setSelectValue("minApprovers", config.minApprovers);
  }
  if (config.userIdPreset) {
    setSelectValue("userIdPreset", config.userIdPreset);
  }
  if (config.userTagPreset) {
    setSelectValue("userTagPreset", config.userTagPreset);
  }
  if (config.credentialType) {
    setSelectValue("credentialType", config.credentialType);
  }
  if (config.allowlistMode) {
    setSelectValue("allowlistMode", config.allowlistMode);
  }
  if (config.extraAllowPreset) {
    setSelectValue("extraAllowPreset", config.extraAllowPreset);
  }
  if (config.riskProfile) {
    setSelectValue("riskProfile", config.riskProfile);
  }
  if (config.denyDeleteMode) {
    setSelectValue("denyDeleteMode", config.denyDeleteMode);
  }
  if (config.ethDenyMode) {
    setSelectValue("ethDenyMode", config.ethDenyMode);
  }
  syncChainDependentOptions();

  if (config.ethCapPreset) {
    setSelectValue("ethCapPreset", config.ethCapPreset);
  }
  if (config.extraDenyPreset) {
    setSelectValue("extraDenyPreset", config.extraDenyPreset);
  }
  if (config.rootQuorumProfile) {
    setSelectValue("rootQuorumProfile", config.rootQuorumProfile);
  }
  if (config.rootSoloMode) {
    setSelectValue("rootSoloMode", config.rootSoloMode);
  }
  syncRootOptions();

  if (config.rootIdentity) {
    setSelectValue("rootIdentity", config.rootIdentity);
  }
  if (config.policySplitMode) {
    setSelectValue("policySplitMode", config.policySplitMode);
  }
  if (config.contextProfile) {
    setSelectValue("contextProfile", config.contextProfile);
  }
  if (config.implicitNotesMode) {
    setSelectValue("implicitNotesMode", config.implicitNotesMode);
  }
}

function renderCommonScenarios() {
  if (!scenarioGridEl) {
    return;
  }

  scenarioGridEl.innerHTML = "";
  COMMON_SCENARIOS.forEach((scenario) => {
    const card = document.createElement("div");
    card.className = "scenario-card";
    card.innerHTML = `
      <p class="scenario-title">${scenario.name}</p>
      <p class="scenario-desc">${scenario.description}</p>
      <p class="scenario-meta">${scenario.meta}</p>
      <button class="secondary scenario-apply" type="button" data-scenario-id="${scenario.id}">Apply Scenario</button>
    `;
    scenarioGridEl.appendChild(card);
  });

  scenarioGridEl.querySelectorAll("[data-scenario-id]").forEach((button) => {
    button.addEventListener("click", async () => {
      const scenario = COMMON_SCENARIOS.find((item) => item.id === button.dataset.scenarioId);
      if (!scenario) {
        return;
      }
      applyPresetConfig(scenario.preset, scenario.overrides || {});
      syncDependentDropdowns();
      const data = collectInput();
      const built = buildPolicies(data);
      if (currentStep === lastStep) {
        reviewOutEl.textContent = buildReviewText(data, built);
      }
      await generatePrescription();
      setStatus(`Applied scenario: ${scenario.name}`, "ok");
    });
  });
}

function getRootQuorum(profile) {
  return ROOT_QUORUMS[profile] || ROOT_QUORUMS.q_2_3;
}

function scopeCondition(data) {
  if (data.scopeMode === "activityType") {
    return `activity.type == '${data.activityType}'`;
  }
  return `activity.resource == '${data.resource}' && activity.action == '${data.action}'`;
}

function buildConsensusExpression(data) {
  if (data.consensusMode === "userId") {
    return `approvers.any(user, user.id == '${data.userIdPreset}')`;
  }
  if (data.consensusMode === "userTag") {
    return `approvers.any(user, user.tags.contains('${data.userTagPreset}'))`;
  }
  if (data.consensusMode === "credentialType") {
    return `credentials.any(credential, credential.type == '${data.credentialType}')`;
  }
  return `approvers.count() >= ${data.minApprovers}`;
}

function collectInput() {
  const rootQuorum = getRootQuorum(document.getElementById("rootQuorumProfile").value);
  return {
    policyPreset: document.getElementById("policyPreset").value,
    policyName: PRESET_NAMES[document.getElementById("policyPreset").value],
    scopeMode: document.getElementById("scopeMode").value,
    resource: document.getElementById("resource").value,
    action: document.getElementById("action").value,
    activityType: document.getElementById("activityType").value,
    chain: document.getElementById("chain").value,
    consensusMode: document.getElementById("consensusMode").value,
    minApprovers: parseInt(document.getElementById("minApprovers").value, 10),
    userIdPreset: document.getElementById("userIdPreset").value,
    userTagPreset: document.getElementById("userTagPreset").value,
    credentialType: document.getElementById("credentialType").value,
    allowlistMode: document.getElementById("allowlistMode").value,
    extraAllowPreset: document.getElementById("extraAllowPreset").value,
    riskProfile: document.getElementById("riskProfile").value,
    denyDeleteMode: document.getElementById("denyDeleteMode").value,
    ethDenyMode: document.getElementById("ethDenyMode").value,
    ethCapPreset: document.getElementById("ethCapPreset").value,
    extraDenyPreset: document.getElementById("extraDenyPreset").value,
    rootQuorumProfile: document.getElementById("rootQuorumProfile").value,
    rootNeed: rootQuorum.need,
    rootTotal: rootQuorum.total,
    rootQuorumLabel: rootQuorum.label,
    rootSoloMode: document.getElementById("rootSoloMode").value,
    rootIdentity: document.getElementById("rootIdentity").value,
    policySplitMode: document.getElementById("policySplitMode").value,
    contextProfile: document.getElementById("contextProfile").value,
    implicitNotesMode: document.getElementById("implicitNotesMode").value
  };
}

function buildAllowCondition(data) {
  const conditions = [scopeCondition(data)];
  if (data.chain === "eth" && data.allowlistMode !== "none") {
    conditions.push(ALLOWLIST_EXPRESSIONS[data.allowlistMode]);
  }
  const extraAllow = EXTRA_ALLOW_EXPRESSIONS[data.extraAllowPreset];
  if (extraAllow) {
    conditions.push(extraAllow);
  }
  return conditions.filter(Boolean).join(" && ");
}

function buildPolicies(data) {
  const rootOnly = data.scopeMode === "activityType" && ROOT_ONLY_TYPES.has(data.activityType);
  const allowCondition = buildAllowCondition(data);
  const consensusExpression = buildConsensusExpression(data);
  const policies = [];
  const notes = [];

  if (!rootOnly) {
    policies.push({
      policyName: `${data.policyName} - Allow`,
      effect: "EFFECT_ALLOW",
      consensus: consensusExpression,
      condition: allowCondition
    });
  } else {
    notes.push(`Selected activity.type (${data.activityType}) is root-quorum-governed and bypasses policy checks.`);
  }

  let denyDelete = false;
  if (data.denyDeleteMode === "always") {
    denyDelete = true;
  } else if (data.denyDeleteMode === "auto") {
    denyDelete = data.riskProfile === "conservative";
    if (denyDelete) {
      notes.push("Auto delete guardrail resolved to deny DELETE due to conservative risk profile.");
    }
  }

  if (denyDelete) {
    policies.push({
      policyName: `${data.policyName} - Deny delete`,
      effect: "EFFECT_DENY",
      condition: "activity.action == 'DELETE'"
    });
  }

  if (data.chain === "eth" && (data.ethDenyMode === "blocklist" || data.ethDenyMode === "blocklist_and_cap")) {
    policies.push({
      policyName: `${data.policyName} - Deny ETH blocklist`,
      effect: "EFFECT_DENY",
      condition: "eth.tx.to in ['0xdeaddeaddeaddeaddeaddeaddeaddeaddead0001', '0xdeaddeaddeaddeaddeaddeaddeaddeaddead0002']"
    });
  }

  if (data.chain === "eth" && data.ethDenyMode === "blocklist_and_cap" && data.ethCapPreset !== "none") {
    policies.push({
      policyName: `${data.policyName} - Deny high ETH value`,
      effect: "EFFECT_DENY",
      condition: `eth.tx.value > ${ETH_CAP_WEI[data.ethCapPreset]}`
    });
  }

  const extraDeny = EXTRA_DENY_EXPRESSIONS[data.extraDenyPreset];
  if (extraDeny) {
    policies.push({
      policyName: `${data.policyName} - Deny preset`,
      effect: "EFFECT_DENY",
      condition: extraDeny
    });
  }

  if (data.rootSoloMode === "root_user") {
    policies.push({
      policyName: `${data.policyName} - Root named override`,
      effect: "EFFECT_ALLOW",
      consensus: `approvers.any(user, user.id == '${data.rootIdentity}')`,
      condition: scopeCondition(data)
    });
    notes.push(`Named root override policy included for ${data.rootIdentity}.`);
  } else if (data.rootSoloMode === "break_glass_tag") {
    policies.push({
      policyName: `${data.policyName} - Break-glass override`,
      effect: "EFFECT_ALLOW",
      consensus: "approvers.any(user, user.tags.contains('break-glass'))",
      condition: scopeCondition(data)
    });
    notes.push("Break-glass tag override policy included.");
  }

  let splitRequired = false;
  if (data.policySplitMode === "always") {
    splitRequired = true;
  } else if (data.policySplitMode === "auto") {
    splitRequired = data.contextProfile !== "none";
  }

  if (splitRequired) {
    notes.push(`Split policies recommended by context profile: ${CONTEXT_PROFILE_LABELS[data.contextProfile]}.`);
  }

  return {
    rootOnly,
    splitRequired,
    allowCondition,
    consensusExpression,
    policies,
    notes
  };
}

function buildPrescriptionText(data, built) {
  const denyPolicies = built.policies.filter((p) => p.effect === "EFFECT_DENY");
  const lines = [];

  lines.push(`Prescription for "${data.policyName}"`);
  lines.push("");
  lines.push("1) Base allow model");
  if (built.rootOnly) {
    lines.push(`- Selected activity (${data.activityType}) follows root quorum path and bypasses policy checks.`);
  } else {
    lines.push(`- EFFECT_ALLOW consensus: ${built.consensusExpression}`);
    lines.push(`- EFFECT_ALLOW condition: ${built.allowCondition}`);
  }

  lines.push("");
  lines.push("2) Deny guardrail package");
  if (denyPolicies.length === 0) {
    lines.push("- No explicit deny policies from current dropdowns; rely on allow match + implicit deny fallback.");
  } else {
    denyPolicies.forEach((policy, idx) => {
      lines.push(`- ${idx + 1}. ${policy.policyName}: ${policy.condition}`);
    });
  }

  lines.push("");
  lines.push("3) Root governance strategy");
  lines.push(`- Root quorum: ${data.rootQuorumLabel}`);
  if (data.rootSoloMode === "root_user") {
    lines.push(`- Root solo policy: named user ${data.rootIdentity}`);
  } else if (data.rootSoloMode === "break_glass_tag") {
    lines.push("- Root solo policy: break-glass tag allowed");
  } else {
    lines.push("- Root solo policy: disabled");
  }

  lines.push("");
  lines.push("4) Expression safety strategy");
  lines.push(`- Policy split mode: ${data.policySplitMode}`);
  lines.push(`- Context profile: ${CONTEXT_PROFILE_LABELS[data.contextProfile]}`);
  lines.push(`- Split required by current decisions: ${built.splitRequired ? "Yes" : "No"}`);

  if (built.notes.length > 0) {
    lines.push("");
    lines.push("Advisories:");
    built.notes.forEach((note) => lines.push(`- ${note}`));
  }

  return lines.join("\n");
}

function buildRationaleText(data, built) {
  const denyCount = built.policies.filter((policy) => policy.effect === "EFFECT_DENY").length;
  const allowCount = built.policies.filter((policy) => policy.effect === "EFFECT_ALLOW").length;
  const lines = [];

  lines.push("Decision rationale:");
  lines.push(`- Policy domain preset selected: ${data.policyName}.`);
  lines.push(`- Scope selected: ${data.scopeMode === "activityType" ? data.activityType : `${data.resource}.${data.action}`}.`);
  lines.push(`- Consensus was translated to: ${built.consensusExpression}.`);
  lines.push(`- Generated policy count: ${allowCount} allow, ${denyCount} deny.`);
  lines.push(`- Root path uses quorum ${data.rootQuorumLabel} with override mode: ${data.rootSoloMode}.`);
  lines.push(`- Split policy strategy resolved to: ${built.splitRequired ? "split recommended" : "single policy set acceptable"}.`);

  if (built.notes.length > 0) {
    lines.push("- Additional advisories:");
    built.notes.forEach((note) => lines.push(`  - ${note}`));
  }

  return lines.join("\n");
}

function buildMermaid(data, built) {
  const scopeLabel = data.scopeMode === "activityType"
    ? `Scope: activity.type == ${data.activityType}`
    : `Scope: ${data.resource} + ${data.action}`;
  const denyCount = built.policies.filter((p) => p.effect === "EFFECT_DENY").length;
  const rootOverrideKind = data.rootSoloMode === "root_user"
    ? `named root (${data.rootIdentity})`
    : data.rootSoloMode === "break_glass_tag"
      ? "break-glass tag"
      : "none";
  const implicitNote = data.implicitNotesMode === "show"
    ? '  Implicit["Implicit permissions may still exist for some own-resource operations"]\n  EvalEntry -.-> Implicit\n'
    : "";

  return `flowchart TD
  Start["User attempts to execute activity"] --> IsRoot{"Requester is Root user?"}

  subgraph RootPath["Root requester path"]
  IsRoot -->|Yes| RootGoverned{"Activity is root-governed?"}
  RootGoverned -->|Yes| RootQuorum{"Root quorum met: ${data.rootQuorumLabel}?"}
  RootQuorum -->|Yes| OutRoot["OUTCOME_ALLOW via root quorum"]
  RootQuorum -->|No| OutRootBlocked["OUTCOME_DENY or PENDING quorum not met"]

  RootGoverned -->|No| RootOverride{"Root override policy configured?"}
  RootOverride -->|Yes| RootOverrideMatch{"Root override matched?"}
  RootOverrideMatch -->|Yes| OutRootOverride["OUTCOME_ALLOW via root override"]
  RootOverrideMatch -->|No| EvalEntry["Policy engine evaluation path"]
  RootOverride -->|No| EvalEntry
  end

  subgraph NonRootPath["Non-root requester path"]
  IsRoot -->|No| NonRootCheck{"Activity is root-governed?"}
  NonRootCheck -->|Yes| OutNonRootRootOnly["OUTCOME_DENY root-governed path requires root quorum"]
  NonRootCheck -->|No| EvalEntry
  end

  subgraph PolicyEngine["Policy engine evaluation path"]
  EvalEntry --> DenyCheck{"Any matching EFFECT_DENY?"}
  DenyCheck -->|Yes| OutDeny["OUTCOME_DENY (deny wins)"]
  DenyCheck -->|No| AllowCheck{"Any EFFECT_ALLOW match?"}
  AllowCheck -->|Yes| OutAllow["OUTCOME_ALLOW"]
  AllowCheck -->|No| OutImplicit["OUTCOME_DENY (implicit deny)"]
  end

  Config["Scope: ${shorten(scopeLabel)}\\nConsensus: ${shorten(built.consensusExpression)}\\nDeny policies: ${denyCount}\\nRoot override: ${rootOverrideKind}\\nSplit mode: ${data.policySplitMode}"] -.-> Start
${implicitNote}
  classDef allow fill:#e8f8ef,stroke:#0b7a4f,color:#0f2f1f;
  classDef deny fill:#ffeaea,stroke:#b91c1c,color:#4e1212;
  classDef neutral fill:#eef5ff,stroke:#0059c9,color:#0f1f33;
  class OutAllow,OutRoot,OutRootOverride allow;
  class OutDeny,OutImplicit,OutRootBlocked,OutNonRootRootOnly deny;
  class Start,IsRoot,RootGoverned,RootQuorum,RootOverride,RootOverrideMatch,NonRootCheck,EvalEntry,DenyCheck,AllowCheck,Config neutral;`;
}

function getText(id) {
  const select = document.getElementById(id);
  return select.options[select.selectedIndex]?.textContent || select.value;
}

function buildReviewText(data, built) {
  return [
    `Policy domain: ${getText("policyPreset")}`,
    `Scope mode: ${getText("scopeMode")}`,
    `Scope target: ${data.scopeMode === "activityType" ? data.activityType : `${data.resource} + ${data.action}`}`,
    `Chain profile: ${getText("chain")}`,
    `Consensus model: ${getText("consensusMode")}`,
    `Allowlist mode: ${getText("allowlistMode")}`,
    `Risk profile: ${getText("riskProfile")}`,
    `Delete guardrail: ${getText("denyDeleteMode")}`,
    `Root quorum: ${data.rootQuorumLabel}`,
    `Root override mode: ${getText("rootSoloMode")}`,
    `Split strategy: ${getText("policySplitMode")}`,
    `Estimated deny policies: ${built.policies.filter((p) => p.effect === "EFFECT_DENY").length}`
  ].join("\n");
}

function syncScopeActionOptions() {
  const resource = document.getElementById("resource").value;
  const actionSelect = document.getElementById("action");
  const actions = ACTIONS_BY_RESOURCE[resource] || ["UPDATE"];
  const options = actions.map((action) => ({ value: action, label: action }));
  setSelectOptions(actionSelect, options);
}

function syncChainDependentOptions() {
  const chain = document.getElementById("chain").value;
  const allowlistSelect = document.getElementById("allowlistMode");
  const ethDenySelect = document.getElementById("ethDenyMode");
  const ethCapSelect = document.getElementById("ethCapPreset");

  if (chain === "eth") {
    setSelectOptions(allowlistSelect, ALLOWLIST_OPTIONS_ETH);
    setSelectOptions(ethDenySelect, ETH_DENY_OPTIONS_ETH);
    allowlistSelect.disabled = false;
    ethDenySelect.disabled = false;
  } else {
    setSelectOptions(allowlistSelect, ALLOWLIST_OPTIONS_NON_ETH);
    setSelectOptions(ethDenySelect, ETH_DENY_OPTIONS_NON_ETH);
    allowlistSelect.disabled = true;
    ethDenySelect.disabled = true;
  }

  if (chain === "eth" && ethDenySelect.value === "blocklist_and_cap") {
    setSelectOptions(ethCapSelect, ETH_CAP_OPTIONS_ETH);
    ethCapSelect.disabled = false;
  } else if (chain === "eth") {
    setSelectOptions(ethCapSelect, ETH_CAP_OPTIONS_ETH);
    ethCapSelect.value = "none";
    ethCapSelect.disabled = true;
  } else {
    setSelectOptions(ethCapSelect, ETH_CAP_OPTIONS_NON_ETH);
    ethCapSelect.disabled = true;
  }
}

function syncConsensusOptions() {
  const consensusMode = document.getElementById("consensusMode").value;
  document.getElementById("approverCountWrap").classList.toggle("hidden", consensusMode !== "approverCount");
  document.getElementById("userIdWrap").classList.toggle("hidden", consensusMode !== "userId");
  document.getElementById("userTagWrap").classList.toggle("hidden", consensusMode !== "userTag");
  document.getElementById("credentialTypeWrap").classList.toggle("hidden", consensusMode !== "credentialType");
}

function syncScopeModeFields() {
  const scopeMode = document.getElementById("scopeMode").value;
  document.getElementById("resourceActionWrap").classList.toggle("hidden", scopeMode !== "resourceAction");
  document.getElementById("activityTypeWrap").classList.toggle("hidden", scopeMode !== "activityType");
}

function syncRootOptions() {
  const rootSoloMode = document.getElementById("rootSoloMode").value;
  const rootIdentity = document.getElementById("rootIdentity");
  const rootIdentityField = rootIdentity.closest(".field");
  const showIdentity = rootSoloMode === "root_user";
  rootIdentityField.classList.toggle("hidden", !showIdentity);
  rootIdentity.disabled = !showIdentity;
}

function syncDependentDropdowns() {
  syncScopeModeFields();
  syncScopeActionOptions();
  syncChainDependentOptions();
  syncConsensusOptions();
  syncRootOptions();
}

function showStep(index) {
  currentStep = Math.max(0, Math.min(lastStep, index));
  steps.forEach((step, idx) => {
    step.classList.toggle("active", idx === currentStep);
  });

  stepCounterEl.textContent = `Question ${currentStep + 1} of ${steps.length}`;
  progressFillEl.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
  backBtn.disabled = currentStep === 0;
  nextBtn.classList.toggle("hidden", currentStep === lastStep);
  generateBtn.classList.toggle("hidden", currentStep !== lastStep);

  const data = collectInput();
  const built = buildPolicies(data);
  if (currentStep === lastStep) {
    reviewOutEl.textContent = buildReviewText(data, built);
  }
}

function validateStep() {
  setStatus("Step validated.", "ok");
  return true;
}

async function renderMermaid(mermaidCode) {
  const graphId = `turnkey-${Date.now()}`;
  const { svg } = await mermaid.render(graphId, mermaidCode);
  previewEl.innerHTML = svg;
}

async function generatePrescription() {
  const data = collectInput();
  const built = buildPolicies(data);
  const prescription = buildPrescriptionText(data, built);
  const rationale = buildRationaleText(data, built);
  const mermaidCode = buildMermaid(data, built);

  const bundle = {
    generatedAt: new Date().toISOString(),
    wizardMode: "dropdown_only",
    rootQuorum: `${data.rootNeed}/${data.rootTotal}`,
    rootQuorumGovernedTypes: Array.from(ROOT_ONLY_TYPES),
    summary: {
      policyDomain: data.policyName,
      scopeMode: data.scopeMode,
      scope: data.scopeMode === "activityType" ? data.activityType : `${data.resource}.${data.action}`,
      chainProfile: data.chain,
      consensus: built.consensusExpression,
      allowCondition: built.allowCondition,
      splitRequired: built.splitRequired
    },
    policies: built.policies,
    notes: built.notes
  };

  prescriptionOutEl.textContent = prescription;
  rationaleOutEl.textContent = rationale;
  policyOutEl.textContent = JSON.stringify(bundle, null, 2);
  mermaidOutEl.textContent = mermaidCode;

  try {
    await renderMermaid(mermaidCode);
    if (built.notes.length > 0) {
      setStatus(`Prescription generated with ${built.notes.length} advisory note(s).`, "warn");
    } else {
      setStatus("Prescription generated.", "ok");
    }
  } catch (error) {
    previewEl.innerHTML = "";
    setStatus(`Mermaid render error: ${error.message}`, "error");
  }
}

function copyText(text, successMessage) {
  if (!text || !text.trim()) {
    setStatus("Nothing to copy yet. Generate prescription first.", "error");
    return;
  }
  navigator.clipboard.writeText(text).then(
    () => setStatus(successMessage, "ok"),
    () => setStatus("Clipboard copy failed. Copy directly from output panel.", "error")
  );
}

async function downloadMermaidPng() {
  const svgEl = previewEl.querySelector("svg");
  if (!svgEl) {
    setStatus("No Mermaid diagram found. Generate prescription first.", "error");
    return;
  }
  setStatus("Preparing PNG download...", "ok");

  const clonedSvg = svgEl.cloneNode(true);
  clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  let width = parseFloat(clonedSvg.getAttribute("width"));
  let height = parseFloat(clonedSvg.getAttribute("height"));

  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    const viewBox = svgEl.viewBox && svgEl.viewBox.baseVal ? svgEl.viewBox.baseVal : null;
    if (viewBox && viewBox.width > 0 && viewBox.height > 0) {
      width = viewBox.width;
      height = viewBox.height;
    } else {
      const rect = svgEl.getBoundingClientRect();
      width = rect.width || 1200;
      height = rect.height || 800;
    }
  }

  clonedSvg.setAttribute("width", String(width));
  clonedSvg.setAttribute("height", String(height));

  const svgString = new XMLSerializer().serializeToString(clonedSvg);
  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);
  const image = new Image();

  image.onload = () => {
    const scale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      URL.revokeObjectURL(svgUrl);
      setStatus("PNG export failed: canvas context unavailable.", "error");
      return;
    }

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(svgUrl);

    try {
      canvas.toBlob((pngBlob) => {
        if (!pngBlob) {
          setStatus("PNG export failed: could not create image blob.", "error");
          return;
        }

        const policySlug = (collectInput().policyName || "turnkey-policy")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        const filename = `${policySlug || "turnkey-policy"}-logic-flow.png`;

        const pngUrl = URL.createObjectURL(pngBlob);
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(pngUrl);
        setStatus(`PNG downloaded: ${filename}`, "ok");
      }, "image/png");
    } catch {
      setStatus("PNG export failed due to browser security constraints. Try again after regenerating the diagram.", "error");
    }
  };

  image.onerror = () => {
    URL.revokeObjectURL(svgUrl);
    setStatus("PNG export failed: unable to load rendered SVG.", "error");
  };

  image.src = svgUrl;
}

backBtn.addEventListener("click", () => {
  showStep(currentStep - 1);
});

nextBtn.addEventListener("click", () => {
  if (!validateStep()) {
    return;
  }
  showStep(currentStep + 1);
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  await generatePrescription();
});

form.addEventListener("change", async (event) => {
  if (event.target && event.target.id === "policyPreset") {
    applyPresetConfig(event.target.value);
  }
  syncDependentDropdowns();
  const data = collectInput();
  const built = buildPolicies(data);
  if (currentStep === lastStep) {
    reviewOutEl.textContent = buildReviewText(data, built);
  }
  await generatePrescription();
});

document.getElementById("copyPrescription").addEventListener("click", () => {
  copyText(prescriptionOutEl.textContent, "Prescription copied.");
});
document.getElementById("copyPolicies").addEventListener("click", () => {
  copyText(policyOutEl.textContent, "Policy JSON copied.");
});
document.getElementById("copyMermaid").addEventListener("click", () => {
  copyText(mermaidOutEl.textContent, "Mermaid copied.");
});
document.getElementById("downloadPng").addEventListener("click", () => {
  downloadMermaidPng();
});

renderCommonScenarios();
applyPresetConfig(document.getElementById("policyPreset").value);
syncDependentDropdowns();
showStep(0);
generatePrescription();
