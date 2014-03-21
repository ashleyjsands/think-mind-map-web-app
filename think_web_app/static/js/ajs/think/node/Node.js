/**
 * @fileoverview The Node class and related functions.
 */


goog.provide('ajs.think.Node');
goog.provide('ajs.think.node');

goog.require('ajs.math');
goog.require('ajs.Point');
goog.require('ajs.utils');
goog.require('ajs.utils.canvas');
goog.require('ajs.Dimensions');


/**
 * The Node class represents the point and text of a Node in a thought.
 * 
 * @constructor
 */
ajs.think.Node = function(x, y, text, id) {
	
  // Properties
  this.id = id; // This is used by the Server.
  this.x = x;
  this.y = y;
  this._text = text;
  this._displayText = null;
  var that = this;
  
  this.__defineGetter__('text', function() { return this._text; });
  this.__defineSetter__('text', function(value) { this._text = value; this._displayText = null; });

  // Methods

  /**
   * Computes the inner radius of the Node based on its text and the given context.
   * 
   * @param {CanvasRenderingContext2D} context the canvas context.
   * @return {number} the inner radius of the Node.
   */
  this.innerRadiusBasedOnText = function(context, options) {
    return ajs.utils.canvas.textLength(context, this.text, options.nodeFontStyle)  / 2;
  }

  /**
   * Computes the radius of the Node based on its text and the given context.
   * 
   * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {ajs.Options} option the options for the Web App.
   * @return {number} the inner radius of the Node.
   */
  this.radius = function(context, options) {
    var innerRadius;
    if (!options) {
      this._text = this._text;
    }
    if (options.wrapNodeText) {
      innerRadius = ajs.think.node.radiusBasedOnWrappedText(context, options, this.getDisplayText(context, options));
    } else {
      innerRadius = this.innerRadiusBasedOnText(context, options);
    }
    return Math.max(innerRadius, options.minimumTextWidth) + options.nodePadding;	
  }
  
  /**
   * Gets the Display Text, an array of lines that are optimised to be drawn within the smallest node possible.
   *
   * @param {CanvasRenderingContext2D} context the canvas context.
   * @param {ajs.Options} option the options for the Web App.
   * @return {Array(string)} the display lines in form of an array of strings.
   */
  this.getDisplayText = function(context, options) {
    if (options.wrapNodeText) {
      if (this._displayText == null) {
        if (options.wrapNodeTextGreedy) {
          this._displayText = ajs.think.node.computeDisplayTextWithGreed(context, options, this);
        } else {
          this._displayText = ajs.think.node.computeDisplayTextByAveragingWords(context, options, this);
        }
      }
      return this._displayText;
    } else {
      return [this.text];
    }
  }
}

// Related functions

/**
 * Computes the way to display Text within the smallest circle possible by finding the average width between the
 * widths of the longest line block and the biggest number of lines block.
 * 
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {ajs.Options} option the options for the Web App.
 * @return {Array(string)} the display lines in form of an array of strings.
 */
ajs.think.node.computeDisplayTextByAveragingExtremes = function(context, options, node) {
    // Get the "one line" dimensions
    var oneLineHeight = options.nodeFontSize;
    var oneLineWidth = context.measureText(node.text).width;
    
    var whiteSpace = " ";
    var lines = node.text.split(whiteSpace);
    
    // Get the "multi lines" dimensions
    var multiLinesHeight = lines.length * options.nodeFontSize;
    var biggestLine = 0;
    var lineWidths = [];
    for (var i = 0; i < lines.length; i++) {
      var lineWidth = ajs.utils.canvas.textLength(context, lines[i], options.nodeFontStyle);
      lineWidths.push(lineWidth);
      if (biggestLine < lineWidth) {
        biggestLine = lineWidth;
      }
    }
    
    // Find the averages.
    var avgWidth = (oneLineWidth + ajs.avg(lineWidths)) / 2;
    if (avgWidth < biggestLine) { // 
      avgWidth = biggestLine;
    }
    
    return ajs.think.node.breakTextIntoSizeOfLines(context, options, node.text, avgWidth); 
}

/**
 * Breaks a given text the best it can into the size of lines specified.
 * 
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {ajs.Options} option the options for the Web App.
 * @param {string} text the string to be broken up.
 * @param {number} sizeOfLines the size of lines to try to break it up.
 * @return {string} the resulting broken string.
 */
