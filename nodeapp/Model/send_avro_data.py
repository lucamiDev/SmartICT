
##USEFULL; IT WORKS
from avro.datafile import DataFileReader
from avro.io import DatumReader
from influxdb_client import InfluxDBClient, Point, WritePrecision, WriteOptions
from influxdb_client.client.write_api import SYNCHRONOUS
import time
import os
import sys
import datetime


# Credentials
token = "8uiKEW49rR9H_f0NdQGWzHIKL5IH1LhmttW-t31BguUERwxBICAGHobGZAxeQWseyFws5Ag3U7Gr1Oputs0fzw=="
org = "lucami"

# Creates batch file to submit to InfluxDB
def convert_to_line_protocol(data):

    # Here we will save sentences
    lines = []
    
    # We go through all the data
    for num, point in enumerate(data):

        # Loop that takes only takes every 100-th data input
        if num%100 == 0:
            # Here we get the timestamp
            unix_time = time.time_ns()

            # We change the entries into floats
            point = float(point)

            # This is the shape of the lines we are sending
            # IMPORTANT: We need a unique id if we want to send the data, because time is not precise enough
            # and repetes itself, time alone is not suffucient: That is why the id has been added
            lines.append("avro,id={id} used_percent={value} {timestamp}".format(id=num, value = point, timestamp=unix_time))

    # Here we return all of the lines
    return lines


# Sends batch data to InfluxDB; input: str-topic, array; Output: data sent to InfluxDB
def send_data(bucket, data): 

    # Gets data from the original fucntion and sends it to a function that creates lines for batch sending for InfluxDB
    all_points = convert_to_line_protocol(data)
    
    # Credentials should be saved to the config file in the node.sj file 
    # bucket = "atime"
    # org = "test"
    # token = "vZQcvi2JcrPvrDBzIVoIZSbjUyF-Jt1DcgpKmozlk23MwuWiUSQbp0JSyc5xkJTKDfmTc0lor4xiQbXj8kL6LQ=="
    # url="http://localhost:8086"

    # Number of entries, good to know and test if everything has been sent
    # print(len(all_points))

    # Make and send data
    # we define the client with information about the final destination
    with InfluxDBClient(url="http://localhost:8086", token=token, org=org) as client:
       
        # we create a methode that specifies write options, Idk what SYNCH does but it doesn't work without it
        # We also need to specify the number of data we intend to send 
        # print(all_points)
        write_api = client.write_api(write_options=SYNCHRONOUS, batch_size=len(all_points))
        
        # We are sending the data
        write_api.write(bucket, org, all_points)

        # Close the program 
        client.close()



# Function is made to read the avro file and save values in an array
# TO-DO: We need more acctual time worn to test if we recive all the information that we need. After that it 
# it shouldn't be a problem to isolate the data we need and send it  
def readAvro(bucket, input):

    # This is to open a correct file
    date = input

    folder_path = date[6:8] + "_" + date[3:5] +  "_" + date[0:2]
    folder_path_avro = date[6:8] + "_" + date[3:5] +  "_" + date[0:2] + "_avro"
    # Select folder
    entries = os.listdir('./data/' + folder_path + "/raw_data/v6/")
    
    #Open Avro file
    reader = DataFileReader(open("./data/" + folder_path + "/raw_data/v6/" + entries[-1], "rb"), DatumReader())
    # schema = json.loads(reader.meta.get('avro.schema').decode('utf-8'))


    #Deffine a list for avro day
    data = []

    #Save data as data
    for datum in reader:
        data = datum

    #Close the avro file
    reader.close()

    ############# See raw data 
    # acc = data["rawData"]
    # print(acc)


    ############# View where there is existnat data for eda
    # try:  
    #     all_data = data["rawData"]["eda"]
    #     print(all_data)
    # except:
    #     pass


    ############# Check which field does the file have
    # for key, val in acc.items():
    #     print("- " + key)
    #     if type(val) is dict:
    #         for k in val.keys():
    #             print(" - " + k)
   

    
    ############# Calculate acceloration out of Gs
    acc = data["rawData"]["accelerometer"]
    acc_time = data["rawData"]["accelerometer"]["timestampStart"]
    acc_x = data["rawData"]["accelerometer"]["x"]
    delta_physical = acc["imuParams"]["physicalMax"] - acc["imuParams"]["physicalMin"]
    delta_digital = acc["imuParams"]["digitalMax"] - acc["imuParams"]["digitalMin"]
    x_g = [val*delta_physical/delta_digital for val in acc["x"]]
    y_g = [val*delta_physical/delta_digital for val in acc["y"]]
    z_g = [val*delta_physical/delta_digital for val in acc["z"]]
  

    ############# Create time vector (in your local timezone)
    startSeconds = acc["timestampStart"] / 1000000  # This is UNIX timestamp in seconds
    timeSeconds = list(range(0,len(x_g)))  # Number of enteries in x, so points when it was messured
    timeUNIX = [t/acc["samplingFrequency"] + startSeconds for t in timeSeconds] # For each mesurement in x_g, we devide time by which point it is and add unix time to adjust for the begining
    # print(timeUNIX)
    # datetime_time = [datetime.fromtimestamp(x) for x in timeUNIX]  # This gets time for each value in timeUNIX array

    # This calls a function specified in the top function and its purpose is to send the given array to influxDB
    send_data(bucket, timeUNIX)

    ############# Send data to the InfluxDB
    # for num, i in enumerate(x_g):
    #     send_data(entries[-1], i)
    #     # print(x_g[i])
    #     print("Sent", num)
   

# # readAvro()

# Loop that starts reading local avro files and submitting the data to InfluxDB
def startUp_avro(bucket, input):
    # while True:
        # Get the current time
        # now = datetime.datetime.now()
        # Check if the current minute is divisible by 15
        # if now.minute % 15 == 0:
        print("This code will run every 15 minutes!")
        readAvro(bucket, input)
        sys.stdout.flush()



# Input parameters called from aws_Controller
input = sys.argv[1]
date = input[0:8]
bucket = input[9:]

# Starter function
# startUp_avro(bucket, date)