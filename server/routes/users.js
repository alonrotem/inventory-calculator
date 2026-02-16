const express = require('express');
const router = express.Router();
const users = require('../services/users');
const auth_request = require('../middleware/auth_request');
const { logger } =  require('../logger');
const jwt = require("jsonwebtoken");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const config = require('../config');

const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });

// sign up a new user
router.post('/signup', async function(req, res, next) {
  logger.info(`post /users/signup`);
  logger.debug(`Body: ${ JSON.stringify(req.body) }`)
  try {
    const { firstname, lastname, email, username, password, role } = req.body;
    const response  = await users.signup(firstname, lastname, email, username, password, role);
    logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
    res.json(response);
  } 
  catch (err) {
    logger.error(`Error signing up: ${err.message}`);
    next(err);
  }
});

// verify the user's account based on the code in the email
router.post('/verify-user-account-code', async function(req, res, next) {
  logger.info(`post /users/verify-user-account-code`);
  logger.debug(`Body: ${ JSON.stringify(req.body) }`);
  try {
    const response  = await users.verifyUserSignupCode(req.body.code);
    res.json(response);
    logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
  } 
  catch (err) {
    logger.error(`Error verifying user account: ${err.message}`);
    next(err);
  }
});

// verify the user's new email address based on the code in the email
router.post('/verify-new-email-code', async function(req, res, next) {
  logger.info(`post /users/verify-new-email-code`);
  logger.debug(`Body: ${ JSON.stringify(req.body) }`);
  try {
    const response  = await users.verifyNewUserEmailCode(req.body.email_verification_code, req.body.cancel_new_address);
    res.json(response);
    logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
  } 
  catch (err) {
    logger.error(`Error verifying new email: ${err.message}`);
    next(err);
  }
});

router.post('/reset-password', async function(req, res, next) {
  logger.info(`post /users/reset-password`);
  logger.debug(`Body: ${ JSON.stringify(req.body) }`);
  try {
    const response  = await users.reset_password(req.body.code, req.body.password, req.body.sign_out_from_all);
    
    if(req.body.sign_out_from_all){
      let refresh_token = req.cookies.refresh_token;
      await users.logout(refresh_token);
      res.clearCookie('refresh_token');
    }

    res.json(response);
    logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
  } 
  catch (err) {
    logger.error(`Error resetting the password: ${err.message}`);
    next(err);
  }
});

router.post('/forgot-password', async function(req, res, next) {
  logger.info(`post /users/forgot-password`);
  logger.debug(`Body: ${ JSON.stringify(req.body) }`);
  try {
    const response  = await users.forgot_password(req.body.email_address);
    res.json(response);
    logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
  } 
  catch (err) {
    logger.error(`Error sending forgotten password email: ${err.message}`);
    next(err);
  }
});

// send a verification code to a newly registered user
router.post('/send-user-account-verification-code', async function(req, res, next) {
  logger.info(`post /users/send-user-account-verification-code`);
  logger.debug(`Body: ${ JSON.stringify(req.body) }`);
  try {
    const response  = await users.sendUserRegistrationVerificationCode(req.body.email_address);
    res.json(response);
    logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
  } 
  catch (err) {
    logger.error(`Error resending code up: ${err.message}`);
    next(err);
  }
});

//
// send a verification code to a newly registered user
router.post('/send-changed-email-verification-code', async function(req, res, next) {
  logger.info(`post /users/send-changed-email-verification-code`);
  logger.debug(`Body: ${ JSON.stringify(req.body) }`);
  try {
    const response  = await users.resendChangedEmailConfirmationCode(req.body.email_address);
    res.json(response);
    logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
  } 
  catch (err) {
    logger.error(`Error resending code up: ${err.message}`);
    next(err);
  }
});

