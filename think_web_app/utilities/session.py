"""
Generic functions relating to sessions.
"""


from datetime import datetime, timedelta


# Constants
expires = 'expires'

def create_cookie(response, cookie_name, cookie_value):
    """Creates the session cookie in the response.
       
       Params:
         response: the HTTP response.
         cookie_name: the name of the cookie.
         cookie_value: the value of the cookie.
    """
    response.headers.add_header('Set-Cookie', cookie_name + '=' + cookie_value)

def delete_cookie(response, cookie_name, cookie_value):
    """Deletes the cookie in the client.
       
       Params:
         response: the HTTP response.
         cookie_name: the name of the cookie.
    """
    expiry_date_time = datetime.now() - timedelta(days = 1)
    expiry_date_time = expiry_date_time.strftime('%a, %d %b %Y %H:%M:%S') # Wdy, DD-Mon-YY HH:MM:SS GMT
    response.headers.add_header('Set-Cookie', cookie_name + '=' + cookie_value + "; " + expires + "=" + expiry_date_time)
  