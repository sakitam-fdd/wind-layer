from enum import Enum

class noaa_site_label(Enum):
  DIRECTORY = 'directory:'
  FILE_LIST = '\n**NEW** Select one file only '
  SURFACES = 'select the levels desired:'
  VARIABLES = 'select the variables desired:'
