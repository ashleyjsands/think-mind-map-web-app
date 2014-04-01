
from google.appengine.ext import webapp, db
from google.appengine.ext.webapp import util, template

from utilities import is_none_or_empty


class CreateEditEntityHandler(webapp.RequestHandler):

    def __init__(self, modelClass, formClass, templatePath, postUri, successUri):
        self.modelClass = modelClass
        self.formClass = formClass
        self.templatePath = templatePath
        self.postUri = postUri
        self.successUri = successUri
    
    def render_page(self):
        id = self.request.get('id')
        entity = None
        if not is_none_or_empty(id):
            id = int(id)
            entity = self.modelClass.get(db.Key.from_path(self.modelClass.__name__, id))
        context = {
            'id': id,
            'form': self.formClass(instance=entity),
            'postUri': self.postUri,
        }
        self.response.out.write(template.render(self.templatePath, context))
    
    def get(self):
        self.render_page()
        
    def post(self):
        id = self.request.get('id')
        entity = None
        if not is_none_or_empty(id):
            id = int(id)
            entity = self.modelClass.get(db.Key.from_path(self.modelClass.__name__, id))
            
        data = self.formClass(data=self.request.POST, instance=entity)
        if data.is_valid():
            # Save the data, and redirect to the view page
            entity = data.save(commit=False)
            entity.put()
            self.redirect(self.successUri)
        else:
            # Reprint the form
            self.render_page(data)
