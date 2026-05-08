const views = new Map(
  [...document.querySelectorAll(".view")].map((view) => [view.dataset.view, view])
);

const announcer = document.querySelector("#announcer");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const svgNamespace = "http://www.w3.org/2000/svg";
const resumePdfUrl = "./assets/docs/%E5%86%B5%E7%90%AA%E7%91%B6%E7%AE%80%E5%8E%8620260507.pdf";
const resumePreviewUrl = "./assets/docs/resume-preview.png";
const resumeZoomConfig = { min: 0.7, max: 2.2, step: 0.15 };
const videoHostOverridesUrl = "./data/video-host-overrides.json";

const anchors = {
  home: 0,
  about: 1138,
  skills: 2512,
  contact: 15822,
};

const homeNavStops = [
  ["home", anchors.home],
  ["about", anchors.about],
  ["skills", anchors.skills],
  ["enterprise", 5062],
  ["aigc", 6226],
  ["campus", 11085],
  ["contact", anchors.contact],
];

const globalTabHomeTargets = {
  enterprise: 5062,
  aigc: 6226,
  campus: 11085,
};

const projectReturnTargets = {
  enterprise: { scrollY: 5062, navTarget: "enterprise", label: "返回首页企业项目位置" },
  aigc: { scrollY: 6226, navTarget: "aigc", label: "返回首页我是谁 demo 1 位置" },
  "aigc-whoami2": { scrollY: 7258, navTarget: "aigc", label: "返回首页我是谁 demo 2 位置" },
  "aigc-speech": { scrollY: 7966, navTarget: "aigc", label: "返回首页好好说话位置" },
  "aigc-yanyun": { scrollY: 8697, navTarget: "aigc", label: "返回首页燕云十六声位置" },
  "aigc-yansha": { scrollY: 9478, navTarget: "aigc", label: "返回首页宴杀位置" },
  campus: { scrollY: 11085, navTarget: "campus", label: "返回首页折纸心渊位置" },
  "campus-rice": { scrollY: 12250, navTarget: "campus", label: "返回首页稻田里位置" },
  "campus-popbob": { scrollY: 13320, navTarget: "campus", label: "返回首页 popbob 位置" },
  "campus-sound": { scrollY: 14405, navTarget: "campus", label: "返回首页声音行走位置" },
};

const navItemRects = [
  ["home", "主页", 0, 0, 101.03, 40],
  ["about", "关于我", 109.03, 0, 101.03, 40],
  ["skills", "能力图谱", 218.06, 0, 101.03, 40],
  ["enterprise", "企业项目", 327.09, 0, 94.75, 40],
  ["aigc", "AIGC视频", 429.84, 0, 94.75, 40],
  ["campus", "学校项目", 532.59, 0, 94.75, 40],
  ["contact", "联系我", 635.34, 0, 94.75, 40],
];

const navGroups = {
  home: [
    [596, 19],
    [596, 1134],
    [596, 2508],
    [596, 3819],
    [596, 5058],
    [596, 6222],
    [596, 11081],
    [647, 15507],
  ],
  enterprise: [[591, 57]],
  aigc: [[596, 57]],
  campus: [[596, 57]],
};

const contentHotspots = {
  home: [
    { target: "about", label: "跳转到关于我", x: 312, y: 668, width: 160, height: 48 },
    { target: "enterprise", label: "查看企业项目", x: 1250, y: 5829, width: 160, height: 48 },
    { target: "aigc", label: "查看我是谁 demo 1", x: 1159, y: 6983, width: 160, height: 48 },
    { target: "aigc-whoami2", label: "查看我是谁 demo 2", x: 268, y: 7635, width: 160, height: 48 },
    { target: "aigc-speech", label: "查看好好说话", x: 1175, y: 8394, width: 160, height: 48 },
    { target: "aigc-yanyun", label: "查看燕云十六声", x: 269, y: 9066, width: 160, height: 48 },
    { target: "aigc-yansha", label: "查看宴杀", x: 1170, y: 10681, width: 160, height: 48 },
    { target: "campus", label: "查看折纸心渊", x: 416, y: 11816, width: 160, height: 48 },
    { target: "campus-rice", label: "查看稻田里", x: 419, y: 12916, width: 160, height: 48 },
    { target: "campus-popbob", label: "查看 popbob", x: 419, y: 13952, width: 160, height: 48 },
    { target: "campus-sound", label: "查看声音行走", x: 428, y: 15053, width: 160, height: 48 },
  ],
  enterprise: [
    {
      target: "video:enterprise-compare",
      label: "观看完整竞品效果对比视频",
      x: 1057,
      y: 5331,
      width: 690,
      height: 268,
    },
  ],
};

const viewMoreTargets = new Set([
  "about",
  "enterprise",
  "aigc",
  "aigc-whoami2",
  "aigc-speech",
  "aigc-yanyun",
  "aigc-yansha",
  "campus",
  "campus-rice",
  "campus-popbob",
  "campus-sound",
]);

const professionalSkillSolidLineIds = new Set([
  "9:195",
  "9:197",
  "9:199",
  "9:201",
  "9:203",
  "9:205",
  "9:207",
  "9:209",
  "9:211",
  "9:213",
  "9:215",
  "9:217",
]);

const professionalSkillGraphOrigin = { x: 971, y: 3063 };
const competenceGraphLineIds = new Set(["9:296"]);
const competenceGraphOrigin = { x: 768.5, y: 4362.5 };
const transitionSafeLayerIds = new Set(["9:142", "9:143", "9:144"]);
const enterpriseDashedLineIds = new Set(["10:125", "10:126"]);
const homeAigcDashedLineIds = new Set(["9:628", "9:629", "9:630", "9:631"]);
const aigcWorkflowViewIds = new Set([
  "aigc",
  "aigc-whoami2",
  "aigc-speech",
  "aigc-yanyun",
  "aigc-yansha",
]);
const aigcWorkflowStepCenters = {
  default: [216, 590, 964, 1338, 1712],
  "aigc-yansha": [216, 466, 716, 966, 1215, 1464, 1713],
};

const videoLightboxItems = {
  "video:enterprise-compare": {
    title: "竞品效果对比（内部）",
    src: "./assets/videos/enterprise-compare.mp4",
  },
};

const sectionTransitions = {
  home: [
    {
      className: "hero-to-about",
      x: 0,
      y: 1020,
      width: 1920,
      height: 150,
    },
    {
      className: "about-to-skills",
      x: 0,
      y: 2316,
      width: 1920,
      height: 260,
    },
  ],
};

let activeViewName = "home";
let activeNavName = "home";
let transitionTimer = 0;
let textFitFrame = 0;
let sceneLabels = {};
let sceneHotspots = {};
let videoObserver;
let videoLightbox;
let videoLightboxReturnFocus;
let resumeLightbox;
let resumeLightboxReturnFocus;
let resumeZoom = 1;
let navLockTarget = "";
let navLockTimer = 0;
let skillGraphScrollHandler;
let competenceGraphScrollHandler;
let aigcWorkflowScrollHandlers = [];
let videoHostOverrides = {};

init();

async function init() {
  videoHostOverrides = await loadVideoHostOverrides();
  const sceneData = await loadSceneData();
  renderScenes(sceneData);
  renderGlobalTabBar();
  setupHotspots();
  setupSkillGraphAnimations();
  setupCompetenceGraphAnimations();
  setupAigcWorkflowAnimations();
  setupVideoObserver();
  setupScrollSpy();
  setupKeyboard();
  updateCurrentNav();
  announce("home");
}

