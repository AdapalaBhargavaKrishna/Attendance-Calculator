from flask import Flask, render_template
app = Flask(__name__)

@app.route("/")
def hello_world():
    return render_template('index.html')

@app.route("/p")
def products():
    return "<p>Hello Products!</p>"

if __name__ == "__main__" :
    app.run(debug=True) 