// ------------------------------------------------------------
//  DOM
// ------------------------------------------------------------
const form          = document.getElementById('converter-form');
const gpaInput      = document.getElementById('gpa-input');
const fromScale     = document.getElementById('from-scale');
const toScale       = document.getElementById('to-scale');
const swapBtn       = document.getElementById('swap-btn');
const errorBox      = document.getElementById('error-box');
const errorText     = document.getElementById('error-text');
const resultSection = document.getElementById('result-section');
const resultInput   = document.getElementById('result-input');
const resultOutput  = document.getElementById('result-output');
const formulaText   = document.getElementById('formula-text');
 
const ruler         = document.getElementById('ruler');
const rulerFrom     = document.getElementById('ruler-from');
const rulerTo       = document.getElementById('ruler-to');
const rulerNameFrom = document.getElementById('ruler-name-from');
const rulerNameTo   = document.getElementById('ruler-name-to');
const pinTagFrom    = document.getElementById('pin-tag-from');
const pinTagTo      = document.getElementById('pin-tag-to');
 
 
// ------------------------------------------------------------
//  Conversion: converted = (original ÷ original max) × target max
// ------------------------------------------------------------
function convertGPA(original, fromMax, toMax) {
  return (original / fromMax) * toMax;
}
 
// Display only. All maths uses the unrounded values.
function fmt(n) {
  return n.toFixed(2);
}
 
// Scale labels without a trailing ".0": 10 -> "10", 4.33 -> "4.33"
function scaleLabel(max) {
  return String(max);
}
 
 
// ------------------------------------------------------------
//  Validation. Returns an error message, or null when valid.
// ------------------------------------------------------------
function validate(rawValue, from, to) {
  if (rawValue === '') {
    return 'Enter your GPA or CGPA.';
  }
 
  const value = parseFloat(rawValue);
  if (Number.isNaN(value)) {
    return 'Enter a valid number.';
  }
  if (value < 0) {
    return 'A GPA cannot be negative.';
  }
 
  if (!from || !to) {
    return 'Choose both scales.';
  }
  if (parseFloat(from) === parseFloat(to)) {
    return 'Choose two different scales.';
  }
  if (value > parseFloat(from)) {
    return `Your grade (${value}) is higher than the top of the ${parseFloat(from)} scale.`;
  }
 
  return null;
}
 
function showError(message) {
  errorText.textContent = message;
  errorBox.classList.add('show');
  resultSection.classList.remove('show');
}
 
function hideError() {
  errorBox.classList.remove('show');
  errorText.textContent = '';
}
 
 
// ------------------------------------------------------------
//  Ruler: draws tick marks and moves the pin to the same
//  relative position on both scales
// ------------------------------------------------------------
function buildTicks(track, max) {
  track.textContent = '';
 
  const positions = [];
  for (let i = 0; i <= Math.floor(max); i++) positions.push(i);
  if (!Number.isInteger(max)) positions.push(max);
 
  positions.forEach((value) => {
    const tick  = document.createElement('span');
    const mark  = document.createElement('i');
    const label = document.createElement('b');
 
    tick.className  = 'tick';
    tick.style.left = `${(value / max) * 100}%`;
    label.textContent = String(value);
 
    tick.append(mark, label);
    track.append(tick);
  });
}
 
function updateRuler(fromMax, toMax, original, converted) {
  buildTicks(rulerFrom, fromMax);
  buildTicks(rulerTo, toMax);
 
  rulerNameFrom.textContent = `/ ${scaleLabel(fromMax)}`;
  rulerNameTo.textContent   = `/ ${scaleLabel(toMax)}`;
  pinTagFrom.textContent    = fmt(original);
  pinTagTo.textContent      = fmt(converted);
 
  // Start at zero, then move to the real position so the pin slides in.
  ruler.style.setProperty('--pos', 0);
  void ruler.offsetWidth;
  requestAnimationFrame(() => {
    ruler.style.setProperty('--pos', original / fromMax);
  });
}
 
 
// ------------------------------------------------------------
//  Convert
// ------------------------------------------------------------
function handleConvert() {
  const rawValue = gpaInput.value.trim();
  const error = validate(rawValue, fromScale.value, toScale.value);
 
  if (error) {
    showError(error);
    return;
  }
  hideError();
 
  const original  = parseFloat(rawValue);
  const fromMax   = parseFloat(fromScale.value);
  const toMax     = parseFloat(toScale.value);
  const converted = convertGPA(original, fromMax, toMax);
 
  resultInput.replaceChildren(
    document.createTextNode(fmt(original)),
    smallText(`/ ${scaleLabel(fromMax)}`)
  );
  resultOutput.replaceChildren(
    document.createTextNode(fmt(converted)),
    smallText(`/ ${scaleLabel(toMax)}`)
  );
 
  formulaText.textContent =
    `(${fmt(original)} ÷ ${scaleLabel(fromMax)}) × ${scaleLabel(toMax)} = ${fmt(converted)}`;
 
  resultSection.classList.add('show');
  updateRuler(fromMax, toMax, original, converted);
 
  resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
 
function smallText(text) {
  const el = document.createElement('small');
  el.textContent = text;
  return el;
}
 
 
// ------------------------------------------------------------
//  Swap scales. Re-converts only when there is a valid result on screen.
// ------------------------------------------------------------
function handleSwap() {
  const fromVal = fromScale.value;
  fromScale.value = toScale.value;
  toScale.value = fromVal;
 
  if (resultSection.classList.contains('show')) {
    handleConvert();
  }
}
 
 
// ------------------------------------------------------------
//  Clear stale results when an input changes
// ------------------------------------------------------------
function clearResults() {
  resultSection.classList.remove('show');
  hideError();
}
 
 
// ------------------------------------------------------------
//  Events
// ------------------------------------------------------------
form.addEventListener('submit', (e) => {
  e.preventDefault();
  handleConvert();
});
 
swapBtn.addEventListener('click', handleSwap);
 
gpaInput.addEventListener('input', clearResults);
fromScale.addEventListener('change', clearResults);
toScale.addEventListener('change', clearResults);
 