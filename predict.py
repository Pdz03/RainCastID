from connect import db, dbuji
from flask import request
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename
import pandas as pd
import numpy as np
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
import tensorflow as tf

class predictJST:
    def JSTInitModel():
        db.databobot.delete_many({})
        db.databias.delete_many({})

        epoch_rec = int(request.form.get("epoch"))

        def sigmoid(x):
            x = np.clip(x, -10, 10)
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
                epochs = epoch_rec

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
                        d_i_d_ypred = (y_true - y_pred)*(deriv_sigmoid(y_pred))

                        # perubahan bobot dan bias output
                        d_wo_w17 = learn_rate*d_i_d_ypred*sum_h11
                        d_wo_w18 = learn_rate*d_i_d_ypred*sum_h12
                        d_wo_w19 = learn_rate*d_i_d_ypred*sum_h13
                        d_wo_w20 = learn_rate*d_i_d_ypred*sum_h14
                        d_bo_b5 = learn_rate*d_i_d_ypred

                        # error hidden terhadap output
                        h11_o_w17 = learn_rate*self.w17
                        h12_O_W18 = learn_rate*self.w18
                        h13_o_w19 = learn_rate*self.w19
                        h14_o_w20 = learn_rate*self.w20

                        # turunan error hidden
                        d_error_h11 = h11_o_w17*deriv_sigmoid(h11)
                        d_error_h12 = h12_O_W18*deriv_sigmoid(h12)
                        d_error_h13 = h13_o_w19*deriv_sigmoid(h13)
                        d_error_h14 = h14_o_w20*deriv_sigmoid(h14)

                        # perubahan bobot dan bias hidden
                        d_wh1_x1 = learn_rate*d_error_h11*x[0]
                        d_wh1_x2 = learn_rate*d_error_h11*x[1]
                        d_wh1_x3 = learn_rate*d_error_h11*x[2]
                        d_wh1_x4 = learn_rate*d_error_h11*x[3]

                        d_wh2_x1 = learn_rate*d_error_h12*x[0]
                        d_wh2_x2 = learn_rate*d_error_h12*x[1]
                        d_wh2_x3 = learn_rate*d_error_h12*x[2]
                        d_wh2_x4 = learn_rate*d_error_h12*x[3]

                        d_wh3_x1 = learn_rate*d_error_h13*x[0]
                        d_wh3_x2 = learn_rate*d_error_h13*x[1]
                        d_wh3_x3 = learn_rate*d_error_h13*x[2]
                        d_wh3_x4 = learn_rate*d_error_h13*x[3]

                        d_wh4_x1 = learn_rate*d_error_h14*x[0]
                        d_wh4_x2 = learn_rate*d_error_h14*x[1]
                        d_wh4_x3 = learn_rate*d_error_h14*x[2]
                        d_wh4_x4 = learn_rate*d_error_h14*x[3]

                        d_bh_b1 = learn_rate*d_error_h11
                        d_bh_b2 = learn_rate*d_error_h12
                        d_bh_b3 = learn_rate*d_error_h13
                        d_bh_b4 = learn_rate*d_error_h14

                        # update_weight

                        self.w1 += d_wh1_x1
                        self.w2 += d_wh1_x2
                        self.w3 += d_wh1_x3
                        self.w4 += d_wh1_x4
                        self.b1 += d_bh_b1

                        self.w5 += d_wh2_x1
                        self.w6 += d_wh2_x2
                        self.w7 += d_wh2_x3
                        self.w8 += d_wh2_x4
                        self.b2 += d_bh_b2

                        self.w9 += d_wh3_x1          
                        self.w10 += d_wh3_x2
                        self.w11 += d_wh3_x3
                        self.w12 += d_wh3_x4
                        self.b3 += d_bh_b3

                        self.w13 += d_wh4_x1
                        self.w14 += d_wh4_x2
                        self.w15 += d_wh4_x3
                        self.w16 += d_wh4_x4
                        self.b4 += d_bh_b4

                        self.w17 += d_wo_w17
                        self.w18 += d_wo_w18
                        self.w19 += d_wo_w19
                        self.w20 += d_wo_w20
                        self.b5 += d_bo_b5

                    if epoch % 10 == 0:
                        y_preds = np.apply_along_axis(self.feedforward, 1, data)    
                        loss = mse_loss(all_y_trues, y_preds)
                        print (f"Epoch {epoch} loss: {loss}")
                
                data_bobot = {
                    'w1': self.w1,
                    'w2': self.w2,
                    'w3': self.w3,
                    'w4': self.w4,
                    'w5': self.w5,
                    'w6': self.w6,
                    'w7': self.w7,
                    'w8': self.w8,
                    'w9': self.w9,
                    'w10': self.w10,
                    'w11': self.w11,
                    'w12': self.w12,
                    'w13': self.w13,
                    'w14': self.w14,
                    'w15': self.w15,
                    'w16': self.w16,
                    'w17': self.w17,
                    'w18': self.w18,
                    'w19': self.w19,
                    'w20': self.w20,
                }

                data_bias = {
                    'b1': self.b1,
                    'b2': self.b2,
                    'b3': self.b3,
                    'b4': self.b4,
                    'b5': self.b5,
                }
                db.databobot.insert_one(data_bobot)
                db.databias.insert_one(data_bias)
        
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

        return network
    
    def JSTPredictResult():
        bobot = list(db.databobot.find({},{'_id':False}))
        bias = list(db.databias.find({},{'_id':False}))

        def sigmoid(x):
            x = np.clip(x, -10, 10)
            return 1 / (1 + np.exp(-x))

        if len(bobot) > 0 and len(bias) > 0:
            print(bobot)
            print(bias)
            class PredictJST:
                def __init__(self):
                    # Bobot
                    self.w1 = float(bobot[0]['w1'])
                    self.w2 = float(bobot[0]['w2'])
                    self.w3 = float(bobot[0]['w3'])
                    self.w4 = float(bobot[0]['w4'])
                    self.w5 = float(bobot[0]['w5'])
                    self.w6 = float(bobot[0]['w6'])
                    self.w7 = float(bobot[0]['w7'])
                    self.w8 = float(bobot[0]['w8'])
                    self.w9 = float(bobot[0]['w9'])
                    self.w10 = float(bobot[0]['w10'])
                    self.w11 = float(bobot[0]['w11'])
                    self.w12 = float(bobot[0]['w12'])
                    self.w13 = float(bobot[0]['w13'])
                    self.w14 = float(bobot[0]['w14'])
                    self.w15 = float(bobot[0]['w15'])
                    self.w16 = float(bobot[0]['w16'])
                    self.w17 = float(bobot[0]['w17'])
                    self.w18 = float(bobot[0]['w18'])
                    self.w19 = float(bobot[0]['w19'])
                    self.w20 = float(bobot[0]['w20'])

                    # Bias
                    self.b1 = float(bias[0]['b1'])
                    self.b2 = float(bias[0]['b2'])
                    self.b3 = float(bias[0]['b3'])
                    self.b4 = float(bias[0]['b4'])
                    self.b5 = float(bias[0]['b5'])

                def feedforward(self, x):
                    # Perhitungan pada lapisan input dan hidden lapisan pertama
                    h11 = sigmoid(self.w1 * x[0] + self.w2 * x[1] + self.w3 * x[2] + self.w4 * x[3] + self.b1)
                    h12 = sigmoid(self.w5 * x[0] + self.w6 * x[1] + self.w7 * x[2] + self.w8 * x[3] + self.b2)
                    h13 = sigmoid(self.w9 * x[0] + self.w10 * x[1] + self.w11 * x[2] + self.w12 * x[3] + self.b3)
                    h14 = sigmoid(self.w13 * x[0] + self.w14 * x[1] + self.w15 * x[2] + self.w16 * x[3] + self.b4)
                    output = sigmoid(self.w17 * h11 + self.w18 * h12 + self.w19 * h13 + self.w20 * h14 + self.b5)

                    return output

            result = PredictJST()
            return result
        else:
            return 'GAGAL'

