const typingForm = document.querySelector(".typing-form");
const chatContainer = document.querySelector(".chat-list");
const suggestions = document.querySelectorAll(".suggestion");
const toggleThemeButton = document.querySelector("#theme-toggle-button");
const deleteChatButton = document.querySelector("#delete-chat-button");

let userMessage = null;
let isResponseGenerating = false;

const API_KEY = "AIzaSyAVQzttzQt1JkVSDQQ_zWMqhhMNq9kaECU"; 
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

const loadDataFromLocalstorage = () => {
    const savedChats = localStorage.getItem("saved-chats");
    const isLightMode = (localStorage.getItem("themeColor") === "light_mode");

    document.body.classList.toggle("light_mode", isLightMode);
    toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode";

    chatContainer.innerHTML = savedChats || '';
    document.body.classList.toggle("hide-header", savedChats);

    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}

const showTypingEffect = (text, textElement, incomingMessageDiv) => {
    const words = text.split(' ');
    let currentWordIndex = 0;

    const typingInterval = setInterval(() => {
        textElement.innerText += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex++];
        incomingMessageDiv.querySelector(".icon").classList.add("hide");

        if (currentWordIndex === words.length) {
            clearInterval(typingInterval);
            isResponseGenerating = false;
            incomingMessageDiv.querySelector(".icon").classList.remove("hide");
            localStorage.setItem("saved-chats", chatContainer.innerHTML);
        }
        chatContainer.scrollTo(0, chatContainer.scrollHeight);
    }, 75);
}

const generateAPIResponse = async (incomingMessageDiv) => {
    const textElement = incomingMessageDiv.querySelector(".text");

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: userMessage}]
                }]
            }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error.message);

        const apiResponse = data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
        showTypingEffect(apiResponse, textElement, incomingMessageDiv);
    } catch (error) {
        isResponseGenerating = false;
        textElement.innerText = error.message;
        textElement.parentElement.closest(".message").classList.add("error");
    } finally {
        incomingMessageDiv.classList.remove("loading");
    }
}

const showLoadingAnimation = () => {
    const html = `<div class="message-content">
                    <img class="avatar" src="images/gemini.svg" alt="Gemini avatar">
                    <p class="text"></p>
                    <div class="loading-indicator">
                        <div class="loading-bar"></div>
                        <div class="loading-bar"></div>
                        <div class="loading-bar"></div>
                        </div>
                    </div>
                    <span onClick="copyMessage(this)" class="icon material-symbols-rounded">content_copy</span>`;
    
    const incomingMessageDiv = createMessageElement(html, "incoming", "loading");
    chatContainer.appendChild(incomingMessageDiv);

    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    generateAPIResponse(incomingMessageDiv);
}

const copyMessage = (copyButton) => {
    const messageText = copyButton.parentElement.querySelector(".text").innerText;

    navigator.clipboard.writeText(messageText);
    copyButton.innerText = "done";
    setTimeout(() => copyButton.innerText = "content_copy", 1000);
}

const handleOutgoingChat = () => {
    userMessage = typingForm.querySelector(".typing-input").value.trim() || userMessage;
    if(!userMessage || isResponseGenerating) return;

    isResponseGenerating = true;

    const html = `<div class="message-content">
                    <img class="avatar" src="images/user.jpg" alt="User avatar">
                    <p class="text"></p>
                  </div>`;

    const outgoingMessageDiv = createMessageElement(html, "outgoing");
    outgoingMessageDiv.querySelector(".text").innerText = userMessage;
    chatContainer.appendChild(outgoingMessageDiv);

    typingForm.reset();
    document.body.classList.add("hide-header");
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showLoadingAnimation, 500);
}

toggleThemeButton.addEventListener("click", () => {
    const isLightMode = document.body.classList.toggle("light_mode");
    localStorage.setItem("themeColor", isLightMode ? "light_mode" : "dark_mode");
    toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode";
});

deleteChatButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all the chats?")) {
        localStorage.removeItem("saved-chats");
        loadDataFromLocalstorage();
    }
});

suggestions.forEach(suggestion => {
    suggestion.addEventListener("click", () => {
        userMessage = suggestion.querySelector(".text").innerText;
        handleOutgoingChat();
    });
});

typingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleOutgoingChat();
});

loadDataFromLocalstorage();

// const typingForm = document.querySelector(".typing-form");
// const chatContainer = document.querySelector(".chat-list");
// const suggestions = document.querySelector(".suggestion");
// const toggleThemeButton = document.querySelector("#theme-toggle-button");
// const deleteChatButton = document.querySelector("#delete-chat-button");

// let userMessage = null;
// let isResponseGenerating = false;

// const API_KEY = "AIzaSyDxv1IJOJLvczgYfhcSFtWWq9EIYh2WG_0";
// const API_URL =
//   "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=GEMINI_API_KEY";

// const loadDataFromLocalStorage = () => {
//   const savedChats = localStorage.getItem("saved-chats");
//   const isLightMode = localStorage.getItem("themeColor") === "light_mode";

