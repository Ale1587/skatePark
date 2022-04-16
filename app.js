// importaciones
const express = require('express')
const app = express()
const exphbs = require('express-handlebars');
const expressFileUpload = require('express-fileupload');
const bodyParser = require('body-parser')
const { newUser, getSkaters, editSkater, deleteSkater, setUserStatus } = require('./db/query');
const { key } = require('./config/index')
const jwt = require('jsonwebtoken')
const routes = require('./')
// const fs = require('fs')
// const path = '/public/assets/img'

// servidor puerto 8080
app.listen(8080, () => console.log('Server on'))

//middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(
    expressFileUpload({
        limits: { fileSize: 5000000 },
        abortOnLimit: true,
        responseOnLimit: 'El peso de la imagen que intentas subir supera el limite permitido'
    })
)
app.use(express.static(__dirname + '/public'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'))

app.set('view engine', 'handlebars')
app.engine(
    'handlebars',
    exphbs.engine({
        defaultLayout: 'main',
        layoutsDir: __dirname + '/views/mainLayout'
    })
)

// rutas Api renderización vistas 

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/signup', (req, res) => {
    res.render('signUp')
})

app.get('/signin', (req, res) => {
    res.render('signIn')
})

app.get('/dashboard', (req, res) => {
    res.render('dashboard')
})

app.get('/admin', async (req, res) => {

    try {
        const users = await getSkaters()
        res.render('admin', {users})
    } catch (err) {
        res.status(500).send({
            error: `algo salió mal ... ${err}`,
            code: 500
        })
    }
    
})

// función
const createToken = (payload) => {

    const token = jwt.sign(
        {
            exp: Math.floor(Date.now() / 1000) + 1800,
            data: payload
        },
        key
    )
    return token
}

// rutas api
app.get('/skaters', async (resq, res) => {

    const respuesta = await getSkaters();
    res.send(respuesta)

})

app.post('/skaters', async (req, res) => {

    const { nombre } = req.body;
    const { foto } = req.files;

    const photo = `${nombre}.jpg`
    foto.mv(`${__dirname}/public/assets/img/${photo}`, (err) => {
        if (err) {
            return res.status(500).send({ message: err })
        }
    })

    try {
        const user = await newUser(req.body, photo)
        return res.send(user)
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            error: `Algo salio mal ... ${error}`,
            code: 500
        })
    }

})

app.post('/signin', async (req, res) => {

    // 1. recibir datos del formulario
    const payload = req.body

    // 2. si hay datos 
    if (payload) {

        // 3. consulta  a la base de datos del
        const { email, password } = payload
        const userSkater = await getSkaters()

        // 4. consulta si existe el mail
        const skater = userSkater.find(e => e.email === email && e.password === password)

        // 5. si existe usuario
        if (skater) {

                const token = createToken(payload)
                res.status(200).send(JSON.stringify(token))
            }
            else {
                res.send( 'Clave incorrecta o email incorrecto o no registrado' )
            }
    }

})

app.post('/validation', (req, res) => {
    const {token} = req.body
        if(token){
            console.log(token);
            jwt.verify(token, key, async (err,data) =>{
                if(err){
                    res.send({err: 401, message:'Usuario no autorizado'})
                } else{
                    const skaterInfo = {
                        email: data.data.email,
                        password: data.data.password
                    }
                    const user = await getSkaters()
                    const skater = user.find(e => e.email === skaterInfo.email)
                    const new_token = createToken(skaterInfo)
                    const newSkaterInfo = {
                        email: skater.email,
                        nombre: skater.nombre,
                        password: skater.password,
                        experiencia: skater.anos_experiencia,
                        especialidad: skater.especialidad,
                        token: new_token
                    }

                    res.send(newSkaterInfo)
                }
            })
        }
        
})
app.put('/skater', async (req, res) =>{
    const response = await editSkater(req.body)
    res.send(response)
})

app.delete('/skater', async (req, res) => {
    const response = await deleteSkater(req.body)
    response > 0 
    ? res.send(`La cuenta fue elimminado con exito`)
    : res.send(`Ha ocurrido un error intentelo nuevamete más tarde`)
})

app.put('/skaters', async (req, res) =>{
    console.log(req.body);
    const { estado, id } = req.body

    try {
        const user = await setUserStatus(estado, id)
        res.status(200).send(JSON.stringify(user))
    } catch (err) {
        res.status(500).send({ 
            error:`Algo salio mal ... ${err}`,
            code:500
        })
    }
})

