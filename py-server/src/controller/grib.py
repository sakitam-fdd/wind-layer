import os
from eccodes import *
from flask import abort, jsonify, request
import numpy as np
import rasterio
from rasterio.plot import reshape_as_image
from PIL import Image
import execjs as execjs

from src.app import app
from src.enum.wind import WindEnum

BASE_PATH = '/Users/dongdong.feng/Documents/gitlab/wind-server/static/data/'
OUTPUT = os.path.join(BASE_PATH, 'u.0p25.grib_samples.grib')
VERBOSE = 1  # verbose error reporting


def wrap_num(x, own_range, include_max):
  own_max = own_range[1]
  own_min = own_range[0]
  d = own_max - own_min

  if x == own_max and include_max == True:
    return x
  else:
    return ((x - own_min) % d + d) % d + own_min


def wrap_coordinates(coordinates, trans):
  if trans:
    lng = wrap_num(coordinates[0], [-180, 180], True)
    lat = wrap_num(coordinates[1], [-90, 90], True)
  else:
    lng = coordinates[0]
    lat = coordinates[1]

  return [lng, lat]


def write_image_title(width, height):
  float_data = [

  ]

  r = bytearray(28)

  # l.set(floatData)

  images_data = np.array([], dtype='uint8')
  origin_data = np.array(r, dtype='uint8')
  float_bit = np.array(r, dtype='float32')

  # float_bit.

  for i in float_bit:
    float_bit[i] = float_data[i]

  for y in height:
    for x in width:
      d_index = x % 4
      i = (y * width + x) * 4
      images_data.index(i, origin_data[d_index])
      images_data.index(i + 1, origin_data[d_index + 1])
      images_data.index(i + 2, 0)
      images_data.index(i + 3, 255)

  return images_data


def write_image_title_v8(width, height, float_data):
  ctx = execjs.compile("""
        function writeImageTitle(width, height, floatData) {
            const data = [];
            const r = new ArrayBuffer(4 * floatData.length); // 开辟一个28 [7 * 4]字节的内存
            const o = new Uint8Array(r); // 无符号整型数组
            const l = new Float32Array(r);

            l.set(floatData);

            for (let y = 0; y < height; y++) {
              for (let x = 0; x < width; x++) {
                // const dx = x % 4;
                const dIndex = Math.floor(x / 4);
                const i = (y * width + x) * 4;
                // const k = y * width + (x + width / 2) % width;
                data[i] = o[dIndex];
                data[i + 1] = o[dIndex + 1];
                data[i + 2] = 0;
                data[i + 3] = 255; // FIXME: 不要在alpha存值
              }
            }

            return data;
          }
    """)

  data = ctx.call("writeImageTitle", width, height, float_data)

  r_data = []
  g_data = []
  b_data = []

  for i in range(0, len(data) - 1, 4):
    r_data.append(data[i])
    g_data.append(data[i + 1])
    b_data.append(data[i + 2])

  return np.array([])


def get_title_image_data(u_header, v_header):
  min0 = u_header['minimum']
  max0 = u_header['maximum']  # r通道
  min1 = v_header['minimum']
  max1 = v_header['maximum']  # g通道
  min2 = 0
  max2 = 0  # b通道
  time = 1583798419456  # 时间
  xmin = u_header['longitudeOfFirstGridPointInDegrees']
  ymin = u_header['latitudeOfFirstGridPointInDegrees']
  xmax = u_header['longitudeOfLastGridPointInDegrees']
  ymax = u_header['latitudeOfLastGridPointInDegrees']
  bottomLeft = wrap_coordinates([xmin, ymin], False)
  topRight = wrap_coordinates([xmax, ymax], False)

  return [
    min0,
    max0,
    min1,
    max1,
    min2,
    max2,
    time,
    bottomLeft[0],
    bottomLeft[1],
    topRight[0],
    topRight[1]
  ]


"""
导入数据
"""


def import_data(filename):
  with rasterio.open(filename) as src:
    return src.read()


def prepare_array(bands):
  # Drop extra row in array
  # TODO: Something more elegant like interpolate rows
  bands = bands[:, :-1, :]

  # Convert coverage from 0->360 to -180->180
  bands = np.roll(bands, int(0.5 * bands.shape[2]), 2)

  # rescale values from floats to uint8
  for i in range(0, bands.shape[0]):
    bands[i] = (255 * (bands[i] - bands[i].min()) / (bands[i].max() - bands[i].min()))

  # Build array in image format
  empty_band = np.zeros((1, bands.shape[1], bands.shape[2]))
  # alpha_band = np.full(1, (255, bands.shape[1], bands.shape[2]))

  bands = np.concatenate((bands, empty_band), axis=0)
  bands = bands.astype(np.uint8)

  return bands


