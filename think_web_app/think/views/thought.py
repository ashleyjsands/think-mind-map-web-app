# !/usr/bin/env python

"""
A collection of HTTP handlers that provide the Thought part of a RESTful API.
"""


import os
import logging

from django.views.generic import View
from django.utils import simplejson
from utilities import getUrlFilePath, is_none_or_empty
from openiduser.session import authenticate_user_session, get_session_id
from think.models import * # Get the constants
import think.json
from think.permission import get_permission_type, is_user_permitted_to_modify_thought


# Constants
content_type_name = 'Content-Type'
json_content_type = 'application/json; charset=utf-8'
main_html_file = 'static/think.html'

class PublicThoughtView(View):
  """An interface to make Thoughts public or private."""
  
  def post(self):
    """Makes a thought public."""
    thought_id = self.request.get(Names.id)
    if is_none_or_empty(thought_id):
      self.error(400) # Bad Request
      return
    
    body = {}
    session_id = get_session_id(self.request)
    if is_none_or_empty(session_id):
      body['success'] = False
      body['errorMsg'] = 'You are not logged in.'
      self.response.out.write(simplejson.JSONEncoder().encode(body))
      return
      
    # Authenticate User.
    user = authenticate_user_session(session_id)
    if user == None:
      body['success'] = False
      body['errorMsg'] = 'Your session has expired.'
      self.response.out.write(simplejson.JSONEncoder().encode(body))
      return
    
    if not user_can_modify_thought_using_id(user, thought_id):
      body['success'] = False
      body['errorMsg'] = 'You do not have succificient priviledges.'
      self.response.out.write(simplejson.JSONEncoder().encode(body))
      return
    
    if thought_viewable_by_all_using_id(thought_id):
      body['success'] = False
      body['errorMsg'] = 'The thought is already public.'
      self.response.out.write(simplejson.JSONEncoder().encode(body))
      return
    
    make_thought_public_using_id(thought_id)
    body['success'] = True
    self.response.out.write(simplejson.JSONEncoder().encode(body))
  
  def delete(self):
    """Makes a thought private."""
    thought_id = self.request.get(Names.id)
    if is_none_or_empty(thought_id):
      self.error(400) # Bad Request
      return
    
    body = {}
    session_id = get_session_id(self.request)
    if is_none_or_empty(session_id):
      body['success'] = False
      body['errorMsg'] = 'You are not logged in.'
      self.response.out.write(simplejson.JSONEncoder().encode(body))
      return
      
    # Authenticate User.
    user = authenticate_user_session(session_id)
    if user == None:
      body['success'] = False
      body['errorMsg'] = 'Your session has expired.'
      self.response.out.write(simplejson.JSONEncoder().encode(body))
      return
    
    if not user_can_modify_thought_using_id(user, thought_id):
      body['success'] = False
      body['errorMsg'] = 'You do not have succificient priviledges.'
      self.response.out.write(simplejson.JSONEncoder().encode(body))
      return
    
    if not thought_viewable_by_all_using_id(thought_id):
      body['success'] = False
      body['errorMsg'] = 'The thought is already private.'
      self.response.out.write(simplejson.JSONEncoder().encode(body))
      return
    
    make_thought_private_using_id(thought_id)
    body['success'] = True
    self.response.out.write(simplejson.JSONEncoder().encode(body))
 
      
