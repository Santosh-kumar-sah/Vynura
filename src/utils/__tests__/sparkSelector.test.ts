import { SPARK_ACTIVITIES, getSparkById } from '../../data/sparkActivities';
import { getTodaysSpark, completeSparkActivity } from '../sparkSelector';

console.log('Testing Quick Spark Micro-Activity System...');

// 1. Verify pool count and constraints
console.assert(SPARK_ACTIVITIES.length >= 15, `Expected at least 15 spark activities, found ${SPARK_ACTIVITIES.length}`);
for (const act of SPARK_ACTIVITIES) {
  console.assert(act.durationSeconds <= 120, `Activity ${act.id} exceeds 120s limit (${act.durationSeconds}s)`);
  console.assert(Boolean(act.title && act.instructions && act.iconName), `Activity ${act.id} missing required fields`);
}

// 2. Lookup test
const doodleSpark = getSparkById('spark_doodle_mood');
console.assert(doodleSpark !== undefined, 'spark_doodle_mood should exist');
console.assert(doodleSpark?.category === 'creative', 'category should be creative');

// 3. Selection and completion test
getTodaysSpark().then(async (spark) => {
  if (spark) {
    console.assert(Boolean(spark.id), 'Selected spark must have an ID');
    console.assert(spark.durationSeconds <= 120, 'Selected spark must be <= 120 seconds');
    console.log('Today Spark selected successfully:', spark.title);

    const comp = await completeSparkActivity(spark.id);
    console.assert(comp.streak.current_streak >= 1, 'Current streak should be at least 1');
  }
});

console.log('All Quick Spark sanity checks passed!');
