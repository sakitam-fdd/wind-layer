from flask import jsonify

from src.app import app

"""
获取元数据列表，gfs原始格点数据，每个时间存在一个grib数据中
"""


@app.route('/', methods=['GET', 'POST'])
def index():
  return jsonify({
    "code": 0,
    "success": True,
    "data": "success"
  })
