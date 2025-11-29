import time
import zmq
import os
import json
import re
from collections import Counter

# dictionary of stopwords to filter out (e.g. the, a, it, is)
stopwords = {
    "i",
    "me",
    "my",
    "myself",
    "we",
    "our",
    "ours",
    "ourselves",
    "you",
    "your",
    "yours",
    "yourself",
    "yourselves",
    "he",
    "him",
    "his",
    "himself",
    "she",
    "her",
    "hers",
    "herself",
    "it",
    "its",
    "itself",
    "they",
    "them",
    "their",
    "theirs",
    "themselves",
    "what",
    "which",
    "who",
    "whom",
    "this",
    "that",
    "these",
    "those",
    "am",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "having",
    "do",
    "does",
    "did",
    "doing",
    "a",
    "an",
    "the",
    "and",
    "but",
    "if",
    "or",
    "because",
    "as",
    "until",
    "while",
    "of",
    "at",
    "by",
    "for",
    "with",
    "about",
    "against",
    "between",
    "into",
    "through",
    "during",
    "before",
    "after",
    "above",
    "below",
    "to",
    "from",
    "up",
    "down",
    "in",
    "out",
    "on",
    "off",
    "over",
    "under",
    "again",
    "further",
    "then",
    "once",
    "here",
    "there",
    "when",
    "where",
    "why",
    "how",
    "all",
    "any",
    "both",
    "each",
    "few",
    "more",
    "most",
    "other",
    "some",
    "such",
    "no",
    "nor",
    "not",
    "only",
    "own",
    "same",
    "so",
    "than",
    "too",
    "very",
    "s",
    "t",
    "can",
    "will",
    "just",
    "don",
    "should",
    "now",
}


def wordCounter(folderPath):
    # counter object to store word counts
    wordCount = Counter()

    for file in os.listdir(folderPath):
        filePath = os.path.join(folderPath, file)

        with open(filePath, "r") as f:
            # read file, convert all words to lower case
            entry = json.load(f)
            text = entry.get("text", "").lower()

            # r'[a-zA-Z]+' = Match upper and lower case, one or more characters in a row
            # NO numbers or punctuation!
            words = re.findall(r"[a-zA-Z]+", text)

            # filter out stopwords
            filteredWords = [i for i in words if i not in stopwords]

            wordCount.update(filteredWords)

    # top 10 most frequent words
    return wordCount.most_common(10)


def main():

    print("Awaiting message from client…\n")
    context = zmq.Context()
    socket = context.socket(zmq.REP)
    socket.bind("tcp://*:5560")

    while True:
        # waits for message from client
        receivedClient = socket.recv_string()
        print(receivedClient)

        client = json.loads(receivedClient)

        # receive parameters
        folderPath = client.get("filePath")

        # build filepath to search folder relative to server file
        rankFolder = os.path.join("..", "..", folderPath)
        wordRank = wordCounter(rankFolder)

        # pause
        time.sleep(1)

        sentMessage = json.dumps(wordRank)

        # send response to client
        socket.send_string(sentMessage)
        print(sentMessage)


if __name__ == "__main__":
    main()
