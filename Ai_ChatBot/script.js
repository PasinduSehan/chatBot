



const prompt = document.querySelector("#prompt");
const chatContainer = document.querySelector("#chatContainer");
const submitBtn = document.querySelector("#submit");
const imageBtn = document.querySelector("#image");
const errorIconBtn = document.querySelector("#errorIcon");
const fileInput = document.querySelector("#fileInput");

function createChatBox(html, className) {
  const div = document.createElement("div");
  div.classList.add(className);
  div.innerHTML = html;
  return div;
}

function scrollToBottom() {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Auto send first AI welcome message when page loads
window.addEventListener("load", () => {
  let html = `
      <img src="ai5.jpeg" alt="" id="aiImage" width="70">  
      <div class="ai-chat-area">
          Hello! How can I help you today?
      </div>`;
      
  let aiChatBox = createChatBox(html, "ai-chat-box");
  chatContainer.appendChild(aiChatBox);
  
  chatContainer.scrollTop = chatContainer.scrollHeight;
});


const Api_Url="your ApI add"

let user = {
  data:null,

}

async function generateResponse(aiBox) {

  let text=aiBox.querySelector("ai-chat-area")
  let RequestOption ={
    method:"POST",
    headers:{'Content-Type ': 'application/json'},
    body:JSON.stringify({
      
        "contents": [{
          "parts":[{"text": user.data}]
          }]
         
    })
  }
  try{
    let response=await fetch(Api_Url,RequestOption)
    let data=await response.json()
    let apiResponse=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
    text.innerHTML=apiResponse
  }
  catch(error){
    console.log(error);
  }
  finally{
    chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})
  }

  
}


function handleChatResponse(message) {
  // Create user message box
  user.data=message
  const userHtml = `
    <img src="ai1.jpeg" width="50">
    <div class="user-chat-area">${user.data}</div>
  `;
  const userBox = createChatBox(userHtml, "user-chat-box");
  chatContainer.appendChild(userBox);
  scrollToBottom();

  // Clear input
  prompt.value = "";

  // Add loading reply from AI
  const loadingHtml = `
    <img src="ai5.jpeg" width="50">
    <div class="ai-chat-area">
      <img src="loading.webp" width="40" alt="loading">
    </div>
  `;
  const loadingBox = createChatBox(loadingHtml, "ai-chat-box");
  chatContainer.appendChild(loadingBox);
  scrollToBottom();

  // Replace loading with actual reply after delay
  setTimeout(() => {
    loadingBox.remove();
    const aiHtml = `
      <img src="ai5.jpeg" width="50">
      <div class="ai-chat-area">${message}</div>
    `;
    const aiBox = createChatBox(aiHtml, "ai-chat-box");
    chatContainer.appendChild(aiBox);
    generateResponse(aiBox)
    scrollToBottom();
  }, 1500);
}

// Handle file input for image upload
imageBtn.addEventListener("click", () => {
  fileInput.click(); // Triggers the file input dialog
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      // Show the uploaded image in the chat
      const imageHtml = `
        <img src="${e.target.result}" width="50">
        <div class="user-chat-area">Uploaded Image</div>
      `;
      const imageBox = createChatBox(imageHtml, "user-chat-box");
      chatContainer.appendChild(imageBox);
      scrollToBottom();

      // Send image to backend for recognition (simulated here)
      analyzeImageWithAPI(e.target.result);
    };
    reader.readAsDataURL(file); // Read the image file as a URL
  }
});



submitBtn.addEventListener("click", () => {
  const message = prompt.value.trim();
  if (message !== "") {
    handleChatResponse(message);
  }
});

// Error icon click to simulate the Enter key press
errorIconBtn.addEventListener("click", () => {
  const message = prompt.value.trim();
  if (message !== "") {
    handleChatResponse(message);
  }
});

prompt.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const message = prompt.value.trim();
    if (message !== "") {
      handleChatResponse(message);
    }
  }
});


