var express = require('express');
const cors = require('cors');
const https = require('https');
const ejs = require('ejs');
const localStorage = require("localStorage");
const fs = require('fs');
const axios = require('axios');

var app = express();


app.set('view engine', 'ejs')
app.use(express.static('dist'));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
  app.use(cors());
  next();
});

app.get('/set', (req, res) => {
  localStorage.setItem("access_token", 'EwA4A61DBAAUorz77FfV/edREmvlTq6cECb8X/8AAalkVhBBXKW2wVfbWZOcHeUV63ecSJwCAw4CPfUqAvUhEHEcmvZlM4SvlTPT5T1Pn4CDG/SI3MdLS2pgGQzHQMeLPwfOowqEhjNB2I/CCXxbpWL7x60F1RBdbPZCwYjlV/3Tce2+ortIkiapDbQM5Vqffx22MnfMDBVwa+aztuKy0Rj4YLwtpbHqawkodUY64glKuRg/SER5TSNe/ko7mFKiJMq6VCZn+LQ7KZAxdO/LTazAX3kbAM7v5eDTZN1+dqnWEaS7t0ONNnslm1SnXwBvOSPIibnZVHwJQn6BGLl4JXlZDXR4AoXDSboFtGY1ttwJN9bPbKhSOilURkbHs3kDZgAACBaknQAEiMjmCALbeIdq7SegTDOSR+XG5flnwJ5ixkwraq4W1vZ1Al2fOFtJqPu4PvGpienaUT5rgMLda6FoV4yL0phM0HbZgZjTqFhC58Cern35ozyeDVlgU2qXQYzU1Xm1XS5DjCNS1rl8UojzDy6u01iKJfv4R52D31a+2cM7zrN9BOiMbbJ5UdnER2CdlLnPagdLKrnjnqghVHnymR9hi/sBF38Qyj9nybBANsS607yazwMAwgJagqcFWzowInLhF9fU+PfZY7PZtqOmRrQLJPm8GbRSQEYWN28SUbzBD8y1MH9STtqxRy/M+WFEubYj9QpN+WQmrdatJExRWMO+rQst+muU2w4ZrsaWknD5HPqJUcxaiAKGu3bT4As8t5zuNgRQsUsrvV/MlJOh0Hhk1RO5bwOtlhK1Q/Ruklb3jB2avv2zzZi4p026w6ZOPGXYfW6yp3RT6wHzw8q90SCSVxCA/rhMq6SJlottVLPHC5mJdlmUMECle4qJ3PvJhFAQkrcTCLmrEf1isvKKZLubz3t4N1YIMPocLK0FeAl6Yxzg+bhbccVe3sfa4NhT6ZbetXfaDVNq/YHFQW198Ok5bHVh48L4dZs+PHU3TyEvMciTGoCk3Bs+yzs7vPDvbnlJqcjM96kxttObccYS500xV20Sl+arUBVH0BRS0X0Zoqzw+PK0bVaFOP4XnEXZx5zpSwI=');
  res.render('main', { hastoken: true });
});

app.get('/logoff', (req, res) => {
  localStorage.setItem("access_token", '');
  res.render('main', { hastoken: false });
});

app.get('/', function (req, res) {
  let hastoken = localStorage.getItem("access_token") ? true : false;
  console.log(localStorage.getItem("access_token"));
  res.render('main', { hastoken: hastoken });
});

app.get('/callback', async function (req, res) {
  let result = '';
  console.log('code:', res.req.query.code);
  if (res.req.query.code) {
    let authCode = res.req.query.code;
    result = await starter(authCode);
    console.log('result', result);
    localStorage.setItem("access_token", result.access_token);
  }
  res.render('main', { hastoken: true });
});

