from flask import Flask, render_template, jsonify, request, redirect, url_for
from predict import predictFunction, predictJST
from datetime import datetime, timedelta
import jwt
from connect import db, dbuji
from werkzeug.utils import secure_filename
import pandas as pd
app = Flask(__name__)

SECRET_KEY = "RAINCASTID"
TOKEN_KEY = "mytoken"
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/admin-dashboard')
def adminpage():
    return render_template('admin/dashboard.html')

@app.route('/dashboard')
def dashboarduser():
    return render_template('user/dashboard.html')

@app.route('/user/<username>')
def user(username):
    user_info = db.users.find_one(
        {"username": username},
        {"_id": False}
    )
    token_receive = request.cookies.get("mytoken")
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        user_login = db.users.find_one({"username": payload["id"]})
        
        if user_info['username'] == user_login['username']:
            return render_template("user/profile.html", user_info=user_info, user_login=user_login)
        else:
            return render_template("user/profile.html", user_info=user_info)
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return render_template("user/profile.html", user_info=user_info)

@app.route('/forum')
def forum():
    return render_template("user/forum.html")

@app.route("/update_profile", methods=["POST"])
def update_profile():
    token_receive = request.cookies.get("mytoken")
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        username = payload["id"]
        fullname_receive = request.form["fullname_give"]
        locid_receive = request.form["loc_give"]        
        locname_receive = request.form["locname_give"]      
        bio_receive = request.form["bio_give"]
        birth_receive = request.form["birth_give"]
        new_doc = {
            'fullname': fullname_receive,
            'profile_info':{
                'location_id': locid_receive,
                'location_name': locname_receive,
                'bio':bio_receive,
                'birth':birth_receive
            }
        }

        if "phone_give" in request.form:
            phone_receive = request.form["phone_give"]
            new_doc['phone'] = phone_receive

        if "wa-enable_give" in request.form:
            print(request.form['wa-enable_give'])
            if int(request.form['wa-enable_give']) == 0:
                new_doc['wa_enable'] = False
            elif int(request.form['wa-enable_give']) == 1:
                new_doc['wa_enable'] = True
    
        if "file_give" in request.files:
            time = datetime.now().strftime("%m%d%H%M%S")
            file = request.files["file_give"]
            filename = secure_filename(file.filename)
            extension = filename.split(".")[-1]
            file_path = f"profile_pics/profilimg-{username}-{time}.{extension}"
            file.save("./static/assets/" + file_path)
            new_doc["profile_pic"] = filename
            new_doc["profile_pic_real"] = file_path

        db.users.update_one({"username": payload["id"]}, {"$set": new_doc})
        return jsonify({"result": "success", "msg": "Profile updated!"})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))
    
@app.route("/reset_pass", methods=["POST"])
def reset_pass():
    token_receive = request.cookies.get("mytoken")
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        username_receive = request.form["username_give"]
        if username_receive == payload['id']:
            password_receive = request.form["passnew_give"]
            db.users.update_one({"username": payload["id"]}, {"$set": {'password':password_receive}})

        return jsonify({"result": "success", "msg": "Profile updated!"})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))

@app.route("/reset_email", methods=["POST"])
def reset_email():
    token_receive = request.cookies.get("mytoken")
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        username_receive = request.form["username_give"]
        if username_receive == payload['id']:
            email_receive = request.form["newemail_give"]
            db.users.update_one({"username": payload["id"]}, {"$set": {'email':email_receive, 'emailconfirm':False}})

        return jsonify({"result": "success", "msg": "Profile updated!"})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))

@app.route('/predictModel', methods=["POST"])
def PredictWithModel():
    hasil = predictFunction.predictWithModel()
    return jsonify({"result": "success", "data": hasil})

@app.route('/predictModelAPI', methods=["POST"])
def PredictWithModelAPI():
    hasil = predictFunction.predictWithModelAPI()
    return jsonify({"result": "success", "data": hasil})

@app.route('/predict', methods=["POST"])
def Predict():
    hasil = predictFunction.predict()
    return jsonify({"result": "success", "data": hasil})

@app.route('/predictAPI', methods=["POST"])
def PredictAPI():
    hasil = predictFunction.predictAPI()
    return jsonify({"result": "success", "data": hasil})

