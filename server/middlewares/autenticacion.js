const jwt = require('jsonwebtoken');

//============================
// Middleware - Verifica Token
//============================

let verificaToken = (req, res, next) => {

    let token = req.get('token')//o autoritation

    jwt.verify(token, process.env.SEED, (err,decoded) => {
        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'El token es invalido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    })
    

};


//==============================
// Middleware - Verifica AdminROl
//==============================
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if(usuario.role === 'ADMIN_ROLE'){
        next();
    }else{
          return res.json({
            ok:false,
            err: {
                message: 'El usuario no es Admin'
            }
        });
    }

};

module.exports = {
    verificaToken,
    verificaAdmin_Role
}