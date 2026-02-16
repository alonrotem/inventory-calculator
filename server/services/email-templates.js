const helper = require('../helper');
const config = require('../config');
const path = require("path");
const fs = require("fs");

//https://app.postdrop.io/
function template(content, server_address){
    const logo_id = helper.getRandomString();
    return {    
    body: `<!doctype html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width">
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <title>Simple Responsive HTML Email With Button</title>
        <style>

        @media only screen and (max-width: 620px) {
        table[class=body] h1 {
            font-size: 28px !important;
            margin-bottom: 10px !important;
            direction: ltr !important;
        }

        table[class=body] p,
        table[class=body] ul,
        table[class=body] ol,
        table[class=body] td,
        table[class=body] span,
        table[class=body] a,
        ::not(.verification-code) {
            font-size: 16px !important;
            direction: ltr !important;
        }

        table[class=body] .wrapper,
        table[class=body] .article {
            padding: 10px !important;
            direction: ltr !important;
        }

        table[class=body] .content {
            padding: 0 !important;
            direction: ltr !important;
        }

        table[class=body] .container {
            padding: 0 !important;
            width: 100% !important;
            direction: ltr !important;
        }

        table[class=body] .main {
            border-left-width: 0 !important;
            border-radius: 0 !important;
            border-right-width: 0 !important;
            direction: ltr !important;
        }

        table[class=body] .btn table {
            width: 100% !important;
            direction: ltr !important;
        }

        table[class=body] .btn a {
            width: 100% !important;
            direction: ltr !important;
        }

        table[class=body] .img-responsive {
            height: auto !important;
            max-width: 100% !important;
            width: auto !important;
        }

        .verification-code {
            text-align: center;
            font-size: 30px !important;
            letter-spacing: 10px;
            direction: ltr !important;
        }
        }
        @media all {
        .ExternalClass {
            width: 100%;
            direction: ltr !important;
        }

        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
            line-height: 100%;
            direction: ltr !important;
        }

        .apple-link a {
            color: inherit !important;
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
            text-decoration: none !important;
            direction: ltr !important;
        }

        .btn-primary table td:hover {
            background-color: #198754 !important;
            direction: ltr !important;
        }

        .btn-primary a:hover {
            background-color: #198754 !important;
            border-color: #198754 !important;
            direction: ltr !important;
        }
        }
        </style>
        </head>
        <body dir="ltr" class style="direction: ltr !important; background-color: #eaebed; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="direction: ltr !important; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; background-color: #eaebed; width: 100%;" width="100%" bgcolor="#eaebed">
            <tr>
                <td style="direction: ltr !important; font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
                <td class="container" style="direction: ltr !important; font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; max-width: 580px; padding: 10px; width: 580px; Margin: 0 auto;" width="580" valign="top">
                <div class="header" style="direction: ltr !important; padding: 20px 0;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="direction: ltr !important; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; width: 100%;">
                    <tr>
                        <td class="align-center" width="100%" style="direction: ltr !important; font-family: sans-serif; font-size: 14px; vertical-align: top; text-align: center;" valign="top" align="center">
                        <a href="${server_address}" style="direction: ltr !important; color: #198754; text-decoration: underline;">
                            <img src="cid:${logo_id}" height="40" alt="Postdrop" style="direction: ltr !important; border: none; -ms-interpolation-mode: bicubic; max-width: 100%;">
                        </a>
                        </td>
                    </tr>
                    </table>
                </div>
                <div class="content" style="direction: ltr !important; box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">

                    <!-- START CENTERED WHITE CONTAINER -->
                    <span class="preheader" style="direction: ltr !important; color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">Your Romtech account activation code</span>
                    <table role="presentation" class="main" style="direction: ltr !important; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; background: #ffffff; border-radius: 3px; width: 100%;" width="100%">

                    <!-- START MAIN CONTENT AREA -->
                    <tr>
                        <td class="wrapper" style="direction: ltr !important; font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;" valign="top">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="direction: ltr !important; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; width: 100%;" width="100%">
                            <tr>
                            <td style="direction: ltr !important; font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">
                                ${content}
                            </td>
                            </tr>
                        </table>
                        </td>
                    </tr>

                    <!-- END MAIN CONTENT AREA -->
                    </table>

                    <!-- START FOOTER -->
                    <div class="footer" style="direction: ltr !important; clear: both; Margin-top: 10px; text-align: center; width: 100%;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="direction: ltr !important; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; width: 100%;" width="100%">
                        <tr>
                        <td class="content-block powered-by" style="direction: ltr !important; font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; color: #9a9ea6; font-size: 12px; text-align: center;" valign="top" align="center">
                            Powered by <a href="${server_address}" style="direction: ltr !important; color: #9a9ea6; font-size: 12px; text-align: center; text-decoration: none;">Romtech</a>.
                        </td>
                        </tr>
                    </table>
                    </div>
                    <!-- END FOOTER -->

                <!-- END CENTERED WHITE CONTAINER -->
                </div>
                </td>
                <td style="direction: ltr !important; font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
            </tr>
            </table>
        </body>
        </html>`,

        attachments: [
            {
                filename: "logo.png",
                content: fs.readFileSync(path.join(path.dirname(__filename), "../assets/images/romtech-w-logo-light-outline.png")),
                cid: logo_id
            }
        ]
    };
}

