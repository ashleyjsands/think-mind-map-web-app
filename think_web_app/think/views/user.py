"""
A collection of HTTP handlers that provide handle requests related to user sessions.
"""



from utilities.session import delete_cookie
from openiduser.session import delete_session, session_id_param_name, get_session_id


def log_out(request):
    """ Handlers logout requests.
       
       Expects parameters in the POST request:
         session_id: a string to identify the user's session.
      
       Returns: empty HTTP response.
    """
    session_id = get_session_id(request)
    delete_cookie(response, session_id_param_name, session_id)
    delete_session(session_id)
    return HttpResponse("")