@app.route('/savePredict', methods=["POST"])
def savePredict():
    hasil = list(request.get_json())
    time = datetime.now().strftime("%m%d%H%M%S")
    data = {
        'predictid': f'predict-{time}',
        'username': hasil[0]['username'],
        'date': hasil[0]['date'],
        'result': list(hasil[0]['result']),
        'type': hasil[0]['type']
    }

    print(data)
    db.predict_history.insert_one(data)
    return jsonify({"result": "success"})

@app.route('/showPredict')
def showPredict():
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        payload = jwt.decode(
            token_receive,
            SECRET_KEY,
            algorithms=["HS256"],
        )
        username = payload.get('id')
        history = list(db.predict_history.find({'username': username}, {'_id': False}))
        return jsonify({"result": "success","data": history})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return jsonify({"result": "fail","msg": "Autentikasi Gagal"})

@app.route('/showPredictAdmin')
def showPredictAdmin():
    history = list(db.predict_history.find({}, {'_id': False}))
    return jsonify({"result": "success","data": history})

@app.route('/register/check_dup_email)', methods=["POST"])
def check_dup_email():
    email_receive = request.form.get("email_give")
    exists = bool(db.users.find_one({'email': email_receive}))
    return jsonify({"result": "success", "exists": exists})

@app.route('/register/check_dup_username', methods=["POST"])
def check_dup_username():
    username_receive = request.form.get("username_give")
    exists = bool(db.users.find_one({'username': username_receive}))
    return jsonify({"result": "success", "exists": exists})

@app.route('/register', methods=["POST"])
def register():
    username_receive = request.form.get("username_give")
    email_receive = request.form.get("email_give")
    password_receive = request.form.get("password_give")

    data_user = {
        "username": username_receive,
        "fullname": "",
        "email": email_receive,
        "password": password_receive,
        "profile_pic": "",
        "profile_pic_real": "profile_pics/profile_icon.png",
        "profile_info": {
            "location_id": "",
            "location_name": "",
            "birth": "",
            "bio": ""
        },
        "notifsetting":{
            "teleid":"",
            "teleuser":"",
            "botactivated": False,
            "notifbrowser":False
        },
        "emailconfirm": False,
        "phone": "",
        "wa_enable": False,
        "level": 2
    }

    db.users.insert_one(data_user)

    return jsonify({"result": "success", "data": email_receive})

@app.route('/login', methods=["POST"])
def login():
    email_receive = request.form["email_give"]
    password_receive = request.form["password_give"]

    result = db.users.find_one(
        {
            "email": email_receive,
            "password": password_receive,
        }
    )

    if result:
        data_user = {
            'username': result['username'],
            'level': result['level'],
        }
        payload = {
            "id": result['username'],
            # the token will be valid for 24 hours
            "exp": datetime.utcnow() + timedelta(seconds=60 * 60 * 24),
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

        return jsonify(
            {
                "result": "success",
                "token": token,
                "data": data_user,
            }
        )
    # Let's also handle the case where the id and
    # password combination cannot be found
    else:
        return jsonify(
            {
                "result": "fail",
                "msg": "Kami tidak dapat menemukan akun anda, silakan cek email dan password anda!",
            }
        )
    
@app.route('/confirm_email', methods=['POST'])
def confirmEmail():
    username_receive = request.form['username_give']
    db.users.update_one({"username": username_receive}, {"$set": {'emailconfirm':True}})
    return jsonify({"result": "success"})

@app.route('/auth_login')
def auth_login():
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        payload = jwt.decode(
            token_receive,
            SECRET_KEY,
            algorithms=["HS256"],
        )
        data_user = db.users.find_one({'username': payload.get('id')})
        data_user['_id'] = str(data_user['_id'])
        # count_unread = db.notif.count_documents(
        #     {'to':payload['id'], 'read': False})
        return jsonify({"result": "success","data": data_user})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return jsonify({"result": "fail","msg": "Autentikasi Gagal"})

@app.route('/skipPopupEdit/')
def skipPopup():
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        payload = jwt.decode(
            token_receive,
            SECRET_KEY,
            algorithms=["HS256"],
        )
        db.users.update_one({"username": payload.get('id')}, {"$set": {'popup_skip':True}})
        return jsonify({"result": "success"})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return jsonify({"result": "fail","msg": "Autentikasi Gagal"})

@app.route("/post_forum", methods=["POST"])
def posting():
    token_receive = request.cookies.get("mytoken")
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        user_info = db.users.find_one({"username": payload["id"]})
        username = user_info["username"]
        lokasi_receive = request.form["lokasi_give"]
        deskripsi_receive = request.form["deskripsi_give"]
        date_receive = request.form["date_give"]
        if "file_give" in request.files:
            time = datetime.now().strftime("%m%d%H%M%S")
            file = request.files["file_give"]
            filename = secure_filename(file.filename)
            extension = filename.split(".")[-1]
            file_path = f"img_post/postimg-{username}-{time}.{extension}"
            file.save("./static/assets/" + file_path)
        doc = {
            "postid": f"forum-{username}-{time}",
            "username": user_info["username"],
            "profile_pic_real": user_info["profile_pic_real"],
            "lokasi": lokasi_receive,
            "deskripsi": deskripsi_receive,
            "image": file_path,
            "date": date_receive,
            "confirm": True
        }

        db.posts.insert_one(doc)
        return jsonify({"result": "success", "msg": f'Postingan berhasil dikirim!'})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))
    
