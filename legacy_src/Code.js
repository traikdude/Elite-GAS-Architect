/**
 * 🌟 MASTER AUTOMATION + STRATEGIC ENHANCEMENT SUITE (Container-bound Google Sheets)
 * Complete, production-ready Google Apps Script project.
 *
 * What you get:
 * ✅ Emoji-rich menu + sidebar + web app UI
 * ✅ Direct link opening (new tab) + copyable URL dialog (no “just a popup”)
 * ✅ Master Dashboard logging + installable onEdit trigger logging
 * ✅ Link Manager + Folder Manager
 * ✅ Strategic Work Product Enhancement + Autonomous Improvement Framework (AI Prompt Engineering System v1.0)
 *    - Analyze completed deliverables via 8 strategic lenses
 *    - Generate structured enhancement proposals (What/Why/How/When/Measure)
 *    - Create “LLM-ready” prompts and (optionally) call an external AI endpoint if configured
 *
 * Notes:
 * - This project is safe to paste into ANY container-bound Sheets script.
 * - No secrets embedded; optional AI calls require Script Properties.
 */

/** =======================================================================
 *  0) CONFIG
 *  ======================================================================= */
const MASTER_CONFIG = {
  MENU_NAME: "⚙️ Master Automation",
  MENU_EMOJI: "⚙️",
  ENABLE_TOASTS: true,

  LINKS: {
    COLAB: "",
    GITHUB: "",
    WEBAPP: "",
    PARENT_FOLDER: ""
  },

  THEME: {
    BRAND_NAME: "Master Automation Suite ✨",
    PRIMARY: "#6D28D9",
    SECONDARY: "#06B6D4",
    ACCENT: "#F59E0B",
    BG: "#0B1220",
    CARD: "#111A2E",
    TEXT: "#E5E7EB",
    MUTED: "#9CA3AF",
    SUCCESS: "#22C55E",
    WARNING: "#F59E0B",
    DANGER: "#EF4444"
  },

  DASHBOARD_SHEET_NAME: "Master Dashboard",
  DASHBOARD_FREEZE_ROWS: 1,

  REPORTS_SHEET_NAME: "Enhancement Reports",
  REPORTS_FREEZE_ROWS: 1,

  LOG_MAX_ROWS: 20000,
  LOG_AUTO_TRIM_ENABLED: true,
  LOG_INCLUDE_EDIT_EVENTS: true,

  // AI / External endpoint (optional)
  // Configure via Script Properties (Project Settings > Script properties):
  // AI_HTTP_ENDPOINT (required to enable calls)
  // AI_HTTP_BEARER_TOKEN (optional)
  // AI_HTTP_TIMEOUT_MS (optional, default 30000)
  // AI_HTTP_MODEL (optional)
  // AI_HTTP_EXTRA_HEADERS_JSON (optional JSON string)
  AI_DEFAULTS: {
    TIMEOUT_MS: 30000,
    MODEL: "default"
  }
};

/** =======================================================================
 *  1) ENTRYPOINTS (onOpen + doGet)
 *  ======================================================================= */
/**
 * Creates menus and ensures initialization.
 * @param {GoogleAppsScript.Events.SheetsOnOpen} e - onOpen event.
 */
function onOpen(e) {
  MASTER_ensureInitialized_({ reason: "onOpen" });
  MASTER_buildMenus_();
}

/**
 * Web app entry point (Deploy > New deployment > Web app).
 * @param {Object} e - Web request event.
 * @returns {GoogleAppsScript.HTML.HtmlOutput} HtmlOutput.
 */
function doGet(e) {
  MASTER_ensureInitialized_({ reason: "doGet" });
  const surface = (e && e.parameter && e.parameter.surface) ? String(e.parameter.surface) : "webapp";
  return MASTER_htmlUi_(surface)
    .setTitle(`${MASTER_CONFIG.THEME.BRAND_NAME}`)
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
}

/** =======================================================================
 *  2) INITIALIZATION
 *  ======================================================================= */
/**
 * Ensures core sheets, formatting, and triggers exist exactly once.
 * @param {Object} meta - Metadata about initialization reason.
 */
function MASTER_ensureInitialized_(meta) {
  const props = PropertiesService.getDocumentProperties();
  const isInit = props.getProperty("MASTER_INIT_DONE") === "true";
  if (isInit) return;

  const perf = MASTER_perfStart_();
  try {
    MASTER_ensureDashboardSheet_();
    MASTER_applyDashboardFormatting_();
    MASTER_ensureReportsSheet_();
    MASTER_applyReportsFormatting_();
    MASTER_ensureTriggers_();

    props.setProperty("MASTER_INIT_DONE", "true");
    props.setProperty("MASTER_INIT_AT_ISO", MASTER_nowIsoMs_());
    props.setProperty("MASTER_INIT_AT_EPOCH_MS", String(Date.now()));

    MASTER_logEvent_({
      eventType: "system",
      action: "initialize_framework",
      status: "success",
      durationMs: MASTER_perfEnd_(perf),
      meta: meta || {}
    });

    if (MASTER_CONFIG.ENABLE_TOASTS) {
      SpreadsheetApp.getActive().toast("✅ Master framework initialized!", "Master Automation ✨", 4);
    }
  } catch (err) {
    MASTER_logEvent_({
      eventType: "system",
      action: "initialize_framework",
      status: "failure",
      durationMs: MASTER_perfEnd_(perf),
      error: err,
      meta: meta || {}
    });
    throw err;
  }
}

/**
 * Optional manual initializer.
 */
function MASTER_initManually() {
  MASTER_ensureInitialized_({ reason: "manual" });
  MASTER_buildMenus_();
}

/** =======================================================================
 *  3) MENUS (Master + Enhancement + Debug)
 *  ======================================================================= */
function MASTER_buildMenus_() {
  let ui;
  try {
    ui = SpreadsheetApp.getUi();
  } catch (e) {
    console.warn("MASTER_buildMenus_: Cannot access UI (likely running in non-bound context). Skipping menu creation.");
    return;
  }

  // Master menu
  const menu = ui.createMenu(`${MASTER_CONFIG.MENU_NAME} ${MASTER_CONFIG.MENU_EMOJI}`);
  menu.addItem("🎛️ Control Bridge Dashboard", "BRIDGE_openSheet");
  menu.addSeparator();
  menu.addItem("🏠 Open Sidebar (Quick Panel)", "MASTER_showSidebar");
  menu.addItem("🌐 Open Web App UI", "MASTER_openWebAppLink");
  menu.addSeparator();
  menu.addItem("🧪 Google Colab", "MASTER_openColab");
  menu.addItem("🐙 GitHub Repo", "MASTER_openGitHub");
  menu.addItem("🚀 Web App Deployment", "MASTER_openDeploymentHub");
  menu.addItem("🗂️ Folder Manager", "MASTER_showFolderManagerDialog");
  menu.addSeparator();
  menu.addItem("💬 AI Architect Chat", "MASTER_showChatSidebar");
  menu.addItem("🧬 Strategic Framework (W/E/P/V)", "MASTER_showFrameworkSidebar");
  menu.addItem("🔧 Troubleshooter Wizard", "MASTER_showTroubleshooterDialog");
  menu.addSeparator();
  menu.addItem("📊 Open Master Dashboard", "MASTER_openDashboard");
  menu.addItem("🧾 View Recent Logs (Dialog)", "MASTER_showRecentLogsDialog");
  menu.addSeparator();
  menu.addItem("🔗 Link Manager (Set URLs)", "MASTER_showLinkManagerDialog");
  menu.addItem("🔄 Reset Links to Blank", "MASTER_resetLinks");
  menu.addSeparator();
  menu.addItem("💡 About / Help", "MASTER_showAboutDialog");
  menu.addToUi();

  // Enhancement menu
  const enh = ui.createMenu("🧠 Enhancement Studio");
  enh.addItem("🧠 Open Enhancement Sidebar", "MASTER_showEnhancementSidebar");
  enh.addItem("🧾 Generate Enhancement Prompt (Dialog)", "MASTER_showPromptBuilderDialog");
  enh.addItem("📄 Create Enhancement Report from Selection", "MASTER_reportFromSelection");
  enh.addSeparator();
  enh.addItem("📘 Open Enhancement Reports Sheet", "MASTER_openReportsSheet");
  enh.addToUi();

  // Debug menu
  const dbg = ui.createMenu("🐞 Debug");
  dbg.addItem("ENV Dump", "DEBUG_menuEnvDump");
  dbg.addItem("Run Function… (Dialog)", "DEBUG_menuRunFunctionDialog");
  dbg.addItem("Open Executions Page", "DEBUG_openExecutionsPage");
  dbg.addToUi();
}

/** =======================================================================
 *  4) NAVIGATION + LINK OPENING (Direct open + Copyable dialog)
 *  ======================================================================= */
function MASTER_openColab() {
  MASTER_openLinkKey_("COLAB", { from: "menu" });
}
function MASTER_openGitHub() {
  MASTER_openLinkKey_("GITHUB", { from: "menu" });
}
function MASTER_openWebAppLink() {
  const configured = MASTER_getLink_("WEBAPP");
  if (configured) {
    MASTER_openUrlDirectWithCopy_(configured, "🌐 Web App");
    return;
  }
  // If not configured, open Link Manager (and also show how to get web app URL)
  MASTER_showLinkManagerDialog();
}
function MASTER_openDeploymentHub() {
  MASTER_openUrlDirectWithCopy_("https://script.google.com/home", "🚀 Deployment Hub");
}

/**
 * Opens a configured link key, or opens Link Manager if missing.
 * @param {string} key - Link key in LINKS.
 * @param {Object} meta - Meta.
 */
function MASTER_openLinkKey_(key, meta) {
  const perf = MASTER_perfStart_();
  try {
    const url = MASTER_getLink_(key);
    if (!url) {
      MASTER_logEvent_({
        eventType: "navigation",
        action: `open_link_missing_${String(key)}`,
        status: "warning",
        durationMs: MASTER_perfEnd_(perf),
        meta: meta || {}
      });
      MASTER_showLinkManagerDialog();
      return;
    }

    MASTER_openUrlDirectWithCopy_(url, `🔗 ${String(key).toUpperCase()}`);
    MASTER_logEvent_({
      eventType: "navigation",
      action: `open_link_${String(key)}`,
      status: "success",
      durationMs: MASTER_perfEnd_(perf),
      meta: Object.assign({ url: url }, meta || {})
    });
  } catch (err) {
    MASTER_logEvent_({
      eventType: "navigation",
      action: `open_link_${String(key)}`,
      status: "failure",
      durationMs: MASTER_perfEnd_(perf),
      error: err,
      meta: meta || {}
    });
    throw err;
  }
}

/**
 * ✅ Fix: opens the link (new tab) AND shows a copyable URL input.
 * - Uses client-side HTML (required) because menu functions run server-side.
 * - Auto-opens immediately, but keeps the dialog so you can copy the URL.
 * @param {string} url - URL to open.
 * @param {string} title - Dialog title.
 */
