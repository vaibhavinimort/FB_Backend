const nodemailer = require("nodemailer");

const { google } = require("googleapis");

const { OAuth2 } = google.auth;
const oauth_link = "http://deveopers.google.com/oauthplayground";
const { EMAIL, MAILING_ID, MAILING_REFRESH, MAILING_SECRETE } = process.env;

const auth = new OAuth2(
    MAILING_ID,
    MAILING_SECRETE,
    MAILING_REFRESH,
    oauth_link
);
exports.sendVerificationEmail = (email, name, url) => {
    auth.setCredentials({
        refresh_token: MAILING_REFRESH,
    });
    const accessToken = auth.getAccessToken();
    const stmp = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: EMAIL,
            clientId: MAILING_ID,
            clientSecret: MAILING_SECRETE,
            refreshToken: MAILING_REFRESH,
            accessToken,
        },
    });
    const mailOptions = {
        from: EMAIL,
        to: email,
        subject: "Facebook email verification",
        html: `<div style="max-width:700px;margin_bottom:1rem;display:flex;align-items:center;gap:10px;font-family:Robot;color:#3b5998"><img width="10%" src="https://www.freepnglogos.com/uploads/facebook-logo-icon/facebook-logo-icon-facebook-icon-png-images-icons-and-png-backgrounds-1.png" alt="" style width="30px"><span><h4>Action requise: Activate your facebook acccount</h4></span></div><div style="padding:1rem 0;border_top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141823;font_size:17px;font-family:Robot"><span>Hello ${name}</span><div style="padding:1rem 0"><span style="padding:1rem 0">You recently created account on facebook.To complete your registration, please confirm your account.</span></div><a href=${url} style="width:200px;padding:10px 15px;background:#4c649b;color:#fff;text-decoration:none;font_weight:600">confirm your account</a><br><div style="padding-top:20px"><span style="margin:1.5rem 0;color:#898f9c">Facebook allows you to touch with all your friends, once refistered on facebook, you can share photos, organize events and much more</span></div></div>`,
    };
    stmp.sendMail(mailOptions, (err, res) => {
        if (err) {
            console.error({ err });
            return err;
        }
        return res;
    });
};