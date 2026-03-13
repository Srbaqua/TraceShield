const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/transfer", (req, res) => {

    const { user, amount } = req.body;

    console.log("Payment request received:", req.body);

    res.json({
        status: "success",
        message: `Transfer of ${amount} processed for ${user}`
    });

});

app.listen(6000, () => {
    console.log("Payment Service running on port 6000");
});