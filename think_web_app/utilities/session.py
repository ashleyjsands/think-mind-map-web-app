"""
Generic functions relating to sessions.
"""


from datetime import datetime, timedelta


# Constants
expires = 'expires'

def createCookie(response, cookieName, cookieValue):
    """Creates the session cookie in the response.
       
       Params:
         response: the HTTP response.
         cookieName: the name of the cookie.
         cookieValue: the value of the cookie.
    """
    response.headers.add_header('Set-Cookie', cookieName + '=' + cookieValue)

def deleteCookie(response, cookieName, cookieValue):
    """Deletes the cookie in the client.
       
       Params:
         response: the HTTP response.
         cookieName: the name of the cookie.
    """
    expiryDateTime = datetime.now() - timedelta(days = 1)
    expiryDateTime = expiryDateTime.strftime('%a, %d %b %Y %H:%M:%S') # Wdy, DD-Mon-YY HH:MM:SS GMT
    response.headers.add_header('Set-Cookie', cookieName + '=' + cookieValue + "; " + expires + "=" + expiryDateTime)
  