var express = require('express');
var app = express();
var mongoose = require('mongoose');
var hbs = require('express-handlebars');
var session = require('express-session');
app.use(session({secret: 'fds8yksahfkj2389kjfhsdfsdf'}));
mongoose.Promise = global.Promise;
app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');

async function conectar() {
    await mongoose.connect(
            'mongodb://localhost:27017', 
            {useNewUrlParser: true}
    )
    console.log('Conectado!');
}
conectar();
const EstadoSchema = mongoose.Schema({
    nombre: String,
    apellido: String,
    estado: String,
    description: String
    

})
const EstadoModel = mongoose.model('Estados',EstadoSchema);
app.use(express.urlencoded({extended: true}));
app.get('/alta', function(req, res){
    res.render('alta');
});
app.post('/alta', async function(req, res) {

    if (req.body.nombre=='') {
        res.render('alta', {
            error: 'El Nombre es obligatorio',
            datos: {
                nombre: req.body.nombre,
                apellido: req.body.apellido
                
            }
        });
        return;
    }
        await EstadoModel.create({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        description: req.body.description,
        estado: req.body.estado
    });
    res.redirect('/listado');
});
app.get('/listado', async function(req, res) {
    var abc = await EstadoModel.find().lean();
    res.render('listado', {listado: abc});
});

app.get('/borrar/:id', async function(req, res) {
    await EstadoModel.findByIdAndRemove(
        {_id: req.params.id}
    );
    res.redirect('/listado');
});

app.get('/editar/:id', async function(req, res) {
    var artista = await EstadoModel.findById({
        _id: req.params.id
    }).lean();
    res.render('alta', {datos:artista});
});
app.post('/editar/:id', async function(req, res) {
    if (req.body.nombre=='') {
        res.redirect('/alta', {
            error: 'El nombre es obligatorio',
            datos: {
                nombre: req.body.nombre,
                apellido: req.body.apellido
            }
        });
        return;
    }
    await EstadoModel.findByIdAndUpdate(
        {_id: req.params.id},
        {
            nombre: req.body.nombre, 
            apellido: req.body.apellido,
            description: req.body.description,
            estado: req.body.estado
        }
    );
    res.redirect('/listado');
});
app.listen(80, function() {
    console.log('App en localhost');
});