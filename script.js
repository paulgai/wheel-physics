const root = document.documentElement;
const appShell = document.querySelector(".app-shell");
const settingsPanelToggle = document.querySelector("#settings-panel-toggle");
const resultsPanelToggle = document.querySelector("#results-panel-toggle");
const themeButtons = document.querySelectorAll("[data-theme]");
const fullscreenButton = document.querySelector("#toggle-fullscreen");
const zoomInButton = document.querySelector("#zoom-in");
const zoomOutButton = document.querySelector("#zoom-out");
const resetViewButton = document.querySelector("#reset-view");
const physicsInfoButton = document.querySelector("#show-physics-info");
const physicsInfoDialog = document.querySelector("#physics-info-dialog");
const closePhysicsInfoButton = document.querySelector("#close-physics-info");
const restartButton = document.querySelector("#restart-simulation");
const stepBackwardButton = document.querySelector("#step-backward");
const playButton = document.querySelector("#play-simulation");
const pauseButton = document.querySelector("#pause-simulation");
const stepForwardButton = document.querySelector("#step-forward");

const APP_ZOOM_LEVELS = [0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2];
const PIXELS_PER_METER = 55;
const FRAME_STEP = 0.01;
const EVENT_EPSILON = 1e-9;
const MAX_TRACE_SAMPLES = 720;
const CHART_SAMPLE_COUNT = 120;
const CHART_BOUNDS = Object.freeze({
  left: 36,
  right: 230,
  top: 12,
  bottom: 115,
});

const radiusRange = document.querySelector("#radius-range");
const radiusNumber = document.querySelector("#radius-number");
const rhoRange = document.querySelector("#rho-range");
const rhoNumber = document.querySelector("#rho-number");
const rhoMaximum = document.querySelector("#rho-maximum");
const massRange = document.querySelector("#mass-range");
const massNumber = document.querySelector("#mass-number");
const omegaRange = document.querySelector("#omega-range");
const omegaNumber = document.querySelector("#omega-number");
const alphaRange = document.querySelector("#alpha-range");
const alphaNumber = document.querySelector("#alpha-number");
const showGeometryCheckbox = document.querySelector("#show-geometry");
const showVectorsCheckbox = document.querySelector("#show-vectors");
const showTranslationalVelocityCheckbox = document.querySelector(
  "#show-translational-velocity",
);
const showRotationalVelocityCheckbox = document.querySelector(
  "#show-rotational-velocity",
);
const showTracesCheckbox = document.querySelector("#show-traces");
const simulationViewport = document.querySelector("#simulation-viewport");
const diskScene = document.querySelector("#disk-scene");
const simulationWorld = document.querySelector("#simulation-world");
const groundFill = document.querySelector("#ground-fill");
const groundLine = document.querySelector("#ground-line");
const groundMarkers = document.querySelector("#ground-markers");
const diskRotor = document.querySelector("#disk-rotor");
const diskBody = document.querySelector("#disk-body");
const diskRingOuter = document.querySelector("#disk-ring-outer");
const diskRingInner = document.querySelector("#disk-ring-inner");
const rotationMarkers = Array.from(
  document.querySelectorAll(".rotation-markers line:not(.marker-accent)"),
);
const markerAccent = document.querySelector("#marker-accent");
const centerDot = document.querySelector("#center-dot");
const centerLabel = document.querySelector("#center-label");
const pointA = document.querySelector("#point-a");
const pointADot = pointA.querySelector(".point-a-dot");
const pointAHit = pointA.querySelector(".point-a-hit");
const pointALabel = document.querySelector("#point-a-label");
const radiusGuide = document.querySelector("#radius-guide");
const geometryLayer = document.querySelector("#geometry-layer");
const verticalReference = document.querySelector("#vertical-reference");
const thetaCurrentArc = document.querySelector("#theta-current-arc");
const thetaCurrentHead = document.querySelector("#theta-current-head");
const rhoLabel = document.querySelector("#rho-label");
const thetaCurrentLabel = document.querySelector("#theta-current-label");
const traceLayer = document.querySelector("#trace-layer");
const traceGlow = document.querySelector("#trace-glow");
const tracePath = document.querySelector("#trace-path");
const vectorsLayer = document.querySelector("#vectors-layer");
const velocityVectorsLayer = document.querySelector("#velocity-vectors-layer");
const accelerationVectorsLayer = document.querySelector(
  "#acceleration-vectors-layer",
);
const velocityVector = document.querySelector("#vector-velocity");
const velocityVectorHead = document.querySelector("#vector-velocity-head");
const velocityLabel = document.querySelector("#velocity-label");
const translationAVector = document.querySelector("#vector-translation-a");
const translationAVectorHead = document.querySelector(
  "#vector-translation-a-head",
);
const translationALabel = document.querySelector("#translation-a-label");
const translationCenterVector = document.querySelector(
  "#vector-translation-center",
);
const translationCenterVectorHead = document.querySelector(
  "#vector-translation-center-head",
);
const translationCenterLabel = document.querySelector(
  "#translation-center-label",
);
const totalVelocityVector = document.querySelector("#vector-total-velocity");
const totalVelocityVectorHead = document.querySelector(
  "#vector-total-velocity-head",
);
const totalVelocityLabel = document.querySelector("#total-velocity-label");
const tangentialVector = document.querySelector("#vector-tangential");
const tangentialVectorHead = document.querySelector("#vector-tangential-head");
const tangentialLabel = document.querySelector("#tangential-label");
const centripetalVector = document.querySelector("#vector-centripetal");
const centripetalVectorHead = document.querySelector("#vector-centripetal-head");
const centripetalLabel = document.querySelector("#centripetal-label");
const resultantVector = document.querySelector("#vector-resultant");
const resultantVectorHead = document.querySelector("#vector-resultant-head");
const resultantLabel = document.querySelector("#resultant-label");
const resultTimeValue = document.querySelector("#result-time-value");
const resultAlphaValue = document.querySelector("#result-alpha-value");
const resultOmegaValue = document.querySelector("#result-omega-value");
const resultThetaValue = document.querySelector("#result-theta-value");
const resultUValue = document.querySelector("#result-u-value");
const resultUcmValue = document.querySelector("#result-u-cm-value");
const resultUaValue = document.querySelector("#result-u-a-value");
const resultTangentialAccelerationValue = document.querySelector("#result-a-t-value");
const resultCentripetalAccelerationValue = document.querySelector("#result-a-c-value");
const resultAccelerationValue = document.querySelector("#result-a-value");
const resultArcLengthValue = document.querySelector("#result-s-value");
const resultTurnsValue = document.querySelector("#result-n-value");
const resultKineticEnergyValue = document.querySelector(
  "#result-kinetic-energy-value",
);
const chartElements = {
  alpha: {
    path: document.querySelector("#chart-alpha-path"),
    point: document.querySelector("#chart-alpha-point"),
    zero: document.querySelector("#chart-alpha-zero"),
    grid: document.querySelector("#chart-alpha-grid"),
    ticks: document.querySelector("#chart-alpha-ticks"),
    timeLabel: document.querySelector("#chart-alpha-time-label"),
  },
  omega: {
    path: document.querySelector("#chart-omega-path"),
    point: document.querySelector("#chart-omega-point"),
    zero: document.querySelector("#chart-omega-zero"),
    grid: document.querySelector("#chart-omega-grid"),
    ticks: document.querySelector("#chart-omega-ticks"),
    timeLabel: document.querySelector("#chart-omega-time-label"),
  },
  theta: {
    path: document.querySelector("#chart-theta-path"),
    point: document.querySelector("#chart-theta-point"),
    zero: document.querySelector("#chart-theta-zero"),
    grid: document.querySelector("#chart-theta-grid"),
    ticks: document.querySelector("#chart-theta-ticks"),
    timeLabel: document.querySelector("#chart-theta-time-label"),
  },
};

