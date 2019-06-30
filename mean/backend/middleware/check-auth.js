const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
    //console.log("checkAuth");
    try {
        const token = req.headers.authorization.split(" ")[1];

        jwt.verify(token, "secret_password_for_token_validation");
        //console.log("Auth success");
        next();

    } catch (error) {
        //console.log("Auth failed");
        res.status(401).json({ message: "Auth failed - unauthorized" });
    }


};