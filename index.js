const mysql = require('mysql');
const axios = require('axios');

// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sunedu'
});

// Hacemos la conexión a MySQL
connection.connect();

// Consultamos los datos de una tabla
const query = 'SELECT id, LPAD(dni, 8, \'0\') as dni FROM datos where length(dni)<8';

 connection.query(query, async (error, results) => {
  if (error) {
    throw error;
  }
  for (const element of results) {

    let data = 'doc=' + element.dni + '&opcion=PUB&_token=SrP8n03VtuwbBlV38nI7qSLTfjjHgfo5RVHeoWGS&icono=&captcha=3WSXY';

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://constancias.sunedu.gob.pe/consulta',
      headers: {
        'authority': 'constancias.sunedu.gob.pe',
        'accept': 'application/json, text/javascript, */*; q=0.01',
        'accept-language': 'es-US,es-419;q=0.9,es;q=0.8,en;q=0.7',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'cookie': '_ga_K4H31ZE995=GS1.1.1682113475.1.0.1682113475.0.0.0; PHPSESSID=1ieuoggj3ikedt03uikp0e07k4; _ga=GA1.3.1358259036.1682113475; _gid=GA1.3.182963769.1682113498; ccsu=MDr5IC1MWW2LKxzG2CoD3nInawmd7IVEyS2Licuz7p8%3D; laravel_session=eyJpdiI6ImJLd1FcL1F1K0ptUUFxNTNMcTB0MUt3PT0iLCJ2YWx1ZSI6InBocHVvQjVIaXJOR3lcL2pRU3NcL1FOUElDcTlyZ3BNQ3A0UEVLZFVNZ3RYVjcramRLT1ZlNEZxYjlZV2RETnVRWnNLR0tBaDFmbllEMTQ4UUdJbXl5bGc9PSIsIm1hYyI6IjFmMDQyNzE3NjUxNDdjNWMwZTVmODBkMmFmY2U0Zjc2NjVmNWUxNzdjZDI5OGNlYzEzNjk2NjYxYTFmYWQ0NzcifQ%3D%3D; laravel_session=eyJpdiI6IlJ1dEN1U3dcL1lIQzFIVWZnY3I5U3dRPT0iLCJ2YWx1ZSI6IndCNHJLdUFOTHhZdWJ2d2FxbHo2UzM3SUxIOEpYSkFwWjBWZ2loTzNBcnJrb3pDVnlLbTVqamxyMG0rY2VqR2hYOVp2N1BqUnVzdnYwMExzTDFpQnJ3PT0iLCJtYWMiOiJjMzExYzg1ZTQ3Mjg2MGRjYWZiYjkyMTU4ZDg0MjM1ZTNlZTAyMDY2NGY5MjMxNWY1ODY5ZDZhY2NmZWJhNjdhIn0%3D',
        'origin': 'https://constancias.sunedu.gob.pe',
        'referer': 'https://constancias.sunedu.gob.pe/verificainscrito',
        'sec-ch-ua': '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
        'x-requested-with': 'XMLHttpRequest'
      },
      data: data
    };

    await axios.request(config)
        .then((response) => {
          console.log('respuesta:', response.data);
          const insertQuery = "update datos set json_data= '" +response.data.replace("'","") + "' where id = " + element.id;
          console.log(insertQuery);
          connection.query(insertQuery, [], (error, results) => {
            if (error) {
              console.log('error comilla')
            }
            console.log('Resultados guardados en MySQL');
          });
        })
        .catch((error) => {
          console.log(error);
        });
  }
});