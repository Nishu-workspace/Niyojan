import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  try {
    nodemailer.createTestAccount((err, account) => {
      if (err) {
        console.log("failed to create a testing account. " + err.message);
        return false;
      }

      console.log("Crendentials Obtained, sending message...");

      let transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      let message = {
        from: "Sender Name <sender@example.com",
        to: to,
        subject: subject,
        text: "verification email",
        html: html,
      };

      transporter.sendMail(message, (err, info) => {
        if (err) {
          console.log("Error occurred." + err.message);
          return false;
        }
        console.log("Messafe send: %s", info.messageId);

        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      });
    });
    return true;
  } catch (err) {
    console.log(err);
  }
};
