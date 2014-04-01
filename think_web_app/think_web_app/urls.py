from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

from django.views.generic import TemplateView

from think.views.thought import ThoughtView, PublicThoughtView
from think.views.theme import ThemeView
from think.views.user import log_out

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'think_web_app.views.home', name='home'),
    # url(r'^think_web_app/', include('think_web_app.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),

    (r'^$', TemplateView.as_view(template_name='think/think.html')),
    (r'/thought^$', 'ThoughtView'),
    (r'/theme^$', 'ThemeView'),
    (r'/public^$', 'PublicThoughtView'),
    (r'/logout^$', 'log_out'),
)
