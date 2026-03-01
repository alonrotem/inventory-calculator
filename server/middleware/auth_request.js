//const { all } = require('../routes/customers');
const users = require('../services/users');
const jwt = require('jsonwebtoken');

/**
 * Middleware to check authentication and implement the rolling session.
 * * Logic:
 * 1. Checks the token signature and short 10m expiry.
 * 2. If 'maxExp' is present (Remember Me), checks the 30-day absolute cutoff.
 * 3. If valid, generates a new token (rolling the 10m window) and sets a new cookie.
 * 4. If invalid, clears the cookie and sends a 401.
 */
//const authenticateRequest = async (req, res, next) => {
//auth_request([{ requiredArea: '', requiredPermission: '' }])
const authenticateRequest = (requiredPermissions) => {
    return async (req, res, next) => {    
        try {
            let token = "";
                if(req.headers && req.headers.authorization && req.headers.authorization.indexOf("Bearer ") == 0) {
                const bearer = req.headers.authorization.split(" ");
                if(bearer.length > 1) {
                    token = bearer[1];
                }
            }
            if(!token){
                return res.status(401).send({ message: 'Authorization denied: No active session.' });
            }
            const auth_token = await jwt.verify(token, process.env.AUTH_TOKEN_SECRET);
            req["auth_token"] = auth_token;

            if (!await users.doesUserHavePermissions(auth_token.id, requiredPermissions)) {
                return res.status(403).json({ error: 'Forbidden: No permissions to access this url!' });
            }
            next();
        }
        catch (err) {
            // Send 401 Unauthorized response
            return res.status(401).send({ message: 'Session invalid or expired. Please log in.' + err });
        }
    }
}

/*
const authenticateRequest_with_params = async(throw_error) => {
    return async function (req, res, next) {
        try {
            let token = "";
            if(req.headers && req.headers.authorization && req.headers.authorization.indexOf("Bearer ") == 0){
                const bearer = req.headers.authorization.split(" ");
                if(bearer.length > 1) {
                    token = bearer[1];
                }
            }
            if(!token){
                return res.status(401).send({ message: 'Authorization denied: No active session.' });
            }
            const auth_token = await jwt.verify(token, process.env.AUTH_TOKEN_SECRET);
            req["auth_token"] = auth_token;
            next();
        }
        catch (err) {
            // Send 401 Unauthorized response
            return res.status(401).send({ message: 'Session invalid or expired. Please log in.' + err });
        }
    }
};
*/

module.exports = authenticateRequest;