function MASTER_openUrlDirectWithCopy_(url, title) {
  const safeUrl = String(url || "").trim();
  if (!safeUrl) return;

  const html = HtmlService.createHtmlOutput(
    `<!doctype html>
<html>
<head>
  <base target="_top">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${MASTER_escapeHtml_(title || "Open Link")}</title>
  <style>
    :root{--bg:#0B1220;--card:#111A2E;--text:#E5E7EB;--muted:#9CA3AF;--primary:#6D28D9;}
    html,body{margin:0;padding:0;background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;}
    .wrap{padding:14px;}
    .card{background:linear-gradient(180deg,rgba(17,26,46,.95),rgba(17,26,46,.78));
      border:1px solid rgba(255,255,255,.10);border-radius:16px;padding:12px;
      box-shadow:0 14px 35px rgba(0,0,0,.35);}
    .row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;justify-content:space-between}
    .title{font-weight:800;font-size:13px}
    .muted{color:var(--muted);font-size:12px;line-height:1.3;margin-top:4px}
    .input{margin-top:10px;display:flex;gap:10px;align-items:center}
    input{flex:1;min-width:220px;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.14);
      background:rgba(255,255,255,.06);color:var(--text);outline:none}
    input:focus{border-color:rgba(109,40,217,.65);box-shadow:0 0 0 3px rgba(109,40,217,.18)}
    button{cursor:pointer;border:none;border-radius:12px;padding:10px 12px;font-weight:800;color:var(--text);
      background:linear-gradient(135deg,var(--primary),rgba(109,40,217,.55));border:1px solid rgba(255,255,255,.12);}
    .ghost{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);font-weight:700}
    .msg{margin-top:10px;font-size:12px;color:var(--muted)}
    .ok{color:#22C55E;font-weight:800}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="row">
        <div>
          <div class="title">🔗 Opening in a new tab…</div>
          <div class="muted">If your browser blocks popups, allow popups for Google Sheets.</div>
        </div>
        <div class="row">
          <button class="ghost" onclick="retry()">↻ Retry</button>
          <button class="ghost" onclick="closeMe()">✕ Close</button>
        </div>
      </div>

      <div class="input">
        <input id="url" readonly />
        <button onclick="copyUrl()">📋 Copy</button>
      </div>

      <div id="status" class="msg"></div>
    </div>
  </div>

  <script>
    const URL = ${JSON.stringify(safeUrl)};

    function openNow(){
      try {
        const w = window.open(URL, "_blank", "noopener,noreferrer");
        const ok = !!w;
        const el = document.getElementById("status");
        el.innerHTML = ok
          ? '<span class="ok">✅ Opened.</span> You can copy the link below.' 
          : 'Popup may be blocked. Use <b>Retry</b>, or copy the link.';
      } catch (e) {
        const el = document.getElementById("status");
        el.textContent = "Popup may be blocked. Copy the link below.";
      }
    }

    function retry(){ openNow(); }

    function copyUrl(){
      const input = document.getElementById("url");
      input.focus();
      input.select();
      try {
        const ok = document.execCommand("copy");
        const el = document.getElementById("status");
        el.innerHTML = ok
          ? '<span class="ok">✅ Copied.</span>'
          : 'Copy failed. Select the text and press Ctrl/Cmd+C.';
      } catch(e){
        const el = document.getElementById("status");
        el.textContent = "Copy failed. Select the text and press Ctrl/Cmd+C.";
      }
    }

    function closeMe(){
      try { google.script.host.close(); } catch(e) { window.close(); }
    }

    (function init(){
      const input = document.getElementById("url");
      input.value = URL;
      setTimeout(openNow, 50);
      setTimeout(()=>{ try{ input.focus(); input.select(); }catch(e){} }, 250);
    })();
  </script>
</body>
</html>`
  ).setWidth(560).setHeight(220);

  SpreadsheetApp.getUi().showModelessDialog(html, title || "Open Link");
}

/** =======================================================================
 *  5) UI SURFACES (Sidebar + Dialogs + Web App)
 *  ======================================================================= */
function MASTER_showSidebar() {
  MASTER_showUi_("sidebar", "🏠 Quick Panel");
}
function MASTER_showEnhancementSidebar() {
  MASTER_showUi_("enh_sidebar", "🧠 Enhancement Studio");
}
function MASTER_showAboutDialog() {
  MASTER_showUiModal_("about", "💡 About Master Automation", 560, 560);
}
function MASTER_showLinkManagerDialog() {
  MASTER_showUiModal_("links", "🔗 Link Manager", 620, 620);
}
function MASTER_showFolderManagerDialog() {
  MASTER_showUiModal_("folders", "🗂️ Folder Manager", 620, 620);
}
function MASTER_showRecentLogsDialog() {
  MASTER_showUiModal_("logs", "🧾 Recent Activity", 920, 620);
}
function MASTER_showPromptBuilderDialog() {
  MASTER_showUiModal_("prompt", "🧾 Enhancement Prompt Builder", 920, 650);
}

/**
 * Opens a UI surface in the sidebar.
 * @param {string} surface - Surface name.
 * @param {string} title - Title.
 */
function MASTER_showUi_(surface, title) {
  const perf = MASTER_perfStart_();
  try {
    const html = MASTER_htmlUi_(surface);
    SpreadsheetApp.getUi().showSidebar(html);

    MASTER_logEvent_({
      eventType: "ui",
      action: `show_sidebar_${surface}`,
      status: "success",
      durationMs: MASTER_perfEnd_(perf),
      meta: { title: title }
    });
  } catch (err) {
    MASTER_logEvent_({
      eventType: "ui",
      action: `show_sidebar_${surface}`,
      status: "failure",
      durationMs: MASTER_perfEnd_(perf),
      error: err
    });
    throw err;
  }
}

/**
 * Opens a UI surface in a modal dialog.
 * @param {string} surface - Surface name.
 * @param {string} title - Title.
 * @param {number} width - Width.
 * @param {number} height - Height.
 */
function MASTER_showUiModal_(surface, title, width, height) {
  const perf = MASTER_perfStart_();
  try {
    const html = MASTER_htmlUi_(surface).setWidth(Number(width)).setHeight(Number(height));
    SpreadsheetApp.getUi().showModalDialog(html, title);

    MASTER_logEvent_({
      eventType: "ui",
      action: `show_modal_${surface}`,
      status: "success",
      durationMs: MASTER_perfEnd_(perf),
      meta: { title: title }
    });
  } catch (err) {
    MASTER_logEvent_({
      eventType: "ui",
      action: `show_modal_${surface}`,
      status: "failure",
      durationMs: MASTER_perfEnd_(perf),
      error: err
    });
    throw err;
  }
}

/**
 * Returns HtmlOutput for our single Ui.html file, injecting a surface selector.
 * @param {string} surface - UI surface.
 * @returns {GoogleAppsScript.HTML.HtmlOutput} HtmlOutput.
 */
function MASTER_htmlUi_(surface) {
  // Handle new surfaces (Chat/Troubleshoot/Framework) which are separate files
  if (surface === "chat") {
    return HtmlService.createTemplateFromFile("Chat").evaluate().setTitle("💬 AI Chat");
  }
  if (surface === "troubleshoot") {
    return HtmlService.createTemplateFromFile("Troubleshoot").evaluate().setTitle("🔧 Troubleshooter");
  }
  if (surface === "framework") {
    return HtmlService.createTemplateFromFile("Framework").evaluate().setTitle("🧬 Strategic Framework");
  }

  const t = MASTER_configForUi_();
  const template = HtmlService.createTemplateFromFile("Ui");
  template.APP_BOOTSTRAP_JSON = JSON.stringify({
    surface: String(surface || "webapp"),
    theme: t.theme,
    links: t.links,
    brand: t.brand,
    menuName: t.menuName
  });

  return template.evaluate()
    .setTitle(`${MASTER_CONFIG.THEME.BRAND_NAME}`);
}

/**
 * @param {Object} Config bundle for UI.
 */
function MASTER_configForUi_() {
  return {
    theme: MASTER_CONFIG.THEME,
    links: (function () {
      const out = {};
      Object.keys(MASTER_CONFIG.LINKS).forEach(k => (out[k] = MASTER_getLink_(k)));
      return out;
    })(),
    brand: MASTER_CONFIG.THEME.BRAND_NAME,
    menuName: MASTER_CONFIG.MENU_NAME
  };
}

/** =======================================================================
 *  6) DASHBOARD (Logging)
 *  ======================================================================= */
function MASTER_dashboardHeaders_() {
  return [
    "timestamp_iso_ms",
    "date_local",
    "time_local",
    "epoch_ms",
    "event_type",
    "action",
    "user",
    "status",
    "duration_ms",
    "remaining_quota_hint",
    "error_message",
    "stack_trace",
    "meta_json"
  ];
}

/**
 * Ensures the Master Dashboard sheet exists and has headers.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} Sheet.
 */
function MASTER_ensureDashboardSheet_() {
  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(MASTER_CONFIG.DASHBOARD_SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(MASTER_CONFIG.DASHBOARD_SHEET_NAME);

  const headers = MASTER_dashboardHeaders_();
  const firstRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const needsHeader = firstRow.join("").trim() !== headers.join("").trim();
  if (needsHeader) sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  sheet.setFrozenRows(MASTER_CONFIG.DASHBOARD_FREEZE_ROWS);

  const lastCol = headers.length;
  if (!sheet.getFilter()) {
    sheet.getRange(1, 1, Math.max(sheet.getLastRow(), 2), lastCol).createFilter();
  }

  sheet.setColumnWidths(1, 3, 160);
  sheet.setColumnWidth(4, 120);
  sheet.setColumnWidth(5, 140);
  sheet.setColumnWidth(6, 240);
  sheet.setColumnWidth(7, 220);
  sheet.setColumnWidth(8, 110);
  sheet.setColumnWidth(9, 120);
  sheet.setColumnWidth(10, 160);
  sheet.setColumnWidth(11, 280);
  sheet.setColumnWidth(12, 380);
  sheet.setColumnWidth(13, 380);

  return sheet;
}

/**
 * Applies dashboard header and conditional formatting.
 */
function MASTER_applyDashboardFormatting_() {
  const sheet = MASTER_ensureDashboardSheet_();
  const headers = MASTER_dashboardHeaders_();
  const headerRange = sheet.getRange(1, 1, 1, headers.length);

  headerRange.setFontWeight("bold").setBackground("#111827").setFontColor("#F9FAFB");

  const statusCol = 8;
  const rng = sheet.getRange(2, statusCol, sheet.getMaxRows() - 1, 1);

  const rules = [];
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("success")
    .setBackground(MASTER_CONFIG.THEME.SUCCESS)
    .setFontColor("#0B1220")
    .setRanges([rng])
    .build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("warning")
    .setBackground(MASTER_CONFIG.THEME.WARNING)
    .setFontColor("#0B1220")
    .setRanges([rng])
    .build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("failure")
    .setBackground(MASTER_CONFIG.THEME.DANGER)
    .setFontColor("#F9FAFB")
    .setRanges([rng])
    .build());

  sheet.setConditionalFormatRules(rules);

  const maxRows = Math.min(sheet.getMaxRows() - 1, 200);
  if (maxRows > 0) sheet.setRowHeights(2, maxRows, 24);
}

/**
 * Central logger (writes to Master Dashboard).
 * @param {Object} payload - Log payload.
 */
