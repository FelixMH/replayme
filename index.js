var express = require('express'); //importamos la libreria de express
var app = express(); //invocamos la funcion express de la libreria.
var path = require('path'); // concatena una cantidad de elementos, hacia la ruta que vamos a ir.
var fs = require('fs');
//llamamos a la libreria mediaserver
var mediaserver = require('mediaserver');
//importamos a multer
var multer = require('multer');

const port = process.env.PORT || 3000;

var opcionesMulter = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.join(__dirname,'canciones'));
    },
    filename: function(req,file,cb){
        cb(null,file.originalname);
    }
});

var upload = multer({storage: opcionesMulter});

app.use(express.static('public'));
app.use("/jquery",express.static(path.join(__dirname,'node_modules','jquery','dist')));
app.use("/css",express.static(path.join(__dirname,'public','css')));

app.get('/', function(req,res){
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get('/canciones',function(req,res){
    fs.readFile(path.join(__dirname,'canciones.json'),'utf8',function(err,canciones){
        if(err) throw err;
        res.json(JSON.parse(canciones));
    });
});

app.get('/canciones/:nombre',function(req,res){
    var cancion = path.join(__dirname,'/canciones',req.params.nombre);
    mediaserver.pipe(req,res,cancion);
});

app.post('/canciones',upload.single('cancion'),function(req,res){
    var archivoCanciones = path.join(__dirname,'canciones.json');
    var nombre = req.file.originalname;
    fs.readFile(path.join(__dirname,'canciones.json'),'utf8',function(err,archivo){
        if(err) throw err;
        var canciones = JSON.parse(archivo);
        canciones.push({nombre: nombre});
        
        fs.writeFile(archivoCanciones,JSON.stringify(canciones),function(err){
            if(err) throw err;
            
            res.sendFile(path.join(__dirname, "index.html"));
        });
        
    });
});

//llamamos a express y decimos que se ejecute en el puerto 3000
app.listen(port, function(){
  console.log('Aplicacion corriendo'); //imprimimos un mensaje en la consola
});
