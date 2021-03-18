const db = require('../config/connection')
const collections = require('../config/collections')
var ObjectId = require('mongodb').ObjectID
const bcrypt = require('bcrypt')

module.exports = {
    signup: (userData) => {
        console.log("****vaadaaa",userData);
        var response = {}
        return new Promise(async (resolve, reject) => {
            console.log(userData);

            let emailExists = db.get().collection(collections.USER_COLLECTION).findOne({
                email: userData.email
            })

            let usernameExists = db.get().collection(collections.USER_COLLECTION).findOne({
                username: userData.username
            })

            if (emailExists) {

                response.emailExists = true
                resolve(response)

            } else if (usernameExists) {

                response.usernameExists = true
                resolve(response)

            } else if (emailExists && usernameExists) {

                response.emailAndUsernameExists = true
                resolve(response)

            } else {
                userData.password = await bcrypt.hash(userData.password, 10)
                db.get().collection(collections.USER_COLLECTION).insertOne(userData).then((data) => {
                    response.user = data.ops[0]
                    resolve(response)
                })
            }
        })
    },
    login: (loginData) => {
        console.log("in function", loginData);
        let response = {}
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collections.USER_COLLECTION).findOne({
                username: loginData.username
            })
            console.log('aalund', user);

            if (user) {
                bcrypt.compare(loginData.password, user.password).then((status) => {

                    if (status) {
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        response.wrong = true
                        resolve(response)
                    }

                })
            } else {
                response.status = false
                resolve(response)
            }
        })
    }
}