function sign_up_verification(name, email_address, server_address, verification_code, code_expiration) {
    const email = template(`
        <p style="direction: ltr !important; font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">
            Dear ${name},
        </p>
        <p style="direction: ltr !important; font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">
            Welcome to Romtech!<br>
            Your new user account needs to be activated and verified.
        </p>
        <p style="direction: ltr !important; font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">
            To activate your account, click the button:
        </p>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="direction: ltr !important; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; box-sizing: border-box; width: 100%; margin: 30px 0px;" width="100%">
        <tbody>
            <tr>
            <td align="center" style="direction: ltr !important; font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;" valign="top">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="direction: ltr !important; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: auto; width: auto;" width="auto">
                <tbody>
                    <tr>
                    <td style="direction: ltr !important; font-family: sans-serif; font-size: 14px; vertical-align: top; border-radius: 5px; text-align: center; background-color: #198754;" valign="top" align="center" bgcolor="#198754">
                        <a href="${server_address}/users/verify?u=${ helper.encBase64(email_address) }&code=${verification_code}" target="_blank" style="direction: ltr !important; border: solid 1px #198754; border-radius: 5px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none; background-color: #198754; border-color: #198754; color: #ffffff;">
                            Verify my account
                        </a> 
                    </td>
                    </tr>
                </tbody>
                </table>
            </td>
            </tr>
        </tbody>
        </table>

        <p style="direction: ltr !important; font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">
            <strong>OR</strong> navigate to 
            <a href="${server_address}/users/verify?u=${ helper.encBase64(email_address) }" style="direction: ltr !important; color: #198754; text-decoration: underline;">${server_address}/users/verify</a>
            and enter the following code:
        </p>
        <p class="verification-code" style="direction: ltr !important; font-family: sans-serif; font-weight: normal; margin: 0; margin-bottom: 15px; text-align: center; letter-spacing: 10px; font-size: 30px;">
            ${verification_code}
        </p>
        <p>
            <div style="direction: ltr !important; text-align: center; font-weight: bold;">
                This code is valid for ${config.registration_code_expiration_horus} hours, and expires on ${helper.dateVerbalStr(code_expiration)}
            </div>
        </p>`, 
        server_address);
    return email;
}

