"""
A collection of methods that delete all data in the database(datastore). Currently does not work due an error 
with how many models you can delete in one HTTP request.
"""

import logging
from datetime import datetime
import uuid

from google.appengine.ext import webapp
from google.appengine.ext.db import GqlQuery, delete

from think.models import *


def deleteAll():
  """Delete All Data"""
  deleteAllConnection()
  deleteAllNode()
  deleteAllPermission()
  deleteAllServerInitialised()
  deleteAllSession()
  deleteAllThought()
  deleteAllUser()

limit = 1000

def deleteAllConnection():
  deleteAllModel(Connection)
  
def deleteAllNode():
  deleteAllModel(Node)
  
def deleteAllPermission():
  deleteAllModel(Permission)
  
def deleteAllServerInitialised():
  deleteAllModel(ServerInitialised)
  
def deleteAllSession():
  deleteAllModel(Session)
  
def deleteAllThought():
  deleteAllModel(Thought)
  
def deleteAllUser():
  deleteAllModel(User)
  
def deleteAllModel(model):
  query = model.all()
  entries = query.fetch(limit)
  while entries:
    delete(entries)