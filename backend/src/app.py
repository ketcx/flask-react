# CRUD Server on Flask

from flask import Flask, request, jsonify
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS

app = Flask(__name__)

app.config['MONGO_URI'] = 'mongodb://localhost/flaskreactdb'
mongodb = PyMongo(app)

CORS(app)

db = mongodb.db.users

@app.route('/users', methods=['POST'])
def createUser():

    id = db.insert({
        'name': request.json['name'],
        'email': request.json['email'],
        'password': request.json['password']
    })

    return jsonify(str(ObjectId(id)))

@app.route('/users', methods=['GET'])
def getUsers():
    users = []
    for doc in db.find():
        users.append({
            '_id': str(ObjectId(doc['_id'])),
            'name': doc['name'],
            'email': doc['email'],
            'password': doc['password']
        })
    return jsonify(users)

@app.route('/users/<id>', methods=['GET'])
def getUser(id):
    user =  db.find_one({'_id': ObjectId(id)})
    userjson = {
        '_id': str(ObjectId(user['_id'])),
        'name': user['name'],
        'email': user['email'],
        'password': user['password']
    }
    return jsonify(userjson)

@app.route('/users/<id>', methods=['DELETE'])
def deleteUser(id):
    db.delete_one({'_id': ObjectId(id)})
    msg = {
        'msg': "Hemos borrado el usuario {}".format(id)
    }
    return jsonify(msg)

@app.route('/users/<id>', methods=['PUT'])
def updateUser(id):
    db.update_one({'_id': ObjectId(id)}, {'$set' : {
        'name': request.json['name'],
        'email': request.json['email'],
        'password': request.json['password']
    }})

    msg = {
        'msg': "Update User with ID: {}".format(id)
    }

    return jsonify(msg)

if __name__ == '__main__':
    app.run(debug=True)
