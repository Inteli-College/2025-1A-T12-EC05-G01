from flask import Flask, request, jsonify
from .Dobot.Dobot import Dobot

app_dobot = Flask(__name__)

dobot = None

@app_dobot.route("/dobot", methods=["GET"])
@app_dobot.route("/dobot/<port>", methods=["GET"])
def initiate_dobot ():
    dobot = Dobot()

@app_dobot.route("/dobot/home", methods=["POST"])
def move():
    data = request.json
    x = data.get("x")
    y = data.get("y")
    z = data.get("z")
    r = data.get("r")

    if None in (x, y, z, r):
        return jsonify({"error": "Missing parameters"}), 400

    dobot.move_to(x, y, z, r)
    return jsonify({"message": f"Moved to ({x}, {y}, {z})"}), 200

if __name__ == "__main__":
    app_dobot.run(host="0.0.0.0", port=5000, debug=True)