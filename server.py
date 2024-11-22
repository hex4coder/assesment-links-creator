# server untuk upload link ke s.id

print("S.ID Link Generator v1.0")

import http.client
import json


from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/", methods=['POST'])
def generate_link():
    if request.method == 'POST':
        long_link = request.json["long_url"]

        if len(long_link) > 18:
            conn = http.client.HTTPSConnection("api.s.id")
            payload = json.dumps({
                "long_url": long_link
            })
            headers = {
            'X-Auth-Id': '673fab16a8bbee4492c2b917',
            'X-Auth-Key': 'cm3ruiwav000701n4l48xvf96.BCCmRwmqFX7mJcOT5Okc8AmoSqP9RK1z',
            'Content-Type': 'application/json'
            }
            conn.request("POST", "/v1/links", payload, headers)
            res = conn.getresponse()
            data = res.read()
            data = data.decode('utf-8')
            data = json.loads(data)
            dataRet = {
                "code": 200,
                "short": 'https://s.id/' + data['data']['short']
            }
        else:
            dataRet = {
                "code": 200,
                "short": long_link
            }
        return dataRet