"""
A collection of methods relating to the Permission Model.
"""


from google.appengine.ext.db import GqlQuery

from think.DatastoreModels import * # Get the constants
from utilities import isNoneOrEmpty

  
def isUserPermittedToModifyThought(user, thought):
  """Checks if the user is permitted to modify the given Thought.
       
     Args:
       user: the user to check for.
       thoughtName: the thought to check for.
     
     Returns: a bool; true if the user can modify the thought, false otherwise.
  """
  query = GqlQuery("SELECT * FROM Permission WHERE thought = :1 AND user = :2 AND type = :3", thought, user, permitModify)
  permission = query.get()
  return permission != None

def userCanModifyTheme(user, theme):
  """Checks if the user is permitted to modify the given Theme.
       
     Args:
       user: the user to check for.
       theme: the theme to check for.
     
     Returns: a bool; true if the user can modify the theme, false otherwise.
  """
  query = GqlQuery("SELECT * FROM Permission WHERE theme = :1 AND user = :2 AND type = :3", theme, user, permitModify)
  permission = query.get()
  return permission != None
  
def getPermissionType(thought, user):
  """Gets the Permission type for the user of a Thought.
     
     Args:
       thought: the thought.
       user: the user.
     
     Returns: the Permission type of the thought for the user, permitAllView (if it exists for the thought), or None.
  """
  query = GqlQuery("SELECT * FROM Permission WHERE thought = :1 AND user = :2", thought, user)
  permission = query.get()
  if permission != None:
    return permission.type
  else:
    # Try to get the permitAllView type if it exists.
    query = GqlQuery("SELECT * FROM Permission WHERE thought = :1", thought)
    permission = query.get()
    if permission != None:
      return permission.type
    else:
      return None
      
def getPermissionsUsingThought(thought):
  """Gets the Permission model from DataStore.
     
     Args:
       thought: The thought.
  """
  query = GqlQuery("SELECT * FROM Permission WHERE thought = :1", thought)
  permissions = []
  for permission in query:
    permissions.append(permission)
  return permissions
  
def getPermissionsUsingTheme(theme):
  """Gets the Permission model from DataStore.
     
     Args:
       theme: The theme.
  """
  query = GqlQuery("SELECT * FROM Permission WHERE theme = :1", theme)
  permissions = []
  for permission in query:
    permissions.append(permission)
  return permissions
  