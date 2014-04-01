import os
import logging

from google.appengine.ext import webapp
from django.utils import simplejson
from django.views.generic import View
from django.utils import simplejson

from think.DatastoreModels import * # Get the constants
import think.json
from think.user import *
from think.theme import getThemeUsingId, getThoughtsUsingTheme, createOrUpdateTheme, deleteTheme
from think.permission import userCanModifyTheme
from openiduser.session import authenticate_user_session, get_session_id, delete_session, session_id_param_name
from utilities import getUrlFilePath, isNoneOrEmpty, deleteCookie
from think.DatastoreModels import * # Get the constants
from think.thought import *
from think.permission import getPermissionType, isUserPermittedToModifyThought


def log_out(request):
    """ Handlers logout requests.
       
       Expects parameters in the POST request:
         session_id: a string to identify the user's session.
      
       Returns: empty HTTP response.
    """
    session_id = get_session_id(request)
    delete_cookie(response, session_id_param_name, sessionId)
    delete_session(sessionId)
    return HttpResponse(‘’)


# Constants
content_type_name = 'Content-Type'
json_content_type = 'application/json; charset=utf-8'
main_html_file = 'static/think.html'


class Names:
  """An emumeration of parameter names."""
  
  id = 'id'
  name = 'name'
  theme = 'theme'


class ThemeView(View):
  
  def put(self, *ars, **kwargs):
    args = simplejson.loads(self.request.body)
    jsonTheme = args[Names.theme]
    
    if jsonTheme == None:
      self.error(400) # Bad Request
      return
      
    body = {}
    sessionId = getSessionId(self.request)
    if isNoneOrEmpty(sessionId):
      body['success'] = False
      body['errorMsg'] = 'You are not logged in.'
      self.response.out.write(simplejson.JSONEncoder().encode(body))
      return
      
    # Authenticate User.
    user = authenticateUserSession(sessionId)
    if user == None:
      body['success'] = False
      body['errorMsg'] = 'Your session has expired.'
      self.response.out.write(simplejson.JSONEncoder().encode(body))
      return
    
    if Names.id in jsonTheme and not isNoneOrEmpty(jsonTheme['id']):
      if not userCanModifyTheme(user, getThemeUsingId(jsonTheme['id'])):
        body['success'] = False
        body['errorMsg'] = 'You can not modify this theme.'
        self.response.out.write(simplejson.JSONEncoder().encode(body))
        return
    
    id = createOrUpdateTheme(jsonTheme, user)
    
    body['success'] = True
    body['id'] = id
    self.response.out.write(simplejson.JSONEncoder().encode(body))
  
  def delete(self, *ars, **kwargs):
    """Deletes the requested Theme.
       
       GetArgs:
         themeId: the id of the theme to delete.
    """
    themeId = self.request.get(Names.id)
    if isNoneOrEmpty(themeId):
      self.error(400) # Bad Request
      return
      
    body = {}
    sessionId = getSessionId(self.request)
    if isNoneOrEmpty(sessionId):
      body['success'] = False
      body['errorMsg'] = 'You are not logged in.'
      self.response.out.write(simplejson.JSONEncoder().encode(body))
      return
      
    # Authenticate User.
    user = authenticateUserSession(sessionId)
    if user == None:
      body['success'] = False
      body['errorMsg'] = 'Your session has expired.'
      self.response.out.write(simplejson.JSONEncoder().encode(body))
      return
    
    # Check Permissions
    if not userCanModifyTheme(user, getThemeUsingId(themeId)):
      body['success'] = False
      body['errorMsg'] = 'You can not delete this theme.'
      self.response.out.write(simplejson.JSONEncoder().encode(body))
      return
    
    theme = getThemeUsingId(themeId)
    if theme == None:
      self.error(400) # Bad Request
      return
      
    deleteTheme(theme)
    
    body['success'] = True
    self.response.out.write(simplejson.JSONEncoder().encode(body))




# Constants
contentTypeName = 'Content-Type'
jsonContentType = 'application/json; charset=utf-8'
mainHtmlFile = 'static/think.html'

