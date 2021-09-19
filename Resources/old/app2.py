import os

import numpy as np
import pandas as pd
import datetime as dt

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect, Metadata, Table



from flask import Flask, jsonify, render_template, request, redirect, session
# from flask_sqlalchemy import SQLAlchemy

import sqlite3

# from flask_cors import CORS

#################################################
# Database Setup
#################################################

con = sqlite3.connect('Resources/air.sqlite')
airquality = pd.read_sql("SELECT * FROM airquality", con)

# engine = create_engine("sqlite:///Resources/air.sqlite")
# conn = engine.connect()

# reflect database into a new model
# base = automap_base()

# reflect the tables
# base.prepare(engine, reflect=True)

# Save reference to the tables
# airquality = base.classes.airquality

# inspector=inspect(engine)
# inspector.get_table_names()

# airquality = inspect.__name__

# # Create a MetaData instance
# metadata = MetaData(engine).reflect()
# # print(metadata.tables)

# # reflect db schema to MetaData
# # metadata.reflect(bind=engine)
# airquality = metadata.tables.airquality
# print(airquality)

#################################################
# Flask Setup
#################################################

app = Flask(__name__)
# CORS(app)

#################################################
# Flask Routes
#################################################


# @app.route("/")
# def outside():
# 	return render_template('index.html', title="page")




if __name__ == '__main__':
    app.run(debug=True)