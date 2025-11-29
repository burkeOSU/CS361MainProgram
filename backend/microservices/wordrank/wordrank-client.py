import zmq
import json
import os

def wordRankClient():
    context = zmq.Context()

    #  Socket talks to server
    socket = context.socket(zmq.REQ)
    socket.connect("tcp://localhost:5560")

    filePath = "rankFolder"

    # Parameters: keyword and file path
    user = os.environ["rankUser"]
    filePath = f"data/{user}"

    # Dictionary for filePath
    searchClient = {"filePath": filePath}

    # send dictionary in json format
    socket.send_string(json.dumps(searchClient))


    #  Receives reply
    wordRanking = socket.recv_string()
    print(wordRanking)

if __name__ == "__main__":
    wordRankClient()
