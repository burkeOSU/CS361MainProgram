import zmq
import json
import os

def searchEntryClient():
    context = zmq.Context()

    #  Socket talks to server
    socket = context.socket(zmq.REQ)
    socket.connect("tcp://localhost:5524")

    # Parameters: keyword and file path
    keyword = os.environ["searchKeyword"]
    user = os.environ["searchUser"]
    filePath = f"data/{user}"
    mode = "json"

    # Dictionary for keyword and filePath
    searchClient = {"mode": mode, "keyword": keyword, "filePath": filePath}

    # send dictionary in json format
    socket.send_string(json.dumps(searchClient))

    #  Receives reply
    receivedMessage = socket.recv_string()
    print(receivedMessage)

if __name__ == "__main__":
    searchEntryClient()
