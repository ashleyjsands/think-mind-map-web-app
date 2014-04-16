"""
A collection of user related methods.
"""

from datetime import datetime
import uuid

# Must set this env var before importing any part of Django
import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'

from utilities.session import create_cookie
from django.contrib.auth.models import Session, User


def create_user_session(response, claimed_id, server_url):
    """Creates the session cookie in the response.
       
       Params:
         response: the HTTP response.
         claimed_id: ?
         server_url: ?
    """
    session_id = str(uuid.uuid4())
    user = getUser(claimed_id, server_url)
    if user == None:
      user = createUser(claimed_id, server_url)
    
    session = Session(user = user, id = session_id, datetime = datetime.now()) 
    session.put()
    
    create_cookie(response, session_id_param_name, session_id)

def get_user(claimed_id, server_url):
  """Gets the User model.
       
     Params:
       claimed_id: ?
       server_url: ?
  """
  query = User.objects.filter(claimed_id = claimed_id, server_url = server_url)
  return query.get()

def create_user(claimed_id, server_url):
  """Creates and returns a User model.
       
     Params:
       claimed_id: ?
       server_url: ?
  """
  user = User(claimed_id=claimed_id, server_url=server_url)
  user.put()
  return user

def get_thought_descriptions_for_user(user):
  """Gets a list of descriptions for Thoughts the User is allowed to view or modify. 
     
     Args:
       user: the user.
    
     Returns: a list of description dictionaries that are meant to be converted into JSON. The description dictionaries have the following properties: id, name.
  """
  descriptions = []
  viewable = get_view_permissions(user, None).get()
  modifiable = get_modify_permissions(user, None).get()
  queries = [viewable, modifiable]
  for query in queries:
    for permission in query:
      description = {
        'id': str(permission.thought.key()),
        'name': permission.thought.name,
      }
      descriptions.append(description)
  return descriptions
  
def user_can_view_thought_using_name(user, thought_name):
  """Checks if the user has permission to view the given thought. 
    
     Args:
       user: the user.
       thought_name: the name of the thought to check.
     
     Returns: true if the user can view the thought, false otherwise.
  """
  thought = Thought.objects.filter(name = thought_name).get()
  
  viewable = get_view_permissions(user, thought)
  if viewable.get() != None:
    return True
  modifiable = get_modify_permissions(user, thought)
  return modifiable.get() != None

def user_can_view_thought_using_id(user, thought_id):
  """Checks if the user has permission to view the given thought. 
    
     Args:
       user: the user.
       thought_id: the id of the thought to check.
     
     Returns: true if the user can view the thought, false otherwise.
  """
  thought = getThoughtUsingId(thought_id)
  viewable = get_view_permissions(user, though)
  if viewable.get() != None:
    return True
  return userCanModifyThoughtUsingId(user, thought_id)

def userCanModifyThoughtUsingId(user, thought_id):
  """Checks if the user has permission to modify the given thought. 
    
     Args:
       user: the user.
       thought_id: the id of the thought to check.
     
     Returns: true if the user can modify the thought, false otherwise.
  """
  thought = getThoughtUsingId(thought_id)
  modifiable = get_modify_permissions(user, thought)
  return modifiable.get() != None

def get_view_permissions(user, thought):
  return get_permission(user, thought, permitView)

def get_modify_permissions(user, thought):
  return get_permission(user, thought, permitModify)

def get_permissions(user, thought, a_type):
  return Permission.objects.filter(user=user, thought = thought, type=a_type)
