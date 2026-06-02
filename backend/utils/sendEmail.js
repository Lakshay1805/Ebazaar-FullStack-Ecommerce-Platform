const nodeMailer = require("nodemailer")

const sendEmail = async (to , subject , text) =>{
    try{
        const transporter = nodeMailer.createTransport({
            service : 'Gmail',
            auth : {
                user : process.env.EMAIL_USER,
                pass : process.env.EMAIL_PASS
            }
        });
        const mailOptions = {
            from : process.env.EMAIL_USER,
            to,
            subject,
            html: text
        };
        await transporter.sendMail(mailOptions);
    }catch (err){
        console.log("Error in sending email : " , err)
    }
}

module.exports = sendEmail;