const MIN_VIEW_ZOOM = 0.35;
const MAX_VIEW_ZOOM = 5;
const LABEL_DRAG_RADIUS_PX = 55;

const simulation = {
  radius: 1,
  rho: 0.5,
  mass: 1,
  omega: 0.2,
  alpha: 0,
};

let draggedPointerId = null;
let applicationZoom = 1;
let diskCenter = { x: 0, y: 0 };
let groundGeometryKey = "";
const view = { x: 0, y: 0, scale: 1 };
const labelDrag = {
  active: false,
  element: null,
  pointerId: null,
  startClientX: 0,
  startClientY: 0,
  startOffsetX: 0,
  startOffsetY: 0,
};
const viewportPan = {
  active: false,
  pointerId: null,
  x: 0,
  y: 0,
};
const playback = {
  time: 0,
  playing: false,
  lastTimestamp: null,
  animationId: null,
};

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function compactNumber(value, decimals = 3) {
  return Number(value.toFixed(decimals)).toString();
}

function greekNumber(value) {
  return compactNumber(value).replace(".", ",");
}

function fixedGreekNumber(value, decimals = 2) {
  const safeValue = Math.abs(value) < 0.5 * 10 ** -decimals ? 0 : value;
  return Number(safeValue).toFixed(decimals).replace(".", ",");
}

function renderLatexElement(element) {
  const expression = element?.dataset.latex;
  if (!window.katex || !expression) return;
  window.katex.render(expression, element, {
    throwOnError: false,
    strict: false,
  });
}

function renderStaticLatex() {
  document.querySelectorAll("[data-latex]").forEach(renderLatexElement);
}

function setCircleGeometry(circle, centerX, centerY, radius) {
  circle.setAttribute("cx", centerX);
  circle.setAttribute("cy", centerY);
  circle.setAttribute("r", Math.max(0, radius));
}

function setLineGeometry(line, x1, y1, x2, y2) {
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
}

function setElementVisible(element, visible) {
  element.toggleAttribute("hidden", !visible);
}

function setArrowHead(
  polygon,
  endX,
  endY,
  directionX,
  directionY,
  inverseScale,
  size = 1,
) {
  const magnitude = Math.hypot(directionX, directionY);
  if (magnitude <= EVENT_EPSILON) {
    polygon.removeAttribute("points");
    return;
  }
  const unitX = directionX / magnitude;
  const unitY = directionY / magnitude;
  const headLength = 10 * size * inverseScale;
  const headHalfWidth = 4.5 * size * inverseScale;
  const baseX = endX - unitX * headLength;
  const baseY = endY - unitY * headLength;
  const perpendicularX = -unitY * headHalfWidth;
  const perpendicularY = unitX * headHalfWidth;
  polygon.setAttribute(
    "points",
    `${endX},${endY} ${baseX + perpendicularX},${baseY + perpendicularY} ${baseX - perpendicularX},${baseY - perpendicularY}`,
  );
}

function positionFeatureLabel(label, x, y, inverseScale) {
  const width = Number(label.getAttribute("width")) || 42;
  const height = Number(label.getAttribute("height")) || 36;
  label.setAttribute("x", x - (width * inverseScale) / 2);
  label.setAttribute("y", y - (height * inverseScale) / 2);
}

function setPointPosition(x, y) {
  pointADot.setAttribute("cx", x);
  pointADot.setAttribute("cy", y);
  pointAHit.setAttribute("cx", x);
  pointAHit.setAttribute("cy", y);
  radiusGuide.setAttribute("x2", x);
  radiusGuide.setAttribute("y2", y);
}

function rotationRadiansAtTime(time = playback.time) {
  return simulation.omega * time + 0.5 * simulation.alpha * time * time;
}

function rotationDegreesAtTime(time = playback.time) {
  return (rotationRadiansAtTime(time) * 180) / Math.PI;
}

function pointAngleRadiansAtTime(time = playback.time) {
  return rotationRadiansAtTime(time);
}

function angularPositionRadiansAtTime(time = playback.time) {
  return rotationRadiansAtTime(time);
}

function chartTick(value, step = 1) {
  let decimals = 0;
  while (
    decimals < 6 &&
    Math.abs(step * 10 ** decimals - Math.round(step * 10 ** decimals)) > 1e-7
  ) {
    decimals += 1;
  }
  const safeValue = Math.abs(value) < Math.abs(step) * 1e-7 ? 0 : value;
  return compactNumber(safeValue, decimals).replace(".", ",");
}

function niceStep(span, targetTickCount = 5) {
  if (!Number.isFinite(span) || span <= EVENT_EPSILON) return 1;
  const rawStep = span / targetTickCount;
  const exponent = Math.floor(Math.log10(rawStep));
  const magnitude = 10 ** exponent;
  const fraction = rawStep / magnitude;
  const niceFraction =
    fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 2.5 ? 2.5 : fraction <= 5 ? 5 : 10;
  return niceFraction * magnitude;
}

function niceScale(minimum, maximum, targetTickCount = 5) {
  const step = niceStep(maximum - minimum, targetTickCount);
  let niceMinimum = Math.floor(minimum / step) * step;
  let niceMaximum = Math.ceil(maximum / step) * step;
  if (minimum >= 0) niceMinimum = 0;
  if (maximum <= 0) niceMaximum = 0;
  if (Math.abs(niceMaximum - niceMinimum) <= EVENT_EPSILON) {
    niceMinimum -= step;
    niceMaximum += step;
  }
  const tickCount = Math.round((niceMaximum - niceMinimum) / step);
  const ticks = Array.from(
    { length: tickCount + 1 },
    (_, index) => niceMinimum + index * step,
  );
  return { minimum: niceMinimum, maximum: niceMaximum, step, ticks };
}

function chartValueScale(values) {
  const dataMinimum = Math.min(...values);
  const dataMaximum = Math.max(...values);
  if (Math.abs(dataMaximum - dataMinimum) <= EVENT_EPSILON) {
    if (Math.abs(dataMaximum) <= EVENT_EPSILON) {
      return niceScale(-1, 1);
    }
    return dataMaximum > 0
      ? niceScale(0, dataMaximum * 1.08)
      : niceScale(dataMinimum * 1.08, 0);
  }

  let minimum = Math.min(0, dataMinimum);
  let maximum = Math.max(0, dataMaximum);
  const span = maximum - minimum;
  if (dataMinimum < 0 && dataMaximum > 0) {
    minimum -= span * 0.06;
    maximum += span * 0.06;
  } else if (minimum === 0) {
    maximum += span * 0.08;
  } else if (maximum === 0) {
    minimum -= span * 0.08;
  }
  return niceScale(minimum, maximum);
}

function createChartSvgElement(tagName, attributes = {}, textContent = "") {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tagName);
  Object.entries(attributes).forEach(([name, value]) =>
    element.setAttribute(name, value),
  );
  element.textContent = textContent;
  return element;
}

