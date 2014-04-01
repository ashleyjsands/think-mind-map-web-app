"""
A collection of methods relating to the Theme Model.
"""



from utilities import is_none_or_empty
from think.models import Theme, Permission, permit_modify
from think.permission import get_permissions_using_theme
from think.misc import get_id


get_theme_id = get_id
  
def theme_to_dict(theme):
  """Convert a Theme Model into a dictionary ready to be turned into a JSON string.
     
     Args:
       thought: the Theme model.
     
     Returns: a dictionary or None.
  """
  if theme is None:
    return None
    
  data = {
    'id': get_theme_id(theme),
    'name': theme.name,
    'background_top_color': theme.backgroundTopColor,
    'background_bottom_color': theme.backgroundBottomColor,
    'node_outer_color': theme.nodeOuterColor,
    'node_inner_color': theme.nodeInnerColor,
    'node_text_color': theme.nodeTextColor,
    'connection_outer_color': theme.connectionOuterColor,
    'connection_inner_color': theme.connection_inner_color,
    'connectionTextColor': theme.connectionTextColor,
  }
  return data

def create_theme(theme_dict, user):
  """Creates a Theme model from a dictionary.
     
     Args:
       theme_dict: a dictionary that is identical to a Theme model instance.
       user: the user that created the theme.
     
     Side-effects: theme_dict will have the key 'id' set to the create Theme instance's id.
  """
  theme = Theme()
  theme.name = theme_dict['name']
  theme.backgroundTopColor = theme_dict['background_top_color']
  theme.backgroundBottomColor = theme_dict['background_bottom_color']
  theme.nodeOuterColor = theme_dict['node_outer_color']
  theme.nodeInnerColor = theme_dict['node_inner_color']
  theme.nodeTextColor = theme_dict['node_text_color']
  theme.connectionOuterColor = theme_dict['connection_outer_color']
  theme.connectionInnerColor = theme_dict['connection_inner_color']
  theme.connectionTextColor = theme_dict['connection_text_color']
  theme.put()
  theme_dict['id'] = get_theme_id(theme)
  permission = Permission(theme=theme, type=permit_modify, user=user)
  permission.put()

def update_theme(theme_dict):
  """Updates a Theme model from a dictionary.
     
     Args:
       theme_dict: a dictionary that is identical to a Theme model instance.
  """
  theme = get_theme_using_id(theme_dict['id'])
  theme.name = theme_dict['name']
  theme.backgroundTopColor = theme_dict['background_top_color']
  theme.backgroundBottomColor = theme_dict['background_bottom_color']
  theme.nodeOuterColor = theme_dict['node_outer_color']
  theme.nodeInnerColor = theme_dict['node_inner_color']
  theme.nodeTextColor = theme_dict['node_text_color']
  theme.connectionOuterColor = theme_dict['connection_outer_color']
  theme.connectionInnerColor = theme_dict['connection_inner_color']
  theme.connectionTextColor = theme_dict['connection_text_color']
  theme.put()

def create_or_update_theme(theme_dict, user=None):
  """Creates or Updates a Theme model from a dictionary.
     
     Args:
       theme_dict: a dictionary that is identical to a Theme model instance.
       user: the user is needed if the Theme model is going to be created.
  """
  if 'id' not in theme_dict:
    create_theme(theme_dict, user)
  else:
    #TODO: check that the user has permissions to update the theme. remove the user default assignment.
    update_theme(theme_dict)
  return theme_dict['id']

def get_theme_using_id(id):
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
    
def get_thoughts_using_theme(theme):
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
  
def delete_theme(theme):
  """Deletes the theme model and 'fixes' associated models.
     
     Args:
       theme: the theme to be deleted.
  """
  # Find All Thoughts using the theme.
  for thought in get_thoughts_using_theme(theme):
    thought.theme = None
    thought.put()
  
  for permission in get_permissions_using_theme(theme):
    permission.delete()
    
  theme.delete()

def get_thoughts_using_theme(theme):
  """Get all thoughts that are associated to a given Theme.
     
     Args:
       theme: a theme Model.
    
     Returns: a list of Thoughts.
  """
  query = Thought.objects.filter(theme=theme)
  list = []
  for thought in query:
    list.append(thought)
  return list

def get_theme_using_id(id):
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
