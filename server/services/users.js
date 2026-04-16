const db = require('./db');
const helper = require('../helper');
const fs = require('fs');
const path = require("path");
const config = require('../config');
const email = require("./email");
//const customers = require("./customers");
const email_tempates = require('./email-templates');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ref } = require('process');

// does what it says
function getAuthTokenFromHeader(req){
    let token = "";
    if(
      req && 
      req.headers && 
      req.headers.authorization && 
      req.headers.authorization.trim().indexOf("Bearer")==0){
      const bearer = req.headers.authorization.split(" ");
      if(bearer.length > 1){
        token = bearer[1].trim();
      }
    }
    return token;
}

async function hashPassword(password){
  return await bcrypt.hash(password, 10);
}

//checks whether the username or email address is already taken by another user, account request, or invitation
async function isUserTakenAnywhere(username, email_address, throw_exception_if_duplicate=false) {
  //nothing to search by, user is not taken
  if(!username && !email_address){
    return false;
  }

  //check existing users
  const existing_user_rec = await findUser(username, email_address);
  if(!helper.isEmptyObj(existing_user_rec) && throw_exception_if_duplicate) {
    if(existing_user_rec['email'] && existing_user_rec['email'].toUpperCase() == email_address.toUpperCase()){
      throw new Error(`A user with email address ${email_address} already exists.`);
    }
    if(existing_user_rec['username'] && existing_user_rec['username'].toUpperCase() == username.toUpperCase()){
      throw new Error(`A user with username ${username} already exists.`);
    }
    if(existing_user_rec['reduced_gmail_address'] && existing_user_rec['reduced_gmail_address'].toUpperCase() == reduced_gmail_address.toUpperCase()){
      throw new Error(`A user with an address equivalent to ${email_address} already exists.`);
    }     
    return true;
  }

  //check pending account requests and invites
  if(email_address){
    const user_reduced_gmail_address = email.reduceGmailAddress(email_address);

    const query_columns=[], generated_columns=[], query_params=[], query_filters=[];
    query_columns.push("email");
    generated_columns.push("email");
    query_params.push(email_address);
    query_filters.push("email=(?)");

    query_columns.push(`case 
        when email like '%@gmail.com' then reduced_gmail_address 
        else email 
      end reduced_gmail_address`);
    generated_columns.push(` concat(
          SUBSTRING_INDEX(
            replace(SUBSTRING_INDEX(email, "@", 1), ".", ""), 
            "+", 1), 
          "@", 
          SUBSTRING_INDEX(email, "@", -1)) as reduced_gmail_address `);
    query_params.push(user_reduced_gmail_address);
    query_filters.push("reduced_gmail_address=(?)");
  
    //check account requests
    const existing_account_request = helper.emptyOrSingle(await db.query(
      `select 
        request_status, ${query_columns.join(",")}
      from (
        select 
          request_status, ${generated_columns.join(",")} 
        from account_requests) as users_gmails 
      where (${query_filters.join(" or ")}) and request_status<>'declined' ;`, 
      query_params));

    if(!helper.isEmptyObj(existing_account_request)){
      if(throw_exception_if_duplicate) {
        throw new Error(`An account request with an address equivalent to ${email_address} already exists.`);
      }
      return true;
    }

    //check account invites
    const existing_account_invites = helper.emptyOrSingle(await db.query(
      `select 
        ${query_columns.join(",")}
      from (
        select 
          invite_status, ${generated_columns.join(",")} 
        from account_invites) as users_gmails 
      where ${query_filters.join(" or ")} and invite_status<>'cancelled';`, 
      query_params));

    if(!helper.isEmptyObj(existing_account_invites)){
      if(throw_exception_if_duplicate) {
        throw new Error(`An account invite with an address equivalent to ${email_address} already exists.`);
      }
      return true;
    }    
  }
  return false;
}

//fetch an existing user by username, email address, or similar-equivalent gmail address
//by username or email address or both
async function findUser(username, email_address){

  if(!username && !email_address){
    return {};
  }

  const query_columns = ['id', 'firstname', 'lastname', 'password', 'is_verified', 'is_disabled', 'pending_verfication_code', 'verification_code_expiration'];
  const generated_columns = ['id', 'firstname', 'lastname', 'password', 'is_verified', 'is_disabled', 'pending_verfication_code', 'verification_code_expiration'];
  const query_params = [];
  const query_filters = [];
  let user_reduced_gmail_address = email_address;

  if(username){
    query_columns.push("username");
    generated_columns.push("username");
    query_params.push(username);
    query_filters.push("username=(?)");
  }

  //reduced gmail address removes dots and +... from the username, to avoid multi gmail registrations
  if(email_address){
    user_reduced_gmail_address = email.reduceGmailAddress(email_address);

    query_columns.push("email");
    generated_columns.push("email");
    query_params.push(email_address);
    query_filters.push("email=(?)");

    query_columns.push(`case 
        when email like '%@gmail.com' then reduced_gmail_address 
        else email 
      end reduced_gmail_address`);
    generated_columns.push(` concat(
          SUBSTRING_INDEX(
            replace(SUBSTRING_INDEX(email, "@", 1), ".", ""), 
            "+", 1), 
          "@", 
          SUBSTRING_INDEX(email, "@", -1)) as reduced_gmail_address `);
    query_params.push(user_reduced_gmail_address);
    query_filters.push("reduced_gmail_address=(?)");
  }

  const existing_user = await db.query(
    `select 
      ${query_columns.join(",")}
    from (
      select 
        ${generated_columns.join(",")} 
      from users) as users_gmails 
    where ${query_filters.join(" or ")};`, 
    query_params);

  return helper.emptyOrSingle(existing_user);
}

// sign up a new user
async function signup(firstname, lastname, email_address, username, password, role, is_demo_customer, active_connection=null){
  let self_executing = false;
  if(!active_connection) {
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }
  try {
    const verification_code = helper.getRandomString(6);
    const hashed_pass = await hashPassword(password);

    //check that the username and email are not taken by another user, account request, or invitation (exception will be thrown)
    await isUserTakenAnywhere(username, email_address, true);

    const code_expiration = new Date(new Date().getTime() + 60 * 60 * config.registration_code_expiration_horus * 1000);
    const result = await db.transaction_query(
      `INSERT INTO users 
      (firstname, lastname, username, email, password, is_verified, is_demo_customer, pending_verfication_code, verification_code_expiration, created_at) 
      VALUES 
      ((?), (?),(?), (?), (?), (?), (?), (?), (?), (?))`,
      [
        firstname, lastname, username, email_address, hashed_pass, false, is_demo_customer, verification_code, helper.dateStr(code_expiration), helper.dateStr(new Date())
      ],
      active_connection
    );

    if(!is_demo_customer){
      await db.transaction_query(
        `insert into user_roles (user_id, role_id) 
          select (?), r.id from roles r where r.name=(?) limit 1;`,
        [result.insertId, role],
        active_connection
      );
    }
    //demo customer has no roles
    else {
      await db.transaction_query(`delete from user_roles where user_id=(?)`, [ result.insertId ], active_connection);
    }

    await send_user_account_verification_mail(firstname, email_address, verification_code, code_expiration);

    if(self_executing) {
      await db.transaction_commit(active_connection);
    }
  }
  catch(error){
    if(self_executing) {
      await db.transaction_rollback(active_connection);
    }
    throw(error);
  }
  finally {
    if(self_executing) {
      await db.transaction_release(active_connection);
    }
  }
}

//directly adds a user to the system, no verification required
async function manual_add_user_temp(user_details, active_connection=null){
 
  //check that the user is not taken by another user, account request, or invitation (exception will be thrown)
  await isUserTakenAnywhere(null, user_details["email_address"], true);

  let self_executing = false;
  if(!active_connection) {
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }
  try {
    if(!user_details["password"]){
      throw new Error("Password is required");
    }
    const hashed_pass = await hashPassword(user_details["password"]);

    if(!user_details["email_address"] || !user_details["username"]) {
      throw new Error("Username and email are required");
    }

    let role_id=0;
    if(!user_details["role_name"] && !user_details["role_id"]) {
      throw new Error("role_name or role_id is required");
    }
    
    if(!user_details["is_demo_customer"]) {
      if(user_details["role_id"]){
        const id_num = parseInt(user_details["role_id"]);
        if(isNaN(id_num)) {
          throw new Error(`Role ID '${user_details["role_id"]}' is invalid`);
        }
        role_id = id_num;
      }
      else if(user_details["role_name"]){
        const role_id_by_name = helper.emptyOrSingle(await db.query(`select id from roles where name=(?)`, [user_details["role_name"]]));
        if(helper.isEmptyObj(role_id_by_name)) {
          throw new Error(`Role with name '${user_details["role_name"]}' not found`);
        }
        else {
          role_id = parseInt(role_id_by_name["id"]);
        }
      }
    }

    const reduced_gmail_address = email.reduceGmailAddress(user_details["email_address"]);
    const existing_user_rec = await findUser(user_details["username"], user_details["email_address"])
    if(!helper.isEmptyObj(existing_user_rec)){
      if(existing_user_rec['email'] && existing_user_rec['email'].toUpperCase() == user_details["email_address"].toUpperCase()){
        throw new Error(`A user with email address ${user_details["email_address"]} already exists.`);
      }
      if(existing_user_rec['username'] && existing_user_rec['username'].toUpperCase() == user_details["username"].toUpperCase()){
        throw new Error(`A user with username ${user_details["username"]} already exists.`);
      }
      if(existing_user_rec['reduced_gmail_address'] && existing_user_rec['reduced_gmail_address'].toUpperCase() == reduced_gmail_address.toUpperCase()){
        throw new Error(`A user with an address equivalent to ${user_details["email_address"]} already exists.`);
      }      
    }
    const result = await db.transaction_query(
      `INSERT INTO users 
      (firstname, lastname, username, email, password, is_verified, pending_verfication_code, verification_code_expiration, created_at, is_demo_customer) 
      VALUES 
      ((?), (?),(?), (?), (?), (?), (?), (?), (?), (?))`,
      [
        user_details["firstname"], 
        user_details["lastname"], 
        user_details["username"], 
        user_details["email_address"], 
        hashed_pass, 
        true, 
        '', 
        null, 
        helper.dateStr(new Date()),
        user_details["is_demo_customer"]
      ],
      active_connection
    );
    const new_user_id = result.insertId;
    if(!user_details["is_demo_customer"]){
      await db.transaction_query(
        `insert into user_roles (user_id, role_id) values ((?),(?))`,
        [new_user_id, role_id], 
        active_connection);

      if(user_details["customer_ids"] && user_details["customer_ids"].length > 0){
        const existing_customer_ids = helper.emptyOrRows((await db.query(
          `select id from customers where id in (${user_details["customer_ids"].map(id => "?").join(",")})`, 
          user_details["customer_ids"])));
        if(existing_customer_ids.length > 0){
          const ids = existing_customer_ids.map(c => c.id);

          await db.transaction_query(
            `insert into user_customers (user_id, customer_id) values ${ids.map(id => "((?),(?))").join(",")}`,
            ids.map(id => [new_user_id, id]).flat(), 
            active_connection);          
        }
      }
    }
    else {
      await db.transaction_query(`delete from user_roles where user_id=(?)`, [ result.insertId ], active_connection);
    }

    if(self_executing) {
      await db.transaction_commit(active_connection);
    }

    return result;
  }
  catch(error){
    if(self_executing) {
      await db.transaction_rollback(active_connection);
    }
    throw(error);
  }
  finally {
    if(self_executing) {
      await db.transaction_release(active_connection);
    }
  }
}

