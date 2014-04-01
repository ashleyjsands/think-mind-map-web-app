"""
A collection of miscellaneous methods.
"""


def get_id(model):
  """Gets the model's id.
     
     Args:
       theme: the model.
     
     Returns: a string representing the model's id.
  """
  return str(model.key())
