import { HotkeyNode } from './types';

export const SYSTEM_INSTRUCTION = `
Role: You are the Elite Google Apps Script Architect.
Mission: Engineer production-ready automation solutions, ensure code quality, and minimize user friction.

Priority Access Protocol:
1. Direct Implementation: Provide complete, working code immediately. Do not ask for clarification unless critical.
2. Context Verification: Only if ambiguous, ask ONE focused clarifying question.
3. Staged Delivery: For complex scripts (>200 lines), offer the 4-Question Workflow.

4-Question Workflow (for complex requests):
1. Full Script Delivery Method (Sectioned?)
2. Manual Revision Instructions?
3. Terminal AI Agent Integration?
4. Cross-Platform Analysis?

Formatting:
- Use markdown for all code.
- If providing a script, include JSDoc.
- Always be professional, "Elite", and precise.
`;

export const HOTKEY_DATA: HotkeyNode[] = [
  {
    code: 'G',
    title: 'Google Services Integration',
    children: [
      {
        code: 'G1',
        title: 'Core Services Setup',
        children: [
          { code: 'G11', title: 'Sheets Integration', description: 'SpreadsheetApp connection, ranges, validation' },
          { code: 'G12', title: 'Docs Integration', description: 'DocumentApp, body manipulation, styles' },
          { code: 'G13', title: 'Forms Integration', description: 'FormApp, questions, responses' },
          { code: 'G14', title: 'Drive Integration', description: 'DriveApp, files, folders, permissions' },
        ]
      },
      {
        code: 'G2',
        title: 'Communication Services',
        children: [
          { code: 'G21', title: 'Gmail Automation', description: 'GmailApp, threads, labels, drafts' },
          { code: 'G22', title: 'Calendar Management', description: 'CalendarApp, events, reminders' },
          { code: 'G23', title: 'Chat Integration', description: 'Webhooks, cards, interactive messages' },
        ]
      },
      {
        code: 'G4',
        title: 'Advanced Services',
        children: [
            { code: 'G41', title: 'Admin SDK', description: 'User management, groups, reports' },
            { code: 'G42', title: 'BigQuery', description: 'Query execution, datasets' }
        ]
      }
    ]
  },
  {
    code: 'S',
    title: 'Script Architecture',
    children: [
      {
        code: 'S1',
        title: 'Project Organization',
        children: [
          { code: 'S11', title: 'File Structure' },
          { code: 'S12', title: 'Naming Conventions' },
        ]
      },
      {
        code: 'S2',
        title: 'Code Patterns',
        children: [
            { code: 'S22', title: 'Error Handling', description: 'Try-catch, custom errors' },
            { code: 'S24', title: 'Async Patterns', description: 'Batch operations, lock service' }
        ]
      },
      {
         code: 'S4',
         title: 'Security Architecture',
         children: [
             { code: 'S41', title: 'Authentication', description: 'OAuth2, Service Accounts' },
             { code: 'S43', title: 'Data Protection', description: 'Sanitization, Encryption' }
         ]
      }
    ]
  },
  {
    code: 'T',
    title: 'Triggers & Automation',
    children: [
      { code: 'T1', title: 'Simple Triggers', description: 'onOpen, onEdit, onSelectionChange' },
      { code: 'T2', title: 'Installable Triggers', description: 'Time-based, Form submit' },
      { code: 'T3', title: 'Web App Deployment', description: 'doGet, doPost, HTML Service' }
    ]
  },
  {
    code: 'D',
    title: 'Debugging & Troubleshooting',
    children: [
      { code: 'D1', title: 'Error Diagnosis', description: 'Stack trace, Auth errors, Quotas' },
      { code: 'D2', title: 'Logging', description: 'Console logs, Stackdriver, Execution transcripts' }
    ]
  }
];

export const TROUBLESHOOTING_STEPS = [
    {
        id: 'start',
        question: "What type of issue are you experiencing?",
        options: [
            { label: "Authorization / Permissions", next: 'auth' },
            { label: "Script Failure / Crash", next: 'crash' },
            { label: "Unexpected Output", next: 'logic' }
        ]
    },
    {
        id: 'auth',
        question: "Are you getting a 'permission denied' or 'authorization required' error?",
        options: [
            { label: "Yes, specifically 'Service invoked too many times'", next: 'quota' },
            { label: "Yes, general permission error", next: 'auth_check' },
            { label: "No, it's something else", next: 'general_check' }
        ]
    },
    {
        id: 'crash',
        question: "Does the Execution Log show a red error message?",
        options: [
            { label: "Yes, 'Cannot find method...'", next: 'syntax' },
            { label: "Yes, 'Exceeded maximum execution time'", next: 'timeout' },
            { label: "No, it just stops silently", next: 'silent' }
        ]
    },
    {
        id: 'quota',
        solution: "Action: You hit a Google quota. Implement Batch Processing (S31) or CacheService (S32). Wait 24 hours if it's a daily email quota."
    },
    {
        id: 'auth_check',
        solution: "Action: Go to Run -> Run Function -> [Select Function]. Review Permissions. Ensure your appsscript.json manifest includes all necessary OAuth scopes."
    },
    {
        id: 'syntax',
        solution: "Action: Check your object types. You might be trying to call a Sheet method on a Range object. Consult the Reference (G11)."
    },
    {
        id: 'timeout',
        solution: "Action: Apps Script has a 6 min (consumer) or 30 min (workspace) limit. Break your script into chunks using Trigger chaining (T24) or optimize loops (S313)."
    },
    {
        id: 'logic',
        solution: "Action: Use Logger.log() at key checkpoints. Verify your loop indices and array logic. Remember Apps Script arrays are 0-indexed, but Sheets Rows are 1-indexed."
    },
    {
        id: 'silent',
        solution: "Action: Check your trigger setup. Simple triggers (onEdit) fail silently if they encounter permissions issues. Switch to an Installable Trigger (T2)."
    },
    {
        id: 'general_check',
        solution: "Run the Diagnostic Function: create a minimal reproduction case. Check Stackdriver Logging."
    }
];
