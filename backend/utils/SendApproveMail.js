const nodemailer = require('nodemailer');

const sendApproveMail = async (empid, empname, LeaveID, leavetype, sent_to, sent_from) => {
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
            address: sent_from,
        },
        to: sent_to,
        subject: "Leave Application Status",
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to SH-Organization</title>
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
                    <h1>Leave Application Status</h1>
                    <p>Hello ${empname},</p>
                    <p>Your leave application (ID: ${LeaveID}) for ${leavetype} has been reviewed and approved.</p>
                    <p>Thank you for your patience.</p>
                    <p>Regards,<br>SH:Organization</p>
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

module.exports = sendApproveMail;