ajs.think.node.breakTextIntoSizeOfLines = function(context, options, text, sizeOfLines) {
  // Fit as many words into lines of size "numOfLines".
  var index;
  var currentPos = 0;
  var result = [];
  var currentLine = "";
    
  while (currentPos < text.length) {
    index = text.indexOf(ajs.constants.whiteSpace, currentPos);
    if (index == -1) {
      index = text.length;
    }
    var subStr = text.substring(currentPos, index);

    if (subStr != ajs.constants.whiteSpace) {
      
      // This next block is to stop a space being prefixed to the line.
      var possibleCurrentLine;
      if (currentLine == "") {
        possibleCurrentLine = subStr;
      } else {
        possibleCurrentLine = currentLine + ajs.constants.whiteSpace + subStr;
      }
        
      if (ajs.utils.canvas.textLength(context, possibleCurrentLine, options.nodeFontStyle) <= sizeOfLines) { // If the subStr can fit into the currentLine.
        currentLine = possibleCurrentLine;
      } else {
        // Push the currentLine and then turn currentLine into the subStr.
        if (!ajs.utils.isEmptyOrNull(currentLine)) {
          result.push(currentLine);
        }
        currentLine = subStr; 
      }
        
      if (ajs.utils.canvas.textLength(context, currentLine, options.nodeFontStyle) == sizeOfLines) {
        result.push(currentLine);
        currentLine = ""; 
      }
    } else if (subStr == "") { // The index is pointing at the end of the string, push the currentLine and finish.
      result.push(currentLine);
    }
    currentPos = index + 1;
  }
  if (currentLine != "") {
    result.push(currentLine);
  }
  return result;
}

/**
 * Computes the way to display Text within the smallest circle possible by using a greedy method of computing
 * all possible display texts and finding the one that fits within the smallest circle.
 * 
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {ajs.Options} option the options for the Web App.
 * @return {ajs.think.Node} node the node.
 * @return {Array(string)} the display lines in form of an array of strings.
 */
ajs.think.node.computeDisplayTextWithGreed = function(context, options, node) {
  var lines = node.text.split(ajs.constants.whiteSpace);
  var displayTexts = ajs.think.node.concateAllOrderedStringCombinations(lines);
  
  var smallestDisplayText = null;
  var smallestDisplayTextRadius = null;
  for (var i=0; i < displayTexts.length; i++) {
    var radius = ajs.think.node.radiusBasedOnWrappedText(context, options, displayTexts[i]);
    
    if (smallestDisplayTextRadius == null || radius < smallestDisplayTextRadius) {
      smallestDisplayTextRadius = radius;
      smallestDisplayText = displayTexts[i];
    }
  }
  
  return smallestDisplayText;
}

/**
 * Computes the Display text by averaging the size of each word.
 * 
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {ajs.Options} option the options for the Web App.
 * @return {ajs.think.Node} node the node.
 * @return {Array(string)} the display lines in form of an array of strings.
 */
ajs.think.node.computeDisplayTextByAveragingWords = function(context, options, node) {
  var lines = node.text.split(ajs.constants.whiteSpace);
  var totalSize = 0;
  for (var i=0; i < lines.length; i++) {
    totalSize += ajs.utils.canvas.textLength(context, lines[i], options.nodeFontStyle);
  }
  var avgWordWidth = totalSize / lines.length;
  var avgWordHeight = options.nodeFontSize;
  var numOfWords = lines.length;
  
  // Find the average area of the text.
  var inefficiencyRatio = 1.7; // A guess at what the inefficiency of the word wrapping algorithm is.
  var avgArea = avgWordWidth * avgWordHeight * numOfWords * inefficiencyRatio;
  // Lets try to fit the text into a square, so that means that the area is the area of a square.
  var width = Math.ceil(Math.sqrt(avgArea));
  
  return ajs.think.node.breakTextIntoSizeOfLines(context, options, node.text, width); 
}

/**
 * Computes the radius of the wrapped text.
 * 
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {Array(string)} wrappedText an array strings representing a block of wrapped text.
 * @return {number} the radius of the wrapped text.
 */
