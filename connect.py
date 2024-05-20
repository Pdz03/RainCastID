from pymongo import MongoClient

MONGODB_CONNECTION_STRING = "mongodb+srv://raincastid:rcastdb@rcastcluster.ef90av6.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(MONGODB_CONNECTION_STRING)

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client.raincastdb
dbuji = client.raincastujidb

