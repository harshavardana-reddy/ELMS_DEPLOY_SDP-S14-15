const nodemailer = require('nodemailer');
const moment = require('moment');
const sendPasswordMail = async (empid,empname,sent_to) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: "587",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        }
    });

    const options = {
        from: {
            name: "SH:Organization",
            address: process.env.EMAIL_USER,
        },
        to: sent_to,
        subject: "Password Change",
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>SH-Organization</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        color: #333;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #fff;
                        border-radius: 5px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        color: #007bff;
                    }
                    p {
                        line-height: 1.6;
                    }
                </style>
            </head>
            <body>
            <div class="container">
                <h1>Account Activity</h1>
                <p>Hello ${empname},</p>
                <p>Your ELMS Portal(UserID:${empid}) password has been changed at time ${moment().tz('Asia/Kolkata').format('DD-MM-YYYY HH:mm:ss A')}.</p>
                <p>Regards,<br>SH:)Organization</p>
            </div>
        
            </body>
            </html>
        `,
    };

    // Send Mail
    transporter.sendMail(options, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log("Email sent successfully");
        }
    });
};

module.exports = sendPasswordMail;