ajs.think.node.radiusBasedOnWrappedText = function(context, options, wrappedText) {
  // Assumption: the text is going to be centered vertically and horizontally.
  // Let the centre of the text be point (0, 0).
  // The radius is defined by the wrappedText line that is the furtherest from the origin.
  // Foreach line compute the top right point of the line and then find the absolute distance to the origin.
  var radius = 0;
  var origin = new ajs.Point(0, 0);

  for (var i = 0; i < wrappedText.length; i++) {
    var line = wrappedText[i];
    var x = ajs.utils.canvas.textLength(context, line, options.nodeFontStyle) / 2; // Because the line is centered.
    var y = options.nodeFontSize * ((wrappedText.length / 2) - i);
    var absDist = ajs.math.absoluteDistance(origin, new ajs.Point(x, y));
    if (radius < absDist) {
      radius = absDist;
    }
  }
  return radius;
}

/**
 * Computes the distance between the centre of the Node and the centre of the actions.
 * 
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {ajs.Options} option the options for the Web App.
 * @param {ajs.think.Node} nodes the node.
 */
ajs.think.node.distanceBetweenNodeCentreAndActionCentre = function(context, options, node) {
  return node.radius(context, options) + options.actionMargin + options.actionRadius;
}

/**
 * Creates a Node.
 * 
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {ajs.Options} option the options for the Web App.
 * @param {Array(ajs.think.Node)} nodes a list of nodes.
 * @param {Array(Array(ajs.think.Node))} connections the connections between the nodes.
 * @param {ajs.think.Node} baseNode the node that the created one will be connected to.
 * @return {ajs.think.Node} the node that is created.
 */
ajs.think.node.createNode = function(context, options, nodes, connections, baseNode) {  
  // Create the Node ontop of the baseNode with empty text.
  var createdNode = new ajs.think.Node(baseNode.x, baseNode.y, "");
  var absDist = baseNode.radius(context, options) + createdNode.radius(context, options) + options.createdNodeDistance;
  // Move the createdNode up (up is down on the y-axis).
  createdNode.y = createdNode.y - absDist;
  
  nodes.push(createdNode);
  ajs.think.node.connectNodes(connections, baseNode, createdNode);
  
  return createdNode;
}

/**
 * Connects two nodes together.
 * 
 * @param {Array(Array(ajs.think.Node))} connections the connections between the nodes.
 * @param {ajs.think.Node} nodeOne the first node.
 * @param {ajs.think.Node} nodeOne the second node.
 * @returns {bool} true if the nodes are connected, false otherwise.
 */
ajs.think.node.connectNodes = function(connections, nodeOne, nodeTwo) {
  if (nodeOne != null && nodeOne != nodeTwo && nodeTwo != null) {
    // Check if the connection already exists.
    var exists = false;
    for (var i=0; i < connections.length; i++) {
      var nodeA = connections[i][0];
      var nodeB = connections[i][1];
      if ((nodeOne == nodeA && nodeTwo == nodeB) || (nodeOne == nodeB && nodeTwo == nodeA)) {
        exists = true;
      }
    }
    
    if (!exists) {
      connections.push([nodeOne, nodeTwo]);
      return true;
    }
  }
  return false;
}

/**
 * Destroys a Node.
 * 
 * @param {Array(ajs.think.Node)} nodes a list of nodes.
 * @param {Array(Array(ajs.think.Node))} connections the connections between the nodes.
 * @param {ajs.think.Node} destroyNode the node that will be destroyed.
 */
ajs.think.node.destroyNode = function(nodes, connections, destroyNode) {
  var removedFromNodes = false;
  for(var i = 0; i < nodes.length; i++) {
    if (nodes[i] === destroyNode) {
      nodes.splice(i, 1);
	    removedFromNodes = true;
	    break;
	  }
  }
  
  if (!removedFromNodes) {
    throw "The destroyNode was not removed from nodes.";
  }
  
  var destroyedAllAssociatedConnections = false;
  while (!destroyedAllAssociatedConnections) {
    var destroyIndex = -1;
    for(var i = 0; i < connections.length; i++) {
      if (connections[i][0] === destroyNode || connections[i][1] === destroyNode) {
	      destroyIndex = i;
	      break;
	    }
    }
	
	  if (destroyIndex != -1) {
      connections.splice(destroyIndex, 1);
	  } else {
	    destroyedAllAssociatedConnections = true;
	  }
  }
}

/**
 * Destroys a connection.
 * 
 * @param {Array(Array(ajs.think.Node))} connections the connections between the nodes.
 * @param {ajs.think.Node} connection the connection that will be destroyed.
 */
