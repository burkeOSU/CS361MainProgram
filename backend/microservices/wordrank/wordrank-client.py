import zmq
import json
import os


def wordRankClient():
    context = zmq.Context()

    # socket talks to server
    socket = context.socket(zmq.REQ)
    socket.connect("tcp://localhost:5560")

    filePath = "rankFolder"

    # request strings using environment variable
    user = os.environ["rankUser"]
    filePath = f"data/{user}"

    # dictionary for filePath
    searchClient = {"filePath": filePath}

    # send dictionary in json format
    socket.send_string(json.dumps(searchClient))

    # receive and print reply
    wordRanking = socket.recv_string()
    print(wordRanking)


if __name__ == "__main__":
    wordRankClient()
