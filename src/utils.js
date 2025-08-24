export const modeRandomTie = (arr) => {
  console.log('finding the mode in', arr)
  if (!Array.isArray(arr) || arr.length === 0) return undefined;

  const counts = new Map();
  let max = 0;

  for (const v of arr) {
    const n = (counts.get(v) || 0) + 1;
    counts.set(v, n);
    if (n > max) max = n;
  }

  const top = [];
  for (const [v, n] of counts) {
    if (n === max) top.push(v);
  }

  return top[Math.floor(Math.random() * top.length)];
}