@app.route("/update_forum", methods=["POST"])
def update_post():
    token_receive = request.cookies.get("mytoken")
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        user_info = db.users.find_one({"username": payload["id"]})
        username = user_info["username"]
        id_receive = request.form['id_give']
        judul_receive = request.form["judul_give"]
        lokasi_receive = request.form["lokasi_give"]
        deskripsi_receive = request.form["deskripsi_give"]
        new_doc = {
            "judul": judul_receive,
            "lokasi": lokasi_receive,
            "deskripsi": deskripsi_receive
        }
        if "file_give" in request.files:
            time = datetime.now().strftime("%m%d%H%M%S")
            file = request.files["file_give"]
            filename = secure_filename(file.filename)
            extension = filename.split(".")[-1]
            file_path = f"img_post/postimg-{username}-{time}.{extension}"
            file.save("./static/" + file_path)
            new_doc["image"] = file_path

        db.posts.update_one({"postid": id_receive}, {"$set": new_doc})
        return jsonify({"result": "success", "msg": f'Postingan dengan judul "{judul_receive}" berhasil diupdate!'})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))

@app.route('/delete/<idpost>', methods=['POST'])
def delete(idpost):
    db.posts.delete_one({"postid": idpost})
    return jsonify({"result": "success", "msg": "Postingan berhasil dihapus!"})

@app.route("/list_forum")
def get_posts():
    token_receive = request.cookies.get("mytoken")
    posts = list(db.posts.find({'confirm': True},{'_id':False}).sort("date", -1).limit(20))
    for post in posts:
        post["count_heart"] = db.likes.count_documents(
            {"postid": post['postid'], "type": "heart"})
        post['count_comment'] = db.comments.count_documents(
            {"postid": post['postid']})
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        for post in posts:
            post["heart_by_me"] = bool(db.likes.find_one(
                {"postid": post['postid'], "type": "heart", "username": payload['id']}))
        return jsonify({"result": "success", "msg": "Successful fetched all posts", "posts": posts})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return jsonify({"result": "success", "msg": "Successful fetched all posts", "posts": posts})

@app.route('/forum/<idpost>')
def detail_forum(idpost):
    token_receive = request.cookies.get("mytoken")
    post_info = db.posts.find_one(
        {"postid": idpost},
        {"_id": False}
    )
    
    if post_info != None:
        post_info["count_heart"] = db.likes.count_documents(
            {"postid": idpost, "type": "heart"})
        post_info['count_comment'] = db.comments.count_documents(
            {"postid": idpost})

        date_string_post = post_info['date']
        date_object = datetime.strptime(
            date_string_post, "%Y-%m-%dT%H:%M:%S.%fZ")
        date = date_object.date()
        formatted_date = date.strftime("%d %B %Y")

        user = db.users.find_one({"username": post_info['username']})

    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        post_info["heart_by_me"] = bool(db.likes.find_one(
            {"postid": idpost, "type": "heart", "username": payload['id']}))

        user_info = db.users.find_one({"username": payload["id"]})

        return render_template(
            "user/detail-forum.html",
            post_info=post_info,
            datepost=formatted_date,
            user=user,
            user_info=user_info)
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        if post_info != None:
            return render_template(
                "user/detail-forum.html",
                post_info=post_info,
                datepost=formatted_date,
                user=user)
        elif post_info == None:
            return redirect(url_for("content",  errmsg="Postingan ini tidak ada atau sudah dihapus!"))

