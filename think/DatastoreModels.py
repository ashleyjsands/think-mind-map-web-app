"""
The definitions of the Datastore Models for this Web App.
"""


from appengine_django.models import BaseModel
from google.appengine.ext import db
from openiduser.models import User


# Constants
PERMISSION_THEME_COLLECTION_NAME = "Permission_Theme"
THOUGHT_THEME_NAME = "thought_theme"
NODE_THOUGHT_COLLECTION_NAME = "thought_nodes"
PERMISSION_THOUGHT_COLLECTION_NAME = "thought_permissions"
CONNECTION_THOUGHT_COLLECTION_NAME = "thought_connections"
CONNECTION_NODE_ONE_COLLECTION_NAME = "nodeOne_connections"
CONNECTION_NODE_TWO_COLLECTION_NAME = "nodeTwo_connections"
PERMISSION_USER_COLLECTION_NAME = "user_permissions"
SESSION_USER_COLLECTION_NAME = "session_permissions"
METADATA_THEME_NAME = "metadata_theme"


class Theme(BaseModel):
  """Represents the colours for a Thought. """
  name = db.StringProperty()
  backgroundTopColor = db.StringProperty()
  backgroundBottomColor = db.StringProperty()
  nodeOuterColor = db.StringProperty()
  nodeInnerColor = db.StringProperty()
  nodeTextColor = db.StringProperty()
  connectionOuterColor = db.StringProperty()
  connectionInnerColor = db.StringProperty()
  connectionTextColor = db.StringProperty()

  
class Thought(BaseModel):
  """Represents a Mind map/Thought in the Web App."""
  name = db.StringProperty(required=True)
  theme = db.ReferenceProperty(Theme, collection_name=THOUGHT_THEME_NAME, required=False)

  
class Node(BaseModel):
  """Represents a Node in a Thought."""
  x = db.IntegerProperty(required=True)
  y = db.IntegerProperty(required=True)
  text = db.StringProperty() # Text may be null or empty.
  thought = db.ReferenceProperty(Thought, collection_name=NODE_THOUGHT_COLLECTION_NAME, required=True)
  
  
class Connection(BaseModel):
  """Represents a connection between two nodes in a Thought."""
  # The collection_name must be set for the back-reference property of the Node class.
  nodeOne = db.ReferenceProperty(Node, collection_name=CONNECTION_NODE_ONE_COLLECTION_NAME, required=True)
  nodeTwo = db.ReferenceProperty(Node, collection_name=CONNECTION_NODE_TWO_COLLECTION_NAME, required=True)
  thought = db.ReferenceProperty(Thought, collection_name=CONNECTION_THOUGHT_COLLECTION_NAME, required=True)


# The types of permssions.
permitNone = "none"
permitView = "view"
permitModify = "modify"
permitAllView = "all-view"

permissionTypes = [
  permitNone, permitView, permitModify, permitAllView
]


class Permission(BaseModel):
  """Contains permission information as to who can modify/view a model."""
  theme = db.ReferenceProperty(Theme, collection_name=PERMISSION_THEME_COLLECTION_NAME)
  thought = db.ReferenceProperty(Thought, collection_name=PERMISSION_THOUGHT_COLLECTION_NAME)
  type = db.StringProperty(required=True, choices=set(permissionTypes))
  user = db.ReferenceProperty(User, collection_name=PERMISSION_USER_COLLECTION_NAME)
  

class ServerInitialised(BaseModel):
  """Contains a boolean to represent that the Server has been initialised."""
  initialised = db.BooleanProperty(required=True)


class MetaData(BaseModel):
  """Contains all the meta data/configurable data for the Web App."""
  originalTheme = db.ReferenceProperty(Theme, collection_name=METADATA_THEME_NAME, required=True)

