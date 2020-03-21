


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
//Entorno 
//====================

let urlDB;
if(process.env.NODE_ENV === 'dev') {
 urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://newwer:d0Jg8f9q1WHmN42J@cluster0-szetc.mongodb.net/cafe?retryWrites=true&w=majority'
}


process.env.URLDB = urlDB;

