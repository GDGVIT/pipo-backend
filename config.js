const admin = require('firebase-admin')

const serviceAccount = require('./firebase.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://pipo-api-oauth-default-rtdb.europe-west1.firebasedatabase.app'
})

module.exports = admin
