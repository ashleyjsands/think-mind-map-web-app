"""
A collection of methods relating to the Node Model.
"""



def get_node_id(node):
  """Gets the node's id.
     
     Args:
       node: the node.
     
     Returns: a string representing the node's id.
  """
  return str(node.id)


def node_to_dict(node):
  """Converts the node to a dictionary.
     
     Args:
       node: the node to be converted.
     
     Returns:
       a dictionary.
  """
  return {'x': node.x, 'y': node.y, 'text': node.text, 'id': get_node_id(node)}

def find_node(nodes, x, y, text):
  """Find Node in a list.
     
     Args:
       nodes: the list of nodes.
       x: the x value of the node to find.
       y: the y value of the node to find.
       text: the text value of the node to find.
     
     Returns: the node found.
  """
  for node in nodes:
    # Cast x and y to int because sometimes they may be floats which are unacceptable.
    if node.x == int(x) and node.y == int(y) and node.text == text:
      return node
  return None
