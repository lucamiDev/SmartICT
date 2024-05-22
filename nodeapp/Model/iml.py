#%% inputs

import sys
import numpy as np
import pandas as pd
import pickle
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
import matplotlib
import time
import influxdb_client
from influxdb_client.client.write_api import SYNCHRONOUS
import requests



# pup_d_lst = [14.757138488611963, 14.214420146251166,14.247230413726944,13.923496691316931,16.17252976828733,10.483655648546472,10.325029033350486, 11.521990744445986, 11.796972962391711, 8.746238430858849]
# eda_c1_lst =  [14.377559783761523,13.410245672313692, 14.76991268328367,14.331898672380982,13.830378264313387,11.848259129168913,11.325371135346193,9.590223802042878,10.989580144213111,8.718144629135075]


def get_matAnx_from_psysigs(pup_d_df, eda_c1_df, clf):

    
    # Hard coded parameters
    pup_d_p = 2
    eda_d_p = 3
    
    # extract features: mean of the past seconds 
    d_f1 = pup_d_df.loc[pup_d_df.index[-1]-pup_d_p:, 'PD'].mean()
    eda_f1 = eda_c1_df.loc[eda_c1_df.index[-1]-eda_d_p:, 'EDA_c1'].mean()
     

    # Do classification
    features = [d_f1, eda_f1]
    mat_anx = clf.predict([features])

    return mat_anx




#%% Test code =======================================================================================

# function that deffines MatAnks value
def iml(array):
    # print("TOLE JE POMEMBNO")
    # Turns string input in a list of strings
    array = array.split(',')


    # truns list of strings into a list of int
    array2 = array
    # print(array2)
    for i in range(0, len(array)):
        array2[i] = float(array[i])
    

    # print(array2)
    pup_d_lst = array[0:10]
    eda_c1_lst = array[10:20]
    # print(len(array))
    # print(array2)

    # print(type(array))
    # Change this to get length of input
    time_np = np.arange(0, 10, 1)



    pup_d_df = pd.DataFrame(data=pup_d_lst, index=time_np, columns=['PD'])
    eda_c1_df = pd.DataFrame(data=eda_c1_lst, index=time_np, columns=['EDA_c1'])


    #%% Classify it
    # Weights that influence the the IML
    # Create classifier
    X = np.array([[5, 15], [6, 14], [10, 10], [11, 9], [14, 6], [15, 5]])
    y = np.array([1, 1, 2, 2, 3, 3])
    clf = make_pipeline(StandardScaler(), SVC(gamma='auto'))
    clf.fit(X, y)
    pickle.dump(clf, open('matAnx_clf.sav', 'wb'))


    # Load classifier
    loaded_clf = pickle.load(open('matAnx_clf.sav', 'rb'))

    # Set time and classify
    curr_t = 6
    cur_mat_anx = get_matAnx_from_psysigs(pup_d_df[:curr_t], eda_c1_df[:curr_t], loaded_clf)
    print (cur_mat_anx[0])




if sys.argv[1] == 'array':  iml(sys.argv[2])
else: print("No function found!")
  
sys.stdout.flush()