"""
A collection of HTTP handlers that provide handle requests related to user sessions.
"""

from django.contrib.auth import logout


def log_out(request):
    """ Handlers logout requests.
      
       Returns: empty HTTP response.
    """
    logout(request)
    return HttpResponse("")
