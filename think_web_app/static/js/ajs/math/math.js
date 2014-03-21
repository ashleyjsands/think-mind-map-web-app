/**
 * @fileoverview A collection of mathematical functions.
 */


goog.provide('ajs.math');

goog.require('ajs.Point');
goog.require('ajs.point');


// Constants
// Due to the inherit problems of floating numbers, there is a hack to make up for the bugs it causes.
ajs.math.almostPrecision = 0.0001;

/**
 * Converts an angle in degrees to radians.
 * 
 * @param {number} degrees an angle in degrees.
 * @return {number} the angle in radians.
 */
ajs.math.degree2rad = function(degrees) {
  return Math.PI / 180 * degrees;
}

/**
 * Converts an angle in radians to degrees.
 * 
 * @param {number} radians an angle in radians.
 * @return {number} the angle in degrees.
 */
ajs.math.rad2degree = function(radians) {
  return 180 / Math.PI * radians;
}

/**
 * Computes the absolute distance between two points.
 * 
 * @param {ajs.Point} pointA the first point.
 * @param {ajs.Point} pointB the second point.
 * @return {number} the absolute distance.
 */
ajs.math.absoluteDistance = function(pointA, pointB) {
  var squarePower = 2;
  var xDiff = pointA.x - pointB.x;
  var yDiff = pointA.y - pointB.y;
  return Math.sqrt(Math.pow(xDiff, squarePower) + Math.pow(yDiff, squarePower));
}

/**
 * Computes the average of an array of numbers.
 * 
 * @param {Array(number)} numbers the an array of numbers.
 * @return {number} the average of the array.
 */
ajs.math.avg = function(numbers) {
  var value = 0;
  for(var i = 0; i < numbers.length; i++) {
    value += numbers[i]; 
  }
  return value / numbers.length;
}

/**
 * Converts a Dimensions object into an array of Polygon Vertices.
 * 
 * @param {ajs.Dimensions} dimensions the dimensions instance.
 * @returns {Array(ajs.Point)} the Polygon vertices.
 */
ajs.math.dimensionsToPolygonVertices = function(dimensions) {
  var topLeft = new ajs.Point(dimensions.x, dimensions.y);
  var topRight = new ajs.Point(dimensions.x + dimensions.width, dimensions.y);
  var bottomRight = new ajs.Point(dimensions.x + dimensions.width, dimensions.y + dimensions.height);
  var bottomLeft = new ajs.Point(dimensions.x, dimensions.y + dimensions.height);
  return [topLeft, topRight, bottomRight, bottomLeft];
}
  
/**
 * Computes a point on a circle.
 * 
 * @param {number} x the x point of the centre of the circle.
 * @param {number} y the y point of the centre of the circle.
 * @param {number} r the radius of the circle.
 * @param {number} angle the angle of the point relative to the cirle in radians.
 * @returns {ajs.Point} the point on the circle.
 */
ajs.math.computePointOnCircle = function(x, y, r, angle) {
  return new ajs.Point(x + Math.cos(angle) * r, y + Math.sin(angle) * r);
} 

/**
 * Converts a circle into an array of Polygon Vertices.
 * 
 * @param {ajs.Point} circlePoint the centre point of the circle.
 * @param {number} circleRadius the radius of the circle.
 * @param {number} numberOfVertices the number of vertices to create in the array.
 * @returns {Array(ajs.Point)} the Polygon vertices.
 */
ajs.math.circleToPolygon = function(circlePoint, circleRadius, numberOfVertices) {
  var polygonVertices = [];
  var twoPiInDegrees = 360;
  for (var i=0; i < numberOfVertices; i++) {
    var angle = ajs.math.degree2rad(twoPiInDegrees / numberOfVertices * i);
    polygonVertices.push(ajs.math.computePointOnCircle(circlePoint.x, circlePoint.y, circleRadius, angle));
  }
  return polygonVertices;
}

/**
 * Checks if the circle is inside of the polygon.
 * 
 * @param {ajs.Point} circlePoint the centre point of the circle.
 * @param {number} circleRadius the radius of the circle.
 * @param {Array(ajs.Point)} polygonVertices an array of the Polygon vertices.
 * @returns {bool} true if the circle is inside of the polygon, false otherwise.
 */
ajs.math.circleInsideOfPolygon = function(circlePoint, circleRadius, polygonVertices) {
  var numberOfVertices = 8;
  return ajs.math.polygonInsideOfPolygon(ajs.math.circleToPolygon(circlePoint, circleRadius, numberOfVertices), polygonVertices);
}

/**
 * Checks if a polygon is inside of another.
 * 
 * @param {Array(ajs.Point)} innerPolygonVertices an array of the inner Polygon vertices.
 * @param {Array(ajs.Point)} outerPolygonVertices an array of the outer Polygon vertices.
 * @returns {bool} true if the inner polygon is inside of the outer polygon, false otherwise.
 */
ajs.math.polygonVerticesToEdges = function(polygonVertices) {
  var edges = [];
  for (var i=0; i < polygonVertices.length; i++) {
    if (i == polygonVertices.length - 1) {
      edges.push([polygonVertices[i], polygonVertices[0]]);
    } else {
      edges.push([polygonVertices[i], polygonVertices[i + 1]]);
    }
  }
  return edges;
}

