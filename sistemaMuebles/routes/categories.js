var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
const { data } = require('autoprefixer');

/* listar */
router.get('/', function(req, res, next) {
    dbConn.query('SELECT * FROM categoria ORDER BY id asc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err); 
            res.render('categories/index',{data:''});
        } else {
            res.render('categories/index',{data:rows});
        }

    });

});

// ver formulario ADD*/
router.get('/add', function(req, res, next) {    
    res.render('categories/add', {
        nombre: '',   
    })
})

// agregar en base de datos*/
router.post('/add', function(req, res, next) {    
    let nombre = req.body.nombre;
    let imagen = req.body.imagen;
    let errors = false;

    if(nombre.length === 0|| imagen.length === 0) {
        errors = true;
        req.flash('error', "Please enter name");
        res.render('categories/add', {
            nombre: nombre,
            imagen: imagen,
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            nombre: nombre,
            imagen: imagen,
        }
        
        // insert query
        dbConn.query('INSERT INTO categoria SET ?', form_data, function(err, result) {
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('categories/add', {
                    name: form_data.nombre,
                    imagen: form_data.imagen
                                        
                })
            } else {                
                req.flash('success', 'categoria successfully added');
                res.redirect('/categories');
            }
        })
    }
})

//ver forumlario editar*/
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM categoria WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
        if (rows.length <= 0) {
            req.flash('error', 'Registro no encontrado with id = ' + id)
            res.redirect('/categories')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('categories/edit', {
                id: rows[0].id,
                nombre: rows[0].nombre,
                imagen: rows[0].imagen,
            })
        }
    })
})

// actualizar formulario base datos*/
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let nombre = req.body.nombre;
    let imagen = req.body.imagen;
    let errors = false;

    if(nombre.length === 0|| imagen.length === 0) {
        errors = true;
        req.flash('error', "Please enter name");
        res.render('categories/edit', {
            id: req.params.id,
            nombre: nombre,
            imagen: imagen,
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            nombre: nombre,
            imagen: imagen,
        }
        // update query
        dbConn.query('UPDATE categoria SET ? WHERE id = ' + id, form_data, function(err, result) {
            if (err) {
                req.flash('error', err)
                res.render('categories/edit', {
                    id: req.params.id,
                    nombre: form_data.nombre,
                    imagen: form_data.nombre,
                })
            } else {
                req.flash('success', 'Registro actualizado');
                res.redirect('/categories');
            }
        })
    }
})

// eliminar regisrto base de datos*/
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM categoria WHERE id = ' + id, function(err, result) {
        if (err) {
            req.flash('error', err)
            res.redirect('/categories')
        } else {
            req.flash('success', 'Registro borrado correctamente!' + id)
            res.redirect('/categories')
        }
    })
})


module.exports = router;
