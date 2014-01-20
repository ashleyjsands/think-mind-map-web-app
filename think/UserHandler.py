"""
A collection of HTTP handlers that provide handle requests related to user sessions.
"""


from google.appengine.ext import webapp

from utilities.session import deleteCookie
from openiduser.session import deleteSession, sessionIdParamName, getSessionId


class LogoutHandler(webapp.RequestHandler):
  """Handles User Logouts."""
  
  def post(self):
    """ Handlers logout requests.
       
       Expects parameters in the POST request:
         session_id: a string to identify the user's session.
      
       Returns: Nothing.
    """
    sessionId = getSessionId(self.request)
    deleteCookie(self.response, sessionIdParamName, sessionId)
    deleteSession(sessionId)
    