async function loadSceneData() {
  const response = await fetch("./data/figma-scenes.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Unable to load Figma scene JSON: ${response.status}`);
  }

  return response.json();
}

async function loadVideoHostOverrides() {
  try {
    const response = await fetch(videoHostOverridesUrl, { cache: "no-store" });
    if (!response.ok) return {};
    const overrides = await response.json();
    return overrides && typeof overrides === "object" && !Array.isArray(overrides) ? overrides : {};
  } catch {
    return {};
  }
}

function resolveVideoSrc(src) {
  const externalSrc = typeof videoHostOverrides[src] === "string" ? videoHostOverrides[src].trim() : "";
  return externalSrc || src;
}

function renderScenes(sceneData) {
  sceneLabels = Object.fromEntries(sceneData.views.map((scene) => [scene.id, scene.label]));
  sceneHotspots = Object.fromEntries(sceneData.views.map((scene) => [scene.id, scene.hotspots || []]));

  for (const scene of sceneData.views) {
    const view = ensureView(scene);

    view.dataset.width = String(scene.width);
    view.dataset.height = String(scene.height);
    view.setAttribute("aria-label", scene.label);

    const frame = view.querySelector("[data-scene-root]");
    frame.style.setProperty("--frame-width", scene.width);
    frame.style.setProperty("--frame-height", scene.height);
    frame.replaceChildren();

    for (const layer of scene.layers) {
      frame.append(renderLayer(layer, scene));
    }

    addSectionTransitions(frame, scene);

    const hotspotLayer = document.createElement("div");
    hotspotLayer.className = "hotspot-layer";
    hotspotLayer.setAttribute("aria-label", `${scene.label}导航`);
    frame.append(hotspotLayer);
  }

  updateSceneScales();
  scheduleTextFit();
  document.fonts?.ready?.then(() => scheduleTextFit());
  window.addEventListener("resize", updateSceneScales, { passive: true });
}

function ensureView(scene) {
  const existing = views.get(scene.id);
  if (existing) return existing;

  const view = document.createElement("section");
  view.id = `view-${scene.id}`;
  view.className = "view";
  view.dataset.view = scene.id;
  view.tabIndex = -1;
  view.hidden = true;
  view.setAttribute("aria-label", scene.label);

  const frame = document.createElement("div");
  frame.className = "figma-frame";
  frame.dataset.sceneRoot = "";
  view.append(frame);

  document.querySelector("#portfolio").append(view);
  views.set(scene.id, view);
  return view;
}

function renderLayer(layer, scene) {
  if (layer.type === "image") {
    return renderImageLayer(layer, scene);
  }

  const element = createLayerElement(layer);

  setLayerClasses(element, `figma-layer ${layer.type}`);
  if (layer.className) element.classList.add(...layer.className.split(/\s+/).filter(Boolean));
  element.dataset.figmaName = layer.name || "";
  if (isRoundedChipLayer(layer)) element.dataset.roundedChip = "";
  markProfessionalSkillGraphLayer(element, layer, scene);
  markCompetenceGraphLayer(element, layer, scene);
  markTransitionSafeLayer(element, layer, scene);
  markEnterpriseDashedLine(element, layer, scene);
  markHomeAigcDashedLine(element, layer, scene);
  markAigcWorkflowLayer(element, layer, scene);
  setLayerBox(element, layer, scene);
  applyBlendMode(element, layer);

  if (layer.fill) element.style.setProperty("--layer-fill", layer.fill);
  if (layer.radius !== undefined) {
    element.style.setProperty("--layer-radius", `calc(${layer.radius}px * var(--scene-scale, 1))`);
  }

  if (layer.type === "text") {
    renderTextLayer(element, layer);
    if (layer.fontFamily) element.style.setProperty("--layer-font", fontStack(layer.fontFamily));
    element.style.setProperty("--layer-font-size", `${layer.fontSize || 16}px`);
    element.style.setProperty("--layer-font-weight", String(layer.fontWeight || 400));
    element.style.setProperty("--layer-line-height", String(layer.lineHeight || 1.35));
    element.style.setProperty("--layer-color", layer.color || "#111");
    element.style.setProperty("--layer-text-align", textAlign(layer.textAlign));
    if (layer.textAutoResize) element.dataset.textAutoResize = layer.textAutoResize.toLowerCase();
    if (layer.textAlignVertical) element.dataset.textAlignVertical = layer.textAlignVertical.toLowerCase();
  }

  if (layer.type === "video") {
    const hasPlayerControls = shouldUseVideoControls(layer, scene);
    queueVideoSource(element, resolveVideoSrc(layer.src), scene.id === "home");
    element.muted = !hasPlayerControls;
    element.defaultMuted = !hasPlayerControls;
    element.controls = hasPlayerControls;
    element.loop = !hasPlayerControls;
    element.playsInline = true;
    element.preload = scene.id === "home" && layer.name === "首页背景视频" ? "auto" : "metadata";
    if (layer.poster) element.poster = layer.poster;
    element.setAttribute("aria-label", hasPlayerControls ? `${layer.name || scene.label} 视频播放器` : layer.name || "video");
    if (layer.scaleMode) element.dataset.scaleMode = layer.scaleMode.toLowerCase();
    if (hasPlayerControls) element.dataset.playerControls = "";
    if (layer.autoplayWhenVisible && !hasPlayerControls) element.dataset.autoplayWhenVisible = "";
  }

  if (layer.type === "vector") {
    renderVectorLayer(element, layer);
  }

  if (layer.type === "line") {
    element.style.setProperty("--line-color", layer.color || "#111111");
    element.style.setProperty("--line-weight", `${layer.strokeWeight || 1}px`);
  }

  return element;
}

function renderImageLayer(layer, scene) {
  const mask = detailBackgroundMaskForLayer(layer, scene);
  if (mask) return renderMaskedImageLayer(layer, scene, mask);

  const img = document.createElement("div");
  img.className = "figma-layer image";
  img.dataset.scaleMode = (layer.scaleMode || "FILL").toLowerCase();
  img.dataset.figmaName = layer.name || "";
  applyLayerOpacity(img, layer);
  applyBlendMode(img, layer);
  if (layer.radius !== undefined) {
    img.style.setProperty("--layer-radius", `calc(${layer.radius}px * var(--scene-scale, 1))`);
  }

  const inner = document.createElement("img");
  inner.src = layer.src;
  inner.alt = "";
  inner.draggable = false;
  inner.decoding = "async";
  inner.loading = "lazy";
  if (layer.clipBox) {
    inner.classList.add("is-clipped-source");
    inner.style.left = `${((layer.x - layer.clipBox.x) / layer.clipBox.width) * 100}%`;
    inner.style.top = `${((layer.y - layer.clipBox.y) / layer.clipBox.height) * 100}%`;
    inner.style.width = `${(layer.width / layer.clipBox.width) * 100}%`;
    inner.style.height = `${(layer.height / layer.clipBox.height) * 100}%`;
  } else {
    applyImageTransform(inner, layer);
  }

  img.append(inner);
  setLayerBox(img, layer.clipBox || layer, scene);
  return img;
}

