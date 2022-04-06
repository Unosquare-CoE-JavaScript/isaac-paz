CoordinateSystem = {
  cartesian: 0,
  polar: 1,
};

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static newCartesianPoint(x, y) {
    return new Point(x, y);
  }

  static newPolarPoint(rho, theta) {
    return new Point(rho * Math.cos(theta), rho * Math.sin(theta));
  }
}


let p1 = Point.newCartesianPoint(4, 5);
console.log(p1);

let p2 = Point.newPolarPoint(5, Math.PI / 2);
console.log(p2);
