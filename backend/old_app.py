from flask import Flask, request, jsonify
import cv2
import numpy as np
from plantcv import plantcv as pcv
from flask_cors import CORS
import base64

app = Flask(__name__)
CORS(app)

class Options:
    def __init__(self):
        self.debug = "print"
        self.writeimg = False
        self.result = "results.json"
        self.outdir = None 

args = Options()
pcv.params.debug = args.debug

@app.route("/")
def index():
    print("\nHome Page\n")
    return "<h1> Tree Growth Detection </h1>"

@app.route("/detect_growth", methods=["POST"])
def detect_growth():
    try:
        if 'file1' not in request.files or 'file2' not in request.files:
            return jsonify({"error": "Please provide 'file1' and 'file2' in the request."})

        file1 = request.files['file1']
        file2 = request.files['file2']

        # Reading the images
        img1 = cv2.imdecode(np.frombuffer(file1.read(), np.uint8), cv2.IMREAD_COLOR)
        img2 = cv2.imdecode(np.frombuffer(file2.read(), np.uint8), cv2.IMREAD_COLOR)

        img2 = cv2.resize(img2, (img1.shape[1], img1.shape[0]))

        # Masking the 1st image
        s1 = pcv.rgb2gray_hsv(rgb_img=img1, channel='s')
        s_thresh1 = pcv.threshold.binary(gray_img=s1, threshold=85, max_value=255, object_type='light')
        s_mblur1 = pcv.median_blur(gray_img=s_thresh1, ksize=5)
        b1 = pcv.rgb2gray_lab(rgb_img=img1, channel='b')
        b_thresh1 = pcv.threshold.binary(gray_img=b1, threshold=160, max_value=255, object_type='light')
        bs1 = pcv.logical_or(bin_img1=s_mblur1, bin_img2=b_thresh1)
        masked1 = pcv.apply_mask(img=img1, mask=bs1, mask_color='white')
        masked1_a = pcv.rgb2gray_lab(rgb_img=masked1, channel='a')
        maskeda_thresh1 = pcv.threshold.binary(gray_img=masked1_a, threshold=115, max_value=255, object_type='dark')

        # Masking the 2nd image
        s2 = pcv.rgb2gray_hsv(rgb_img=img2, channel='s')
        s_thresh2 = pcv.threshold.binary(gray_img=s2, threshold=85, max_value=255, object_type='light')
        s_mblur2 = pcv.median_blur(gray_img=s_thresh2, ksize=5)
        b2 = pcv.rgb2gray_lab(rgb_img=img2, channel='b')
        b_thresh2 = pcv.threshold.binary(gray_img=b2, threshold=160, max_value=255, object_type='light')
        bs2 = pcv.logical_or(bin_img1=s_mblur2, bin_img2=b_thresh2)
        masked2 = pcv.apply_mask(img=img2, mask=bs2, mask_color='white')
        masked2_a = pcv.rgb2gray_lab(rgb_img=masked2, channel='a')
        maskeda_thresh2 = pcv.threshold.binary(gray_img=masked2_a, threshold=115, max_value=255, object_type='dark')

        # Finding MSE and DIFF
        mse_val, diff = mse(maskeda_thresh1, maskeda_thresh2)

        # Tracking growth
        growth_threshold = 0.045
        growth_detected = mse_val > growth_threshold
        result = {
            "mse": mse_val,
            "growth_detected": str(growth_detected),
            "maskeda_thresh1": array_to_base64(maskeda_thresh1),
            "maskeda_thresh2": array_to_base64(maskeda_thresh2),
            "diff": array_to_base64(diff)
        }
        # print(f"\n\nRESULT {result} \n\n")
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)})

def array_to_base64(arr):
    _, img_encoded = cv2.imencode('.png', arr)
    img_base64 = base64.b64encode(img_encoded).decode('utf-8')
    return img_base64


def mse(img1, img2):
    h, w = img2.shape
    diff = cv2.subtract(img2, img1)
    err = np.sum(diff**2)
    mse_val = err / (float(h*w))
    print("MSE:", mse_val)
    return mse_val, diff


if __name__ == "__main__":
    app.run(debug=True, port=8001)