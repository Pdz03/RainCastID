const DB_NAME = 'RainCastDB';
const DB_VERSION = 1; // Use a long long for this value (don't use a float)
const DB_STORE_NAME = 'location';
const DB_STORE_NAME2 = 'emailconfirm';

// var db;

// console.log("openDb ...");
// var req = indexedDB.open(DB_NAME, DB_VERSION);
// req.onsuccess = function (evt) {
//   // Equal to: db = req.result;
//   db = this.result;
//   console.log("openDb DONE");
// };
// req.onerror = function (evt) {
//   console.error("openDb:", evt.target.errorCode);
// };

function openDb() {
  return new Promise((resolve, reject) => {
    console.log("openDb ...");
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onsuccess = function(evt) {
      console.log("openDb DONE");
      resolve(evt.target.result); // Resolve the promise with the database object
    };
    req.onerror = function(evt) {
      console.error("openDb:", evt.target.errorCode);
      reject(evt); // Reject the promise with the error
    };
    req.onupgradeneeded = function (evt) {
      console.log("openDb.onupgradeneeded");
      var store = evt.currentTarget.result.createObjectStore(
        DB_STORE_NAME, { keyPath: 'id', autoIncrement: true });
    
      store.createIndex('id', 'id', { unique: true });
      store.createIndex('lat', 'lat', { unique: false });
      store.createIndex('long', 'long', { unique: false });
      store.createIndex('name', 'name', { unique: false });
      store.createIndex('country', 'country', { unique: false });

      var emailconfirm = evt.currentTarget.result.createObjectStore(
        DB_STORE_NAME2, { keyPath: 'email', autoIncrement: true });
    
      emailconfirm.createIndex('email', 'email', { unique: true });
      emailconfirm.createIndex('otp', 'otp', { unique: false });
    };
  });
}

// function getObjectStore(store_name, mode) {
//     var tx = db.transaction(store_name, mode);
//     return tx.objectStore(store_name);
// }

function getObjectStore(store_name, mode) {
  return db.transaction(store_name, mode).objectStore(store_name);
}
