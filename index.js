const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.u8ojnwq.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();
    const taskCollection = client.db("pilot").collection("tasks");
    app.get('/', (req, res)=>{
        res.send('task pilot is running')
    })

    app.post("/tasks", async(req, res)=>{
    const body = req.body
    console.log(body)
    const result = await taskCollection.insertOne(body)
    res.send(result)
    })

    app.get("/tasks", async(req, res)=>{
        const result = await taskCollection.find().toArray()
        res.send(result)
    })

    app.delete("/taskDd/:id", async(req, res)=>{
        const id = req.params
        const query = {_id : new ObjectId(id)}
        const result = await taskCollection.deleteOne(query)
        res.send(result)
    })
    
    app.get("/task/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await taskCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/tasks/item/:id", async (request, response) => {
      const id = request.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.findOne(query);
      response.status(200).send(result);
    });
    app.patch("/task", async (req, res) => {
      const id = req.query.id;
      const data = req.body;
      const query = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          status: data.status,
        },
      };
      const result = await taskCollection.updateOne(query, updatedDoc);
      res.send(result);
    });
    app.delete("/task/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      try {
        const result = await taskCollection.deleteOne(query);
        if (result.deletedCount === 1) {
          res.status(200).json({ message: "Task deleted successfully" });
        } else {
          res.status(404).json({ message: "Task not found" });
        }
      } catch (error) {
        res.status(500).json({ message: "Internal server error" });
      }
    });
    app.get("/updatetask/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.findOne(query);
      res.send(result);
    });

    app.patch("/taskEd/:id", async (req, res) => {
      const id = req.params.id;
      const item = req.body;
      const filter = { _id: new ObjectId(id) };

      const updatedDoc = {
        $set: {
          title: item.title,
          deadline: item.deadline,
          description: item.description,
          priority: item.priority,
        },
      };
      const result = await taskCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`My server is running on port: ${port}`);
  });