class PublicThoughtHandler(webapp.RequestHandler):
  """An interface to make Thoughts public or private."""
  
  def post(self):
    """Makes a thought public."""
    thoughtId = self.request.get(Names.id)
    if isNoneOrEmpty(thoughtId):
      self.error(400) # Bad Request
      return
    
    body = {}
    sessionId = getSessionId(self.request)
    if isNoneOrEmpty(sessionId):
      body['success'] = False
      body['errorMsg'] = 'You are not logged in.'
      self.response.out.write(simplejson.JSONEncoder().encode(body))
      return
      
    # Authenticate User.
    user = authenticateUserSession(sessionId)
    if user == None:
      body['success'] = False
      body['errorMsg'] = 'Your session has expired.'
      self.response.out.write(simplejson.JSONEncoder().encode(body))
      return
    
    if not userCanModifyThoughtUsingId(user, thoughtId):
      body['success'] = False
      body['errorMsg'] = 'You do not have succificient priviledges.'
      self.response.out.write(simplejson.JSONEncoder().encode(body))
      return
    
    if thoughtViewableByallUsingId(thoughtId):
      body['success'] = False
      body['errorMsg'] = 'The thought is already public.'
      self.response.out.write(simplejson.JSONEncoder().encode(body))
      return
    
    makeThoughtPublicUsingId(thoughtId)
    body['success'] = True
    self.response.out.write(simplejson.JSONEncoder().encode(body))
  
  def delete(self):
    """Makes a thought private."""
    thoughtId = self.request.get(Names.id)
    if isNoneOrEmpty(thoughtId):
      self.error(400) # Bad Request
      return
    
    body = {}
    sessionId = getSessionId(self.request)
    if isNoneOrEmpty(sessionId):
      body['success'] = False
      body['errorMsg'] = 'You are not logged in.'
      self.response.out.write(simplejson.JSONEncoder().encode(body))
      return
      
    # Authenticate User.
    user = authenticateUserSession(sessionId)
    if user == None:
      body['success'] = False
      body['errorMsg'] = 'Your session has expired.'
      self.response.out.write(simplejson.JSONEncoder().encode(body))
      return
    
    if not userCanModifyThoughtUsingId(user, thoughtId):
      body['success'] = False
      body['errorMsg'] = 'You do not have succificient priviledges.'
      self.response.out.write(simplejson.JSONEncoder().encode(body))
      return
    
    if not thoughtViewableByallUsingId(thoughtId):
      body['success'] = False
      body['errorMsg'] = 'The thought is already private.'
      self.response.out.write(simplejson.JSONEncoder().encode(body))
      return
    
    makeThoughtPrivateUsingId(thoughtId)
    body['success'] = True
    self.response.out.write(simplejson.JSONEncoder().encode(body))
 
      
