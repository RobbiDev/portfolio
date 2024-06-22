import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;

    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Email options for you
    const mailOptionsForYou = {
      from: email,
      to: process.env.MY_EMAIL,
      subject: `Contact form submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    // Email options for the sender
    const mailOptionsForSender = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Confirmation: I\'ve received your message',
      text: `Hi ${name},\n\nThank you for your message. I will get back to you as soon as i can!.\n\nBest,\nRobert (Robby) Johnson`,
    };

    try {
      await transporter.sendMail(mailOptionsForYou);
      await transporter.sendMail(mailOptionsForSender);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error sending email' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}