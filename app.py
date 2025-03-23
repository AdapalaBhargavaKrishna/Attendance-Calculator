from flask import Flask, jsonify, render_template, request
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import json
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')  

def get_table_data(userpass):
    userpass += "P"  

    chrome_options = Options()
    chrome_options.add_argument("--headless")  
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")

    user_data_dir = "/tmp/chrome-user-data"
    if not os.path.exists(user_data_dir):
        os.makedirs(user_data_dir)
    chrome_options.add_argument(f"--user-data-dir={user_data_dir}")

    driver = webdriver.Chrome(options=chrome_options)
    driver.get("https://erp.cbit.org.in/Login.aspx")

    wait = WebDriverWait(driver, 4)
    username = wait.until(EC.presence_of_element_located((By.ID, "txtUserName")))
    username.clear()
    username.send_keys(userpass)
    username.send_keys(Keys.RETURN)

    password = wait.until(EC.presence_of_element_located((By.ID, "txtPassword")))
    password.clear()
    password.send_keys(userpass)
    password.send_keys(Keys.RETURN)

    stdDashboard = wait.until(EC.element_to_be_clickable((By.ID, "ctl00_cpStud_lnkStudentMain")))
    stdDashboard.click()

    table = wait.until(EC.presence_of_element_located((By.ID, "ctl00_cpStud_grdSubject")))
    headers = [header.text.strip() for header in table.find_elements(By.TAG_NAME, "th")]

    data = []
    rows = table.find_elements(By.TAG_NAME, "tr")
    for row in rows[1:]:
        cells = row.find_elements(By.TAG_NAME, "td")
        if len(cells) > 0:
            row_data = {headers[i]: cells[i].text.strip() for i in range(len(cells))}
            data.append(row_data)

    driver.quit()
    return json.dumps(data, indent=4)

@app.route('/get_data', methods=['POST'])
def fetch_data():
    roll_number = request.json['username'] 
    json_data = get_table_data(roll_number)
    return jsonify(json.loads(json_data))

if __name__ == '__main__':
    app.run(debug=True)
