from pymongo import MongoClient

MONGODB_CONNECTION_STRING = "<URL MONGODB STRING>"
client = MongoClient(MONGODB_CONNECTION_STRING)

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = '<db1>'
dbuji = '<db2>'

