"""
A collection of generic utility methods.
"""


import os
import re
import sys


# addIpaddrToPythonPath Constants
ipaddrPathMac = '/Applications/GoogleAppEngineLauncher.app//Contents/Resources/GoogleAppEngine-default.bundle/Contents/Resources/google_appengine/lib/ipaddr'

def addIpaddrToPythonPath():
    """Adds ipaddr module to the Python Path.
    """
    if os.name == 'posix': # Mac O/S 
        sys.path.append(ipaddrPathMac)
    else:
        raise 'Unknown ipaddr path for this os.'

# getUrlFilePath Constants
urlRegEx = "^((http[s]?|ftp):\/)?\/?([^:\/\s]+)(:([^\/]*))?((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(\?([^#]*))?(#(.*))?$"
pathIndex = 6
fileIndex = 8
  
def getUrlFilePath(url):
  """Gets the file Path from a URL.
  
     Args:
       url: the URL.
     
     Returns:
       the file Path of the URL.
  """
  m = re.search(urlRegEx, url) 
  if m == None:
    return None
  return m.group(pathIndex) + m.group(fileIndex)

def getFilesWithExtension(dir, ext):
  """Gets all files in a directory with the given extension.
  
     Args:
       dir: the directory path.
       ext: the file extension.
     
     Returns:
       A list of file names that exist in the directory with the given extension.
  """
  files = os.listdir(dir)
  fileNames = []
  for file in files:
    if file.endswith(ext):
      fileNames.append(file)
  return fileNames

def lchop(str, chopStr):
  """Chops the chopStr from the left of the str.
  
     Args:
       str: the string that is chopped.
       chopStr: the string that is chopped off the other.
    
    Returns:
      the remaining string of str with chopStr taking from the left.
      
      If chopStr can not be chopped from str, then None is returned.
  """
  if str.startswith(chopStr):
    return str[len(chopStr):]
  else:
    return None

def rchop(str, chopStr):
  """Chops the chopStr from the right of the str.
  
     Args:
       str: the string that is chopped.
       chopStr: the string that is chopped off the other.
    
    Returns:
      the remaining string of str with chopStr taking from the right.
      
      If chopStr can not be chopped from str, then None is returned.
  """
  if str.endswith(chopStr):
    return str[:(len(str) - len(chopStr))]
  else:
    return None

def is_none_or_empty(str):
  """Checks if a string is None of Empty.
  
     Args:
       str: the string that is checked.
    
    Returns:
      true if the string is None or "", otherwise false.
  """
  return str == None or str == ""
  
def modelListToDict(modelList):
  """Converts a list of models into a dictionary of model keys to models.
    
     Args:
       modelList: the list of models.
       
     Returns: a dict of model keys associated to models.
  """
  dict = {}
  for model in modelList:
    dict[str(model.key())] = model
  return dict
  
def requestArgsToDict(request):
  """Converts the URL and POST parameters to a singly-valued dictionary.

     Returns:
       dict with the URL and POST body parameters
  """
  req = request
  return dict([(arg, req.get(arg)) for arg in req.arguments()])