function MASTER_logEvent_(payload) {
  const sheet = MASTER_ensureDashboardSheet_();
  const now = new Date();

  const iso = MASTER_nowIsoMs_(now);
  const epochMs = now.getTime();
  const dateLocal = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd");
  const timeLocal = Utilities.formatDate(now, Session.getScriptTimeZone(), "HH:mm:ss");

  const user = MASTER_safeUserEmail_();
  const eventType = payload && payload.eventType ? String(payload.eventType) : "unknown";
  const action = payload && payload.action ? String(payload.action) : "unknown";
  const status = payload && payload.status ? String(payload.status) : "success";
  const durationMs = payload && typeof payload.durationMs === "number" ? payload.durationMs : "";
  const remainingQuotaHint = MASTER_quotaHint_();

  const errorMessage = payload && payload.error ? MASTER_errorMessage_(payload.error) : "";
  const stackTrace = payload && payload.error ? MASTER_errorStack_(payload.error) : "";
  const metaJson = JSON.stringify(payload && payload.meta ? payload.meta : {});

  sheet.appendRow([
    iso, dateLocal, timeLocal, epochMs, eventType, action, user, status, durationMs,
    remainingQuotaHint, errorMessage, stackTrace, metaJson
  ]);

  if (MASTER_CONFIG.LOG_AUTO_TRIM_ENABLED) MASTER_trimLogsIfNeeded_(sheet);
}

/**
 * Trims oldest logs beyond max.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - Dashboard sheet.
 */
function MASTER_trimLogsIfNeeded_(sheet) {
  const max = MASTER_CONFIG.LOG_MAX_ROWS;
  if (!max || max < 1000) return;

  const lastRow = sheet.getLastRow();
  if (lastRow <= max) return;

  const rowsToDelete = lastRow - max;
  if (rowsToDelete > 0) sheet.deleteRows(2, rowsToDelete);
}

/**
 * Opens Master Dashboard sheet.
 */
function MASTER_openDashboard() {
  const perf = MASTER_perfStart_();
  try {
    const ss = SpreadsheetApp.getActive();
    const sheet = MASTER_ensureDashboardSheet_();
    ss.setActiveSheet(sheet);

    MASTER_logEvent_({
      eventType: "navigation",
      action: "open_dashboard_sheet",
      status: "success",
      durationMs: MASTER_perfEnd_(perf),
      meta: { from: "menu_or_ui" }
    });
  } catch (err) {
    MASTER_logEvent_({
      eventType: "navigation",
      action: "open_dashboard_sheet",
      status: "failure",
      durationMs: MASTER_perfEnd_(perf),
      error: err
    });
    throw err;
  }
}

/**
 * Returns recent logs for UI.
 * @param {number} limit - Max rows (1..200).
 * @returns {Array<Object>} Log rows (newest first).
 */
function MASTER_apiGetRecentLogs(limit) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(MASTER_CONFIG.DASHBOARD_SHEET_NAME);
  if (!sheet) return [];

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const headers = MASTER_dashboardHeaders_();
  const n = Math.max(1, Math.min(Number(limit || 30), 200));
  const startRow = Math.max(2, lastRow - n + 1);
  const numRows = lastRow - startRow + 1;

  const values = sheet.getRange(startRow, 1, numRows, headers.length).getValues();
  values.reverse();

  return values.map(r => ({
    timestamp: r[0],
    eventType: r[4],
    action: r[5],
    user: r[6],
    status: r[7],
    meta: r[12]
  }));
}

/** =======================================================================
 *  7) TRIGGERS (Installable onEdit logging)
 *  ======================================================================= */
/**
 * Ensures installable triggers exist (idempotent).
 */
function MASTER_ensureTriggers_() {
  if (!MASTER_CONFIG.LOG_INCLUDE_EDIT_EVENTS) return;

  const ss = SpreadsheetApp.getActive();
  const triggers = ScriptApp.getProjectTriggers();
  const hasEdit = triggers.some(t => t.getHandlerFunction() === "MASTER_onEditHandler");
  if (!hasEdit) {
    ScriptApp.newTrigger("MASTER_onEditHandler")
      .forSpreadsheet(ss)
      .onEdit()
      .create();
  }
}

/**
 * Installable onEdit handler (logs edits when available).
 * @param {GoogleAppsScript.Events.SheetsOnEdit} e - Edit event.
 */
function MASTER_onEditHandler(e) {
  // Route Control Bridge actions first
  if (e && e.range) {
    try {
      BRIDGE_handleAction_(e);
    } catch (bridgeErr) {
      console.error("BRIDGE_handleAction_ error:", bridgeErr);
    }
  }

  // Skip logging for Control Bridge and Config sheets to avoid noise
  const sheetName = e && e.range ? e.range.getSheet().getName() : "";
  if (sheetName === "_ControlBridge" || sheetName === "_Config") return;

  const perf = MASTER_perfStart_();
  try {
    const a1 = e && e.range ? e.range.getA1Notation() : "";
    const oldValue = e && typeof e.oldValue !== "undefined" ? e.oldValue : "";
    const value = e && e.range ? e.range.getDisplayValue() : "";

    MASTER_logEvent_({
      eventType: "edit",
      action: "sheet_edit",
      status: "success",
      durationMs: MASTER_perfEnd_(perf),
      meta: { sheet: sheetName, range: a1, oldValue: oldValue, newValue: value }
    });
  } catch (err) {
    MASTER_logEvent_({
      eventType: "edit",
      action: "sheet_edit",
      status: "failure",
      durationMs: MASTER_perfEnd_(perf),
      error: err
    });
  }
}

/** =======================================================================
 *  8) LINK STORAGE API
 *  ======================================================================= */
/**
 * Gets link for key from Document Properties, fallback to config.
 * @param {string} key - Link key.
 * @returns {string} URL string.
 */
function MASTER_getLink_(key) {
  const props = PropertiesService.getDocumentProperties();
  const cleanKey = String(key || "").trim().toUpperCase();
  const stored = props.getProperty(`MASTER_LINK_${cleanKey}`);
  if (stored !== null && stored !== undefined) return String(stored).trim();
  return String((MASTER_CONFIG.LINKS && MASTER_CONFIG.LINKS[cleanKey]) || "").trim();
}

/**
 * Sets link key in Document Properties.
 * @param {string} key - Link key.
 * @param {string} url - URL.
 * @returns {{ok:boolean,message?:string}} Result.
 */
function MASTER_setLink_(key, url) {
  const perf = MASTER_perfStart_();
  try {
    const cleanKey = String(key || "").trim().toUpperCase();
    const cleanUrl = String(url || "").trim();
    PropertiesService.getDocumentProperties().setProperty(`MASTER_LINK_${cleanKey}`, cleanUrl);

    MASTER_logEvent_({
      eventType: "config",
      action: `set_link_${cleanKey}`,
      status: "success",
      durationMs: MASTER_perfEnd_(perf),
      meta: { url: cleanUrl }
    });

    if (MASTER_CONFIG.ENABLE_TOASTS) {
      SpreadsheetApp.getActive().toast(`✅ Saved link for ${cleanKey}`, "Link Manager 🔗", 3);
    }

    return { ok: true };
  } catch (err) {
    MASTER_logEvent_({
      eventType: "config",
      action: "set_link",
      status: "failure",
      durationMs: MASTER_perfEnd_(perf),
      error: err,
      meta: { key: key, url: url }
    });
    return { ok: false, message: MASTER_errorMessage_(err) };
  }
}

/**
 * Resets stored links for configured keys.
 */
function MASTER_resetLinks() {
  const perf = MASTER_perfStart_();
  try {
    const props = PropertiesService.getDocumentProperties();
    Object.keys(MASTER_CONFIG.LINKS).forEach(k => props.deleteProperty(`MASTER_LINK_${k}`));

    MASTER_logEvent_({
      eventType: "config",
      action: "reset_links",
      status: "success",
      durationMs: MASTER_perfEnd_(perf)
    });

    if (MASTER_CONFIG.ENABLE_TOASTS) {
      SpreadsheetApp.getActive().toast("🔄 Links reset to blank defaults", "Link Manager 🔗", 3);
    }
  } catch (err) {
    MASTER_logEvent_({
      eventType: "config",
      action: "reset_links",
      status: "failure",
      durationMs: MASTER_perfEnd_(perf),
      error: err
    });
    throw err;
  }
}

/**
 * UI API: Get links bundle.
 * @returns {{ok:boolean,links:Object,theme:Object,menuName:string,brand:string}}
 */
function MASTER_apiGetLinks() {
  const links = {};
  Object.keys(MASTER_CONFIG.LINKS).forEach(k => (links[k] = MASTER_getLink_(k)));
  return {
    ok: true,
    links: links,
    theme: MASTER_CONFIG.THEME,
    menuName: MASTER_CONFIG.MENU_NAME,
    brand: MASTER_CONFIG.THEME.BRAND_NAME
  };
}

/**
 * UI API: Save a link.
 * @param {{key:string,url:string}} payload - Payload.
 * @returns {{ok:boolean,message?:string}} Result.
 */
function MASTER_apiSetLink(payload) {
  const key = payload && payload.key ? payload.key : "";
  const url = payload && payload.url ? payload.url : "";
  return MASTER_setLink_(key, url);
}

/** =======================================================================
 *  9) FOLDER MANAGEMENT (Drive organization)
 *  ======================================================================= */
/**
 * Creates a project folder named after the spreadsheet and subfolders.
 * Respects PARENT_FOLDER link (Drive folder ID) if set; otherwise creates in My Drive root.
 * @returns {{ok:boolean,folderId?:string,folderUrl?:string,folderName?:string,message?:string}}
 */
function MASTER_createProjectFolder() {
  const perf = MASTER_perfStart_();
  try {
    const ss = SpreadsheetApp.getActive();
    const name = ss.getName();
    const parentId = MASTER_getLink_("PARENT_FOLDER");

    const parent = parentId ? DriveApp.getFolderById(parentId) : DriveApp.getRootFolder();
    const projectFolder = parent.createFolder(`🗂️ ${name} — Project Assets`);

    const subfolders = [
      "📦 Exports",
      "🧾 Logs",
      "🧪 Colab",
      "🐙 GitHub",
      "🌐 WebApp",
      "🗃️ Archive"
    ];
    subfolders.forEach(n => projectFolder.createFolder(n));

    PropertiesService.getDocumentProperties().setProperty("MASTER_PROJECT_FOLDER_ID", projectFolder.getId());

    MASTER_logEvent_({
      eventType: "drive",
      action: "create_project_folder",
      status: "success",
      durationMs: MASTER_perfEnd_(perf),
      meta: { folderId: projectFolder.getId(), folderName: projectFolder.getName() }
    });

    if (MASTER_CONFIG.ENABLE_TOASTS) {
      SpreadsheetApp.getActive().toast("✅ Project folder created in Drive!", "Folder Manager 🗂️", 4);
    }

    return { ok: true, folderId: projectFolder.getId(), folderUrl: projectFolder.getUrl(), folderName: projectFolder.getName() };
  } catch (err) {
    MASTER_logEvent_({
      eventType: "drive",
      action: "create_project_folder",
      status: "failure",
      durationMs: MASTER_perfEnd_(perf),
      error: err
    });
    return { ok: false, message: MASTER_errorMessage_(err) };
  }
}

/**
 * Gets project folder info.
 * @returns {{ok:boolean,folderId?:string,folderUrl?:string,folderName?:string,message?:string}}
 */
function MASTER_getProjectFolderInfo() {
  const id = PropertiesService.getDocumentProperties().getProperty("MASTER_PROJECT_FOLDER_ID");
  if (!id) return { ok: false, message: "No project folder created yet." };
  try {
    const f = DriveApp.getFolderById(id);
    return { ok: true, folderId: id, folderUrl: f.getUrl(), folderName: f.getName() };
  } catch (err) {
    return { ok: false, message: MASTER_errorMessage_(err) };
  }
}