function renderMaskedImageLayer(layer, scene, mask) {
  const wrapper = document.createElement("div");
  wrapper.className = "figma-layer image detail-bg-mask";
  wrapper.dataset.figmaName = layer.name || "";
  applyBlendMode(wrapper, layer);
  wrapper.style.setProperty("--detail-mask-solid", `${(mask.solidStop || 0.6636937260627747) * 100}%`);
  if (mask.sourceNodeId) wrapper.dataset.figmaMaskSource = mask.sourceNodeId;
  setLayerBox(wrapper, mask, scene);

  const source = document.createElement("div");
  source.className = "detail-bg-source";
  source.dataset.scaleMode = (layer.scaleMode || "FILL").toLowerCase();
  source.style.left = `${((layer.x - mask.x) / mask.width) * 100}%`;
  source.style.top = `${((layer.y - mask.y) / mask.height) * 100}%`;
  source.style.width = `${(layer.width / mask.width) * 100}%`;
  source.style.height = `${(layer.height / mask.height) * 100}%`;

  if (Array.isArray(layer.transform)) {
    const [a, b, c, d] = layer.transform;
    source.style.transform = `matrix(${a}, ${b}, ${c}, ${d}, 0, 0)`;
    source.style.transformOrigin = "0 0";
  }

  const inner = document.createElement("img");
  inner.src = layer.src;
  inner.alt = "";
  inner.draggable = false;
  inner.decoding = "async";
  inner.loading = "lazy";
  applyImageTransform(inner, layer);

  source.append(inner);
  wrapper.append(source);
  return wrapper;
}

function detailBackgroundMaskForLayer(layer, scene) {
  if (layer.mask?.type !== "figma-alpha-mask") return null;
  return layer.mask;
}

function applyLayerOpacity(element, layer) {
  const opacity = Number(layer.opacity);
  if (Number.isFinite(opacity)) element.style.opacity = String(opacity);
}

function shouldUseVideoControls(layer, scene) {
  return layer.type === "video" && scene.id !== "home";
}

function applyBlendMode(element, layer) {
  const mode = cssBlendMode(layer.blendMode);
  if (mode) element.style.mixBlendMode = mode;
}

function cssBlendMode(blendMode) {
  const normalized = String(blendMode || "").toUpperCase();
  if (normalized === "SCREEN") return "screen";
  if (normalized === "MULTIPLY") return "multiply";
  if (normalized === "OVERLAY") return "overlay";
  if (normalized === "DARKEN") return "darken";
  if (normalized === "LIGHTEN") return "lighten";
  if (normalized === "COLOR_DODGE") return "color-dodge";
  if (normalized === "COLOR_BURN") return "color-burn";
  if (normalized === "HARD_LIGHT") return "hard-light";
  if (normalized === "SOFT_LIGHT") return "soft-light";
  if (normalized === "DIFFERENCE") return "difference";
  if (normalized === "EXCLUSION") return "exclusion";
  if (normalized === "HUE") return "hue";
  if (normalized === "SATURATION") return "saturation";
  if (normalized === "COLOR") return "color";
  if (normalized === "LUMINOSITY") return "luminosity";
  return "";
}

function addSectionTransitions(frame, scene) {
  for (const transition of sectionTransitions[scene.id] || []) {
    const element = transition.type === "video" ? document.createElement("video") : document.createElement("div");
    element.className = `section-transition section-transition-${transition.className}`;

    if (transition.type === "video") {
      queueVideoSource(element, resolveVideoSrc(transition.src), scene.id === "home");
      element.muted = true;
      element.loop = true;
      element.playsInline = true;
      element.preload = "metadata";
      element.dataset.autoplayWhenVisible = "";
      element.setAttribute("aria-hidden", "true");
    }

    setLayerBox(element, transition, scene);
    frame.append(element);
  }
}

function createLayerElement(layer) {
  if (layer.type === "video") return document.createElement("video");
  if (layer.type === "vector") return document.createElementNS(svgNamespace, "svg");
  return document.createElement("div");
}

function queueVideoSource(video, src, loadImmediately = false) {
  if (!src) return;
  video.dataset.src = src;
  if (loadImmediately) hydrateVideoSource(video);
}

function hydrateVideoSource(video) {
  const src = video.dataset.src;
  if (!src || video.getAttribute("src") === src) return;
  video.src = src;
  video.load();
}

function hydrateViewVideos(view) {
  view?.querySelectorAll("video[data-src]").forEach(hydrateVideoSource);
}

function renderVectorLayer(svg, layer) {
  const viewBox = layer.viewBox || [0, 0, layer.width, layer.height];
  svg.setAttribute("viewBox", viewBox.join(" "));
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");

  if (Array.isArray(layer.defs) && layer.defs.length) {
    const defs = document.createElementNS(svgNamespace, "defs");
    for (const def of layer.defs) {
      if (def.type !== "linearGradient") continue;

      const gradient = document.createElementNS(svgNamespace, "linearGradient");
      gradient.id = def.id;
      gradient.setAttribute("x1", String(def.x1));
      gradient.setAttribute("y1", String(def.y1));
      gradient.setAttribute("x2", String(def.x2));
      gradient.setAttribute("y2", String(def.y2));
      gradient.setAttribute("gradientUnits", "objectBoundingBox");

      for (const stop of def.stops || []) {
        const stopNode = document.createElementNS(svgNamespace, "stop");
        stopNode.setAttribute("offset", `${Number(stop.offset) * 100}%`);
        stopNode.setAttribute("stop-color", stop.color || "#111111");
        gradient.append(stopNode);
      }

      defs.append(gradient);
    }
    svg.append(defs);
  }

  const pathParent = document.createElementNS(svgNamespace, "g");
  if (competenceGraphLineIds.has(layer.sourceNodeId)) {
    pathParent.classList.add("competence-graph-vector-body");
  }

  for (const pathData of layer.paths || []) {
    const path = document.createElementNS(svgNamespace, "path");
    path.setAttribute("d", pathData.d);
    path.setAttribute("fill", pathData.fill || "#111111");
    path.setAttribute("fill-rule", pathData.fillRule || "nonzero");
    pathParent.append(path);
  }

  svg.append(pathParent);
}

function applyImageTransform(img, layer) {
  const transform = layer.imageTransform;
  if (!Array.isArray(transform) || !Array.isArray(transform[0]) || !Array.isArray(transform[1])) return;

  const scaleX = Number(transform[0][0]);
  const scaleY = Number(transform[1][1]);
  const offsetX = Number(transform[0][2]);
  const offsetY = Number(transform[1][2]);
  const hasSimpleCrop =
    Number.isFinite(scaleX) &&
    Number.isFinite(scaleY) &&
    Number.isFinite(offsetX) &&
    Number.isFinite(offsetY) &&
    Math.abs(transform[0][1] || 0) < 0.0001 &&
    Math.abs(transform[1][0] || 0) < 0.0001 &&
    scaleX > 0 &&
    scaleY > 0;

  if (!hasSimpleCrop) return;

  img.classList.add("is-transformed");
  img.style.width = `${100 / scaleX}%`;
  img.style.height = `${100 / scaleY}%`;
  img.style.left = `${(-offsetX / scaleX) * 100}%`;
  img.style.top = `${(-offsetY / scaleY) * 100}%`;
}

function renderTextLayer(element, layer) {
  const flow = document.createElement("span");
  flow.className = "text-flow";

  if (!Array.isArray(layer.runs) || !layer.runs.length) {
    flow.textContent = applyTextCase(layer.text || "", layer.textCase);
    element.replaceChildren(flow);
    return;
  }

  for (const run of layer.runs) {
    const span = document.createElement("span");
    span.textContent = applyTextCase(run.text || "", layer.textCase);
    if (run.fontFamily) span.style.fontFamily = fontStack(run.fontFamily);
    if (run.fontSize) {
      span.style.fontSize = `calc(${run.fontSize}px * var(--scene-scale, 1) * var(--text-fit-scale, 1))`;
    }
    if (run.fontWeight) span.style.fontWeight = String(run.fontWeight);
    if (run.lineHeight) span.style.lineHeight = String(run.lineHeight);
    if (run.color) span.style.color = run.color;
    flow.append(span);
  }

  element.replaceChildren(flow);
}