class ThoughtView(View):
  """Serves Thoughts via a RESTful API.
  """
  
  def get(self):
    """Simply returns a specific Thought.
    """
    thought_id = self.request.get(Names.id)
    thought_name = self.request.get(Names.name)
    collection = self.request.get(Names.collection)
    type = self.request.get(Names.type)
    
    # Count the number of params.
    no_of_params = 0
    if not is_none_or_empty(thought_id):
      no_of_params += 1
    
    if not is_none_or_empty(thought_name):
      no_of_params += 1

    if not is_none_or_empty(collection):
      no_of_params += 1
    
    # id, name or collection must be supplied, but not more than one.
    if no_of_params != 1:
      self.error(400) # Bad Request
      return
    
    body = {} 
    session_id = get_session_id(self.request)
       
    if not is_none_or_empty(collection):
      # Get a collection for the user.
      # Validate session id.
      if is_none_or_empty(session_id):
        body['success'] = False
        body['errorMsg'] = 'You are not logged in.'
        self.response.out.write(simplejson.JSONEncoder().encode(body))
        return
      # Authenticate User.
      user = authenticate_user_session(session_id)
      if user == None:
        body['success'] = False
        body['errorMsg'] = 'Your session has expired.'
        self.response.out.write(simplejson.JSONEncoder().encode(body))
        return
      # Check which type of collection.
      if collection == Names.all:
        # Get collection all.
        body['thoughtDescriptions'] = get_thought_descriptions_for_user(user)
        body['success'] = True
      else:
        self.error(400) # Bad Request
        return

    elif not is_none_or_empty(thought_id) or not is_none_or_empty(thought_name):
      thought_viewable = None
      user_can_view_thought = None
      get_thought = None
      identifier = None
      
      # Take a generic approach for id and name.
      if not is_none_or_empty(thought_id):
        thought_viewable = thought_viewable_by_all_using_id
        user_can_view_thought = user_can_view_thought_using_id
        get_thought = get_thought_using_id
        identifier = thought_id
      elif not is_none_or_empty(thought_name):
        thought_viewable = thought_viewable_by_all_using_name
        user_can_view_thought = user_can_view_thoughtUsingName
        get_thought = get_thoughtUsingName
        identifier = thought_name
      
      # Get the user info.
      user = None
      if not is_none_or_empty(session_id):
        user = authenticate_user_session(session_id)

      if not thought_viewable(identifier):
        # Check session.
        if is_none_or_empty(session_id):
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
        if not user_can_view_thought(user, identifier):
          body['success'] = False
          body['errorMsg'] = 'No such thought exists.'
          self.response.out.write(simplejson.JSONEncoder().encode(body))
          return
        # The user can view the thought at this point in the code.
      
      thought = get_thought(identifier)
      if thought == None:
        self.error(400)
        return
      
      body['success'] = True
      body[Names.thought] = thoughtToDict(thought)
      # Move the following lines into the function above.
      permissionType = get_permission_type(thought, user)
      body[Names.thought][Names.modifiable] = permissionType == permitModify
      body[Names.thought][Names.is_public] = thought_viewable_by_all_using_name(thought.name)
    else:
      raise "LogicError"
        
    self.response.headers[content_type_name] = json_content_type  
    self.response.out.write(simplejson.JSONEncoder().encode(body))
          
  def post(self):
    """Creates a thought based on the input in the POST request.
    """
    self.create_or_update_thought()
  
  def put(self):
    """Creates or updates a thought based on the input in the PUT request.
    """
    self.create_or_update_thought()
  
  def delete(self):
    """Deletes a thought based on the input in the PUT request.
    """
    thought_id = self.request.get(Names.id)
    body = {} 
    session_id = get_session_id(self.request)
    
    # Get the user info.
    user = authenticate_user_session(session_id)
    if user == None:
      body['success'] = False
      body['errorMsg'] = 'Your session has expired.'
      self.response.out.write(simplejson.JSONEncoder().encode(body))
      return
    
    if user_can_modify_thought_using_id(user, thought_id):
      deleteThoughtUsingId(thought_id)
      body['success'] = True
      self.response.out.write(simplejson.JSONEncoder().encode(body))
      return
    else:
      body['success'] = False
      body['errorMsg'] = 'You do not have permission to delete this thought.'
      self.response.out.write(simplejson.JSONEncoder().encode(body))
      return  
    
  def create_or_update_thought(self):
    """Creates or updates a thought based on the HTTP request.
    """
    args = simplejson.loads(self.request.body)
    json_thought = args[Names.thought] # This is not a JSON string but rather a dictionary.
    
    body = {
      'success': None,
      'errorMsg': None
    }
    
    session_id = get_session_id(self.request)
    if is_none_or_empty(session_id):
      body['success'] = False
      body['errorMsg'] = 'You are not logged in.'
      self.response.out.write(simplejson.JSONEncoder().encode(body))
      return

    user = authenticate_user_session(session_id)
    if user == None:
      body['success'] = False
      body['errorMsg'] = 'Your session has expired.'
      self.response.out.write(simplejson.JSONEncoder().encode(body))
      return
      
    thought_has_been_saved = False
    thought = None
    if Names.id not in json_thought:
      thought_has_been_saved = False
    else:
      thought = get_thought_using_id(json_thought[Names.id])
      logging.info('thought: ' + str(thought))
      if thought != None:
        thought_has_been_saved = True
    
    if not thought_has_been_saved:
      id = create_and_save_thought(json_thought, user)
        
      self.response.headers[content_type_name] = json_content_type
      body['success'] = True
      body['id'] = id
      self.response.out.write(simplejson.JSONEncoder().encode(body))
    else:
      # Check that the user has permission to update the thought
      if not is_user_permitted_to_modify_thought(user, thought):
        body['success'] = False
        body['errorMsg'] = 'You are not permmited to modify the thought.'
        self.response.out.write(simplejson.JSONEncoder().encode(body))
        return
        
      update_thought(thought, json_thought, user)
      
      self.response.headers[content_type_name] = json_content_type
      body['success'] = True
      body['id'] = get_thoughtId(thought)
      self.response.out.write(simplejson.JSONEncoder().encode(body))

  
