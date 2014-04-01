"""
A collection of methods that relate to the User Model.
"""


from google.appengine.ext.db import GqlQuery
from django.utils import simplejson

from utilities import isNoneOrEmpty
from openiduser.models import Session, User
from openiduser.user import *
from think.DatastoreModels import * # Get the constants
from think.thought import getThoughtUsingId


def getThoughtDescriptionsForUser(user):
  """Gets a list of descriptions for Thoughts the User is allowed to view or modify. 
     
     Args:
       user: the user.
    
     Returns: a list of description dictionaries that are meant to be converted into JSON. The description dictionaries have the following properties: id, name.
  """
  descriptions = []
  viewable = GqlQuery('SELECT * FROM Permission WHERE user = :1 AND type = :2 and thought != :3', user, permitView, None)
  modifiable = GqlQuery('SELECT * FROM Permission WHERE user = :1 AND type = :2 and thought != :3', user, permitModify, None)
  queries = [viewable, modifiable]
  for query in queries:
    for permission in query:
      description = {
        'id': str(permission.thought.key()),
        'name': permission.thought.name,
      }
      descriptions.append(description)
  return descriptions
  
def userCanViewThoughtUsingName(user, thoughtName):
  """Checks if the user has permission to view the given thought. 
    
     Args:
       user: the user.
       thoughtName: the name of the thought to check.
     
     Returns: true if the user can view the thought, false otherwise.
  """
  thought = GqlQuery('SELECT * FROM Thought WHERE name = :1', thoughtName).get()
  
  viewable = GqlQuery('SELECT * FROM Permission WHERE user = :1 AND thought = :2 AND type = :3', user, thought, permitView)
  if viewable.get() != None:
    return True
    
  modifiable = GqlQuery('SELECT * FROM Permission WHERE user = :1 AND thought = :2 AND type = :3', user, thought, permitModify)
  return modifiable.get() != None

def userCanViewThoughtUsingId(user, thoughtId):
  """Checks if the user has permission to view the given thought. 
    
     Args:
       user: the user.
       thoughtId: the id of the thought to check.
     
     Returns: true if the user can view the thought, false otherwise.
  """
  thought = getThoughtUsingId(thoughtId)
  
  viewable = GqlQuery('SELECT * FROM Permission WHERE user = :1 AND thought = :2 AND type = :3', user, thought, permitView)
  if viewable.get() != None:
    return True
    
  return userCanModifyThoughtUsingId(user, thoughtId)

def userCanModifyThoughtUsingId(user, thoughtId):
  """Checks if the user has permission to modify the given thought. 
    
     Args:
       user: the user.
       thoughtId: the id of the thought to check.
     
     Returns: true if the user can modify the thought, false otherwise.
  """
  thought = getThoughtUsingId(thoughtId)
      
  modifiable = GqlQuery('SELECT * FROM Permission WHERE user = :1 AND thought = :2 AND type = :3', user, thought, permitModify)
  return modifiable.get() != None
  
def getUser(username):
  """Gets the User Model.
     
     Params:
       username: the username of the User model.
     
     Returns: the User Model, or None.
  """
  query = GqlQuery("SELECT * FROM User WHERE username = :1", username)
  return query.get()

def deleteSessionsForUser(user):
  """Delete all the sessions for a user.
     
     Args:
       user: the user to delete sessions for.
  """
  query = GqlQuery('SELECT * FROM Session WHERE user = :1', user)
  for session in query:
    session.delete()
    
