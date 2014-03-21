/**
 * @fileoverview A collection of functions that handle mouse events for the canvas.
 */


goog.provide('ajs.MouseEntity');
goog.provide('ajs.mouseEntity');

goog.require('ajs.Point');
goog.require('ajs.point');
goog.require('ajs.mouse');
goog.require('ajs.utils');


/**
 * The MouseEntity class is an abstraction of entities that handle mouse events in a Canvas. 
 *
 * @constructor
 * @param {ajs.mouseEntity.type} type the type of the MouseEntity.
 * @param {ajs.mouseEntity.pointType} pointType the point type of the MouseEntity.
 * @param {number} zOrder the order that determines when the MouseEntity is processed for a click.
 * @param {Array} mouseFunctionDict an assoccative array of ajs.mouseEntity.types to their respective functions 
 *   invoked when the MouseEntity is processed for a mouse event. There are interfaces for these functions in 
 *   ajs.mouseEntity.mouseFunction.
 * @param {Array} noEventFunctionDict an assoccative array of ajs.mouseEntity.types to their respective functions 
 *   invoked when the MouseEntity is produces no event. There are interfaces for these functions in 
 *   ajs.mouseEntity.mouseFunction.
 * @param {Array} globalNoEventFunctionDict an assoccative array of ajs.mouseEntity.types to their respective functions 
 *   invoked when all MouseEntities produces no events. There are interfaces for these functions in 
 *   ajs.mouseEntity.mouseFunction.
 */
ajs.MouseEntity = function(pointType, zOrder, mouseFunctionDict, noEventFunctionDict, globalNoEventFunctionDict) {
  assert(ajs.mouseEntity.pointType[pointType] != null);
  this.pointType = pointType;
  this.zOrder = zOrder;
  this.mouseFunctionDict = mouseFunctionDict;
  this.noEventFunctionDict = noEventFunctionDict;
  if (!globalNoEventFunctionDict) {
    this.globalNoEventFunctionDict = {};
  } else {
    this.globalNoEventFunctionDict = globalNoEventFunctionDict;
  }
}

/**
 * The types of a MouseEntity.
 * 
 * @enum {String}
 */
ajs.mouseEntity.type = {
  click: 'click',
  down: 'down',
  up: 'up',
  hover: 'hover'
};

/**
 * The point types of a MouseEntity.
 * 
 * @enum {String}
 */
ajs.mouseEntity.pointType = {
  Absolute: 'Absolute',
  Relative: 'Relative'
};

/**
 * This function is a function prototype that is never used but rather represents the expected interface for 
 * function to process a Click event.
 * 
 * @param {ajs.think.ThoughtContext} thoughtContext the context to start animating.
 * @param {ajs.Point} mousePoint the point of the mouse. Depending on the associated ajs.MouseEntity's type this
 *   point will be Absolute or Relative.
 * @param {ajs.clickType} clickType the type of mouse click.
 * @return {boolean} true if the mouseEntity has been clicked, false otherwise.
 */
ajs.mouseEntity.mouseFunction = function(thoughtContext, mousePoint, clickType) {};

/**
 * A sort function that sorts Mouse Entities based on their z order.
 * 
 * @param {ajs.MouseEntity} mouseEntityOne a Mouse Entity.
 * @param {ajs.MouseEntity} mouseEntityTwo a Mouse Entity.
 * @return {number} -1 if mouseEntityOne.zOrder is less than mouseEntityTwo.zOrder, 0 if they are equal, 1 if mouseEntityOne.zOrder is greater than mouseEntityTwo.zOrder.
 */
ajs.mouseEntity.sortByZOrder = function(mouseEntityOne, mouseEntityTwo) {
  return ((mouseEntityOne.zOrder < mouseEntityTwo.zOrder) ? -1 : ((mouseEntityOne.zOrder > mouseEntityTwo.zOrder) ? 1 : 0));
}

/**
 * Process Mouse Entities for the given type.
 * 
 * @param {ajs.think.ThoughtContext} thoughtContext the context to start animating.
 * @param {Array(ajs.MouseEntity)} mouseEntities the all mouse entities, some of which will be process.
 * @param {ajs.clickType} clickType the type of mouse click.
 * @param {MouseEvent} mouseEvent the mouse event for the canvas.
 * @param {ajs.mouseEntity.type} mouseEntityType the type of the MouseEntities to process.
 */
