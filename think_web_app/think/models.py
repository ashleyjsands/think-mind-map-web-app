from django.db import models
from openiduser.models import User


# Constants
PERMISSION_THEME_COLLECTION_NAME = "Permission_Theme"
THOUGHT_THEME_NAME = "thought_theme"
NODE_THOUGHT_COLLECTION_NAME = "thought_nodes"
PERMISSION_THOUGHT_COLLECTION_NAME = "thought_permissions"
CONNECTION_THOUGHT_COLLECTION_NAME = "thought_connections"
CONNECTION_NODE_ONE_COLLECTION_NAME = "node_one_connections"
CONNECTION_NODE_TWO_COLLECTION_NAME = "node_two_connections"
PERMISSION_USER_COLLECTION_NAME = "user_permissions"
SESSION_USER_COLLECTION_NAME = "session_permissions"
METADATA_THEME_NAME = "metadata_theme"


class Theme(models.Model):
  """Represents the colours for a Thought. """
  name = models.TextField()
  backgroundTopColor = models.TextField()
  backgroundBottomColor = models.TextField()
  nodeOuterColor = models.TextField()
  nodeInnerColor = models.TextField()
  nodeTextColor = models.TextField()
  connectionOuterColor = models.TextField()
  connectionInnerColor = models.TextField()
  connectionTextColor = models.TextField()

  
class Thought(models.Model):
  """Represents a Mind map/Thought in the Web App."""
  name = models.TextField()
  theme = models.ForeignKey('Theme', blank=True, null=True)

  
class Node(models.Model):
  """Represents a Node in a Thought."""
  x = models.IntegerField()
  y = models.IntegerField()
  text = models.TextField() # Text may be null or empty.
  thought = models.ForeignKey('Thought')
  
  
class Connection(models.Model):
  """Represents a connection between two nodes in a Thought."""
  # The collection_name must be set for the back-reference property of the Node class.
  node_one = models.ForeignKey('Node')
  node_two = models.ForeignKey('Node')
  thought = models.ForeignKey('Thought')


# The types of permssions.
permitNone = "none"
permitView = "view"
permit_modify = "modify"
permitAllView = "all-view"

permissionTypes = [
  permitNone, permitView, permit_modify, permitAllView
]


class Permission(models.Model):
  """Contains permission information as to who can modify/view a model."""
  theme = models.ForeignKey('Theme')
  thought = models.ForeignKey('Thought')
  type = models.TextField(choices=set(permissionTypes))
  user = models.ForeignKey('User')
  

class ServerInitialised(models.Model):
  """Contains a boolean to represent that the Server has been initialised."""
  initialised = models.BooleanField()


class MetaData(models.Model):
  """Contains all the meta data/configurable data for the Web App."""
  original_theme = models.ForeignKey('Theme')


