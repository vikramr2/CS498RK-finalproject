import sys
import getopt
import http.client
import urllib
import json
import pandas as pd
import numpy as np
from random import randint
from random import choice
from random import choices

def usage():
    print('dbFillSchedule.py -l <coursesToAdd>')

def main(argv):

    baseurl = "localhost"
    port = 4000
    limit = -1
    
    try:
        opts, args = getopt.getopt(argv,"l:",["limit="])
    except getopt.GetoptError:
        usage()
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
             usage()
             sys.exit()
        elif opt in ("-l", "--limit"):
             limit = int(arg)
    
    conn = http.client.HTTPConnection(baseurl, port)
    headers = {"Content-type": "application/x-www-form-urlencoded","Accept": "text/plain"}

    conn.request("GET", "/api/results?count=true")
    response = conn.getresponse()
    data = response.read()
    numCourses = json.loads(data)['data']

    if (limit == -1 or limit >= numCourses):
        limit = numCourses
    
    conn.request("GET", "/api/results?limit="+str(limit))
    response = conn.getresponse()
    data = response.read()
    courseResults  = json.loads(data)['data']

    twoDayCombos = [[2, 4], [1, 3], [3, 5]]
    twoDayComboWeights = [0.5, 0.25, 0.25]
    minCombos = [[0, 50], [30, 20], [0, 15], [30, 45]]
    hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
    hourWeights = [0.025, 0.1, 0.125, 0.175, 0.075, 0.175, 0.125, 0.1, 0.075, 0.025]

    for i in range(0, limit):
        title = courseResults[i]['department'] + " " + courseResults[i]['courseNumber']
        colorId = i
        
        startHour = choices(hours, hourWeights)[0]
        minCombo = choice(minCombos)
        startMin = minCombo[0]
        endMin = minCombo[1]
        if (endMin - startMin == 50):
            endHour = startHour
            days = [1, 3, 5]
        elif (endMin - startMin == 15):
            endHour = startHour + 1
            days = choices(twoDayCombos, twoDayComboWeights)[0]
        else:
            endHour = startHour + 1
            days = [1, 3, 5]

        #print(startHour, startMin, endHour, endMin, days)

        for day in days:
            params = urllib.parse.urlencode({'title': title, 'day' : day, 'startHour': startHour, 'startMin' : startMin,'endHour' : endHour, 'endMin' : endMin, 'colorId' : colorId})
            conn.request("POST", "/api/schedules", params, headers)
            response = conn.getresponse()
            data = response.read()
    
    conn.close()
    print(str(limit)+" course schedules added at "+baseurl+":"+str(port))


if __name__ == "__main__":
     main(sys.argv[1:])