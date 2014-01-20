from appengine_django.models import BaseModel
from google.appengine.ext import db


class User(BaseModel):
  """A user's openid details."""
  claimedId = db.LinkProperty()


class Session(BaseModel):
  """A login session for the user"""
  user = db.ReferenceProperty(User)
  id = db.StringProperty()
  datetime = db.DateTimeProperty()