//   document.body.classList.toggle("light_mode , isLightMode");
//   toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode";

//   chatContainer.innerHTML = savedChats || "";
//   document.body.classList.toggle("hide-header", savedChats);

//   chatContainer.scrollTo(0, chatContainer.scrollHeight);
// };

// const createMessageElement = (content, ...classes) => {
//   const div = document.createElement("div");
//   div.classList.add("message", ...classes);
//   div.innerHTML = content;
//   return div;
// };

// const showTypingEffect = (text, textElement, incomingMessageDiv) => {
//   const words = text.split(" ");
//   let currentWordIndex = 0;

//   const typingInterval = setInterval(() => {
//     textElement.innerText +=
//       (currentWordIndex === 0 ? "" : " ") + words[currentWordIndex++];
//     incomingMessageDiv.querySelector(".icon").classList.add("hide");

//     if (currentWordIndex === words.length) {
//       clearInterval(typingInterval);
//       isResponseGenerating = false;
//       incomingMessageDiv.querySelector(".icon").classList.remove("hide");
//       localStorage.setItem("saved-chats", chatContainer.innerHTML);
//     }
//     chatContainer.scrollTo(0, chatContainer.scrollHeight);
//   }, 75);
// };

// // responsible for shoing api response
// const generateAPIResponse = async (incomingMessageDiv) => {
//   const textElement = incomingMessageDiv.querySelector(".text");

//   try {
//     const response = await fetch(API_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         contents: [
//           {
//             role: "user",
//             parts: [{ text: userMessage }],
//           },
//         ],
//       }),
//     });
//     const data = await response.json();
//     if (!response.ok) throw new Error(data.error.message);

//     const apiResponse = data?.cadidates[0].content.parts[0].text.replace(
//       /\*\*(.*?)\*\*/g,
//       "$1"
//     );
//     showTypingEffect(apiResponse, textElement, incomingMessageDiv);
//   } catch (error) {
//     isResponseGenerating = false;
//     textElement.innerText = error.message;
//     textElement.parentElement.closest(".message").classList.add("error");
//   } finally {
//     incomingMessageDiv.classList.remove("loading");
//   }
// };

// // responsible for shoing loading indicator
// const showLoadingAnimation = () => {
//   const html = `<div class="message-content">
//         <img class="avatar" src="images/gemini.svg" alt="Gemini Avatar">
//         <p class="text"></p>
//         <div class="loading-indicator">
//             <div class="loading-bar">
//             <div class="loading-bar">
//             <div class="loading-bar">
//             </div>
//         </div>
//         <span onClick="copyMessage(this)" class="icon material-symbols-rounded">content_copy</span>`;

//   const incomingMessageDiv = createMessageElement(html, "incoming", "loading");
//   chatContainer.appendChild(incomingMessageDiv);

//   chatContainer.scrollTo(0, chatContainer.scrollHeight);
//   generateAPIResponse(incomingMessageDiv);
// };

// // function lets to copy the response from gemini
// const copyMessage = (copyButton) => {
//   const messageText = copyButton.parentElement.querySelector(".text").innerText;

//   navigator.clipboard.writeText(messageText);
//   copyButton.innerText = "done";

//   setTimeout(() => {
//     copyButton.innerText = "content_copy";
//   }, 1000);
// };


// // handling the userinput and sending it to the gemini
// const handleOutgoingChat = () => {
//     userMessage = typingForm.querySelector(".typing-input").value.trim() || userMessage;
//     // user entered msg and not empty 
//     if (!userMessage || isResponseGenerating) return;
  
//     // prevents multiple request being sent
//     isResponseGenerating = true;
  
//     const html = `
//       <div class="message-content">
//         <img class="avatar" src="images/user.jpg" alt="User avatar">
//         <p class="text"></p>
//       </div>
//     `;
  
//     const outgoingMessageDiv = createMessageElement(html, "outgoing");
//     outgoingMessageDiv.querySelector(".text").innerText = userMessage;
//     chatContainer.appendChild(outgoingMessageDiv);

//     typingForm.reset();
//     document.body.classList.add("hide-header");
//     chatContainer.scrollTo(0, chatContainer.scrollHeight);
//     setTimeout(showLoadingAnimation , 500);
//   }

// // theme mdoes - light and dark
// toggleThemeButton.addEventListener("click", () => {
//     const isLightMode = document.body.classList.toggle("light_mode");
//     toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode";
// });

// deleteChatButton.addEventListener("click", () => {
//     if (confirm("Are you sure you wnat to delete all the chats?")){
//         localStorage.removeItem("saved-chats");
//         loadDataFromLocalStorage();
//     }
// });

// suggestions.forEach(suggestion => {
//     suggestion.addEventListener("click", () => {
//         userMessage = suggestion.querySelector(".text").innerText;
//         handleOutgoingChat();
//     })
// })

// typingForm.addEventListener("submit" , (e) => {
//     e.preventDefault();
//     handleOutgoingChat();
// })

// loadDataFromLocalStorage();
