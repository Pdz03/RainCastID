from flask import Flask, render_template, jsonify, request, redirect, url_for
from predict import predictFunction
app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/admin')
def adminpage():
    return render_template('admin.html')

@app.route('/getdata')
def getData():
    datalist = predictFunction.ambildata()

    return jsonify({"result": "success", "data":datalist})

@app.route('/upload_data', methods=["POST"])
def uploadData():
    predictFunction.upload_data()
    return jsonify({"result": "success"})

@app.route('/predict', methods=["POST"])
def Predict():
    hasil = predictFunction.predict()
    return jsonify({"result": "success", "data": hasil})

@app.route('/predictModel', methods=["POST"])
def PredictWithModel():
    hasil = predictFunction.predictWithModel()
    return jsonify({"result": "success", "data": hasil})

@app.route('/predictModelAPI', methods=["POST"])
def PredictWithModelAPI():
    hasil = predictFunction.predictWithModelAPI()
    return jsonify({"result": "success", "data": hasil})