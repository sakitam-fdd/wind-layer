from flask import abort, jsonify, request
from src.app import app
from src.enum.res import ResModel
from src.utils.common import check_fields
from src.config.grib import get_page_url
from src.service.process import process_json, process_raster


"""
根据用户参数解析对应grib文件，并返回json数据，如果本地存在则直接读取，如果不存在，则执行下载后解析
"""

PROCESS_JSON_PARAMS_ENUM = [
  {
    'value': 'date',
    'required': True
  },  # gfs 日期
  {
    'value': 'gfsTime',
    'required': True
  },  # gfs 时间
  {
    'value': 'res',
    'required': True
  },  # 分辨率
  {
    'value': 'forecastsTime',
    'required': False,
    'default': 'f000'
  },  # 预报时间 前120h逐一小时
  {
    'value': 'bbox',
    'required': False,
    'default': '0,-90,360,90'
  },  # 数据范围
  {
    'value': 'level',
    'required': False,
    'default': 'lev_10_m_above_ground'
  },  # 数据层次
  {
    'value': 'variables',
    'required': False,
    'default': 'var_UGRD,var_VGRD'
  },  # 需要下载的要素
]

@app.route('/json', methods=['GET', 'POST'])
@app.errorhandler(400)
def process_json_controller():
  method = request.method
  try:
    params = {}
    if method == 'GET' and request.args is not None:
      params = check_fields(PROCESS_JSON_PARAMS_ENUM, request.args, True)
    elif method == 'POST' and request.json is not None:
      params = check_fields(PROCESS_JSON_PARAMS_ENUM, request.json, True)

    if len(params) > 0:
      bbox = params['bbox'].split(',')
      bbox_str = f"leftlon={bbox[0]}&rightlon={bbox[2]}&toplat={bbox[3]}&bottomlat={bbox[1]}"
      variables = params['variables'].split(',')
      fileprefix = '-'.join(map(lambda str: str.lower(), variables))
      variables = ''.join(map(lambda str: f"{str}=on&", variables))
      params.__setitem__('bbox', bbox_str)
      params.__setitem__('extent', bbox)
      params.__setitem__('variables', variables)
      params.__setitem__('file_name', fileprefix)

      filename = process_json(params)
      if filename is not None:
        return jsonify(ResModel(filename).success())
      else:
        return jsonify(ResModel('无数据').not_find(filename['message']))
    else:
      return jsonify()
  except Exception as e:
    return e



@app.route('/raster', methods=['GET', 'POST'])
@app.errorhandler(400)
def process_raster_controller():
  method = request.method
  try:
    params = {}
    if method == 'GET' and request.args is not None:
      params = check_fields(PROCESS_JSON_PARAMS_ENUM, request.args, True)
    elif method == 'POST' and request.json is not None:
      params = check_fields(PROCESS_JSON_PARAMS_ENUM, request.json, True)

    if len(params) > 0:
      bbox = params['bbox'].split(',')
      bbox_str = f"leftlon={bbox[0]}&rightlon={bbox[2]}&toplat={bbox[3]}&bottomlat={bbox[1]}"
      variables = params['variables'].split(',')
      fileprefix = '-'.join(map(lambda str: str.lower(), variables))
      variables = ''.join(map(lambda str: f"{str}=on&", variables))
      params.__setitem__('bbox', bbox_str)
      params.__setitem__('extent', bbox)
      params.__setitem__('variables', variables)
      params.__setitem__('file_name', fileprefix)

      filename = process_raster(params)
      if filename is not None:
        return jsonify(ResModel(filename).success())
      else:
        return jsonify(ResModel('无数据').not_find(filename['message']))
    else:
      return jsonify()
  except Exception as e:
    return e
