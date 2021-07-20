from flask import Flask
# from flask import jsonify, 
from flask import render_template
# request, make_response, redirect
from flask_cors import CORS
from sqlalchemy import create_engine, inspect
# import sqlalchemy

# from sqlalchemy.orm import Session
# import sqlite3

import pandas as pd
import json
import requests
import datetime as dt

#################################################
# Database Setup
#################################################

app = Flask(__name__)
CORS(app)

engine = create_engine('sqlite:///Resources/air.sqlite')

# conn = engine.connect()

# inspector=inspect(engine)
# inspector.get_table_names()
# conn.execute('select * from airquality limit 10').fetchall()

#################################################
# Flask Setup
#################################################

app = Flask(__name__)

#################################################
# Flask Routes
#################################################

@app.route("/")
def outside():
	# Save config information
    url = "http://api.openweathermap.org/data/2.5/air_pollution?"
    api_key= "90d059c74bd13bcc4087b66e982c1bf1"

    # Counter to sort through response
    number = 0
    group = 1

    # Create DataFrame
    ## Update PM names to remove spaces
    columns= ["City","Date", "lat", "lon", "AQI", "CO", "NO", "NO2", "O3", "SO2", "PM25", "PM10", "NH3"]
    air_df = pd.DataFrame(columns=columns)

        for index, row in latlon_df.iterrows():
            
            lat = row["lat"]
            lon = row["lon"]
            #print(lat)
            #print(lon)
            query_url = f"{url}lat={lat}&lon={lon}&appid={api_key}"
            air_response = requests.get(query_url).json()
        
            try:
                print(f"Processing Record {number}  of Group {group} | {lat}{lon}.")
                
                print (query_url) 
            
                air_api_values= {
                    "City" : row["Place Name"],
                    "Population": row["Population"],
                    "Date" : air_response["list"][0]["dt"],  
                    "lon" : air_response["coord"]["lon"],
                    "lat" : air_response["coord"]["lat"],
                    "AQI" : air_response["list"][0]["main"]["aqi"],
                    "CO" : air_response["list"][0]["components"]["co"],  
                    "NO" : air_response["list"][0]["components"]["no"],
                    "NO2" : air_response["list"][0]["components"]["no2"],  
                    "O3" : air_response["list"][0]["components"]["o3"],
                    "SO2" : air_response["list"][0]["components"]["so2"],
                    #Update names of PM so they don't have spaces
                    "PM25" : air_response["list"][0]["components"]["pm2_5"],
                    "PM10" : air_response["list"][0]["components"]["pm10"],
                    "NH3" : air_response["list"][0]["components"]["nh3"]
                }
                air_df= air_df.append(air_api_values, ignore_index=True)
                
            except:
                print(f"not working")
                pass
                
            
            # To save money on API calls
            number = number + 1
            if number == 50:
                number= 0
                group = group + 1
            
            return render_template('index.html', title="page")





    if __name__ == '__main__':
        app.run()

# @app.route("/beer")
# def breweries():
# 	return render_template('breweries.html', title="page")

# @app.route("/fourteeners")
# def fourteeners():
# 	return render_template('mountains.html', title="page")

# @app.route("/camping")
# def camping():
# 	return render_template('camping.html', title="page")



# @app.route('/breweries/')
# @app.route('/breweries/<query_string>')
# def fetch(query_string=None): 
# 	# session=Session(engine)
# 	# results=session.query(Brewery.state, Brewery.city, Brewery.name).all()
# 	# session.close()
# 	query_param='where '
# 	params=0
# 	if query_string: 
# 		for each_param in query_string.split('&'): 
# 			key, value=each_param.split('=')
# 			if params>0: 
# 				query_param+='and '
# 			if key.lower()=='state': 
# 				query_param+=f'state="{value.upper()}"'
# 				params=params+1
# 			if key.lower()=='name': 
# 				query_param+=f'name like "%{value.capitalize()}%"'
# 				params=params+1
# 			if key.lower()=='city': 
# 				query_param+=f'city="{value.capitalize()}"'
# 				params=params+1
# 		# results=engine.execute(f'select state, city, name from breweries where state="{query_string.upper()}"')
# 		results=engine.execute(f'select state, city, name from breweries {query_param}')
# 	else: 
# 		results=engine.execute('select state, city, name from breweries')
# 	# return jsonify(list(results))
# 	return jsonify([{'state': result[0], 'city': result[1], 'name': result[2]} for result in results])





# # @app.route("/", methods=["GET", "POST"])
# @app.route("/", methods=["GET", "POST"])
# def home():
# 	return render_template("index.html")

# @app.route("/Charts")
# def charts():
# 	return render_template('Charts.html', title="page")

# @app.route("/clusters")
# def clusters():
# 	return render_template('clusters.html', title="page")


# @app.route("/stocks", methods=["GET", "POST"])
# def stocks():
# return render_template('predict.html', output=table_html)



###########################

# if __name__ == '__main__':
#      app.run(debug=True)


#################################################
# Reference code
#################################################

# @app.route("/")
# def home():

#     url = 'http://127.0.0.1:5000'

#     print("server received a request for 'Home' page")
    
