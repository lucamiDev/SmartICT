
##USEFULL; IT WORKS
from avro.datafile import DataFileReader
from avro.io import DatumReader
import matplotlib.pyplot as plt
from datetime import datetime
import json
import pprint
import os


from influxdb_client.client.write_api import SYNCHRONOUS
import influxdb_client

def send_data(topic, x):
    # Inititalisation data
    token = "vZQcvi2JcrPvrDBzIVoIZSbjUyF-Jt1DcgpKmozlk23MwuWiUSQbp0JSyc5xkJTKDfmTc0lor4xiQbXj8kL6LQ=="
    org = "test"
    bucket = "csv_sensor5"
    url="http://localhost:8086"
    client = influxdb_client.InfluxDBClient(
            url=url,
            token=token,
            org=org
        ) 


    # Write script
    write_api = client.write_api(write_options=SYNCHRONOUS)

    p = influxdb_client.Point("my_measurement").tag("data", "ANKS2").field(topic, x)
    # p2 = influxdb_client.Point("my_measurement").tag("location", "Prague").field("temperature", temp[1])

    write_api.write(bucket=bucket, org=org, record=p)
    client.close()

def readAvro(input):

    # date = input("Enter the date you want to get (23.01.23):")
    date = input
    folder_path = date[6:8] + "_" + date[3:5] +  "_" + date[0:2]
    folder_path_avro = date[6:8] + "_" + date[3:5] +  "_" + date[0:2] + "_avro"
    # print(folder_path, folder_path_avro)
    # Select folder
    entries = os.listdir('./data/' + folder_path + "/raw_data/v6/")
    
    #Open Avro file
    reader = DataFileReader(open("./data/" + folder_path + "/raw_data/v6/" + entries[-1], "rb"), DatumReader())
    schema = json.loads(reader.meta.get('avro.schema').decode('utf-8'))

    #Deffine a list for avro day
    data = []

    #Save data as data
    for datum in reader:
        data = datum

    #Close the avro file
    reader.close()


    # Print the Avro schema
    # pprint.pprint(schema)
    # print(" ")


    ## Plot accelerometers, 
    acc = data["rawData"]["accelerometer"]
    # print(acc)
    #Print structure
    # print("Accelerometers fields:")
    # for key, val in acc.items():
    #     print("- " + key)
    #     if type(val) is dict:
    #         for k in val.keys():
    #             # print(" - " + k)
    # # print(" ")
    acc_time = data["rawData"]["accelerometer"]["timestampStart"]
    acc_x = data["rawData"]["accelerometer"]["x"]
    # print(len(acc_x))

    # Convert ADC counts in g
    delta_physical = acc["imuParams"]["physicalMax"] - acc["imuParams"]["physicalMin"]
    delta_digital = acc["imuParams"]["digitalMax"] - acc["imuParams"]["digitalMin"]
    x_g = [val*delta_physical/delta_digital for val in acc["x"]]
    y_g = [val*delta_physical/delta_digital for val in acc["y"]]
    z_g = [val*delta_physical/delta_digital for val in acc["z"]]
    # print(x_g)
    x_g2 = x_g[0:1000]

    # print(type(x_g))

    # print(len(x_g))
    for num, i in enumerate(x_g2):
        send_data(entries[-1], i)
        # print(x_g[i])
        # print("Sent", num)
       

# readAvro()
