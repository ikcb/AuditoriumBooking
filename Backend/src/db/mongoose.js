const mongoose = require("mongoose");

const mongoURI = process.env.mongoURI
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("MongoDB Connected");
})
.catch(err => {
    console.error("MongoDB Connection Error:", err);
});