const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = 5000;

// data parser,{ata nadile data paua jabe na 🤘 importent 🤘}
app.use(express.json());

// db url
const uri = `mongodb+srv://${process.env.SECRET_USER_NAME}:${process.env.SECRET_PASS}@cluster0.z9hqskk.mongodb.net/CleanCo?retryWrites=true&w=majority`;
//   connet mongodb fun
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // collaction
    const servicesCollection = client.db("CleanCo").collection("services");
    const bookingCollection = client.db("CleanCo").collection("bookings");

    // see mongodb
    app.get("/api/v1/services", async (req, res) => {
      const cursor = servicesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // user booking
    app.post("/api/v1/user/create-booking", async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });

    // booking cancel
    app.delete("/api/v1/user/booking-cancel/:bookingId", async (req, res) => {
      const id = req.params.bookingId;
      const quary = { _id: new ObjectId(id) };
      const result = await bookingCollection.deleteOne(quary);
      console.log(id);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Clean-Co-Server Running");
});

app.listen(port, () => {
  console.log(`Clean-co-server listening on port ${port}`);
});
