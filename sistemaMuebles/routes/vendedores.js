var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
const { data } = require('autoprefixer');

/* listar */
router.get('/', function(req, res, next) {
    dbConn.query('SELECT * FROM vendedores ORDER BY id asc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err); 
            res.render('vendedores/index',{data:''});
        } else {
            res.render('vendedores/index',{data:rows});
        }

    });


//ver formulario agrgar*/    
});
router.get('/add', function(req, res, next) {    
    res.render('vendedores/add', {
        nombre: '',     
    })
})

// agregar en base de datos*/
router.post('/add', function(req, res, next) {  
    let nombres = req.body.nombres;
    let apellidos = req.body.apellidos;
    let dni = req.body.dni;
    let celular = req.body.celular;
    let direccion = req.body.direccion;
    let email = req.body.email;
    let fecnac = req.body.fecnac;

    let errors = false;

    if(nombres.length === 0 || apellidos.length === 0 || dni.length === 0 || celular.length === 0 || direccion.length === 0 || email.length === 0|| fecnac.length === 0) {
        errors = true;
        req.flash('error', "Porfavor ingresa los datos");
        res.render('vendedores/add', {
            nombres: nombres,
            apellidos: apellidos,
            dni: dni,
            celular: celular,
            direccion:direccion,
            email: email,
            fecnac: fecnac
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            nombres: nombres,
            apellidos: apellidos,
            dni: dni,
            celular: celular,
            direccion:direccion,
            email: email,
            fecnac: fecnac

        }
        
        // insert query
        dbConn.query('INSERT INTO vendedores SET ?', form_data, function(err, result) {
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('vendedores/add', {
                    nombres: form_data.nombres,
                    apellidos: form_data.apellidos,
                    dni: form_data.dni,
                    celular: form_data.celular,
                    direccion: form_data.direccion,
                    email: form_data.email,
                    fecnac: form_data.fecnac                 
                })
            } else {                
                req.flash('success', 'vendedor successfully added');
                res.redirect('/vendedores');
            }
        })
    }
})

//ver forumlario editar*/
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM vendedores WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
        if (rows.length <= 0) {
            req.flash('error', 'Registro no encontrado with id = ' + id)
            res.redirect('/vendedores')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('vendedores/edit', {
                id: rows[0].id,
                nombres: rows[0].nombres,
                apellidos: rows[0].apellidos,
                dni: rows[0].dni,
                celular: rows[0].celular,
                direccion: rows[0].direccion,
                email: rows[0].email,
                fecnac: rows[0].fecnac

            })
        }
    })
})

// actualizar formulario base datos*/
router.post('/update/:id', function(req, res, next) {
    let id = req.params.id;
    let nombres = req.body.nombres;
    let apellidos = req.body.apellidos;
    let dni = req.body.dni;
    let celular = req.body.celular;
    let direccion = req.body.direccion;
    let email = req.body.email;
    let fecnac = req.body.fecnac;

    let errors = false;

    if(nombres.length === 0 || apellidos.length === 0 || dni.length === 0 || celular.length === 0 || direccion.length === 0 || email.length === 0|| fecnac.length === 0) {
        errors = true;
        req.flash('error', "Porfavor ingresa todos los campos");
        res.render('vendedores/edit', {
            id: req.params.id,
            nombres: nombres,
            apellidos: apellidos,
            dni: dni,
            celular: celular,
            direccion:direccion,
            email: email,
            fecnac: fecnac
        })
    }

    if( !errors ) {   
 
        var form_data = {
            nombres: nombres,
            apellidos: apellidos,
            dni: dni,
            celular: celular,
            direccion:direccion,
            email: email,
            fecnac: fecnac
        }
        dbConn.query('UPDATE vendedores SET ? WHERE id = ' + id, form_data, function(err, result) {
            if (err) {
                req.flash('error', err)
                res.render('vendedores/edit', {
                    id: req.params.id,
                    nombres: form_data.nombres,
                    apellidos: form_data.apellidos,
                    dni: form_data.dni,
                    celular: form_data.celular,
                    direccion: form_data.direccion,
                    email: form_data.email,
                    fecnac: form_data.fecnac,  
                    
                })
            } else {
                req.flash('success', 'Registro actualizado');
                res.redirect('/vendedores');
            }
        })
    }
})


// eliminar regisrto base de datos*/
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM vendedores WHERE id = ' + id, function(err, result) {
        if (err) {
            req.flash('error', err)
            res.redirect('/vendedores')
        } else {
            req.flash('success', 'Registro borrado correctamente!' + id)
            res.redirect('/vendedores')
        }
    })
})


module.exports = router;
