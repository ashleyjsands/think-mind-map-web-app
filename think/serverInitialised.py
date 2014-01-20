"""
A collection of methods for the ServerInitialised Model.
"""


from think.models import Thought, ServerInitialised
import think.MetaData


def initialiseServer():
  """Initialised the Server's Database."""
  if not hasServerBeenInitialised():
    think.MetaData.main()
    markServerAsInitialised()
  
def hasServerBeenInitialised():
  """Checks if the Server has been initialised. 
     
     Returns: true if the Server has been initialised, false otherwise.
  """
  s = ServerInitialised.all().get()
  if s == None:
    return False
  else:
    return s.initialised

def markServerAsInitialised():
  """Marks the Server as initialised."""
  s = ServerInitialised(initialised=True)
  s.put()
  