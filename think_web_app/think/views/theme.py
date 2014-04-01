
from django.views.generic import View


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
    
    if Names.id in jsonTheme and not is_none_or_empty(jsonTheme['id']):
      if not user_can_modify_theme(user, get_theme_using_id(jsonTheme['id'])):
        body['success'] = False
        body['errorMsg'] = 'You can not modify this theme.'
        self.response.out.write(simplejson.JSONEncoder().encode(body))
        return
    
    id = create_or_update_theme(jsonTheme, user)
    
    body['success'] = True
    body['id'] = id
    self.response.out.write(simplejson.JSONEncoder().encode(body))
  
  def delete(self, *ars, **kwargs):
    """Deletes the requested Theme.
       
       GetArgs:
         themeId: the id of the theme to delete.
    """
    themeId = self.request.get(Names.id)
    if is_none_or_empty(themeId):
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
    
    # Check Permissions
    if not user_can_modify_theme(user, get_theme_using_id(themeId)):
      body['success'] = False
      body['errorMsg'] = 'You can not delete this theme.'
      self.response.out.write(simplejson.JSONEncoder().encode(body))
      return
    
    theme = get_theme_using_id(themeId)
    if theme == None:
      self.error(400) # Bad Request
      return
      
    delete_theme(theme)
    
    body['success'] = True
    self.response.out.write(simplejson.JSONEncoder().encode(body))
