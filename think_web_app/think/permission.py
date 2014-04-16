"""
A collection of methods relating to the Permission Model.
"""


from think.models import * # Get the constants
from utilities import is_none_or_empty

  
def is_user_permitted_to_modify_thought(user, thought):
  """Checks if the user is permitted to modify the given Thought.
       
     Args:
       user: the user to check for.
       thought_name: the thought to check for.
     
     Returns: a bool; true if the user can modify the thought, false otherwise.
  """
  query = query = Thought.objects.filter(thought=thought, user=user, type=permit_modify)
  permission = query.get()
  return permission != None

def user_can_modify_theme(user, theme):
  """Checks if the user is permitted to modify the given Theme.
       
     Args:
       user: the user to check for.
       theme: the theme to check for.
     
     Returns: a bool; true if the user can modify the theme, false otherwise.
  """
  query = Permission.objects.filter(theme=theme, user=user, type=permit_modify)
  permission = query.get()
  return permission != None
  
def get_permission_type(thought, user):
  """Gets the Permission type for the user of a Thought.
     
     Args:
       thought: the thought.
       user: the user.
     
     Returns: the Permission type of the thought for the user, permit_all_view (if it exists for the thought), or None.
  """
  query = Permission.objects.filter(thought=thought, user=user)
  permission = query.get()
  if permission != None:
    return permission.type
  else:
    # Try to get the permit_all_view type if it exists.
    query = Permission.objects.filter(thought=thought)
    permission = query.get()
    if permission != None:
      return permission.type
    else:
      return None
      
def get_permissions_using_thought(thought):
  """Gets the Permission model from DataStore.
     
     Args:
       thought: The thought.
  """
  query = Permission.objects.filter(thought=thought)
  permissions = []
  for permission in query:
    permissions.append(permission)
  return permissions
  
def get_permissions_using_theme(theme):
  """Gets the Permission model from DataStore.
     
     Args:
       theme: The theme.
  """
  query = Permission.objects.filter(theme=theme)
  permissions = []
  for permission in query:
    permissions.append(permission)
  return permissions
  
def get_all_view_permissions(thought):
  return Permission.objects.filter(thought=thought, type=permit_all_view).get()


