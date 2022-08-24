import sys
import getopt
import http.client
import urllib
import json
import pandas as pd
import numpy as np
from random import randint
from random import choice

def usage():
    print('dbFillResults.py -f <csvfile> -l <coursesToAdd>')

def main(argv):

    baseurl = "localhost"
    port = 4000
    csvFile = "sp2021.csv"
    limit = -1
    
    try:
        opts, args = getopt.getopt(argv,"f:l:",["file=", "limit="])
    except getopt.GetoptError:
        usage()
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
             usage()
             sys.exit()
        elif opt in ("-f", "--file"):
             csvFile = str(arg)
        elif opt in ("-l", "--limit"):
             limit = int(arg)
    
    conn = http.client.HTTPConnection(baseurl, port)
    headers = {"Content-type": "application/x-www-form-urlencoded","Accept": "text/plain"}

    courseData = pd.read_csv(csvFile)
    rows, cols = courseData.shape

    if (limit == -1):
        limit = rows
    
    for i in range(0, limit):
        department = courseData.iloc[i]['Department']
        courseNumber = courseData.iloc[i]['CourseNumber']
        courseName = courseData.iloc[i]['CourseName']
        creditHours = randint(3,4)
        avgGPA = courseData.iloc[i]['AvgGPA']
        params = urllib.parse.urlencode({'department': department, 'courseNumber': courseNumber, 'courseName' : courseName,'creditHours' : creditHours, 'avgGPA' : avgGPA})
        
        conn.request("POST", "/api/results", params, headers)
        response = conn.getresponse()
        data = response.read()
    
    conn.close()
    print(str(limit)+" course results added at "+baseurl+":"+str(port) + " from " + csvFile)


if __name__ == "__main__":
     main(sys.argv[1:])