function applyTextCase(text, textCase) {
  if (textCase === "UPPER") return text.toUpperCase();
  if (textCase === "LOWER") return text.toLowerCase();
  return text;
}

function textAlign(align) {
  if (align === "CENTER") return "center";
  if (align === "RIGHT") return "right";
  return "left";
}

function fontStack(fontFamily) {
  const escaped = String(fontFamily).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return `"${escaped}", Arial, "PingFang SC", "Microsoft YaHei", sans-serif`;
}

function setLayerClasses(element, className) {
  element.setAttribute("class", className);
}

function isTransparentFill(fill) {
  if (!fill) return true;
  const value = String(fill).replace(/\s+/g, "").toLowerCase();
  return value === "transparent" || /^rgba\([^)]*,0(?:\.0+)?\)$/.test(value);
}

function isRoundedChipLayer(layer) {
  if (!["frame", "rectangle"].includes(layer.type)) return false;
  if (!isTransparentFill(layer.fill)) return false;
  if (Number(layer.radius) < 20) return false;
  return layer.width >= 45 && layer.width <= 260 && layer.height >= 25 && layer.height <= 70;
}

function markProfessionalSkillGraphLayer(element, layer, scene) {
  if (scene.id !== "home") return;
  if (!professionalSkillSolidLineIds.has(layer.sourceNodeId)) return;
  element.dataset.skillGraphSolidLine = "";
}

function markCompetenceGraphLayer(element, layer, scene) {
  if (scene.id !== "home") return;
  if (!competenceGraphLineIds.has(layer.sourceNodeId)) return;

  const origin = designPointToLayerPercent(competenceGraphOrigin, layer);
  element.dataset.competenceGraphLine = "";
  element.style.setProperty("--competence-origin-x", `${origin.x.toFixed(2)}%`);
  element.style.setProperty("--competence-origin-y", `${origin.y.toFixed(2)}%`);
}

function markTransitionSafeLayer(element, layer, scene) {
  if (scene.id !== "home") return;
  if (!transitionSafeLayerIds.has(layer.sourceNodeId)) return;
  element.dataset.transitionSafeLayer = "";
}

function markEnterpriseDashedLine(element, layer, scene) {
  if (scene.id !== "enterprise") return;
  if (!enterpriseDashedLineIds.has(layer.sourceNodeId)) return;
  element.dataset.enterpriseDashedLine = "";
}

function markHomeAigcDashedLine(element, layer, scene) {
  if (scene.id !== "home") return;
  if (!homeAigcDashedLineIds.has(layer.sourceNodeId)) return;
  element.dataset.homeAigcDashedLine = "";
}

function markAigcWorkflowLayer(element, layer, scene) {
  if (!aigcWorkflowViewIds.has(scene.id)) return;

  if (
    layer.name === "workflow connector line" ||
    String(layer.sourceNodeId || "").startsWith("workflow-connector-line-")
  ) {
    element.dataset.aigcWorkflowConnector = "";
    return;
  }

  if (layer.y < 2295 || layer.y > 2635) return;

  const centers = aigcWorkflowStepCenters[scene.id] || aigcWorkflowStepCenters.default;
  const centerX = layer.x + layer.width / 2;
  const stepIndex = nearestWorkflowStepIndex(centerX, centers);
  element.dataset.aigcWorkflowStep = String(stepIndex + 1);
  element.style.setProperty("--workflow-step-delay", `${stepIndex * 190}ms`);
}

function nearestWorkflowStepIndex(x, centers) {
  let closestIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  centers.forEach((center, index) => {
    const distance = Math.abs(center - x);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  return closestIndex;
}

function designPointToLayerPercent(point, layer) {
  let localX = point.x - layer.x;
  let localY = point.y - layer.y;

  if (Array.isArray(layer.transform)) {
    const [a, b, c, d] = layer.transform;
    const det = a * d - b * c;
    if (Math.abs(det) > 0.000001) {
      const dx = point.x - layer.x;
      const dy = point.y - layer.y;
      localX = (d * dx - c * dy) / det;
      localY = (-b * dx + a * dy) / det;
    }
  }

  return {
    x: (localX / layer.width) * 100,
    y: (localY / layer.height) * 100,
  };
}

function setLayerBox(element, layer, scene) {
  element.setAttribute("data-design-x", String(layer.x));
  element.setAttribute("data-design-y", String(layer.y));
  element.setAttribute("data-design-width", String(layer.width));
  element.setAttribute("data-design-height", String(layer.height));

  element.style.left = `${(layer.x / scene.width) * 100}%`;
  element.style.top = `${(layer.y / scene.height) * 100}%`;
  element.style.width = `${(layer.width / scene.width) * 100}%`;
  element.style.height = `${(layer.height / scene.height) * 100}%`;

  if (Array.isArray(layer.transform)) {
    const [a, b, c, d] = layer.transform;
    element.style.transform = `matrix(${a}, ${b}, ${c}, ${d}, 0, 0)`;
    element.style.transformOrigin = "0 0";
  }
}

function renderGlobalTabBar() {
  const existing = document.querySelector(".global-tabbar");
  if (existing) existing.remove();

  const nav = document.createElement("nav");
  nav.className = "global-tabbar";
  nav.setAttribute("aria-label", "作品集模块导航");

  const list = document.createElement("div");
  list.className = "global-tabbar-list";
  nav.append(list);

  const backButton = document.createElement("button");
  backButton.type = "button";
  backButton.className = "global-tab global-back-button";
  backButton.textContent = "返回";
  backButton.hidden = true;
  backButton.addEventListener("click", handleProjectBack);
  list.append(backButton);

  for (const [target, label] of navItemRects) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "global-tab";
    button.dataset.target = target;
    button.textContent = label;
    button.addEventListener("click", () => handleGlobalTabTarget(target));
    list.append(button);
  }

  document.body.append(nav);
}

function handleProjectBack() {
  const target = projectReturnTargets[activeViewName];
  if (!target) return;
  showView("home", target.scrollY, target.navTarget);
}

function addHotspot(layer, view, rect) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "hotspot";
  button.dataset.target = rect.target;
  button.dataset.hoverIntent = hotspotHoverIntent(rect);
  button.dataset.hoverShape = rect.width > 240 || rect.height > 90 ? "card" : "pill";
  button.textContent = rect.label;
  button.setAttribute("aria-label", rect.label);

  const width = Number(view.dataset.width);
  const height = Number(view.dataset.height);
  button.style.left = `${(rect.x / width) * 100}%`;
  button.style.top = `${(rect.y / height) * 100}%`;
  button.style.width = `${(rect.width / width) * 100}%`;
  button.style.height = `${(rect.height / height) * 100}%`;

  button.addEventListener("click", () => handleTarget(rect.target, rect.scrollY));
  bindViewMoreHover(button, view, rect);
  bindResumeHover(button, view, rect);
  layer.append(button);
}

function hotspotHoverIntent(rect) {
  if (rect.hoverIntent) return rect.hoverIntent;
  if (isResumeHotspot(rect)) return "resume";
  if (rect.label === "首页入口") return "none";
  if (isViewMoreHotspot(rect)) return "view-more";
  if (String(rect.target || "").startsWith("video:")) return "card";
  return "primary";
}

function bindViewMoreHover(button, view, rect) {
  if (!isViewMoreHotspot(rect)) return;

  const parts = viewMoreButtonParts(view, rect);
  parts.forEach((part) => part.dataset.viewMoreButtonPart = "");

  const setHovered = (active) => {
    parts.forEach((part) => part.classList.toggle("is-view-more-hovered", active));
  };

  button.addEventListener("mouseenter", () => setHovered(true));
  button.addEventListener("mouseleave", () => setHovered(false));
  button.addEventListener("focus", () => setHovered(true));
  button.addEventListener("blur", () => setHovered(false));
}

