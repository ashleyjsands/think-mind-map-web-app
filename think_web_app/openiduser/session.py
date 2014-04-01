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
session_expiration_in_days = 1
session_id_param_name = 'session_id'


def get_session_id(request):
  """ Gets the session id parameter out of the cookie. """
  if session_id_param_name in request.cookies:
    return request.cookies[session_id_param_name]
  else:
    return None

def delete_old_sessions():
  """Deletes all old sessions."""
  for session in Session.objects.all():
    if (datetime.now() - session.datetime).days >= session_expiration_in_days:
      session.delete()

if __name__ == '__main__':
  delete_old_sessions()

  
def delete_session(session_id):
  """Delete the session using the session_id.
     
     Args:
       session_id: the session_id of the session to delete.
  """
  query = Session.objects.filter(session_id = session_id)
  for session in query:
    session.delete()

def createOrLoadSession(request, user=None):
  """Creates or Loads the current session.
     
     Params:
       request: the HTTP request.
       user: the user object.
  """
  session = None
  id = request.get(session_id_param_name)
  if id:
    try:
      session = db.get(db.Key.from_path('Session', int(id)))
      assert session
    except (AssertionError, db.Error), e:
      raise 'Invalid session id: %d' % id
  else:
    session = Session(user=user, datetime= datetime.now())
    # Store the Session
    setsession_id(session)
        
  return session
  
def authenticate_user_session(session_id):
  """Authenticates a user's session.
     
     Params:
       session_id: the id of session from the cookie.
    
     Returns:
       None if the session is invalid or the User model instance if it is valid.
  """
  if is_none_or_empty(session_id):
    raise 'session_id can not be None'
    
  query = Session.objects.filter(session_id = session_id)
  session = query.get()
  if not session :
    return None
  elif (datetime.now() - session.datetime).days >= session_expiration_in_days:
    return None
  else:
    return session.user