ajs.think.node.destroyConnection = function(connections, connection) {
  ajs.utils.removeElementFromArray(connection, connections);
}

/** 
 * Creates a ajs.think.Node object based on a JSON Node object that is the result of a RPC operation.
 *
 * @param jsonNode Node data in the form of a JSON object.
 * @returns an ajs.think.Node.
 */
ajs.think.node.createNodeBasedOnJsonObjects = function(jsonNode) {
  return new ajs.think.Node(jsonNode.x, jsonNode.y, jsonNode.text, jsonNode.id);
}

/**
 * Checks if two objects support the Node interface and are equal.
 * Note: this is primarily used for comparing JSON node objects to ajs.think.Node objects.
 * 
 * @param nodeOne the first "node" object.
 * @param nodeTwo the second "node" object.
 * @returns true if the "nodes" are equal, false otherwise.
 */
ajs.think.node.equalNodes = function(nodeOne, nodeTwo) {
  if (nodeOne == null || nodeTwo == null) {
    return false;
  }
  
  if (nodeOne.x != nodeTwo.x) {
    return false;
  } else if (nodeOne.y != nodeTwo.y) {
    return false;
  } else if (nodeOne.text != nodeTwo.text) {
    return false;
  } else {
    return true;
  }
}

/**
 * Culls the nodes based upon the given canvasDimensions.
 * 
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {ajs.Options} option the options for the Web App.
 * @param {ajs.Dimensions} canvasDimensions the dimensions of the Canvas.
 * @param {Array(ajs.think.Node)} nodes an array of nodes.
 * @returns {Array(ajs.think.Node)} an array of culled nodes.
 */
ajs.think.node.cullNodes = function(context, options, canvasDimensions, nodes) {
  var culledNodes = [];
  var canvasPolygonVertices = ajs.math.dimensionsToPolygonVertices(canvasDimensions);
  for (var i=0; i < nodes.length; i++) {
    if (ajs.math.circleInsideOfPolygon(nodes[i], nodes[i].radius(context, options), canvasPolygonVertices)) {
      culledNodes.push(nodes[i]);
    }
  }
  return culledNodes;
}

/**
 * Culls the connections based upon the given canvasDimensions.
 * 
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {ajs.Options} option the options for the Web App.
 * @param {ajs.Dimensions} canvasDimensions the dimensions of the Canvas.
 * @param {Array(Array(ajs.think.Node))} connections the connections between the nodes.
 * @returns {Array(Array(ajs.think.Node))} an array of culled node connections.
 */
ajs.think.node.cullConnections = function(context, options, canvasDimensions, connections) {
  var culledConnections = [];
  var canvasPolygonVertices = ajs.math.dimensionsToPolygonVertices(canvasDimensions);
  for (var i=0; i < connections.length; i++) {      
    if (ajs.math.polygonInsideOfPolygon(ajs.computeConnectionPolygonVertices(context, options, connections[i]), canvasPolygonVertices)) {
      culledConnections.push(connections[i]);
    }
  }
  return culledConnections;
}

/**
 * Computes the polygon vertices for the connection.
 * 
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {ajs.Options} option the options for the Web App.
 * @param {Array(ajs.think.Node)} connection the connection which is an Array of two Nodes.
 * @returns {Array(ajs.Point)} an array of polygon vertices.
 */
ajs.computeConnectionPolygonVertices = function(context, options, connection) {
  var x0 = connection[0].x;
  var y0 = connection[0].y;
  var x1 = connection[1].x;
  var y1 = connection[1].y;  
  var r0 = connection[0].radius(context, options);
  var r1 = connection[1].radius(context, options);
  var angle = null;
  if ((x1 - x0) == 0) {
    angle = ajs.math.degree2rad(90.0);
  } else {
    angle = Math.atan((y1 - y0) / (x1 - x0));
  }
  var topAngle = angle + ajs.math.degree2rad(90.0); 
  var bottomAngle = topAngle + ajs.math.degree2rad(180.0);
  var top0 = ajs.math.computePointOnCircle(x0, y0, r0, topAngle);
  var bottom0 = ajs.math.computePointOnCircle(x0, y0, r0, bottomAngle);
  var top1 = ajs.math.computePointOnCircle(x1, y1, r1, topAngle);
  var bottom1 = ajs.math.computePointOnCircle(x1, y1, r1, bottomAngle);
  return [top0, bottom0, bottom1, top1];
}

