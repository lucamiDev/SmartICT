import tobii_research as tr
import time
import sys
import math
import numpy as np


# InfluxDB
from datetime import datetime
from influxdb_client import InfluxDBClient, Point, WritePrecision, WriteOptions
from influxdb_client.client.write_api import SYNCHRONOUS

# You can generate an API token from the "API Tokens Tab" in the UI
# token = "v1swk9_enBXFVQvqvhi2jxYOSbtGIAaCLVBQRSaDynKq6lE1guX0R_pyf6uzVhR5DXtgMZrmbYuH8l3NIzV_jw=="
# org = "lucami"
token = 'N5FPKkLaBlm18E-SQ5mSdp9w3YDvf5ggEFD2FQnq8-DzmQTEpnT9B0I1m8X_nlk6C6kw1-_TqkoLf8ubJmyteQ=='
org = "Lucami_Dev"

input = sys.argv[1]
bucket = input[9:]
print("Nekaj")
bucket2 = "grafana"
# bucket = "1211998"
i = 0
all_lines_all1 = []
all_lines_all2 = []
all_lines_all3 = []
all_lines_all4 = []

points = []
points2 = []


def convert_to_line_protocol(lx, ly, rx, ry, lxu, lyu, lzu, rxu, ryu, rzu, lp, rp, lgu, lgv, rgu, rgv, lgotx, lgoty, lgotz, rgotx, rgoty, rgotz, glv, grv, lpv, y, y1):
    global i
    # print(lx, ly, rx, ry)
    # Here we will save sentences
    lines = []
        # print(lx)
    # Here we get the timestamp
    unix_time = time.time_ns()
    # print("inside2")
    # We go through all the data
    point2 = Point('tobii') \
                .field('id', float(i)) \
                .tag('unix_time', float(unix_time)) \
                .tag('lx_eye', float(lx)) \
                .tag('ly_eye', float(ly)) \
                .tag('rx_eye', float(rx)) \
                .tag('ry_eye', float(ry)) \
                .tag('lxu', float(lxu)) \
                .tag('lyu', float(lyu)) \
                .tag('lzu', float(lzu)) \
                .tag('rxu', float(rxu)) \
                .tag('ryu', float(ryu)) \
                .tag('rzu', float(rzu)) \
                .tag('lp', float(lp)) \
                .tag('rp', float(rp)) \
                .tag('lgu', float(lgu)) \
                .tag('lgv', float(lgv)) \
                .tag('rgu', float(rgu)) \
                .tag('rgv', float(rgv)) \
                .tag('lgotx', float(lgotx)) \
                .tag('lgoty', float(lgoty)) \
                .tag('lgotz', float(lgotz)) \
                .tag('rgotx', float(rgotx)) \
                .tag('rgoty', float(rgoty)) \
                .tag('rgotz', float(rgotz)) \
                .tag('glv', float(glv)) \
                .tag('grv', float(grv)) \
                .tag('lpv', float(lpv)) \
                .time(unix_time)



    # This is the shape of the lines we are sending
    # IMPORTANT: We need a unique id if we want to send the data, because time is not precise enough
    # and repetes itself, time alone is not suffucient: That is why the id has been added
    point = Point('tobii') \
                .tag('type', 'tobii2') \
                .field('lx', float(lx)) \
                .field('ly', float(ly)) \
                .field('rx', float(rx)) \
                .field('ry', float(ry)) \
                .time(unix_time)

    # print(lines)
    # Here we return all of the lines
    # print("insid3")
    return point, point2


# Define a callback function for gaze data
def gaze_data_callback(gaze_data):
    print(f"Gaze coordinates: ({gaze_data['left_gaze_point_on_display_area']}, {gaze_data['right_gaze_point_on_display_area']})")

# Get the list of connected eye trackers
found_eyetrackers = tr.find_all_eyetrackers()

my_eyetracker = found_eyetrackers[0]
print("Address: " + my_eyetracker.address)
print("Model: " + my_eyetracker.model)
print("Name (It's OK if this is empty): " + my_eyetracker.device_name)
print("Serial number: " + my_eyetracker.serial_number)




