"""
A collection of generic utility methods.
"""


import os
import re
import sys


# get_url_file_path Constants
url_regex = "^((http[s]?|ftp):\/)?\/?([^:\/\s]+)(:([^\/]*))?((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(\?([^#]*))?(#(.*))?$"
pathIndex = 6
fileIndex = 8
  
def get_url_file_path(url):
  """Gets the file Path from a URL.
  
     Args:
       url: the URL.
     
     Returns:
       the file Path of the URL.
  """
  m = re.search(url_regex, url) 
  if m == None:
    return None
  return m.group(pathIndex) + m.group(fileIndex)

def get_files_with_extensions(dir, ext):
  """Gets all files in a directory with the given extension.
  
     Args:
       dir: the directory path.
       ext: the file extension.
     
     Returns:
       A list of file names that exist in the directory with the given extension.
  """
  files = os.listdir(dir)
  file_names = []
  for file in files:
    if file.endswith(ext):
      file_names.append(file)
  return file_names

def lchop(str, chop_str):
  """Chops the chop_str from the left of the str.
  
     Args:
       str: the string that is chopped.
       chop_str: the string that is chopped off the other.
    
    Returns:
      the remaining string of str with chop_str taking from the left.
      
      If chop_str can not be chopped from str, then None is returned.
  """
  if str.startswith(chop_str):
    return str[len(chop_str):]
  else:
    return None

def rchop(str, chop_str):
  """Chops the chop_str from the right of the str.
  
     Args:
       str: the string that is chopped.
       chop_str: the string that is chopped off the other.
    
    Returns:
      the remaining string of str with chop_str taking from the right.
      
      If chop_str can not be chopped from str, then None is returned.
  """
  if str.endswith(chop_str):
    return str[:(len(str) - len(chop_str))]
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
  
def model_list_to_dict(model_list):
  """Converts a list of models into a dictionary of model keys to models.
    
     Args:
       model_list: the list of models.
       
     Returns: a dict of model keys associated to models.
  """
  dict = {}
  for model in model_list:
    dict[str(model.id)] = model
  return dict
  
def request_args_to_dict(request):
  """Converts the URL and POST parameters to a singly-valued dictionary.

     Returns:
       dict with the URL and POST body parameters
  """
  req = request
  return dict([(arg, req.get(arg)) for arg in req.arguments()])