function bindResumeHover(button, view, rect) {
  if (!isResumeHotspot(rect)) return;

  const parts = resumeButtonParts(view, rect);
  parts.forEach((part) => part.dataset.resumeButtonPart = "");

  const setHovered = (active) => {
    parts.forEach((part) => part.classList.toggle("is-resume-hovered", active));
  };

  button.addEventListener("mouseenter", () => setHovered(true));
  button.addEventListener("mouseleave", () => setHovered(false));
  button.addEventListener("focus", () => setHovered(true));
  button.addEventListener("blur", () => setHovered(false));
}

function isViewMoreHotspot(rect) {
  const label = String(rect.label || "");
  const target = String(rect.target || "");
  const hasButtonSize = Number(rect.width) >= 140 && Number(rect.width) <= 180 && Number(rect.height) <= 60;
  return hasButtonSize && (viewMoreTargets.has(target) || label.startsWith("查看"));
}

function isResumeHotspot(rect) {
  return rect.target === "resume";
}

function viewMoreButtonParts(view, rect) {
  const frame = view.querySelector("[data-scene-root]");
  if (!frame) return [];

  const selector = [
    '.figma-layer[data-figma-name="Link"]',
    '.figma-layer[data-figma-name="view more"]',
    '.figma-layer[data-figma-name="contact me"]',
  ].join(", ");
  return [...frame.querySelectorAll(selector)].filter((layer) => overlapsDesignRect(layer, rect, 0.55));
}

function resumeButtonParts(view, rect) {
  const frame = view.querySelector("[data-scene-root]");
  if (!frame) return [];

  const selector = [
    '.figma-layer[data-figma-name="查看简历"]',
    ".figma-layer.frame",
    ".figma-layer.rectangle",
  ].join(", ");
  return [...frame.querySelectorAll(selector)].filter((layer) => {
    if (!overlapsDesignRect(layer, rect, 0.55)) return false;
    if (layer.dataset.figmaName === "查看简历") return true;

    const width = Number(layer.getAttribute("data-design-width"));
    const height = Number(layer.getAttribute("data-design-height"));
    return width >= 110 && width <= 170 && height >= 36 && height <= 58;
  });
}

function overlapsDesignRect(element, rect, minOverlapRatio = 0.5) {
  const x = Number(element.getAttribute("data-design-x"));
  const y = Number(element.getAttribute("data-design-y"));
  const width = Number(element.getAttribute("data-design-width"));
  const height = Number(element.getAttribute("data-design-height"));
  if (![x, y, width, height].every(Number.isFinite)) return false;

  const left = Math.max(x, rect.x);
  const right = Math.min(x + width, rect.x + rect.width);
  const top = Math.max(y, rect.y);
  const bottom = Math.min(y + height, rect.y + rect.height);
  const overlap = Math.max(0, right - left) * Math.max(0, bottom - top);
  const area = Math.max(1, width * height);
  return overlap / area >= minOverlapRatio;
}

function setupHotspots() {
  views.forEach((view, viewName) => {
    const layer = view.querySelector(".hotspot-layer");

    const generatedHotspots = sceneHotspots[viewName] || [];

    if (generatedHotspots.length) {
      for (const spot of generatedHotspots) addHotspot(layer, view, spot);
      const generatedTargets = new Set(generatedHotspots.map((spot) => spot.target));
      for (const spot of contentHotspots[viewName] || []) {
        if (!generatedTargets.has(spot.target)) addHotspot(layer, view, spot);
      }
      addResumeHotspots(layer, view);
      return;
    }

    for (const [navX, navY] of navGroupsFor(viewName)) {
      for (const [target, label, x, y, width, height] of navItemRects) {
        addHotspot(layer, view, {
          target,
          label,
          x: navX + 4 + x,
          y: navY + 4 + y,
          width,
          height,
        });
      }
    }

    for (const spot of contentHotspots[viewName] || []) {
      addHotspot(layer, view, spot);
    }

    addResumeHotspots(layer, view);
  });
}

function addResumeHotspots(layer, view) {
  const frame = view.querySelector("[data-scene-root]");
  if (!frame) return;

  frame.querySelectorAll('.figma-layer.text[data-figma-name="查看简历"]').forEach((textLayer) => {
    const rect = resumeButtonRectForText(view, textLayer);
    if (!rect) return;

    addHotspot(layer, view, {
      ...rect,
      target: "resume",
      label: "查看简历 PDF",
      hoverIntent: "resume",
    });
  });
}

function resumeButtonRectForText(view, textLayer) {
  const textRect = designRectFromElement(textLayer);
  if (!textRect) return null;

  const candidates = [...view.querySelectorAll(".figma-layer.frame, .figma-layer.rectangle")]
    .map((layer) => designRectFromElement(layer))
    .filter((rect) => {
      if (!rect) return false;
      return (
        rect.width >= 110 &&
        rect.width <= 170 &&
        rect.height >= 36 &&
        rect.height <= 58 &&
        rect.x <= textRect.x &&
        rect.y <= textRect.y &&
        rect.x + rect.width >= textRect.x + textRect.width &&
        rect.y + rect.height >= textRect.y + textRect.height
      );
    });

  return candidates[0] || {
    x: textRect.x - 30,
    y: textRect.y - 15,
    width: 138,
    height: 48,
  };
}

function designRectFromElement(element) {
  const x = Number(element.getAttribute("data-design-x"));
  const y = Number(element.getAttribute("data-design-y"));
  const width = Number(element.getAttribute("data-design-width"));
  const height = Number(element.getAttribute("data-design-height"));
  if (![x, y, width, height].every(Number.isFinite)) return null;
  return { x, y, width, height };
}

function navGroupsFor(viewName) {
  if (navGroups[viewName]) return navGroups[viewName];
  if (viewName.startsWith("aigc")) return navGroups.aigc;
  if (viewName.startsWith("campus")) return navGroups.campus;
  return [];
}

function handleGlobalTabTarget(target) {
  if (target in globalTabHomeTargets) {
    showView("home", globalTabHomeTargets[target], target, { lockNavDuringScroll: true });
    return;
  }

  if (target in anchors) {
    showView("home", anchors[target], target, { lockNavDuringScroll: true });
    return;
  }

  showView(target, 0, activeTargetForView(target), { immediateScroll: true });
}

function handleTarget(target, scrollY) {
  if (target === "resume") {
    openResumePdf();
    return;
  }

  if (target in videoLightboxItems) {
    openVideoLightbox(target);
    return;
  }

  if (Number.isFinite(scrollY)) {
    showView(target, scrollY, navTargetForScroll(target, scrollY));
    return;
  }

  if (target in anchors) {
    showView("home", anchors[target], target);
    return;
  }

  showView(target, 0, activeTargetForView(target));
}

function openResumePdf() {
  openResumeLightbox();
}

