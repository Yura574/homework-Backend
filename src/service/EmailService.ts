import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'yura5742248@gmail.com',
        pass: 'wdjn whyu cpkk spko'
    },
});

export class EmailService {
    static async sendEmail(email: string, confirmCode: string) {
        try {
           await transporter.sendMail({
                from: 'yura5742248@gmail.com',
                to: email ,
                subject: "Код подтверждения",
                text: 'this is text',
                html: `
<h1>Thank for your registration</h1>
 <p>To finish registration please follow the link below:
     <a href='http://localhost:5000/auth/confirm-email?code=${confirmCode}&email=${email}'>complete registration</a>
 </p>`
            })


        } catch (err) {
            console.log(err)
        }

    }
}