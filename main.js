const express = require("express");
const app=express();
const mongoose=require("mongoose");
app.use(express.json());


async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mydatabase', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB database');
  } catch (error) {
    console.error('Error connecting to MongoDB database', error);
  }
}

connectToDatabase();

//SCHEMA
const sch={
    name:String,
    email:String,
    id:Number
}
const monmodel=mongoose.model("NEWCOL",sch);

//POST

app.post("/post",async(req,res)=>{
    console.log("inside post function");

    const data=new monmodel({
        name:req.body.name,
        email:req.body.email,
        id:req.body.id
    });
    const val=await data.save();
    res.send("posted");
})

//fetch all

app.get("/fetchall", async (req, res) => {
    try {
      const val = await monmodel.find().exec();
      res.json(val);
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  });
//PUT

app.put("/update/:id", async (req, res) => {
    let upid = req.params.id;
    let upname = req.body.name;
    let upemail = req.body.email;
  
    try {
      let data = await monmodel.findOneAndUpdate(
        { id: upid },
        { $set: { name: upname, email: upemail } },
        { new: true }
      );
      if (data == null) {
        res.send("nothing found");
      } else {
        res.send(data);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  });

//fetch get
app.get('/fetch/:id', async (req, res) => {
    const fetchid = req.params.id;
    try {
      const data = await monmodel.findOne({ id: fetchid });
      if (data == null) {
        res.send("nothing found");
      } else {
        res.send(data);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  });

//delete
app.delete('/del/:id', async (req, res) => {
    let delid = req.params.id;
    try {
      const data = await monmodel.findOneAndDelete({ id: delid });
      if (data == null) {
        res.send("nothing found");
      } else {
        res.send(data);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  });

app.listen(3000, ()=>{
    console.log("on port 3000")
})



