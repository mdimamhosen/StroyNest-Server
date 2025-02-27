import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.nodeEnv === 'production',
    auth: {
      //   TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'imamhosen9426224@gmail.com',
      pass: 'fyqc rupy yvup wsjw',
    },
    debug: true,
  });

  await transporter.sendMail({
    from: 'imamhosen9426224@gmail.com',
    to,
    subject,
    text: 'Level up your coding skills',
    html,
  });
};
