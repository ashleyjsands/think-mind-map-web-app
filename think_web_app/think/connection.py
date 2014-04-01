"""
A collection of methods relating to the Connection model.
"""


from google.appengine.ext.db import GqlQuery

from think.node import getNodeId


def connectionToDict(connection):
  """Converts the connection to a dictionary.
     
     Args:
       connection: the connection to be converted.
     
     Returns:
       a dictionary.
  """
  return {'nodeOne': getNodeId(connection.nodeOne), 'nodeTwo': getNodeId(connection.nodeTwo)}