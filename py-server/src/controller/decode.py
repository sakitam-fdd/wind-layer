import rasterio
import logging
from eccodes import eccodes
from flask import abort, jsonify, request


from src.app import app
from src.service.grib import download_data
from src.enum.wind import WindEnum

VERBOSE = 1  # verbose error reporting
logger = logging.getLogger('app.controller.decode')

def own_decode_data(input_path):
  # sample_id = codes_grib_new_from_samples("v-component_of_wind_height_above_ground")
  header = {}
  values = []
  fin = open(input_path, 'rb')

  keys = WindEnum()

  while 1:
    gid = eccodes.codes_grib_new_from_file(fin)
    if gid is None:
      break

    for key in keys:
      try:
        item = eccodes.codes_get(gid, key)
        header.__setitem__(key, item)
        print('  %s: %s' % (key, item))
      except eccodes.KeyValueNotFoundError as err:
        # Full list of exceptions here:
        #   https://confluence.ecmwf.int/display/ECC/Python+exception+classes
        logger.info('  Key="%s" was not found: %s' % (key, err.msg))
      except eccodes.CodesInternalError as err:
        print('Error with key="%s" : %s' % (key, err.msg))

    values = eccodes.codes_get_values(gid)

    average = eccodes.codes_get(gid, 'average')
    minimum = eccodes.codes_get(gid, 'minimum')
    maximum = eccodes.codes_get(gid, 'maximum')
    header.__setitem__('average', average)
    header.__setitem__('minimum', minimum)
    header.__setitem__('maximum', maximum)

    eccodes.codes_release(gid)

  fin.close()

  return {
    'header': header,
    'data': values
  }


def decode_by_rasterio():
  grib_path = 'xxx'
  logger.info(grib_path)
  with rasterio.open(grib_path) as src:
    return src.read()


# 将grib 转成json数据
@app.route('/reader/json', methods=['GET', 'POST'])
def wright_json():
  method = request.method
  LEVEL = '0p25'
  if method == 'GET':
    if not request.args or 'level' not in request.args:
      abort(400)
    else:
      LEVEL = request.args['level'] or 'u.0p25.grib'
  elif method == 'POST':
    if not request.json or 'level' not in request.json:
      abort(400)
    else:
      LEVEL = request.json['level'] or 'u.0p25.grib'

  ufile = download_data(
    '20200322',
    '00',
    '1p00',
    'leftlon=0&rightlon=360&toplat=90&bottomlat=-90',
    'lev_10_m_above_ground=on',
    'var_UGRD=on',
    'u'
  )

  vfile = download_data(
    '20200322',
    '00',
    '1p00',
    'leftlon=0&rightlon=360&toplat=90&bottomlat=-90',
    'lev_10_m_above_ground=on',
    'var_VGRD=on',
    'v'
  )

  udata = own_decode_data(ufile)
  vdata = own_decode_data(vfile)

  return jsonify({
    'code': 200,
    'msg': 'success',
    'data': [
      {
        'header': udata['header'],
        'data': udata['data'].tolist()
      },
      {
        'header': vdata['header'],
        'data': vdata['data'].tolist()
      },
    ]
  })


if __name__ == '__main__':
  decode_by_rasterio()