/** =======================================================================
 *  10) ENHANCEMENT REPORTS SHEET
 *  ======================================================================= */
function MASTER_reportsHeaders_() {
  return [
    "created_iso_ms",
    "created_by",
    "work_product_title",
    "source",
    "word_count",
    "signals_json",
    "analysis_markdown",
    "proposal_markdown",
    "prompt_markdown",
    "ai_response_markdown"
  ];
}

/**
 * Ensures Enhancement Reports sheet exists.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} Sheet.
 */
function MASTER_ensureReportsSheet_() {
  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(MASTER_CONFIG.REPORTS_SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(MASTER_CONFIG.REPORTS_SHEET_NAME);

  const headers = MASTER_reportsHeaders_();
  const firstRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const needsHeader = firstRow.join("").trim() !== headers.join("").trim();
  if (needsHeader) sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  sheet.setFrozenRows(MASTER_CONFIG.REPORTS_FREEZE_ROWS);

  if (!sheet.getFilter()) {
    sheet.getRange(1, 1, Math.max(sheet.getLastRow(), 2), headers.length).createFilter();
  }

  sheet.setColumnWidth(1, 170);
  sheet.setColumnWidth(2, 220);
  sheet.setColumnWidth(3, 240);
  sheet.setColumnWidth(4, 140);
  sheet.setColumnWidth(5, 110);
  sheet.setColumnWidth(6, 320);
  sheet.setColumnWidth(7, 560);
  sheet.setColumnWidth(8, 560);
  sheet.setColumnWidth(9, 560);
  sheet.setColumnWidth(10, 560);

  return sheet;
}

/**
 * Applies basic formatting for reports sheet.
 */
function MASTER_applyReportsFormatting_() {
  const sheet = MASTER_ensureReportsSheet_();
  const headers = MASTER_reportsHeaders_();
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight("bold")
    .setBackground("#111827")
    .setFontColor("#F9FAFB");
}

/**
 * Opens Enhancement Reports sheet.
 */
function MASTER_openReportsSheet() {
  const ss = SpreadsheetApp.getActive();
  const sheet = MASTER_ensureReportsSheet_();
  ss.setActiveSheet(sheet);
}

/** =======================================================================
 *  11) ENHANCEMENT STUDIO (Strategic Work Product Enhancement Framework)
 *  ======================================================================= */

/**
 * Creates a report from the current selection in the sheet.
 * - If selection is multiple cells, concatenates them in reading order.
 * - If selection is empty, warns user.
 */
function MASTER_reportFromSelection() {
  const perf = MASTER_perfStart_();
  try {
    const ss = SpreadsheetApp.getActive();
    const range = ss.getActiveRange();
    if (!range) {
      SpreadsheetApp.getUi().alert("No selection found. Select cells containing your work product text and try again.");
      return;
    }

    const values = range.getDisplayValues();
    const flat = [];
    for (let r = 0; r < values.length; r++) {
      for (let c = 0; c < values[0].length; c++) {
        const v = String(values[r][c] || "").trim();
        if (v) flat.push(v);
      }
    }

    const text = flat.join("\n\n").trim();
    if (!text) {
      SpreadsheetApp.getUi().alert("Selection is empty. Select cells containing your work product text and try again.");
      return;
    }

    const titleGuess = MASTER_guessTitle_(text);
    const result = MASTER_generateEnhancementPackage_({
      workProductText: text,
      title: titleGuess,
      source: `Sheet:${range.getSheet().getName()} ${range.getA1Notation()}`,
      mode: "selection"
    });

    MASTER_appendEnhancementReportRow_(result);

    MASTER_logEvent_({
      eventType: "enhancement",
      action: "report_from_selection",
      status: "success",
      durationMs: MASTER_perfEnd_(perf),
      meta: { source: result.source, title: result.title, wordCount: result.wordCount }
    });

    SpreadsheetApp.getActive().toast("✅ Enhancement report created (see 'Enhancement Reports')", "🧠 Enhancement Studio", 5);
    MASTER_openReportsSheet();
  } catch (err) {
    MASTER_logEvent_({
      eventType: "enhancement",
      action: "report_from_selection",
      status: "failure",
      durationMs: MASTER_perfEnd_(perf),
      error: err
    });
    throw err;
  }
}

/**
 * UI API: Generate enhancement package from raw text.
 * @param {{title:string,source:string,workProductText:string,callAi:boolean}} payload - Input.
 * @returns {Object} Enhancement package.
 */
function MASTER_apiGenerateEnhancement(payload) {
  const perf = MASTER_perfStart_();
  try {
    const text = payload && payload.workProductText ? String(payload.workProductText) : "";
    const title = payload && payload.title ? String(payload.title) : MASTER_guessTitle_(text);
    const source = payload && payload.source ? String(payload.source) : "UI";
    const callAi = !!(payload && payload.callAi);

    if (!text.trim()) {
      return { ok: false, message: "Work product text is empty." };
    }

    const pack = MASTER_generateEnhancementPackage_({
      workProductText: text,
      title: title,
      source: source,
      mode: "ui"
    });

    if (callAi) {
      const ai = MASTER_tryCallAiEndpoint_({ prompt: pack.promptMarkdown, title: title });
      pack.ai = ai;
      pack.aiResponseMarkdown = ai && ai.ok ? String(ai.responseText || "") : "";
    }

    MASTER_appendEnhancementReportRow_(pack);

    MASTER_logEvent_({
      eventType: "enhancement",
      action: "api_generate_enhancement",
      status: "success",
      durationMs: MASTER_perfEnd_(perf),
      meta: { source: source, title: title, wordCount: pack.wordCount, callAi: callAi }
    });

    return Object.assign({ ok: true }, pack);
  } catch (err) {
    MASTER_logEvent_({
      eventType: "enhancement",
      action: "api_generate_enhancement",
      status: "failure",
      durationMs: MASTER_perfEnd_(perf),
      error: err
    });
    return { ok: false, message: MASTER_errorMessage_(err) };
  }
}

/**
 * Builds the full enhancement package:
 * - Signals (structure/completeness heuristics)
 * - 8-lens analysis markdown
 * - Prioritized proposals markdown
 * - LLM-ready prompt markdown (full framework instructions)
 * @param {{workProductText:string,title:string,source:string,mode:string}} input - Input.
 * @returns {Object} Package.
 */
function MASTER_generateEnhancementPackage_(input) {
  const text = String(input.workProductText || "").trim();
  const title = String(input.title || "").trim() || MASTER_guessTitle_(text);
  const source = String(input.source || "Unknown");
  const mode = String(input.mode || "unknown");

  const signals = MASTER_extractSignals_(text);
  const analysis = MASTER_buildEightLensAnalysis_(text, signals, title);
  const proposals = MASTER_buildProposals_(signals, title);
  const prompt = MASTER_buildEnhancementPrompt_(text, signals, title);

  return {
    createdIso: MASTER_nowIsoMs_(),
    createdBy: MASTER_safeUserEmail_(),
    title: title,
    source: source,
    mode: mode,
    wordCount: signals.wordCount,
    signals: signals,
    analysisMarkdown: analysis,
    proposalMarkdown: proposals,
    promptMarkdown: prompt,
    aiResponseMarkdown: ""
  };
}

/**
 * Appends a report row to Enhancement Reports sheet.
 * @param {Object} pack - Enhancement package.
 */
function MASTER_appendEnhancementReportRow_(pack) {
  const sheet = MASTER_ensureReportsSheet_();
  const row = [
    pack.createdIso,
    pack.createdBy,
    pack.title,
    pack.source,
    pack.wordCount,
    JSON.stringify(pack.signals || {}),
    pack.analysisMarkdown,
    pack.proposalMarkdown,
    pack.promptMarkdown,
    pack.aiResponseMarkdown || ""
  ];
  sheet.appendRow(row);
}

/**
 * Attempts to call an external AI endpoint, if configured.
 * Uses Script Properties:
 * - AI_HTTP_ENDPOINT
 * - AI_HTTP_BEARER_TOKEN (optional)
 * - AI_HTTP_TIMEOUT_MS (optional)
 * - AI_HTTP_MODEL (optional)
 * - AI_HTTP_EXTRA_HEADERS_JSON (optional)
 * @param {{prompt:string,title:string}} input - Prompt + title.
 * @returns {{ok:boolean,responseText?:string,status?:number,message?:string,debug?:Object}}
 */
function MASTER_tryCallAiEndpoint_(input) {
  const props = PropertiesService.getScriptProperties();
  const endpoint = String(props.getProperty("AI_HTTP_ENDPOINT") || "").trim();
  if (!endpoint) {
    return {
      ok: false,
      message: "AI_HTTP_ENDPOINT is not set in Script Properties. Returning prompt only."
    };
  }

  const bearer = String(props.getProperty("AI_HTTP_BEARER_TOKEN") || "").trim();
  const timeoutMs = Number(props.getProperty("AI_HTTP_TIMEOUT_MS") || MASTER_CONFIG.AI_DEFAULTS.TIMEOUT_MS);
  const model = String(props.getProperty("AI_HTTP_MODEL") || MASTER_CONFIG.AI_DEFAULTS.MODEL);
  const extraHeadersJson = String(props.getProperty("AI_HTTP_EXTRA_HEADERS_JSON") || "").trim();

  let extraHeaders = {};
  if (extraHeadersJson) {
    try {
      extraHeaders = JSON.parse(extraHeadersJson);
      if (!extraHeaders || typeof extraHeaders !== "object") extraHeaders = {};
    } catch (e) {
      extraHeaders = {};
    }
  }

  const prompt = String(input && input.prompt ? input.prompt : "");
  const payload = {
    model: model,
    title: String(input && input.title ? input.title : ""),
    prompt: prompt
  };

  const headers = Object.assign(
    { "Content-Type": "application/json" },
    bearer ? { "Authorization": "Bearer " + bearer } : {},
    extraHeaders
  );

  const perf = MASTER_perfStart_();
  try {
    const resp = UrlFetchApp.fetch(endpoint, {
      method: "post",
      headers: headers,
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
      followRedirects: true,
      validateHttpsCertificates: true,
      timeout: timeoutMs
    });

    const code = resp.getResponseCode();
    const body = resp.getContentText() || "";
    const ok = code >= 200 && code < 300;

    MASTER_logEvent_({
      eventType: "ai",
      action: "call_ai_http_endpoint",
      status: ok ? "success" : "warning",
      durationMs: MASTER_perfEnd_(perf),
      meta: { endpoint: endpoint, status: code, bytes: body.length }
    });

    // Accept either raw text, or JSON with "response"/"text"/"content"
    let responseText = body;
    try {
      const j = JSON.parse(body);
      if (j && typeof j === "object") {
        responseText = String(
          j.response ?? j.text ?? j.content ?? j.output ?? body
        );
      }
    } catch (e) {
      // non-JSON is fine
    }

    return { ok: ok, status: code, responseText: responseText };
  } catch (err) {
    MASTER_logEvent_({
      eventType: "ai",
      action: "call_ai_http_endpoint",
      status: "failure",
      durationMs: MASTER_perfEnd_(perf),
      error: err,
      meta: { endpoint: endpoint }
    });
    return { ok: false, message: MASTER_errorMessage_(err) };
  }
}

/**
 * Extracts signals from text (structure/completeness heuristics).
 * @param {string} text - Work product text.
 * @returns {Object} Signals.
 */
function MASTER_extractSignals_(text) {
  const raw = String(text || "");
  const normalized = raw.replace(/\r\n/g, "\n");
  const wordCount = (normalized.trim().match(/\S+/g) || []).length;
  const lineCount = (normalized.match(/\n/g) || []).length + 1;

  const hasObjective = /objective|goal|purpose|mission/i.test(normalized);
  const hasScope = /scope|in scope|out of scope|boundar/i.test(normalized);
  const hasAssumptions = /assumption|assume|constraint/i.test(normalized);
  const hasRisks = /risk|mitigation|trade-?off/i.test(normalized);
  const hasMetrics = /metric|measure|kpi|success criteria|acceptance/i.test(normalized);
  const hasTimeline = /timeline|when|phase|milestone|roadmap/i.test(normalized);
  const hasExamples = /example|e\.g\.|for instance|sample/i.test(normalized);
  const hasIntegration = /integration|api|connect|compatib|interoper/i.test(normalized);
  const hasTesting = /test|validation|verify|qa/i.test(normalized);
  const hasUserExperience = /ux|user experience|workflow|friction|usability/i.test(normalized);

  const headingCount = (normalized.match(/^\s{0,3}#{1,6}\s+\S+/gm) || []).length
    + (normalized.match(/^\s*[A-Z][A-Z0-9 \-]{4,}\s*$/gm) || []).length;

  const bulletCount = (normalized.match(/^\s*[-*•]\s+\S+/gm) || []).length;

  const density = wordCount > 0 ? Math.round((bulletCount / Math.max(1, lineCount)) * 1000) / 1000 : 0;

  return {
    wordCount: wordCount,
    lineCount: lineCount,
    headingCount: headingCount,
    bulletCount: bulletCount,
    bulletPerLine: density,
    hasObjective: hasObjective,
    hasScope: hasScope,
    hasAssumptions: hasAssumptions,
    hasRisks: hasRisks,
    hasMetrics: hasMetrics,
    hasTimeline: hasTimeline,
    hasExamples: hasExamples,
    hasIntegration: hasIntegration,
    hasTesting: hasTesting,
    hasUserExperience: hasUserExperience
  };
}

/**
 * Builds 8-lens analysis markdown.
 * @param {string} text - Work product text.
 * @param {Object} s - Signals.
 * @param {string} title - Title.
 * @returns {string} Markdown analysis.
 */
function MASTER_buildEightLensAnalysis_(text, s, title) {
  const findings = [];

  function addLens(name, score, notes, questions) {
    findings.push([
      `### ${name}`,
      `**Signal Score:** ${score}/5`,
      `**Observations:**`,
      notes.map(n => `- ${n}`).join("\n"),
      `**Key Questions to Push Further:**`,
      questions.map(q => `- ${q}`).join("\n")
    ].join("\n"));
  }

  const fc = MASTER_scoreCompleteness_(s);
  addLens(
    "1) Functional Completeness",
    fc,
    [
      s.hasObjective ? "Objective/purpose language present." : "Objective/purpose language is not explicit; consider a clear Objective section.",
      s.hasScope ? "Scope boundaries appear defined." : "Scope boundaries are unclear; add in-scope / out-of-scope.",
      s.hasMetrics ? "Success/metrics language detected." : "Success criteria/metrics not obvious; add measurable acceptance criteria."
    ],
    [
      "Does it achieve all stated objectives end-to-end with no dependency gaps?",
      "What adjacent capabilities would extend reach without bloating scope?",
      "What is the minimum success criteria for v1, and what is v2?"
    ]
  );

  const si = MASTER_scoreStructure_(s);
  addLens(
    "2) Structural Integrity",
    si,
    [
      s.headingCount > 3 ? `Multiple headings detected (${s.headingCount}).` : "Low visible structure; add headings for scannability.",
      s.bulletCount > 5 ? `Bullet structure present (${s.bulletCount} bullets).` : "Few bullets; add lists for steps, requirements, and decisions.",
      "Consider modular decomposition: inputs → processing → outputs → validation."
    ],
    [
      "Which parts could be separated into reusable modules/components?",
      "Is there a clear information flow from intent to execution?",
      "Where are the brittle sections that need guardrails?"
    ]
  );

  const ca = MASTER_scoreClarity_(s);
  addLens(
    "3) Clarity & Accessibility",
    ca,
    [
      s.hasExamples ? "Examples language detected." : "Examples are scarce; add sample inputs/outputs.",
      s.hasTesting ? "Testing/validation language detected." : "Testing/validation steps not obvious; add explicit test checklist.",
      "Reduce cognitive load by adding a short 'Getting Started' section."
    ],
    [
      "Can a new user run this with zero back-and-forth?",
      "Where would readers get stuck or misinterpret intent?",
      "What minimal diagrams/tables would make this instantly clearer?"
    ]
  );

  const sp = MASTER_scoreScalability_(s);
  addLens(
    "4) Scalability Potential",
    sp,
    [
      s.hasTimeline ? "Phasing/timeline language detected." : "No timeline/phasing detected; add a staged roadmap for growth.",
      "Define constraints: performance, volume, concurrency, permissions.",
      "Add explicit limits and scaling strategies."
    ],
    [
      "What breaks first when usage doubles or complexity increases?",
      "What abstractions enable broader application?",
      "How will you handle multi-user concurrency and versioning?"
    ]
  );

  const ir = MASTER_scoreIntegration_(s);
  addLens(
    "5) Integration Readiness",
    ir,
    [
      s.hasIntegration ? "Integration language detected." : "Integration surfaces not obvious; add 'Integrations' section and interfaces.",
      "Document assumptions about external systems, formats, and auth.",
      "Add a clear API/contract boundary (inputs/outputs)."
    ],
    [
      "How does this connect to existing tools and workflows?",
      "What data formats and schemas are expected?",
      "What adapters/bridges would reduce manual work?"
    ]
  );

  const ux = MASTER_scoreUx_(s);
  addLens(
    "6) User Experience",
    ux,
    [
      s.hasUserExperience ? "UX/workflow language detected." : "UX friction points not explicitly addressed; add 'User Flow' and friction fixes.",
      "Add feedback loops: progress, errors, and next actions.",
      "Improve discoverability via quick-start controls and clear defaults."
    ],
    [
      "Where does the user experience friction or uncertainty?",
      "What would make this feel 'instant' and satisfying?",
      "What are the top 3 user journeys and their failure states?"
    ]
  );

  const fp = MASTER_scoreFutureProof_(s);
  addLens(
    "7) Future-Proofing",
    fp,
    [
      s.hasAssumptions ? "Assumptions/constraints detected." : "Assumptions/constraints not obvious; make them explicit for resilience.",
      s.hasRisks ? "Risk/trade-off language detected." : "Risks/trade-offs not explicit; add mitigations.",
      "Add versioning and change-log discipline."
    ],
    [
      "What changes in the environment could invalidate this?",
      "How will maintenance and evolution be handled?",
      "What trends should be anticipated (AI, automation, governance)?"
    ]
  );

  const vd = MASTER_scoreValueDensity_(s);
  addLens(
    "8) Value Density",
    vd,
    [
      "Check for redundancy: can sections be merged without losing meaning?",
      "Add high-leverage artifacts: checklists, templates, and decision tables.",
      "Ensure every component 'earns its place' with clear user value."
    ],
    [
      "What can be removed while improving usefulness?",
      "Which additions create compounding benefits?",
      "Where can a single table replace paragraphs?"
    ]
  );

  const header = [
    `## 🧠 Enhancement Analysis: ${MASTER_escapeMarkdown_(title)}`,
    `**Signals:** wordCount=${s.wordCount}, headings=${s.headingCount}, bullets=${s.bulletCount}`,
    "",
    `---`
  ].join("\n");

  return header + "\n\n" + findings.join("\n\n");
}

/**
 * Builds prioritized proposals (What/Why/How/When/Measure).
 * @param {Object} s - Signals.
 * @param {string} title - Title.
 * @returns {string} Markdown proposals.
 */
function MASTER_buildProposals_(s, title) {
  const proposals = [];

  function propose(priority, what, why, how, when, measure, risks) {
    proposals.push([
      `### ${priority} — ${what}`,
      `**Why:** ${why}`,
      `**How:** ${how}`,
      `**When:** ${when}`,
      `**Measure:** ${measure}`,
      `**Risks / Trade-offs:** ${risks}`
    ].join("\n"));
  }

  // Core missing foundations
  if (!s.hasObjective) {
    propose(
      "P1 (High Impact / Low Effort)",
      "Add a crisp Objective + Non-Goals section",
      "A clear objective reduces ambiguity, prevents scope creep, and makes evaluation measurable.",
      "Create a 5–7 line Objective, 3–5 Non-Goals, and a one-paragraph Context. Place at the top.",
      "Immediately (next edit)",
      "Readers can summarize purpose in 1 sentence; fewer clarifying questions from users/stakeholders.",
      "Non-goals might feel restrictive; mitigate by adding a 'Future Considerations' section."
    );
  }

  if (!s.hasMetrics) {
    propose(
      "P1 (High Impact / Low Effort)",
      "Define success criteria and measurable acceptance tests",
      "Without success criteria, quality is subjective and delivery readiness is unclear.",
      "Add 5–10 acceptance criteria (Given/When/Then or checklist). Include performance or quality thresholds if applicable.",
      "Immediately after Objective",
      "Pass/fail checks exist for release readiness; reduced rework.",
      "Over-specifying can slow iteration; mitigate by splitting v1 vs v2 criteria."
    );
  }

  if (!s.hasTesting) {
    propose(
      "P1 (High Impact / Low Effort)",
      "Add a testing + validation protocol (happy path + edge cases)",
      "Testing prevents regressions and makes the deliverable runnable by others without guesswork.",
      "Include: setup steps, test data, expected outputs, failure modes, and troubleshooting guidance.",
      "Before sharing broadly",
      "A new user can run tests and reproduce expected outputs in <10 minutes.",
      "Test coverage adds time; mitigate with a minimal 'smoke test' first."
    );
  }

  // Structure and UX upgrades
  if (s.headingCount < 4) {
    propose(
      "P2 (Medium Impact / Low Effort)",
      "Add a consistent section architecture (Overview → Inputs → Process → Outputs → Ops)",
      "Consistent structure increases scannability and accelerates adoption.",
      "Introduce H2 sections and a short table of contents; ensure each section ends with a 'So what / Next' line.",
      "Next refinement pass",
      "Readers can locate any key info in under 30 seconds.",
      "More headings can feel heavy; mitigate by keeping sections short and using collapsible details where possible."
    );
  }

  if (!s.hasExamples) {
    propose(
      "P2 (Medium Impact / Low Effort)",
      "Add examples (before/after, sample data, worked walkthrough)",
      "Examples de-risk interpretation and reduce onboarding friction dramatically.",
      "Add at least: one minimal example, one realistic example, and one edge-case example.",
      "After structure pass",
      "Fewer user questions; fewer incorrect uses.",
      "Examples can become outdated; mitigate by labeling and versioning them."
    );
  }

  if (!s.hasIntegration) {
    propose(
      "P2 (Medium Impact / Medium Effort)",
      "Add integration surfaces (interfaces, data contracts, connectors)",
      "Integration readiness multiplies value by reducing manual handoffs.",
      "Define input/output schemas, file formats, and any API boundaries; document auth/permissions.",
      "When preparing for productionization",
      "Reduction in manual steps; fewer copy/paste operations; successful cross-tool flow.",
      "Integrations can add complexity; mitigate by making them optional modules."
    );
  }

  // Scalability / future proofing
  if (!s.hasRisks) {
    propose(
      "P3 (Medium Impact / Low Effort)",
      "Add risks, trade-offs, and mitigations section",
      "Acknowledging risks improves decision quality and avoids hidden failure modes.",
      "List top 5 risks, triggers, mitigations, and 'owner' for each.",
      "Before final sign-off",
      "Risks are explicit, tracked, and reviewed at milestones.",
      "May surface uncomfortable constraints; mitigate by framing as proactive resilience."
    );
  }

  if (!s.hasAssumptions) {
    propose(
      "P3 (Medium Impact / Low Effort)",
      "Add assumptions and constraints (permissions, scale limits, dependencies)",
      "Assumptions define operating boundaries and prevent misapplication.",
      "Document environment assumptions, required permissions, data size limits, and dependencies.",
      "Before deployment or sharing",
      "Fewer failures from incorrect environment; faster debugging.",
      "Too many constraints can discourage users; mitigate with recommended defaults."
    );
  }

  const header = [
    `## 📌 Prioritized Enhancement Proposals: ${MASTER_escapeMarkdown_(title)}`,
    `**Built from signals:** objective=${s.hasObjective}, metrics=${s.hasMetrics}, testing=${s.hasTesting}, examples=${s.hasExamples}, integration=${s.hasIntegration}`,
    "---"
  ].join("\n");

  return header + "\n\n" + (proposals.length ? proposals.join("\n\n") : "No proposals generated (content already signals strong completeness).");
}

/**
 * Builds the full “Strategic Work Product Enhancement” prompt (LLM-ready).
 * @param {string} text - Work product.
 * @param {Object} signals - Signals.
 * @param {string} title - Title.
 * @returns {string} Prompt markdown.
 */
function MASTER_buildEnhancementPrompt_(text, signals, title) {
  const s = signals || {};
  const system = [
    "## Strategic Work Product Enhancement & Autonomous Improvement Framework — AI Prompt Engineering System v1.0",
    "",
    "### Objective",
    "You are an elite AI consultant specializing in work product optimization. Your mission is to thoroughly examine completed deliverables, autonomously identify enhancement opportunities, and propose intelligent capability improvements that elevate quality, effectiveness, and value.",
    "",
    "### Core Philosophy",
    "- Proactive Discovery: Actively seek opportunities rather than waiting for explicit gaps",
    "- Reasoned Innovation: Every suggestion must be grounded in clear rationale and best practices",
    "- Value Multiplication: Focus on enhancements that create compounding improvements",
    "",
    "### Multi-Dimensional Enhancement Analysis (8 Lenses)",
    "1. Functional Completeness",
    "2. Structural Integrity",
    "3. Clarity & Accessibility",
    "4. Scalability Potential",
    "5. Integration Readiness",
    "6. User Experience",
    "7. Future-Proofing",
    "8. Value Density",
    "",
    "### Required Output Format",
    "Provide your response in four phases:",
    "1) Deep Examination (map components, objectives, dependencies; no judgment)",
    "2) Opportunity Discovery (systematically apply 8 lenses)",
    "3) Proposal Formulation (What/Why/How/When/Measure + risk/trade-offs)",
    "4) Validation & Refinement (logic soundness, alignment, feasibility, downside mitigation)",
    "",
    "### Quality Standards",
    "- Specificity: implementable without clarification",
    "- Justification: clear rationale",
    "- Groundedness: best practices / evidence",
    "- Practicality: feasible within constraints",
    "- Value-Add: meaningful improvement",
    "- Alignment: supports objectives",
    "- Balance: acknowledges drawbacks",
    "",
    "### Context Signals (auto-extracted)",
    `- Title: ${title}`,
    `- wordCount: ${s.wordCount}`,
    `- headings: ${s.headingCount}`,
    `- bullets: ${s.bulletCount}`,
    `- hasObjective: ${s.hasObjective}`,
    `- hasScope: ${s.hasScope}`,
    `- hasAssumptions: ${s.hasAssumptions}`,
    `- hasRisks: ${s.hasRisks}`,
    `- hasMetrics: ${s.hasMetrics}`,
    `- hasTimeline: ${s.hasTimeline}`,
    `- hasExamples: ${s.hasExamples}`,
    `- hasIntegration: ${s.hasIntegration}`,
    `- hasTesting: ${s.hasTesting}`,
    `- hasUserExperience: ${s.hasUserExperience}`,
    "",
    "### Work Product (to analyze)",
    "```",
    String(text || "").trim(),
    "```"
  ];

  return system.join("\n");
}

/**
 * Guesses a title from the first non-empty line.
 * @param {string} text - Work product.
 * @returns {string} Title.
 */
function MASTER_guessTitle_(text) {
  const lines = String(text || "").split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (!lines.length) return "Untitled Work Product";
  const first = lines[0];
  if (first.length <= 120) return first;
  return first.slice(0, 120).trim() + "…";
}

/** Scoring helpers (0..5) */
function MASTER_scoreCompleteness_(s) {
  let score = 1;
  if (s.hasObjective) score++;
  if (s.hasScope) score++;
  if (s.hasMetrics) score++;
  if (s.hasTesting) score++;
  return Math.min(5, score);
}
function MASTER_scoreStructure_(s) {
  let score = 1;
  if (s.headingCount >= 4) score++;
  if (s.bulletCount >= 8) score++;
  if (s.wordCount >= 200) score++;
  if (s.wordCount >= 800) score++;
  return Math.min(5, score);
}
function MASTER_scoreClarity_(s) {
  let score = 1;
  if (s.hasExamples) score++;
  if (s.hasTesting) score++;
  if (s.headingCount >= 4) score++;
  if (s.bulletCount >= 8) score++;
  return Math.min(5, score);
}
function MASTER_scoreScalability_(s) {
  let score = 1;
  if (s.hasTimeline) score++;
  if (s.hasAssumptions) score++;
  if (s.hasRisks) score++;
  if (s.hasIntegration) score++;
  return Math.min(5, score);
}
function MASTER_scoreIntegration_(s) {
  let score = 1;
  if (s.hasIntegration) score += 2;
  if (s.hasScope) score++;
  if (s.hasAssumptions) score++;
  return Math.min(5, score);
}
function MASTER_scoreUx_(s) {
  let score = 1;
  if (s.hasUserExperience) score += 2;
  if (s.hasExamples) score++;
  if (s.hasTesting) score++;
  return Math.min(5, score);
}
function MASTER_scoreFutureProof_(s) {
  let score = 1;
  if (s.hasAssumptions) score++;
  if (s.hasRisks) score += 2;
  if (s.hasTimeline) score++;
  return Math.min(5, score);
}
function MASTER_scoreValueDensity_(s) {
  let score = 2;
  if (s.headingCount >= 4) score++;
  if (s.bulletCount >= 8) score++;
  if (s.wordCount >= 400) score++;
  return Math.min(5, score);
}

/**
 * Escapes markdown in a minimal way for titles.
 * @param {string} s - Input.
 * @returns {string} Escaped.
 */
function MASTER_escapeMarkdown_(s) {
  return String(s || "")
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\*/g, "\\*")
    .replace(/_/g, "\\_");
}

/** =======================================================================
 *  12) UI APIs (Folders + Reports + Navigation)
 *  ======================================================================= */
/**
 * UI API: Create project folder.
 * @returns {Object} Result.
 */
function MASTER_apiCreateProjectFolder() {
  return MASTER_createProjectFolder();
}

/**
 * UI API: Get project folder info.
 * @returns {Object} Result.
 */
function MASTER_apiGetProjectFolderInfo() {
  return MASTER_getProjectFolderInfo();
}

/**
 * UI API: Open a link key (returns ok; server also opens modeless dialog).
 * @param {string} key - Link key.
 * @returns {{ok:boolean}} Result.
 */
function MASTER_apiOpenLinkKey(key) {
  MASTER_openLinkKey_(String(key || ""), { from: "ui" });
  return { ok: true };
}

/**
 * UI API: Open an arbitrary URL (direct open + copy dialog).
 * @param {{url:string,title:string}} payload - Payload.
 * @returns {{ok:boolean,message?:string}} Result.
 */
function MASTER_apiOpenUrl(payload) {
  const url = payload && payload.url ? String(payload.url) : "";
  const title = payload && payload.title ? String(payload.title) : "Open Link";
  if (!String(url).trim()) return { ok: false, message: "URL is empty." };
  MASTER_openUrlDirectWithCopy_(url, title);
  return { ok: true };
}

/** =======================================================================
 *  13) DEBUG UTILITIES
 *  ======================================================================= */
const DEBUG_ENABLED = true;

const Debug = (() => {
  const MAX_JSON_CHARS = 9000;

  function nowIso_() { return new Date().toISOString(); }

  function stringifySafe(value) {
    try {
      if (typeof value === "string") return value;
      const json = JSON.stringify(value, getCircularReplacer_(), 2);
      if (json && json.length > MAX_JSON_CHARS) return json.slice(0, MAX_JSON_CHARS) + "…(truncated)";
      return json;
    } catch (e) {
      return `[Unstringifiable: ${Object.prototype.toString.call(value)}]`;
    }
  }

  function getCircularReplacer_() {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) return "[Circular]";
        seen.add(value);
      }
      if (value && typeof value === "object") {
        const type = Object.prototype.toString.call(value);
        if (type.includes("Date")) return value;
        if (type.includes("Object")) return value;
        if (String(value).match(/Class|Service|Range|Sheet|Spreadsheet/i)) return String(value);
      }
      return value;
    };
  }

  function log_(...args) {
    if (!DEBUG_ENABLED) return;
    const msg = args.map(a => stringifySafe(a)).join(" ");
    console.log(`[${nowIso_()}] ${msg}`);
  }

  function info(...args) { log_("ℹ️", ...args); }
  function warn(...args) { log_("⚠️", ...args); }
  function error(...args) { log_("❌", ...args); }

  function time(label, fn) {
    const start = Date.now();
    info(`⏱️ START: ${label}`);
    try {
      const result = fn();
      info(`✅ END: ${label} (${Date.now() - start} ms)`);
      return result;
    } catch (e) {
      error(`💥 FAIL: ${label} (${Date.now() - start} ms)`, formatError(e));
      throw e;
    }
  }

  function formatError(e) {
    return { name: e && e.name, message: e && e.message, stack: e && e.stack };
  }

  function envDump() {
    const dump = {
      scriptTimeZone: Session.getScriptTimeZone(),
      user: safeGet_(() => Session.getActiveUser().getEmail()),
      effectiveUser: safeGet_(() => Session.getEffectiveUser().getEmail()),
      locale: Session.getActiveUserLocale(),
      stackDriver: "Use Executions panel for full logs/stack"
    };

    const ss = safeGet_(() => SpreadsheetApp.getActiveSpreadsheet());
    if (ss) {
      dump.spreadsheet = {
        id: ss.getId(),
        name: ss.getName(),
        url: ss.getUrl(),
        activeSheet: safeGet_(() => ss.getActiveSheet().getName())
      };
    }

    info("🧾 ENV DUMP:", dump);
    return dump;
  }

  function safeGet_(fn) { try { return fn(); } catch (e) { return `Unavailable (${e.message})`; } }

  function withDocumentLock(fn, timeoutMs) {
    const ms = Number(timeoutMs || 30000);
    const lock = LockService.getDocumentLock();
    const locked = lock.tryLock(ms);
    if (!locked) throw new Error(`Could not acquire document lock within ${ms}ms.`);
    try { return fn(); } finally { lock.releaseLock(); }
  }

  return { info, warn, error, time, envDump, withDocumentLock, formatError };
})();