function email_change_verification(name, old_email_address, server_address, verification_code) {
    const email = template(`
        <p style="direction: ltr !important; font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">
            Dear ${name},
        </p>
        <p style="direction: ltr !important; font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">
            Your Romtech account email address was changed.<br/>
            Please verify your new address.
        </p>
        <p style="direction: ltr !important; font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">
            To verify your address, click the button:
        </p>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="direction: ltr !important; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; box-sizing: border-box; width: 100%; margin: 30px 0px;" width="100%">
        <tbody>
            <tr>
            <td align="center" style="direction: ltr !important; font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;" valign="top">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="direction: ltr !important; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: auto; width: auto;" width="auto">
                <tbody>
                    <tr>
                    <td style="direction: ltr !important; font-family: sans-serif; font-size: 14px; vertical-align: top; border-radius: 5px; text-align: center; background-color: #198754;" valign="top" align="center" bgcolor="#198754">
                        <a href="${server_address}/users/verify_email?code=${verification_code}" target="_blank" style="direction: ltr !important; border: solid 1px #198754; border-radius: 5px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none; background-color: #198754; border-color: #198754; color: #ffffff;">
                            Verify this new email
                        </a> 
                    </td>
                    </tr>
                </tbody>
                </table>
            </td>
            </tr>
        </tbody>
        </table>

        <p style="direction: ltr !important; font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">
            <strong>OR</strong> navigate to 
            <a href="${server_address}/users/verify_email" style="direction: ltr !important; color: #198754; text-decoration: underline;">${server_address}/users/verify_email</a>
            and enter the following code:
        </p>
        <p class="verification-code" style="direction: ltr !important; font-family: sans-serif; font-weight: normal; margin: 0; margin-bottom: 15px; text-align: center; letter-spacing: 10px; font-size: 30px;">
            ${verification_code}
        </p>
        <p>
            Until you verify this address, notifications will be sent to your old email, ${old_email_address}.
        </p>
        <p>
            <div style="direction: ltr !important; color:white; background-color: red; text-align: center; padding: 7px;">
                <strong>!!! IMPORTANT !!!</strong><br/>
                If you did not make this change, <a style="direction: ltr !important; color: yellow" href="${server_address}/users/verify_email?code=${verification_code}&cancel=1">click here to cancel it!</a>
            </div>
        </p>`, 
        server_address);
    return email;
}

function password_change_notification(name, server_address, verification_code) {
    const email = template(`
        <p style="direction: ltr !important; font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">
            Dear ${name},
        </p>
        <p style="direction: ltr !important; font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">
            Your Romtech password was changed!
        </p>
        <p style="direction: ltr !important; font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px; color: red;">
            <strong>If this wasn't you, please click on the following link to reset your password!</strong>
        </p>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="direction: ltr !important; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; box-sizing: border-box; width: 100%; margin: 30px 0px;" width="100%">
        <tbody>
            <tr>
            <td align="center" style="direction: ltr !important; font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;" valign="top">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="direction: ltr !important; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: auto; width: auto;" width="auto">
                <tbody>
                    <tr>
                    <td style="direction: ltr !important; font-family: sans-serif; font-size: 14px; vertical-align: top; border-radius: 5px; text-align: center; background-color: rgba(219, 23, 23, 1);" valign="top" align="center" bgcolor="#198754">
                        <a href="${server_address}/users/reset_password?code=${ helper.encBase64(verification_code)}" target="_blank" style="direction: ltr !important; border: solid 1px #198754; border-radius: 5px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none; background-color: #198754; border-color: #198754; color: #ffffff;">
                            Reset my password!
                        </a> 
                    </td>
                    </tr>
                </tbody>
                </table>
            </td>
            </tr>
        </tbody>
        </table>`, 
        server_address);
    return email;
}

