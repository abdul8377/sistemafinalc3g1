var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
const { data } = require('autoprefixer');

/* listar */
router.get('/', function(req, res, next) {
    dbConn.query('SELECT * FROM clientes ORDER BY id asc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err); 
            res.render('clients/index',{data:''});
        } else {
            res.render('clients/index',{data:rows});
        }

    });


//ver formulario agrgar*/    
});
router.get('/add', function(req, res, next) {    
    res.render('clients/add', {
        nombre: '',     
    })
})

// agregar en base de datos*/
router.post('/add', function(req, res, next) {    
    let nombre = req.body.nombre;
    let apellido = req.body.apellido;
    let dni = req.body.dni;
    let email = req.body.email;
    let direccion = req.body.direccion;
    let celular = req.body.celular;
    let errors = false;

    if(nombre.length === 0 || apellido.length === 0 || dni.length === 0 || direccion.length === 0 || email.length === 0 || celular.length === 0) {
        errors = true;
        req.flash('error', "Porfavor ingresa los datos");
        res.render('clients/add', {
            nombre: nombre,
            apellido: apellido,
            dni: dni,
            direccion: direccion,
            email:email,
            celular: celular
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            nombre: nombre,
            apellido: apellido,
            dni: dni,
            direccion: direccion,
            email: email,
            celular: celular

        }
        
        // insert query
        dbConn.query('INSERT INTO clientes SET ?', form_data, function(err, result) {
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('clients/add', {
                    name: form_data.nombre,
                    apellido: form_data.apellido,
                    dni: form_data.dni,
                    direccion: form_data.direccion,
                    email: form_data.email,
                    celular: form_data.celular                 
                })
            } else {                
                req.flash('success', 'client successfully added');
                res.redirect('/clients');
            }
        })
    }
})

//ver forumlario editar*/
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM clientes WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
        if (rows.length <= 0) {
            req.flash('error', 'Registro no encontrado with id = ' + id)
            res.redirect('/clients')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('clients/edit', {
                id: rows[0].id,
                nombre: rows[0].nombre,
                apellido: rows[0].apellido,
                dni: rows[0].dni,
                direccion: rows[0].direccion,
                email: rows[0].email,
                celular: rows[0].celular

            })
        }
    })
})

// actualizar formulario base datos*/
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let nombre = req.body.nombre;
    let apellido = req.body.apellido;
    let dni = req.body.dni;
    let direccion = req.body.direccion;
    let email = req.body.email;
    let celular = req.body.celular;

    let errors = false;

    if(nombre.length === 0 || apellido.length === 0 || dni.length === 0 || direccion.length === 0 || email.length === 0 || celular.length === 0) {
        errors = true;
        req.flash('error', "Porfavor ingresa todos los campos");
        res.render('clients/edit', {
            id: req.params.id,
            nombre: nombre,
            apellido: apellido,
            dni: dni,
            direccion: direccion,
            email: email,
            celular: celular
        })
    }

    if( !errors ) {   
 
        var form_data = {
            nombre: nombre,
            apellido: apellido,
            dni: dni,
            direccion: direccion,
            email: email,
            celular: celular
        }
        dbConn.query('UPDATE clientes SET ? WHERE id = ' + id, form_data, function(err, result) {
            if (err) {
                req.flash('error', err)
                res.render('clients/edit', {
                    id: req.params.id,
                    nombre: form_data.nombre,
                    apellido: form_data.apellido,
                    dni: form_data.dni,
                    direccion: form_data.direccion,
                    email: form_data.email,
                    celular: form_data.celular
                    
                })
            } else {
                req.flash('success', 'Registro actualizado');
                res.redirect('/clients');
            }
        })
    }
})


// eliminar regisrto base de datos*/
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM clientes WHERE id = ' + id, function(err, result) {
        if (err) {
            req.flash('error', err)
            res.redirect('/clients')
        } else {
            req.flash('success', 'Registro borrado correctamente!' + id)
            res.redirect('/clients')
        }
    })
})


module.exports = router;
