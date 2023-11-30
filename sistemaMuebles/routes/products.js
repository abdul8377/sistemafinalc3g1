var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
const { data } = require('autoprefixer');

/* GET users listing. */
router.get('/', function(req, res, next) {
    dbConn.query('SELECT p.id, p.nombre, p.stock, p.precio, p.descripcion, c.nombre AS categoria FROM productos p JOIN categoria c ON p.categoria_id = c.id ORDER BY p.id ASC',function(err,rows)     {
 
        if(err) {
            req.flash('error', err); 
            res.render('products/index',{data:''});
        } else {
            res.render('products/index',{data:rows});
        }

    });

});


// ver formulario ADD*/
router.get('/add', function(req, res, next) {    
    res.render('products/add', {
        nombre: '',     
    })
})

// agregar en base de datos*/
router.post('/add', function(req, res, next) {    
    let nombre = req.body.nombre;
    let descripcion = req.body.descripcion;
    let foto = req.body.foto;
    let stock = req.body.stock;
    let precio = req.body.precio;
    let categoria_id = req.body.categoria_id;
    let errors = false;

    if(nombre.length === 0 || descripcion.length === 0 || foto.length === 0 || stock.length === 0 || precio.length === 0 || categoria_id.length === 0) {
        errors = true;
        req.flash('error', "Please enter name");
        res.render('products/add', {
            nombre: nombre,
            descripcion: descripcion,
            foto: foto,
            stock: stock,
            precio: precio,
            categoria_id: categoria_id
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            nombre: nombre,
            descripcion: descripcion,
            foto: foto,
            stock: stock,
            precio: precio,
            categoria_id: categoria_id

        }
        
        // insert query
        dbConn.query('INSERT INTO productos SET ?', form_data, function(err, result) {
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('products/add', {
                    name: form_data.nombre,
                    descripcion: form_data.descripcion,
                    foto: form_data.foto,
                    stock: form_data.stock,
                    precio: form_data.precio,
                    categoria_id: form_data.categoria_id                 
                })
            } else {                
                req.flash('success', 'producto successfully added');
                res.redirect('/products');
            }
        })
    }
})

//ver forumlario editar*/
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM productos WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
        if (rows.length <= 0) {
            req.flash('error', 'Registro no encontrado with id = ' + id)
            res.redirect('/products')
        }
        
        else {
            // render to edit.ejs
            res.render('products/edit', {
                id: rows[0].id,
                nombre: rows[0].nombre,
                descripcion: rows[0].descripcion,
                foto: rows[0].foto,
                stock: rows[0].stock,
                precio: rows[0].precio,
                categoria_id: rows[0].categoria_id,

            })
        }
    })
})

// actualizar formulario base datos*/
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let nombre = req.body.nombre;
    let descripcion = req.body.descripcion;
    let foto = req.body.foto;
    let stock = req.body.stock;
    let precio = req.body.precio;
    let categoria_id = req.body.categoria_id;

    let errors = false;

    if(nombre.length === 0 || descripcion.length === 0 || foto.length === 0 || stock.length === 0 || precio.length === 0 || categoria_id.length === 0) {
        errors = true;
        req.flash('error', "Porfavor ingresa todos los campos");
        res.render('products/edit', {
            id: req.params.id,
            nombre: nombre,
            descripcion: descripcion,
            foto: foto,
            stock: stock,
            precio: precio,
            categoria_id: categoria_id,
        })
    }

    if( !errors ) {   
 
        var form_data = {
            nombre: nombre,
            descripcion: descripcion,
            foto: foto,
            stock: stock,
            precio: precio,
            categoria_id: categoria_id,
        }
        dbConn.query('UPDATE productos SET ? WHERE id = ' + id, form_data, function(err, result) {
            if (err) {
                req.flash('error', err)
                res.render('products/edit', {
                    id: req.params.id,
                    nombre: form_data.nombre,
                    descripcion: form_data.descripcion,
                    stock: form_data.stock,
                    foto: form_data.foto,
                    precio: form_data.precio,
                    categoria_id: form_data.categoria_id,
                    
                })
            } else {
                req.flash('success', 'Registro actualizado');
                res.redirect('/products');
            }
        })
    }
})


// eliminar regisrto base de datos*/
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM productos WHERE id = ' + id, function(err, result) {
        if (err) {
            req.flash('error', err)
            res.redirect('/products')
        } else {
            req.flash('success', 'Registro borrado correctamente!' + id)
            res.redirect('/products')
        }
    })
})


module.exports = router;
