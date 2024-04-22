from connect import db, dbuji
import numpy as np
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
import tensorflow as tf

dataLatih = list(db.datalatih.find({},{"_id": False}))
dataValid = list(db.datavalid.find({},{"_id": False}))
dataUji = list(db.datauji.find({},{"_id": False}))
dataMinMax = list(db.dataminmax.find({},{"_id": False}))

# Pemisahan data ke tf
x_train = []
y_train = []
for dataL in dataLatih:
    datax_train = [(dataL['x0'] - dataMinMax[0]['x0min'])/(dataMinMax[0]['x0max'] - dataMinMax[0]['x0min']), (dataL['x1'] - dataMinMax[0]['x1min'])/(dataMinMax[0]['x1max'] - dataMinMax[0]['x1min']), (dataL['x2'] - dataMinMax[0]['x2min'])/(dataMinMax[0]['x2max'] - dataMinMax[0]['x2min']),(dataL['x3'] - dataMinMax[0]['x3min'])/(dataMinMax[0]['x3max'] - dataMinMax[0]['x3min'])]
    x_train.append(datax_train)
    y_train.append((dataL['y'] - dataMinMax[0]['ymin'])/(dataMinMax[0]['ymax'] - dataMinMax[0]['ymin']))

x_val = []
y_val = []
for dataV in dataValid:
    datax_val = [(dataV['x0'] - dataMinMax[0]['x0min'])/(dataMinMax[0]['x0max'] - dataMinMax[0]['x0min']), (dataV['x1'] - dataMinMax[0]['x1min'])/(dataMinMax[0]['x1max'] - dataMinMax[0]['x1min']), (dataV['x2'] - dataMinMax[0]['x2min'])/(dataMinMax[0]['x2max'] - dataMinMax[0]['x2min']),(dataV['x3'] - dataMinMax[0]['x3min'])/(dataMinMax[0]['x3max'] - dataMinMax[0]['x3min'])]
    x_val.append(datax_val)
    y_val.append((dataV['y'] - dataMinMax[0]['ymin'])/(dataMinMax[0]['ymax'] - dataMinMax[0]['ymin']))

x_test = []
y_test = []
y_true = []
for dataT in dataUji:
    datax_train = [(dataT['x0'] - dataMinMax[0]['x0min'])/(dataMinMax[0]['x0max'] - dataMinMax[0]['x0min']), (dataT['x1'] - dataMinMax[0]['x1min'])/(dataMinMax[0]['x1max'] - dataMinMax[0]['x1min']), (dataT['x2'] - dataMinMax[0]['x2min'])/(dataMinMax[0]['x2max'] - dataMinMax[0]['x2min']),(dataT['x3'] - dataMinMax[0]['x3min'])/(dataMinMax[0]['x3max'] - dataMinMax[0]['x3min'])]
    x_train.append(datax_train)
    y_train.append((dataT['y'] - dataMinMax[0]['ymin'])/(dataMinMax[0]['ymax'] - dataMinMax[0]['ymin']))
    y_true.append(dataT['y'])

model = tf.keras.Sequential([
    tf.keras.layers.Dense(100, activation="relu"),
    tf.keras.layers.Dense(1)
])

model.compile(
    optimizer=tf.optimizers.Adam(),
    loss='mse',
    metrics=[tf.keras.metrics.RootMeanSquaredError()])

# Latih model
model.fit(np.array(x_train), np.array(y_train), steps_per_epoch=20, epochs=250)

# Evaluasi
model.evaluate(np.array(x_val), np.array(y_val))

model.save('static/predict-model/PCH-model6.keras')

# y_pred = model.predict(np.array(x_test))

# output = (y_pred * (dataMinMax[0]['ymax'] - dataMinMax[0]['ymin'])) + dataMinMax[0]['ymin']

# print(output)
# print(y_true)
