"""
A collection of methods relating to the Thought Model.
"""


from google.appengine.ext.db import GqlQuery

from think.DatastoreModels import * # Get the constants
from think.node import nodeToDict, getNodeId, findNode
from think.connection import connectionToDict
from utilities import modelListToDict
from think.permission import getPermissionsUsingThought
from think.theme import themeToDict, getThemeId, createOrUpdateTheme, deleteTheme, getThemeUsingId
from think.misc import getId
from think.MetaData import getDefaultTheme


class Names:
  """An emumeration of parameter names."""
  
  id = 'id'
  name = 'name'
  thought = 'thought'
  theme = 'theme'
  nodes = 'nodes'
  key = 'key'
  x = 'x'
  y = 'y'
  text = 'text'
  nodeOne = 'nodeOne'
  nodeTwo = 'nodeTwo'
  connections = 'connections'
  collection = 'collection'
  all = 'all'
  modifiable = 'modifiable'
  type = 'type'
  isPublic = 'isPublic' # This is called 'isPublic' because 'public' is a javascript keyword.

getThoughtId = getId

def getThoughtByNameAndAuthor(thoughtName, author):
  """Get a Thought with the given name for the given author.
     
     Args:
       thoughtName: the name of the thought.
       author: the user that owns the thought.
     
     Returns: the thought.
  """
  query = GqlQuery("SELECT * FROM Permission WHERE thought.name = :1 AND user = :2 AND type = :3", thoughtName, author, permitModify)
  permission = query.get()
  if permission != None:
    return permission.thought
  else:
    return None

def getThoughtUsingName(name):
  """Gets the Thought from DataStore.
     
     Args:
       name: The name of the thought.
     
     Returns: a Thought model.
  """
  query = GqlQuery("SELECT * FROM Thought WHERE name = :1", name)
  thought = query.get()
  return thought

def getThoughtUsingId(id):
  """Gets the Thought from DataStore.
     
     Args:
       id: The id of the thought.
     
     Returns: a Thought model.
  """
  try:
    thought = Thought.get(id)
    return thought
  except Exception, e:
    return None

def deleteThoughtUsingId(id):
  """Deletes the Thought and all related models from DataStore.
     
     Args:
       id: The id of the thought.
  """
  thought = getThoughtUsingId(id)
  
  for node in getThoughtNodes(thought):
    node.delete()
    
  for connection in getThoughtConnections(thought):
    connection.delete()
  
  for permission in getPermissionsUsingThought(thought):
    permission.delete()
  
  # Current policy dictates that there are a one-to-one relationship between thoughts and themes. This will change in the future.
  if thought.theme != None:
    deleteTheme(thought.theme)
    
  thought.delete()

def makeThoughtPublicUsingId(thoughtId):
  """Make a thought public (viewable by all).
     
     Args:
       thoughtId: the id of the thought to be made public.
  """
  thought = getThoughtUsingId(thoughtId)
  if thoughtViewableByallUsingId(thoughtId):
    return
  else:
    permission = Permission(thought=thought,type=permitAllView)
    permission.put()

def makeThoughtPrivateUsingId(thoughtId):
  """Make a thought private (not viewable by all).
     
     Args:
       thoughtId: the id of the thought to be made private.
  """
  thought = getThoughtUsingId(thoughtId)
  query = GqlQuery("SELECT * FROM Permission WHERE thought = :1 AND type = :2", thought, permitAllView)
  for permission in query: # In case there are multiple permissions.
    permission.delete()

def thoughtViewableByallUsingName(name):
  """Checks if the Thought is viewable by all using the thought name."""
  thought = GqlQuery('SELECT * FROM Thought WHERE name = :1', name).get()
  return GqlQuery('SELECT * FROM Permission WHERE thought =:1 AND type = :2', thought, permitAllView).get() != None
  
