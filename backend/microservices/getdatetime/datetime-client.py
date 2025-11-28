import zmq

# Need to format request/response as json
import json

def dateTimeClient():
    context = zmq.Context()

    #  Socket talks to server
    socket = context.socket(zmq.REQ)
    socket.connect("tcp://localhost:5556")

    # Client request parameters using dictionary
    client_data = {
        # set user's timezone, e.g. Mountain Time
        "timeZone": "mst",
        # Boolean, set date as text
        "textDate": False,
        # Boolean, set time as 12 or 24 hour format
        "militaryTime": False }

    # Send client request as json format
    socket.send_string(json.dumps(client_data))

    #  Receives reply
    timestamp = socket.recv_string()
    print(timestamp)

if __name__ == "__main__":
    dateTimeClient()