/**
 * Checks if a polygon is inside of another.
 * 
 * @param {Array(ajs.Point)} innerPolygonVertices an array of the inner Polygon vertices.
 * @param {Array(ajs.Point)} outerPolygonVertices an array of the outer Polygon vertices.
 * @returns {bool} true if the inner polygon is inside of the outer polygon, false otherwise.
 */
ajs.math.polygonInsideOfPolygon = function(innerPolygonVertices, outerPolygonVertices) {
  for (var i=0; i < innerPolygonVertices.length; i++) {
    if (ajs.math.pointInPolygon(innerPolygonVertices[i], outerPolygonVertices)) {
      return true;
    }
  }
  return false;
}

/**
 * Checks if a point is in between two other points.
 * 
 * @param {ajs.Point} pointToBeChecked the point that is checked against the other two.
 * @param {ajs.Point} pointsOne the first point.
 * @param {ajs.Point} pointsTwo the second point.
 * @returns {bool} true if the point is in between the other two, false otherwise.
 */
ajs.math.pointBetweenPoints = function(pointToBeChecked, pointsOne, pointsTwo) {
  var minX = Math.min(pointsOne.x, pointsTwo.x);
  var maxX = Math.max(pointsOne.x, pointsTwo.x);
  var minY = Math.min(pointsOne.y, pointsTwo.y);
  var maxY = Math.max(pointsOne.y, pointsTwo.y);
  var x = pointToBeChecked.x;
  var y = pointToBeChecked.y;
  return minX <= x && x <= maxX && minY <= y && y <= maxY; 
}
  
/**
 * Checks if a point is on an edge.
 * 
 * @param {ajs.Point} point the point that is checked.
 * @param {Array(ajs.Point)} edge the edge.
 * @returns {bool} true if the point is on the edge, false otherwise.
 */
ajs.math.isPointOnEdge = function(point, edge) {
  if (!ajs.math.pointBetweenPoints(point, edge[0], edge[1])) {
    return false;
  }
  // Note that all logic from now on implicitly states that it is 
  // true that the point is between the edges
     
  // If the edge is vertical and the point is on the vertical (and must be between the points from the first conditional statement) 
  if (edge[0].x - edge[1].x == 0 && edge[0].x == point.x) {
    return true;
  } else if (edge[0].y - edge[1].y == 0 && edge[0].y == point.y) { // If the edge is horizontal and the point is on the horizontal (and must be between the points from the first conditional statement)
    return true;
  }

  var m = (edge[0].y - edge[1].y) / (edge[0].x - edge[1].x);
  // using the following equation: y = m * x + c
  var c = edge[0].y - m * edge[0].x; 
  // Now put the points x value into the equation
  var pointY = m * point.x + c;
  // If the value given by the formula is equal to the points value, then the point is on the edge
  return pointY == point.y;

}
    
/**
 * Computes the dot product of two 2d vectors.
 * 
 * @param {number} vectorOneX the x component of the first vector.
 * @param {number} vectorOneY the y component of the first vector.
 * @param {number} vectorTwoX the x component of the second vector.
 * @param {number} vectorTwoY the y component of the second vector.
 */
ajs.math.dotProduct = function(vectorOneX, vectorOneY, vectorTwoX, vectorTwoY) {
  return vectorOneX * vectorTwoX + vectorOneY * vectorTwoY;
}

/**
 * Checks if a point is in a polygon.
 * 
 * @param {ajs.Point} point the point that is checked.
 * @param {Array(ajs.Point)} polygonVertices an array of the Polygon vertices.
 * @returns {bool} true if the point is in the polygon, false otherwise.
 */
ajs.math.pointInPolygon = function(point, polygonVertices) {
  // Precondition, the polygon is convex.
  // Sum the angle between the points and each edge
  // If it is equal to 360 degrees, then the point is inside of polygon
  var angles = 0.0;
  var polygonEdges = ajs.math.polygonVerticesToEdges(polygonVertices);
  for (var i=0; i < polygonEdges.length; i++) {
    var edge = polygonEdges[i];
    if (ajs.point.pointsEqual(point, edge[0]) || ajs.point.pointsEqual(point, edge[1])){
      return true;
    }
    // If point is on edge
    if (ajs.math.isPointOnEdge(point, edge)) {
      return true;
    }
    // Find the angle        
    // Find the differences in x & y between the point and the two edge points
    var dxA = edge[0].x - point.x;
    var dyA = edge[0].y - point.y;
    var dxB = edge[1].x - point.x;
    var dyB = edge[1].y - point.y;
    // Treat the differences as vectors, find the angle of each 
    // vector and then subtract them
    // tan(angle) = y / x, hence angle = atan(y/x)

    // cos(angle) = A * B / (|A| * |B|)
    var magnitudeA = Math.sqrt(dxA * dxA + dyA * dyA);
    var magnitudeB = Math.sqrt(dxB * dxB + dyB * dyB);

    var angleBetween = ajs.math.rad2degree(Math.acos(ajs.math.dotProduct(dxA, dyA, dxB, dyB) / (magnitudeA * magnitudeB)));
    while (angleBetween > 360.0) {
      angleBetween -= 360.0;
    }
            
    angles += angleBetween;
  }
  return ajs.math.almostEquals(angles, 360.0);
}

/**
 * A hack to make up for problems with floating precision comparisons.
 * 
 * @param {number} numA a number.
 * @param {number} numB a number.
 * @return {boolean} true if the two numbers are almost equal, false otherwise.
 */
ajs.math.almostEquals = function(numA, numB) {
  return Math.abs(numA - numB) < ajs.math.almostPrecision;
}