function password_forgotten_notification(name, server_address, verification_code) {
    const email = template(`
        <p style="direction: ltr !important; font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">
            Dear ${name},
        </p>
        <p style="direction: ltr !important; font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">
            You requested a forgotten password reset. Click the following link to set a new password:
        </p>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="direction: ltr !important; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; box-sizing: border-box; width: 100%; margin: 30px 0px;" width="100%">
        <tbody>
            <tr>
            <td align="center" style="direction: ltr !important; font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;" valign="top">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="direction: ltr !important; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: auto; width: auto;" width="auto">
                <tbody>
                    <tr>
                    <td style="direction: ltr !important; font-family: sans-serif; font-size: 14px; vertical-align: top; border-radius: 5px; text-align: center; background-color: rgba(219, 23, 23, 1);" valign="top" align="center" bgcolor="#198754">
                        <a href="${server_address}/users/reset_password?code=${ helper.encBase64(verification_code)}" target="_blank" style="direction: ltr !important; border: solid 1px #198754; border-radius: 5px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none; background-color: #198754; border-color: #198754; color: #ffffff;">
                            Reset my password!
                        </a> 
                    </td>
                    </tr>
                </tbody>
                </table>
            </td>
            </tr>
        </tbody>
        </table>
        <p>
        <div style="direction: ltr !important; color:white; background-color: red; text-align: center; padding: 7px;">
            <strong>!!! IMPORTANT !!!</strong><br/>
            If you did not request this password rest, ignore this message!<br/>
            If you suspect anyone trying to hack your profile, <a href="${server_address}/profile">go to your profile<a/> and change your password!
        </div>
        </p`, 
        server_address);
    return email;
}

function new_account_request_notification_to_admins(requester_firstname, requester_lastname, requester_email, server_address, request_id) {
    const email = template(`
        <p style="direction: ltr !important; font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">
            Dear administrator,
        </p>
        <p style="direction: ltr !important; font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">
            A new account request was received from ${ requester_firstname } ${ requester_lastname } (${ requester_email }).<br/>
            Please review it and either approve, decline or delete it accordingly.
        </p>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="direction: ltr !important; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; box-sizing: border-box; width: 100%; margin: 30px 0px;" width="100%">
        <tbody>
            <tr>
            <td align="center" style="direction: ltr !important; font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;" valign="top">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="direction: ltr !important; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: auto; width: auto;" width="auto">
                <tbody>
                    <tr>
                    <td style="direction: ltr !important; font-family: sans-serif; font-size: 14px; vertical-align: top; border-radius: 5px; text-align: center; background-color: #198754;" valign="top" align="center" bgcolor="#198754">
                        <a href="${server_address}/users/account_request_details/?id=${request_id}" target="_blank" style="direction: ltr !important; border: solid 1px #198754; border-radius: 5px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none; background-color: #198754; border-color: #198754; color: #ffffff;">
                            Review account request
                        </a> 
                    </td>
                    </tr>
                </tbody>
                </table>
            </td>
            </tr>
        </tbody>
        </table>
        <p style="direction: ltr !important; font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">
            To see and manage all account requests, <a href='${server_address}/users/account_requests'>click here</a>.
        </p>`, 
        server_address);
    return email;
}

function requested_user_account_approved(name, server_address, verification_code) {
    const email = template(`
        <p style="direction: ltr !important; font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">
            Dear ${name},
        </p>
        <p style="direction: ltr !important; font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">
            Your user account request was approved. Please click the button to finalize your user account.
        </p>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="direction: ltr !important; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; box-sizing: border-box; width: 100%; margin: 30px 0px;" width="100%">
        <tbody>
            <tr>
            <td align="center" style="direction: ltr !important; font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;" valign="top">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="direction: ltr !important; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: auto; width: auto;" width="auto">
                <tbody>
                    <tr>
                    <td style="direction: ltr !important; font-family: sans-serif; font-size: 14px; vertical-align: top; border-radius: 5px; text-align: center; background-color: rgba(219, 23, 23, 1);" valign="top" align="center" bgcolor="#198754">
                        <a href="${server_address}/users/finalize_account?code=${ helper.encBase64(verification_code)}" target="_blank" style="direction: ltr !important; border: solid 1px #198754; border-radius: 5px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none; background-color: #198754; border-color: #198754; color: #ffffff;">
                            Finalize my account
                        </a> 
                    </td>
                    </tr>
                </tbody>
                </table>
            </td>
            </tr>
        </tbody>
        </table>`, 
        server_address);
    return email;
}

module.exports = {
    template,
    sign_up_verification,
    email_change_verification,
    password_change_notification,
    password_forgotten_notification,
    new_account_request_notification_to_admins,
    requested_user_account_approved
}