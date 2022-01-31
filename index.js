const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.os8em.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log(uri);

client.connect((err) => {
  const servicesCollection = client.db("fast_delivery").collection("services");
  const bookingsCollection = client.db("fast_delivery").collection("bookings");

  // add service
  app.post("/addServices", async (req, res) => {
    const result = await servicesCollection.insertOne(req.body);
    res.send(result);
  });

  // get all service
  app.get("/allServices", async (req, res) => {
    const result = await servicesCollection.find({}).toArray();
    res.send(result);
    console.log(result);
  });

  // get single product
  app.get("/singleProduct/:id", async (req, res) => {
    const result = await servicesCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray();
    res.send(result[0]);
  });

  //Confirm orders
  app.get("/orders", async (req, res) => {
    let query = req.query.email;
    const email = req.query.email;
    if (email) {
      query = { email: email };
    }
    const cursor = bookingsCollection.find(query);
    const orders = await cursor.toArray();
    res.json(orders);
  });
  app.post("/orders", async (req, res) => {
    const order = req.body;
    const result = await bookingsCollection.insertOne(order);
    res.send(result);
  });

  /// delete order
  app.delete("/deleteOrder/:id", async (req, res) => {
    const result = await bookingsCollection.deleteOne({
      _id: ObjectId(req.params.id),
    });
    res.send(result);
  });

  // all order
  app.get("/allOrders", async (req, res) => {
    const result = await bookingsCollection.find({}).toArray();
    res.send(result);
  });

  // update status
  app.put("/updateStatus/:id", (req, res) => {
    const id = req.params.id;
    const updatedStatus = req.body.status;
    const filter = { _id: ObjectId(id) };
    console.log(updatedStatus);
    bookingsCollection
      .updateOne(filter, {
        $set: { status: updatedStatus },
      })
      .then((result) => {
        res.send(result);
      });
  });
});
//run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("fast_delivery running");
});

app.listen(port, () => {
  console.log("server is running", port);
});
