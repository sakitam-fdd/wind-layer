import sqlite3

def connect_db():
  con = sqlite3.connect('path')
  # con = sqlite3.connect(':memory') # 内存数据库
