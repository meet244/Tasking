import pymongo
import json
from bson import ObjectId
from flask import render_template, jsonify, Flask, request
from firebase_admin import credentials,initialize_app,auth
from dotenv import load_dotenv
import os


load_dotenv()
MONGO_PASS = os.environ.get('MONGO_PASS')
FIRE_PASS = os.environ.get('FIRE_PASS')

cred = credentials.Certificate(
        json.loads(FIRE_PASS)
    )
initialize_app(cred)

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

db = pymongo.MongoClient(f"mongodb+srv://meet2005:{MONGO_PASS}@cluster0.fahor2g.mongodb.net/?retryWrites=true&w=majority") 
mydb = db["Users"]

app = Flask(__name__, static_url_path='/static')
app.json_encoder = JSONEncoder

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/login')
def logins():
    return render_template("login.html")

@app.route('/policy')
def policy():
    return render_template("policy.html")

@app.route('/terms')
def toc():
    return render_template("toc.html")

@app.route('/home')
def home():
    return render_template("main.html")


@app.route('/verify',methods=['POST'])
def verify():
    token = request.form.get('token')

    user = auth.get_user(token)

    usn = user.email.split('@')[0]

    if(usn not in mydb.list_collection_names()):
        col = mydb[usn]
        col.insert_one({'_id':'0'})
        col.insert_one({'data':[],'name':'My List'})
    
    name = mydb[usn]

    send = []
    for docs in (name.find({"_id": {"$ne": '0'}})):
        send.append(docs)
    return(jsonify(send))

@app.route('/update',methods=['POST'])
def update():
    token = request.form.get('token')
    doc = request.form.get('id')
    new_data = json.loads(request.form.get('new_data'))

    user = auth.get_user(token)
    usn = user.email.split('@')[0]

    if(len(new_data)>10 and usn != "meet2005pokar"):
        return jsonify("List not updated")
    
    name = mydb[usn]

    document = name.find_one({"_id": ObjectId(doc)})

    if document:
        document['data'] = new_data
        
        name.replace_one({"_id": ObjectId(doc)}, document)
        return jsonify('updated')
    else:
        return jsonify('List not found')

@app.route('/addlist',methods=['POST'])
def addlist():
    token = request.form.get('token')
    l_name = request.form.get('name')

    user = auth.get_user(token)
    usn = user.email.split('@')[0]
    
    name = mydb[usn]

    if(name.count_documents({"_id": {"$ne": '0'}})>=3 and usn != "meet2005pokar"):
        return jsonify("Not updated")
    
    name.insert_one({'data':[],'name':l_name})

    return jsonify('updated')

@app.route('/dellist',methods=['POST'])
def dellist():
    token = request.form.get('token')
    id = request.form.get('id')

    user = auth.get_user(token)
    usn = user.email.split('@')[0]
    
    name = mydb[usn]
    name.delete_one({'_id':ObjectId(id)})
    return jsonify('updated')

if __name__ == '__main__':
    app.run(debug=True,port=2468)
