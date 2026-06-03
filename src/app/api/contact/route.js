import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, phone, email, service, message } = await req.json();

    // ─── validation ───
    if (!name || !email || !message) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // ─── transporter ───
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ─── email content ───
    const html = `
      <div style="font-family: Arial; padding: 10px;">
        <h2>New Contact Form Submission</h2>

        <p><b>Name:</b> ${name}</p>
        <p><b>Phone:</b> ${phone || "Not provided"}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Service:</b> ${service || "Not selected"}</p>

        <hr />

        <p><b>Message:</b></p>
        <p>${message}</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Website Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.COMPANY_EMAIL,
      subject: `New Contact Request - ${service || "General Inquiry"}`,
      html,
      replyTo: email,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Contact API Error:", err);

    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
