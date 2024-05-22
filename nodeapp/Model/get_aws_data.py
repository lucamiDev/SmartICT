#Import library
import os
import sys
import send_csv_data as scsv
import sys
import time
import schedule


# This syncs files in AWS Bucekt with local "data" files
def get_aws_data(date):

    #Separate varibles for date
    day, month, year = date[0:2], date[3:5], date[6:8]

    #Command, path of the bucket
    url1 = 'aws s3 sync s3://empatica-us-east-1-prod-data/v2/111/1/1/participant_data/20'

    #Date you want to access
    url2 = year + '-' + month + '-' + day + '/0-3YK3J151YD/'

    doc_type = ['_csv', '_avro']
    
    #Folder name
    url_folder_name = year + '_' +  month + '_' + day 

    #Csv folder url
    avra_url4 = ' ./data/'+ url_folder_name 

    # avra_url = url1 + url2 + avra_url3 + avra_url4 
    avra_url = url1 + url2 + avra_url4 

    # print(avra_url)

    stream_avra = os.popen(avra_url)
    output_avra = stream_avra.read()
    # print(output_avra)


def start_data(bucket,bucket2, input):
    while True:  
        time.sleep(10)
        # Get data from aws bucket
        get_aws_data(input)
        scsv.read_aws_data(bucket, bucket2, input)
        # savro.readAvro(bucket, input)
        print("Done")
        sys.stdout.flush()

input = sys.argv[1]
date = input[0:8]
bucket = input[9:]
# date="19.04.23"
# bucket = "221122"
bucket2 = "grafana"

print(date, bucket)

start_data(bucket,bucket2, date)