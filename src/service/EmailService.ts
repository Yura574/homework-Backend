import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    // port: 587,
    secure: true,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    },

});

export class EmailService {
    static async sendEmail(email: string, confirmCode: string) {
        try {
            const code = confirmCode + '_' + email
            await transporter.sendMail({
                from: process.env.SMTP_EMAIL,
                to: email,
                subject: "Код подтверждения",
                text: 'this is text',
                html: `<h1>Thank for your registration</h1>
                        <p>To finish registration please follow the link below:
                             <a href='http://localhost:5000/auth/confirm-email?code=${code}'>complete registration</a>
                             <div>Our code ${code}
                             </div>
                           </p>`
            })


        } catch (err) {
            console.log(err)
        }

    }
}