// log a user into the system
router.post('/signin', async function(req, res, next) {
  logger.info(`post /users/signin`);
  logger.debug(`Body: ${ JSON.stringify(req.body) }`);

  try {
    const { access_token, refresh_token, refresh_token_expiration_date, userInfo } = 
      await users.signin(req.body.username_or_email, req.body.password, req.body.remember, req.ip, 
        req.body.origin_geolocation, req.body.origin_city, req.body.origin_country, req.body.origin_os, req.body.origin_browser,
        req.cookies);

    // clear the old cookie, if exists
    res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'None', secure: true });

    // set a new cookie
    //console.log(`Refresh token cookie will expire in ${refresh_token_expiration_date}`);
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: refresh_token_expiration_date,
    });

    response = { access_token, userInfo };

    logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
    res.status(200).send( response );
  } 
  catch (err) {
    console.log("--- Sign in error: ---")
    console.dir(err);
    logger.error(`Error signing in: ${err.message}`);
    next(err);
  }
});

// refresh the user's authorization token, if the refresh token is still alive
router.get('/refresh', async function(req, res, next) {
  logger.info(`post /users/refresh`);
  logger.debug(`Body: ${ JSON.stringify(req.body) }`);
  try {
    if(!req.cookies || !req.cookies.refresh_token){
      return res.status(401).send({ message: 'No refresh token, authorization denied' });
    }
    const decoded_refresh_token = jwt.verify(req.cookies.refresh_token, process.env.AUTH_TOKEN_SECRET);

    const { access_token, refresh_token, refresh_token_expiration_date, unauthorizedMessage } = 
      await users.refresh_tokens(req.cookies.refresh_token, req.ip);

    if(!access_token || !refresh_token){
      return res.status(401).send({ message: unauthorizedMessage?? 'Unauthorized' });
    }

    res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'None', secure: true });

    // set a new cookie
    //console.log(`Refresh token cookie will expire in ${refresh_token_expiration_date}`);
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      //maxAge: refresh_token_expiration_Days * helper.millisecondsFrom.days,
      expires: refresh_token_expiration_date,
      //sameSite: 'Lax',
    });

    const response = { access_token };

    logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
    res.status(200).send( response );      
  }
  catch (err) {
    logger.error(`Token refresh error: ${err.message}`);
    next(err);
  }
});

// get the logged in user status
router.get('/status', auth_request(), async function(req, res, next) {
  logger.info(`get /users/status`);
  try {
    // This is manually reassigned, to control which fields are returned
    const userInfo = await users.getBaseUserInfo(req["auth_token"].id);
    let return_data = {
      id: userInfo.id, 
      firstname: userInfo.firstname, 
      lastname: userInfo.lastname, 
      username: userInfo.username, 
      email: userInfo.email, 
      photo_url: userInfo.photo_url,
      area_permissions: userInfo.area_permissions
    };
    if(userInfo["roles"]){
      return_data["roles"] = userInfo["roles"];
    }
    res.json(return_data);
  } 
  catch (err) {
    next(err);
  }
});

// get the logged in user profile info
router.get('/profile', auth_request(), async function(req, res, next) {
  logger.info(`get /users/status`);
  try {
    //let token = users.getAuthTokenFromHeader(req);
    //if (!token) {
    //    return res.status(401).send({ message: 'No token, authorization denied' });
    //}

    //const decoded = jwt.verify(token, process.env.AUTH_TOKEN_SECRET);
    //console.dir(decoded);
    const userInfo = await users.getUserProfile(req["auth_token"].id);
    let return_data = {
      id: userInfo.id, 
      firstname: userInfo.firstname, 
      lastname: userInfo.lastname, 
      username: userInfo.username, 
      email: userInfo.email, 
      photo_url: userInfo.photo_url,
      pending_new_email: userInfo.pending_new_email,
      phone: userInfo.phone,
      registered_on: userInfo.created_at,
      customers: userInfo.customers
    };
    if(userInfo["roles"]){
      return_data["roles"] = userInfo["roles"];
    }
    res.json(return_data);
  } 
  catch (err) {
    next(err);
  }
});

// get the profile to finalize by pending verification code
router.get('/profile_by_code/:verification_code', async function(req, res, next) {
  logger.info(`get /users/profile_by_code`);
  try {
    const return_data = await users.getUserProfile_by_code(req.params.verification_code);
    res.json(return_data);
  } 
  catch (err) {
    next(err);
  }
});