@app.route("/add_comment", methods=["POST"])
def add_comment():
    token_receive = request.cookies.get("mytoken")
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        # We should change the like count for the post here
        user_info = db.users.find_one({"username": payload["id"]})
        post_id_receive = request.form["post_id_give"]
        comment_receive = request.form["comment_give"]
        time = datetime.now().strftime("%m%d%H%M%S")
        date_receive = request.form["date_give"]
        datapost = db.posts.find_one({'postid': post_id_receive})
        doc = {
            "commentid": f'commentid-{time}',
            "postid": post_id_receive,
            "username": user_info["username"],
            "comment": comment_receive,
            "date": date_receive
        }

        db.comments.insert_one(doc)
        count = db.comments.count_documents(
            {"postid": post_id_receive}
        )

        # doc_notif = {
        #     'from': payload["id"],
        #     'to':datapost['username'],
        #     'type':'comment',
        #     'toid': post_id_receive,
        #     'date': date_receive,
        #     'read': False,
        #     'isi': f'{payload["id"]} telah mengomentari postinganmu yang berjudul "{judulpost}"'
        # }
        # db.notif.insert_one(doc_notif)

        return jsonify({"result": "success", "msg": "Komentar terkirim!", "count": count})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))

@app.route('/getcomment/<idpost>')
def getcomment(idpost):
    komen_info = list(db.comments.find({"postid": idpost},{"_id": False}).sort("date", -1))
    for komen in komen_info:
        komen['user'] = db.users.find_one({"username": komen['username']},{"_id": False})
        date_string_komen = komen['date']
        date_object_komen = datetime.strptime(
            date_string_komen, "%Y-%m-%dT%H:%M:%S.%fZ")
        now = datetime.now()
        difference = now - date_object_komen
        seconds_difference = difference.total_seconds()- 25200
        minutes_difference = (seconds_difference / 60)
        hours_difference = (seconds_difference / 3600) 
        days_difference = (hours_difference / 24)

        if minutes_difference < 1:
            formatted_difference = "Just now"
        elif minutes_difference < 2:
            formatted_difference = "1 minute ago"
        elif minutes_difference < 60:
            formatted_difference = f"{int(minutes_difference)} minutes ago"
        elif hours_difference < 2:
            formatted_difference = "1 hour ago"
        elif hours_difference < 24:
            formatted_difference = f"{int(hours_difference)} hours ago"
        elif days_difference < 2:
            formatted_difference = "1 day ago"
        elif days_difference < 7:
            formatted_difference = f"{int(days_difference)} days ago"
        else:
            formatted_difference = date_object_komen.date().strftime("%d %B %Y")
        komen['timecom'] = formatted_difference

        print(komen_info)

    return jsonify({"result": "success", "msg": "Komentar berhasil dihapus!", "komen": komen_info})

@app.route("/update_comment", methods=["POST"])
def update_comment():
    token_receive = request.cookies.get("mytoken")
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        comment_id_receive = request.form["comment_id_give"]
        comment_receive = request.form["comment_give"]

        db.comments.update_one({"commentid": comment_id_receive}, {
                               "$set": {"comment": comment_receive}})
        return jsonify({"result": "success", "msg": "Komentar sukses diupdate!"})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))

@app.route("/update_like", methods=["POST"])
def update_like():
    token_receive = request.cookies.get("mytoken")
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        # We should change the like count for the post here
        user_info = db.users.find_one({"username": payload["id"]})
        post_id_receive = request.form["post_id_give"]
        type_receive = request.form["type_give"]
        action_receive = request.form["action_give"]
        # datapost = db.posts.find_one({'postid': post_id_receive})
        # date_receive = request.form["date_give"]
        doc = {
            "postid": post_id_receive,
            "username": user_info["username"],
            "type": type_receive,
        }

        if action_receive == "like":
            db.likes.insert_one(doc)
            # doc_notif = {
            # 'from': payload["id"],
            # 'to':datapost['username'],
            # 'type':'like',
            # 'toid': post_id_receive,
            # 'date': date_receive,
            # 'read': False,
            # 'isi': f'{payload["id"]} telah menyukai postinganmu yang berjudul'
            # }
            # db.notif.insert_one(doc_notif)
        else:
            db.likes.delete_one(doc)
            # db.notif.delete_one({'from':payload["id"], 'toid':post_id_receive})
        count = db.likes.count_documents(
            {"postid": post_id_receive, "type": type_receive}
        )

        return jsonify({"result": "success", "msg": "updated", "count": count})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))