def gaze_data_callback(gaze_data):
    global i
    global points
    global points2


    gaze_left_eye = np.nan_to_num(gaze_data['left_gaze_point_on_display_area'])
    gaze_right_eye = np.nan_to_num(gaze_data['right_gaze_point_on_display_area'])
    gaze_left_eye_in_user_coordinate_system = np.nan_to_num(gaze_data['left_gaze_point_in_user_coordinate_system'])
    gaze_right_eye_in_user_coordinate_system = np.nan_to_num(gaze_data['right_gaze_point_in_user_coordinate_system'])
    left_pupil_diameter = np.nan_to_num(gaze_data['left_pupil_diameter'])
    right_pupil_diameter = np.nan_to_num(gaze_data['right_pupil_diameter'])
    left_gaze_origin_in_user_coordinate_system = np.nan_to_num(gaze_data['left_gaze_origin_in_user_coordinate_system'])
    right_gaze_origin_in_user_coordinate_system = np.nan_to_num(gaze_data['right_gaze_origin_in_user_coordinate_system'])
    left_gaze_origin_in_trackbox_coordinate_system = np.nan_to_num(gaze_data['left_gaze_origin_in_trackbox_coordinate_system'])
    right_gaze_origin_in_trackbox_coordinate_system = np.nan_to_num(gaze_data['right_gaze_origin_in_trackbox_coordinate_system'])
    gaze_left_eye_validity = np.nan_to_num(gaze_data['left_gaze_point_validity'])
    gaze_right_eye_validity = np.nan_to_num(gaze_data['right_gaze_point_validity'])
    left_pupil_validity = np.nan_to_num(gaze_data['left_pupil_validity'])
    right_pupil_validity = np.nan_to_num(gaze_data['right_pupil_validity'])
    left_gaze_origin_validity = np.nan_to_num(gaze_data['left_gaze_origin_validity'])
    right_gaze_origin_validity = np.nan_to_num(gaze_data['right_gaze_origin_validity'])
    # Print gaze points of left and right eye
    # print("inside")
    # print(i)
    i += 1
    # point = convert_to_line_protocol(gaze_left_eye[0], gaze_left_eye[1], gaze_right_eye[0], gaze_right_eye[1])
    point= convert_to_line_protocol(gaze_left_eye[0], gaze_left_eye[1], gaze_right_eye[0], gaze_right_eye[1],gaze_left_eye_in_user_coordinate_system[0], \
                                    gaze_left_eye_in_user_coordinate_system[1], gaze_left_eye_in_user_coordinate_system[2], \
                                    gaze_right_eye_in_user_coordinate_system[0], gaze_right_eye_in_user_coordinate_system[1], gaze_right_eye_in_user_coordinate_system[2],\
                                    left_pupil_diameter, right_pupil_diameter,\
                                    left_gaze_origin_in_user_coordinate_system[0], left_gaze_origin_in_user_coordinate_system[1], left_gaze_origin_in_user_coordinate_system[2],\
                                    right_gaze_origin_in_user_coordinate_system[0], right_gaze_origin_in_user_coordinate_system[1], right_gaze_origin_in_user_coordinate_system[2],\
                                    left_gaze_origin_in_trackbox_coordinate_system[0], left_gaze_origin_in_trackbox_coordinate_system[1], left_gaze_origin_in_trackbox_coordinate_system[2],\
                                    right_gaze_origin_in_trackbox_coordinate_system[0], right_gaze_origin_in_trackbox_coordinate_system[1], right_gaze_origin_in_trackbox_coordinate_system[2],\
                                    gaze_left_eye_validity, gaze_right_eye_validity, left_pupil_validity)
    # print(point)
    # print(point)
    points.append(point[0])
    points2.append(point[1])
    # all_points1, all_points2, all_points3, all_points4 = convert_to_line_protocol(gaze_left_eye[0], gaze_left_eye[1], gaze_right_eye[0], gaze_right_eye[1])
    # # print("Here")
    print(gaze_left_eye[0], gaze_left_eye[1], gaze_right_eye[0], gaze_right_eye[1])
    
    if i % 500 == 0:
        # print(all_lines_all1)
        # print("INFLUX RAN") 
        with InfluxDBClient(url="http://localhost:8086", token=token, org=org) as client:
            # we create a methode that specifies write options, Idk what SYNCH does but it doesn't work without it
            # We also need to specify the number of data we intend to send 
            # print(len(all_lines_all1))
            write_api1 = client.write_api(write_options=SYNCHRONOUS, batch_size=len(points2))

            # We are sending the data
            try:
                write_api1.write(bucket, org, points2)
                bucket2 = "grafana"
                write_api1.write(bucket2, org, points)

                # write_api2.write(bucket, org, all_lines_all2)
                # write_api3.write(bucket, org, all_lines_all3)
                # write_api4.write(bucket, org, all_lines_all4)

            except:
                print("didnt send")
            points = []
            points2 = []


            # Close the program 
            print("done")
            client.close()

    
    

    

my_eyetracker.subscribe_to(tr.EYETRACKER_GAZE_DATA, gaze_data_callback, as_dictionary=True)
while True:
    time.sleep(10)

    
   
        
my_eyetracker.unsubscribe_from(tr.EYETRACKER_GAZE_DATA, gaze_data_callback)  
