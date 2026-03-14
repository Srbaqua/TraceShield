const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());   // IMPORTANT

app.post("/transfer", (req, res) => {

    const { user, amount } = req.body || {};

if (!user || !amount) {
    return res.status(400).json({ status: "error", message: "Missing user or amount" });
}

    console.log("Payment request received:", req.body);

    res.json({
        status: "success",
        message: `Transfer of ${amount} processed for ${user}`
    });

});

const port = 8000;

app.listen(port, () => {
    console.log("Payment Service running on port", port);
});