//Update the user's profile
router.post('/profile', auth_request(), upload.single('photo'), async function(req, res, next) {
  let profile_photo_path = "";
  try {
    if(req.file && req.file.buffer){
      const buffer = req.file.buffer;

      // Now you can process and save manually
      const filename = `${Date.now()}-${req.file.originalname}`;
      const filepath = path.join(config.userUploadDir, filename);
      profile_photo_path = path.posix.join(config.user_pictures_path, filename);
      
      fs.writeFileSync(filepath, buffer);
      //file is available at <server>/uploads/images/users/1767022665227-photo.png
  }
  if(req["auth_token"] && req["auth_token"].id != req.body.id){
    return res.status(401).send({ message: 'Wrong profile user ID provided' });
  }
  const updatedProfile = await users.saveUserProfile(req.body, profile_photo_path);
  res.status(200).send(updatedProfile);
 } 
  catch (err) {
    logger.error(`Logout error: ${err.message}`);
    if(profile_photo_path) {
      fs.rmSync(path.join(config.server_root, profile_photo_path), {
          force: true,
      });
    }    
    next(err);
  }    
});

//----------------------
//Update the user's profile
router.post('/profile_by_code', upload.single('photo'), async function(req, res, next) {
  let profile_photo_path = "";
  try {
    // save the file
    if(req.file && req.file.buffer){
      const buffer = req.file.buffer;
  
      // Now you can process and save manually
      const filename = `${Date.now()}-${req.file.originalname}`;
      const filepath = path.join(config.userUploadDir, filename);
      profile_photo_path = path.posix.join(config.user_pictures_path, filename);
      
      fs.writeFileSync(filepath, buffer);
      //file is available at <server>/uploads/images/users/1767022665227-photo.png
    }
    const updatedProfile = await users.saveUserProfile(req.body, profile_photo_path);
    res.status(200).send(updatedProfile);
 } 
  catch (err) {
    logger.error(`Logout error: ${err.message}`);
    if(profile_photo_path) {
      fs.rmSync(path.join(config.server_root, profile_photo_path), {
          force: true,
      });
    }    
    next(err);
  }    
});
//----------------------

// Get the current user's logins
router.get('/get_logins', auth_request(), async function(req, res, next) {
  logger.info(`get /users/get_logins`);
  logger.debug(`Body: ${ JSON.stringify(req.body) }`);
  try {
    if(!req.cookies || !req.cookies.refresh_token){
      return res.status(401).send({ message: 'No refresh token, authorization denied' });
    }
    //const decoded_refresh_token = jwt.verify(req.cookies.refresh_token, process.env.AUTH_TOKEN_SECRET);

    const logins = await users.get_logins(req.cookies.refresh_token);

    logger.debug(`RESPONSE: ${JSON.stringify(logins)}`);
    res.status(200).send( logins );      
  }
  catch (err) {
    logger.error(`Error getting user logins: ${err.message}`);
    next(err);
  }
});

router.post('/clear_logins', auth_request(), async function(req, res, next) {
  logger.info(`post /users/clear_logins`);
  logger.debug(`Body: ${ JSON.stringify(req.body) }`)
  try {

    if(!req.cookies || !req.cookies.refresh_token){
      return res.status(401).send({ message: 'No refresh token, authorization denied' });
    }

    const logins = await users.clear_logins(req.body.ids, req.cookies.refresh_token);
    logger.debug(`RESPONSE: ${JSON.stringify(logins)}`);
    res.status(200).send( logins );      

  } 
  catch (err) {
    logger.error(`Error clearing logins: ${err.message}`);
    next(err);
  }
});

//
router.post('/request_account', async function(req, res, next) {
  logger.info(`post /users/request_account`);
  logger.debug(`Body: ${ JSON.stringify(req.body) }`)
  try {
    const new_account_response = await users.request_account(req.body);
    logger.debug(`RESPONSE: ${JSON.stringify(new_account_response)}`);
    res.status(200).send( new_account_response );      

  } 
  catch (err) {
    logger.error(`Error requesting account: ${err.message}`);
    next(err);
  }
});