function showView(nextName, scrollY = 0, navTarget = activeTargetForView(nextName), options = {}) {
  if (!views.has(nextName)) return;

  const current = views.get(activeViewName);
  const next = views.get(nextName);
  const sameView = nextName === activeViewName;
  activeNavName = navTarget;
  updateCurrentNav();

  if (sameView) {
    if (options.lockNavDuringScroll) lockNavDuringScroll(navTarget);
    scrollToDesignY(next, scrollY, options.immediateScroll);
    announce(nextName);
    scheduleTextFit(next);
    return;
  }

  window.clearTimeout(transitionTimer);
  pauseAllVideos();

  next.hidden = false;
  hydrateViewVideos(next);
  updateSceneScaleForView(next);
  scheduleTextFit(next);
  next.classList.add("is-entering");
  current.classList.add("is-leaving");

  scrollToDesignY(next, scrollY, true);

  const finish = () => {
    current.hidden = true;
    current.classList.remove("is-active", "is-leaving");
    next.classList.remove("is-entering");
    next.classList.add("is-active");
    activeViewName = nextName;
    activeNavName = navTarget;
    next.focus({ preventScroll: true });
    updateCurrentNav();
    announce(nextName);
    scheduleTextFit(next);
    requestAnimationFrame(updateAutoplayVideos);
  };

  if (prefersReducedMotion.matches) {
    finish();
    return;
  }

  transitionTimer = window.setTimeout(finish, 540);
}

function scrollToDesignY(view, y, immediate = false) {
  const frame = view.querySelector(".figma-frame");
  const frameHeight = Number(view.dataset.height);
  const renderedHeight = frame.getBoundingClientRect().height;
  const nextTop = (y / frameHeight) * renderedHeight;
  const top = Math.max(0, nextTop);

  if (immediate || prefersReducedMotion.matches) {
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo({ top, behavior: "auto" });
    requestAnimationFrame(() => {
      root.style.scrollBehavior = previousScrollBehavior;
    });
    return;
  }

  window.scrollTo({ top, behavior: "smooth" });
}

function navTargetForScroll(viewName, scrollY) {
  if (viewName !== "home") return activeTargetForView(viewName);
  let current = homeNavStops[0][0];
  for (const [target, y] of homeNavStops) {
    if (scrollY + 1 < y) break;
    current = target;
  }
  return current;
}

function activeTargetForView(viewName) {
  if (viewName === "home") return "home";
  if (viewName.startsWith("aigc")) return "aigc";
  if (viewName.startsWith("campus")) return "campus";
  return viewName;
}

function setupScrollSpy() {
  let ticking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (ticking || activeViewName !== "home") return;
      ticking = true;
      window.requestAnimationFrame(() => {
        ticking = false;
        updateHomeNavFromScroll();
      });
    },
    { passive: true }
  );
}

function updateHomeNavFromScroll() {
  if (navLockTarget) return;

  const view = views.get("home");
  if (!view || view.hidden) return;

  const frame = view.querySelector(".figma-frame");
  const frameHeight = Number(view.dataset.height);
  const renderedHeight = frame.getBoundingClientRect().height;
  if (!frameHeight || !renderedHeight) return;

  const viewportOffset = (window.innerHeight || document.documentElement.clientHeight) * 0.24;
  const designY = ((window.scrollY + viewportOffset) / renderedHeight) * frameHeight;
  const scrollRoot = document.scrollingElement || document.documentElement;
  const isAtPageEnd = window.scrollY + window.innerHeight >= scrollRoot.scrollHeight - 4;
  const nextTarget = isAtPageEnd ? "contact" : navTargetForScroll("home", designY);
  if (nextTarget === activeNavName) return;

  activeNavName = nextTarget;
  updateCurrentNav();
}

function lockNavDuringScroll(navTarget) {
  navLockTarget = navTarget;
  window.clearTimeout(navLockTimer);

  const releaseLock = () => {
    if (navLockTarget !== navTarget) return;
    navLockTarget = "";
    updateHomeNavFromScroll();
  };

  if ("onscrollend" in window) {
    window.addEventListener("scrollend", releaseLock, { once: true });
  }

  navLockTimer = window.setTimeout(releaseLock, prefersReducedMotion.matches ? 0 : 1300);
}

function announce(viewName) {
  announcer.textContent = `${sceneLabels[viewName] || viewName}内容已更新`;
}

function ensureVideoLightbox() {
  if (videoLightbox) return videoLightbox;

  const dialog = document.createElement("div");
  dialog.className = "video-lightbox";
  dialog.hidden = true;
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-labelledby", "video-lightbox-title");

  const panel = document.createElement("div");
  panel.className = "video-lightbox-panel";

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "video-lightbox-close";
  closeButton.textContent = "返回";
  closeButton.setAttribute("aria-label", "关闭完整视频");
  closeButton.addEventListener("click", closeVideoLightbox);

  const title = document.createElement("h2");
  title.id = "video-lightbox-title";
  title.className = "video-lightbox-title";

  const video = document.createElement("video");
  video.className = "video-lightbox-player";
  video.controls = true;
  video.playsInline = true;
  video.preload = "metadata";

  panel.append(closeButton, title, video);
  dialog.append(panel);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeVideoLightbox();
  });

  document.body.append(dialog);
  videoLightbox = dialog;
  return dialog;
}

function openVideoLightbox(target) {
  const item = videoLightboxItems[target];
  if (!item) return;

  const dialog = ensureVideoLightbox();
  const title = dialog.querySelector(".video-lightbox-title");
  const video = dialog.querySelector(".video-lightbox-player");
  const closeButton = dialog.querySelector(".video-lightbox-close");

  videoLightboxReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  title.textContent = item.title;
  video.src = resolveVideoSrc(item.src);
  video.currentTime = 0;
  video.muted = false;
  dialog.hidden = false;
  document.body.classList.add("has-video-lightbox");
  pauseAllVideos();
  closeButton.focus({ preventScroll: true });

  const playPromise = video.play();
  if (playPromise?.catch) {
    playPromise.catch(() => {
      video.muted = true;
      video.play().catch(() => {});
    });
  }

  announcer.textContent = `${item.title}完整视频已打开`;
}

function closeVideoLightbox() {
  if (!videoLightbox || videoLightbox.hidden) return;

  const video = videoLightbox.querySelector(".video-lightbox-player");
  video.pause();
  video.removeAttribute("src");
  video.load();
  videoLightbox.hidden = true;
  document.body.classList.remove("has-video-lightbox");
  videoLightboxReturnFocus?.focus({ preventScroll: true });
  videoLightboxReturnFocus = null;
  announcer.textContent = "完整视频已关闭";
  requestAnimationFrame(updateAutoplayVideos);
}

