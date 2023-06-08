const express = require("express");
const app = express();
const port =3000;
const mysql = require('mysql');
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); 
app.use(express.urlencoded({ extended: false }));
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.get('/login', (req, res) => {
  res.render("login");
});

app.post('/login', (req, res) => {
  var user = req.body.user;
  var pass = req.body.pass;

  if (!user || !pass) {
    res.send("Veuillez fournir un nom d'utilisateur et un mot de passe.");
  } else if (user === "sidali" && pass === "sidali123") {
    res.redirect("crud");
  } else {
    res.send("Erreur de nom d'utilisateur ou de mot de passe.");
  }
});

    const pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'users1'
    });
    
    app.get('/crud', (req, res) => {
      var sql = "SELECT * FROM  `membres`";
      pool.query(sql, (error, results) => {
        if (error) {
          console.error('Error executing query:', error);
          res.status(500).send('Internal Server Error');
        } else {
          res.render('crud', { crud: results });
        }
      });
    });
    
// inser

app.post('/crud', (req, res) => {
  const nom = req.body.nom;
  const prenom = req.body.prenom;
  const type2=req.body.type2;
  const  Specialite=req.body.Specialite;
  const email =req.body.email;

  var sql = "INSERT INTO membres (nom, prenom, type2 ,Spécialité, email) VALUES (?,?,?,?,?)";

  pool.query(sql, [nom,prenom,type2,Specialite,email], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect("/crud");
    }
  });
});

// update

app.get('/edit/:id', (req, res) => {
  
      // res.render('update');
    
    const id = req.params.id_meb;
  
    var sql = `SELECT * FROM  membres WHERE id_meb = "${id}"`;
    pool.query(sql, (error, results) => {
      if (error) {
        console.error('Error retrieving item:', error);
        res.status(500).send('Error retrieving item');
        return;
      }
  
      res.render('update', { crud: results[0] });
    });
  });
  
  app.post('/edit/:id', (req, res) => {

    const id = req.params.id;
    const nome = req.body.nome;
    const prenom = req.body.prenom;
  
    var sql = `UPDATE sidaxe SET name = ?, prenom = ? WHERE id = ?`;
    pool.query(sql, [nome, prenom, id], (error, result) => {
      if (error) {
        console.error('Error updating item:', error);
        res.status(500).send('Error updating item');
        return;
      }else{
  
      res.redirect('/crud');
      }
    });
  });




//delete

app.get('/crud/:id',(req,res)=>{
  var id = req.params.id;
  const sql =`DELETE FROM sidaxe WHERE id="${id}"`;

  pool.query(sql,(error,results)=>{
    if(error){
      console.error("error",error);
      res.status(500).send("error");
      return;
    }else{
    res.redirect("/crud");
    }
  })
});


app.get('/mem',(req,res)=>{
    var sql = "SELECT * FROM  `membres`";
    pool.query(sql, (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
      } else {
        res.render('members', { members: results });
      }
    });
  });


//   search

app.get('/mem', (req, res) => {
    res.render('members', { results: [] }); // Remplacez 'members' par le nom de votre fichier de modèle EJS pour afficher la liste de membres
  });
  
  app.post('/mem', (req, res) => {
    const search = req.body.search;
  
    if (search === "all") {
      const sqlQuery = "SELECT * FROM membres";
      pool.query(sqlQuery, (error, results) => {
        if (error) {
          throw error;
        }
  
        res.render('members', { members: results }); // Remplacez 'members' par le nom de votre fichier de modèle EJS pour afficher les résultats de recherche
      });
    } else {
      // Requête SQL pour effectuer la recherche dans la table 'members' en utilisant le champ 'nom' ou 'prenom'
      const sqlQuery = "SELECT * FROM membres WHERE nom LIKE ? OR prenom LIKE ?";
      const queryValue = `%${search}%`; // Ajoute des jokers pour rechercher des correspondances partielles
  
      pool.query(sqlQuery, [queryValue, queryValue], (error, results) => {
        if (error) {
          throw error;
        }
  
        if (results.length === 0) {
          res.render('error', { searchTerm: search }); // Remplacez 'error' par le nom de votre fichier de modèle EJS pour afficher un message d'erreur
        } else {
          res.render('members', { members: results }); // Remplacez 'members' par le nom de votre fichier de modèle EJS pour afficher les résultats de recherche
        }
      });
    }
  });
  
 

app.listen(port,()=>{
  console.log("le serveur marche "+port);
})