function renderChartGrid(
  elements,
  timeScale,
  valueScale,
  xForTime,
  yForValue,
) {
  elements.grid.replaceChildren();
  elements.ticks.replaceChildren();

  timeScale.ticks.forEach((tick) => {
    const x = xForTime(tick);
    elements.grid.append(
      createChartSvgElement("line", {
        x1: x,
        y1: CHART_BOUNDS.top,
        x2: x,
        y2: CHART_BOUNDS.bottom,
      }),
    );
    elements.ticks.append(
      createChartSvgElement(
        "text",
        {
          class: "chart-tick chart-tick-x",
          x,
          y: CHART_BOUNDS.bottom + 12,
        },
        chartTick(tick, timeScale.step),
      ),
    );
  });

  valueScale.ticks.forEach((tick) => {
    const y = yForValue(tick);
    elements.grid.append(
      createChartSvgElement("line", {
        x1: CHART_BOUNDS.left,
        y1: y,
        x2: CHART_BOUNDS.right,
        y2: y,
      }),
    );
    if (Math.abs(tick) <= Math.abs(valueScale.step) * 1e-7) return;
    elements.ticks.append(
      createChartSvgElement(
        "text",
        {
          class: "chart-tick chart-tick-y",
          x: CHART_BOUNDS.left - 5,
          y: y + 3,
        },
        chartTick(tick, valueScale.step),
      ),
    );
  });
}

function renderResultChart(elements, valueAtTime) {
  const sampleEnd = playback.time;
  const sampleCount = sampleEnd > EVENT_EPSILON ? CHART_SAMPLE_COUNT : 0;
  const samples = [];
  for (let index = 0; index <= sampleCount; index += 1) {
    const time = sampleCount === 0 ? 0 : (sampleEnd * index) / sampleCount;
    const rawValue = valueAtTime(time);
    samples.push({
      time,
      value: Number.isFinite(rawValue) ? rawValue : 0,
    });
  }

  const timeScale = niceScale(0, Math.max(1, playback.time));
  const valueScale = chartValueScale(samples.map((sample) => sample.value));
  const chartWidth = CHART_BOUNDS.right - CHART_BOUNDS.left;
  const chartHeight = CHART_BOUNDS.bottom - CHART_BOUNDS.top;
  const xForTime = (time) =>
    CHART_BOUNDS.left +
    ((time - timeScale.minimum) /
      (timeScale.maximum - timeScale.minimum)) *
      chartWidth;
  const yForValue = (value) =>
    CHART_BOUNDS.bottom -
    ((value - valueScale.minimum) /
      (valueScale.maximum - valueScale.minimum)) *
      chartHeight;

  renderChartGrid(elements, timeScale, valueScale, xForTime, yForValue);

  const path = samples
    .map(
      (sample, index) =>
        `${index === 0 ? "M" : "L"} ${xForTime(sample.time)} ${yForValue(sample.value)}`,
    )
    .join(" ");
  elements.path.setAttribute("d", path);
  const latest = samples.at(-1);
  elements.point.setAttribute("cx", xForTime(latest.time));
  elements.point.setAttribute("cy", yForValue(latest.value));

  const zeroY = yForValue(0);
  setLineGeometry(
    elements.zero,
    CHART_BOUNDS.left,
    zeroY,
    CHART_BOUNDS.right,
    zeroY,
  );
  elements.timeLabel.setAttribute(
    "y",
    clamp(zeroY - 18, 0, CHART_BOUNDS.bottom - 18),
  );
}

function renderResults() {
  const currentOmega = simulation.omega + simulation.alpha * playback.time;
  const currentTheta = angularPositionRadiansAtTime();
  const angularDisplacement = rotationRadiansAtTime();
  const linearVelocity = currentOmega * simulation.rho;
  const centerVelocity = -currentOmega * simulation.radius;
  const tangentialAcceleration = simulation.alpha * simulation.rho;
  const centripetalAcceleration =
    currentOmega * currentOmega * simulation.rho;
  const resultantAcceleration = Math.hypot(
    tangentialAcceleration,
    centripetalAcceleration,
  );
  const algebraicArcLength = simulation.rho * angularDisplacement;
  const turns = angularDisplacement / (2 * Math.PI);
  const angle = pointAngleRadiansAtTime();
  const totalVelocityX = centerVelocity + linearVelocity * Math.cos(angle);
  const totalVelocityY = -linearVelocity * Math.sin(angle);
  const totalVelocity = Math.hypot(totalVelocityX, totalVelocityY);
  const kineticEnergy =
    0.5 * simulation.mass * (totalVelocityX ** 2 + totalVelocityY ** 2);
  resultTimeValue.textContent = fixedGreekNumber(playback.time, 2);
  resultAlphaValue.textContent = fixedGreekNumber(simulation.alpha, 2);
  resultOmegaValue.textContent = fixedGreekNumber(currentOmega, 2);
  resultThetaValue.textContent = fixedGreekNumber(currentTheta, 2);
  resultUValue.textContent = fixedGreekNumber(Math.abs(linearVelocity), 2);
  resultUcmValue.textContent = fixedGreekNumber(Math.abs(centerVelocity), 2);
  resultUaValue.textContent = fixedGreekNumber(totalVelocity, 2);
  resultTangentialAccelerationValue.textContent = fixedGreekNumber(
    Math.abs(tangentialAcceleration),
    2,
  );
  resultCentripetalAccelerationValue.textContent = fixedGreekNumber(
    centripetalAcceleration,
    2,
  );
  resultAccelerationValue.textContent = fixedGreekNumber(
    resultantAcceleration,
    2,
  );
  resultArcLengthValue.textContent = fixedGreekNumber(algebraicArcLength, 2);
  resultTurnsValue.textContent = fixedGreekNumber(turns, 3);
  resultKineticEnergyValue.textContent = fixedGreekNumber(kineticEnergy, 2);

  renderResultChart(chartElements.alpha, () => simulation.alpha);
  renderResultChart(
    chartElements.omega,
    (time) => simulation.omega + simulation.alpha * time,
  );
  renderResultChart(
    chartElements.theta,
    (time) => angularPositionRadiansAtTime(time),
  );
}

function renderMotionTrace(inverseScale) {
  const isVisible =
    showTracesCheckbox.checked &&
    playback.time > EVENT_EPSILON &&
    simulation.rho > EVENT_EPSILON;
  setElementVisible(traceLayer, isVisible);
  if (!isVisible) {
    traceGlow.removeAttribute("d");
    tracePath.removeAttribute("d");
    return;
  }

  const angularTravel =
    Math.abs(simulation.omega * playback.time) +
    0.5 * Math.abs(simulation.alpha) * playback.time * playback.time;
  const sampleCount = clamp(
    Math.ceil(Math.max(angularTravel * 28, playback.time * 20, 2)),
    2,
    MAX_TRACE_SAMPLES,
  );
  const distance = simulation.rho * PIXELS_PER_METER;
  const points = [];
  for (let index = 0; index <= sampleCount; index += 1) {
    const time = (playback.time * index) / sampleCount;
    const angle = pointAngleRadiansAtTime(time);
    points.push({
      x: diskCenter.x + Math.sin(angle) * distance,
      y: diskCenter.y + Math.cos(angle) * distance,
    });
  }
  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  traceGlow.setAttribute("d", path);
  tracePath.setAttribute("d", path);
  traceGlow.style.strokeWidth = `${7 * inverseScale}px`;
  tracePath.style.strokeWidth = `${2.2 * inverseScale}px`;
}

