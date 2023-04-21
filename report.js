const mysql = require('mysql');
const ExcelJS = require('exceljs');

// Configurar la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sunedu'
});

// Consulta SQL para obtener los datos de la tabla
const sql = 'SELECT * FROM datos where json_data is not null';

// Crear un nuevo libro de Excel
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Datos');

// Realizar la consulta a la base de datos
connection.query(sql, (error, results, fields) => {
  if (error) {
    console.error(error);
    return;
  }

  // Escribir los encabezados de las columnas en la hoja de Excel
  const columnas = fields.map(field => field.name);
  let columns_json = JSON.parse(results[0].json_data);
  columns_json =  Object.keys(columns_json[0])
//   console.log(columns_json);
//   process.exit(0);
  worksheet.addRow([...columnas,...columns_json]);

  // Escribir los datos de la tabla en la hoja de Excel
  results.forEach(row => {
    // Procesar el JSON en la columna correspondiente
    if(row.json_data && row.json_data !='[]'){
        console.log('row_json_data:',row.json_data);
        try{
            const json = JSON.parse(row.json_data);
            let row_data = [row.dni, row.nombre, row.graduado, row.grado, row.institution];
            json.forEach(row_json=>{
                
                let columnasJson = [];
                Object.keys(row_json).forEach(column => {
                    columnasJson.push(row_json[column])
                })
                // Crear un nuevo arreglo con todas las columnas
                const columnas = [...row_data, ...columnasJson];
                // Agregar la fila a la hoja de Excel
                worksheet.addRow(columnas);
            })
        }catch(error){
console.log(row.id);
        }
       
    }
    
    
  });

  // Guardar el archivo de Excel
  workbook.xlsx.writeFile('datos.xlsx').then(() => {
    console.log('Archivo guardado exitosamente');
  });
});
