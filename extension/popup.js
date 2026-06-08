const loadBtn = document.getElementById("loadBtn");
const clearBtn = document.getElementById("clearBtn");
const fileInput = document.getElementById("fileInput");
const status = document.getElementById("status");

function showStatus(msg, type) {
  status.textContent = msg;
  status.className = type;
}

loadBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      // Basic validation: check a few expected keys
      if (!data.surname || !data.passport_number) {
        throw new Error("JSON does not look like a ds160_data.json export");
      }
      chrome.storage.local.set({ ds160Data: data }, () => {
        showStatus(`Loaded. ${Object.values(data).filter(f => f.found).length}/50 fields ready.`, "ok");
      });
    } catch (err) {
      showStatus("Invalid JSON: " + err.message, "err");
    }
  };
  reader.readAsText(file);
});

clearBtn.addEventListener("click", () => {
  chrome.storage.local.remove("ds160Data", () => {
    showStatus("Data cleared.", "ok");
  });
});

// Show current status on open
chrome.storage.local.get("ds160Data", (result) => {
  if (result.ds160Data) {
    const found = Object.values(result.ds160Data).filter(f => f.found).length;
    showStatus(`Data loaded: ${found}/50 fields.`, "ok");
  }
});
