import express from "express"
import 'dotenv/config'
import axios from 'axios';
import { load } from 'cheerio'
import { ToadScheduler, SimpleIntervalJob, Task } from "toad-scheduler"
import fs from "fs"
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3500
console.log(process.env.NODE_ENV)

const extractData = (data) => {
    const parts = data.trim().split(/\s+/);
    const date = parts[0];
    const time = parts[1];
    const latitude = parts[2];
    const longitude = parts[3];
    const depth = parts[4];
    const magnitude = parts[6];
    let location;
    if(parts[parts.length - 3].includes("REVIZE")) {
        location = parts.slice(8, -3).join(' ');
    } else {
        location = parts.slice(8, -1).join(' ');
    }
    return {
        date,
        time,
        latitude,
        longitude,
        depth,
        magnitude,
        location
    };
};

const getEarthquakes = async () => {
    try {
        const response = await axios.get("http://www.koeri.boun.edu.tr/scripts/lst6.asp");
        const html = response.data;
        const $ = load(html);

        const element = $('pre');
        const dataArray = element.html().trim().split("\n");
        dataArray.splice(0, 6);
        const extractedData = dataArray.map((data) => extractData(data));
        //return JSON.stringify(extractedData, null, 2);
        return extractedData
    } catch (error) {
        console.error('Error fetching the page');
        return null;
    }
};

const updateTodayFile = async () => {
    console.log("Updating today.json")
    const data = await getEarthquakes()
    if(data) {
        fs.writeFile("today.json", JSON.stringify(data, null, 2), (err) => {
            if (err) {
                console.error('Dosya güncelleme hatasi:', err);
            } else {
                console.log('Dosya başariyla güncellendi.');
            }
        });
    } else {
        console.log('Dosya güncelleme hatasi: gelen data boş')
    }
}

const scheduler = new ToadScheduler()
const task = new Task('simple task', updateTodayFile)
const job = new SimpleIntervalJob({ seconds: 60 * 10 }, task)
scheduler.addSimpleIntervalJob(job)

app.use(cors({
    //credentials: true,
    origin: ["http://localhost:5173","https://depremler-app.onrender.com/"]
}))
app.use(cors())

app.get('/today', async (req, res) => {
    const data = await getEarthquakes()
    if (data) {
        console.log("Data send succesfully")
        return res.json(data)
    }
    return res.status(404).send("Failed to get data")
})

app.get('/todaybackup', async (req, res) => {
    fs.readFile('today.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Dosya okuma hatasi');
            return res.send("Failed to get backup data")
        }
        try {
            const jsonData = JSON.parse(data);
            console.log("Backup data send succesfully")
            return res.json(jsonData)
        } catch (error) {
            console.error('JSON verisi ayrıştırma hatası:', error);
        }
    });
})

app.get('/updateToday', (req, res) => {
    updateTodayFile()
    res.send("UPDATED")
})

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})