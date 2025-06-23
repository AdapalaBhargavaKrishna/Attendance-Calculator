import { Builder, By, Key, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { path as chromedriverPath } from 'chromedriver';

export async function getAttendanceData(userpass) {
  let driver;
  try {
    userpass += "P";

    let options = new chrome.Options();
    options.addArguments("--headless=new");
    options.addArguments("--disable-gpu");
    options.addArguments("--window-size=1920,1080");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");

    // ✅ FIX HERE — remove `.build()`
    const service = new chrome.ServiceBuilder(chromedriverPath);

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .setChromeService(service)  // ✅ pass the ServiceBuilder directly
      .build();

    await driver.get("https://erp.cbit.org.in/Login.aspx");

    let username = await driver.wait(until.elementLocated(By.id("txtUserName")), 4000);
    await username.clear();
    await username.sendKeys(userpass, Key.RETURN);

    let password = await driver.wait(until.elementLocated(By.id("txtPassword")), 4000);
    await password.clear();
    await password.sendKeys(userpass, Key.RETURN);

    let stdDashboard = await driver.wait(until.elementLocated(By.id("ctl00_cpStud_lnkStudentMain")), 4000);
    await stdDashboard.click();

    let table = await driver.wait(until.elementLocated(By.id("ctl00_cpStud_grdSubject")), 4000);
    let headers = await table.findElements(By.tagName("th"));
    headers = await Promise.all(headers.map(async h => (await h.getText()).trim()));

    let rows = await table.findElements(By.tagName("tr"));
    let data = [];
    for (let i = 1; i < rows.length; i++) {
      let cells = await rows[i].findElements(By.tagName("td"));
      if (cells.length > 0) {
        let rowData = {};
        for (let j = 0; j < cells.length; j++) {
          rowData[headers[j]] = (await cells[j].getText()).trim();
        }
        data.push(rowData);
      }
    }

    return data;
  } catch (e) {
    return { error: e.message };
  } finally {
    if (driver) await driver.quit();
  }
}