//fetch an existing user by the sent verification code
async function findUserByVerificationCode(verification_code){
  const existing_user = await db.query(
    `select 
      firstname, lastname, username, email, 
      is_verified, is_disabled, pending_verfication_code, verification_code_expiration, is_demo_customer
    from users 
    where 
      pending_verfication_code=(?);`, 
    [verification_code]);

  return helper.emptyOrSingle(existing_user);
}

// send the user an email with verification code
async function send_user_account_verification_mail(firstname, email_address, verification_code, code_expiration){
    const subject = "RomTech account verification";
    const email_parts = email_tempates.sign_up_verification(
      firstname, 
      email_address,
      process.env.EMAIL_LINKS_DOMAIN, 
      verification_code, 
      code_expiration
    );
    await email.sendMail(email_address, null, null, subject, email_parts.body, email_parts.attachments);
}

//function account_invitation_to_user(user_firstname, server_address, invitation_code) {
async function send_new_account_invitation_to_user(user_firstname, email_address, invitation_code){
    const subject = "Romtech account invitation";
    const email_parts = email_tempates.account_invitation_to_user(user_firstname, process.env.EMAIL_LINKS_DOMAIN, invitation_code);
    await email.sendMail(email_address, null, null, subject, email_parts.body, email_parts.attachments);
}

async function send_account_invitation_accepted_notification_to_admin(admin_email_address, admin_firstname, requester_firstname, requester_lastname, requester_email, invitation_id, created_user_id) {
  const subject = "Account invitation accepted!";
  const email_parts = email_tempates.invitation_accepted_admin_notification(admin_firstname, requester_firstname, requester_lastname, requester_email, invitation_id, created_user_id, process.env.EMAIL_LINKS_DOMAIN);
  await email.sendMail(admin_email_address, null, null, subject, email_parts.body, email_parts.attachments);
}

async function send_new_email_verification(firstname, email_address, old_email_address, verification_code){
    const subject = "Your Romtech email has been changed";
    const email_parts = email_tempates.email_change_verification(
      firstname,
      old_email_address,
      process.env.EMAIL_LINKS_DOMAIN, 
      verification_code
    );
    await email.sendMail(email_address, null, null, subject, email_parts.body, email_parts.attachments);
}

async function send_password_change_norification(firstname, email_address, verification_code){
    const subject = "Your password was changed";
    const email_parts = email_tempates.password_change_notification(
      firstname,
      process.env.EMAIL_LINKS_DOMAIN, 
      verification_code
    );
    await email.sendMail(email_address, null, null, subject, email_parts.body, email_parts.attachments);
}

async function send_forgot_password_norification(firstname, email_address, verification_code){
    const subject = "Forgot your password?";
    const email_parts = email_tempates.password_forgotten_notification(
      firstname,
      process.env.EMAIL_LINKS_DOMAIN, 
      verification_code
    );
    await email.sendMail(email_address, null, null, subject, email_parts.body, email_parts.attachments);
}



// verify the user's account based on their verification code
async function verifyUserSignupCode(user_verification_code, active_connection=null){

  let self_executing = false;
  if(!active_connection) {
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }
  try {
    const existing_user_rec = await findUserByVerificationCode(user_verification_code);
    if(!helper.isEmptyObj(existing_user_rec)){
      const expiration_date = existing_user_rec['verification_code_expiration'];
      const is_verified = existing_user_rec['is_verified'];

      if(existing_user_rec["is_disabled"] != 0){
        throw new Error("This account is disabled");
      }

      if(is_verified){
        throw new Error(`User already verified`);
      }
      if(expiration_date){
        const now = new Date();
        const diff = helper.dates_diff(now, expiration_date);
        if(!diff.future){
          throw new Error(`Code has expired`);
        }
        //validate the user
        //update users set is_verified=1, pending_verfication_code=null, verification_code_expiration=null where pending_verfication_code='F2RHOR';
        const result = await db.transaction_query(
          `update users set 
            is_verified=1,
            pending_verfication_code=null,
            verification_code_expiration=null 
          where 
            pending_verfication_code=(?)`,
          [
            user_verification_code
          ],
          active_connection
        );
      }
      else {
        throw new Error(`Invalid code expiration data`);
      }
    }
    else {
      throw new Error(`Invalid code`);
    }     

    if(self_executing) {
      await db.transaction_commit(active_connection);
    }
    return("User verified successfully");
  }
  catch(error){
    if(self_executing) {
      await db.transaction_rollback(active_connection);
    }
    throw(error);
  }
  finally {
    if(self_executing) {
      await db.transaction_release(active_connection);
    }
  }
}

async function verifyNewUserEmailCode(email_verification_code, cancel_mail_change, active_connection=null){

  let self_executing = false;
  if(!active_connection) {
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }
  try {
    const pending_user_rec = await db.query(`select * from users where pending_new_email_code=(?)`, [email_verification_code]);
    const pending_user = helper.emptyOrSingle(pending_user_rec);
    if(helper.isEmptyObj(pending_user)){
      throw new Error("Invalid code");
    }

    let message = "";
    if(cancel_mail_change){
      await db.transaction_query(
        `update users set pending_new_email=null, pending_new_email_code=null
        where pending_new_email_code=(?)`,
        [ email_verification_code],
        active_connection);
      message = "Mail change cancelled successfully";
    }
    else {
      await db.transaction_query(
        `update users set email=(?), pending_new_email=null, pending_new_email_code=null
        where pending_new_email_code=(?)`,
        [ pending_user["pending_new_email"],  email_verification_code],
        active_connection);
      message = "Email verified successfully";
    }

    if(self_executing) {
      await db.transaction_commit(active_connection);
    }
    return(message);
  }
  catch(error){
    if(self_executing) {
      await db.transaction_rollback(active_connection);
    }
    throw(error);
  }
  finally {
    if(self_executing) {
      await db.transaction_release(active_connection);
    }
  }
}
/**
users.reset_password(req.body.code, req.body.password);
 */
async function reset_password(code, password, sign_out_from_all, active_connection=null){
  let self_executing = false;
  if(!active_connection) {
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }
  try {  
    if(!code || !password){
      throw new Error("A password and a valid security code are required!");
    }

    const user_rec = helper.emptyOrSingle(await db.query(`select * from users where pending_verfication_code=(?)`, [ /*helper.decBase64(*/code/*)*/ ]));
    if(helper.isEmptyObj(user_rec)){
      throw new Error("Invalid code");
    }

    if(user_rec["is_disabled"] != 0){
      throw new Error("This account is disabled");
    }

    if(user_rec['is_verified'] != 1){
      throw new Error(`User account has not been verified`);
    }

    //-------------------------------------
    await db.transaction_query(`update users set pending_verfication_code=null, password=(?) where id=(?)`, 
      [ await hashPassword(password), user_rec["id"] ], 
      active_connection);

      if(sign_out_from_all){
        await db.transaction_query(`delete from logins where user_id=(?)`,
          [ user_rec["id"] ],
          active_connection);
      }

    if(self_executing) {
      await db.transaction_commit(active_connection);
    }
    return "Password reset successfully";
  }
  catch(error){
    if(self_executing) {
      await db.transaction_rollback(active_connection);
    }
    throw(error);
  }
  finally {
    if(self_executing) {
      await db.transaction_release(active_connection);
    }
  }
}

//(req.body.email_address
async function forgot_password(email_address, active_connection=null){
  let self_executing = false;
  if(!active_connection) {
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }
  try {  
    if(!email_address){
      throw new Error("An email address is required!");
    }

    const user_rec = helper.emptyOrSingle(await db.query(`select * from users where email=(?)`, [ email_address ]));
    if(helper.isEmptyObj(user_rec)){
      throw new Error("Email address not found");
    }

    if(user_rec["is_disabled"] != 0){
      throw new Error("This account is disabled");
    }

    if(user_rec['is_verified'] != 1){
      throw new Error(`User account has not been verified`);
    }

    //-------------------------------------
    const reset_password_code = helper.getRandomString(10);
    await db.transaction_query(
      `update users set pending_verfication_code=(?) where id=(?)`,
      [ reset_password_code, user_rec['id'] ],
      active_connection);
    
      await send_forgot_password_norification(user_rec['firstname'], email_address, reset_password_code);
      //--------------------------------------------
    if(self_executing) {
      await db.transaction_commit(active_connection);
    }
    return "Reset email sent successfully";
  }
  catch(error){
    if(self_executing) {
      await db.transaction_rollback(active_connection);
    }
    throw(error);
  }
  finally {
    if(self_executing) {
      await db.transaction_release(active_connection);
    }
  }
}