def thoughtViewableByallUsingId(id):
  """Checks if the Thought is viewable by all using the thought id."""
  thought = getThoughtUsingId(id)
  return GqlQuery('SELECT * FROM Permission WHERE thought =:1 AND type = :2', thought, permitAllView).get() != None

def getThoughtConnections(thought):
  """Get all connections for a given Thought.
     
     Args:
       thought: a thought Model.
    
     Returns: a list of Connections.
  """
  query = GqlQuery("SELECT * FROM Connection WHERE thought = :1", thought)
  list = []
  for connection in query:
    list.append(connection)
  return list

def getThoughtNodes(thought):
  """Get all nodes for a given Thought.
     
     Args:
       thought: a thought Model.
    
     Returns: a list of Nodes.
  """
  query = GqlQuery("SELECT * FROM Node WHERE thought = :1", thought)
  list = []
  for node in query:
    list.append(node)
  return list
    
def thoughtToDict(thought):
  """Convert a Thought Model into a dictionary ready to be turned into a JSON string.
     
     Args:
       thought: the thought model.
     
     Returns: a dictionary or None.
  """
  if thought == None: 
    return None
  
  nodes = getThoughtNodes(thought)
  dictNodes = []
  for node in nodes:
    dictNodes.append(nodeToDict(node))
    
  connections = getThoughtConnections(thought)
  dictConnections = []
  for connection in connections:
    dictConnections.append(connectionToDict(connection))    
    
  data = {
    'name': thought.name,
    'connections': dictConnections,
    'nodes': dictNodes,
    'id': str(thought.key()),
    'theme': themeToDict(thought.theme)
  }  
  return data

def createOrUpdateThemeFromThoughtDict(thoughtDict, user):
  """
     Creates or Updates a Theme based on a Thought Dictionary.
     
     Args:
       thoughtDict: a dictionary contain keys matching the properties of a Thought Model.
       
     Returns: Theme.
  """
  if Names.theme in thoughtDict:
    themeDict = thoughtDict[Names.theme]
    if themeDict != None:
      createOrUpdateTheme(themeDict, user)
      return getThemeUsingId(themeDict[Names.id])
    else:
      return None

def createAndSaveThought(jsonThought, user):
  """Creates a Thought from a JSON Thought Dictionary and saves it.
     
     Args:
       jsonThought: a JSON Thought in the form of a dictionary.
       user: the author of the Thought.
     
     Returns: the id for the newly created Thought.
  """
  # Create the Thought
  if Names.name not in jsonThought:
    raise 'The thought has no name.'
        
  theme = createOrUpdateThemeFromThoughtDict(jsonThought, user)

  thought = Thought(name = jsonThought[Names.name], theme=theme)
  thought.put()
    
  permission = Permission(thought=thought, user=user, type=permitModify)
  permission.put()
     
  # Create nodes
  jsonNodes = jsonThought[Names.nodes]
  nodes = []
  for jsonNode in jsonNodes:
    # Somtimes text is null/empty.
    text = ""
    if Names.text in jsonNode:
      text = jsonNode[Names.text]
        
    node = Node(x=int(jsonNode[Names.x]), y=int(jsonNode[Names.y]), text=text, thought=thought)
    node.put()
    nodes.append(node)
    
  # Create connections
  jsonConnections = jsonThought[Names.connections]
  for jsonConnection in jsonConnections:
    nodeOne = findNode(nodes, jsonConnection[0][Names.x], jsonConnection[0][Names.y], jsonConnection[0][Names.text])  
    nodeTwo = findNode(nodes, jsonConnection[1][Names.x], jsonConnection[1][Names.y], jsonConnection[1][Names.text])  
    connection = Connection(nodeOne=nodeOne, nodeTwo=nodeTwo, thought=thought)
    connection.put()
  
  return getThoughtId(thought)
  
