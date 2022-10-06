import sgMail = require('@sendgrid/mail');

export const sendMail = async (options: any) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
  console.log(
    'process.env.SENDGRID_API_KEY as string',
    process.env.SENDGRID_API_KEY as string
  );
  console.log('process.env.EMAIL_FROM', process.env.EMAIL_FROM);
  // using Twilio SendGrid's v3 Node.js Library
  // https://github.com/sendgrid/sendgrid-nodejs

  // const html = await ejs.renderFile(
  //   `${__dirname}/../views/email/${options.template}`,
  //   {
  //     user: options.user,
  //     url: options.url,
  //   }
  // );

  const msg = {
    from: process.env.EMAIL_FROM as string,
    to: options.email,
    subject: options.subject,
    // text: htmlToText.fromString(html),
    html:
      // email text for sending account activation email after signup
      `<h1>Hi ${options.user},</h1>
    <p>Thank you for registering with us.</p>
    <p>Please click on the following link to activate your account:</p>
    <a href="${options.url}">${options.url}</a>
    <p>If you did not request this, please ignore this email.</p>`,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch((error: any) => {
      console.error(error);
    });
};