function renderGeometryAngle(
  arc,
  head,
  label,
  angleRadians,
  arcRadius,
  inverseScale,
) {
  const showsAngle = Math.abs(angleRadians) > 1e-7;
  [arc, head, label].forEach((element) =>
    setElementVisible(element, showsAngle),
  );
  if (!showsAngle) return;

  const fullTurn = 2 * Math.PI;
  const magnitude = Math.abs(angleRadians);
  const directionSign = angleRadians >= 0 ? 1 : -1;
  const sweepFlag = directionSign > 0 ? 0 : 1;
  let remainder = magnitude % fullTurn;
  if (remainder < 1e-7 || fullTurn - remainder < 1e-7) remainder = 0;

  const startX = diskCenter.x;
  const startY = diskCenter.y + arcRadius;
  const endX = diskCenter.x + Math.sin(angleRadians) * arcRadius;
  const endY = diskCenter.y + Math.cos(angleRadians) * arcRadius;
  if (magnitude >= fullTurn - 1e-7) {
    const oppositeX = diskCenter.x;
    const oppositeY = diskCenter.y - arcRadius;
    let path =
      `M ${startX} ${startY} ` +
      `A ${arcRadius} ${arcRadius} 0 0 ${sweepFlag} ${oppositeX} ${oppositeY} ` +
      `A ${arcRadius} ${arcRadius} 0 0 ${sweepFlag} ${startX} ${startY}`;
    if (remainder > 0) {
      const largeArcFlag = remainder > Math.PI ? 1 : 0;
      path +=
        ` A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} ${sweepFlag}` +
        ` ${endX} ${endY}`;
    }
    arc.setAttribute("d", path);
  } else {
    const largeArcFlag = magnitude > Math.PI ? 1 : 0;
    arc.setAttribute(
      "d",
      `M ${startX} ${startY} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY}`,
    );
  }
  arc.style.strokeWidth = `${1.5 * inverseScale}px`;
  setArrowHead(
    head,
    endX,
    endY,
    directionSign * Math.cos(angleRadians),
    -directionSign * Math.sin(angleRadians),
    inverseScale,
    0.72,
  );
  const labelRadius = arcRadius + 15 * inverseScale;
  const labelAngle =
    magnitude >= fullTurn - 1e-7
      ? remainder > 0
        ? directionSign * remainder / 2
        : directionSign * Math.PI / 2
      : angleRadians / 2;
  positionFeatureLabel(
    label,
    diskCenter.x + labelRadius * Math.sin(labelAngle),
    diskCenter.y + labelRadius * Math.cos(labelAngle),
    inverseScale,
  );
}

function renderGeometricFeatures(pointX, pointY, inverseScale) {
  const isVisible = showGeometryCheckbox.checked;
  setElementVisible(geometryLayer, isVisible);
  setElementVisible(centerLabel, isVisible);
  setElementVisible(pointALabel, isVisible);
  if (!isVisible) return;

  const diskRadius = simulation.radius * PIXELS_PER_METER;
  setLineGeometry(
    verticalReference,
    diskCenter.x,
    diskCenter.y,
    diskCenter.x,
    diskCenter.y + diskRadius,
  );
  verticalReference.style.strokeWidth = `${1.3 * inverseScale}px`;
  verticalReference.style.strokeDasharray =
    `${7 * inverseScale} ${6 * inverseScale}`;

  radiusGuide.style.strokeWidth = `${1.3 * inverseScale}px`;
  radiusGuide.style.strokeDasharray = `${7 * inverseScale} ${6 * inverseScale}`;
  const currentAngle = pointAngleRadiansAtTime();
  const midpointX = (diskCenter.x + pointX) / 2;
  const midpointY = (diskCenter.y + pointY) / 2;
  const rhoOffset = 13 * inverseScale;
  positionFeatureLabel(
    rhoLabel,
    midpointX + Math.cos(currentAngle) * rhoOffset,
    midpointY - Math.sin(currentAngle) * rhoOffset,
    inverseScale,
  );

  renderGeometryAngle(
    thetaCurrentArc,
    thetaCurrentHead,
    thetaCurrentLabel,
    angularPositionRadiansAtTime(),
    Math.min(diskRadius * 0.62, 52 * inverseScale),
    inverseScale,
  );
}

function renderAccelerationVector(
  line,
  head,
  label,
  pointX,
  pointY,
  accelerationX,
  accelerationY,
  vectorScale,
  inverseScale,
  labelSide,
) {
  const magnitude = Math.hypot(accelerationX, accelerationY);
  const isVisible = magnitude > EVENT_EPSILON;
  [line, head, label].forEach((element) =>
    setElementVisible(element, isVisible),
  );
  if (!isVisible) return null;

  const unitX = accelerationX / magnitude;
  const unitY = accelerationY / magnitude;
  const endX = pointX + accelerationX * vectorScale;
  const endY = pointY + accelerationY * vectorScale;
  setLineGeometry(line, pointX, pointY, endX, endY);
  line.style.strokeWidth = `${2 * inverseScale}px`;
  setArrowHead(head, endX, endY, unitX, unitY, inverseScale);

  const normalX = -unitY;
  const normalY = unitX;
  positionFeatureLabel(
    label,
    endX + unitX * 10 * inverseScale + normalX * labelSide * inverseScale,
    endY + unitY * 10 * inverseScale + normalY * labelSide * inverseScale,
    inverseScale,
  );
  return { endX, endY, unitX, unitY, magnitude };
}

function renderAccelerationVectors(pointX, pointY, inverseScale) {
  const isVisible = showVectorsCheckbox.checked;
  setElementVisible(accelerationVectorsLayer, isVisible);
  if (!isVisible) return;

  const angle = pointAngleRadiansAtTime();
  const angularSpeed = simulation.omega + simulation.alpha * playback.time;
  const tangentX = Math.cos(angle);
  const tangentY = -Math.sin(angle);
  const radialX = Math.sin(angle);
  const radialY = Math.cos(angle);
  const tangentialMagnitude = simulation.alpha * simulation.rho;
  const centripetalMagnitude = angularSpeed * angularSpeed * simulation.rho;
  const tangentialX = tangentialMagnitude * tangentX;
  const tangentialY = tangentialMagnitude * tangentY;
  const centripetalX = -centripetalMagnitude * radialX;
  const centripetalY = -centripetalMagnitude * radialY;
  const resultantX = tangentialX + centripetalX;
  const resultantY = tangentialY + centripetalY;
  const diskRadius = simulation.radius * PIXELS_PER_METER;
  const targetLength = clamp(diskRadius * 0.58, 44, 125);
  const rimTangentialMagnitude = Math.abs(simulation.alpha) * simulation.radius;
  const rimCentripetalMagnitude =
    simulation.omega * simulation.omega * simulation.radius;
  // The scale must stay fixed while time advances. Using the current omega here
  // would make a constant a_epsilon appear to shrink as a_kappa grows.
  const referenceMagnitude = Math.hypot(
    rimTangentialMagnitude,
    rimCentripetalMagnitude,
  );
  const vectorScale =
    referenceMagnitude > EVENT_EPSILON
      ? targetLength / referenceMagnitude
      : 0;
  const showComponents =
    Math.abs(tangentialMagnitude) > EVENT_EPSILON &&
    centripetalMagnitude > EVENT_EPSILON;

  renderAccelerationVector(
    tangentialVector,
    tangentialVectorHead,
    tangentialLabel,
    pointX,
    pointY,
    showComponents ? tangentialX : 0,
    showComponents ? tangentialY : 0,
    vectorScale,
    inverseScale,
    13,
  );
  renderAccelerationVector(
    centripetalVector,
    centripetalVectorHead,
    centripetalLabel,
    pointX,
    pointY,
    showComponents ? centripetalX : 0,
    showComponents ? centripetalY : 0,
    vectorScale,
    inverseScale,
    -13,
  );
  renderAccelerationVector(
    resultantVector,
    resultantVectorHead,
    resultantLabel,
    pointX,
    pointY,
    resultantX,
    resultantY,
    vectorScale,
    inverseScale,
    14,
  );

}