function ensureResumeLightbox() {
  if (resumeLightbox) return resumeLightbox;

  const dialog = document.createElement("div");
  dialog.className = "resume-lightbox";
  dialog.hidden = true;
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-labelledby", "resume-lightbox-title");

  const panel = document.createElement("div");
  panel.className = "resume-lightbox-panel";

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "resume-lightbox-close";
  closeButton.textContent = "×";
  closeButton.setAttribute("aria-label", "关闭简历预览");
  closeButton.addEventListener("click", closeResumeLightbox);

  const downloadButton = document.createElement("a");
  downloadButton.className = "resume-lightbox-download";
  downloadButton.href = resumePdfUrl;
  downloadButton.download = "况琪瑶简历20260507.pdf";
  downloadButton.textContent = "下载";
  downloadButton.setAttribute("aria-label", "下载简历 PDF");

  const zoomControls = document.createElement("div");
  zoomControls.className = "resume-lightbox-zoom";
  zoomControls.setAttribute("aria-label", "简历缩放");

  const zoomOutButton = document.createElement("button");
  zoomOutButton.type = "button";
  zoomOutButton.className = "resume-lightbox-zoom-button";
  zoomOutButton.dataset.resumeZoomAction = "out";
  zoomOutButton.textContent = "−";
  zoomOutButton.setAttribute("aria-label", "缩小简历");
  zoomOutButton.addEventListener("click", () => changeResumeZoom(-resumeZoomConfig.step));

  const zoomValue = document.createElement("span");
  zoomValue.className = "resume-lightbox-zoom-value";
  zoomValue.textContent = "100%";

  const zoomInButton = document.createElement("button");
  zoomInButton.type = "button";
  zoomInButton.className = "resume-lightbox-zoom-button";
  zoomInButton.dataset.resumeZoomAction = "in";
  zoomInButton.textContent = "+";
  zoomInButton.setAttribute("aria-label", "放大简历");
  zoomInButton.addEventListener("click", () => changeResumeZoom(resumeZoomConfig.step));

  zoomControls.append(zoomOutButton, zoomValue, zoomInButton);

  const title = document.createElement("h2");
  title.id = "resume-lightbox-title";
  title.className = "sr-only";
  title.textContent = "况琪瑶简历预览";

  const scroll = document.createElement("div");
  scroll.className = "resume-lightbox-scroll";

  const image = document.createElement("img");
  image.className = "resume-lightbox-image";
  image.src = resumePreviewUrl;
  image.alt = "况琪瑶简历预览";
  image.draggable = false;

  scroll.append(image);
  panel.append(closeButton, downloadButton, zoomControls, title, scroll);
  dialog.append(panel);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeResumeLightbox();
  });
  window.addEventListener("resize", () => {
    if (resumeLightbox && !resumeLightbox.hidden) setResumeZoom(resumeZoom);
  }, { passive: true });

  document.body.append(dialog);
  resumeLightbox = dialog;
  return dialog;
}

function openResumeLightbox() {
  const dialog = ensureResumeLightbox();
  const closeButton = dialog.querySelector(".resume-lightbox-close");

  resumeLightboxReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  dialog.hidden = false;
  document.body.classList.add("has-resume-lightbox");
  setResumeZoom(1);
  closeButton.focus({ preventScroll: true });
  announcer.textContent = "简历预览已打开";
}

function changeResumeZoom(delta) {
  setResumeZoom(resumeZoom + delta, true);
}

function setResumeZoom(nextZoom, announceChange = false) {
  const dialog = ensureResumeLightbox();
  const panel = dialog.querySelector(".resume-lightbox-panel");
  const zoomValue = dialog.querySelector(".resume-lightbox-zoom-value");
  const zoomOutButton = dialog.querySelector('[data-resume-zoom-action="out"]');
  const zoomInButton = dialog.querySelector('[data-resume-zoom-action="in"]');
  const scroll = dialog.querySelector(".resume-lightbox-scroll");

  const previousZoom = resumeZoom;
  const centerXRatio = scroll && scroll.scrollWidth
    ? (scroll.scrollLeft + scroll.clientWidth / 2) / scroll.scrollWidth
    : 0.5;
  const centerYRatio = scroll && scroll.scrollHeight
    ? (scroll.scrollTop + scroll.clientHeight / 2) / scroll.scrollHeight
    : 0.5;

  resumeZoom = Math.min(resumeZoomConfig.max, Math.max(resumeZoomConfig.min, nextZoom));
  const baseWidth = baseResumePreviewWidth();
  const imageWidth = baseWidth * resumeZoom;
  const scrollWidth = Math.min(imageWidth, window.innerWidth * 0.92, 980);
  panel?.style.setProperty("--resume-image-width", `${imageWidth.toFixed(2)}px`);
  panel?.style.setProperty("--resume-scroll-width", `${scrollWidth.toFixed(2)}px`);
  if (zoomValue) zoomValue.textContent = `${Math.round(resumeZoom * 100)}%`;
  if (zoomOutButton) zoomOutButton.disabled = resumeZoom <= resumeZoomConfig.min + 0.001;
  if (zoomInButton) zoomInButton.disabled = resumeZoom >= resumeZoomConfig.max - 0.001;

  if (scroll && previousZoom !== resumeZoom) {
    requestAnimationFrame(() => {
      scroll.scrollLeft = scroll.scrollWidth * centerXRatio - scroll.clientWidth / 2;
      scroll.scrollTop = scroll.scrollHeight * centerYRatio - scroll.clientHeight / 2;
    });
  }

  if (announceChange) {
    announcer.textContent = `简历缩放比例 ${Math.round(resumeZoom * 100)}%`;
  }
}

function baseResumePreviewWidth() {
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 1440;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 900;
  const fitByHeight = viewportHeight * 0.88 * (1273 / 1800);
  return Math.min(viewportWidth * 0.92, 980, fitByHeight);
}

function closeResumeLightbox() {
  if (!resumeLightbox || resumeLightbox.hidden) return;

  resumeLightbox.hidden = true;
  document.body.classList.remove("has-resume-lightbox");
  resumeLightboxReturnFocus?.focus({ preventScroll: true });
  resumeLightboxReturnFocus = null;
  announcer.textContent = "简历预览已关闭";
}

function updateCurrentNav() {
  document.querySelectorAll("[aria-current]").forEach((button) => {
    button.removeAttribute("aria-current");
  });

  document.querySelectorAll(`[data-target="${activeNavTarget()}"]`).forEach((button) => {
    button.setAttribute("aria-current", "page");
  });

  const backButton = document.querySelector(".global-back-button");
  const tabbar = document.querySelector(".global-tabbar");
  const returnTarget = projectReturnTargets[activeViewName];
  if (backButton) {
    backButton.hidden = !returnTarget;
    backButton.setAttribute("aria-label", returnTarget?.label || "返回首页对应项目位置");
  }
  if (tabbar) tabbar.classList.toggle("has-back", Boolean(returnTarget));
}

function activeNavTarget() {
  return activeNavName;
}

function pauseAllVideos() {
  document.querySelectorAll("video").forEach((video) => {
    video.pause();
    video.classList.remove("is-playing");
    if (video.dataset.autoplayWhenVisible !== undefined && Number.isFinite(video.duration)) {
      video.currentTime = 0;
    }
  });
}

async function playVisibleVideo(video) {
  hydrateVideoSource(video);
  try {
    await video.play();
    video.classList.add("is-playing");
  } catch {
    video.classList.remove("is-playing");
  }
}

function updateAutoplayVideos() {
  document.querySelectorAll("video[data-autoplay-when-visible]").forEach((video) => {
    const owningView = video.closest(".view");
    const visible = owningView?.dataset.view === activeViewName && isElementVisible(video, 0.25);

    if (visible) {
      playVisibleVideo(video);
    } else {
      video.pause();
      video.classList.remove("is-playing");
    }
  });
}

function isElementVisible(element, threshold) {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
  const visibleWidth = Math.max(0, Math.min(rect.right, viewportWidth) - Math.max(rect.left, 0));
  const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
  const visibleArea = visibleWidth * visibleHeight;
  const totalArea = rect.width * rect.height;
  return totalArea > 0 && visibleArea / totalArea >= threshold;
}

function setupVideoObserver() {
  const videos = document.querySelectorAll("video[data-autoplay-when-visible]");
  if (!videos.length) return;

  videoObserver?.disconnect();
  videoObserver = new IntersectionObserver(
    () => updateAutoplayVideos(),
    { threshold: [0, 0.35, 0.75] }
  );

  videos.forEach((video) => videoObserver.observe(video));
  requestAnimationFrame(updateAutoplayVideos);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      pauseAllVideos();
    } else {
      updateAutoplayVideos();
    }
  });
}

