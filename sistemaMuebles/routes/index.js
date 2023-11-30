var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

/* GET home page. */
router.get('/', function(req, res, next) {
  dbConn.query('SELECT * FROM categoria;', function(err, rows) {
    if(err) {
      console.log(err) 
      req.flash('error', err);
      res.render('index', { title: 'Express' });
    } else {
      res.render('index', { title: 'Express', data: rows });
      
    }
  });
});


/*ver cards productos*/
router.get('/ver_productos', function(req, res, next) {
  dbConn.query('SELECT p.id, p.nombre, p.stock, p.precio, p.descripcion, p.foto, c.nombre AS categoria FROM productos p JOIN categoria c ON p.categoria_id = c.id;', function(err, rows) {
    if(err) {
      req.flash('error', err);
      res.render('ver_productos', { title: 'Express' });
    } else {
      res.render('ver_productos', { title: 'Express', data: rows });
      
    }
  });
});

/*barra busqueda*/
router.post('/search', function(req, res, next) {
  let name=req.body.search;
  dbConn.query('SELECT p.id, p.nombre, p.descripcion, p.stock, p.foto, p.precio, c.nombre AS categoria FROM productos p INNER JOIN categoria c ON p.categoria_id = c.id WHERE p.nombre LIKE ?;', ['%'+name+'%'],function(err,rows){
    console.log(rows);
    if(err) {
        req.flash('error', err);
        res.render('ver_productos',{data:''});   
    }else {
        res.render('ver_productos',{data:rows});
    }
  });
});

/* ver_productos por categoria */

router.get('/productos-por-categoria/:nombreCategoria', function(req, res, next) {
  const nombreCategoria = req.params.nombreCategoria;
  dbConn.query(
    'SELECT productos.nombre AS nombre, productos.descripcion, productos.foto, productos.stock, productos.precio, categoria.nombre AS categoria FROM productos INNER JOIN categoria AS categoria ON productos.categoria_id = categoria.id WHERE categoria.nombre = ?;',
    [nombreCategoria],
    function(err, rows) {
      if (err) {
        req.flash('error', err);
        res.redirect('/');
      } else {
        res.render('productosPorCategoria', { nombreCategoria: nombreCategoria, data: rows });
      }
    }
  );
});

/*redireccionar a compras*/
router.get('/compras/:nombre', function(req, res, next) {
  const nombre = req.params.nombre;
  dbConn.query(
    'SELECT productos.nombre AS nombre, productos.descripcion, productos.foto, productos.precio, productos.stock, categoria.nombre AS categoria FROM productos INNER JOIN categoria AS categoria ON productos.categoria_id = categoria.id WHERE productos.nombre = ?;',
    [nombre],
    function(err, rows) {
      if (err) {
        console.log(err)
        req.flash('error', err);
        res.redirect('/');
      } else {
        res.render('compra', { nombre: nombre, data: rows });
      }
    }
  );
});



/* sobre nosotros*/
router.get('/sobre_nosotros', function(req, res, next) {
  res.render('sobre_nosotros', { title: 'Express' });
});


/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

/* post dashboard page. */
router.post('/dashboard', function(req, res, next) {
  email=req.body.email;
  password=req.body.password;
  dbConn.query("select * from usuarios WHERE email='"+email+"' AND password='"+password+"' ",function(err,rows){
    console.log(rows);
    if(err){
      req.flash('error',err)
      console.log(err) 
    }else{
      if(rows.length){
        req.session.idu=rows[0]["id"];
        req.session.email=rows[0]["email"];
        req.session.loggedin=true;
        res.redirect('/dashboard')

      }else{
        req.flash('error','el usuario no existe...')
        res.redirect('/')
      }
    }
  });
});

/* GET dashboard page. */
router.get('/dashboard', function(req, res, next) {
  if(!req.session.loggedin){
    res.redirect('/login');
  }else{
    dbConn.query('SELECT categoria.cantidad AS cantidad_categorias, productos.cantidad_productos, clientes.cantidad_clientes FROM (SELECT COUNT(id) AS cantidad FROM categoria) AS categoria CROSS JOIN (SELECT COUNT(id) AS cantidad_productos FROM productos) AS productos CROSS JOIN (SELECT COUNT(id) AS cantidad_clientes FROM clientes) AS clientes;',function(err,rows)
         {
      if(err) {
          req.flash('error', err); 
      } else {
        res.render('dashboard',{data:rows});
      }
    });
  }
});


router.get('/logout', function(req,res){
  req.session.destroy();
  res.redirect("/");
});



module.exports = router;
