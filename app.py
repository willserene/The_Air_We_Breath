import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect

from flask import Flask, jsonify

import datetime as dt


#################################################
# Database Setup
#################################################

engine = create_engine("sqlite:///Resources/hawaii.sqlite")

# reflect database into a new model
base = automap_base()

# reflect the tables
base.prepare(engine, reflect=True)

# Save reference to the tables
Measurement = base.classes.measurement
Station = base.classes.station

#################################################
# Flask Setup
#################################################

app = Flask(__name__)

#################################################
# Flask Routes
#################################################

@app.route("/")
def home():

    url = 'http://127.0.0.1:5000'

    print("server received a request for 'Home' page")
    
    routes = (
        f"<b>API Routes:</b> <p>"
        f"<a href = " + url + "/api/v1.0/precipitation target = '_blank'>" + "/api/v1.0/precipitation" + "</a> <p>"
        f"<a href = " + url + "/api/v1.0/stations target = '_blank'>" + "/api/v1.0/stations" + "</a> <p>"
        f"<a href = " + url + "/api/v1.0/tobs target = '_blank'>" + "/api/v1.0/tobs" + "</a> <p>"
        f"<a href = " + url + "/api/v1.0/YYYY-MM-DD target = '_blank'>" + "/api/v1.0/<startdate>YYYY-MM-DD" + "</a> <p>"
        f"<a href = " + url + "/api/v1.0/YYYY-MM-DD/YYYY-MM-DD target = '_blank'>" + "/api/v1.0/<startdate>/<enddate>YYYY-MM-DD/YYYY-MM-DD" + "</a> <p>"
    )
    return routes
    
    #     f"Station Data: /api/v1.0/stations<br/>"
    #     f"Temperature Data: /api/v1.0/tobs<br/>"
    #     f"<br/>"
    #     f"Min, Avg, and Max Temp Data from Start Date: /api/v1.0/<startdate><br/>"
    #     f"Min, Avg, and Max Temp Data from Start Date to End Date: /api/v1.0/<startdate>/<enddate><br/>"
    #     f"<br/>"
    #     f"  *Input Start Date and End Date as YYYY-MM-DD<br/>"
    #     f"    E.g. /api/v1.0/2016-04-15/2016-04-25"
    # )

@app.route("/api/v1.0/precipitation")
def precip():
    session = Session(engine)
    
    query_date = dt.date(2017, 8, 23) - dt.timedelta(days=365)
    
    precip_data = session.query(func.strftime("%Y-%m-%d", Measurement.date), Measurement.prcp).\
        filter(func.strftime("%Y-%m-%d", Measurement.date) >= query_date).all()

    session.close()

    precipitation_list = []
    
    for date, prcp in precip_data:
        precipitation = {}
        precipitation["date"] = date
        precipitation["precipitation"] = prcp
        precipitation_list.append(precipitation)
        
    return jsonify(precipitation_list)

# Return a JSON list of stations from the dataset.

@app.route("/api/v1.0/stations")
def stations():
    session = Session(engine)
    
    stationresults = session.query(Station.station, Station.name).all()
   
    allstations = list(np.ravel(stationresults))
    
    session.close()

    return jsonify(allstations)

# Query the dates and temperature observations of the most active station for the last year of data.

# Return a JSON list of temperature observations (TOBS) for the previous year.

@app.route("/api/v1.0/tobs")
def tobs():
    session = Session(engine)
    
    query_date = dt.date(2017, 8, 23) - dt.timedelta(days=365)
    active_station = "USC00519281"
    
    station_data = session.query(Measurement.date, Measurement.tobs).\
        filter(Measurement.date >= query_date).\
        filter(Measurement.station == active_station).all()

    most_active = list(np.ravel(station_data))

    session.close()

    return jsonify(most_active)

# Return a JSON list of the minimum temperature, the average temperature, and the max temperature for a given start or start-end range.

@app.route("/api/v1.0/<startdate>")
# route example: /api/v1.0/YYYY-MM-DD
def tempdata_start(startdate = None):

    session = Session(engine)

    tempdata = session.query(func.max(Measurement.tobs), func.min(Measurement.tobs), func.avg(Measurement.tobs)).\
        filter(Measurement.date >= startdate).all()
   
    tempdata_results = list(np.ravel(tempdata))

    tmax = tempdata_results[0]
    tmin = tempdata_results[1]
    tavg = tempdata_results[2].round(1)

    session.close()

    tempdata_list = []
 
    tempdata_return = [{"Start Date": startdate},
        {"The minimum temperature on record from this day forward was": tmin},
        {"The average temperature on record from this day forward was": tavg},
        {"The maximum temperature on record from this day forward was": tmax}]
    tempdata_list.append(tempdata_return)

    return jsonify(tempdata_list)
    
#When given the start & the end date, calculate the 'TMIN', 'TAVG', & 'TMAX' for dates between the start & end date inclusive.

@app.route("/api/v1.0/<startdate>/<enddate>")
# route example: /api/v1.0/YYYY-MM-DD/YYY-MM-DD
def tempdata_daterange(startdate = None, enddate = None):

    session = Session(engine)
    
    tempdata = session.query(func.max(Measurement.tobs), func.min(Measurement.tobs), func.avg(Measurement.tobs)).\
        filter(Measurement.date >= startdate).filter(Measurement.date <= enddate).all()

    tempdata_results = list(np.ravel(tempdata))

    tmax = tempdata_results[0]
    tmin = tempdata_results[1]
    tavg = tempdata_results[2].round(1)

    tempdata_results = []
    
    tempdata_return = [{"Start Date": startdate}, {"End Date": enddate},
        {"The minimum temperature during this period of time was": tmin},
        {"The average temperature during this period of time was": tavg},
        {"The maximum temperature during this period of time was": tmax}]
        
    tempdata_results.append(tempdata_return)

    session.close()

    return jsonify(tempdata_results)

       
    
if __name__ == '__main__':
    app.run(debug=True)


