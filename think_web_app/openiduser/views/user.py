"""
A collection of HTTP handlers that provide handle requests related to user sessions.
"""



from utilities.session import deleteCookie
from openiduser.session import deleteSession, sessionIdParamName, getSessionId


def log_out(request):
    """ Handlers logout requests.
       
       Expects parameters in the POST request:
         session_id: a string to identify the user's session.
      
       Returns: empty HTTP response.
    """
    session_id = get_session_id(request)
    delete_cookie(response, session_id_param_name, sessionId)
    delete_session(sessionId)
    return HttpResponse(‘’)
    