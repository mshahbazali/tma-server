const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://trello:Trello..ByMughees123@cluster0.s0iuz5f.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("connected");
})
    .catch((e) => {
        console.log("errr",e);
    })