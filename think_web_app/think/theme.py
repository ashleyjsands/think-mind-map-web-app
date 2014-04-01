"""
A collection of methods relating to the Theme Model.
"""


from google.appengine.ext.db import GqlQuery

from utilities import isNoneOrEmpty
from think.models import Theme, Permission, permitModify
from think.permission import getPermissionsUsingTheme
from think.misc import getId


getThemeId = getId
  
def themeToDict(theme):
  """Convert a Theme Model into a dictionary ready to be turned into a JSON string.
     
     Args:
       thought: the Theme model.
     
     Returns: a dictionary or None.
  """
  if theme is None:
    return None
    
  data = {
    'id': getThemeId(theme),
    'name': theme.name,
    'backgroundTopColor': theme.backgroundTopColor,
    'backgroundBottomColor': theme.backgroundBottomColor,
    'nodeOuterColor': theme.nodeOuterColor,
    'nodeInnerColor': theme.nodeInnerColor,
    'nodeTextColor': theme.nodeTextColor,
    'connectionOuterColor': theme.connectionOuterColor,
    'connectionInnerColor': theme.connectionInnerColor,
    'connectionTextColor': theme.connectionTextColor,
  }
  return data

def createTheme(themeDict, user):
  """Creates a Theme model from a dictionary.
     
     Args:
       themeDict: a dictionary that is identical to a Theme model instance.
       user: the user that created the theme.
     
     Side-effects: themeDict will have the key 'id' set to the create Theme instance's id.
  """
  theme = Theme()
  theme.name = themeDict['name']
  theme.backgroundTopColor = themeDict['backgroundTopColor']
  theme.backgroundBottomColor = themeDict['backgroundBottomColor']
  theme.nodeOuterColor = themeDict['nodeOuterColor']
  theme.nodeInnerColor = themeDict['nodeInnerColor']
  theme.nodeTextColor = themeDict['nodeTextColor']
  theme.connectionOuterColor = themeDict['connectionOuterColor']
  theme.connectionInnerColor = themeDict['connectionInnerColor']
  theme.connectionTextColor = themeDict['connectionTextColor']
  theme.put()
  themeDict['id'] = getThemeId(theme)
  permission = Permission(theme=theme, type=permitModify, user=user)
  permission.put()

def updateTheme(themeDict):
  """Updates a Theme model from a dictionary.
     
     Args:
       themeDict: a dictionary that is identical to a Theme model instance.
  """
  theme = getThemeUsingId(themeDict['id'])
  theme.name = themeDict['name']
  theme.backgroundTopColor = themeDict['backgroundTopColor']
  theme.backgroundBottomColor = themeDict['backgroundBottomColor']
  theme.nodeOuterColor = themeDict['nodeOuterColor']
  theme.nodeInnerColor = themeDict['nodeInnerColor']
  theme.nodeTextColor = themeDict['nodeTextColor']
  theme.connectionOuterColor = themeDict['connectionOuterColor']
  theme.connectionInnerColor = themeDict['connectionInnerColor']
  theme.connectionTextColor = themeDict['connectionTextColor']
  theme.put()

def createOrUpdateTheme(themeDict, user=None):
  """Creates or Updates a Theme model from a dictionary.
     
     Args:
       themeDict: a dictionary that is identical to a Theme model instance.
       user: the user is needed if the Theme model is going to be created.
  """
  if 'id' not in themeDict:
    createTheme(themeDict, user)
  else:
    #TODO: check that the user has permissions to update the theme. remove the user default assignment.
    updateTheme(themeDict)
  return themeDict['id']

def getThemeUsingId(id):
  """Gets the Theme from DataStore.
     
     Args:
       id: The id of the Theme.
     
     Returns: a Theme model.
  """
  try:
    theme = Theme.get(id)
    return theme
  except Exception, e:
    return None
    
def getThoughtsUsingTheme(theme):
  """Gets all associated Thoughts referencing the given theme.
     
     Args:
       theme: the theme.
     
     Returns: a list of Thoughts.
  """
  query = GqlQuery("SELECT * FROM Thought WHERE theme = :1", theme)
  list = []
  for element in query:
    list.append(element)
  return list
  
def deleteTheme(theme):
  """Deletes the theme model and 'fixes' associated models.
     
     Args:
       theme: the theme to be deleted.
  """
  # Find All Thoughts using the theme.
  for thought in getThoughtsUsingTheme(theme):
    thought.theme = None
    thought.put()
  
  for permission in getPermissionsUsingTheme(theme):
    permission.delete()
    
  theme.delete()

def getThoughtsUsingTheme(theme):
  """Get all thoughts that are associated to a given Theme.
     
     Args:
       theme: a theme Model.
    
     Returns: a list of Thoughts.
  """
  query = GqlQuery("SELECT * FROM Thought WHERE theme = :1", theme)
  list = []
  for thought in query:
    list.append(thought)
  return list

def getThemeUsingId(id):
  """Gets the Theme from DataStore.
     
     Args:
       id: The id of the Theme.
     
     Returns: a Theme model.
  """
  try:
    theme = Theme.get(id)
    return theme
  except Exception, e:
    return None
