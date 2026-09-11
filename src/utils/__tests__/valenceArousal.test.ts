import {
  computeValenceArousal,
  classifyMode,
  analyzeValenceArousal,
  runValenceArousalSanityChecks,
} from '../valenceArousal';

console.log('Testing Valence-Arousal calculation and classification...');

// Check sanity assertions
const sanityPassed = runValenceArousalSanityChecks();
console.assert(sanityPassed, 'Sanity check suite failed!');

// Additional spot-checks
const amplifyTest = computeValenceArousal({
  happy: 0.9,
  surprised: 0.5,
  neutral: 0.1,
  sad: 0,
  angry: 0,
  fearful: 0,
  disgusted: 0,
});
console.assert(amplifyTest.valence > 0, 'Amplify valence should be positive');
console.assert(amplifyTest.arousal > 0, 'Amplify arousal should be positive');
console.assert(
  classifyMode(amplifyTest.valence, amplifyTest.arousal) === 'amplify',
  'Mode should be amplify'
);

const sustainTest = analyzeValenceArousal({
  happy: 0.6,
  surprised: 0,
  neutral: 0.8,
  sad: 0,
  angry: 0,
  fearful: 0,
  disgusted: 0,
});
console.assert(sustainTest.mode === 'sustain', 'Mode should be sustain');

const regulateTest = analyzeValenceArousal({
  angry: 0.8,
  fearful: 0.4,
  surprised: 0.2,
  sad: 0.1,
  neutral: 0.1,
  happy: 0,
  disgusted: 0.2,
});
console.assert(regulateTest.mode === 'regulate', 'Mode should be regulate');

const supportTest = analyzeValenceArousal({
  sad: 0.8,
  neutral: 0.7,
  happy: 0,
  surprised: 0,
  angry: 0,
  fearful: 0,
  disgusted: 0.1,
});
console.assert(supportTest.mode === 'support', 'Mode should be support');

console.log('All Valence-Arousal tests passed successfully! ✨');
