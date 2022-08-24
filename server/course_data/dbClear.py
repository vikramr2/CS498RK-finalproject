import sys
import getopt
import http.client
import urllib
import json

def usage():
    print('dbClear.py -c <collection>')


def getUsers(conn):
    conn.request("GET","""/api/users""")
    response = conn.getresponse()
    data = response.read()
    d = json.loads(data)
    uids = [str(d['data'][x]['uid']) for x in range(len(d['data']))]
    
    return uids

def deleteUsers(conn):
    uids = getUsers(conn)
    while len(uids):
        for uid in uids:
            conn.request("DELETE","/api/users/"+uid)
            response = conn.getresponse()
            data = response.read()     
        uids = getUsers(conn)


def getResults(conn):
    conn.request("GET","""/api/results?filter={"_id":1}""")
    response = conn.getresponse()
    data = response.read()
    d = json.loads(data)
    courses = [str(d['data'][x]['department'] + d['data'][x]['courseNumber']) for x in range(len(d['data']))]

    return courses

def deleteResults(conn):
    courses = getResults(conn)

    while len(courses):
        for course in courses:
            conn.request("DELETE","/api/results/"+course)
            response = conn.getresponse()
            data = response.read() 
        courses = getResults(conn)


def getSchedules(conn):
    conn.request("GET","""/api/schedules?filter={"_id":1}""")
    response = conn.getresponse()
    data = response.read()
    d = json.loads(data)
    courses = [str(d['data'][x]['_id']) for x in range(len(d['data']))]

    return courses

def deleteSchedules(conn):
    courses = getSchedules(conn)
    
    # change to delete
    while len(courses):
        for course in courses:
            conn.request("DELETE","/api/schedules/"+course)
            response = conn.getresponse()
            data = response.read()
        courses = getSchedules(conn)


def main(argv):
    baseurl = "localhost"
    port = 4000
    collection = "users, results, and schedules"

    try:
        opts, args = getopt.getopt(argv,"c:",["collection="])
    except getopt.GetoptError:
        usage()
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
             usage()
             sys.exit()
        elif opt in ("-c", "--collection"):
             collection = str(arg)

    conn = http.client.HTTPConnection(baseurl, port)
    
    if collection == "users, results, and schedules":
        deleteUsers(conn)
        deleteResults(conn)
        deleteSchedules(conn)
    elif collection == "users":
        deleteUsers(conn)
    elif collection == "results":
        deleteResults(conn)
    elif collection == "schedules":
        deleteSchedules(conn)
    
    conn.close()
    print("All " + collection + " removed at "+baseurl+":"+str(port))

if __name__ == "__main__":
     main(sys.argv[1:])