/**
 * Debug menu actions.
 */
function DEBUG_menuEnvDump() {
  Debug.envDump();
  SpreadsheetApp.getActive().toast("ENV dump written to logs (View > Executions / Logs)", "🐞 Debug", 5);
}

/**
 * Shows a dialog to run any global function by name.
 */
function DEBUG_menuRunFunctionDialog() {
  const html = HtmlService.createHtmlOutput(
    `<!doctype html>
<html>
<head>
  <base target="_top">
  <meta charset="utf-8">
  <style>
    body{font-family:system-ui;margin:0;padding:14px;background:#0B1220;color:#E5E7EB}
    .card{background:#111A2E;border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:12px}
    input{width:100%;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.14);
      background:rgba(255,255,255,.06);color:#E5E7EB;outline:none;margin-top:8px}
    button{margin-top:10px;padding:10px 12px;border-radius:12px;border:none;cursor:pointer;
      background:linear-gradient(135deg,#6D28D9,rgba(109,40,217,.55));color:#E5E7EB;font-weight:800}
    .muted{color:#9CA3AF;font-size:12px;margin-top:8px}
    .msg{margin-top:10px;font-size:12px;color:#9CA3AF}
  </style>
</head>
<body>
  <div class="card">
    <div><b>Run a function</b></div>
    <div class="muted">Enter a global function name (e.g., MASTER_initManually, DEBUG_menuEnvDump).</div>
    <input id="fn" placeholder="Function name" />
    <button onclick="run()">▶ Run</button>
    <div id="msg" class="msg"></div>
  </div>
  <script>
    function run(){
      const name = document.getElementById("fn").value.trim();
      const msg = document.getElementById("msg");
      msg.textContent = "Running…";
      if(!name){ msg.textContent = "Enter a function name."; return; }
      google.script.run
        .withSuccessHandler(function(res){ msg.textContent = "Done. Check Executions/Logs."; })
        .withFailureHandler(function(err){ msg.textContent = "Failed: " + (err && err.message ? err.message : err); })
        .DEBUG_runFunctionByName(name);
    }
  </script>
</body>
</html>`
  ).setWidth(520).setHeight(240);
  SpreadsheetApp.getUi().showModelessDialog(html, "🐞 Run Function");
}

