const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const lodash = require("lodash")

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-123:arj@cluster0.ygmfo.mongodb.net/todoDB?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const todoSchema = {
  task: {
    type: String,
  },
};

const listSchema = {
  listName: String,
  items: [todoSchema],
};

const List = mongoose.model("customList", listSchema);

const Todolist = mongoose.model("userTask", todoSchema);

const task1 = new Todolist({
  task: "Welcome",
});

const task2 = new Todolist({
  task: "Click on + to add your task",
});

const task3 = new Todolist({
  task: "<-- Click here to delete your task",
});

var defaultItems = [task1, task2, task3];

app.get("/", function (req, res) {
  Todolist.find((err, data) => {
    if (data.length == 0) {
      Todolist.insertMany(defaultItems, (err) => {
        console.log("Sucssesfully inserted data.");
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: data });
    }
  });
});

app.post("/", function (req, res) {
  let newItem = req.body.newItem;
  let currentlistname = req.body.list;
   
  var insertItem = {
    task:newItem,
  }

  
  if (currentlistname == "Today") {
    let newTodo = new Todolist({
      task: newItem,
    });

    newTodo.save(function(){
      res.redirect("/");
    });
    
  } 
  else {
    List.findOne({ listName: currentlistname }, (err,listFound) => {
   
      listFound.items.push(insertItem);
      listFound.save();
    });
    res.redirect("/" + currentlistname);
  }
});

app.post("/remove", (req, res) => {
  let checkedItem = req.body.checkBox;
  let name = req.body.listName;

  if (name == "Today") {
    //Here we get to now the item we got back is from default list and then delete it from there.
    Todolist.deleteOne({ _id: checkedItem }, (err) => {
      if (err) {
        console.log(err);
      }
    });
    res.redirect("/");
  }
  else{
   //this is the part we try to find which custom list it is and delete the task from the list
   List.findOneAndUpdate(
     { listName : name },
     { $pull:{items:{_id : checkedItem}}},(err , result)=>{
        //callback function which executes after the operation is done
        res.redirect("/" + name);
      })
  }
 
});

app.get("/:customlistName", function (req, res) {
  //Now here the reason we are getting a document called favicon.io is cause to the localhost the 
  //browser makes a get request to get the favicon and that get request made by the browser is 
  //catched by us as our program thinks that it is a parameter and catches it over here it can be solved by
  //chnging the route to the parameter.
  let customlistName = lodash.capitalize(req.params.customlistName);

  List.findOne({ listName: customlistName }, (err, foundData) => {
    if (foundData == null) {
      //this is the part where the list is not present and we need to create new list and add default items to it
      const list = new List({
        listName: customlistName,
        items: defaultItems,
      });
      list.save(function () {
        res.redirect("/" + customlistName);
      });
      
    } else {
      //here the list exits and we need to take the aldready present list and display it
      res.render("list", {
        listTitle: foundData.listName,
        newListItems: foundData.items,
      });
    }
   });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
