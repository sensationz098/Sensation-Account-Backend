// middleware/authenticateUser.js
const jwt = require('jsonwebtoken');



const authenticateUser = (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization;

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);


  
    // Attach the user information to the request
    req.user = decodedToken;
    console.log(req.user)

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle invalid or expired token
    console.error(error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};



module.exports = {authenticateUser};
