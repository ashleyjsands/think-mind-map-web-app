"""
This script contains one method, main, which sets up the Tutorial thought and the administration data.
"""

from think.models import *

def main():
  """Create the Tutorial Thought and set up some administration data."""
  
  thought = Thought(name="Tutorial")
  thought.save()

  permission = Permission(thought=thought, user=None, type=permit_all_view)
  permission.save()

  node0 = Node(x=529,y=145,text="Drag a node to move it",thought = thought)
  node0.save()

  node1 = Node(x=410,y=263,text="Welcome to Think, an online Mind Mapping Web App",thought = thought)
  node1.save()

  node2 = Node(x=712,y=281,text="Click a node to select it.",thought = thought)
  node2.save()

  node3 = Node(x=548,y=391,text="Click the 'green plus' button on a selected node to create another node",thought = thought)
  node3.save()

  node4 = Node(x=280,y=174,text="Double click a node to edit its text",thought = thought)
  node4.save()

  node5 = Node(x=704,y=94,text="Click the red x button on a selected node to delete it",thought = thought)
  node5.save()

  node6 = Node(x=402,y=508,text="When you are familar with Think, register an account to have the ability to save and load your own thoughts(mind maps).",thought = thought)
  node6.save()

  node7 = Node(x=910,y=394,text="Click the 'Grey connection' button to connect a node. Your next click must be the other node in order to successfully connect.",thought = thought)
  node7.save()

  node8 = Node(x=163,y=326,text="The thought menu is in the top left corner",thought = thought)
  node8.save()

  node9 = Node(x=152,y=189,text="Where you can close the thought",thought = thought)
  node9.save()

  node10 = Node(x=287,y=390,text="Where you can save the thought",thought = thought)
  node10.save()

  node11 = Node(x=57,y=401,text="Where you can export the thought as an image",thought = thought)
  node11.save()

  node12 = Node(x=406,y=98,text="Drag the background to change the view",thought = thought)
  node12.save()

  c = Connection(node_one=node0, node_two=node1, thought=thought)
  c.save()

  c = Connection(node_one=node1, node_two=node2, thought=thought)
  c.save()

  c = Connection(node_one=node2, node_two=node3, thought=thought)
  c.save()

  c = Connection(node_one=node1, node_two=node4, thought=thought)
  c.save()

  c = Connection(node_one=node2, node_two=node5, thought=thought)
  c.save()

  c = Connection(node_one=node2, node_two=node7, thought=thought)
  c.save()

  c = Connection(node_one=node12, node_two=node1, thought=thought)
  c.save()

  c = Connection(node_one=node6, node_two=node1, thought=thought)
  c.save()

  c = Connection(node_one=node10, node_two=node8, thought=thought)
  c.save()

  c = Connection(node_one=node11, node_two=node8, thought=thought)
  c.save()

  c = Connection(node_one=node11, node_two=node9, thought=thought)
  c.save()

  c = Connection(node_one=node11, node_two=node10, thought=thought)
  c.save()

  c = Connection(node_one=node9, node_two=node10, thought=thought)
  c.save()

  c = Connection(node_one=node9, node_two=node8, thought=thought)
  c.save()

  c = Connection(node_one=node8, node_two=node1, thought=thought)
  c.save()

  c = Connection(node_one=node3, node_two=node5, thought=thought)
  c.save()

  c = Connection(node_one=node7, node_two=node5, thought=thought)
  c.save()

  c = Connection(node_one=node7, node_two=node3, thought=thought)
  c.save()

  c = Connection(node_one=node7, node_two=node2, thought=thought)
  c.save()
  
  u = User.objects.filter(username="admin").get()
  u.save()
  
  p = Permission(thought=thought, type=permit_modify, user=u)
  p.save()
  
  original_theme = Theme(name='Think - Original', backgroundTopColor='#abccff', backgroundBottomColor='#000000', nodeOuterColor='#000000', nodeInnerColor='#555555', nodeTextColor='#FFFFFF', connectionOuterColor='#111111', connectionInnerColor='#CCCCCC', connectionTextColor='#FFFFFF')
  original_theme.save()
  
  theme_permission = Permission(theme=original_theme, type=permit_all_view)
  theme_permission.save()
  
  md = MetaData(original_theme=original_theme)
  md.save()


def get_default_theme():
  """Gets the Default Theme.
  """
  return MetaData.all().get().original_theme
