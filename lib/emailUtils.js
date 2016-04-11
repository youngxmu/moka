var nodemailer = require('nodemailer');
 
// create reusable transporter object using SMTP transport
var smtpTransport = nodemailer.createTransport("SMTP", {
    host: "smtp.126.com", // hostname
    secureConnection: true, // use SSL
    port: 465,
    auth: {
        user: "name@126.com",
        pass: "这里用客户端授权码"
    }
});
 
// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails
 
// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'name ✔ <name@126.com>', // sender address
    to: 'receiver@126.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ✔', // plaintext body
    html: '<b>Hello world ✔</b>' // html body
};
 
// send mail with defined transport object
smtpTransport.sendMail(mailOptions, function(error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Message sent: ' + info.response);
    }
    // if you don't want to use this transport object anymore, uncomment following line
    //smtpTransport.close(); // shut down the connection pool, no more messages
});