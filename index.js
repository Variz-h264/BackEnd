require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const cors = require('cors');
// const bodyParser = require('body-parser')
const settingRouter = require('./service/api/V1/setting');
const apikeyRouter = require('./service/api/V1/apikey');
const { checkAuthorization } = require('./Middleware/checkAuthorization');

const allowedOrigins = [
  'http://localhost:3000', // เพิ่ม URL ที่ต้องการให้สามารถเข้าถึง API ได้
  'http://localhost:3001',
  'http://localhost:5173',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('ไม่ได้รับอนุญาตให้เข้าถึง API'));
    }
  }
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json())
app.use(cors(corsOptions));

app.get('/', async (req, res) => {
    res.sendFile(__dirname + '/views/home.html');
});
app.get('/getapi', async (req, res) => {
    res.sendFile(__dirname + '/views/getapikey.html');
});

// เส้นทางอื่น ๆ ของ API ที่ใช้ connection ต่อฐานข้อมูลเช่นเดียวกัน

app.use('/v1/apiKeys', apikeyRouter);
app.use('/v1/setting', checkAuthorization, settingRouter);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}/`);
});
