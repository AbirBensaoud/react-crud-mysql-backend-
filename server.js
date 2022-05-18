const express = require("express");
const app = express();
const cors=require('cors');
const bodyParser=require('body-parser');
const mysql = require("mysql");

/*const moment = require('moment');
//import Moment from 'moment';

let myDate;

//myDate = moment().format();
//myDate = moment().format("ddd MMMM YYYY");
myDate = moment().format(" Do-MM-YYYY, hh:mm:ss a");
//myDate = moment().format("[Today's date is] ddd hA");
//myDate = moment('2022-04-20').format("[Today's date is] ddd hA");




console.log(myDate);*/

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "aplume",
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

//insertion
app.post("/insert", (req,res) => {
  const id=req.body.id;
  const username=req.body.username;
  const phone=req.body.phone;
  const occupation=req.body.occupation;
  const password=req.body.password;
  const sqlInsert =
    "INSERT INTO users (id,username,telephone,occupation,password) VALUES (?,?,?,?,?)"
  db.query(sqlInsert,[id,username,phone,occupation,password] ,(err, result) => {
      console.log(err);
  });
});


//affiche
app.get("/affiche", (req, res) => {
  const sqlSelect = "SELECT * FROM users";
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});
 

//delete
app.delete("/delete/:id",(req, res) => {
  const ida = req.params.id;
  const sqlDelete=
  "DELETE FROM users WHERE id= ?";
  db.query(sqlDelete, ida, (err, result)=> {
      if(err) 
          console.log(err);
  });
});

//update
app.put('/update/:id',(req, res) => {
  const id = req.params.id;
  const phone = req.body.phone;
  const occupation = req.body.occupation;
  const password = req.body.password;

  const sqlUpdate =
    "UPDATE `users` SET `telephone`=? ,`occupation`=? ,`password`=?  WHERE `id`=?"
db.query(sqlUpdate, [phone, occupation, password, id],(err, result) =>{
  if (err) {
    console.log(err);
   }else {
    res.send(result);
  }
});  
});

//Login
app.post("/login", (req, res) => {
  const username =req.body.username;
  const password =req.body.password; 
  db.query(
    "SELECT username, password, occupation FROM users WHERE username = ? ",
    username,
    (err, results) => {
       
      if(err){
        console.log( err);
      }
      
        if(results.length > 0 ){
         console.log( results );
          if(password == results[0].password){
            res.json({ logedIn: true, username: username, occupation: results[0].occupation});
          }else {
            res.json({ 
              logedIn: false, 
              message: "Wrong username/password combination"});
          }
        }else{
          res.json({ logedIn: false,
            message: "User doesn't exist"});
        }
      }
  );
  });

//l'insertion des lestes inventaire
  app.post("/addliste", (req,res) => {

    let date_ob = new Date();
// current date
// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

// current hours
let hours = date_ob.getHours();

// current minutes
let minutes = date_ob.getMinutes();

// current seconds
let seconds = date_ob.getSeconds();

    const nb = req.body.nb;
    const validite = req.body.validite;
    const faute = req.body.faute;
    const resultat = req.body.resultat;

    const sqlInv =
    "INSERT INTO `listeinv`(`nb`, `date`, `validite`, `faute`, `resultat`) VALUES (' ','"+year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds+" ',' ',' ',' ')";
    db.query(sqlInv, [nb, year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds, validite, faute, resultat] ,(err, results) =>{
      console.log(err);
    });
  });

//laffichage des liste
  app.get("/liste", (req, res) => {
    const sqlListeInv = "SELECT * FROM `listeinv`"
    db.query(sqlListeInv, (err, result) =>{
      res.send(result);
    });
  });

  //l'affichage de feuile inventaire par nb:idliste
  app.get('/inventaire/:nb', (req, res) => {
    const nb = req.params.nb;
    const sqlSelect = "SELECT * FROM inventaire WHERE nb = ?"

    db.query(sqlSelect,[nb], (err, result) => {
        res.send(result);
        console.log(result);

    });
  });

//update d'inventaire
  app.put("/validerInv", (req, res) =>{
    const empl = req.body.empl;
    const validite = req.body.validite;
    const faute = req.body.faute;

    const sqlValider =
      "UPDATE `inventaire` SET `validite`=? ,`faute`=?  WHERE `empl`= ?"
  db.query(sqlValider, [validite, faute, empl],(err, result) =>{
    if (err) {
      console.log(err);
     }else {
      res.send(result);
      console.log(result)
    }
  });  
  });

  //valide liste :( mahabetch temchi
  app.put("/valideList", (req, res) =>{
    const nb = req.body.nb;
    const validite = req.body.validite;
    const faute = req.body.faute;
    const resultat = req.body.resultat;

    const sqlTerminer =
      "UPDATE `listeinv` SET `validite`=? ,`faute`=? , `resultat`=? WHERE `nb`= ?"
  db.query(sqlTerminer, [validite, faute, resultat, nb],(err, result) =>{
    if (err) {
      console.log(err);
     }else {
      res.send(result);
      console.log(result)

    }
  });  
  });

app.listen(3001, () => {
  console.log("running on port 3001");
});
