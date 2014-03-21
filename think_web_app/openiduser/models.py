from django.db import models


class User(models.Model):
  """A user's openid details."""
  claimedId = models.TextField()


class Session(models.Model):
  """A login session for the user"""
  user = models.ForeignKey('User')
  id = models.TextField()
  datetime = models.DateTimeField()