ajs.mouseEntity.process = function(thoughtContext, mouseEntities, clickType, mouseEvent, mouseEntityType) {
  var relativeClickPoint = ajs.mouse.convertMouseEventToPoint(mouseEvent);
	var absClickPoint = ajs.point.convertRelativePointToAbsolute(relativeClickPoint, thoughtContext.viewport);
  
  mouseEntities = mouseEntities.filter(function(element) { return element.mouseFunctionDict[mouseEntityType] != null });
  // Sort by z order and then reverse. The higher the z order, the higher the precedence.
  mouseEntities = mouseEntities.sort(ajs.mouseEntity.sortByZOrder).sort(ajs.utils.reverseSortFunc);
  
  var eventProduced = false;

  for (var i = 0; i < mouseEntities.length; i++) {
    var mouseEntity = mouseEntities[i];
    var clickPoint;
    switch (mouseEntity.pointType) {
      case ajs.mouseEntity.pointType.Absolute:
        clickPoint = absClickPoint;
        break;
      case ajs.mouseEntity.pointType.Relative:
        clickPoint = relativeClickPoint;
        break;
      default:
        throw 'Unknown MouseEntity type.';
    }

    // If an event has never be produced, then invoke this mouse entity's mouse function.
    if (!eventProduced) {
      var mouseFunction = mouseEntity.mouseFunctionDict[mouseEntityType];
      if (mouseFunction(thoughtContext, clickPoint, clickType)) {
        eventProduced = true;
      } else {
        var noEventFunction = mouseEntity.noEventFunctionDict[mouseEntityType];
        if (noEventFunction) {
          noEventFunction(thoughtContext, clickPoint, clickType);
        }
      }
    } else { // If an event has been produced in a previous loop iteration. 
      var noEventFunction = mouseEntity.noEventFunctionDict[mouseEntityType];
      if (noEventFunction) {
        noEventFunction(thoughtContext, clickPoint, clickType);
      }
    }
  }
  
  // If not event was produced, invoke all mouse entity global no event functions.
  if (!eventProduced) {
    for (var i = 0; i < mouseEntities.length; i++) {
      var mouseEntity = mouseEntities[i];
      var globalNoEventFunction = mouseEntity.globalNoEventFunctionDict[mouseEntityType];
      if (globalNoEventFunction) {
        globalNoEventFunction(thoughtContext, clickPoint, clickType);
      }
    }
  }
}

/**
 * Process Click Mouse Entities.
 * 
 * @param {ajs.think.ThoughtContext} thoughtContext the context to start animating.
 * @param {Array(ajs.MouseEntity)} mouseEntities the all mouse entities, some of which will be process.
 * @param {ajs.clickType} clickType the type of mouse click.
 * @param {MouseEvent} mouseEvent the mouse event for the canvas.
 */
ajs.mouseEntity.processClick = function(thoughtContext, mouseEntities, clickType, mouseEvent) {
  var mouseEntityType = ajs.mouseEntity.type.click;
  ajs.mouseEntity.process(thoughtContext, mouseEntities, clickType, mouseEvent, mouseEntityType);
}

/**
 * Process Down Mouse Entities.
 * 
 * @param {ajs.think.ThoughtContext} thoughtContext the context to start animating.
 * @param {Array(ajs.MouseEntity)} mouseEntities the all mouse entities, some of which will be process.
 * @param {ajs.clickType} clickType the type of mouse click.
 * @param {MouseEvent} mouseEvent the mouse event for the canvas.
 */
ajs.mouseEntity.processDown = function(thoughtContext, mouseEntities, clickType, mouseEvent) {
  var mouseEntityType = ajs.mouseEntity.type.down;
  ajs.mouseEntity.process(thoughtContext, mouseEntities, clickType, mouseEvent, mouseEntityType);
}

/**
 * Process Up Mouse Entities.
 * 
 * @param {ajs.think.ThoughtContext} thoughtContext the context to start animating.
 * @param {Array(ajs.MouseEntity)} mouseEntities the all mouse entities, some of which will be process.
 * @param {ajs.clickType} clickType the type of mouse click.
 * @param {MouseEvent} mouseEvent the mouse event for the canvas.
 */
ajs.mouseEntity.processUp = function(thoughtContext, mouseEntities, clickType, mouseEvent) {
  var mouseEntityType = ajs.mouseEntity.type.up;
  ajs.mouseEntity.process(thoughtContext, mouseEntities, clickType, mouseEvent, mouseEntityType);
}

/**
 * Process Hover Mouse Entities.
 * 
 * @param {ajs.think.ThoughtContext} thoughtContext the context to start animating.
 * @param {Array(ajs.MouseEntity)} mouseEntities the all mouse entities, some of which will be process.
 * @param {ajs.clickType} clickType the type of mouse click.
 * @param {MouseEvent} mouseEvent the mouse event for the canvas.
 */
ajs.mouseEntity.processHover = function(thoughtContext, mouseEntities, clickType, mouseEvent) {
  var mouseEntityType = ajs.mouseEntity.type.hover;
  ajs.mouseEntity.process(thoughtContext, mouseEntities, clickType, mouseEvent, mouseEntityType);
}

