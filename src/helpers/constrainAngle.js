function angleDist(targetA, sourceA) {
  let a = targetA - sourceA;
  if (a > PI) {
    a -= TWO_PI;
  } else if (a < -PI) {
    a += TWO_PI;
  }
  return abs(a);
}

function constrainAngle(a, minA, maxA) {
  if (minA <= a && a <= maxA) {
    return a;
  }

  if (angleDist(a, minA) < angleDist(a, maxA)) {
    return minA;
  }
  return maxA;
}

export default constrainAngle;