#     routes = (
#         f"<b>API Routes:</b> <p>"
#         f"<a href = " + url + "/api/v1.0/precipitation target = '_blank'>" + "/api/v1.0/precipitation" + "</a> <p>"
#         f"<a href = " + url + "/api/v1.0/stations target = '_blank'>" + "/api/v1.0/stations" + "</a> <p>"
#         f"<a href = " + url + "/api/v1.0/tobs target = '_blank'>" + "/api/v1.0/tobs" + "</a> <p>"
#         f"<a href = " + url + "/api/v1.0/YYYY-MM-DD target = '_blank'>" + "/api/v1.0/<startdate>YYYY-MM-DD" + "</a> <p>"
#         f"<a href = " + url + "/api/v1.0/YYYY-MM-DD/YYYY-MM-DD target = '_blank'>" + "/api/v1.0/<startdate>/<enddate>YYYY-MM-DD/YYYY-MM-DD" + "</a> <p>"
#     )
#     return routes
    
#     #     f"Station Data: /api/v1.0/stations<br/>"
#     #     f"Temperature Data: /api/v1.0/tobs<br/>"
#     #     f"<br/>"
#     #     f"Min, Avg, and Max Temp Data from Start Date: /api/v1.0/<startdate><br/>"
#     #     f"Min, Avg, and Max Temp Data from Start Date to End Date: /api/v1.0/<startdate>/<enddate><br/>"
#     #     f"<br/>"
#     #     f"  *Input Start Date and End Date as YYYY-MM-DD<br/>"
#     #     f"    E.g. /api/v1.0/2016-04-15/2016-04-25"
#     # )

# @app.route("/api/v1.0/precipitation")
# def precip():
#     session = Session(engine)
    
#     query_date = dt.date(2017, 8, 23) - dt.timedelta(days=365)
    
#     precip_data = session.query(func.strftime("%Y-%m-%d", Measurement.date), Measurement.prcp).\
#         filter(func.strftime("%Y-%m-%d", Measurement.date) >= query_date).all()

#     session.close()

#     precipitation_list = []
    
#     for date, prcp in precip_data:
#         precipitation = {}
#         precipitation["date"] = date
#         precipitation["precipitation"] = prcp
#         precipitation_list.append(precipitation)
        
#     return jsonify(precipitation_list)

# # Return a JSON list of stations from the dataset.

# @app.route("/api/v1.0/stations")
# def stations():
#     session = Session(engine)
    
#     stationresults = session.query(Station.station, Station.name).all()
   
#     allstations = list(np.ravel(stationresults))
    
#     session.close()

#     return jsonify(allstations)

# # Query the dates and temperature observations of the most active station for the last year of data.

# # Return a JSON list of temperature observations (TOBS) for the previous year.

# @app.route("/api/v1.0/tobs")
# def tobs():
#     session = Session(engine)
    
#     query_date = dt.date(2017, 8, 23) - dt.timedelta(days=365)
#     active_station = "USC00519281"
    
#     station_data = session.query(Measurement.date, Measurement.tobs).\
#         filter(Measurement.date >= query_date).\
#         filter(Measurement.station == active_station).all()

#     most_active = list(np.ravel(station_data))

#     session.close()

#     return jsonify(most_active)

# # Return a JSON list of the minimum temperature, the average temperature, and the max temperature for a given start or start-end range.

# @app.route("/api/v1.0/<startdate>")
# # route example: /api/v1.0/YYYY-MM-DD
# def tempdata_start(startdate = None):

#     session = Session(engine)

#     tempdata = session.query(func.max(Measurement.tobs), func.min(Measurement.tobs), func.avg(Measurement.tobs)).\
#         filter(Measurement.date >= startdate).all()
   
#     tempdata_results = list(np.ravel(tempdata))

#     tmax = tempdata_results[0]
#     tmin = tempdata_results[1]
#     tavg = tempdata_results[2].round(1)

#     session.close()

#     tempdata_list = []
 
#     tempdata_return = [{"Start Date": startdate},
#         {"The minimum temperature on record from this day forward was": tmin},
#         {"The average temperature on record from this day forward was": tavg},
#         {"The maximum temperature on record from this day forward was": tmax}]
#     tempdata_list.append(tempdata_return)

#     return jsonify(tempdata_list)
    
# #When given the start & the end date, calculate the 'TMIN', 'TAVG', & 'TMAX' for dates between the start & end date inclusive.

# @app.route("/api/v1.0/<startdate>/<enddate>")
# # route example: /api/v1.0/YYYY-MM-DD/YYY-MM-DD
# def tempdata_daterange(startdate = None, enddate = None):

#     session = Session(engine)
    
#     tempdata = session.query(func.max(Measurement.tobs), func.min(Measurement.tobs), func.avg(Measurement.tobs)).\
#         filter(Measurement.date >= startdate).filter(Measurement.date <= enddate).all()

#     tempdata_results = list(np.ravel(tempdata))

#     tmax = tempdata_results[0]
#     tmin = tempdata_results[1]
#     tavg = tempdata_results[2].round(1)

#     tempdata_results = []
    
#     tempdata_return = [{"Start Date": startdate}, {"End Date": enddate},
#         {"The minimum temperature during this period of time was": tmin},
#         {"The average temperature during this period of time was": tavg},
#         {"The maximum temperature during this period of time was": tmax}]
        
#     tempdata_results.append(tempdata_return)

#     session.close()

#     return jsonify(tempdata_results)

       
    
# if __name__ == '__main__':
#     app.run(debug=True)


