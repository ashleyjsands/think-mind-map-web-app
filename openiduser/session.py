"""
A collection of methods relating to the Session Model.
"""

# Must set this env var before importing any part of Django
import os
from datetime import datetime

os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'
from google.appengine.ext.db import GqlQuery

from utilities import isNoneOrEmpty
from openiduser.models import Session, User


# Constants
sessionExpirationInDays = 1
sessionIdParamName = 'session_id'


def getSessionId(request):
  """ Gets the session id parameter out of the cookie. """
  if sessionIdParamName in request.cookies:
    return request.cookies[sessionIdParamName]
  else:
    return None

def deleteOldSessions():
  """Deletes all old sessions."""
  for session in Session.all():
    if (datetime.now() - session.datetime).days >= sessionExpirationInDays:
      session.delete()

if __name__ == '__main__':
  deleteOldSessions()

  
def deleteSession(sessionId):
  """Delete the session using the sessionId.
     
     Args:
       sessionId: the sessionId of the session to delete.
  """
  query = GqlQuery('SELECT * FROM Session WHERE session_id = :1', sessionId)
  for session in query:
    session.delete()

def createOrLoadSession(request, user=None):
  """Creates or Loads the current session.
     
     Params:
       request: the HTTP request.
       user: the user object.
  """
  session = None
  id = request.get(sessionIdParamName)
  if id:
    try:
      session = db.get(db.Key.from_path('Session', int(id)))
      assert session
    except (AssertionError, db.Error), e:
      raise 'Invalid session id: %d' % id
  else:
    session = Session(user=user, datetime= datetime.now())
    # Store the Session
    setSessionId(session)
        
  return session
  
def authenticateUserSession(sessionId):
  """Authenticates a user's session.
     
     Params:
       sessionId: the id of session from the cookie.
    
     Returns:
       None if the session is invalid or the User model instance if it is valid.
  """
  if isNoneOrEmpty(sessionId):
    raise 'sessionId can not be None'
    
  query = GqlQuery("SELECT * FROM Session WHERE id = :1", sessionId)
  session = query.get()
  if not session :
    return None
  elif (datetime.now() - session.datetime).days >= sessionExpirationInDays:
    return None
  else:
    return session.user