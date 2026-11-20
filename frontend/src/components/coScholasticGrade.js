export const getCoScholasticGrade = (average) => {
  const score = Number(average);
  if (!Number.isFinite(score) || score < 0 || score > 5) return "—";
  if (score > 4) return "A";
  if (score > 3) return "B";
  if (score > 2) return "C";
  if (score > 1) return "D";
  return "E";
};