/**
 * Runs a global function by name.
 * @param {string} name - Function name.
 * @returns {{ok:boolean,message:string}} Result.
 */
function DEBUG_runFunctionByName(name) {
  const fnName = String(name || "").trim();
  if (!fnName) throw new Error("Function name is empty.");
  const fn = globalThis[fnName];
  if (typeof fn !== "function") throw new Error(`Function "${fnName}" not found.`);
  Debug.time(`DEBUG_runFunctionByName -> ${fnName}`, () => fn());
  return { ok: true, message: "Executed." };
}

/**
 * Opens Apps Script Executions page.
 */
function DEBUG_openExecutionsPage() {
  MASTER_openUrlDirectWithCopy_("https://script.google.com/home/executions", "🐞 Executions");
}

/** =======================================================================
 *  14) UTILITIES
 *  ======================================================================= */
function MASTER_perfStart_() { return { t0: Date.now() }; }
function MASTER_perfEnd_(perf) { return Math.max(0, Date.now() - (perf && perf.t0 ? perf.t0 : Date.now())); }

/**
 * ISO timestamp with ms precision.
 * @param {Date=} d - Date.
 * @returns {string} ISO string.
 */
function MASTER_nowIsoMs_(d) {
  const dt = d instanceof Date ? d : new Date();
  return dt.toISOString();
}

