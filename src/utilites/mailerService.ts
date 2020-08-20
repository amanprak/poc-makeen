import { mailConfig } from '../config/mailerConfig'

export function mailer(obj: any) {
    var mailOptions = {
        from: 'makeentestpoc@gmail.com',
        to: obj.to,
        subject: obj.subject,
        html: obj.html
    };
    let Mailer = new mailConfig();
    Mailer.mailTransporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(`error: ${error}`);
        }
        console.log(`Message Sent ${info.response}`);
    });
}


// mailer({
//     to:"aman.prakash@truminds.com",
//     subject:"Hi",
//     html:"<h1>AMAN</h1>"
// })