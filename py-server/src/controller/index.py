from flask import abort, jsonify, request
from src.app import app
from src.enum.res import ResModel
from src.utils.common import check_fields
from src.config.grib import get_page_url
from src.service.index import get_gfs_params
from src.service.grib import download_data

"""
获取元数据列表，gfs原始格点数据，每个时间存在一个grib数据中
"""


@app.route('/', methods=['GET', 'POST'])
def index():
  return jsonify(ResModel('success').success())


"""
根据用户参数下载对应grib文件（注意只是在服务端执行下载，并不会
发送到客户端）
"""

DOWNLOAD_PARAMS_ENUM = [
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

@app.route('/download', methods=['GET', 'POST'])
@app.errorhandler(400)
def start_download():
  method = request.method
  try:
    params = {}
    if method == 'GET' and request.args is not None:
      params = check_fields(DOWNLOAD_PARAMS_ENUM, request.args, True)
    elif method == 'POST' and request.json is not None:
      params = check_fields(DOWNLOAD_PARAMS_ENUM, request.json, True)

    if len(params) > 0:
      bbox = params['bbox'].split(',')
      bbox = f"leftlon={bbox[0]}&rightlon={bbox[2]}&toplat={bbox[3]}&bottomlat={bbox[1]}"
      variables = params['variables'].split(',')
      fileprefix = '-'.join(map(lambda str: str.lower(), variables))
      variables = ''.join(map(lambda str: f"{str}=on&", variables))
      filename = download_data(params['date'], params['gfsTime'], params['res'], params['forecastsTime'], bbox, params['level'], variables, fileprefix)
      if filename['code'] == 200:
        return jsonify(ResModel(filename['data']).success())
      else:
        return jsonify(ResModel('无数据').not_find(filename['message']))
    else:
      return jsonify()
  except Exception as e:
    return e


"""
获取相关可使用参数
"""

GET_PARAMS_ENUM = [
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
  }  # 分辨率
]


@app.route('/params', methods=['GET', 'POST'])
@app.errorhandler(400)
def get_surfaces():
  method = request.method
  try:
    params = {}
    if method == 'GET' and request.args is not None:
      params = check_fields(GET_PARAMS_ENUM, request.args, True)
    elif method == 'POST' and request.json is not None:
      params = check_fields(GET_PARAMS_ENUM, request.json, True)

    if len(params) > 0:
      page_url = get_page_url(params['date'], params['gfsTime'], params['res'])
      params = get_gfs_params(page_url)
      return jsonify(ResModel(params).success())
    else:
      return jsonify()
  except Exception as e:
    return e
