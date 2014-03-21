"""
A collection of user related methods.
"""

from datetime import datetime
import uuid

# Must set this env var before importing any part of Django
import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'
from google.appengine.ext.db import GqlQuery

from utilities.session import createCookie
from openiduser.session import sessionIdParamName
from openiduser.models import Session, User


def createUserSession(response, claimedId, serverUrl):
    """Creates the session cookie in the response.
       
       Params:
         response: the HTTP response.
         claimedId: ?
         serverUrl: ?
    """
    sessionId = str(uuid.uuid4())
    user = getUser(claimedId, serverUrl)
    if user == None:
      user = createUser(claimedId, serverUrl)
    
    session = Session(user = user, id = sessionId, datetime = datetime.now()) 
    session.put()
    
    createCookie(response, sessionIdParamName, sessionId)

def getUser(claimedId, serverUrl):
  """Gets the User model.
       
     Params:
       claimedId: ?
       serverUrl: ?
  """
  query = GqlQuery('SELECT * FROM User WHERE claimedId = :1 AND serverUrl = :2', claimedId, serverUrl)
  return query.get()

def createUser(claimedId, serverUrl):
  """Creates and returns a User model.
       
     Params:
       claimedId: ?
       serverUrl: ?
  """
  user = User(claimedId=claimedId, serverUrl=serverUrl)
  user.put()
  return user