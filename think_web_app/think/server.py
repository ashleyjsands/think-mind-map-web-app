"""
A collection of methods for the ServerInitialised Model.
"""


from think.models import Thought, ServerInitialised
import think.data


def initialise_server():
  """Initialised the Server's Database."""
  if not has_server_been_initialised():
    think.data.main()
    mark_server_as_initialised()
  
def has_server_been_initialised():
  """Checks if the Server has been initialised. 
     
     Returns: true if the Server has been initialised, false otherwise.
  """
  s = ServerInitialised.objects.all()
  if not s:
    return False
  else:
    return s[0].initialised

def mark_server_as_initialised():
  """Marks the Server as initialised."""
  s = ServerInitialised(initialised=True)
  s.save()
  
