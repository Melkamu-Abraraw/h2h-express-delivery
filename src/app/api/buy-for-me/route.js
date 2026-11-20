import nodemailer from "nodemailer";
import { checkStoreLink } from "@/lib/stores";

const REQUIRED = [
  "name",
  "phone",
  "email",
  "productLink",
  "productDetails",
  "quantity",
  "city",
  "contactMethod",
];

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isHttpUrl(value) {
  try {
    const url = new URL(String(value).trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const missing = REQUIRED.filter((key) => !String(body[key] ?? "").trim());
    if (
      missing.length > 0 ||
      !checkStoreLink(body.productLink).ok ||
      !["WhatsApp", "Telegram"].includes(body.contactMethod)
    ) {
      return Response.json(
        { error: "Missing or invalid fields" },
        { status: 400 },
      );
    }

    const d = Object.fromEntries(
      Object.entries(body).map(([k, v]) => [k, escapeHtml(v)]),
    );
    const link = escapeHtml(String(body.productLink).trim());

    const previewImage = isHttpUrl(body.previewImage)
      ? escapeHtml(String(body.previewImage).trim())
      : null;
    const previewBlock = body.previewTitle
      ? `
        <hr />

        <h3>Store preview</h3>
        ${previewImage ? `<p><img src="${previewImage}" alt="" width="160" style="max-width:160px;height:auto;" /></p>` : ""}
        <p><b>Title:</b> ${d.previewTitle}</p>
        <p><b>Store price:</b> ${d.previewPrice ? `${d.previewPrice} ${d.previewCurrency || ""}` : "Not available"}</p>
      `
      : "";

    // Optional photo from the customer (manual entry), sent as an attachment.
    const attachments = [];
    let photoBlock = "";
    const img = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/.exec(
      String(body.itemImage || ""),
    );
    if (img) {
      const content = Buffer.from(img[2], "base64");
      if (content.length <= 3 * 1024 * 1024) {
        const ext = img[1] === "jpeg" ? "jpg" : img[1];
        attachments.push({ filename: `item-photo.${ext}`, content, cid: "item-photo" });
        photoBlock = `<p><b>Customer photo:</b></p><p><img src="cid:item-photo" alt="" width="240" style="max-width:240px;height:auto;" /></p>`;
      }
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const html = `
      <div style="font-family: Arial; padding: 10px;">
        <h2>New Buy for Me Request</h2>

        <h3>Customer</h3>
        <p><b>Name:</b> ${d.name}</p>
        <p><b>Phone:</b> ${d.phone}</p>
        <p><b>Email:</b> ${d.email}</p>
        <p><b>Destination:</b> ${d.city}</p>
        <p><b>Preferred chat:</b> ${d.contactMethod}</p>

        <hr />

        <h3>Item</h3>
        <p><b>Link:</b> <a href="${link}">${link}</a></p>
        <p><b>Details:</b> ${d.productDetails}</p>
        ${photoBlock}
        <p><b>Options:</b> ${d.options || d.color || "Not specified"}</p>
        <p><b>Quantity:</b> ${d.quantity}</p>
        ${d.price ? `<p><b>Price (from customer):</b> ${d.price}</p>` : ""}
        ${previewBlock}
      </div>
    `;

    await transporter.sendMail({
      from: `"Website Buy for Me" <${process.env.EMAIL_USER}>`,
      to: process.env.COMPANY_EMAIL,
      subject: `Buy for Me Request - ${String(body.name).trim()}`,
      html,
      replyTo: String(body.email).trim(),
      attachments,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Buy for Me API Error:", err);
    return Response.json({ error: "Failed to send request" }, { status: 500 });
  }
}