router.get('/account_requets', auth_request([{ requiredArea: 'user_management', requiredPermission: 'R' }]), async function(req, res, next) {
  logger.info(`get /users/account_requets/ page=${req.query.page}, perPage=${req.query.perPage}`);
  try {
    const response = await users.get_account_requests(req.query.page, req.query.perPage);
    logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
    res.json(response);
  } 
  catch (err) {
    logger.error(`Error getting account requests ${err.message}`);
    next(err);
  }
});

///users/account_requet/${id}
router.get('/account_requet/:id', auth_request([{ requiredArea: 'user_management', requiredPermission: 'R' }]), async function(req, res, next) {
  logger.info(`get /users/account_requet/${req.params.id}`);
  try {
    const response = await users.getAccountRequestDetails(req.params.id);
    logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
    res.json(response);
  } 
  catch (err) {
    logger.error(`Error getting account request with ID ${ req.params.id }: ${err.message}`);
    next(err);
  }
});

router.delete('/account_requet/:id', auth_request([{ requiredArea: 'user_management', requiredPermission: 'D' }]), async function(req, res, next) {
  logger.info(`delete /users/account_requet/${req.params.id}`);
  try {
    const response = await users.deleteccountRequest(req.params.id);
    logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
    res.json(response);
  } 
  catch (err) {
    logger.error(`Error deleting account request with ID ${ req.params.id }: ${err.message}`);
    next(err);
  }
});

router.get('/roles', auth_request([{ requiredArea: 'user_management', requiredPermission: 'R' }]), async function(req, res, next) {
  logger.info(`get /users/roles`);
  try {
    const response = await users.getRoles();
    logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
    res.json(response);
  } 
  catch (err) {
    logger.error(`Error getting system roles: ${err.message}`);
    next(err);
  }
});

//}/users/account_requet/approve
router.post('/account_requet/approve', auth_request([{ requiredArea: 'user_management', requiredPermission: 'U' }]), async function(req, res, next) {
  logger.info(`post /users/account_requet/approve`);
  logger.debug(`Body: ${ JSON.stringify(req.body) }`)
  try {
    const new_account_response = await users.approve_account_request(req.body, req["auth_token"]);
    logger.debug(`RESPONSE: ${JSON.stringify(new_account_response)}`);
    res.status(200).send( new_account_response );      

  } 
  catch (err) {
    logger.error(`Error approving account request: ${err.message}`);
    next(err);
  }
});

router.post('/manual_add_user_temp', auth_request([{ requiredArea: 'user_management', requiredPermission: 'C' }]), async function(req, res, next) {
  logger.info(`post /users/manual_add_user_temp`);
  logger.debug(`Body: ${ JSON.stringify(req.body) }`)
  try {
    const new_account_response = await users.manual_add_user_temp(req.body);
    logger.debug(`RESPONSE: ${JSON.stringify(new_account_response)}`);
    res.status(200).send( new_account_response );
  } 
  catch (err) {
    logger.error(`Error manual_add_user_temp: ${err.message}`);
    next(err);
  }
});
//-------------------

// log out of the system
router.get('/logout', auth_request(), async function(req, res, next) {
  logger.info(`get /users/logout`);
  try {
    //let auth_token = users.getAuthTokenFromHeader(req);
    let refresh_token = req.cookies.refresh_token;
    
    await users.logout(refresh_token);
    res.clearCookie('refresh_token');
    res.status(200).send({ message: "Successfully logged out"});
  } 
  catch (err) {
    logger.error(`Logout error: ${err.message}`);
    next(err);
  }
});

router.get('/admins_count', async function(req, res, next) {
  logger.info(`get /users/logout`);
  try {
    const count = await users.admins_count();

    res.status(200).send({ admins:  count});
  } 
  catch (err) {
    logger.error(`Admins count error: ${err.message}`);
    next(err);
  }
});

module.exports = router;