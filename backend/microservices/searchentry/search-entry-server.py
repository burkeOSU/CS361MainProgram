import time
import zmq
import os
import json

# folder containing files to be searched
searchFolder = "searchFolder"


def folderSearchTerm(keyword, searchFolder):
    # List to store names of files containing keyword
    foundFiles = []

    # navigate into folder
    # search file contents for keyword (use a for loop)
    for file in os.listdir(searchFolder):
        filePath = os.path.join(searchFolder, file)
        with open(filePath) as f:
            if keyword in f.read():
                # if keyword is found, append list
                foundFiles.append(file)

    return foundFiles

def folderSearchJson(keyword, searchFolder):
    # List to store names of files containing keyword
    foundFiles = []

    # navigate into folder
    # search file contents for keyword (use a for loop)
    for file in os.listdir(searchFolder):
        filePath = os.path.join(searchFolder, file)
        with open(filePath) as f:
            entry = json.load(f)
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
        #  Waits for message from client
        receivedClient = socket.recv_string()
        print(f"{receivedClient}")

        client = json.loads(receivedClient)

        # receive parameters
        mode = client.get("mode")
        keyword = client.get("keyword")
        folderPath = client.get("filePath")

        # microservice -> backend, join with data/user
        searchFolder = os.path.join("..", "..", folderPath)

        if (mode == "terminal"):
            searchResults = folderSearchTerm(keyword, searchFolder)
        elif (mode == "json"):
            searchResults = folderSearchJson(keyword, searchFolder)
        else:
            print(f"Error: Mode parameter not json or terminal.")

        #  Pause
        time.sleep(1)

        sentMessage = f"{searchResults}"

        #  Sends reply back to client
        socket.send_string(sentMessage)
        print(f"Sent {sentMessage} message back to client.")


if __name__ == "__main__":
    main()
