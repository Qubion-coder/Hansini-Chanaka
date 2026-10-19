// RSVP receiver for the Chanaka & Hansini invitation.
// Deploy: Extensions > Apps Script in the sheet, paste this, then
// Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).

const SHEET_ID = '19nrExflxsmEHGFMcIUFvyX9pV1D0A9WDhDbSpzUCVfA';
const SHEET_NAME = 'RSVP';
const HEADERS = ['Timestamp', 'Name', 'Attending', 'Guests', 'Invited As', 'Notes'];

function getSheet_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = (e && e.parameter) || {};
    if (p.action !== 'rsvp') return json_({ ok: false, error: 'unknown action' });

    const guests = Math.min(10, Math.max(0, parseInt(p.guests, 10) || 0));
    getSheet_().appendRow([
      new Date(),
      String(p.name || '').slice(0, 200),
      guests > 0 ? 'Yes' : 'No',
      guests,
      String(p.invitedAs || '').slice(0, 200),
      String(p.dietaryNotes || '').slice(0, 500),
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Lets you open the /exec URL in a browser to check the deployment is live.
function doGet() {
  return json_({ ok: true, message: 'RSVP endpoint is running' });
}