function hideVectorTriplet(line, head, label) {
  [line, head, label].forEach((element) => setElementVisible(element, false));
}

function renderVelocityVectors(pointX, pointY, inverseScale) {
  const showTranslation = showTranslationalVelocityCheckbox.checked;
  const showRotation = showRotationalVelocityCheckbox.checked;
  const isVisible = showTranslation || showRotation;
  setElementVisible(velocityVectorsLayer, isVisible);
  if (!isVisible) return;

  const angle = pointAngleRadiansAtTime();
  const angularSpeed = simulation.omega + simulation.alpha * playback.time;
  const rotationalSpeed = angularSpeed * simulation.rho;
  const translationSpeed = -angularSpeed * simulation.radius;
  const rotationalX = rotationalSpeed * Math.cos(angle);
  const rotationalY = -rotationalSpeed * Math.sin(angle);
  const totalX = translationSpeed + rotationalX;
  const totalY = rotationalY;
  // Use only input parameters for the drawing scale so every velocity arrow
  // grows or shrinks in direct proportion to its current physical magnitude.
  const referenceAngularSpeed = Math.max(
    Math.abs(simulation.omega),
    Math.abs(simulation.alpha),
  );
  const referenceMagnitude =
    referenceAngularSpeed * 2 * simulation.radius;
  const diskRadius = simulation.radius * PIXELS_PER_METER;
  const vectorScale =
    referenceMagnitude > EVENT_EPSILON
      ? clamp(diskRadius * 0.72, 48, 130) / referenceMagnitude
      : 0;

  if (showRotation) {
    renderAccelerationVector(
      velocityVector,
      velocityVectorHead,
      velocityLabel,
      pointX,
      pointY,
      rotationalX,
      rotationalY,
      vectorScale,
      inverseScale,
      -17,
    );
  } else {
    hideVectorTriplet(velocityVector, velocityVectorHead, velocityLabel);
  }

  if (showTranslation) {
    renderAccelerationVector(
      translationAVector,
      translationAVectorHead,
      translationALabel,
      pointX,
      pointY,
      translationSpeed,
      0,
      vectorScale,
      inverseScale,
      17,
    );
    renderAccelerationVector(
      translationCenterVector,
      translationCenterVectorHead,
      translationCenterLabel,
      diskCenter.x,
      diskCenter.y,
      translationSpeed,
      0,
      vectorScale,
      inverseScale,
      -17,
    );
  } else {
    hideVectorTriplet(
      translationAVector,
      translationAVectorHead,
      translationALabel,
    );
    hideVectorTriplet(
      translationCenterVector,
      translationCenterVectorHead,
      translationCenterLabel,
    );
  }

  if (showTranslation && showRotation) {
    renderAccelerationVector(
      totalVelocityVector,
      totalVelocityVectorHead,
      totalVelocityLabel,
      pointX,
      pointY,
      totalX,
      totalY,
      vectorScale,
      inverseScale,
      20,
    );
  } else {
    hideVectorTriplet(
      totalVelocityVector,
      totalVelocityVectorHead,
      totalVelocityLabel,
    );
  }
}

function renderFeatureLayers(pointX, pointY, inverseScale) {
  renderMotionTrace(inverseScale);
  renderGeometricFeatures(pointX, pointY, inverseScale);
  setElementVisible(
    vectorsLayer,
    showVectorsCheckbox.checked ||
      showTranslationalVelocityCheckbox.checked ||
      showRotationalVelocityCheckbox.checked,
  );
  renderVelocityVectors(pointX, pointY, inverseScale);
  renderAccelerationVectors(pointX, pointY, inverseScale);
}

function renderScaleSensitiveGeometry() {
  const inverseScale = 1 / view.scale;
  const diskRadius = simulation.radius * PIXELS_PER_METER;
  const pointX = Number(pointADot.getAttribute("cx")) || diskCenter.x;
  const pointY = Number(pointADot.getAttribute("cy")) || diskCenter.y;

  setCircleGeometry(centerDot, diskCenter.x, diskCenter.y, 6 * inverseScale);
  pointADot.setAttribute("r", 7 * inverseScale);
  pointAHit.setAttribute("r", 20 * inverseScale);
  centerDot.style.strokeWidth = `${1 * inverseScale}px`;
  pointADot.style.strokeWidth = `${1 * inverseScale}px`;

  centerLabel.setAttribute("x", diskCenter.x - 34 * inverseScale);
  centerLabel.setAttribute("y", diskCenter.y - 28 * inverseScale);
  pointALabel.setAttribute("x", pointX + 14 * inverseScale);
  pointALabel.setAttribute("y", pointY - 28 * inverseScale);

  diskRingOuter.style.strokeWidth = `${3 * inverseScale}px`;
  diskRingInner.style.strokeWidth = `${1.5 * inverseScale}px`;
  diskRingInner.style.strokeDasharray = `${4 * inverseScale} ${9 * inverseScale}`;
  radiusGuide.style.strokeWidth = `${2 * inverseScale}px`;
  radiusGuide.style.strokeDasharray = `${6 * inverseScale} ${6 * inverseScale}`;

  const markerOuterRadius = Math.max(0, diskRadius - 3 * inverseScale);
  const markerLength = Math.min(18 * inverseScale, diskRadius * 0.7);
  const markerInnerRadius = Math.max(0, markerOuterRadius - markerLength);
  rotationMarkers.forEach((marker, index) => {
    const markerAngle = (index * Math.PI) / 4;
    setLineGeometry(
      marker,
      diskCenter.x + Math.sin(markerAngle) * markerInnerRadius,
      diskCenter.y + Math.cos(markerAngle) * markerInnerRadius,
      diskCenter.x + Math.sin(markerAngle) * markerOuterRadius,
      diskCenter.y + Math.cos(markerAngle) * markerOuterRadius,
    );
    marker.style.strokeWidth = `${4 * inverseScale}px`;
  });

  const accentLength = Math.min(30 * inverseScale, diskRadius * 0.9);
  setLineGeometry(
    markerAccent,
    diskCenter.x,
    diskCenter.y + Math.max(0, markerOuterRadius - accentLength),
    diskCenter.x,
    diskCenter.y + markerOuterRadius,
  );
  markerAccent.style.strokeWidth = `${6 * inverseScale}px`;
  renderFeatureLayers(pointX, pointY, inverseScale);
}

function renderGround() {
  const diskRadius = simulation.radius * PIXELS_PER_METER;
  const groundY = diskCenter.y + diskRadius;
  const sceneWidth = Math.max(diskScene.clientWidth, 1);
  const sceneHeight = Math.max(diskScene.clientHeight, 1);
  const extent = sceneWidth * 2;
  const groundOffset =
    simulation.radius * rotationRadiansAtTime() * PIXELS_PER_METER;
  const markerSpacing = PIXELS_PER_METER;
  const normalizedOffset =
    ((groundOffset % markerSpacing) + markerSpacing) % markerSpacing;

  groundFill.setAttribute("x", -extent);
  groundFill.setAttribute("y", groundY);
  groundFill.setAttribute("width", extent * 2);
  groundFill.setAttribute("height", Math.max(sceneHeight, diskRadius * 2));
  setLineGeometry(groundLine, -extent, groundY, extent, groundY);

  const geometryKey = `${extent}:${groundY}:${markerSpacing}`;
  if (geometryKey !== groundGeometryKey) {
    const markers = [];
    for (let x = -extent - markerSpacing; x <= extent; x += markerSpacing) {
      markers.push(`M ${x} ${groundY} L ${x - 12} ${groundY + 16}`);
    }
    groundMarkers.setAttribute("d", markers.join(" "));
    groundGeometryKey = geometryKey;
  }
  groundMarkers.setAttribute("transform", `translate(${normalizedOffset} 0)`);
}

