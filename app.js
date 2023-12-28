const { json } = require('body-parser');
const exp = require('constants');
const express = require('express');
const fs = require('fs');
let etudiants = [];
fs.readFile("./bd/etudiants.json", (err, data) => {
    if(err){
        return
    }else{
        etudiants.push(...JSON.parse(data));
    }
});
const Port = 3000;
const app = express();
app.use(express.static('.'))
app.use(express.json());
app.get('/etudiants',(req,res)=>{
       res.json(etudiants);
});

app.post('/etudiants',(req,res)=>{

    let {nom,prenom,age} = req.body;
    if(nom=="" || prenom==""||age=="")
    {
        return res.status(400).json({error:"les Donne sont vides"});
    }
    fs.readFile("./bd/index.txt", (err,data)=>{
         let id = parseInt(data);
         let etudiant ={
            id,
            nom,
            prenom,
            age
         }
         console.log(etudiant.id);
            etudiants.push(etudiant);
            
            fs.writeFile("./bd/etudiants.json", JSON.stringify(etudiants,null,3), (err)=>{
                if(err)
                {
                    res.status(500).json({
                        error:"we are sorry"
                    });
                }else{
                    res.status(201).json(etudiants);
                    id++;
                    fs.writeFile("./bd/index.txt",id+"",(err)=>{
                    });
                }
            });   
    })
});



app.delete('/etudiants/:id',(req,res)=>{
    let etudiant = etudiants.find((ele)=>{return (ele.id==req.params.id)});
    if(!etudiant)
    {
      return res.status(404).json({error:"erreur mesage"});
    }
     
     etudiants = etudiants.filter(ele=>ele.id!=req.params.id);
     console.log(etudiants);
     fs.writeFile('./bd/etudiants.json',JSON.stringify(etudiants),(err)=>{
         if(err)
         {
             return res.status(500).json({err:"erreur messgain deletinng"});
         }else{
             return res.status(200).json(etudiant);
         }
     })
     
 })

 // c e

app.listen(Port,()=>{
    console.log("Server is running");
})