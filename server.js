const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js")


app.use(express.static('static'))

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine" , "ejs");

let tasks =[];

let workTasks = [];

app.get("/",(req,res)=>{
   var day = date.getDate();
   res.render("list",{listTitle:day,usersTask:tasks});
   //Question: Why do we send back the whole array of tasks when someone just inputs a new task as we just we just displayed everything previously will this not cause redisplaying it again?
   //Answer: We need to send the whole array again and redisplay the previous componets back as when we get redirected to the 
   //home route we send all the tasks again and also the previous tasks we have aldready rendered when we render it to the 
   //user the whole list.ejs doesn't store any previous data we sent and all the data should be sent to the file list.ejs 
   //for displaying as all the previous data is lost when we get redirected as list.ejs has no place to store the previous data
});
app.post("/",(req,res)=>{
   if(req.body.button == "Work List")
   {
       workTasks.push(req.body.newTask);
       res.redirect("/work")
   }
   else{
    let task = req.body.newTask;
    tasks.push(task);
    res.redirect("/");
   }
 
})

app.get("/work",(req,res)=>{
  res.render("list",{listTitle:"Work List",usersTask:workTasks})
});

app.get("/about",(req,res)=>{
    res.render("about");
})

app.listen(3000,(req,res) =>{
    console.log("succesfully hosted the files to the port 3000.");
});