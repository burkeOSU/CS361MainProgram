import time
import zmq
import os
import json

# folder containing files to be searched
searchFolder = "searchFolder"


def folderSearchTerm(keyword, searchFolder):
    # list to store names of files containing keyword
    foundFiles = []

    # navigate into folder
    # search file contents for keyword
    for file in os.listdir(searchFolder):
        filePath = os.path.join(searchFolder, file)
        with open(filePath) as f:
            if keyword in f.read():
                # if keyword is found, append list
                foundFiles.append(file)

    return foundFiles


def folderSearchJson(keyword, searchFolder):
    # list to store names of files containing keyword
    foundFiles = []

    # navigate into folder
    # search file contents for keyword
    for file in os.listdir(searchFolder):
        filePath = os.path.join(searchFolder, file)
        with open(filePath) as f:
            entry = json.load(f)
            # convert all words to lowercase
            text = entry.get("text", "").lower()
            if keyword.lower() in text:
                # if keyword is found, append list
                foundFiles.append(file)

    return foundFiles


def main():

    print("Awaiting message from client…\n")
    context = zmq.Context()
    socket = context.socket(zmq.REP)
    socket.bind("tcp://*:5524")

    while True:
        # waits for message from client
        receivedClient = socket.recv_string()
        print(receivedClient)

        client = json.loads(receivedClient)

        # receive parameters
        mode = client.get("mode")
        keyword = client.get("keyword")
        folderPath = client.get("filePath")

        # build filepath to search folder relative to server file
        searchFolder = os.path.join("..", "..", folderPath)

        if mode == "terminal":
            searchResults = folderSearchTerm(keyword, searchFolder)
        elif mode == "json":
            searchResults = folderSearchJson(keyword, searchFolder)
        else:
            print(f"Error: Mode parameter not json or terminal.")

        # pause
        time.sleep(1)

        sentMessage = f"{searchResults}"

        # send response to client
        socket.send_string(sentMessage)
        print(f"Sent {sentMessage} message back to client.")


if __name__ == "__main__":
    main()
