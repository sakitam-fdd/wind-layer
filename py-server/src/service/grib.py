import os
import requests
from requests import HTTPError

from src.config.noaa_site import get_noaa_config, get_grib_filepath

def download_data(date, gfs_time, res, bbox, level, variables):
  config = get_noaa_config(
    date, gfs_time, res, bbox, level, variables
  )

  filename = get_grib_filepath(f"{date}{gfs_time}_{res}.grib")

  try:
    r = requests.get(config.get('GFS_URL'))
    r.raise_for_status()
  except HTTPError as e:
    raise HTTPError("Something went wrong with the data download.") from e

  with open(filename, "wb") as f:
    f.write(r.content)

  return filename

if __name__ == '__main__':
  download_data(
    '20200321',
    '06',
    '1p00',
    'leftlon=0&rightlon=360&toplat=90&bottomlat=-90',
    'lev_10_m_above_ground=on',
    'var_UGRD=on&var_VGRD=on'
  )

  print('success')