// send a newly registered user an email with account verification code
async function sendUserRegistrationVerificationCode(email_address, active_connection=null){
  let self_executing = false;
  if(!active_connection) {
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }
  try {  
  //==
    const existing_user_rec = await findUser(null, email_address);
    if(helper.isEmptyObj(existing_user_rec)){
      throw new Error(`No user found by email address ${email_address}`);
    }
    else {
      const user_id = existing_user_rec['id'];
      const firstname = existing_user_rec['firstname'];
      let verification_code = existing_user_rec['pending_verfication_code'];
      let expiration_date = existing_user_rec['verification_code_expiration'];
      const is_verified = existing_user_rec['is_verified'];

      if(existing_user_rec["is_disabled"] != 0){
        throw new Error("This account is disabled");
      }
      
      if(is_verified){
        throw new Error(`User already verified`);
      }
      if(expiration_date){
        const now = new Date();
        const diff = helper.dates_diff(now, expiration_date);
        if(!diff.future){
          verification_code = helper.getRandomString(6);
          expiration_date = new Date(new Date().getTime() + 60 * 60 * config.registration_code_expiration_horus * 1000);
          await db.transaction_query(
            `update users 
              set 
                pending_verfication_code=(?), 
                verification_code_expiration=(?) 
              where id=(?)`,
            [
              verification_code, helper.dateStr(expiration_date), user_id
            ],
            active_connection
          );
        }    
      }
      //send
      await send_user_account_verification_mail(firstname, email_address, verification_code, expiration_date);
    }

    if(self_executing) {
      await db.transaction_commit(active_connection);
    }
    return "Code sent successfully";
  }
  catch(error){
    if(self_executing) {
      await db.transaction_rollback(active_connection);
    }
    throw(error);
  }
  finally {
    if(self_executing) {
      await db.transaction_release(active_connection);
    }
  }
}

async function resendChangedEmailConfirmationCode(email_address){
  const user_rec = await db.query(`select * from users where pending_new_email=(?)`, [ email_address ]);
  const existing_user = helper.emptyOrSingle(user_rec);

  if(!helper.isEmptyObj(existing_user)){

    if(existing_user["is_disabled"] != 0){
      throw new Error("This account is disabled");
    }

    if(existing_user['is_verified'] != 1){
      throw new Error(`User account has not been verified`);
    }  

    const firstname = existing_user["firstname"];
    const old_email_address = existing_user["email"];
    const verification_code = existing_user["pending_new_email_code"];
    await send_new_email_verification(firstname, email_address, old_email_address, verification_code);
    return "Verification code sent";
  }
  else {
    throw new Error("No such address pending verification");
  }
}


// retrieve basic information on a user (for the currently logged in user)
async function getBaseUserInfo(userId){
    const rows = await db.query(
      `select id, firstname, lastname, username, email, is_verified, is_disabled, photo_url, is_demo_customer from users where id=(?);`,
      [userId]
    );
    //console.log("user id: " + userId);
    //console.dir(rows);
    const user = helper.emptyOrSingle(rows);

    if(user["is_verified"] == 0){
      throw new Error("Account not verified. Please check your email!");
    }

    //console.log("disabled " + user["is_disabled"]);
    if(user["is_disabled"] != 0){
      throw new Error("This account is disabled");
    }

    const role_names = await db.query(
      `select r.name
          from users u 
          inner join user_roles ur on u.id = ur.user_id
          inner join roles r on r.id = ur.role_id 
        where u.id=(?);`, [userId]);
    if(!helper.isEmptyObj(helper.emptyOrRows(role_names))){
      user["roles"] = role_names.map(r => r["name"]);
    }
    user["is_demo_customer"] = helper.var_to_bool(user["is_demo_customer"]);
    user["area_permissions"] = await getUserPermissions(userId);
    return user;
}

async function getUserPermissions(userId){
  
  const user = helper.emptyOrSingle(await db.query(`select * from users where id=(?)`, [userId]));
  if(helper.isEmptyObj(user)){
    throw new Error("User not found");
  }
  if(user["is_disabled"] != 0){
    throw new Error("This account is disabled");
  }

  return helper.emptyOrRows(await db.query(
    `select rp.area, rp.permissions 
      from role_permissions rp 
      inner join roles r on r.id=rp.role_id 
      inner join user_roles ur on ur.role_id=r.id
      where ur.user_id=(?);`,
      [userId]));
}

async function getUserProfile(userId, active_connection=null){
  const user_query = `select id, firstname, lastname, username, email, pending_new_email, is_verified, is_disabled, photo_url, phone, created_at, is_demo_customer from users where id=(?);`;
  const rows = (active_connection)? 
    await db.transaction_query(user_query,[userId], active_connection):
    await db.query(user_query,[userId]);
  const user = helper.emptyOrSingle(rows);

  user["is_demo_customer"] = helper.var_to_bool(user["is_demo_customer"]);

  if(user["is_verified"] == 0){
    throw new Error("Account not verified. Please check your email!");
  }

  //console.log("disabled " + user["is_disabled"]);
  if(user["is_disabled"] != 0){
    throw new Error("This account is disabled");
  }

  const roles_query = `select r.name, r.id
        from users u 
        inner join user_roles ur on u.id = ur.user_id
        inner join roles r on r.id = ur.role_id 
      where u.id=(?);`;
  const role_names = (active_connection)?
    await db.transaction_query(roles_query, [userId], active_connection):
    await db.query(roles_query, [userId]);

  if(!helper.isEmptyObj(helper.emptyOrRows(role_names))){
    user["roles"] = role_names.map(r => { return { id: r["id"], name: r["name"] }; } );
  }

  if(role_names.find(r => r.name.toUpperCase() == "CUSTOMER")) {
    const customer_query = `select c.id, c.name, c.is_demo_customer
        from user_customers uc inner join customers c on c.id = uc.customer_id
      where uc.user_id=(?);`;
    const linked_customers = (active_connection)?
      await db.transaction_query(customer_query, [userId], active_connection):
      await db.query(customer_query, [userId]);

    if(!helper.isEmptyObj(helper.emptyOrRows(linked_customers))){
      user["customers"] = linked_customers.map(r => 
        { return { 
          id: r["id"], 
          name: r["name"], 
          is_demo_customer: helper.var_to_bool(r["is_demo_customer"]) 
        }; 
      });
    }      
  }
  return user;
}

