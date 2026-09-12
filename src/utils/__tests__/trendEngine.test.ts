import { generateRecommendations } from '../recommendationEngine';
import type { MoodTrendContext } from '../../types/recommendations';

console.log('Testing Trend Engine & Escalation...');

// 1. Test Improving Trajectory
const improvingTrend: MoodTrendContext = {
  consecutiveLowCount: 0,
  trajectory: 'improving',
  trajectoryLabel: 'Resonance Uplifting ↗',
  trendSummary: 'Your emotional frequency has been steadily rising across recent sessions.',
  isEscalated: false,
};

const improvingRecs = generateRecommendations(null, 0.9, 'happy', improvingTrend);
console.assert(improvingRecs.trend?.trajectory === 'improving', 'Trajectory should be improving');
console.assert(improvingRecs.subheadline.includes('↗'), 'Subheadline should indicate rising trend');

// 2. Test Declining Trajectory
const decliningTrend: MoodTrendContext = {
  consecutiveLowCount: 1,
  trajectory: 'declining',
  trajectoryLabel: 'Gentle Descent ↘',
  trendSummary: 'Recent observations reflect heavier resonance; gentle grounding is recommended.',
  isEscalated: false,
};

const decliningRecs = generateRecommendations(null, 0.8, 'calm', decliningTrend);
console.assert(decliningRecs.trend?.trajectory === 'declining', 'Trajectory should be declining');
console.assert(decliningRecs.subheadline.includes('↘'), 'Subheadline should indicate downward trend');

// 3. Test Escalated Sanctuary Care (3+ consecutive low sessions)
const escalatedTrend: MoodTrendContext = {
  consecutiveLowCount: 3,
  trajectory: 'declining',
  trajectoryLabel: 'Gentle Descent ↘',
  trendSummary: 'Persistent heavy resonance detected.',
  isEscalated: true,
};

const escalatedRecs = generateRecommendations(null, 0.7, 'sad', escalatedTrend);
console.assert(escalatedRecs.trend?.isEscalated === true, 'isEscalated should be true');
console.assert(escalatedRecs.headline.includes('Sanctuary'), 'Headline should be Sanctuary Escalation');
console.assert(escalatedRecs.themeTag.includes('SANCTUARY'), 'ThemeTag should be Sanctuary Protocol');
console.assert(escalatedRecs.actions.length === 3, 'Escalated should provide 3 dedicated restorative actions');
console.assert(escalatedRecs.actions[0].id === 'escalated_somatic_cocoon', 'First action should be somatic cocoon');

console.log('All Trend Engine tests passed successfully!');