class ThoughtHandler(webapp.RequestHandler):
  """Serves Thoughts via a RESTful API.
  """
  
  def get(self):
    """Simply returns a specific Thought.
    """
    thoughtId = self.request.get(Names.id)
    thoughtName = self.request.get(Names.name)
    collection = self.request.get(Names.collection)
    type = self.request.get(Names.type)
    
    # Count the number of params.
    noOfParams = 0
    if not isNoneOrEmpty(thoughtId):
      noOfParams += 1
    
    if not isNoneOrEmpty(thoughtName):
      noOfParams += 1

    if not isNoneOrEmpty(collection):
      noOfParams += 1
    
    # id, name or collection must be supplied, but not more than one.
    if noOfParams != 1:
      self.error(400) # Bad Request
      return
    
    body = {} 
    sessionId = getSessionId(self.request)
       
    if not isNoneOrEmpty(collection):
      # Get a collection for the user.
      # Validate session id.
      if isNoneOrEmpty(sessionId):
        body['success'] = False
        body['errorMsg'] = 'You are not logged in.'
        self.response.out.write(simplejson.JSONEncoder().encode(body))
        return
      # Authenticate User.
      user = authenticateUserSession(sessionId)
      if user == None:
        body['success'] = False
        body['errorMsg'] = 'Your session has expired.'
        self.response.out.write(simplejson.JSONEncoder().encode(body))
        return
      # Check which type of collection.
      if collection == Names.all:
        # Get collection all.
        body['thoughtDescriptions'] = getThoughtDescriptionsForUser(user)
        body['success'] = True
      else:
        self.error(400) # Bad Request
        return

    elif not isNoneOrEmpty(thoughtId) or not isNoneOrEmpty(thoughtName):
      thoughtViewable = None
      userCanViewThought = None
      getThought = None
      identifier = None
      
      # Take a generic approach for id and name.
      if not isNoneOrEmpty(thoughtId):
        thoughtViewable = thoughtViewableByallUsingId
        userCanViewThought = userCanViewThoughtUsingId
        getThought = getThoughtUsingId
        identifier = thoughtId
      elif not isNoneOrEmpty(thoughtName):
        thoughtViewable = thoughtViewableByallUsingName
        userCanViewThought = userCanViewThoughtUsingName
        getThought = getThoughtUsingName
        identifier = thoughtName
      
      # Get the user info.
      user = None
      if not isNoneOrEmpty(sessionId):
        user = authenticateUserSession(sessionId)

      if not thoughtViewable(identifier):
        # Check session.
        if isNoneOrEmpty(sessionId):
          body['success'] = False
          body['errorMsg'] = 'You are not logged in.'
          self.response.out.write(simplejson.JSONEncoder().encode(body))
          return
        
        if user == None:
          body['success'] = False
          body['errorMsg'] = 'Your session has expired.'
          self.response.out.write(simplejson.JSONEncoder().encode(body))
          return
        
        # Check that the user can view the thought.
        if not userCanViewThought(user, identifier):
          body['success'] = False
          body['errorMsg'] = 'No such thought exists.'
          self.response.out.write(simplejson.JSONEncoder().encode(body))
          return
        # The user can view the thought at this point in the code.
      
      thought = getThought(identifier)
      if thought == None:
        self.error(400)
        return
      
      body['success'] = True
      body[Names.thought] = thoughtToDict(thought)
      # Move the following lines into the function above.
      permissionType = getPermissionType(thought, user)
      body[Names.thought][Names.modifiable] = permissionType == permitModify
      body[Names.thought][Names.isPublic] = thoughtViewableByallUsingName(thought.name)
    else:
      raise "LogicError"
        
    self.response.headers[contentTypeName] = jsonContentType  
    self.response.out.write(simplejson.JSONEncoder().encode(body))
          
  def post(self):
    """Creates a thought based on the input in the POST request.
    """
    self.createOrUpdateThought()
  
  def put(self):
    """Creates or updates a thought based on the input in the PUT request.
    """
    self.createOrUpdateThought()
  
  def delete(self):
    """Deletes a thought based on the input in the PUT request.
    """
    thoughtId = self.request.get(Names.id)
    body = {} 
    sessionId = getSessionId(self.request)
    
    # Get the user info.
    user = authenticateUserSession(sessionId)
    if user == None:
      body['success'] = False
      body['errorMsg'] = 'Your session has expired.'
      self.response.out.write(simplejson.JSONEncoder().encode(body))
      return
    
    if userCanModifyThoughtUsingId(user, thoughtId):
      deleteThoughtUsingId(thoughtId)
      body['success'] = True
      self.response.out.write(simplejson.JSONEncoder().encode(body))
      return
    else:
      body['success'] = False
      body['errorMsg'] = 'You do not have permission to delete this thought.'
      self.response.out.write(simplejson.JSONEncoder().encode(body))
      return  
    
  def createOrUpdateThought(self):
    """Creates or updates a thought based on the HTTP request.
    """
    args = simplejson.loads(self.request.body)
    jsonThought = args[Names.thought] # This is not a JSON string but rather a dictionary.
    
    body = {
      'success': None,
      'errorMsg': None
    }
    
    sessionId = getSessionId(self.request)
    if isNoneOrEmpty(sessionId):
      body['success'] = False
      body['errorMsg'] = 'You are not logged in.'
      self.response.out.write(simplejson.JSONEncoder().encode(body))
      return

    user = authenticateUserSession(sessionId)
    if user == None:
      body['success'] = False
      body['errorMsg'] = 'Your session has expired.'
      self.response.out.write(simplejson.JSONEncoder().encode(body))
      return
      
    thoughtHasBeenSaved = False
    thought = None
    if Names.id not in jsonThought:
      thoughtHasBeenSaved = False
    else:
      thought = getThoughtUsingId(jsonThought[Names.id])
      logging.info('thought: ' + str(thought))
      if thought != None:
        thoughtHasBeenSaved = True
    
    if not thoughtHasBeenSaved:
      id = createAndSaveThought(jsonThought, user)
        
      self.response.headers[contentTypeName] = jsonContentType
      body['success'] = True
      body['id'] = id
      self.response.out.write(simplejson.JSONEncoder().encode(body))
    else:
      # Check that the user has permission to update the thought
      if not isUserPermittedToModifyThought(user, thought):
        body['success'] = False
        body['errorMsg'] = 'You are not permmited to modify the thought.'
        self.response.out.write(simplejson.JSONEncoder().encode(body))
        return
        
      updateThought(thought, jsonThought, user)
      
      self.response.headers[contentTypeName] = jsonContentType
      body['success'] = True
      body['id'] = getThoughtId(thought)
      self.response.out.write(simplejson.JSONEncoder().encode(body))

  
