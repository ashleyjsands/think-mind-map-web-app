"""
A collection of user related methods.
"""

from datetime import datetime
import uuid

# Must set this env var before importing any part of Django
import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'

from utilities.session import create_cookie
from openiduser.session import session_id_param_name
from openiduser.models import Session, User


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