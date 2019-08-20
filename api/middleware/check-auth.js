const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.cookies.access_token.split(' ')[1];

    if (!token) {
        const error = new Error("Authorization failed!");
        error.statusCode = 401;
        console.log(error);
        res.json({
          errorMsg: error
        });
        throw error;
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_KEY);
    } catch (err) {
        err.statusCode = 500;
        console.log(err);
        res.json({
          errorMsg: err
        });
        throw err;
    }
    if (!decodedToken) {
        const error = new Error("Authorization failed");
        error.statusCode = 401;
        console.log(error);
        res.json({
          errorMsg: error
        });
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
};
