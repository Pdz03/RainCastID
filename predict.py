from connect import db, dbuji
from flask import jsonify, request, redirect, url_for
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename
import pandas as pd
import numpy as np
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
import tensorflow as tf

class predictFunction:
    def ambildata():
        data_uji = list(db.datacurahhujan.find({},{'_id':False}))
        data_minmax = list(db.dataminmax.find({},{'_id':False}))

        listdata = []
        listnormaldata = []
        for i in range(len(data_uji)):
            data = {
                "x0": round(data_uji[i]['x0'], 2),
                "x1": round(data_uji[i]['x1'], 2),
                "x2": round(data_uji[i]['x2'], 2),
                "x3": round(data_uji[i]['x3'], 2),
                "y": round(data_uji[i]['y'], 2),
            }

            x0normal = (data_uji[i]['x0'] - data_minmax[0]['x0min'])/(data_minmax[0]['x0max'] - data_minmax[0]['x0min'])
            x1normal = (data_uji[i]['x1'] - data_minmax[0]['x1min'])/(data_minmax[0]['x1max'] - data_minmax[0]['x1min'])
            x2normal = (data_uji[i]['x2'] - data_minmax[0]['x2min'])/(data_minmax[0]['x2max'] - data_minmax[0]['x2min'])
            x3normal = (data_uji[i]['x3'] - data_minmax[0]['x3min'])/(data_minmax[0]['x3max'] - data_minmax[0]['x3min'])
            ynormal = (data_uji[i]['y'] - data_minmax[0]['ymin'])/(data_minmax[0]['ymax'] - data_minmax[0]['ymin'])
    
            datanormalisasi = {
                "x0": round(x0normal, 2),
                "x1": round(x1normal, 2),
                "x2": round(x2normal, 2),
                "x3": round(x3normal, 2),
                "y": round(ynormal, 2)
            }
            listnormaldata.append(datanormalisasi)
            listdata.append(data)
        return {'listdata': listdata, 'listnormaldata': listnormaldata, "minmax": data_minmax}
    

    def upload_data():
        if "file_give" in request.files:
            time = datetime.now().strftime("%m%d%H%M%S")
            file = request.files["file_give"]
            filename = secure_filename(file.filename)
            extension = filename.split(".")[-1]
            filenamefix = f"datauji-{time}.{extension}"
            file.save("./static/assets/upload_data/" + filenamefix)

        if "confirm_give" in request.form:
            db.datacurahhujan.delete_many({})
            db.dataminmax.delete_many({})

        df = pd.read_excel(f'./static/assets/upload_data/{filenamefix}', sheet_name='Sheet2', decimal=',')
        
        listid = []
        listx0 = []
        listx1 = []
        listx2 = []
        listx3 = []
        listy = []
        list=[]
        for i in df.index:
            id = df['kode bln'][i]
            x0 = float(df["x0"][i])
            x1 = float(df["x1"][i])
            x2 = float(df["x2"][i])
            x3 = float(df["x3"][i])
            y = float(df["y"][i])
            listid.append(id)
            listx0.append(x0)
            listx1.append(x1)
            listx2.append(x2)
            listx3.append(x3)
            listy.append(y)

            doc = {
                "idbln": id,
                "x0": x0,
                "x1": x1,
                "x2": x2,
                "x3": x3,
                "y": y,
            }
            list.append(doc)

        listminmax = {
            "x0min": min(listx0),
            "x0max": max(listx0),
            "x1min": min(listx1),
            "x1max": max(listx1),
            "x2min": min(listx2),
            "x2max": max(listx2),
            "x3min": min(listx3),
            "x3max": max(listx3),
            "ymin": min(listy),
            "ymax": max(listy),
        }

        db.datacurahhujan.insert_many(list)
        db.dataminmax.insert_one(listminmax)

    def predict():
        # Pengambilan form data dari client
        suhu_receive = float(request.form.get("suhu_give"))
        kelembaban_receive = float(request.form.get("kelembaban_give"))
        kecepatan_receive = float(request.form.get("kecepatan_give"))
        tekanan_receive = float(request.form.get("tekanan_give"))

        def sigmoid(x):
            return 1 / (1 + np.exp(-x))

        def deriv_sigmoid(x):
            fx = sigmoid(x)
            return fx * (1 - fx)

        def mse_loss(y_true, y_pred):
            return ((y_true - y_pred) ** 2).mean()
        
        class OurNeuralNetwork:
            def __init__(self):
                # Bobot
                self.w1 = np.random.normal()
                self.w2 = np.random.normal()
                self.w3 = np.random.normal()
                self.w4 = np.random.normal()
                self.w5 = np.random.normal()
                self.w6 = np.random.normal()
                self.w7 = np.random.normal()
                self.w8 = np.random.normal()
                self.w9 = np.random.normal()
                self.w10 = np.random.normal()
                self.w11 = np.random.normal()
                self.w12 = np.random.normal()
                self.w13 = np.random.normal()
                self.w14 = np.random.normal()
                self.w15 = np.random.normal()
                self.w16 = np.random.normal()
                self.w17 = np.random.normal()
                self.w18 = np.random.normal()
                self.w19 = np.random.normal()
                self.w20 = np.random.normal()

                # Bias
                self.b1 = np.random.normal()
                self.b2 = np.random.normal()
                self.b3 = np.random.normal()
                self.b4 = np.random.normal()
                self.b5 = np.random.normal()

            def feedforward(self, x):
                # Perhitungan pada lapisan input dan hidden lapisan pertama
                h11 = sigmoid(self.w1 * x[0] + self.w2 * x[1] + self.w3 * x[2] + self.w4 * x[3] + self.b1)
                h12 = sigmoid(self.w5 * x[0] + self.w6 * x[1] + self.w7 * x[2] + self.w8 * x[3] + self.b2)
                h13 = sigmoid(self.w9 * x[0] + self.w10 * x[1] + self.w11 * x[2] + self.w12 * x[3] + self.b3)
                h14 = sigmoid(self.w13 * x[0] + self.w14 * x[1] + self.w15 * x[2] + self.w16 * x[3] + self.b4)
                o1 = sigmoid(self.w17 * h11 + self.w18 * h12 + self.w19 * h13 + self.w20 * h14 + self.b5)

                return o1

            def train(self, data, all_y_trues):
                learn_rate = 0.5
                epochs = 5000

                for epoch in range(epochs):
                    for x, y_true in zip(data, all_y_trues):
                        # perhitungan feedforward untuk keperluan tahap berikutnya
                        sum_h11 = self.w1 * x[0] + self.w2 * x[1] + self.w3 * x[2] + self.w4 * x[3] + self.b1
                        h11 = sigmoid(sum_h11)
    
                        sum_h12 = self.w5 * x[0] + self.w6 * x[1] + self.w7 * x[2] + self.w8 * x[3] + self.b2
                        h12 = sigmoid(sum_h12)

                        sum_h13 = self.w9 * x[0] + self.w10 * x[1] + self.w11 * x[2] + self.w12 * x[3] + self.b3
                        h13 = sigmoid(sum_h13)
    
                        sum_h14 = self.w13 * x[0] + self.w14 * x[1] + self.w15 * x[2] + self.w16 * x[3] + self.b4
                        h14 = sigmoid(sum_h14)

                        sum_o2 = self.w17 * h11 + self.w18 * h12 + self.w19 * h13 + self.w20 * h14 + self.b5
                        o2 = sigmoid(sum_o2)
                        y_pred = o2  

                        # perhitungan turunan error dari hasil feedforward
                        d_i_d_ypred = -2 * (y_true - y_pred)

                        # perhitungan turunan error terhadap bobot dan bias dari nilai output
                        d_ypred_d_w17 = h11 * deriv_sigmoid(sum_o2)
                        d_ypred_d_w18 = h12 * deriv_sigmoid(sum_o2)
                        d_ypred_d_w19 = h13 * deriv_sigmoid(sum_o2)
                        d_ypred_d_w20 = h14 * deriv_sigmoid(sum_o2)
                        d_ypred_d_b5 = deriv_sigmoid(sum_o2)

                        # perhitungan turunan error terhadap hidden dari nilai neuron output
                        d_ypred_d_h11 = self.w17 * deriv_sigmoid(sum_o2)
                        d_ypred_d_h12 = self.w18 * deriv_sigmoid(sum_o2)
                        d_ypred_d_h13 = self.w19 * deriv_sigmoid(sum_o2)
                        d_ypred_d_h14 = self.w20 * deriv_sigmoid(sum_o2)

                        # perhitungan turunan error terhadap bobot dari nilai neuron input dengan neuron hidden 1
                        d_h11_d_w1 = x[0] * deriv_sigmoid(sum_h11)
                        d_h11_d_w2 = x[1] * deriv_sigmoid(sum_h11)
                        d_h11_d_w3 = x[2] * deriv_sigmoid(sum_h11)
                        d_h11_d_w4 = x[3] * deriv_sigmoid(sum_h11)
                        # perhitungan turunan error terhadap bias dari nilai neuron hidden 1
                        d_h11_d_b1 = deriv_sigmoid(sum_h11)

                        # perhitungan turunan error terhadap bobot dari nilai neuron input dengan neuron hidden 2
                        d_h12_d_w5 = x[0] * deriv_sigmoid(sum_h12)
                        d_h12_d_w6 = x[1] * deriv_sigmoid(sum_h12)
                        d_h12_d_w7 = x[2] * deriv_sigmoid(sum_h12)
                        d_h12_d_w8 = x[3] * deriv_sigmoid(sum_h12)
                        # perhitungan turunan error terhadap bias dari nilai neuron hidden 2
                        d_h12_d_b2 = deriv_sigmoid(sum_h12)

                        # perhitungan turunan error terhadap bobot dari nilai neuron input dengan neuron hidden 3
                        d_h13_d_w9 = x[0] * deriv_sigmoid(sum_h13)
                        d_h13_d_w10 = x[1] * deriv_sigmoid(sum_h13)
                        d_h13_d_w11 = x[2] * deriv_sigmoid(sum_h13)
                        d_h13_d_w12 = x[3] * deriv_sigmoid(sum_h13)
                        # perhitungan turunan error terhadap bias dari nilai neuron hidden 3
                        d_h13_d_b3 = deriv_sigmoid(sum_h13)

                        # perhitungan turunan error terhadap bobot dari nilai neuron input dengan neuron hidden 4
                        d_h14_d_w13 = x[0] * deriv_sigmoid(sum_h14)
                        d_h14_d_w14 = x[1] * deriv_sigmoid(sum_h14)
                        d_h14_d_w15 = x[2] * deriv_sigmoid(sum_h14)
                        d_h14_d_w16 = x[3] * deriv_sigmoid(sum_h14)
                        # perhitungan turunan error terhadap bias dari nilai neuron hidden 4
                        d_h14_d_b4 = deriv_sigmoid(sum_h14)

                        self.w1 -= learn_rate * d_i_d_ypred * d_ypred_d_h11 * d_h11_d_w1
                        self.w2 -= learn_rate * d_i_d_ypred * d_ypred_d_h11 * d_h11_d_w2
                        self.w3 -= learn_rate * d_i_d_ypred * d_ypred_d_h11 * d_h11_d_w3
                        self.w4 -= learn_rate * d_i_d_ypred * d_ypred_d_h11 * d_h11_d_w4
                        self.b1 -= learn_rate * d_i_d_ypred * d_ypred_d_h11 * d_h11_d_b1

                        self.w5 -= learn_rate * d_i_d_ypred * d_ypred_d_h12 * d_h12_d_w5
                        self.w6 -= learn_rate * d_i_d_ypred * d_ypred_d_h12 * d_h12_d_w6
                        self.w7 -= learn_rate * d_i_d_ypred * d_ypred_d_h12 * d_h12_d_w7
                        self.w8 -= learn_rate * d_i_d_ypred * d_ypred_d_h12 * d_h12_d_w8
                        self.b2 -= learn_rate * d_i_d_ypred * d_ypred_d_h12 * d_h12_d_b2

                        self.w9 -= learn_rate * d_i_d_ypred * d_ypred_d_h13 * d_h13_d_w9
                        self.w10 -= learn_rate * d_i_d_ypred * d_ypred_d_h13 * d_h13_d_w10
                        self.w11 -= learn_rate * d_i_d_ypred * d_ypred_d_h13 * d_h13_d_w11
                        self.w12 -= learn_rate * d_i_d_ypred * d_ypred_d_h13 * d_h13_d_w12
                        self.b3 -= learn_rate * d_i_d_ypred * d_ypred_d_h13 * d_h13_d_b3

                        self.w13 -= learn_rate * d_i_d_ypred * d_ypred_d_h14 * d_h14_d_w13
                        self.w14 -= learn_rate * d_i_d_ypred * d_ypred_d_h14 * d_h14_d_w14
                        self.w15 -= learn_rate * d_i_d_ypred * d_ypred_d_h14 * d_h14_d_w15
                        self.w16 -= learn_rate * d_i_d_ypred * d_ypred_d_h14 * d_h14_d_w16
                        self.b4 -= learn_rate * d_i_d_ypred * d_ypred_d_h14 * d_h14_d_b4

                        self.w17 -= learn_rate * d_i_d_ypred * d_ypred_d_w17
                        self.w18 -= learn_rate * d_i_d_ypred * d_ypred_d_w18
                        self.w19 -= learn_rate * d_i_d_ypred * d_ypred_d_w19
                        self.w20 -= learn_rate * d_i_d_ypred * d_ypred_d_w20
                        self.b5 -= learn_rate * d_i_d_ypred * d_ypred_d_b5

                    if epoch % 250 == 0:
                        y_preds = np.apply_along_axis(self.feedforward, 1, data)    
                        loss = mse_loss(all_y_trues, y_preds)
                        print (f"Epoch {epoch} loss: {loss}")


        # Pengambilan data dari mongoDB
        data_uji = list(db.datacurahhujan.find({},{'_id':False}))
        data_minmax = list(db.dataminmax.find({},{'_id':False}))

        # Normalisasi data
        listnormaldata = []
        for i in range(len(data_uji)):
            x0normal = (data_uji[i]['x0'] - data_minmax[0]['x0min'])/(data_minmax[0]['x0max'] - data_minmax[0]['x0min'])

            x1normal = (data_uji[i]['x1'] - data_minmax[0]['x1min'])/(data_minmax[0]['x1max'] - data_minmax[0]['x1min'])

            x2normal = (data_uji[i]['x2'] - data_minmax[0]['x2min'])/(data_minmax[0]['x2max'] - data_minmax[0]['x2min'])

            x3normal = (data_uji[i]['x3'] - data_minmax[0]['x3min'])/(data_minmax[0]['x3max'] - data_minmax[0]['x3min'])
        
            ynormal = (data_uji[i]['y'] - data_minmax[0]['ymin'])/(data_minmax[0]['ymax'] - data_minmax[0]['ymin'])

            datanormalisasi = {
                "x0": x0normal,
                "x1": x1normal,
                "x2": x2normal,
                "x3": x3normal,
                "y": ynormal
            }
            listnormaldata.append(datanormalisasi)
    
        # Klasifikasi data berdasarkan input dan output
        sampel_output=[]
        sampel_input=[]
        for datanormal in listnormaldata:
            sampel_input.append([datanormal['x0'], datanormal['x1'], datanormal['x2'], datanormal['x3']])
            sampel_output.append(datanormal['y'])
        # Pengambilan data set dan data output historis berdasarkan data yang dinormalisasi
        dataset = np.array(sampel_input)
        all_y_trues = np.array(sampel_output)

        # Pengambilan fungsi JST dengan parameter data set dan data output historis
        network = OurNeuralNetwork()
        network.train(dataset, all_y_trues)

        input = np.array([suhu_receive, kelembaban_receive, kecepatan_receive, tekanan_receive]) 
        output = network.feedforward(input)
        curahhujan = (data_minmax[0]['ymax'] - data_minmax[0]['ymin']) * output + data_minmax[0]['ymin']

        hasil = {
            "suhu": suhu_receive, 
            "kelembaban": kelembaban_receive,  
            "kecepatan": kecepatan_receive,
            "tekanan": tekanan_receive,      
            "hasil" : curahhujan
        }

        return hasil

    def predictWithModelAPI():
        cuacaTerkini = list(request.get_json())

        # Pengambilan data minmax dari mongoDB
        data_minmax = list(db.dataminmax.find({},{'_id':False}))

        listInput = []
        for cuaca in cuacaTerkini:
            dataNormal = [
                (float(cuaca['suhu']) - data_minmax[0]['x0min'])/(data_minmax[0]['x0max'] - data_minmax[0]['x0min']),
                (float(cuaca['kelembaban']) - data_minmax[0]['x1min'])/(data_minmax[0]['x1max'] - data_minmax[0]['x1min']),
                (float(cuaca['kecepatan']) - data_minmax[0]['x2min'])/(data_minmax[0]['x2max'] - data_minmax[0]['x2min']),
                (float(cuaca['tekanan']) - data_minmax[0]['x3min'])/(data_minmax[0]['x3max'] - data_minmax[0]['x3min'])]
            listInput.append(dataNormal)

        input = np.array(listInput)

        model = tf.keras.models.load_model('static/predict-model/PCH-model5.keras')

        output = model.predict(input)

        curahhujan = (data_minmax[0]['ymax'] - data_minmax[0]['ymin']) * output + data_minmax[0]['ymin']

        dataWaktu = []
        for cuaca in cuacaTerkini:
            waktu = cuaca['waktu']
            dataWaktu.append(waktu)
        
        resultData = []
        for waktu, output in zip(dataWaktu, curahhujan):
            hasil = float(output[0])
            if output[0] < 0:
                hasil = 0
            resultData.append({
                'waktu': waktu,
                'hasil': hasil
            })

        print(resultData)

        return resultData

    def predictWithModel():
        # Pengambilan form data dari client
        suhu_receive = float(request.form.get("suhu_give"))
        kelembaban_receive = float(request.form.get("kelembaban_give"))
        kecepatan_receive = float(request.form.get("kecepatan_give"))
        tekanan_receive = float(request.form.get("tekanan_give"))

        # Pengambilan data minmax dari mongoDB
        data_minmax = list(db.dataminmax.find({},{'_id':False}))

        input = np.array([[suhu_receive, kelembaban_receive, kecepatan_receive, tekanan_receive]])

        model = tf.keras.models.load_model('static/predict-model/PCH-model5.keras')

        output = model.predict(input)

        curahhujan = (data_minmax[0]['ymax'] - data_minmax[0]['ymin']) * output + data_minmax[0]['ymin']
        hasil = {
            "suhu": suhu_receive, 
            "kelembaban": kelembaban_receive,  
            "kecepatan": kecepatan_receive,
            "tekanan": tekanan_receive,      
            "hasil" : float(curahhujan)
        }

        return hasil
        
