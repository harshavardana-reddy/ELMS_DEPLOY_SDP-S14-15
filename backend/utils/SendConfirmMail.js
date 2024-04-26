const nodemailer = require('nodemailer');

const sendMail = async(empid,sent_to, sent_from )=>{
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        PORT: "587",
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS,
        },
        tls:{
            rejectUnauthorized:false,
        }


    })
    const options = {
        from : {
            name:"SH:Organization",
            address:sent_from,
        },
        to : sent_to,
        subject: "Employee Details Confirmation",
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
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 20px auto;
                            padding: 20px;
                            background-color: #fff;
                            border-radius: 8px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        h1 {
                            color: #007bff;
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        p {
                            font-style: italic;
                            color: #555;
                            margin-bottom: 10px;
                            text-align: center;
                        }
                        h3 {
                            font-weight: bold;
                            color: #007bff;
                            margin-bottom: 10px;
                        }
                        .note {
                            color: #777;
                            font-size: 0.9em;
                            text-align: center;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Welcome to SH-Organization</h1>
                        <p>Here's your Credentials for Leave Management Portal</p>
                        <h3>Your Generated EmployeeID is <span style="color: #009688;">${empid}</span></h3>
                        <h3 style="font-weight: bold; color: #007bff;">Your Username is EmployeeID and password is your Date of Birth(format:yyyy-mm-dd).</h3>
                        <p class="note">Make sure that you change your password immediately.</p>
                    </div>
                </body>
                </html>
        `,
        
        
    }

    //Send Mail
    transporter.sendMail(options,function(err,info){
        if(err){
            console.log(err)
        }
        else{
            console.log("Email sent successfully");
        }
    })
}
module.exports = sendMail