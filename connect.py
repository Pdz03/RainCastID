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

# doc = {
#     'username': 'admin',
#     'fullname': 'Admin RainCast ID',
#     'email': 'raincast.id@gmail.com',
#     'password': '1be33adb4caf64e5576b8db2776a4f5e28ff8f48e0022a9530f9766b63eae0a4',
#     'level': 1,
# }

# db.users.insert_one(doc)