/**
 * Gets a safe user email (may be blank in consumer accounts).
 * @returns {string} Email or "unknown".
 */
function MASTER_safeUserEmail_() {
  try {
    const email = Session.getActiveUser().getEmail();
    if (email) return email;
  } catch (e) { }
  try {
    const email2 = Session.getEffectiveUser().getEmail();
    if (email2) return email2;
  } catch (e2) { }
  return "unknown";
}

/**
 * Quota hint (best-effort).
 * @returns {string} Hint string.
 */
function MASTER_quotaHint_() {
  try {
    const remaining = ScriptApp.getRemainingDailyQuota();
    return "remainingDailyQuota=" + remaining;
  } catch (e) {
    return "quota=n/a";
  }
}

/**
 * Extracts error message.
 * @param {*} err - Error.
 * @returns {string} Message.
 */
function MASTER_errorMessage_(err) {
  try {
    if (!err) return "";
    if (typeof err === "string") return err;
    if (err.message) return String(err.message);
    return String(err);
  } catch (e) {
    return "Unknown error";
  }
}

/**
 * Extracts stack trace.
 * @param {*} err - Error.
 * @returns {string} Stack.
 */
function MASTER_errorStack_(err) {
  try {
    if (!err) return "";
    if (err.stack) return String(err.stack);
    return "";
  } catch (e) {
    return "";
  }
}

/**
 * Escapes HTML string.
 * @param {string} s - Input.
 * @returns {string} Escaped.
 */
function MASTER_escapeHtml_(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** =======================================================================
 *  15) REVERSE PORTING EXTENSIONS (Chat, Troubleshooter, Framework)
 *  ======================================================================= */

function MASTER_showChatSidebar() {
  MASTER_showUi_("chat", "💬 AI Architect Chat");
}

function MASTER_showTroubleshooterDialog() {
  MASTER_showUiModal_("troubleshoot", "🔧 Troubleshooter Wizard", 700, 600);
}

function MASTER_showFrameworkSidebar() {
  MASTER_showUi_("framework", "🧬 Strategic Framework");
}

function MASTER_toast(msg) {
  SpreadsheetApp.getActive().toast(msg);
}

function MASTER_apiGetFrameworkData() {
  // Ensure FrameworkData.js is loaded/included in project
  if (typeof MASTER_loadFrameworkData === 'function') {
    return MASTER_loadFrameworkData();
  }
  return [];
}

/** =======================================================================
 *  16) CONTROL BRIDGE DASHBOARD (Sheets-Native UI)
 *  ======================================================================= */

/**
 * Opens or creates the Control Bridge sheet.
 */
function BRIDGE_openSheet() {
  BRIDGE_ensureSheets_();
  const ss = SpreadsheetApp.getActive();
  const bridge = ss.getSheetByName("_ControlBridge");
  if (bridge) ss.setActiveSheet(bridge);
}

/**
 * Handles checkbox actions from _ControlBridge sheet.
 * Called by the installable onEdit trigger.
 * @param {GoogleAppsScript.Events.SheetsOnEdit} e - Edit event.
 */
function BRIDGE_handleAction_(e) {
  if (!e || !e.range) return;

  const sheet = e.range.getSheet();
  if (sheet.getName() !== "_ControlBridge") return;

  const row = e.range.getRow();
  const col = e.range.getColumn();
  const value = e.range.getValue();

  // Only react to checkboxes turning TRUE
  if (value !== true) return;

  // Action mappings (Row 8) - B8, D8, F8
  const actions = {
    "8,2": "runEnhancement",
    "8,4": "createFolder",
    "8,6": "syncConfig"
  };

  // Output actions (Row 46) - B46, D46
  const outputActions = {
    "46,2": "copyOutput",
    "46,4": "saveToReports"
  };

  const key = `${row},${col}`;

  if (actions[key]) {
    BRIDGE_setStatus_("Working...");
    try {
      BRIDGE_dispatch_(actions[key]);
      BRIDGE_setStatus_("Ready ✓");
    } catch (err) {
      BRIDGE_setStatus_("Error: " + err.message);
      console.error("BRIDGE action error:", err);
    }
    // Reset checkbox
    Utilities.sleep(200);
    e.range.setValue(false);
  }

  if (outputActions[key]) {
    try {
      BRIDGE_dispatchOutput_(outputActions[key]);
    } catch (err) {
      console.error("BRIDGE output action error:", err);
    }
    e.range.setValue(false);
  }
}

/**
 * Dispatches to the appropriate action handler.
 * @param {string} action - Action name.
 */
function BRIDGE_dispatch_(action) {
  switch (action) {
    case "runEnhancement":
      BRIDGE_runEnhancement_();
      break;
    case "createFolder":
      MASTER_createProjectFolder();
      break;
    case "syncConfig":
      BRIDGE_syncConfig_();
      break;
  }
  BRIDGE_updateLastAction_(action);
}

/**
 * Dispatches output-related actions.
 * @param {string} action - Action name.
 */
function BRIDGE_dispatchOutput_(action) {
  const ss = SpreadsheetApp.getActive();
  const bridge = ss.getSheetByName("_ControlBridge");

  switch (action) {
    case "copyOutput":
      // Show a small dialog with the output for easy copying
      const output = bridge.getRange("B24").getValue();
      BRIDGE_showCopyDialog_(output);
      break;
    case "saveToReports":
      SpreadsheetApp.getActive().toast("Output already saved to Enhancement Reports!", "Control Bridge", 3);
      break;
  }
}

/**
 * Shows a dialog for copying output text.
 * @param {string} text - Text to copy.
 */
