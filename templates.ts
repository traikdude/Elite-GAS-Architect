import { ScriptTemplate } from './types';

export const SCRIPT_TEMPLATES: ScriptTemplate[] = [
  {
    title: "Email Mail Merge",
    description: "Send personalized emails from a Google Sheet using a Gmail draft as a template.",
    tags: ["Gmail", "Sheets", "Automation"],
    code: `/**
 * Sends emails from a spreadsheet using a Gmail draft.
 * Requires a sheet named "Emails" with headers including "Email".
 */
function sendMailMerge() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Emails");
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // Get the draft message by subject line
  const drafts = GmailApp.getDrafts();
  const draft = drafts.find(d => d.getMessage().getSubject() === "Template Subject");
  if (!draft) throw new Error("Draft not found");
  
  // Iterate through rows (skipping header)
  data.slice(1).forEach(row => {
    let body = draft.getMessage().getBody();
    const emailIndex = headers.indexOf("Email");
    if (emailIndex === -1) throw new Error("Email column not found");
    
    const email = row[emailIndex];
    
    // Replace placeholders {{HeaderName}}
    headers.forEach((header, index) => {
      body = body.replace(new RegExp("{{" + header + "}}", "g"), row[index]);
    });
    
    GmailApp.sendEmail(email, draft.getMessage().getSubject(), "", { htmlBody: body });
  });
}`
  },
  {
    title: "Form Submission Receipt",
    description: "Automatically send a custom HTML email receipt when a Google Form is submitted.",
    tags: ["Forms", "Gmail", "Triggers"],
    code: `/**
 * Trigger this function on Form Submit (Installable Trigger).
 * @param {Object} e - The event object from the form submission.
 */
function onFormSubmit(e) {
  // e.namedValues is an object where keys are question titles
  const responses = e.namedValues;
  
  // Adjust keys based on your actual form questions
  const email = responses['Email Address'] ? responses['Email Address'][0] : null;
  const name = responses['Name'] ? responses['Name'][0] : 'there';
  
  if (!email) {
    Logger.log("No email address found in response");
    return;
  }
  
  const subject = "Confirmation of your submission";
  const body = \`
    <h3>Hi \${name},</h3>
    <p>Thanks for filling out our form. We have received your response.</p>
    <p>Best,<br>The Team</p>
  \`;
  
  GmailApp.sendEmail(email, subject, "", { htmlBody: body });
}`
  },
  {
    title: "Sheet to Calendar Events",
    description: "Bulk create Google Calendar events based on rows in a Google Sheet.",
    tags: ["Sheets", "Calendar", "Bulk Ops"],
    code: `function createCalendarEvents() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Events");
  const data = sheet.getDataRange().getValues();
  const calendarId = "primary"; // Or specific Calendar ID
  const calendar = CalendarApp.getCalendarById(calendarId);
  
  // Assume Row 1 is headers: Title, Start Time, End Time, Description
  // Data starts at row 2 (index 1)
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const title = row[0];
    const startTime = new Date(row[1]);
    const endTime = new Date(row[2]);
    const description = row[3];
    
    // Simple validation
    if (title && startTime && endTime) {
      calendar.createEvent(title, startTime, endTime, {
        description: description
      });
    }
  }
}`
  },
  {
    title: "Drive Folder Cleanup",
    description: "Periodically delete files in a specific folder that are older than X days.",
    tags: ["Drive", "Maintenance", "Time-based"],
    code: `function cleanUpOldFiles() {
  const folderId = "YOUR_TARGET_FOLDER_ID";
  const folder = DriveApp.getFolderById(folderId);
  const files = folder.getFiles();
  
  const DAYS_TO_KEEP = 30;
  // Calculate cutoff time in milliseconds
  const cutoff = new Date().getTime() - (DAYS_TO_KEEP * 24 * 60 * 60 * 1000);
  
  while (files.hasNext()) {
    const file = files.next();
    // Check if file hasn't been updated recently
    if (file.getLastUpdated().getTime() < cutoff) {
      Logger.log("Trashing file: " + file.getName());
      file.setTrashed(true);
    }
  }
}`
  },
  {
    title: "Slack Webhook Notifier",
    description: "Send a message to a Slack channel when a specific condition is met in Sheets.",
    tags: ["External API", "Slack", "Sheets"],
    code: `function sendSlackNotification() {
  const url = "YOUR_SLACK_WEBHOOK_URL";
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Dashboard");
  
  // Check a KPI cell
  const kpiValue = sheet.getRange("B2").getValue();
  const threshold = 100;
  
  if (kpiValue > threshold) {
    const payload = {
      "text": "🚨 *Alert*: Daily sales exceeded " + threshold + "! Current value: " + kpiValue
    };
    
    const options = {
      "method": "post",
      "contentType": "application/json",
      "payload": JSON.stringify(payload)
    };
    
    UrlFetchApp.fetch(url, options);
  }
}`
  },
  {
    title: "Daily PDF Report",
    description: "Convert a specific sheet tab to PDF and email it to a list of recipients.",
    tags: ["Sheets", "PDF", "Gmail"],
    code: `function emailSheetAsPDF() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Report");
  const sheetId = sheet.getSheetId();
  const ssId = ss.getId();
  
  // Construct the export URL
  const url = "https://docs.google.com/spreadsheets/d/" + ssId + "/export?format=pdf" +
              "&gid=" + sheetId + "&size=7&fzr=true&portrait=true&fitw=true";
              
  const token = ScriptApp.getOAuthToken();
  const response = UrlFetchApp.fetch(url, {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  
  const pdfBlob = response.getBlob().setName("Daily_Report.pdf");
  
  GmailApp.sendEmail(
    "recipient@example.com", 
    "Daily Report", 
    "Please find the daily report attached.", 
    { attachments: [pdfBlob] }
  );
}`
  }
];