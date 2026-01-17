const sendBtn = document.getElementById("send");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

sendBtn.onclick = async () => {
  const text = input.value.trim();
  if (!text) return;

  messages.innerHTML += `<div class="user">${text}</div>`;
  input.value = "";

  messages.innerHTML += `<div class="ai thinking">Thinking...</div>`;

  const res = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  });

  const data = await res.json();

  document.querySelector(".thinking").remove();
  messages.innerHTML += `<div class="ai">${data.reply}</div>`;
};