@app.route('/deletecomment/<idcomment>', methods=['POST'])
def deletecomment(idcomment):
    db.comments.delete_one({"commentid": idcomment})
    return jsonify({"result": "success", "msg": "Komentar berhasil dihapus!"})

@app.route('/serviceworker', methods=["POST"])
def service_worker():
    response = app.send_static_file('static/js/service/sw.js')
    response.headers['Content-Type'] = 'application/javascript'
    print(response)
    return response
    

# =========== ADMIN ==============
@app.route('/upload_data', methods=["POST"])
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

        df = pd.read_excel(f'./static/assets/upload_data/{filenamefix}', sheet_name='Sheet1', decimal=',')
        
        listx0 = []
        listx1 = []
        listx2 = []
        listx3 = []
        listy = []
        list=[]
        for i in df.index:
            x0 = float(df["x0"][i])
            x1 = float(df["x1"][i])
            x2 = float(df["x2"][i])
            x3 = float(df["x3"][i])
            y = float(df["y"][i])
            listx0.append(x0)
            listx1.append(x1)
            listx2.append(x2)
            listx3.append(x3)
            listy.append(y)

            doc = {
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
    return jsonify({"result": "success", "msg": "File uploaded!"})

@app.route('/ambildata')
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

    return jsonify({"result": "success", "data": listdata, "dataminmax": data_minmax, "normaldata": listnormaldata})

@app.route('/deleteall', methods=["POST"])
def delall():
    db.datacurahhujan.delete_many({})
    db.dataminmax.delete_many({})
    return jsonify({"result": "success", "msg": "Deleted!"})

@app.route('/initpredict', methods=["POST"])
def initPredict():
    predictJST.JSTInitModel()
    return jsonify({"result": "success"})

@app.route('/predictUji', methods=["POST"])
def ujiPredict():
    hasil = predictFunction.predictUji()
    return jsonify({"result": "success", "hasil": hasil})

@app.route('/predictUjiBiner', methods=["POST"])
def ujiPredictBiner():
    predictJST.JSTUjiBiner()
    return jsonify({"result": "success"})

@app.route('/upload_input_data', methods=["POST"])
def upload_input():
    if "file_give" in request.files:
        time = datetime.now().strftime("%m%d%H%M%S")
        file = request.files["file_give"]
        filename = secure_filename(file.filename)
        extension = filename.split(".")[-1]
        filenamefix = f"datainput-{time}.{extension}"
        file.save("./static/assets/upload_data/" + filenamefix)

        dbuji.datainput.delete_many({})

        df = pd.read_excel(f'./static/assets/upload_data/{filenamefix}', sheet_name='Sheet1', decimal=',')
        
        listx0 = []
        listx1 = []
        listx2 = []
        listx3 = []
        listy = []
        list=[]
        for i in df.index:
            x0 = float(df["x0"][i])
            x1 = float(df["x1"][i])
            x2 = float(df["x2"][i])
            x3 = float(df["x3"][i])
            y = float(df["y"][i])
            listx0.append(x0)
            listx1.append(x1)
            listx2.append(x2)
            listx3.append(x3)
            listy.append(y)

            doc = {
                "x0": x0,
                "x1": x1,
                "x2": x2,
                "x3": x3,
                "y": y,
            }
            list.append(doc)
        dbuji.datainput.insert_many(list)
            
    return jsonify({"result": "success", "msg": "File uploaded!"})

@app.route('/get_user')
def get_user():
    datauser = list(db.users.find({'level':2}))
    for data in datauser:
        data["_id"] = str(data["_id"])
        data['count_post'] = db.posts.count_documents(
            {"username": data['username']})
    return jsonify({"result": "success", "msg":"berhasil", "data": datauser})

@app.route("/list_post")
def list_posts():
    posts = list(db.posts.find({'confirm': True},{'_id':False}).sort("date", -1).limit(20))

    return jsonify({"result": "success", "msg": "Successful fetched all posts", "posts": posts})