def updateThought(thought, jsonThought, user):
  """Updates a Thought model using a JSON Thought Dictionary.
     
     Args:
       thought: the Thought model.
       jsonThought: a JSON Thought in the form of a dictionary.
       user: the author of the Thought.
  """        
  theme = createOrUpdateThemeFromThoughtDict(jsonThought, user)
  
  # Update thought
  if thought.name != jsonThought[Names.name]:
    thought.name = jsonThought[Names.name]
  if thought.theme != theme:
    thought.theme = theme
  thought.put()
  
  # Create Nodes before creating connections because the creation of connections are dependant on nodes already existing.
  jsonNodes = jsonThought[Names.nodes]
  for jsonNode in jsonNodes:
    if Names.id not in jsonNode:
      # Create the node.
      # Somtimes text is null/empty.
      text = ""
      if Names.text in jsonNode:
        text = jsonNode[Names.text]
      node = Node(x=int(jsonNode[Names.x]), y=int(jsonNode[Names.y]), text=text, thought=thought)
      node.put()
      
  # Update the connections before updating nodes because a bug occurs in certain cases if a node is deleted before a connection.
  # Connections are going to be removed from the dict to track which connetions have been deleted since the thought was last saved.
  connections = getThoughtConnections(thought) 
  jsonConnections = jsonThought[Names.connections]
  nodes = getThoughtNodes(thought)
  keysToNodes = modelListToDict(nodes) 
  for jsonConnection in jsonConnections:
    # Find if the connection already exists.
    if Names.id in jsonConnection[0] and Names.id in jsonConnection[1]:
      # Search for the existing node.
      matchingConnection = None
      for connection in connections:
        if getNodeId(connection.nodeOne) == jsonConnection[0][Names.id] and getNodeId(connection.nodeTwo) == jsonConnection[1][Names.id]:
          matchingConnection = connection
          # The connection exists.
          break
      
      if matchingConnection != None:
        # Remove the connection from the list of connection because it exists.
        connections.remove(matchingConnection)
        continue
    
    # The connection has not been saved to the database
    nodeOne = None
    nodeTwo = None
         
    # Because the jsonConnections may be linked to a new node that does not have an id, we may have to search for it.
    i = 0
    if Names.id in jsonConnection[i]:
      nodeOne = keysToNodes[jsonConnection[i][Names.id]]
    else:
      nodeOne = findNode(nodes, jsonConnection[i][Names.x], jsonConnection[i][Names.y], jsonConnection[i][Names.text])
            
    i = 1
    if Names.id in jsonConnection[i]:
      nodeTwo = keysToNodes[jsonConnection[i][Names.id]]
    else:
      nodeTwo = findNode(nodes, jsonConnection[i][Names.x], jsonConnection[i][Names.y], jsonConnection[i][Names.text])
    
    connection = Connection(nodeOne=nodeOne, nodeTwo=nodeTwo, thought=thought)
    connection.put()

  # Delete the connections left in the list.
  for connection in connections:
    connection.delete()
    
      
  # Update nodes
  # Nodes will be deleted out of this dictionary to figure out which nodes have been deleted since 
  # the thought is attempted being saved.
  keysToNodes = modelListToDict(getThoughtNodes(thought)) 
  jsonNodes = jsonThought[Names.nodes]
  nodes = getThoughtNodes(thought)
  for jsonNode in jsonNodes:
    if Names.id not in jsonNode:
      # This nodes has already been created in the top of this function. So don't delete it by removing it from the dict.
      node = findNode(nodes, jsonNode[Names.x], jsonNode[Names.y], jsonNode[Names.text])
      del keysToNodes[getNodeId(node)]
      pass
    else:
      node = keysToNodes[jsonNode[Names.id]]
      del keysToNodes[jsonNode[Names.id]] # Delete the node, to mark that it still exists.
      # Update the node.
      node.x = jsonNode[Names.x] 
      node.y = jsonNode[Names.y]
      node.text = jsonNode[Names.text]
      node.put()
      
  # Delete the left-over existing nodes.
  for node in keysToNodes.values():
    node.delete()
