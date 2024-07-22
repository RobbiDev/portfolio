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
      text: `Hi ${name},\n\nThank you for reaching out and connecting with me! I appreciate you taking the time to get in touch.\n\nI will review your message and get back to you as soon as possible. If you have any urgent matters, please feel free to reach out to me directly on linkedin.\n\nBest regards,\n\nRobert (Robby) Johnson`,
    };



    try {
      const receiving = process.env.RECEIVING
      if (receiving == "false") {
        return res.status(404).json({ error: "Form is Currently Not Accepting any more submissions. Thank you for taking your time and please try again later!" });
      } else {
        await transporter.sendMail(mailOptionsForYou);
        await transporter.sendMail(mailOptionsForSender);
        res.status(200).json({ success: true });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error sending email' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed!' });
  }
}