async function finalize_accepted_invitation(invitation_info, invitation_code, active_connection=null){
  let self_executing = false;
  if(!active_connection) {
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }
  try {  

    //find the invitation
    const invitation_rec = helper.emptyOrSingle(await db.query(
      `
      select ai.*, u.firstname inviter_firstname, u.email inviter_email from account_invites ai
        inner join users u on ai.inviter_user_id = u.id
      where ai.account_creation_code=(?) and ai.id=(?)`, [invitation_code, invitation_info["id"]]));
    if(helper.isEmptyObj(invitation_rec)){
      throw new Error("Invalid invitation code");
    }

    //create the user
    const user_rec = await db.transaction_query(
    `INSERT INTO users 
     (
      firstname, lastname, username, email, password, 
        is_verified, is_disabled, pending_verfication_code, verification_code_expiration, created_at, is_demo_customer) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        invitation_info["firstname"], 
        invitation_info["lastname"], 
        invitation_info["username"], 
        invitation_rec["email"], 
        await hashPassword(invitation_info['new_password']),
        true,
        false,
        null,
        null,
        helper.dateStr(new Date()),
        invitation_rec["is_demo_customer"]
      ],
      active_connection
    );

    //apply role
    if(invitation_rec["account_role_id"]){
      await db.transaction_query(
        `insert into user_roles (user_id, role_id) values ((?),(?))`,
        [user_rec.insertId, invitation_rec["account_role_id"]], 
        active_connection);
    }

    const customers = require("./customers");
    let customer_id_to_link = [];
    //connect to customer, create if needed if needed
    // * if demo customer, create and connet to a new demo customer
    // * if not demo customer, and requires personal customer, crate it and connect to it
    if(invitation_rec["is_demo_customer"] || invitation_rec["create_new_customer"]){
      const new_customer = await customers.save({
          id: 0,
          name: `${invitation_info.firstname} ${invitation_info.lastname}`,
          business_name: `${invitation_info.firstname} ${invitation_info.lastname}`,
          email: invitation_info["email"],
          phone: invitation_info.phone,
          tax_id: null,
          customer_code: null,
          created_at: helper.nowDateStr(),
          updated_at: helper.nowDateStr(),
          created_by: invitation_rec["inviter_user_id"],
          updated_by: invitation_rec["inviter_user_id"],
          banks: [],
          banks_baby_allocations: [],
          babies: [],
          is_demo_customer: invitation_rec.is_demo_customer          
        },
        invitation_rec["inviter_user_id"],
        active_connection
      );
      customer_id_to_link.push(new_customer.customer.id);
    }

    //get only ids of really existing customers
    const invitation_customers = helper.emptyOrRows(await db.query(
      `select aic.customer_id  
        from 
      account_invites_customers aic inner join customers c on aic.customer_id = c.id
      where aic.account_invite_id=(?)`, 
    [invitation_rec["id"]]));
    if(invitation_customers.length > 0){
      customer_id_to_link = customer_id_to_link.concat(invitation_customers.map(c => c.customer_id));
    }

    // * link to existing customers by id
    if(customer_id_to_link.length > 0){
      await db.transaction_query(
        `insert into user_customers (user_id, customer_id) values ${customer_id_to_link.map(id => "((?),(?))").join(",")}`,
        customer_id_to_link.map(id => [user_rec.insertId, id]).flat(), 
        active_connection);
    }

    //change the invitation status to accepted
    await db.transaction_query(
      `update account_invites set invite_status=(?), last_update=(?), created_account_user_id=(?), account_creation_code=(?) where id=(?)`,
      ["verified", helper.nowDateStr(), user_rec.insertId, null, invitation_rec["id"]],
      active_connection);

    //send an email to the admin who invited the user
    await send_account_invitation_accepted_notification_to_admin(
      invitation_rec["inviter_email"], invitation_rec["inviter_firstname"], 
      invitation_info["firstname"], invitation_info["lastname"], invitation_info["email"], 
      invitation_rec["id"], user_rec.insertId);

    //return the user record
    return helper.emptyOrSingle(await db.transaction_query(`select * from users where id=(?)`, [user_rec.insertId], active_connection));
  }
  catch(error){
    if(self_executing) {
      await db.transaction_rollback(active_connection);
    }
    throw(error);
  }
  finally {
    if(self_executing) {
      await db.transaction_release(active_connection);
    }
  }    
}

// Save user profile info
async function saveUserProfile(updateProfileInfo, photo_url, active_connection=null){
  //check if there is an active connection called from another function, or this call is a standalone
  let self_executing = false;
  if(!active_connection) {
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }
  try {
    let update_fields = ['firstname=(?)', 'lastname=(?)', 'phone=(?)'];
    let update_values = [updateProfileInfo['firstname'], updateProfileInfo['lastname'], updateProfileInfo['phone]']??''];

    let existing_user = null;
    let user_found_on_invite = false;
    //first try to find the user by sent id. if no such user is found, it may be an id of an invitation.
    //we'll have to first find the invitation, realize it (i.e. create the user), then update it accordingly
    existing_user = helper.emptyOrSingle(await db.query(`select * from users where id=(?) limit 1`, [updateProfileInfo["id"]]));
    
    if(helper.isEmptyObj(existing_user)){
      existing_user = await finalize_accepted_invitation(updateProfileInfo, updateProfileInfo["profile_code"], active_connection);
      user_found_on_invite = true;
    }

    if(updateProfileInfo["profile_code"] && !user_found_on_invite) {
      if(updateProfileInfo["profile_code"] != existing_user["pending_verfication_code"]){
        throw new Error("Invalid code");
      }
      if(!updateProfileInfo["username"]) {
        throw new Error("Username is required");
      }
      update_fields.push('pending_verfication_code=(?)', 'username=(?)', 'is_verified=(?)');
      update_values.push(null, updateProfileInfo["username"], 1);
    }
    else {
      if(existing_user["is_verified"] == 0){
        throw new Error("Account not verified. Please check your email!");
      }
    }
    
    let updated_mail = false;
    let updated_pass = false;
    let new_email_code = '';
    let reset_password_code = '';
    if(!helper.isEmptyObj(existing_user)) {
            if(existing_user["is_disabled"] != 0){
        throw new Error("This account is disabled");
      }

      if(
        //if a new user email was sent, which is not yet the pending email, set it as the pending email
        updateProfileInfo["email"] && 
        existing_user["email"] != updateProfileInfo["email"] &&
        existing_user["pending_new_email"] != updateProfileInfo["email"]) {
          //check that no other user alreadh has this email
          const existing_other_user_with_the_new_email = await findUser(null, updateProfileInfo["email"]);
          if(!helper.isEmptyObj(existing_other_user_with_the_new_email) && existing_other_user_with_the_new_email["id"] != updateProfileInfo["id"]) {
            throw new Error(`A user with email ${updateProfileInfo["email"]} already exists`);
          }
          new_email_code = helper.getRandomString(10);
          update_fields.push('pending_new_email=(?)', 'pending_new_email_code=(?)');
          update_values.push(updateProfileInfo["email"], new_email_code);
          updated_mail = true;
      }
      else {
        //otherwise, if the new user mail is already equal to the saved user mail, clear the pending
        if(existing_user["email"] == updateProfileInfo["email"]){
          update_fields.push('pending_new_email=(?)', 'pending_new_email_code=(?)');
          update_values.push(null, null);
          updated_mail = false;
        }
      }
      
      //if the user is verifying their profile (profile_code exists and matched), set their password 
      if(updateProfileInfo["profile_code"]) {
        update_fields.push('password=(?)');
        update_values.push(await hashPassword(updateProfileInfo['new_password']));
      }
      //otherwise, handle a password-change scenario
      else {
        if(updateProfileInfo['password'] && updateProfileInfo['new_password']){
          const password_match = await bcrypt.compare(updateProfileInfo['password'], existing_user["password"]);
          if(!password_match){
            throw new Error("Original password is wrong");
          }
          else {
            const hashed_pass = await hashPassword(updateProfileInfo['new_password']);
            reset_password_code = helper.getRandomString(10);
            update_fields.push('password=(?)', 'pending_verfication_code=(?)');
            update_values.push(hashed_pass, reset_password_code);
            updated_pass = true;
          }
        }
      }
      //if(photo_url){
      //remove the old photo
      if(photo_url){
        let current_photo_url = existing_user["photo_url"];
        if(current_photo_url){
          fs.rmSync(path.join(config.server_root, current_photo_url), {
              force: true,
          });
        }
      }
      else {
        photo_url = updateProfileInfo["photo_url"];
      }
      update_fields.push('photo_url=(?)');
      update_values.push(photo_url);
      //}

      await db.transaction_query(
        `update users 
          set ${update_fields.join(',')}
        where id=(?)`,
        [...update_values, existing_user["id"]], 
        active_connection);
      
      if(updated_mail){
        //send email update verification
        await send_new_email_verification(updateProfileInfo['firstname'], updateProfileInfo["email"], existing_user["email"], new_email_code);
      }
      if(updated_pass){
        //send email for updated pass to the original email, as the new one is not verified yet
        await send_password_change_norification(updateProfileInfo['firstname'], existing_user["email"], reset_password_code);
      }

      //return await getUserProfile(updateProfileInfo["id"]);
    }
    else {
      throw new Error("User not found");
    }

    if(self_executing) {
      await db.transaction_commit(active_connection);
    }
    return await getUserProfile(existing_user["id"], active_connection);
  }
  catch(error){
    if(self_executing) {
      await db.transaction_rollback(active_connection);
    }
    throw(error);
  }
  finally {
    if(self_executing) {
      await db.transaction_release(active_connection);
    }
  }
}

async function fetch_user_info_for_account(user_rec){
  if(helper.isEmptyObj(user_rec)) {
    throw new Error("Invalid user code");
  }

  if(user_rec["is_disabled"] != 0){
    throw new Error("This account is disabled");
  }

  const roles_recs = helper.emptyOrRows(await db.query(
    `select 
      r.id, r.name 
    from 
      users u 
      inner join user_roles ur on ur.user_id=u.id 
      inner join roles r on ur.role_id=r.id
    where u.pending_verfication_code=(?);`,
  [ code ]));

  const customer_recs = (roles_recs.length > 0 && roles_recs[0]["name"]=="customer")? 
    helper.emptyOrRows(await db.query(
      `select
        c.id, c.name, c.is_demo_customer
      from 
        users u 
        inner join user_customers uc on uc.user_id=u.id 
        inner join customers c on uc.customer_id =c.id 
      where u.pending_verfication_code=(?);`,
    [ code ])) : [];

 return {
  id: user_rec["id"],
  firstname: user_rec["firstname"],
  lastname: user_rec["lastname"],
  username: "",
  email: user_rec["email"],
  pending_new_email: "",
  photo_url: "",
  phone: user_rec["phone"],
  registered_on: user_rec["created_at"],
  roles: roles_recs,
  is_demo_customer: helper.var_to_bool(user_rec["is_demo_customer"]),
  customers: customer_recs.map(c => { return {
    id: c["id"],
    name: c["name"],
    is_demo_customer: helper.var_to_bool(c["is_demo_customer"])
  }; })
 };
}

async function fetch_user_info_by_invitation_code(invitation_code){

  const invite_rec = helper.emptyOrSingle(await db.query(
    'select * from account_invites where account_creation_code=(?)', 
    [ invitation_code ]));

  if(helper.isEmptyObj(invite_rec)) {
    throw new Error("Invalid code, or invitation already activated");
  }
  
  const roles_recs = helper.emptyOrRows(await db.query(
    `select 
      r.id, r.name 
    from 
      account_invites ai 
      inner join roles r on ai.account_role_id=r.id
    where ai.account_creation_code=(?);`,
  [ invitation_code ]));

  const customer_recs = (roles_recs.length > 0 && roles_recs[0]["name"]=="customer")? 
    helper.emptyOrRows(await db.query(
      `select c.id, c.name, c.is_demo_customer 
      from 
        account_invites_customers aic 
        inner join customers c on aic.customer_id=c.id
        where aic.account_invite_id=(?);`,
    [ invitation_code ])) : [];

  return {
    id: invite_rec["id"],
    firstname: invite_rec["firstname"],
    lastname: invite_rec["lastname"],
    username: "",
    email: invite_rec["email"],
    pending_new_email: "",
    photo_url: "",
    phone: "",
    registered_on: invite_rec["sent_date"],
    roles: roles_recs,
    is_demo_customer: helper.var_to_bool(invite_rec["is_demo_customer"]),
    customers: customer_recs.map(c => { return {
      id: c["id"],
      name: c["name"],
      is_demo_customer: helper.var_to_bool(c["is_demo_customer"])
    }; })
  };    
}

//will get the base user profile by pending verification code. Either in the users table, or a pending user invitation
async function getUserProfile_by_code(verification_code){

  const code = verification_code; //helper.decBase64(verification_code);

  const user_rec = helper.emptyOrSingle(await db.query(
    'select * from users where pending_verfication_code=(?)', 
    [ code ]));
  
  if(!helper.isEmptyObj(user_rec)) {
    return await fetch_user_info_for_account(user_rec);
  }
  else {
    return await fetch_user_info_by_invitation_code(code);
  }
}

// Generate an auth token for authentication, or refresh
function generateAuthToken(payload, tokenMaxExpirationSeconds) {
    
    // 3. Always sign the token with the SHORT 10-minute security expiration
    return jwt.sign(
      payload, 
      process.env.AUTH_TOKEN_SECRET, 
      { 
        expiresIn: tokenMaxExpirationSeconds
      }
    );
};

// clean up expired logins / refresh-tokens
async function cleanup_expired_tokens(user_id=0, active_connection=null){
  //check if there is an active connection called from another function, or this call is a standalone
  let self_executing = false;
  if(!active_connection) {
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }
  try {
    let filter = `where refresh_token_expiration < (?)`;
    filter_fields = [ helper.dateStr(new Date()) ];
    
    if(user_id > 0){
      filter += ` and user_id=(?)`;
      filter_fields.push(user_id);
    }

    await db.transaction_query(`delete from logins ${filter}`,
      filter_fields,
      active_connection);

    if(self_executing) {
      await db.transaction_commit(active_connection);
    }
  }
  catch(error){
    if(self_executing) {
      await db.transaction_rollback(active_connection);
    }
    throw(error);
  }
  finally {
    if(self_executing) {
      await db.transaction_release(active_connection);
    }
  }    
}

// sign in a user into the system
async function signin(
  username_or_email, password, rememberme, ipaddress, 
  origin_geolocation, origin_city, origin_country, origin_os, origin_browser,
  cookies, active_connection=null){
  //check if there is an active connection called from another function, or this call is a standalone
  let self_executing = false;
  if(!active_connection) {
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }
  try {
    if(!username_or_email || !password) {
      throw new Error("Missing credentials");
    }

    //check the user
    const user = (username_or_email.indexOf("@")>0)?
      await findUser(null, username_or_email):
      await findUser(username_or_email, null);

    if(helper.isEmptyObj(user)){
      throw new Error("User or email not found");
    }

    //check the password
    const password_match = await bcrypt.compare(password, user["password"]);
    if(!password_match){
      throw new Error("Invalid credentials");
    }

    if(user["is_verified"] == 0){
      throw new Error("Account not verified. Please check your email!");
    }

    //console.log("disabled " + user["is_disabled"]);
    if(user["is_disabled"] != 0){
      throw new Error("This account is disabled");
    }

    // Check if there is a cookie with refresh token in the request
    // remove it from the logins table, clear the cookies, and send a new one
    if(cookies && cookies.refresh_token){
      const current_user_cookie_token = cookies.refresh_token;
      if(current_user_cookie_token){
        await db.transaction_query(
          `delete from logins where refresh_token=(?)`, 
          [current_user_cookie_token], 
          active_connection);
      }
    }

    await cleanup_expired_tokens(0, active_connection);

    //generate an access token -> returned to the client (5 minutes)
    const userInfo = await getBaseUserInfo(user.id);
    const access_token = generateAuthToken(
      userInfo, 
      1 * helper.secondsFrom.minutes
    );

    //generate a refresh token -> set as cookie (expiration 1 day / 30 days)
    const now = new Date();
    const refresh_token_expiration_Days = (rememberme)? 30 : 1;
    const refresh_token_expiration_date = new Date(new Date().setDate(now.getDate() + refresh_token_expiration_Days));
    const refresh_token = generateAuthToken(
      {}, 
      1 * (refresh_token_expiration_Days * helper.secondsFrom.days)
    );

    //save refresh token & details -> to db
    let insert_fields = [
      "user_id",  "logged_in_at", "origin_ip_address", "last_refresh_token_time", "refresh_token_expiration", 
      "refresh_token", "origin_geolocation", "origin_city", "origin_country", "origin_os", "origin_browser"
    ];
    let insert_values = [
      user.id, helper.dateStr(now), ipaddress, helper.dateStr(now),  helper.dateStr(refresh_token_expiration_date), 
      refresh_token, origin_geolocation, origin_city, origin_country, origin_os, origin_browser
    ];
    await db.transaction_query(
      `INSERT INTO logins 
      (${insert_fields.join(', ')}) 
      VALUES 
      (${insert_fields.map(item => "(?)").join(", ")})`,
      insert_values,
      active_connection
    );

    if(self_executing) {
      await db.transaction_commit(active_connection);
    }

    // send sign-in notification?
    return { access_token, refresh_token, refresh_token_expiration_date, userInfo };
  }
  catch(error){
    if(self_executing) {
      await db.transaction_rollback(active_connection);
    }
    throw(error);
  }
  finally {
    if(self_executing) {
      await db.transaction_release(active_connection);
    }
  }
}

async function request_account(accountRequestInfo, active_connection=null){
  //check if there is an active connection called from another function, or this call is a standalone
  let self_executing = false;
  if(!active_connection) {
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }
  try {
    //check that the user is not taken by another user, account request, or invitation (exception will be thrown)
    await isUserTakenAnywhere(null, accountRequestInfo.email, true);

    const insert_result = await db.transaction_query(
      `insert into account_requests (firstname, lastname, email, phone,  details, request_date , last_update, request_status)
      values ((?), (?), (?), (?), (?), (?), (?), (?));`, 
      [ 
        accountRequestInfo.firstname,
        accountRequestInfo.lastname,
        accountRequestInfo.email,
        accountRequestInfo.phone,
        accountRequestInfo.details,
        helper.nowDateStr(),
        helper.nowDateStr(),
        "pending"
       ],
      active_connection);

    //send an email to all admins
    const administrators = helper.emptyOrRows(await db.query(
      `select u.username, u.firstname, u.lastname, u.email
        from users u inner join user_roles ur
        on u.id = ur.user_id
        inner join roles rl
        on rl.id = ur.role_id
      where 
        rl.name ='administrator'
      and 
        u.is_verified = 1 
      and 
        u.is_disabled = 0;`));
    
    if((!helper.isEmptyObj(administrators)) && (administrators.length > 0)) {

      const admins_emails = administrators.map(administrtor => administrtor["email"]);

      //**************************************************** */
      //**************************************************** */
      //**************************************************** */
      //**************************************************** */
      //const admins_emails = ["alrotem@gmail.com"]; //TEMPORARYYYYYYY!!!!!!!!
      //**************************************************** */
      //**************************************************** */
      //**************************************************** */
      //**************************************************** */

      const email_parts = email_tempates.new_account_request_notification_to_admins(
        accountRequestInfo.firstname,
        accountRequestInfo.lastname,
        accountRequestInfo.email,
        process.env.EMAIL_LINKS_DOMAIN,
        insert_result.insertId);

      await email.sendMail(
        null, null, admins_emails, 
        `New account request from ${accountRequestInfo.firstname} ${accountRequestInfo.lastname}`, 
        email_parts.body, email_parts.attachments);
    }

    if(self_executing) {
      await db.transaction_commit(active_connection);
    }

    return true;
  }
  catch(error){
    if(self_executing) {
      await db.transaction_rollback(active_connection);
    }
    throw(error);
  }
  finally {
    if(self_executing) {
      await db.transaction_release(active_connection);
    }
  }
}

async function get_account_requests(page = 1, perPage){
  let subset =  '';
  //console.log("page -> " + page);
  //console.log("perPage -> " + perPage);
  //console.log("(page && perPage) -> " + (page && perPage));  
  if(page && perPage && page > 0 && perPage > 0)
  {
    const offset = helper.getOffset(page, perPage);
    subset = `LIMIT ${offset},${perPage}`
  }
  const rows = await db.query(
    `select 
      id, firstname, lastname, email, request_date, request_status 
    from 
      account_requests 
    order by request_date desc ${subset}`
  );
  const total = await db.query(
    `SELECT count(*) as count FROM account_requests`
  );
  const total_records = total[0].count;
  /*
  const babies_quantity = await db.query(
    `select sum(quantity) as quantity from babies;`
  );
  const total_babies = babies_quantity[0]['quantity'];
  */
  const total_pages = Math.ceil(total_records / perPage);
  const data = helper.emptyOrRows(rows);
  const meta = {page, total_records, total_pages};

  return {
    data,
    meta
  }
}

async function getAccountRequestDetails(id){
  const request = helper.emptyOrSingle(
  await db.query(
    `select
      ar.id, ar.firstname, ar.lastname, ar.email, ar.phone, ar.details, ar.request_date, ar.last_update, 
      ar.approved_account_user_id, ar.approver_user_id, ar.request_status,
      u.firstname user_firstname, u.lastname user_lastname, u.photo_url user_photo_url,
      u_approver.firstname approver_firstname, u_approver.lastname approver_lastnme, u_approver.photo_url approver_photo_url,
      ar.is_demo_customer
    from 
      account_requests ar left join users u 
      on ar.approved_account_user_id  = u.id
      
      left join users u_approver
      on u_approver.id = ar.approver_user_id
    where ar.id=(?);`, [ id ]));

  if(!helper.isEmptyObj(request)){
    request["is_demo_customer"] = helper.var_to_bool(request["is_demo_customer"]);

    if(request["approved_account_user_id"]) {
      const role = helper.emptyOrSingle(await db.query(
        `select ur.role_id id, r.name name 
        from user_roles ur inner join roles r on ur.role_id=r.id 
        where ur.user_id=(?);`,
        [request["approved_account_user_id"]]));
      request["role"] = role;

      if(!helper.isEmptyObj(role) && role["name"] && role["name"].toUpperCase() == "CUSTOMER"){
        const request_customers = helper.emptyOrRows(await db.query(
          `select uc.customer_id id, c.name name, c.is_demo_customer is_demo_customer
          from user_customers uc inner join customers c on c.id=uc.customer_id 
          where uc.user_id=(?);`,
          [request["approved_account_user_id"]]
        ));
        request["customers"] = request_customers.map(r => { 
          return { 
              id: r["id"], 
              name: r["name"], 
              is_demo_customer: helper.var_to_bool(r["is_demo_customer"]) 
            }; 
        } );
      }
    }
    return request;
  }
  else {
    throw new Error(`Account request with ID ${id} not found`);
  }
}

async function approve_account_request(request, auth_token, active_connection=null){
  //check if there is an active connection called from another function, or this call is a standalone
  let self_executing = false;
  if(!active_connection) {
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }
  try {
    //check if the request is already approved (approved_account_user_id exists)
    const existing_request = helper.emptyOrSingle(await db.query(`select * from account_requests where id=(?)`, [request.id]));
    if(helper.isEmptyObj(existing_request)) {
      throw new Error(`Request with id ${request.id} not found`);
    }

    if(existing_request["request_status"] == "approved") {
      throw new Error(`Request with id ${request.id} has already been approved`);
    }

    const tmp_id = await helper.getRandomString(10);
    const temporary_username = `temp_${tmp_id}`;
    const temporary_password = `pass_${tmp_id}`;
    const new_user_verification_code = helper.getRandomString(6);
    //create a user with dummy password and dummy name
    
    const created_user = await db.transaction_query(
      `insert into users
        (firstname,	lastname,	username,	email,	
        password,	is_verified,	is_disabled,	
        pending_verfication_code,	verification_code_expiration,	
        phone,	created_at, is_demo_customer)
      values ((?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?), (?));`,
      [
        request.firstname, request.lastname, temporary_username, request.email,
        await hashPassword(temporary_password), false, false,
        new_user_verification_code, null, 
        request.phone, helper.nowDateStr(), request.is_demo_customer
      ],
      active_connection);
    
    const new_user_id = created_user.insertId;

    //link to a role
    await db.transaction_query(
      `insert into user_roles (user_id, role_id) values ((?),(?))`,
      [ new_user_id, request.role.id ],
      active_connection
    );

    //create a customer if requested
    if(request.role.name.toUpperCase() == "CUSTOMER") {
      let customer_ids = (request.customers)? request.customers.map(c => c.id) : [];
      if(request.create_new_customer || request.is_demo_customer){
        //local resolution, preventing a circular dependency
        const customers = require("./customers");
        const new_customer = await customers.save({
          id: 0,
          name: `${request.firstname} ${request.lastname}`,
          business_name: `${request.firstname} ${request.lastname}`,
          email: request.email,
          phone: request.phone,
          tax_id: null,
          customer_code: null,
          created_at: helper.nowDateStr(),
          updated_at: helper.nowDateStr(),
          created_by: auth_token["id"],
          updated_by: auth_token["id"],
          banks: [],
          banks_baby_allocations: [],
          babies: [],
          is_demo_customer: request.is_demo_customer
        }, 
        auth_token["id"],
        active_connection);
        const new_customer_id = new_customer.customer.id;
        //if it's a demo customer, this is the only customer that shold be linked.
        if(request.is_demo_customer){
          customer_ids=[new_customer_id];
        }
        else {
          customer_ids.push(new_customer_id);
        }
      }

      //link to customers
      if(customer_ids.length > 0){
        const customers_placeholders = customer_ids.map(i => "((?),(?))").join(",");
        await db.transaction_query(
          `insert into user_customers (user_id, customer_id) values ${customers_placeholders}`,
          customer_ids.map(i => [new_user_id , i]).flat(),
          active_connection
        );
      }
    }

    //update the requests table
    await db.transaction_query(
      `update account_requests set 
        request_status='approved',
        last_update=(?),
        approver_user_id=(?),
        approved_account_user_id=(?),
        account_role_id=(?),
        is_demo_customer=(?)
        where id=(?)`,
      [
        helper.nowDateStr(),
        auth_token["id"],
        new_user_id,
        request.role.id,
        request.is_demo_customer,
        request.id
      ], 
      active_connection
    );

    //send a notification to the user with the code
    const subject = "Your Romtech user account has been approved";
    const email_parts = email_tempates.requested_user_account_approved(
      request.firstname, 
      process.env.EMAIL_LINKS_DOMAIN, 
      new_user_verification_code, 
    );
    await email.sendMail(request.email, null, null, subject, email_parts.body, email_parts.attachments);    

    if(self_executing) {
      db.transaction_commit(active_connection);
    }

  }
  catch(error){
    if(self_executing) {
      await db.transaction_rollback(active_connection);
    }
    throw(error);
  }
  finally {
    if(self_executing) {
      await db.transaction_release(active_connection);
    }
  }
}

async function deleteccountRequest(id, active_connection=null){
  //check if there is an active connection called from another function, or this call is a standalone
  let self_executing = false;
  if(!active_connection) {
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }
  try {
    
    await db.transaction_query(
      `delete from account_requests where id=(?)`, 
      [id], active_connection)

    if(self_executing) {
      db.transaction_commit(active_connection);
    }
    return true;
  }
  catch(error){
    if(self_executing) {
      await db.transaction_rollback(active_connection);
    }
    throw(error);
  }
  finally {
    if(self_executing) {
      await db.transaction_release(active_connection);
    }
  }
}

async function invite_user(inviteDetails, auth_token, active_connection=null){
  let self_executing = false;
  if(!active_connection) {
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }
  try {
    //check if the user is not taken by another user, account request, or invitation (exception will be thrown)
    await isUserTakenAnywhere(null, inviteDetails.email, true);

    const invite_code = helper.getRandomString(10);
    const invite_rec = await db.transaction_query(
      `insert into account_invites 
        (
          firstname, lastname, email, 
          inviter_user_id, account_creation_code, 
          account_role_id, is_demo_customer, create_new_customer, invite_status,
          sent_date, last_update)
          values((?), (?), (?), (?), (?), (?), (?), (?), (?), (?), (?));`, //sent
        [
          inviteDetails.firstname,
          inviteDetails.lastname,
          inviteDetails.email,
          auth_token["id"],
          invite_code,
          inviteDetails.role.id,
          inviteDetails.is_demo_customer,
          inviteDetails.create_new_customer,
          'sent',
          helper.nowDateStr(),
          helper.nowDateStr()
        ],
        active_connection);

    //create links to customers
    if(!inviteDetails.is_demo_customer && inviteDetails.customers && inviteDetails.customers.length > 0){
      const customers_placeholders = inviteDetails.customers.map(i => "((?),(?))").join(",");
      await db.transaction_query(
        `insert into account_invites_customers (account_invite_id, customer_id) values ${customers_placeholders}`,
        inviteDetails.customers.map(c => [invite_rec.insertId , c.id]).flat(),
        active_connection
      );
    }

    //send an email to the invited user with the code and link to registration page
    await send_new_account_invitation_to_user(
      inviteDetails.firstname,
      inviteDetails.email,
      invite_code
    );

    db.transaction_commit(active_connection);

    return true;
  }
  catch(error){
    if(self_executing) {
      await db.transaction_rollback(active_connection);
    }
    throw(error);
  }
  finally {
    if(self_executing) {
      await db.transaction_release(active_connection);
    }
  } 
}

async function getInvitations(page, perPage){
  let subset =  '';
  if(page && perPage && page > 0 && perPage > 0)
  {
    const offset = helper.getOffset(page, perPage);
    subset = `LIMIT ${offset},${perPage}`
  }

  const rows = await db.query(
    `select ai.id, ai.firstname, ai.lastname, ai.email, ai.invite_status, ai.sent_date, ai.last_update, r.name as role, ai.is_demo_customer
      from account_invites ai left join roles r on r.id=ai.account_role_id 
    ${subset}`
  );
  const total = await db.query(
    `SELECT count(*) as count FROM account_invites`
  );
  const total_records = total[0].count;

  const total_pages = Math.ceil(total_records / perPage);
  const data = helper.emptyOrRows(rows);
  const meta = {page, total_records, total_pages};

  return {
    data,
    meta
  }
}

async function get_logins(users_refresh_token, user_ids, active_connection=null){
  //check if there is an active connection called from another function, or this call is a standalone
  let self_executing = false;
  if(!active_connection) {
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }
  try {

    if(!users_refresh_token && (!user_ids || user_ids.length <= 0 || user_ids.filter(id => id > 0).length == 0)){
      throw new Error("No refresh token found and no user IDs provided");
    }

    await cleanup_expired_tokens(0, active_connection);
    if(users_refresh_token && (!user_ids || user_ids.length <= 0 || user_ids.filter(id => id > 0).length == 0)) {
      const curr_user = helper.emptyOrSingle(await db.query(
        `select * from users where id=(
          select user_id from logins  where refresh_token=(?) limit 1)`,
        [ users_refresh_token ]));

      if(helper.isEmptyObj(curr_user)) {
        throw new Error("User not found");
      }          
      user_ids = [curr_user["id"]];

      if(curr_user["is_verified"] == 0){
        throw new Error("Account not verified. Please check your email!");
      }

      //console.log("disabled " + user["is_disabled"]);
      if(curr_user["is_disabled"] != 0){
        throw new Error("This account is disabled");
      }
    }

    const logins = helper.emptyOrRows(await db.query(
      `select * from logins where user_id in (${user_ids.map(id => "?").join(",")}) order by logged_in_at desc;`,
      user_ids ));
    
    //if(helper.isEmptyObj(logins)){
    //  throw new Error("Invalid refresh token or user ID. No logins found");
    //}

    if(self_executing) {
      await db.transaction_commit(active_connection);
    }

    return logins.map(login_info => {
      return {
        id: login_info["id"],
        logged_in_at: login_info["logged_in_at"],
        origin_geolocation: login_info["origin_geolocation"],
        origin_city: login_info["origin_city"],
        origin_country: login_info["origin_country"],
        origin_os: login_info["origin_os"],
        origin_browser: login_info["origin_browser"],
        origin_ip_address: login_info["origin_ip_address"],
        is_current_login: (login_info["refresh_token"] == users_refresh_token)
      };  
    });
  }
  catch(error){
    if(self_executing) {
      await db.transaction_rollback(active_connection);
    }
    throw(error);
  }
  finally {
    if(self_executing) {
      await db.transaction_release(active_connection);
    }
  }    
}


async function clear_logins(login_ids, users_refresh_token, current_user_id, active_connection=null){
  //check if there is an active connection called from another function, or this call is a standalone
  let self_executing = false;
  if(!active_connection) {
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }
  try {
    //check current user is active
    const curr_user = helper.emptyOrSingle(await db.query(
      `select * from users where id=(?) limit 1`,
      [ current_user_id ]));

    if(helper.isEmptyObj(curr_user)) {
      throw new Error("User not found");
    }

    if(curr_user["is_verified"] == 0){
      throw new Error("Account not verified. Please check your email!");
    }

    if(curr_user["is_disabled"] != 0){
      throw new Error("This account is disabled");
    }
    
    //cleanup
    await cleanup_expired_tokens(0, active_connection);

  //if login_ids are specified
  //check the users of those logins
  let login_users = [ current_user_id ];
  if(login_ids && login_ids.length > 0){
    const logins_user_ids_recs = helper.emptyOrRows(await db.query(
      `select distinct user_id from logins l where l.id in (${login_ids.map(id => "?").join(",")})`,
      login_ids));

    //if all IDs are of the currrent user, no problem
    login_users = logins_user_ids_recs.map(rec => rec["user_id"]);
    const logins_of_other_users = (login_users.indexOf(user => user != current_user_id)) >= 0;
    const user_can_logout_others = await doesUserHavePermissions(current_user_id, [{ requiredArea: 'user_management', requiredPermission: 'U' }]);
    
    if(!logins_of_other_users || user_can_logout_others){
        let placeholder = login_ids.map(id => "?").join(",");
        const params = login_ids.concat(users_refresh_token);
        await db.transaction_query(`delete from logins where id in (${placeholder})  and refresh_token<>(?)`, params, active_connection);
    }
    else {
      throw new Error("User has no permissions to logout other users");
    }
   }
   //No IDs specified
   else {
    //go by the refresh token to identify the current login
    if(!users_refresh_token){
      throw new Error("No refresh token found");
    }

    await db.transaction_query(
      `delete from logins where user_id=(?) and refresh_token<>(?)`,
      [ current_user_id, refresh_tokens ], 
      active_connection);
   }

    if(self_executing) {
      await db.transaction_commit(active_connection);
    }

    return await get_logins(users_refresh_token, login_users);
  }
  catch(error){
    if(self_executing) {
      await db.transaction_rollback(active_connection);
    }
    throw(error);
  }
  finally {
    if(self_executing) {
      await db.transaction_release(active_connection);
    }
  }    
}

// refresh the user's auth token based on the refresh token
async function refresh_tokens(old_refresh_token, ip_address, active_connection=null){
  //{ iat: 1765727124, exp: 1768319124 }
  //check if there is an active connection called from another function, or this call is a standalone
  let self_executing = false;
  if(!active_connection) {
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }
  try {
    const decoded_old_refresh_token = jwt.verify(old_refresh_token, process.env.AUTH_TOKEN_SECRET);

    const now = new Date();
    const refresh_token_generated = new Date(decoded_old_refresh_token.iat * helper.millisecondsFrom.seconds);
    const refresh_token_expiration = new Date(decoded_old_refresh_token.exp * helper.millisecondsFrom.seconds);
    
    // token expired 
    if(now > refresh_token_expiration) {
      return { auth_token: null, refresh_token: null, unauthorizedMessage: "Refresh token expired" };
    }

    const existing_refresh_token_rec = await db.query(
      `select
        u.id user_id, u.firstname, u.lastname, u.username, u.email, u.is_verified, u.is_disabled,
        l.id login_id, l.user_id, l.origin_ip_address, l.last_refresh_token_time,
        l.refresh_token_expiration, l.refresh_token, l.origin_browser, l.origin_geolocation
      from logins l inner join users u
      on u.id = l.user_id
      where l.refresh_token=(?)`,
      [old_refresh_token]);
    const existing_login = helper.emptyOrSingle(existing_refresh_token_rec);
    // No previous token found, this is a refresh token reuse!
    if(helper.isEmptyObj(existing_login)){
      return { auth_token: null, refresh_token: null, unauthorizedMessage: "Token reuse detected" };
    }

    if(existing_login["is_verified"] == 0){
      throw new Error("This account is not verified");
    }

    if(existing_login["is_disabled"] != 0){
      throw new Error("This account is disabled");
    }

    const access_token = generateAuthToken(
      {
        roles: [ "administrator" ],
        id: existing_login["user_id"],
        username: existing_login["username"],
        firstname: existing_login["firstname"],
        lastname: existing_login["lastname"],
        email: existing_login["email"]
      }, 
      5 * helper.secondsFrom.minutes
    );

    //generate a refresh token -> set as cookie (expiration 1 day / 30 days)
    //const refresh_token_expiration_Days = (rememberme)? 30 : 1;
    //const refresh_token_expiration_date = new Date(now.setDate(now.getDate() + refresh_token_expiration_Days));
    const seconds_to_refresh_token_expiration = helper.seconds_between_dates(refresh_token_expiration, now);
    const refresh_token = generateAuthToken(
      {}, 
      1 * seconds_to_refresh_token_expiration
    );

    await db.transaction_query(
      `update logins set 
        refresh_token=(?), refresh_token_expiration=(?), last_refresh_token_time=(?), origin_ip_address=(?)
      where refresh_token=(?)`,
      [refresh_token, helper.dateStr(refresh_token_expiration), helper.nowDateStr(), ip_address, old_refresh_token],
      active_connection
    );

    if(self_executing) {
      await db.transaction_commit(active_connection);
    }
    return { access_token, refresh_token, refresh_token_expiration, unauthorizedMessage: "" };
  }
  catch(error){
    if(self_executing) {
      await db.transaction_rollback(active_connection);
    }
    throw(error);
  }
  finally {
    if(self_executing) {
      await db.transaction_release(active_connection);
    }
  }
}

// log out of the system
async function logout(refresh_token, active_connection=null){
  let self_executing = false;
  if(!active_connection) {
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }
  try {
    await db.transaction_query(
      `delete from logins where refresh_token=(?)`, 
      [refresh_token], 
      active_connection
    );

    await cleanup_expired_tokens(0, active_connection);

    db.transaction_commit(active_connection);
  }
  catch(error){
    if(self_executing) {
      await db.transaction_rollback(active_connection);
    }
    throw(error);
  }
  finally {
    if(self_executing) {
      await db.transaction_release(active_connection);
    }
  }
}

async function admins_count(){
  const admin_count_rec = await db.query(
    `select count(*) as admin_count from users u inner join user_roles ur 
      on ur.user_id = u.id
      inner join roles r
      on ur.role_id = r.id
      where r.name = 'administrator' 
      and u.is_verified = 1 and u.is_disabled = 0;`, []);
  const count = helper.emptyOrSingle(admin_count_rec);
  if(!helper.isEmptyObj(count)) {
    return count["admin_count"];
  }
  return 0;
}

async function getRoles(){
  return helper.emptyOrRows(db.query(`select id, name from roles`, []));
}

async function getMultiple(page = 1, perPage) {
  let subset =  '';
  //console.log("page -> " + page);
  //console.log("perPage -> " + perPage);
  //console.log("(page && perPage) -> " + (page && perPage));  
  if(page && perPage && page > 0 && perPage > 0)
  {
    const offset = helper.getOffset(page, perPage);
    subset = `LIMIT ${offset},${perPage}`
  }
  const rows = await db.query(
    `select u.id, u.firstname, u.lastname, u.username, u.email, u.photo_url, r.name role, u.created_at registered_at, u.is_demo_customer,
      case
        when u.is_disabled then "disabled"
        when u.is_verified then "verified"
        else "pending"
      end status
      from users u left join user_roles ur on ur.user_id=u.id left join roles r on r.id=ur.role_id ${subset}`
  );
  const total = await db.query(
    `SELECT count(*) as count FROM users`
  );
  const total_records = total[0].count;
  /*
  const babies_quantity = await db.query(
    `select sum(quantity) as quantity from babies;`
  );
  const total_babies = babies_quantity[0]['quantity'];
  */
  const total_pages = Math.ceil(total_records / perPage);
  const data = helper.emptyOrRows(rows);
  const meta = {page, total_records, total_pages};

  return {
    data,
    meta
  }
}

async function getSingle(user_id){
  let user = helper.emptyOrSingle(await db.query(
    `select 
      u.id, u.firstname , u.lastname, u.password, u.email, u.photo_url, u.username,
      u.pending_new_email, u.phone, u.created_at registered_on, u.is_verified, u.is_disabled,
      u.is_demo_customer
    from users u 
    where u.id=(?)`, [user_id]));
  
  const roles = helper.emptyOrRows(await db.query(
    `select 
      r.name, r.id 
    from roles r 
      inner join user_roles ur on r.id=ur.role_id 
    where ur.user_id=(?)`, [user_id]));

  const user_customers = helper.emptyOrRows(await db.query(
    `select 
      c.id, c.name, c.is_demo_customer
    from customers c 
      inner join user_customers uc on c.id=uc.customer_id 
    where uc.user_id=(?)`, [user_id]));
  
  if(helper.isEmptyObj(user)){
    throw new Error(`User with ID ${user_id} not found`);
  }

  user["roles"] = roles;
  user["customers"] = user_customers;
  user["area_permissions"] = [];

  return user;
}

async function updateUser(userDetails, photo_url, auth_token, active_connection){

  //check if there is an active connection called from another function, or this call is a standalone
  let self_executing = false;
  if(!active_connection) {
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }
  try {
    //local resolution, preventing a circular dependency
    const customers = require("./customers");

    if(userDetails["roles"] && typeof userDetails["roles"]=='string'){
      userDetails["roles"] = JSON.parse(userDetails["roles"]);
    }

    if(userDetails["customers"] && typeof userDetails["customers"]=='string'){
      userDetails["customers"] = JSON.parse(userDetails["customers"]);
    }

    let update_fields = ['firstname=(?)', 'lastname=(?)', 'phone=(?)', 'is_disabled=(?)', 'is_demo_customer=(?)'];
    let update_values = [userDetails['firstname'], userDetails['lastname'], userDetails['phone']??'', helper.var_to_bool(userDetails['is_disabled']), helper.var_to_bool(userDetails['is_demo_customer'])];

    const existing_user = helper.emptyOrSingle(await db.query(
      `select * from users where id=(?)`,
      [userDetails["id"]]
    ));
    
    let updated_mail = false;
    let new_email_code = '';
    
    if(!helper.isEmptyObj(existing_user)) {

      const is_user_admin = helper.emptyOrSingle(await db.query(
        `select u.username, r.name, r.id
          from users u 
          inner join user_roles ur on u.id = ur.user_id 
          inner join roles r on r.id=ur.role_id
        where r.name='administrator' and u.id=(?) limit 1`, [userDetails["id"]]));
      const existing_user_is_admin = (!helper.isEmptyObj(is_user_admin));
      const updated_user_is_not_admin = (userDetails["roles"].find(r => r["id"] == is_user_admin["id"]) == undefined);
      const user_is_being_disabled = (helper.var_to_bool(userDetails["is_disabled"])  && !helper.var_to_bool(existing_user["is_disabled"]));
      const user_was_disabled_until_now = helper.var_to_bool(existing_user["is_disabled"]);
      
      const num_of_admins = await admins_count();
    
      if(
        /*
        If the existing user is an administrator <- which is not disabled, and was not disabled until now,
        And there is only one administrator in the system (i.e. this is the one!),
        And we are trying to disable it, or change their role, -> throw an error
        */
        existing_user_is_admin &&
        num_of_admins < 2 &&
        !user_was_disabled_until_now &&
        (user_is_being_disabled || updated_user_is_not_admin)
        ) {
          throw new Error("Cannot remove the last admin in the system");
        }


      if(
        //if a new user email was sent, which is not yet the pending email, set it as the pending email
        userDetails["email"] && 
        existing_user["email"] != userDetails["email"] &&
        existing_user["pending_new_email"] != userDetails["email"]) {
          //check that no other user alreadh has this email
          const existing_other_user_with_the_new_email = await findUser(null, userDetails["email"]);
          if(!helper.isEmptyObj(existing_other_user_with_the_new_email) && existing_other_user_with_the_new_email["id"] != userDetails["id"]) {
            throw new Error(`A user with email ${userDetails["email"]} already exists`);
          }
          new_email_code = helper.getRandomString(10);
          update_fields.push('pending_new_email=(?)', 'pending_new_email_code=(?)');
          update_values.push(userDetails["email"], new_email_code);
          updated_mail = true;
      }
      else {
        //otherwise, if the new user mail is already equal to the saved user mail, clear the pending
        if(existing_user["email"] == userDetails["email"]){
          update_fields.push('pending_new_email=(?)', 'pending_new_email_code=(?)');
          update_values.push(null, null);
          updated_mail = false;
        }
      }
      
      //if(photo_url){
      //remove the old photo
      if(photo_url){
        let current_photo_url = existing_user["photo_url"];
        if(current_photo_url){
          fs.rmSync(path.join(config.server_root, current_photo_url), {
              force: true,
          });
        }
      }
      else {
        photo_url = userDetails["photo_url"];
      }
      update_fields.push('photo_url=(?)');
      update_values.push(photo_url);
      //}

      await db.transaction_query(
        `update users 
          set ${update_fields.join(',')}
        where id=(?)`,
        [...update_values, userDetails["id"]], 
        active_connection);
      

      //----------- NEW: link to customers ---------
      //link to customers
      // if the saved user is a demo customer
      if(helper.var_to_bool(userDetails["is_demo_customer"])){
        //delete user connection to customers which are not demo customers
        await db.transaction_query(
        `delete 
          from user_customers 
          where user_id=(?) and customer_id in (
            select id from (
              select c.id
              from users u
              inner join user_customers uc on u.id=uc.user_id
              inner join customers c on uc.customer_id=c.id
              where u.id=(?) and c.is_demo_customer=0
            ) as ids_of_non_demo_customers_for_this_user
          )`,
          [ userDetails["id"], userDetails["id"] ], 
          active_connection);
        
        //check if the user is connected to a demo customer...
        let demo_customer_id = -1;
        const demo_customers_for_user = helper.emptyOrSingle(await db.query(
          `select c.id
            from users u
            inner join user_customers uc on u.id=uc.user_id
            inner join customers c on uc.customer_id=c.id
            where u.id=(?) and c.is_demo_customer=1 limit 1`, 
            [userDetails["id"]]));
        //...if not, create a demo customer and link to it.
        if(helper.isEmptyObj(demo_customers_for_user)){
          const new_customer = await customers.save({
            id: 0,
            name: `${userDetails.firstname} ${userDetails.lastname}`,
            business_name: `${userDetails.firstname} ${userDetails.lastname}`,
            email: userDetails.email,
            phone: userDetails.phone,
            tax_id: null,
            customer_code: null,
            created_at: helper.nowDateStr(),
            updated_at: helper.nowDateStr(),
            created_by: auth_token["id"],
            updated_by: auth_token["id"],
            banks: [],
            banks_baby_allocations: [],
            babies: [],
            is_demo_customer: 1            
          }, 
          auth_token["id"], 
          active_connection);
          demo_customer_id = new_customer.customer.id;
        }
        else {
          demo_customer_id = demo_customers_for_user["id"];
        }
        await db.transaction_query(
          `insert ignore into user_customers (user_id, customer_id) values ((?),(?))`,
          [userDetails["id"], demo_customer_id],
          active_connection
        );
      }
      //the user is NOT a demo customer, ensure they are not linked to demo customers
      else {
        //check if the user is connected to a demo customer(s)...
        const demo_customer_ids_for_user = helper.emptyOrRows(await db.query(
          `select c.id
            from users u
            inner join user_customers uc on u.id=uc.user_id
            inner join customers c on uc.customer_id=c.id
            where u.id=(?) and c.is_demo_customer=1`, 
            [userDetails["id"]]));
        //delete the demo customers
        if(demo_customer_ids_for_user && demo_customer_ids_for_user.length > 0){
          const demo_customer_placeholders = demo_customer_ids_for_user.map(c => "(?)").join(",");
          const demo_customer_ids = demo_customer_ids_for_user.map(c => c["id"]);
          await db.transaction_query(
            `delete from customers where id in (${demo_customer_placeholders})`, 
            demo_customer_ids, 
            active_connection);
        }
        //delete links to all customers (demo or non demo - we will link to the relevant ones later)
        await db.transaction_query(
          `delete from user_customers where user_id=(?)`, 
          [userDetails["id"]], 
          active_connection);
        
        //unlink the user from deleted demo customer ids
        demo_customer_ids_for_user.forEach(c => {
          userDetails["customers"] = userDetails["customers"].filter(cust => cust.id != c["id"]);
        });

        //link to the user assigned customers
        let customer_ids = (userDetails["customers"])? userDetails["customers"].map(c => c.id) : [];
        if(customer_ids.length > 0){
          const customers_placeholders = customer_ids.map(i => "((?),(?))").join(",");
          await db.transaction_query(
            `insert into user_customers (user_id, customer_id) values ${customers_placeholders}`,
            customer_ids.map(i => [userDetails["id"] , i]).flat(),
            active_connection
          );
        }
      }
      //-----------/NEW: link to customers ---------

      //link to roles
      await db.transaction_query(`delete from user_roles where user_id=(?)`, [userDetails["id"]], active_connection);
      let role_ids = (userDetails["roles"])? userDetails["roles"].map(r => r.id) : [];
      const roles_placeholders = role_ids.map(i => "((?),(?))").join(",");
      await db.transaction_query(
        `insert into user_roles (user_id, role_id) values ${roles_placeholders}`,
        role_ids.map(i => [userDetails["id"] , i]).flat(),
        active_connection
      );

      if(updated_mail){
        //send email update verification
        await send_new_email_verification(userDetails['firstname'], userDetails["email"], existing_user["email"], new_email_code);
      }
    }
    else {
      throw new Error("User not found");
    }

    if(self_executing) {
      await db.transaction_commit(active_connection);
    }
    return await getSingle(userDetails["id"]);
  }
  catch(error){
    if(self_executing) {
      await db.transaction_rollback(active_connection);
    }
    throw(error);
  }
  finally {
    if(self_executing) {
      await db.transaction_release(active_connection);
    }
  }
}

async function remove(user_id, active_connection){ 

  const num_of_admins = await admins_count();
  const trying_to_delete_admin = ((helper.emptyOrRows(await db.query(
    `select u.username, r.name
      from users u 
      inner join user_roles ur on u.id = ur.user_id 
      inner join roles r on r.id=ur.role_id
    where r.name='administrator' and u.id=(?) limit 1`, [user_id]))).length > 0);

  if(trying_to_delete_admin && num_of_admins < 2) {
    throw new Error("Cannot the delete the last admin in the system");
  }

  let self_executing = false;
  if(!active_connection) {
    active_connection = await db.trasnaction_start();
    self_executing = true;
  }
  try {
    await db.transaction_query(
      `delete from users where id=(?)`, 
      [ user_id ], 
      active_connection);

    //if this user is connected to a demo customer, delete the demo customer as well
    await db.transaction_query(
      `delete from customers where id in (
        select id from (
          select c.id 
            from users u inner join user_customers uc on u.id=uc.user_id
            inner join customers c on uc.customer_id=c.id
            where u.id=(?) and c.is_demo_customer=1
          ) as demo_customers_for_this_user
      )`, 
      [user_id], 
      active_connection);
    
    if(self_executing) {
      await db.transaction_commit(active_connection);
    }
    return "Deleted successfully";
  }
  catch(error){
    if(self_executing) {
      await db.transaction_rollback(active_connection);
    }
    throw(error);
  }
  finally {
    if(self_executing) {
      await db.transaction_release(active_connection);
    }
  }
}

//requiredPermissions:
//[{ requiredArea: 'user_management', requiredPermission: 'R' }, {...}]
async function doesUserHavePermissions(user_id, requiredPermissions) {
  let allowed = true;
  //TODO performance improvement: cache this
  const user_permissions = await getUserPermissions(user_id);
  if(requiredPermissions){
    allowed = false;
    requiredPermissions.forEach(required_permission => {
        const areaPermission = user_permissions.find(u_p => u_p["area"] == required_permission.requiredArea);
        if(!areaPermission || areaPermission["permissions"].indexOf(required_permission.requiredPermission) >= 0) {
            allowed = true;
        }                     
    });
  }
  return allowed;
}

async function doUserRolesHavePermissions(roles, requiredPermissions) {
  if (!roles || roles.length === 0) return false;

  for (const required_permission of requiredPermissions) {
    for (const r of roles) {
      const role_permissions = helper.emptyOrSingle(await db.query(
        `select rp.permissions 
          from role_permissions rp 
          inner join roles r on r.id = rp.role_id 
          where r.id=(?) and rp.area=(?)`,
        [r["id"], required_permission["requiredArea"]]
      ));

      if (!helper.isEmptyObj(role_permissions) && 
          role_permissions["permissions"].indexOf(required_permission["requiredPermission"]) >= 0) {
        return true; // can early-exit as soon as we find a match
      }
    }
  }
  return false;
}


module.exports = {
  //securing
  getAuthTokenFromHeader,
  generateAuthToken,
  refresh_tokens,
  admins_count,
  getUserPermissions,
  doesUserHavePermissions,
  doUserRolesHavePermissions,

  //signing up
  signup,
  verifyUserSignupCode,
  sendUserRegistrationVerificationCode,
  getRoles,
  manual_add_user_temp,

  //email change workflow
  verifyNewUserEmailCode,
  resendChangedEmailConfirmationCode,

  //password change
  forgot_password,
  reset_password,

  //signing in and out
  signin,
  get_logins,
  clear_logins,
  logout,

  //user requesting an ccount
  request_account,
  get_account_requests,
  getAccountRequestDetails,
  approve_account_request,
  deleteccountRequest,

  //inviting new users
  invite_user,
  getInvitations,

  //user profile
  getBaseUserInfo,
  getUserProfile,
  saveUserProfile,
  getUserProfile_by_code, //for completeing an account request

  //user management
  getMultiple,
  getSingle,
  remove,
  updateUser
}