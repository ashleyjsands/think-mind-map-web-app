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
    (r'^think/tab-thoughts.html$', TemplateView.as_view(template_name='think/tab-thoughts.html')),
    (r'^think/newuser-dialog.html$', TemplateView.as_view(template_name='think/newuser-dialog.html')),
    (r'^think/tab-login.html$', TemplateView.as_view(template_name='think/tab-login.html')),
    (r'^think/tab-register.html$', TemplateView.as_view(template_name='think/tab-register.html')),
    (r'^think/tab-about.html$', TemplateView.as_view(template_name='think/tab-about.html')),
    (r'^thought$', 'think.views.thought.ThoughtView'),
    (r'^theme$', 'think.views.theme.ThemeView'),
    (r'^public$', 'think.views.thought.PublicThoughtView'),
    (r'^logout$', 'think.views.user.log_out'),
)
