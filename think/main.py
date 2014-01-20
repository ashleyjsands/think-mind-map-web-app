"""
The main script that initialises the web app to use all the appropriate handlers.
"""


# Must set this env var before importing any part of Django
import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'

from google.appengine.ext import webapp
from google.appengine.ext.webapp import util, template

from think.ThoughtHandlers import ThoughtHandler, PublicThoughtHandler
from think.ThemeHandler import ThemeHandler
from think.UserHandler import *
from think.serverInitialised import initialiseServer

import settings


thinkTemplateDir = os.path.join(settings.TEMPLATE_DIRS[0], 'think')
thinkPage = os.path.join(thinkTemplateDir, 'think.html')

class RootHandler(webapp.RequestHandler):
  
  def get(self):
    context = {
    }
    self.response.out.write(template.render(thinkPage, context))

class PageHandler(webapp.RequestHandler):
  
  def get(self, page):
    context = {
    }
    self.response.out.write(template.render(os.path.join(thinkTemplateDir, page), context))

def main():
  initialiseServer()
  urlMappings = [
    ('/', RootHandler),
    ('/page/(.*)', PageHandler),
    ('/thought', ThoughtHandler),
    ('/theme', ThemeHandler),
    ('/public', PublicThoughtHandler),    
    ('/logout', LogoutHandler),
  ]
  application = webapp.WSGIApplication(urlMappings, debug=False)
  util.run_wsgi_app(application)

if __name__ == '__main__':
  main()