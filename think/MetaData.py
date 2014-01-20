"""
This script contains one method, main, which sets up the Tutorial thought and the administration data.
"""

from think.DatastoreModels import *

def main():
  """Create the Tutorial Thought and set up some administration data."""
  
  thought = Thought(name="Tutorial")
  thought.put()

  permission = Permission(thought=thought, user=None, type=permitAllView)
  permission.put()

  node0 = Node(x=529,y=145,text="Drag a node to move it",thought = thought)
  node0.put()

  node1 = Node(x=410,y=263,text="Welcome to Think, an online Mind Mapping Web App",thought = thought)
  node1.put()

  node2 = Node(x=712,y=281,text="Click a node to select it.",thought = thought)
  node2.put()

  node3 = Node(x=548,y=391,text="Click the 'green plus' button on a selected node to create another node",thought = thought)
  node3.put()

  node4 = Node(x=280,y=174,text="Double click a node to edit its text",thought = thought)
  node4.put()

  node5 = Node(x=704,y=94,text="Click the red x button on a selected node to delete it",thought = thought)
  node5.put()

  node6 = Node(x=402,y=508,text="When you are familar with Think, register an account to have the ability to save and load your own thoughts(mind maps).",thought = thought)
  node6.put()

  node7 = Node(x=910,y=394,text="Click the 'Grey connection' button to connect a node. Your next click must be the other node in order to successfully connect.",thought = thought)
  node7.put()

  node8 = Node(x=163,y=326,text="The thought menu is in the top left corner",thought = thought)
  node8.put()

  node9 = Node(x=152,y=189,text="Where you can close the thought",thought = thought)
  node9.put()

  node10 = Node(x=287,y=390,text="Where you can save the thought",thought = thought)
  node10.put()

  node11 = Node(x=57,y=401,text="Where you can export the thought as an image",thought = thought)
  node11.put()

  node12 = Node(x=406,y=98,text="Drag the background to change the view",thought = thought)
  node12.put()

  c = Connection(nodeOne=node0, nodeTwo=node1, thought=thought)
  c.put()

  c = Connection(nodeOne=node1, nodeTwo=node2, thought=thought)
  c.put()

  c = Connection(nodeOne=node2, nodeTwo=node3, thought=thought)
  c.put()

  c = Connection(nodeOne=node1, nodeTwo=node4, thought=thought)
  c.put()

  c = Connection(nodeOne=node2, nodeTwo=node5, thought=thought)
  c.put()

  c = Connection(nodeOne=node2, nodeTwo=node7, thought=thought)
  c.put()

  c = Connection(nodeOne=node12, nodeTwo=node1, thought=thought)
  c.put()

  c = Connection(nodeOne=node6, nodeTwo=node1, thought=thought)
  c.put()

  c = Connection(nodeOne=node10, nodeTwo=node8, thought=thought)
  c.put()

  c = Connection(nodeOne=node11, nodeTwo=node8, thought=thought)
  c.put()

  c = Connection(nodeOne=node11, nodeTwo=node9, thought=thought)
  c.put()

  c = Connection(nodeOne=node11, nodeTwo=node10, thought=thought)
  c.put()

  c = Connection(nodeOne=node9, nodeTwo=node10, thought=thought)
  c.put()

  c = Connection(nodeOne=node9, nodeTwo=node8, thought=thought)
  c.put()

  c = Connection(nodeOne=node8, nodeTwo=node1, thought=thought)
  c.put()

  c = Connection(nodeOne=node3, nodeTwo=node5, thought=thought)
  c.put()

  c = Connection(nodeOne=node7, nodeTwo=node5, thought=thought)
  c.put()

  c = Connection(nodeOne=node7, nodeTwo=node3, thought=thought)
  c.put()

  c = Connection(nodeOne=node7, nodeTwo=node2, thought=thought)
  c.put()
  
  u = User(claimedId='https://www.google.com/accounts/o8/id?id=AItOawm-IAYwB6N0m80U9tq470sflYBbRJSP2j0', serverUrl='https://www.google.com/accounts/o8/ud')
  u.put()
  
  p = Permission(thought=thought, type=permitModify, user=u)
  p.put()
  
  originalTheme = Theme(name='Think - Original', backgroundTopColor='#abccff', backgroundBottomColor='#000000', nodeOuterColor='#000000', nodeInnerColor='#555555', nodeTextColor='#FFFFFF', connectionOuterColor='#111111', connectionInnerColor='#CCCCCC', connectionTextColor='#FFFFFF')
  originalTheme.put()
  
  themePermission = Permission(theme=originalTheme, type=permitAllView)
  themePermission.put()
  
  md = MetaData(originalTheme=originalTheme)
  md.put()


def getDefaultTheme():
  """Gets the Default Theme.
  """
  return MetaData.all().get().originalTheme