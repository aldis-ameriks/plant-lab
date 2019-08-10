export function reduceDataPoints(data, period = 30) {
  const finalPointCount = Math.round(data.length / period);
  let epsilon = period;
  let pts = internalRamerDouglasPeucker(data, epsilon);
  let iteration = 0;
  // Iterate until the correct number of points is obtained
  while (pts.length != finalPointCount && iteration++ < 20) {
    epsilon *= Math.sqrt(pts.length / finalPointCount);
    pts = internalRamerDouglasPeucker(data, epsilon);
  }
  return pts;
}

function internalRamerDouglasPeucker(pts, eps) {
  const p = ramerDouglasPeuckerRecursive(pts, 0, pts.length - 1, eps);
  return p.concat([pts[pts.length - 1]]);
}

// Ramer-Douglas-Peucker algorithm
function ramerDouglasPeuckerRecursive(pts, first, last, eps) {
  if (first >= last - 1) {
    return [pts[first]];
  }

  const slope = (pts[last].y - pts[first].y) / (pts[last].x - pts[first].x);

  const x0 = pts[first].x;
  const y0 = pts[first].y;

  let iMax = first;
  let max = -1;
  let p, dy;

  // Calculate vertical distance
  for (let i = first + 1; i < last; i++) {
    p = pts[i];
    const y = y0 + slope * (p.x - x0);
    dy = Math.abs(p.y - y);

    if (dy > max) {
      max = dy;
      iMax = i;
    }
  }

  if (max < eps) {
    return [pts[first]];
  }

  const p1 = ramerDouglasPeuckerRecursive(pts, first, iMax, eps);
  const p2 = ramerDouglasPeuckerRecursive(pts, iMax, last, eps);

  return p1.concat(p2);
}
