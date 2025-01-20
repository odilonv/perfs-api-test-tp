/* eslint-disable no-undef */
// Helper function to run load tests
export const executeLoadTest = async (testFunction, duration, users, responseDurations) => {
  const finishTime = Date.now() + duration;
  const tasks = [];

  for (let i = 0; i < users; i += 1) {
    tasks.push(
      (async () => {
        while (Date.now() < finishTime) {
          const startTime = Date.now();
          try {
            await testFunction();
          } catch (error) {
            console.error('Test failed:', error.message);
          } finally {
            const elapsedTime = Date.now() - startTime;
            responseDurations.push(elapsedTime);
          }
        }
      })()
    );
  }

  await Promise.all(tasks);
};

// Fonction pour calculer les percentiles
export function calculatePercentiles(arr, percentiles) {
  arr.sort((a, b) => a - b);
  return percentiles.reduce((acc, percentile) => {
    const index = Math.floor(percentile * arr.length);
    acc[percentile] = arr[index];
    return acc;
  }, {});
}