function setupSkillGraphAnimations() {
  const lines = [...document.querySelectorAll("#view-home [data-skill-graph-solid-line]")];
  if (!lines.length) return;

  if (skillGraphScrollHandler) {
    window.removeEventListener("scroll", skillGraphScrollHandler);
    window.removeEventListener("resize", skillGraphScrollHandler);
  }

  const revealLines = () => {
    lines.forEach((line) => {
      line.style.setProperty("--skill-line-delay", "0ms");
      line.classList.add("is-skill-graph-visible");
    });
  };

  if (prefersReducedMotion.matches) {
    revealLines();
    return;
  }

  let revealed = false;
  const revealStartY = professionalSkillGraphOrigin.y - 180;

  skillGraphScrollHandler = () => {
    if (revealed) return;

    const homeView = views.get("home");
    const frame = homeView?.querySelector(".figma-frame");
    const frameHeight = Number(homeView?.dataset.height);
    const renderedHeight = frame?.getBoundingClientRect().height || 0;
    if (!homeView || homeView.hidden || !frameHeight || !renderedHeight) return;

    const viewportProbe = window.scrollY + (window.innerHeight || document.documentElement.clientHeight) * 0.72;
    const designProbeY = (viewportProbe / renderedHeight) * frameHeight;
    if (designProbeY < revealStartY) return;

    revealed = true;
    revealLines();
    window.removeEventListener("scroll", skillGraphScrollHandler);
    window.removeEventListener("resize", skillGraphScrollHandler);
    skillGraphScrollHandler = null;
  };

  window.addEventListener("scroll", skillGraphScrollHandler, { passive: true });
  window.addEventListener("resize", skillGraphScrollHandler, { passive: true });
  requestAnimationFrame(skillGraphScrollHandler);
}

function setupCompetenceGraphAnimations() {
  const lines = [...document.querySelectorAll("#view-home [data-competence-graph-line]")];
  if (!lines.length) return;

  if (competenceGraphScrollHandler) {
    window.removeEventListener("scroll", competenceGraphScrollHandler);
    window.removeEventListener("resize", competenceGraphScrollHandler);
  }

  const revealLines = () => {
    lines.forEach((line) => line.classList.add("is-competence-graph-visible"));
  };

  if (prefersReducedMotion.matches) {
    revealLines();
    return;
  }

  let revealed = false;
  const revealStartY = competenceGraphOrigin.y - 330;

  competenceGraphScrollHandler = () => {
    if (revealed) return;

    const homeView = views.get("home");
    const frame = homeView?.querySelector(".figma-frame");
    const frameHeight = Number(homeView?.dataset.height);
    const renderedHeight = frame?.getBoundingClientRect().height || 0;
    if (!homeView || homeView.hidden || !frameHeight || !renderedHeight) return;

    const viewportProbe = window.scrollY + (window.innerHeight || document.documentElement.clientHeight) * 0.56;
    const designProbeY = (viewportProbe / renderedHeight) * frameHeight;
    if (designProbeY < revealStartY) return;

    revealed = true;
    revealLines();
    window.removeEventListener("scroll", competenceGraphScrollHandler);
    window.removeEventListener("resize", competenceGraphScrollHandler);
    competenceGraphScrollHandler = null;
  };

  window.addEventListener("scroll", competenceGraphScrollHandler, { passive: true });
  window.addEventListener("resize", competenceGraphScrollHandler, { passive: true });
  requestAnimationFrame(competenceGraphScrollHandler);
}

function setupAigcWorkflowAnimations() {
  aigcWorkflowScrollHandlers.forEach((handler) => {
    window.removeEventListener("scroll", handler);
    window.removeEventListener("resize", handler);
  });
  aigcWorkflowScrollHandlers = [];

  aigcWorkflowViewIds.forEach((viewId) => {
    const view = views.get(viewId);
    const connector = view?.querySelector("[data-aigc-workflow-connector]");
    const steps = [...(view?.querySelectorAll("[data-aigc-workflow-step]") || [])];
    if (!view || (!connector && !steps.length)) return;

    const revealWorkflow = () => {
      connector?.classList.add("is-aigc-workflow-visible");
      steps.forEach((step) => step.classList.add("is-aigc-workflow-visible"));
    };

    if (prefersReducedMotion.matches) {
      revealWorkflow();
      return;
    }

    let revealed = false;
    const revealStartY = 2210;
    const handler = () => {
      if (revealed || view.hidden) return;

      const frame = view.querySelector(".figma-frame");
      const frameHeight = Number(view.dataset.height);
      const renderedHeight = frame?.getBoundingClientRect().height || 0;
      if (!frameHeight || !renderedHeight) return;

      const viewportProbe = window.scrollY + (window.innerHeight || document.documentElement.clientHeight) * 0.66;
      const designProbeY = (viewportProbe / renderedHeight) * frameHeight;
      if (designProbeY < revealStartY) return;

      revealed = true;
      revealWorkflow();
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
      aigcWorkflowScrollHandlers = aigcWorkflowScrollHandlers.filter((item) => item !== handler);
    };

    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler, { passive: true });
    aigcWorkflowScrollHandlers.push(handler);
    requestAnimationFrame(handler);
  });
}

function updateSceneScales() {
  views.forEach((view) => {
    updateSceneScaleForView(view);
  });
  scheduleTextFit();
}

function updateSceneScaleForView(view) {
  if (!view || view.hidden) return;

  const frame = view.querySelector(".figma-frame");
  const width = Number(view.dataset.width) || 1920;
  const renderedWidth = frame.getBoundingClientRect().width;
  if (renderedWidth > 0) {
    frame.style.setProperty("--scene-scale", String(renderedWidth / width));
  }
}

function scheduleTextFit(scope = views.get(activeViewName)) {
  window.cancelAnimationFrame(textFitFrame);
  textFitFrame = window.requestAnimationFrame(() => fitTextLayers(scope));
}

function fitTextLayers(scope = document) {
  const root = scope || document;
  root.querySelectorAll(".figma-layer.text").forEach(fitTextLayer);
}

function fitTextLayer(element) {
  const owningView = element.closest(".view");
  if (owningView?.hidden) return;

  const flow = element.querySelector(".text-flow");
  if (!flow) return;

  element.style.setProperty("--text-fit-scale", "1");

  const maxWidth = element.clientWidth;
  const maxHeight = element.clientHeight;
  if (maxWidth <= 0 || maxHeight <= 0) return;

  const contentWidth = Math.max(flow.scrollWidth, element.scrollWidth);
  const contentHeight = Math.max(flow.scrollHeight, element.scrollHeight);
  const widthScale = contentWidth > maxWidth + 1 ? maxWidth / contentWidth : 1;
  const heightScale = contentHeight > maxHeight + 1 ? maxHeight / contentHeight : 1;
  const scale = Math.max(0.52, Math.min(1, widthScale, heightScale));

  if (scale < 0.999) {
    element.style.setProperty("--text-fit-scale", scale.toFixed(4));
  }
}

function setupKeyboard() {
  document.addEventListener("keydown", (event) => {
    if (event.altKey || event.metaKey || event.ctrlKey) return;

    if (event.key === "Escape" && videoLightbox && !videoLightbox.hidden) {
      event.preventDefault();
      closeVideoLightbox();
      return;
    }

    if (event.key === "Escape" && resumeLightbox && !resumeLightbox.hidden) {
      event.preventDefault();
      closeResumeLightbox();
      return;
    }

    if (resumeLightbox && !resumeLightbox.hidden && ["+", "=", "-", "_"].includes(event.key)) {
      event.preventDefault();
      changeResumeZoom(event.key === "-" || event.key === "_" ? -resumeZoomConfig.step : resumeZoomConfig.step);
      return;
    }

    if (event.key === "Escape" && activeViewName !== "home") {
      event.preventDefault();
      showView("home", 0);
    }
  });
}