function BRIDGE_showCopyDialog_(text) {
  const html = HtmlService.createHtmlOutput(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: system-ui; margin: 12px; background: #0B1220; color: #E5E7EB; }
        textarea { width: 100%; height: 300px; background: #111A2E; color: #E5E7EB; border: 1px solid #6D28D9; border-radius: 8px; padding: 10px; }
        button { margin-top: 10px; padding: 10px 16px; background: #6D28D9; color: white; border: none; border-radius: 8px; cursor: pointer; }
        button:hover { background: #5B21B6; }
      </style>
    </head>
    <body>
      <textarea id="txt">${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
      <button onclick="copyText()">📋 Copy to Clipboard</button>
      <button onclick="google.script.host.close()">Close</button>
      <script>
        function copyText() {
          const txt = document.getElementById('txt');
          txt.select();
          document.execCommand('copy');
          alert('Copied!');
        }
      </script>
    </body>
    </html>
  `).setWidth(600).setHeight(420);

  SpreadsheetApp.getUi().showModelessDialog(html, "📋 Copy Output");
}

/**
 * Runs the Enhancement Studio from Control Bridge input.
 */
function BRIDGE_runEnhancement_() {
  const ss = SpreadsheetApp.getActive();
  const bridge = ss.getSheetByName("_ControlBridge");

  const title = bridge.getRange("B11").getValue() || "Untitled";
  const source = bridge.getRange("E11").getValue() || "Control Bridge";

  // Get text from merged input zone
  const inputRange = bridge.getRange("B13:G20");
  const values = inputRange.getValues();
  const text = values.map(row => row.join(" ")).join("\n").trim();

  if (!text) {
    bridge.getRange("B24").setValue("⚠️ No input text provided.\n\nPaste your work product in the Input Zone (cells B13:G20) and click the checkbox again.");
    return;
  }

  const pack = MASTER_generateEnhancementPackage_({
    workProductText: text,
    title: title,
    source: source,
    mode: "control_bridge"
  });

  // Check if AI is enabled
  const config = ss.getSheetByName("_Config");
  const aiEnabled = config ? config.getRange("B6").getValue() === true : false;

  if (aiEnabled) {
    const ai = MASTER_tryCallAiEndpoint_({ prompt: pack.promptMarkdown, title: title });
    pack.ai = ai;
    pack.aiResponseMarkdown = ai && ai.ok ? String(ai.responseText || "") : "";
  }

  // Build output string
  const outputParts = [
    "═══════════════════════════════════════════════════════════════",
    "🧠 ENHANCEMENT ANALYSIS: " + title,
    "═══════════════════════════════════════════════════════════════",
    "",
    pack.analysisMarkdown,
    "",
    "═══════════════════════════════════════════════════════════════",
    "📌 PROPOSALS",
    "═══════════════════════════════════════════════════════════════",
    "",
    pack.proposalMarkdown
  ];

  if (aiEnabled && pack.aiResponseMarkdown) {
    outputParts.push("");
    outputParts.push("═══════════════════════════════════════════════════════════════");
    outputParts.push("🤖 AI RESPONSE");
    outputParts.push("═══════════════════════════════════════════════════════════════");
    outputParts.push("");
    outputParts.push(pack.aiResponseMarkdown);
  }

  const output = outputParts.join("\n");

  // Write output to Output Zone
  bridge.getRange("B24").setValue(output);

  // Also save to Reports sheet
  MASTER_appendEnhancementReportRow_(pack);

  SpreadsheetApp.getActive().toast("✅ Enhancement complete! Check Output Zone.", "Control Bridge", 4);
}

/**
 * Updates the status cell in _Config.
 * @param {string} status - Status message.
 */
function BRIDGE_setStatus_(status) {
  const ss = SpreadsheetApp.getActive();
  const config = ss.getSheetByName("_Config");
  if (config) {
    config.getRange("B8").setValue(status);
  }
}

/**
 * Updates the last action timestamp.
 * @param {string} action - Action name.
 */
function BRIDGE_updateLastAction_(action) {
  const ss = SpreadsheetApp.getActive();
  const config = ss.getSheetByName("_Config");
  if (config) {
    config.getRange("B7").setValue(new Date());
  }
}

/**
 * Syncs Config values to/from Document Properties.
 */
function BRIDGE_syncConfig_() {
  const ss = SpreadsheetApp.getActive();
  const config = ss.getSheetByName("_Config");
  if (!config) return;

  const props = PropertiesService.getDocumentProperties();

  // Read from sheet, write to properties
  const colab = config.getRange("B2").getValue();
  const github = config.getRange("B3").getValue();
  const webapp = config.getRange("B4").getValue();
  const folder = config.getRange("B5").getValue();

  if (colab) props.setProperty("MASTER_LINK_COLAB", String(colab));
  if (github) props.setProperty("MASTER_LINK_GITHUB", String(github));
  if (webapp) props.setProperty("MASTER_LINK_WEBAPP", String(webapp));
  if (folder) props.setProperty("MASTER_LINK_PARENT_FOLDER", String(folder));

  SpreadsheetApp.getActive().toast("✅ Config synced to Document Properties!", "Control Bridge", 3);
}

/**
 * Ensures the Control Bridge sheets exist.
 */
function BRIDGE_ensureSheets_() {
  const ss = SpreadsheetApp.getActive();

  // _Config sheet
  let config = ss.getSheetByName("_Config");
  if (!config) {
    config = ss.insertSheet("_Config");
    BRIDGE_buildConfigSheet_(config);
  }

  // _ControlBridge sheet
  let bridge = ss.getSheetByName("_ControlBridge");
  if (!bridge) {
    bridge = ss.insertSheet("_ControlBridge", 0);
    BRIDGE_buildLayout_(bridge);
  }
}

/**
 * Builds the _Config sheet with default values.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - Config sheet.
 */
function BRIDGE_buildConfigSheet_(sheet) {
  const data = [
    ["Key", "Value", "Description"],
    ["CONFIG_VERSION", "1.0.0", "Control Bridge version"],
    ["COLAB_URL", "", "🧪 Google Colab link"],
    ["GITHUB_URL", "", "🐙 GitHub Repo link"],
    ["WEBAPP_URL", "", "🚀 Web App link"],
    ["PARENT_FOLDER_ID", "", "🗂️ Project folder ID"],
    ["AI_ENABLED", false, "Enable AI endpoint calls"],
    ["LAST_ACTION", "", "Last action timestamp"],
    ["STATUS", "Ready", "Current system status"]
  ];

  sheet.getRange(1, 1, data.length, 3).setValues(data);

  // Header formatting
  sheet.getRange(1, 1, 1, 3)
    .setBackground("#111A2E")
    .setFontColor("#E5E7EB")
    .setFontWeight("bold");

  // Checkbox for AI_ENABLED
  sheet.getRange("B7").insertCheckboxes();

  // Column widths
  sheet.setColumnWidth(1, 150);
  sheet.setColumnWidth(2, 300);
  sheet.setColumnWidth(3, 200);

  // Apply theme
  sheet.getRange(2, 1, 8, 3)
    .setBackground("#0B1220")
    .setFontColor("#E5E7EB");
}

/**
 * Builds the Control Bridge layout with formatting.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - Bridge sheet.
 */
function BRIDGE_buildLayout_(sheet) {
  const theme = MASTER_CONFIG.THEME;

  // Set default background
  sheet.getRange("A1:H50").setBackground(theme.BG).setFontColor(theme.TEXT);

  // ═══ HEADER (Row 1) ═══
  sheet.getRange("A1:H1").merge()
    .setValue("═══════════════ 🎛️ CONTROL BRIDGE v1.0 ═══════════════")
    .setBackground(theme.CARD)
    .setFontColor(theme.TEXT)
    .setFontWeight("bold")
    .setFontSize(14)
    .setHorizontalAlignment("center");

  // ═══ STATUS ROW (Row 2) ═══
  sheet.getRange("A2").setValue("Status:");
  sheet.getRange("B2").setFormula("=IF(_Config!B9=\"\",\"Ready\",_Config!B9)");
  sheet.getRange("D2").setValue("Last Action:");
  sheet.getRange("E2").setFormula("=IF(_Config!B8=\"\",\"None\",TEXT(_Config!B8,\"yyyy-mm-dd hh:mm\"))");

  // ═══ QUICK LINKS HEADER (Row 4) ═══
  sheet.getRange("A4:H4").merge()
    .setValue("─────────────────────── ⚡ QUICK LINKS ───────────────────────")
    .setBackground(theme.CARD)
    .setFontColor(theme.MUTED);

  // ═══ QUICK LINKS (Row 5) ═══
  sheet.getRange("B5").setFormula('=IF(_Config!B3="","🧪 Colab (not set)",HYPERLINK(_Config!B3,"🧪 Colab"))');
  sheet.getRange("C5").setFormula('=IF(_Config!B4="","🐙 GitHub (not set)",HYPERLINK(_Config!B4,"🐙 GitHub"))');
  sheet.getRange("D5").setFormula('=IF(_Config!B5="","🚀 Web App (not set)",HYPERLINK(_Config!B5,"🚀 Web App"))');
  sheet.getRange("E5").setValue("📊 Logs").setFontColor(theme.SECONDARY);
  sheet.getRange("F5").setValue("⚙️ Config").setFontColor(theme.SECONDARY);

  // ═══ ACTIONS HEADER (Row 7) ═══
  sheet.getRange("A7:H7").merge()
    .setValue("─────────────────────── 🎬 ACTIONS ────────────────────────")
    .setBackground(theme.CARD)
    .setFontColor(theme.MUTED);

  // ═══ ACTION CHECKBOXES (Row 8) ═══
  sheet.getRange("A8").setValue("▶️ Run Enhancement:");
  sheet.getRange("B8").insertCheckboxes();
  sheet.getRange("C8").setValue("🗂️ Create Folder:");
  sheet.getRange("D8").insertCheckboxes();
  sheet.getRange("E8").setValue("🔄 Sync Config:");
  sheet.getRange("F8").insertCheckboxes();

  // ═══ INPUT ZONE HEADER (Row 10) ═══
  sheet.getRange("A10:H10").merge()
    .setValue("─────────────────────── 📝 INPUT ZONE ───────────────────────")
    .setBackground(theme.CARD)
    .setFontColor(theme.MUTED);

  // ═══ INPUT FIELDS (Row 11) ═══
  sheet.getRange("A11").setValue("Title:");
  sheet.getRange("B11").setValue("").setBackground("#1a2744");
  sheet.getRange("D11").setValue("Source:");
  sheet.getRange("E11").setValue("Control Bridge").setBackground("#1a2744");

  // ═══ WORK PRODUCT LABEL (Row 12) ═══
  sheet.getRange("A12").setValue("Work Product Text:");

  // ═══ INPUT TEXT AREA (Rows 13-20, Cols B-G) ═══
  sheet.getRange("B13:G20").merge()
    .setValue("")
    .setBackground("#1a2744")
    .setBorder(true, true, true, true, false, false, theme.PRIMARY, SpreadsheetApp.BorderStyle.SOLID_MEDIUM)
    .setVerticalAlignment("top")
    .setWrap(true);

  // ═══ OUTPUT ZONE HEADER (Row 22) ═══
  sheet.getRange("A22:H22").merge()
    .setValue("─────────────────────── 📤 OUTPUT ZONE ──────────────────────")
    .setBackground(theme.CARD)
    .setFontColor(theme.MUTED);

  // ═══ OUTPUT LABEL (Row 23) ═══
  sheet.getRange("A23").setValue("Analysis Results:");

  // ═══ OUTPUT TEXT AREA (Rows 24-45, Cols B-G) ═══
  sheet.getRange("B24:G45").merge()
    .setValue("(Output will appear here after running Enhancement)")
    .setBackground("#0f1a2e")
    .setBorder(true, true, true, true, false, false, theme.SECONDARY, SpreadsheetApp.BorderStyle.SOLID_MEDIUM)
    .setVerticalAlignment("top")
    .setWrap(true)
    .setFontColor(theme.MUTED);

  // ═══ OUTPUT ACTIONS (Row 46) ═══
  sheet.getRange("A46").setValue("📋 Copy Output:");
  sheet.getRange("B46").insertCheckboxes();
  sheet.getRange("C46").setValue("💾 Save to Reports:");
  sheet.getRange("D46").insertCheckboxes();

  // ═══ HELP ROW (Row 48) ═══
  sheet.getRange("A48:H48").merge()
    .setValue("💡 Tip: Paste your work product in the Input Zone, then click the '▶️ Run Enhancement' checkbox.")
    .setFontColor(theme.MUTED)
    .setFontStyle("italic");

  // ═══ COLUMN WIDTHS ═══
  sheet.setColumnWidth(1, 140);
  sheet.setColumnWidths(2, 6, 100);
  sheet.setColumnWidth(8, 50);

  // ═══ ROW HEIGHTS ═══
  sheet.setRowHeight(1, 30);
  sheet.setRowHeights(13, 8, 25); // Input area rows
  sheet.setRowHeights(24, 22, 20); // Output area rows
}
