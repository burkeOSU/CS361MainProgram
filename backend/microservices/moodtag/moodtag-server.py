import time
import zmq
# format request/response as json
import json
# file
import os

# open entry (match parameters with entry file)
def loadEntryMood(user, entryId):
    path = os.path.join("data", user, f"{entryId}.json")

    with open(path, "r") as f:
        return json.load(f), path

# save entry
def saveEntryMood(path, data):
    with open(path, "w") as f:
        json.dump(data, f)

def moodTag(param):
    try:
        # get user
        user = param.get("user")
        # get entry_id
        entryId = param.get("entry_id")
        # get mood: none, neutral, happy, sad, angry
        newMood = param.get("mood")

        # load entry, get mood
        entry, path = loadEntryMood(user, entryId)
        oldMood = entry.get("mood")

        entry["mood"] = newMood
        saveEntryMood(path, entry)

        return json.dumps({
        "message": "Mood added to entry",
        "entryId": entryId,
        "oldMood": oldMood,
        "mood": newMood
    })
    
    except Exception as e:
        return json.dumps({"error": str(e)})


def moodTagServer():
    print("Awaiting message from client...\n")
    context = zmq.Context()
    socket = context.socket(zmq.REP)
    socket.bind("tcp://*:5557")

    while True:
        try:
            #  Waits for message from client
            receivedMessage = socket.recv_string()
            print(f"{receivedMessage}")

            #  Pause
            time.sleep(1)

            #  get client request, set response
            param = json.loads(receivedMessage)
            response = moodTag(param)

            # send response to client
            socket.send_string(response)
            print(f"{response}")

        # Return error message if exception occurs, send error to client 
        except Exception as e:
            errorMessage = f"Error processing request: {str(e)}"
            socket.send_string(errorMessage)
            print(errorMessage)

if __name__ == "__main__":
    moodTagServer()