function renderDisk() {
  const diskRadius = simulation.radius * PIXELS_PER_METER;
  diskCenter = {
    x: diskScene.clientWidth / 2,
    y: diskScene.clientHeight / 2,
  };

  renderGround();

  setCircleGeometry(diskBody, diskCenter.x, diskCenter.y, diskRadius);
  setCircleGeometry(diskRingOuter, diskCenter.x, diskCenter.y, diskRadius);
  setCircleGeometry(
    diskRingInner,
    diskCenter.x,
    diskCenter.y,
    Math.max(0, diskRadius - Math.min(12, diskRadius * 0.18)),
  );
  setLineGeometry(
    radiusGuide,
    diskCenter.x,
    diskCenter.y,
    diskCenter.x,
    diskCenter.y,
  );

  const rotationDegrees = rotationDegreesAtTime();
  const angle = (rotationDegrees * Math.PI) / 180;
  const distance = simulation.rho * PIXELS_PER_METER;
  const x = diskCenter.x + Math.sin(angle) * distance;
  const y = diskCenter.y + Math.cos(angle) * distance;

  setPointPosition(x, y);
  // SVG angles grow clockwise because the vertical screen axis points down.
  // Negating the physical angle keeps positive omega/alpha counterclockwise,
  // in the same direction as the pinned point A.
  diskRotor.setAttribute(
    "transform",
    `rotate(${-rotationDegrees} ${diskCenter.x} ${diskCenter.y})`,
  );
  renderScaleSensitiveGeometry();
  pointA.setAttribute(
    "aria-label",
    `Σημείο Α, απόσταση ${greekNumber(simulation.rho)} μέτρα από το κέντρο. Σύρετε για αλλαγή της απόστασης.`,
  );
  renderResults();
}

function renderView() {
  simulationWorld.setAttribute(
    "transform",
    `translate(${view.x} ${view.y}) scale(${view.scale})`,
  );
  const originScreenX = view.x + diskCenter.x * view.scale;
  const originScreenY = view.y + diskCenter.y * view.scale;
  simulationViewport.style.setProperty("--grid-x", `${originScreenX}px`);
  simulationViewport.style.setProperty("--grid-y", `${originScreenY}px`);
  simulationViewport.style.setProperty(
    "--grid-minor-size",
    `${PIXELS_PER_METER * view.scale}px`,
  );
  simulationViewport.style.setProperty(
    "--grid-major-size",
    `${PIXELS_PER_METER * 5 * view.scale}px`,
  );
  renderScaleSensitiveGeometry();
  document
    .querySelectorAll(".draggable-sim-label")
    .forEach(applyLabelOffset);
}

function syncRhoLimit() {
  rhoRange.max = String(simulation.radius);
  rhoNumber.max = String(simulation.radius);
  const maximumText = greekNumber(simulation.radius);
  rhoMaximum.textContent = maximumText;
  rhoMaximum.dataset.latex = maximumText.replace(",", "{,}");
  renderLatexElement(rhoMaximum);

  if (simulation.rho > simulation.radius) {
    simulation.rho = simulation.radius;
  }

  rhoRange.value = String(simulation.rho);
  rhoNumber.value = compactNumber(simulation.rho);
}

function setBoundedParameter(key, rawValue, minimum, maximum) {
  const value = Number(rawValue);
  if (!Number.isFinite(value)) return false;
  simulation[key] = clamp(value, minimum, maximum);
  return true;
}

function updateUnboundedRange(range, value) {
  const minimum = Number(range.min);
  const maximum = Number(range.max);
  range.value = String(clamp(value, minimum, maximum));
  range.classList.toggle("is-below-range", value < minimum);
  range.classList.toggle("is-above-range", value > maximum);
}

function connectBoundedControl({
  key,
  range,
  number,
  minimum,
  maximum,
  afterChange = () => {},
}) {
  range.addEventListener("input", () => {
    simulation[key] = Number(range.value);
    number.value = compactNumber(simulation[key]);
    afterChange();
  });

  number.addEventListener("input", () => {
    const value = Number(number.value);
    const lowerLimit = minimum();
    const upperLimit = maximum();
    if (
      number.value === "" ||
      !Number.isFinite(value) ||
      value < lowerLimit ||
      value > upperLimit
    ) {
      return;
    }
    simulation[key] = value;
    range.value = String(value);
    afterChange();
  });

  number.addEventListener("change", () => {
    if (!setBoundedParameter(key, number.value, minimum(), maximum())) {
      number.value = compactNumber(simulation[key]);
      return;
    }
    number.value = compactNumber(simulation[key]);
    range.value = String(simulation[key]);
    afterChange();
  });
}

function connectUnboundedControl(key, range, number) {
  range.addEventListener("input", () => {
    simulation[key] = Number(range.value);
    number.value = compactNumber(simulation[key]);
    range.classList.remove("is-below-range", "is-above-range");
  });

  number.addEventListener("input", () => {
    const value = Number(number.value);
    if (number.value === "" || !Number.isFinite(value)) return;
    simulation[key] = value;
    updateUnboundedRange(range, value);
  });

  number.addEventListener("change", () => {
    const value = Number(number.value);
    if (!Number.isFinite(value)) {
      number.value = compactNumber(simulation[key]);
      return;
    }
    simulation[key] = value;
    number.value = compactNumber(value);
    updateUnboundedRange(range, value);
  });
}

function pointerToScene(event) {
  const point = diskScene.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  const localPoint = point.matrixTransform(diskScene.getScreenCTM().inverse());
  return {
    x: (localPoint.x - view.x) / view.scale,
    y: (localPoint.y - view.y) / view.scale,
  };
}

function updatePointFromPointer(event) {
  pauseSimulation();
  playback.time = 0;
  const pointer = pointerToScene(event);
  let dx = pointer.x - diskCenter.x;
  let dy = pointer.y - diskCenter.y;
  const rawDistance = Math.hypot(dx, dy);
  const diskRadius = simulation.radius * PIXELS_PER_METER;

  if (rawDistance > diskRadius) {
    const scale = diskRadius / rawDistance;
    dx *= scale;
    dy *= scale;
  }

  const distance = Math.hypot(dx, dy);
  simulation.rho = Number((distance / PIXELS_PER_METER).toFixed(3));

  rhoRange.value = String(simulation.rho);
  rhoNumber.value = compactNumber(simulation.rho);
  renderDisk();
  updatePlaybackButtons();
}

function zoomViewAt(screenX, screenY, factor) {
  const worldX = (screenX - view.x) / view.scale;
  const worldY = (screenY - view.y) / view.scale;
  const nextScale = clamp(
    view.scale * factor,
    MIN_VIEW_ZOOM,
    MAX_VIEW_ZOOM,
  );

  view.x = screenX - worldX * nextScale;
  view.y = screenY - worldY * nextScale;
  view.scale = nextScale;
  renderView();
}

function resetView() {
  view.x = 0;
  view.y = 0;
  view.scale = 1;
  renderView();
}