/**
 * Computes the Control Point value for a connection.
 * 
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {ajs.Options} option the options for the Web App.
 * @param {Array(ajs.think.Node)} connection the connection which is an Array of two Nodes.
 * @return {number} the control point value.
 */
ajs.think.node.computeConnectionControlPointValue = function(context, options, connection) {
  var node0 = connection[0];
  var node1 = connection[1];
  var r0 = node0.radius(context, options);
  var r1 = node1.radius(context, options);
  return -options.controlPointConstant / Math.min(r0, r1);
}

/**
 * Computes the two convex polygon vertices for the connection.
 * 
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {ajs.Options} option the options for the Web App.
 * @param {Array(ajs.think.Node)} connection the connection which is an Array of two Nodes.
 * @param {number} controlPointValue a value that determines the width of the connection. Set it to
 *   -50 for a small width, or set it to 1 for a big width.
 * @returns {Array(ajs.Point)} an array of array of polygon vertices.
 */
ajs.think.node.computeConnectionTwoConvexPolygonVertices = function(context, options, connection, controlPointValue) {
  var x0 = connection[0].x;
  var y0 = connection[0].y;
  var x1 = connection[1].x;
  var y1 = connection[1].y;  
  var r0 = connection[0].radius(context, options);
  var r1 = connection[1].radius(context, options);
  
  var angle = null;
  if ((x1 - x0) == 0) {
    angle = ajs.math.degree2rad(90.0);
  } else {
    angle = Math.atan((y1 - y0) / (x1 - x0));
  }
  var topAngle = angle + ajs.math.degree2rad(90.0); 
  var bottomAngle = topAngle + ajs.math.degree2rad(180.0);
  
  var top0 = ajs.math.computePointOnCircle(x0, y0, r0, topAngle);
  var bottom0 = ajs.math.computePointOnCircle(x0, y0, r0, bottomAngle);
  var top1 = ajs.math.computePointOnCircle(x1, y1, r1, topAngle);
  var bottom1 = ajs.math.computePointOnCircle(x1, y1, r1, bottomAngle);
  
  var middlePointX = (x0 + x1) / 2;
  var middlePointY = (y0 + y1) / 2;
  var controlTopX = middlePointX + Math.cos(topAngle) * controlPointValue; 
  var controlTopY = middlePointY + Math.sin(topAngle) * controlPointValue; 
  var controlTop = new ajs.Point(controlTopX, controlTopY);
  var controlBottomX = middlePointX + Math.cos(bottomAngle) * controlPointValue; 
  var controlBottomY = middlePointY + Math.sin(bottomAngle) * controlPointValue; 
  var controlBottom = new ajs.Point(controlBottomX, controlBottomY);

  // The order of the control vertices are backwards for some reason otherwise a bug occurs.
  return [[top0, bottom0, controlTop, controlBottom],[bottom1, top1, controlBottom, controlTop]];
}

/**
 * Computes a Bounding Box for the array of nodes.
 *
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {ajs.Options} option the options for the Web App.
 * @param {Array(ajs.think.Node)} nodes an array of nodes.
 * @param {number} padding the padding include in the bounding box.
 * @return {ajs.Dimensions} the bounding box.
 */
ajs.think.node.getBoundingBoxForNodes = function(context, options, nodes, padding) {
  var minX;
  var maxX;
  var minY;
  var maxY;
  
  if (nodes.length == 0) {
    return null;
  } else {
    minX = nodes[0].x;
    maxX = nodes[0].x;
    minY = nodes[0].y;
    maxY = nodes[0].y;
  }
  
  for (var i=0; i < nodes.length; i++) {
    var node = nodes[i];
    var r = node.radius(context, options);
    if (minX > node.x - r) {
      minX = node.x - r;
    }

    if (maxX < node.x + r) {
      maxX = node.x + r;
    }

    if (minY > node.y - r) {
      minY = node.y - r;
    }

    if (maxY < node.y + r) {
      maxY = node.y + r;
    }
  }
  
  // The width and height have '2 * padding' because the offsets negative the value of padding.
  return new ajs.Dimensions(minX - padding, minY - padding, maxX - minX + 2 * padding, maxY - minY + 2 * padding);
}
