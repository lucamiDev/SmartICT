# FUNCTION OF THIS PROGRAM IS TO GET LOCALLY SAVED CSV AND GET RELEVANT DATA FROM THE TABLE
# THEN THE PROGRAM SENDS THAT DAT TO INFLUXDB
import csv
from influxdb_client.client.write_api import SYNCHRONOUS
import influxdb_client
import time
import datetime



def read_aws_data(bucket, bucket2, date):
    print("Inside the csv loop")
    d = datetime.datetime.now()
    d = d.replace(second=0, microsecond=0)
    unix_time = int(d.timestamp())*1000
    # print(unix_time)
    # You can generate an API token from the "API Tokens Tab" in the UI
    token = "8uiKEW49rR9H_f0NdQGWzHIKL5IH1LhmttW-t31BguUERwxBICAGHobGZAxeQWseyFws5Ag3U7Gr1Oputs0fzw=="
    org = "lucami"
    url="http://localhost:8086"

    client = influxdb_client.InfluxDBClient(
        url=url,
        token=token,
        org=org
    )

    write_api = client.write_api(write_options=SYNCHRONOUS)

    # Get variables
    day, month, year = date[0:2], date[3:5], date[6:8]

    #Create a path
    path = year + '_' + month + '_' + day
    path2 = year + '-' + month + '-' + day

    #All types of files
    mesurement_types = ['eda', 'sleep-detection', 'temperature', 'wearing-detection','pulse-rate', 'respiratory-rate', 'movement-intensity']
    

    #Go through all files
    for i in mesurement_types:

        # Change variables depending on the document structure
        if i in ['eda', 'sleep-detection','temperature', 'wearing-detection','pulse-rate', 'respiratory-rate']:
            check, result = 4, 3
        else: 
            check, result1, result2, result3 = 6, 5, 4, 3
  
        url = './data/' + path + '/digital_biomarkers/aggregated_per_minute/1-1-0_20' + path2 + '_' + i + '.csv'

        try: 
            #Read all the lines in the document
            with open(url, 'r') as file:
                csvreader = csv.reader(file)
                for row in csvreader:
                    print("ok")
                    if (row[check] !=  'device_not_recording') and (row[check] != 'device_not_worn_correctly') and (row[check] != 'worn_during_motion') and (row[check] != 'worn_with_low_signal_quality'):
                        if i == 'movement-intensity':
                            if len(row[result]) < 5:
                                data_point1 = float(row[result1])
                                data_point2 = float(row[result2])
                                data_point3 = float(row[result3])

                                point = influxdb_client.Point("csv").field(i, data_point1, data_point2, data_point3)

                                write_api.write(bucket, org, point)
                        
                                client.close()
                        else:
                            if len(row[result]) < 5:
                                data_point = float(row[result])
                            
                                point = influxdb_client.Point("csv").field(i, data_point)

                                write_api.write(bucket, org, point)
                                write_api.write(bucket2, org, point)

                        
                                client.close()
                    
                    
        except:
            # print("File not available", i)
            pass
    
# bucket = "222222"
# bucket2 = "222222"

# date = input("Enter the date you want to view:")
# read_aws_data(bucket, bucket2, date)