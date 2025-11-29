import zmq
import os
import json


def searchEntryClient():
    context = zmq.Context()

    # socket talks to server
    socket = context.socket(zmq.REQ)
    socket.connect("tcp://localhost:5524")

    # request strings using environment variables
    keyword = os.environ["searchKeyword"]
    user = os.environ["searchUser"]
    filePath = f"data/{user}"
    mode = "json"

    # dictionary or keyword, filepath and mode (terminal or json)
    searchClient = {"mode": mode, "keyword": keyword, "filePath": filePath}

    # send client request as json format
    socket.send_string(json.dumps(searchClient))

    # receive and print reply
    receivedMessage = socket.recv_string()
    print(receivedMessage)


if __name__ == "__main__":
    searchEntryClient()
