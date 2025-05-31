export const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

export const euclideanMod = (n: number, m: number): number => ((n % m) + m) % m;

export const lerp = (x: number, y: number, t: number): number => (1 - t) * x + t * y;

export const smoothstep = (x: number, min: number, max: number): number => {
  if (x <= min) return 0;
  if (x >= max) return 1;

  x = (x - min) / (max - min);

  return x * x * (3 - 2 * x);
};

export const DegreeToRadian = Math.PI / 180;
export const degreeToRadian = (degrees: number): number => degrees * DegreeToRadian;

export const RadianToDegree = 180 / Math.PI;
export const radianToDegree = (radians: number): number => radians * RadianToDegree;