class predictFunction:
    def predict():
        # Pengambilan form data dari client
        suhu_receive = float(request.form.get("suhu_give"))
        kelembaban_receive = float(request.form.get("kelembaban_give"))
        kecepatan_receive = float(request.form.get("kecepatan_give"))
        tekanan_receive = float(request.form.get("tekanan_give"))

        data_minmax = list(db.dataminmax.find({},{'_id':False}))

        input = np.array([suhu_receive, kelembaban_receive, kecepatan_receive, tekanan_receive]) 
        network = predictJST.JSTPredictResult()
        output = network.feedforward(input)
        curahhujan = (data_minmax[0]['ymax'] - data_minmax[0]['ymin']) * output + data_minmax[0]['ymin']

        hasil = {
            "ymax": data_minmax[0]['ymax'],
            "ymin": data_minmax[0]['ymin'],
            "suhu": suhu_receive, 
            "kelembaban": kelembaban_receive,  
            "kecepatan": kecepatan_receive,
            "tekanan": tekanan_receive,      
            "hasil" : curahhujan
        }

        print(output)
        print(hasil)

        return hasil

    def predictAPI():
        cuacaTerkini = list(request.get_json())

        data_minmax = list(db.dataminmax.find({},{'_id':False}))

        listInput = []
        for cuaca in cuacaTerkini:
            dataNormal = [
                float(float(cuaca['suhu']) - data_minmax[0]['x0min'])/(data_minmax[0]['x0max'] - data_minmax[0]['x0min']),
                float(float(cuaca['kelembaban']) - data_minmax[0]['x1min'])/(data_minmax[0]['x1max'] - data_minmax[0]['x1min']),
                float(float(cuaca['kecepatan']) - data_minmax[0]['x2min'])/(data_minmax[0]['x2max'] - data_minmax[0]['x2min']),
                float(float(cuaca['tekanan']) - data_minmax[0]['x3min'])/(data_minmax[0]['x3max'] - data_minmax[0]['x3min'])]
            listInput.append(dataNormal)

        input = listInput
        network = predictJST.JSTPredictResult()

        listOutput = []
        for data in input:
            output = network.feedforward(data)
            curahhujan = (data_minmax[0]['ymax'] - data_minmax[0]['ymin']) * output + data_minmax[0]['ymin']
            listOutput.append(curahhujan)

        dataWaktu = []
        for cuaca in cuacaTerkini:
            waktu = cuaca['waktu']
            dataWaktu.append(waktu)
        
        resultData = []
        for waktu, output in zip(dataWaktu, listOutput):
            hasil = float(output)
            if output < 0:
                hasil = 0
            resultData.append({
                'waktu': waktu,
                'hasil': hasil
            })

        return resultData

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
        