simulationViewport.addEventListener(
  "wheel",
  (event) => {
    if (event.ctrlKey) return;
    event.preventDefault();
    const bounds = simulationViewport.getBoundingClientRect();
    const cursorX = (event.clientX - bounds.left) / applicationZoom;
    const cursorY = (event.clientY - bounds.top) / applicationZoom;
    zoomViewAt(cursorX, cursorY, Math.exp(-event.deltaY * 0.0015));
  },
  { passive: false },
);

function eventTargetsSimulationControl(event) {
  return event.composedPath().some(
    (element) =>
      element instanceof Element &&
      (element.id === "point-a" ||
        element.classList.contains("draggable-sim-label") ||
        element.matches("button, input, label, a")),
  );
}

simulationViewport.addEventListener("pointerdown", (event) => {
  if (event.button !== 0 || eventTargetsSimulationControl(event)) return;
  event.preventDefault();
  viewportPan.active = true;
  viewportPan.pointerId = event.pointerId;
  viewportPan.x = event.clientX / applicationZoom;
  viewportPan.y = event.clientY / applicationZoom;
  simulationViewport.classList.add("is-panning");
  simulationViewport.setPointerCapture(event.pointerId);
});

simulationViewport.addEventListener("pointermove", (event) => {
  if (!viewportPan.active || event.pointerId !== viewportPan.pointerId) return;
  event.preventDefault();
  const pointerX = event.clientX / applicationZoom;
  const pointerY = event.clientY / applicationZoom;
  view.x += pointerX - viewportPan.x;
  view.y += pointerY - viewportPan.y;
  viewportPan.x = pointerX;
  viewportPan.y = pointerY;
  renderView();
});

function finishViewportPan(event) {
  if (!viewportPan.active || event.pointerId !== viewportPan.pointerId) return;
  viewportPan.active = false;
  viewportPan.pointerId = null;
  simulationViewport.classList.remove("is-panning");
}

simulationViewport.addEventListener("pointerup", finishViewportPan);
simulationViewport.addEventListener("pointercancel", finishViewportPan);
simulationViewport.addEventListener("lostpointercapture", finishViewportPan);

function labelOffset(element) {
  return {
    x: Number(element.dataset.labelOffsetX) || 0,
    y: Number(element.dataset.labelOffsetY) || 0,
  };
}

function applyLabelOffset(element) {
  const offset = labelOffset(element);
  element.style.transform = `translate(${offset.x}px, ${offset.y}px) scale(${1 / view.scale})`;
}

function finishLabelDrag(event) {
  if (
    !labelDrag.active ||
    (event && event.pointerId !== labelDrag.pointerId)
  ) {
    return;
  }
  const element = labelDrag.element;
  labelDrag.active = false;
  labelDrag.element = null;
  labelDrag.pointerId = null;
  element?.classList.remove("is-label-dragging");
}

function initializeDraggableLabels() {
  document.querySelectorAll(".draggable-sim-label").forEach((label) => {
    label.dataset.labelOffsetX = "0";
    label.dataset.labelOffsetY = "0";
    applyLabelOffset(label);

    label.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      const offset = labelOffset(label);
      labelDrag.active = true;
      labelDrag.element = label;
      labelDrag.pointerId = event.pointerId;
      labelDrag.startClientX = event.clientX / applicationZoom;
      labelDrag.startClientY = event.clientY / applicationZoom;
      labelDrag.startOffsetX = offset.x * view.scale;
      labelDrag.startOffsetY = offset.y * view.scale;
      label.classList.add("is-label-dragging");
      label.setPointerCapture(event.pointerId);
    });

    label.addEventListener("pointermove", (event) => {
      if (
        !labelDrag.active ||
        labelDrag.element !== label ||
        labelDrag.pointerId !== event.pointerId
      ) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      let offsetX =
        labelDrag.startOffsetX +
        event.clientX / applicationZoom -
        labelDrag.startClientX;
      let offsetY =
        labelDrag.startOffsetY +
        event.clientY / applicationZoom -
        labelDrag.startClientY;
      const distance = Math.hypot(offsetX, offsetY);
      if (distance > LABEL_DRAG_RADIUS_PX) {
        const scale = LABEL_DRAG_RADIUS_PX / distance;
        offsetX *= scale;
        offsetY *= scale;
      }
      label.dataset.labelOffsetX = String(offsetX / view.scale);
      label.dataset.labelOffsetY = String(offsetY / view.scale);
      applyLabelOffset(label);
    });

    label.addEventListener("pointerup", finishLabelDrag);
    label.addEventListener("pointercancel", finishLabelDrag);
    label.addEventListener("lostpointercapture", finishLabelDrag);
    label.addEventListener("dblclick", (event) => {
      event.preventDefault();
      event.stopPropagation();
      label.dataset.labelOffsetX = "0";
      label.dataset.labelOffsetY = "0";
      applyLabelOffset(label);
    });
  });
}

