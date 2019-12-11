const jwt = require ('jsonwebtoken');

//================
//Verificar Token
//================

const verificaToken = (req, res, next) => {

    //se busca el token en los Headers de la petición
    let token = req.get('token');

    //Para verificar el token y decodificar la información contenida en este
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            })
        }

        //Agregar al request el usuario valido que se ha logeado, como si fuera un PROPS
        req.usuario = decoded.usuario;
        next();
    })

}

//================
//Verificar admin role
//================

const verificaAdmin = (req, res, next) => {

    let usuario = req.usuario

    if (usuario.role === 'USER_ROLE') {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no tiene permisos de administrador'
            }
        })
    }

    next();

}

module.exports = {
    verificaToken,
    verificaAdmin
}