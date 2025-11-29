import time
import zmq
import json
import os


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
        user = param.get("user")
        entryId = param.get("entry_id")
        # available moods: none (default), neutral, happy, sad, angry
        newMood = param.get("mood")

        # load entry, get mood, save mood to entry
        entry, path = loadEntryMood(user, entryId)
        oldMood = entry.get("mood")
        entry["mood"] = newMood
        saveEntryMood(path, entry)

        return json.dumps(
            {
                "message": "Mood added to entry",
                "entryId": entryId,
                "oldMood": oldMood,
                "mood": newMood,
            }
        )

    except Exception as e:
        return json.dumps({"error": str(e)})


def moodTagServer():
    print("Awaiting message from client...\n")
    context = zmq.Context()
    socket = context.socket(zmq.REP)
    socket.bind("tcp://*:5557")

    while True:
        try:
            # waits for message from client
            receivedMessage = socket.recv_string()
            print(receivedMessage)

            # pause
            time.sleep(1)

            # get client request, set response
            param = json.loads(receivedMessage)
            response = moodTag(param)

            # send response to client
            socket.send_string(response)
            print(response)


        except Exception as e:
            errorMessage = f"Error processing request: {str(e)}"
            socket.send_string(errorMessage)
            print(errorMessage)


if __name__ == "__main__":
    moodTagServer()
