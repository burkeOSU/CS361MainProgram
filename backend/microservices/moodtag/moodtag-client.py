import zmq
import os
import json


def moodTagClient():
    context = zmq.Context()

    # socket talks to server
    socket = context.socket(zmq.REQ)
    socket.connect("tcp://localhost:5557")

    # dictionary for request string using environment variables
    clientData = {
        "user": os.environ["moodUser"],
        "entry_id": os.environ["moodEntryId"],
        "mood": os.environ["moodMood"],
    }

    # send client request as json format
    socket.send_string(json.dumps(clientData))

    # receive and print reply
    receivedMessage = socket.recv_string()
    print(receivedMessage)


if __name__ == "__main__":
    moodTagClient()
