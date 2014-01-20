from django.conf.urls.defaults import *


urlpatterns = patterns('',
    url(r'^theme/$', 'think.ThemeHandler.ThemeHandler', name='ThemeHandler'),
)