"""
A collection of methods relating to the Thought Model.
"""


from think.models import * # Get the constants
from think.node import node_to_dict, get_node_id, find_node
from think.connection import connection_to_dict
from think.permission import get_permissions_using_thought
from think.theme import theme_to_dict, get_theme_id, create_or_update_theme, delete_theme, get_theme_using_id
from think.misc import get_id
from think.data import get_default_theme
from utilities import model_list_to_dict


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
  node_one = 'node_one'
  node_two = 'node_two'
  connections = 'connections'
  collection = 'collection'
  all = 'all'
  modifiable = 'modifiable'
  type = 'type'
  is_public = 'is_public' # This is called 'is_public' because 'public' is a javascript keyword.

get_thought_id = get_id

def get_thought_by_name_and_author(thought_name, author):
  """Get a Thought with the given name for the given author.
     
     Args:
       thought_name: the name of the thought.
       author: the user that owns the thought.
     
     Returns: the thought.
  """
  query = Permission.objects.filter(thought__name=thought_name, user=author, type=permit_modify)
  permission = query.get()
  if permission != None:
    return permission.thought
  else:
    return None

def get_thought_using_name(name):
  """Gets the Thought from DataStore.
     
     Args:
       name: The name of the thought.
     
     Returns: a Thought model.
  """
  query = Thought.objects.filter(name=name)
  thought = query.get()
  return thought

def get_thought_using_id(id):
  """Gets the Thought from DataStore.
     
     Args:
       id: The id of the thought.
     
     Returns: a Thought model.
  """
  try:
    thought = Thought.objects.get(id=id)
    return thought
  except Exception, e:
    return None

def delete_thought_using_id(id):
  """Deletes the Thought and all related models from DataStore.
     
     Args:
       id: The id of the thought.
  """
  thought = get_thought_using_id(id)
  
  for node in getThoughtNodes(thought):
    node.delete()
    
  for connection in get_thought_connections(thought):
    connection.delete()
  
  for permission in get_permissions_using_thought(thought):
    permission.delete()
  
  # Current policy dictates that there are a one-to-one relationship between thoughts and themes. This will change in the future.
  if thought.theme != None:
    delete_theme(thought.theme)
    
  thought.delete()

def make_thought_public_using_id(thoughtId):
  """Make a thought public (viewable by all).
     
     Args:
       thoughtId: the id of the thought to be made public.
  """
  thought = get_thought_using_id(thoughtId)
  if thought_viewable_by_all_using_id(thoughtId):
    return
  else:
    permission = Permission(thought=thought,type=permitAllView)
    permission.put()

def make_thought_private_using_id(thoughtId):
  """Make a thought private (not viewable by all).
     
     Args:
       thoughtId: the id of the thought to be made private.
  """
  thought = get_thought_using_id(thoughtId)
  query = Permssion.objects.filter(thought=thought, type=permit_all_view)
  for permission in query: # In case there are multiple permissions.
    permission.delete()

def thought_viewable_by_all_using_name(name):
  """Checks if the Thought is viewable by all using the thought name."""
  thought = GqlQuery('SELECT * FROM Thought WHERE name = :1', name).get()
  return GqlQuery('SELECT * FROM Permission WHERE thought =:1 AND type = :2', thought, permitAllView).get() != None
  
def thought_viewable_by_all_using_id(id):
  """Checks if the Thought is viewable by all using the thought id."""
  thought = get_thought_using_id(id)
  return GqlQuery('SELECT * FROM Permission WHERE thought =:1 AND type = :2', thought, permitAllView).get() != None

def get_thought_connections(thought):
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
    dictNodes.append(node_to_dict(node))
    
  connections = get_thought_connections(thought)
  dictConnections = []
  for connection in connections:
    dictConnections.append(connection_to_dict(connection))    
    
  data = {
    'name': thought.name,
    'connections': dictConnections,
    'nodes': dictNodes,
    'id': str(thought.key()),
    'theme': theme_to_dict(thought.theme)
  }  
  return data