app.get('/listdrive', (req, res) => {
  var options = {
    hostname: 'graph.microsoft.com',
    port: 443,
    path: '/v1.0/me/drive/root:/1001-2000.zip:/content',
    method: 'GET',
    headers: {
      'Authorization': 'bearer EwA4A61DBAAUorz77FfV/edREmvlTq6cECb8X/8AAalkVhBBXKW2wVfbWZOcHeUV63ecSJwCAw4CPfUqAvUhEHEcmvZlM4SvlTPT5T1Pn4CDG/SI3MdLS2pgGQzHQMeLPwfOowqEhjNB2I/CCXxbpWL7x60F1RBdbPZCwYjlV/3Tce2+ortIkiapDbQM5Vqffx22MnfMDBVwa+aztuKy0Rj4YLwtpbHqawkodUY64glKuRg/SER5TSNe/ko7mFKiJMq6VCZn+LQ7KZAxdO/LTazAX3kbAM7v5eDTZN1+dqnWEaS7t0ONNnslm1SnXwBvOSPIibnZVHwJQn6BGLl4JXlZDXR4AoXDSboFtGY1ttwJN9bPbKhSOilURkbHs3kDZgAACBaknQAEiMjmCALbeIdq7SegTDOSR+XG5flnwJ5ixkwraq4W1vZ1Al2fOFtJqPu4PvGpienaUT5rgMLda6FoV4yL0phM0HbZgZjTqFhC58Cern35ozyeDVlgU2qXQYzU1Xm1XS5DjCNS1rl8UojzDy6u01iKJfv4R52D31a+2cM7zrN9BOiMbbJ5UdnER2CdlLnPagdLKrnjnqghVHnymR9hi/sBF38Qyj9nybBANsS607yazwMAwgJagqcFWzowInLhF9fU+PfZY7PZtqOmRrQLJPm8GbRSQEYWN28SUbzBD8y1MH9STtqxRy/M+WFEubYj9QpN+WQmrdatJExRWMO+rQst+muU2w4ZrsaWknD5HPqJUcxaiAKGu3bT4As8t5zuNgRQsUsrvV/MlJOh0Hhk1RO5bwOtlhK1Q/Ruklb3jB2avv2zzZi4p026w6ZOPGXYfW6yp3RT6wHzw8q90SCSVxCA/rhMq6SJlottVLPHC5mJdlmUMECle4qJ3PvJhFAQkrcTCLmrEf1isvKKZLubz3t4N1YIMPocLK0FeAl6Yxzg+bhbccVe3sfa4NhT6ZbetXfaDVNq/YHFQW198Ok5bHVh48L4dZs+PHU3TyEvMciTGoCk3Bs+yzs7vPDvbnlJqcjM96kxttObccYS500xV20Sl+arUBVH0BRS0X0Zoqzw+PK0bVaFOP4XnEXZx5zpSwI='
    }
  };
  let data = [];
  var req = https.request(options, (res) => {
    console.log('statusCode:', res.statusCode);
    res.on('data', (d) => {
      data.push(d);
    });
    res.on('end', () => {
      let b = Buffer.concat(data)
      fs.writeFile("./test.txt", b, "binary", function (err) { });
    });
  });

  req.on('error', (e) => {
    console.log(e);
  });

  req.write('');
  req.end();

  res.render('main', { hastoken: true });
});

async function starter(authCode) {
  let opt = {
    client_id: '481a3ba2-ee66-441d-a429-801c4e228d33',
    client_secret: '3766b2fe-a415-4779-978c-b22fc5d3249d',
    grant_type: 'authorization_code',
    code: authCode,
    redirect_uri: 'http://localhost:3000/callback'
  }
  return new Promise(function (resolve, reject) {
    var postData = "client_id=481a3ba2-ee66-441d-a429-801c4e228d33&grant_type=authorization_code&code=" + authCode + '&redirect_uri=http://localhost:3000/callback'
    var options = {
      hostname: 'login.live.com',
      port: 443,
      path: '/oauth20_token.srf',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      }
    };
    let data = [];
    var req = https.request(options, (res) => {
      console.log('statusCode:', res.statusCode);
      res.on('data', (d) => {
        data.push(d);
      });
      res.on('end', () => {
        resolve(JSON.parse(Buffer.concat(data).toString()));
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();

  });

}

const httpsGet = (url,token,type) => {
  return new Promise((resolve, reject) => {
    https.get(url,{headers:{'Authorization':`Bearer ${token}`}}, res => {
      if(type=='text')res.setEncoding('utf8');
      const body = [];
      res.on('data', chunk => body.push(chunk));
      res.on('end', () => {
        if(type=='text')
          resolve(body.join(''))
        else if(type=='binary')
          resolve(Buffer.concat(body))
        else if(type=='json')
          resolve(JSON.parse(body.join('')))
      });
    }).on('error', reject);
  });
};

app.get('/download', async (req, res) => {
  let token = localStorage.getItem('access_token')
  try{
    let body = await httpsGet('https://api.onedrive.com/v1.0/drive/special/approot:/1001-2000.zip',token,'json');
    let respUrl = body["@content.downloadUrl"]
    let buffer = await httpsGet(respUrl,token,'binary');
    let name = body["name"]
    fs.writeFile(name, buffer, "binary", function (err) { });
  } catch(err){
    console.log('erro',err);
  }
  res.render('main', { hastoken: true });
});

app.listen(3000);
