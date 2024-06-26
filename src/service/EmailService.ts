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
            console.log('error send email')
            console.log(err)
        }

    }

    static async sendEmailForRecoveryPassword(email: string, recoveryCode: string){
        try {
            await transporter.sendMail({
                from: process.env.SMTP_EMAIL,
                to: email,
                subject: "Код восстановления пароля",
                html: `<h3>
Our Code for recovery password
 <a href='http://localhost:5000/auth/password-recovery?recoveryCode=${recoveryCode}'>confirm complete registration</a>
</h3>
                        <div>Code ${recoveryCode}</div>
                           `
            })
        } catch (err) {
            console.log(err)
        }

    }
}
