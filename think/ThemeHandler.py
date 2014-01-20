# !/usr/bin/env python

"""
Provides the Theme part of the RESTful API.
"""


import os
import logging

from google.appengine.ext import webapp
from django.utils import simplejson

from utilities import getUrlFilePath, isNoneOrEmpty
from openiduser.session import authenticateUserSession, getSessionId
from think.DatastoreModels import * # Get the constants
import think.json
from think.user import *
from think.theme import getThemeUsingId, getThoughtsUsingTheme, createOrUpdateTheme, deleteTheme
from think.permission import userCanModifyTheme


# Constants
contentTypeName = 'Content-Type'
jsonContentType = 'application/json; charset=utf-8'
mainHtmlFile = 'static/think.html'


class Names:
  """An emumeration of parameter names."""
  
  id = 'id'
  name = 'name'
  theme = 'theme'


class ThemeHandler(webapp.RequestHandler):
  
  def put(self):
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
  
  def delete(self):
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

  