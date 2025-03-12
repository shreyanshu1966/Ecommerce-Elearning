// const nodemailer = require('nodemailer');

// const bookDemo = async (req, res) => {
//   try {
//     const { name, email, phone, message, programId } = req.body;
//     let transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: email,
//       to: process.env.DEMO_BOOKING_EMAIL,
//       subject: `Demo Booking Request for Program ID: ${programId}`,
//       text: `You have received a demo booking request.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
//     };

//     let info = await transporter.sendMail(mailOptions);
//     console.log("Email sent: ", info.response);
//     res.status(200).json({ message: 'Demo booking request sent successfully' });
//   } catch (error) {
//     console.error("Error in bookDemo:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { bookDemo };


const nodemailer = require('nodemailer');

const bookDemo = async (req, res) => {
  try {
    const { name, email, phone, message, programId } = req.body;

    // Validate required fields
    if (!name || !email || !programId) {
      return res.status(400).json({ message: "Name, email, and programId are required." });
    }

    // Ensure the recipient email is defined
    const recipient = process.env.DEMO_BOOKING_EMAIL;
    if (!recipient) {
      throw new Error("DEMO_BOOKING_EMAIL is not defined in the environment variables.");
    }

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Sender email address
        pass: process.env.EMAIL_PASS, // Email password or app-specific password
      },
    });

    const mailOptions = {
      from: email, // The sender (user's email)
      to: recipient, // Your Gmail account (rr3336675@gmail.com)
      subject: `Demo Booking Request for Program ID: ${programId}`,
      text: `You have received a demo booking request.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
    };

    let info = await transporter.sendMail(mailOptions);
    // console.log("Email sent:", info.response);
    res.status(200).json({ message: 'Demo booking request sent successfully' });
  } catch (error) {
    console.error("Error in bookDemo:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { bookDemo };
