


//====================
//Puerto
//====================

process.env.PORT = process.env.PORT || 3000;




//====================
//Entorno 
//====================
    //esto nos sirve para saber si estoy en produccion o en desarrollo (env = enviroment)
    //si la variable no existe supongo q estoy en desarrollo
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';



//====================
// Vencimiento del Token
//====================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias 
process.env.CADUCIDAD_TOKEN = '48h';



//====================
//SEED de autenticacion 
//====================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'







//====================
//Entorno 
//====================

let urlDB;
if(process.env.NODE_ENV === 'dev') {
 urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}


process.env.URLDB = urlDB;


//====================
//Google Client ID
//====================
process.env.CLIENT_ID = process.env.CLIENT_ID || '720299331312-valsp27ahrs3vk8h55vinlgvdn67jovl.apps.googleusercontent.com'



