// ============================================================
//  STEP 1: GRAB ALL DOM ELEMENTS
// ============================================================
const gpaInput      = document.getElementById('gpa-input');
const fromScale     = document.getElementById('from-scale');
const toScale       = document.getElementById('to-scale');
const convertBtn    = document.getElementById('convert-btn');
const swapBtn       = document.getElementById('swap-btn');
const errorBox      = document.getElementById('error-box');
const errorText     = document.getElementById('error-text');
const resultSection = document.getElementById('result-section');
const resultInput   = document.getElementById('result-input');
const resultOutput  = document.getElementById('result-output');
const formulaText   = document.getElementById('formula-text');


// ============================================================
//  STEP 2: THE UNIVERSAL FORMULA
//  Converted = (Original ÷ Original Max) × Target Max
// ============================================================
function convertGPA(original, fromMax, toMax) {
  return (original / fromMax) * toMax;
}


// ============================================================
//  STEP 3: VALIDATION FUNCTION
//  Returns error message string or null if valid
// ============================================================
function validate(value, from, to) {

  // Check if GPA field is empty
  if (value === '') {
    return 'Please enter your GPA / CGPA value.';
  }

  // Check if scales are selected
  if (!from || !to) {
    return 'Please select both From and To scales.';
  }

  // Check if same scale selected
  if (from === to) {
    return 'From and To scales cannot be the same. Please select different scales.';
  }

  const numValue = parseFloat(value);

  // Check if value is a valid number
  if (isNaN(numValue)) {
    return 'Please enter a valid number.';
  }

  // Check if value is negative
  if (numValue < 0) {
    return 'GPA / CGPA cannot be negative.';
  }

  // Check if value exceeds the from scale max
  if (numValue > parseFloat(from)) {
    return `Your GPA (${numValue}) cannot exceed the maximum of ${from}.`;
  }

  return null; // no errors ✅
}


// ============================================================
//  STEP 4: SHOW / HIDE ERROR
// ============================================================
function showError(message) {
  errorText.textContent = message;
  errorBox.classList.add('show');
  resultSection.classList.remove('show'); // hide results on error
}

function hideError() {
  errorBox.classList.remove('show');
  errorText.textContent = '';
}


// ============================================================
//  STEP 5: MAIN CONVERT FUNCTION
// ============================================================
function handleConvert() {

  const rawValue  = gpaInput.value.trim();
  const fromValue = fromScale.value;
  const toValue   = toScale.value;

  // --- Validate ---
  const error = validate(rawValue, fromValue, toValue);
  if (error) {
    showError(error);
    return;
  }

  hideError();

  // --- Parse numbers ---
  const original  = parseFloat(rawValue);
  const fromMax   = parseFloat(fromValue);
  const toMax     = parseFloat(toValue);

  // --- Run the universal formula ---
  const converted = convertGPA(original, fromMax, toMax);

  // --- Round to 2 decimal places ---
  const roundedConverted = Math.round(converted * 100) / 100;
  const roundedOriginal  = Math.round(original  * 100) / 100;

  // --- Display Results ---
  resultInput.textContent  = `${roundedOriginal} / ${fromMax}`;
  resultOutput.textContent = `${roundedConverted} / ${toMax}`;

  // --- Display Formula Used ---
  formulaText.textContent =
    `( ${roundedOriginal} ÷ ${fromMax} ) × ${toMax} = ${roundedConverted}`;

  // --- Show result section ---
  resultSection.classList.add('show');

  // --- Smooth scroll to results on mobile ---
  resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}


// ============================================================
//  STEP 6: SWAP BUTTON FUNCTION
//  Swaps the From and To scale dropdowns instantly
// ============================================================
function handleSwap() {
  const fromVal = fromScale.value;
  const toVal   = toScale.value;

  // Swap the values
  fromScale.value = toVal;
  toScale.value   = fromVal;

  // If there's already a result showing, re-convert with swapped scales
  if (resultSection.classList.contains('show')) {
    handleConvert();
  }
}


// ============================================================
//  STEP 7: CLEAR RESULTS WHEN USER CHANGES INPUTS
//  Prevents stale results from showing
// ============================================================
function clearResults() {
  resultSection.classList.remove('show');
  hideError();
}


// ============================================================
//  STEP 8: EVENT LISTENERS
// ============================================================

// Main convert button
convertBtn.addEventListener('click', handleConvert);

// Press Enter in input field
gpaInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleConvert();
});

// Swap button
swapBtn.addEventListener('click', handleSwap);

// Clear results when user changes anything
gpaInput.addEventListener('input',  clearResults);
fromScale.addEventListener('change', clearResults);
toScale.addEventListener('change',   clearResults);