def create_or_update_themeFromThoughtDict(thoughtDict, user):
  """
     Creates or Updates a Theme based on a Thought Dictionary.
     
     Args:
       thoughtDict: a dictionary contain keys matching the properties of a Thought Model.
       
     Returns: Theme.
  """
  if Names.theme in thoughtDict:
    themeDict = thoughtDict[Names.theme]
    if themeDict != None:
      create_or_update_theme(themeDict, user)
      return get_theme_using_id(themeDict[Names.id])
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
        
  theme = create_or_update_themeFromThoughtDict(jsonThought, user)

  thought = Thought(name = jsonThought[Names.name], theme=theme)
  thought.put()
    
  permission = Permission(thought=thought, user=user, type=permitModify)
  permission.put()
     
  # Create nodes
  json_nodes = jsonThought[Names.nodes]
  nodes = []
  for json_node in json_nodes:
    # Somtimes text is null/empty.
    text = ""
    if Names.text in json_node:
      text = json_node[Names.text]
        
    node = Node(x=int(json_node[Names.x]), y=int(json_node[Names.y]), text=text, thought=thought)
    node.put()
    nodes.append(node)
    
  # Create connections
  json_connections = jsonThought[Names.connections]
  for jsonConnection in json_connections:
    node_one = find_node(nodes, jsonConnection[0][Names.x], jsonConnection[0][Names.y], jsonConnection[0][Names.text])  
    node_two = find_node(nodes, jsonConnection[1][Names.x], jsonConnection[1][Names.y], jsonConnection[1][Names.text])  
    connection = Connection(node_one=node_one, node_two=node_two, thought=thought)
    connection.put()
  
  return get_thought_id(thought)
  
def updateThought(thought, jsonThought, user):
  """Updates a Thought model using a JSON Thought Dictionary.
     
     Args:
       thought: the Thought model.
       jsonThought: a JSON Thought in the form of a dictionary.
       user: the author of the Thought.
  """        
  theme = create_or_update_themeFromThoughtDict(jsonThought, user)
  
  # Update thought
  if thought.name != jsonThought[Names.name]:
    thought.name = jsonThought[Names.name]
  if thought.theme != theme:
    thought.theme = theme
  thought.put()
  
  # Create Nodes before creating connections because the creation of connections are dependant on nodes already existing.
  json_nodes = jsonThought[Names.nodes]
  for json_node in json_nodes:
    if Names.id not in json_node:
      # Create the node.
      # Somtimes text is null/empty.
      text = ""
      if Names.text in json_node:
        text = json_node[Names.text]
      node = Node(x=int(json_node[Names.x]), y=int(json_node[Names.y]), text=text, thought=thought)
      node.put()
      
  # Update the connections before updating nodes because a bug occurs in certain cases if a node is deleted before a connection.
  # Connections are going to be removed from the dict to track which connetions have been deleted since the thought was last saved.
  connections = get_thought_connections(thought) 
  json_connections = jsonThought[Names.connections]
  nodes = getThoughtNodes(thought)
  keys_to_nodes = model_list_to_dict(nodes) 
  for jsonConnection in json_connections:
    # Find if the connection already exists.
    if Names.id in jsonConnection[0] and Names.id in jsonConnection[1]:
      # Search for the existing node.
      matchingConnection = None
      for connection in connections:
        if get_node_id(connection.node_one) == jsonConnection[0][Names.id] and get_node_id(connection.node_two) == jsonConnection[1][Names.id]:
          matchingConnection = connection
          # The connection exists.
          break
      
      if matchingConnection != None:
        # Remove the connection from the list of connection because it exists.
        connections.remove(matchingConnection)
        continue
    
    # The connection has not been saved to the database
    node_one = None
    node_two = None
         
    # Because the json_connections may be linked to a new node that does not have an id, we may have to search for it.
    i = 0
    if Names.id in jsonConnection[i]:
      node_one = keys_to_nodes[jsonConnection[i][Names.id]]
    else:
      node_one = find_node(nodes, jsonConnection[i][Names.x], jsonConnection[i][Names.y], jsonConnection[i][Names.text])
            
    i = 1
    if Names.id in jsonConnection[i]:
      node_two = keys_to_nodes[jsonConnection[i][Names.id]]
    else:
      node_two = find_node(nodes, jsonConnection[i][Names.x], jsonConnection[i][Names.y], jsonConnection[i][Names.text])
    
    connection = Connection(node_one=node_one, node_two=node_two, thought=thought)
    connection.put()

  # Delete the connections left in the list.
  for connection in connections:
    connection.delete()
    
      
  # Update nodes
  # Nodes will be deleted out of this dictionary to figure out which nodes have been deleted since 
  # the thought is attempted being saved.
  keys_to_nodes = model_list_to_dict(getThoughtNodes(thought)) 
  json_nodes = jsonThought[Names.nodes]
  nodes = getThoughtNodes(thought)
  for json_node in json_nodes:
    if Names.id not in json_node:
      # This nodes has already been created in the top of this function. So don't delete it by removing it from the dict.
      node = find_node(nodes, json_node[Names.x], json_node[Names.y], json_node[Names.text])
      del keys_to_nodes[get_node_id(node)]
      pass
    else:
      node = keys_to_nodes[json_node[Names.id]]
      del keys_to_nodes[json_node[Names.id]] # Delete the node, to mark that it still exists.
      # Update the node.
      node.x = json_node[Names.x] 
      node.y = json_node[Names.y]
      node.text = json_node[Names.text]
      node.put()
      
  # Delete the left-over existing nodes.
  for node in keys_to_nodes.values():
    node.delete()
