import os
from flask import Flask

# 实例化app，参数如下：
# import_name,
# static_url_path=None,
# static_folder="static",
# static_host=None,
# host_matching=False,
# subdomain_matching=False,
# template_folder="templates",
# instance_path=None,
# instance_relative_config=False,
# root_path=None,
BASE_DIR = os.getcwd()
root_folder_path = os.path.abspath(os.path.join(BASE_DIR, ''))
static_folder_root = os.path.join(root_folder_path, "static")
# tip: 为什么此处需要指定绝对路径 - 因为大部分应用初始化可能在启动脚本中，所以其查找目录以项目根目录查找不会出现问题
# 但此处启动脚本在其他位置，所以需要指定其绝对路径
app = Flask(__name__, static_folder = static_folder_root)
# app.register_routes_to_resources(static_folder_root)
app.config['JSON_AS_ASCII'] = False  # 使jsonify返回json字符串时，支持中文
