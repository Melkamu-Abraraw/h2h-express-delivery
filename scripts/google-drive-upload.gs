/**
 * H2H Express — Buy for Me photo upload to Google Drive
 *
 * Runs as a Google Apps Script web app under YOUR Google account. The website
 * sends it a customer's item photo; it saves the photo in one Drive folder and
 * returns a view link that goes into the WhatsApp/Telegram message.
 *
 * Setup (one time):
 *  1. In Google Drive, create a folder (e.g. "Buy for Me photos").
 *     Open it and copy the ID from the address bar:
 *     https://drive.google.com/drive/folders/<THIS_PART_IS_THE_ID>
 *  2. Go to https://script.google.com → New project → paste this whole file.
 *  3. Fill in FOLDER_ID and SECRET below. SECRET is any long random text;
 *     use the same value for DRIVE_UPLOAD_SECRET in the website's .env.
 *  4. Deploy → New deployment → type "Web app".
 *       Execute as:      Me
 *       Who has access:  Anyone
 *     Authorize when asked, then copy the "Web app URL" (ends in /exec)
 *     into DRIVE_UPLOAD_URL in the website's .env.
 *  5. Restart the website.
 *
 * Only requests with the correct SECRET are accepted, and only JPEG/PNG/WebP
 * images up to 3 MB. Photos are shared as "anyone with the link can view" so
 * your team can open them from the chat.
 */

const FOLDER_ID = "PASTE_YOUR_DRIVE_FOLDER_ID";
const SECRET = "PASTE_THE_SAME_SECRET_AS_DRIVE_UPLOAD_SECRET";
const MAX_BYTES = 3 * 1024 * 1024;

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (!body || body.secret !== SECRET) return json_({ ok: false, error: "unauthorized" });

    const m = /^data:(image\/(jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(body.image || "");
    if (!m) return json_({ ok: false, error: "invalid image" });

    const bytes = Utilities.base64Decode(m[3]);
    if (bytes.length > MAX_BYTES) return json_({ ok: false, error: "image too large" });

    const ext = m[2] === "jpeg" ? "jpg" : m[2];
    const stamp = Utilities.formatDate(new Date(), "UTC", "yyyy-MM-dd'T'HH-mm-ss'Z'");
    const name = "buy-for-me-" + stamp + "." + ext;

    const file = DriveApp.getFolderById(FOLDER_ID).createFile(
      Utilities.newBlob(bytes, m[1], name),
    );
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return json_({ ok: true, url: "https://drive.google.com/file/d/" + file.getId() + "/view" });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