function setTheme(theme, save = true) {
  root.dataset.bsTheme = theme;

  themeButtons.forEach((button) => {
    const isActive = button.dataset.theme === theme;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (save) localStorage.setItem("rotation-lab-theme", theme);
}

function updatePanelToggle(button, isExpanded, side) {
  const isSettings = side === "settings";
  const action = isExpanded ? "Απόκρυψη" : "Εμφάνιση";
  const panelName = isSettings ? "παραμέτρων" : "αποτελεσμάτων";
  const direction = isSettings
    ? isExpanded
      ? "left"
      : "right"
    : isExpanded
      ? "right"
      : "left";
  const label = `${action} ${panelName}`;

  button.setAttribute("aria-expanded", String(isExpanded));
  button.setAttribute("title", label);
  button.querySelector("i").className = `bi bi-chevron-${direction}`;
  button.querySelector(".visually-hidden").textContent = label;
}

function togglePanel(side) {
  const className = `${side}-panel-collapsed`;
  const isCollapsed = document.body.classList.toggle(className);
  const button = side === "settings" ? settingsPanelToggle : resultsPanelToggle;
  updatePanelToggle(button, !isCollapsed, side);
}

function applyApplicationZoom() {
  appShell.style.width = `${100 / applicationZoom}vw`;
  appShell.style.height = `${100 / applicationZoom}vh`;
  appShell.style.transform = `scale(${applicationZoom})`;

  const index = APP_ZOOM_LEVELS.indexOf(applicationZoom);
  zoomOutButton.disabled = index === 0;
  zoomInButton.disabled = index === APP_ZOOM_LEVELS.length - 1;
  zoomOutButton.title = `Σμίκρυνση εφαρμογής (${Math.round(applicationZoom * 100)}%)`;
  zoomInButton.title = `Μεγέθυνση εφαρμογής (${Math.round(applicationZoom * 100)}%)`;
  requestAnimationFrame(() => {
    renderDisk();
    renderView();
  });
}

function changeApplicationZoom(direction) {
  const currentIndex = APP_ZOOM_LEVELS.indexOf(applicationZoom);
  const nextIndex = Math.min(
    APP_ZOOM_LEVELS.length - 1,
    Math.max(0, currentIndex + direction),
  );
  applicationZoom = APP_ZOOM_LEVELS[nextIndex];
  applyApplicationZoom();
}

async function toggleFullscreen() {
  window.setTimeout(updateFullscreenButton, 200);
  window.setTimeout(updateFullscreenButton, 1000);

  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  } catch (error) {
    console.warn("Η λειτουργία πλήρους οθόνης δεν είναι διαθέσιμη.", error);
  } finally {
    updateFullscreenButton();
  }
}

function updateFullscreenButton() {
  const isFullscreen = Boolean(document.fullscreenElement);
  const label = isFullscreen ? "Έξοδος από πλήρη οθόνη" : "Πλήρης οθόνη";
  fullscreenButton.querySelector("i").className = `bi ${
    isFullscreen ? "bi-fullscreen-exit" : "bi-fullscreen"
  }`;
  fullscreenButton.setAttribute("aria-label", label);
  fullscreenButton.setAttribute("aria-pressed", String(isFullscreen));
  fullscreenButton.title = label;
}

function updatePlaybackButtons() {
  playButton.disabled = playback.playing;
  pauseButton.disabled = !playback.playing;
  stepBackwardButton.disabled = playback.time <= EVENT_EPSILON;
}

function pauseSimulation() {
  playback.playing = false;
  playback.lastTimestamp = null;
  if (playback.animationId !== null) {
    cancelAnimationFrame(playback.animationId);
  }
  playback.animationId = null;
  updatePlaybackButtons();
}

function animationFrame(timestamp) {
  if (!playback.playing) return;
  if (playback.lastTimestamp === null) playback.lastTimestamp = timestamp;
  const elapsed = Math.min((timestamp - playback.lastTimestamp) / 1000, 0.1);
  playback.lastTimestamp = timestamp;
  playback.time += elapsed;
  renderDisk();
  playback.animationId = requestAnimationFrame(animationFrame);
}

function playSimulation() {
  if (playback.playing) return;
  playback.playing = true;
  playback.lastTimestamp = null;
  updatePlaybackButtons();
  playback.animationId = requestAnimationFrame(animationFrame);
}

function stepSimulation(direction) {
  pauseSimulation();
  playback.time = Math.max(0, playback.time + direction * FRAME_STEP);
  renderDisk();
  updatePlaybackButtons();
}

function enablePressAndHold(button, direction) {
  let holdDelay = null;
  let repeatTimer = null;
  let pointerHandled = false;

  function stopRepeating() {
    if (holdDelay !== null) clearTimeout(holdDelay);
    if (repeatTimer !== null) clearInterval(repeatTimer);
    holdDelay = null;
    repeatTimer = null;
  }

  function repeatStep() {
    if (button.disabled) {
      stopRepeating();
      return;
    }
    stepSimulation(direction);
  }

  function finishPointerInteraction() {
    stopRepeating();
    window.setTimeout(() => {
      pointerHandled = false;
    }, 0);
  }

  button.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || button.disabled) return;
    event.preventDefault();
    pointerHandled = true;
    button.setPointerCapture(event.pointerId);
    stepSimulation(direction);
    holdDelay = window.setTimeout(() => {
      repeatStep();
      repeatTimer = window.setInterval(repeatStep, 34);
    }, 300);
  });

  button.addEventListener("pointerup", finishPointerInteraction);
  button.addEventListener("pointercancel", finishPointerInteraction);
  button.addEventListener("lostpointercapture", finishPointerInteraction);
  button.addEventListener("click", (event) => {
    if (pointerHandled) {
      pointerHandled = false;
      event.preventDefault();
      return;
    }
    stepSimulation(direction);
  });
}

function restartSimulation() {
  pauseSimulation();
  playback.time = 0;
  renderDisk();
  updatePlaybackButtons();
}

settingsPanelToggle.addEventListener("click", () => togglePanel("settings"));
resultsPanelToggle.addEventListener("click", () => togglePanel("results"));
themeButtons.forEach((button) =>
  button.addEventListener("click", () => setTheme(button.dataset.theme)),
);
fullscreenButton.addEventListener("click", toggleFullscreen);
zoomInButton.addEventListener("click", () => changeApplicationZoom(1));
zoomOutButton.addEventListener("click", () => changeApplicationZoom(-1));
resetViewButton.addEventListener("click", resetView);
physicsInfoButton.addEventListener("click", () => physicsInfoDialog.showModal());
closePhysicsInfoButton.addEventListener("click", () => physicsInfoDialog.close());
physicsInfoDialog.addEventListener("click", (event) => {
  if (event.target === physicsInfoDialog) physicsInfoDialog.close();
});
restartButton.addEventListener("click", restartSimulation);
playButton.addEventListener("click", playSimulation);
pauseButton.addEventListener("click", pauseSimulation);
enablePressAndHold(stepBackwardButton, -1);
enablePressAndHold(stepForwardButton, 1);
document.addEventListener("fullscreenchange", updateFullscreenButton);
document
  .querySelector(".simulation-area")
  .addEventListener("transitionend", () => {
    renderDisk();
    renderView();
  });

connectBoundedControl({
  key: "radius",
  range: radiusRange,
  number: radiusNumber,
  minimum: () => 0.1,
  maximum: () => 10,
  afterChange: () => {
    syncRhoLimit();
    restartSimulation();
  },
});

connectBoundedControl({
  key: "rho",
  range: rhoRange,
  number: rhoNumber,
  minimum: () => 0,
  maximum: () => simulation.radius,
  afterChange: restartSimulation,
});

connectBoundedControl({
  key: "mass",
  range: massRange,
  number: massNumber,
  minimum: () => 0.1,
  maximum: () => 5,
  afterChange: restartSimulation,
});

connectUnboundedControl("omega", omegaRange, omegaNumber);
connectUnboundedControl("alpha", alphaRange, alphaNumber);
[omegaRange, omegaNumber, alphaRange, alphaNumber].forEach((control) => {
  control.addEventListener("input", restartSimulation);
  control.addEventListener("change", restartSimulation);
});
[showGeometryCheckbox, showVectorsCheckbox, showTranslationalVelocityCheckbox,
  showRotationalVelocityCheckbox, showTracesCheckbox].forEach(
  (checkbox) => checkbox.addEventListener("change", renderDisk),
);

pointA.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  event.preventDefault();
  draggedPointerId = event.pointerId;
  pointA.classList.add("is-dragging");
  pointA.setPointerCapture(event.pointerId);
  updatePointFromPointer(event);
});

pointA.addEventListener("pointermove", (event) => {
  if (event.pointerId !== draggedPointerId) return;
  event.preventDefault();
  updatePointFromPointer(event);
});

function finishPointDrag(event) {
  if (event.pointerId !== draggedPointerId) return;
  draggedPointerId = null;
  pointA.classList.remove("is-dragging");
}

pointA.addEventListener("pointerup", finishPointDrag);
pointA.addEventListener("pointercancel", finishPointDrag);
pointA.addEventListener("lostpointercapture", finishPointDrag);

pointA.addEventListener("keydown", (event) => {
  const rhoStep = simulation.radius / 100;

  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
    const direction = event.key === "ArrowUp" ? 1 : -1;
    simulation.rho = clamp(
      simulation.rho + direction * rhoStep,
      0,
      simulation.radius,
    );
    rhoRange.value = String(simulation.rho);
    rhoNumber.value = compactNumber(simulation.rho);
    restartSimulation();
  }
});

const savedTheme = localStorage.getItem("rotation-lab-theme");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
  ? "dark"
  : "light";

setTheme(savedTheme || systemTheme, false);
updateFullscreenButton();
updatePlaybackButtons();
syncRhoLimit();
updateUnboundedRange(omegaRange, simulation.omega);
updateUnboundedRange(alphaRange, simulation.alpha);
renderStaticLatex();
initializeDraggableLabels();
applyApplicationZoom();
window.addEventListener("resize", () =>
  requestAnimationFrame(() => {
    renderDisk();
    renderView();
  }),
);