def write_image(filename, image):
  os.makedirs(os.path.dirname(filename), exist_ok=True)
  im = Image.fromarray(image)
  im.save(filename)


def slice_image(image, start_y, end_y, start_x, end_x):
  return image[start_y:end_y, start_x:end_x, :]


@app.route('/grib/download', methods=['GET', 'POST'])
def download_grib():
  return jsonify({})


def own_decode_data(input_path):
  # sample_id = codes_grib_new_from_samples("v-component_of_wind_height_above_ground")
  header = {}
  values = []
  fin = open(input_path, 'rb')

  keys = WindEnum()

  while 1:
    gid = codes_grib_new_from_file(fin)
    if gid is None:
      break

    for key in keys:
      try:
        item = codes_get(gid, key)
        header.__setitem__(key, item)
        print('  %s: %s' % (key, item))
      except KeyValueNotFoundError as err:
        # Full list of exceptions here:
        #   https://confluence.ecmwf.int/display/ECC/Python+exception+classes
        print('  Key="%s" was not found: %s' % (key, err.msg))
      except CodesInternalError as err:
        print('Error with key="%s" : %s' % (key, err.msg))

    values = codes_get_values(gid)

    average = codes_get(gid, 'average')
    minimum = codes_get(gid, 'minimum')
    maximum = codes_get(gid, 'maximum')
    header.__setitem__('average', average)
    header.__setitem__('minimum', minimum)
    header.__setitem__('maximum', maximum)

    codes_release(gid)

  fin.close()

  return {
    'header': header,
    'data': values
  }


@app.route('/grib/reader', methods=['GET', 'POST'])
def reader():
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

  u_path = os.path.join(BASE_PATH, 'u.' + LEVEL + '.grib')
  v_path = os.path.join(BASE_PATH, 'v.' + LEVEL + '.grib')

  udata = own_decode_data(u_path)
  vdata = own_decode_data(v_path)

  # json_str = json.dumps([
  #     udata,
  #     vdata,
  # ])
  # print(json_str)

  bands = np.array([
    udata['data'].reshape(udata['header']['Nj'], udata['header']['Ni']).tolist(),
    vdata['data'].reshape(udata['header']['Nj'], udata['header']['Ni']).tolist(),
  ])

  bands = prepare_array(bands)

  title_data = get_title_image_data(udata['header'], vdata['header'])

  title_message = write_image_title_v8(udata['header']['Ni'], 8, title_data)

  # title_message_nd = np.array(title_message)
  # title_message_nd = title_message_nd.astype(np.uint8)
  print(title_message)

  image = reshape_as_image(bands)

  write_image(os.path.join(BASE_PATH, LEVEL + '.png'), image)

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


@app.route('/grib/reader_nm', methods=['GET', 'POST'])
def reader_nm():
  method = request.method
  INPUT = os.path.join(BASE_PATH, 'u.0p25.grib')
  if method == 'GET':
    if not request.args or 'dataName' not in request.args:
      abort(400)
    else:
      INPUT = os.path.join(BASE_PATH, request.args['dataName'] or 'u.0p25.grib')
  elif method == 'POST':
    if not request.json or 'dataName' not in request.json:
      abort(400)
    else:
      INPUT = os.path.join(BASE_PATH, request.args['dataName'] or 'u.0p25.grib')

  grib_header = {}

  bands = import_data(INPUT)

  grib_header["umin"] = bands[0, :, :].min()
  grib_header["umax"] = bands[0, :, :].max()
  grib_header["vmin"] = bands[1, :, :].min()
  grib_header["vmax"] = bands[1, :, :].max()

  bands = prepare_array(bands)

  image = reshape_as_image(bands)

  write_image(os.path.join(BASE_PATH, 'i.png'), image)

  return jsonify({
    'code': 200,
    'msg': 'success',
    'data': grib_header
  })


# 将grib 转成json数据
@app.route('/grib/get_json', methods=['GET', 'POST'])
def wrightJson():
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

  u_path = os.path.join(BASE_PATH, 'u.' + LEVEL + '.grib')
  v_path = os.path.join(BASE_PATH, 'v.' + LEVEL + '.grib')

  udata = own_decode_data(u_path)
  vdata = own_decode_data(v_path)

  # json_str = json.dumps([
  #     udata,
  #     vdata,
  # ])
  # print(json_str)

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
