const statusBadge = document.getElementById("status-badge");
const workedBtn = document.getElementById("worked-btn");
const errorBtn = document.getElementById("error-btn");
const copyBtn = document.getElementById("copy-btn");
const copyFeedback = document.getElementById("copy-feedback");
const promptBox = document.getElementById("prompt-box");
const proofInputs = Array.from(document.querySelectorAll(".proof-input"));

const setStatus = (status, text) => {
  statusBadge.dataset.status = status;
  statusBadge.textContent = text;
};

workedBtn.addEventListener("click", () => {
  setStatus("in-progress", "In Progress");
});

errorBtn.addEventListener("click", () => {
  setStatus("not-started", "Not Started");
});

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(promptBox.value);
    copyFeedback.textContent = "Prompt copied.";
  } catch {
    copyFeedback.textContent = "Clipboard not available. Copy manually from the prompt box.";
  }
});

const updateProofState = () => {
  proofInputs.forEach((input) => {
    const row = input.closest(".proof-item");
    const checkbox = row.querySelector(".proof-check");
    const hasProof = input.value.trim().length > 0;
    checkbox.disabled = !hasProof;
    checkbox.checked = hasProof;
  });

  const allCompleted = proofInputs.every((input) => input.value.trim().length > 0);
  if (allCompleted) {
    setStatus("shipped", "Shipped");
  }
};

proofInputs.forEach((input) => {
  input.addEventListener("input", updateProofState);
});

updateProofState();
