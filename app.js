// VARIABLE DECLARATIONS

// const declares a variable that cannot be reassigned to a new value. 
// document.querySelector returns the first element that matches a CSS selector. If we wanted to return all matches (not only the first), we'd use querySelectorAll() 

const openChatbot = document.querySelector(".open-chatbot");  // Switches state of chatbot from open to closed 
const closeChatbot = document.querySelector(".close-btn");  // When the chat is open, this is the "X" that shows at the bottom right */
const chatMessageStorage = document.querySelector(".chat-message-storage"); /* This is what holds our chat messages */
const textBox = document.querySelector(".text-box textarea");  /* The text area is housed in the text box */
const sendButton = document.querySelector(".text-box span");   /* This is the green arrow that appears when you start typing in the text box */
const textBoxHeight = textBox.scrollHeight;   // scrollHeight is the minimum height the element requires in order to fit all content in the viewport without using a vertical scrollbar 

// node_modules\request-promise
// C:\Users\asulak\ChatbotNodeJs\node_modules\request-promise

// let declares a variable that can be reassigned another value
// Both let and const are block-scoped, meaning they can be accessible within curly braces. Curly braces group blocks of code and execute them together. 

let typedMessage = null; // Variable to store user's message. The default value is null. 

var url = 'https://chatbotintermediary.azurewebsites.net/api/http_trigger?code=MPBmEhNQfbafCxNqA9nhoAE8-G0BsZ4dtTXuONAEPQt5AzFughGm1w=='

// Provides initial instructions to ChatGPT
var messages = [
    {
      role: "system",
      content: "You are a personable, entertaining chatbot."
    }
  ];

//const sendrequest = await superagent.post()
  
// EVENT LISTENERS

// Adjust the textbox height based on the content inside 
textBox.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    textBox.style.height = `${textBoxHeight}px`;
    textBox.style.height = `${textBox.scrollHeight}px`;
});

// If a user presses enter, send a message
textBox.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window 
    // width is greater than 800px, handle the chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();  /* Override default behavior from browser */
        handleChat();   /* Call handleChat funtion defined later. In JS, functions can be called before they are defined. */
    }
});

// FUNCTIONS 

// Parentheses () in JS are used for function parameters, to surround conditional statments, or for executing code in blocks.
// Curly braces {} in JS are used to declare object literals or to enclose blocks of code 

const createChatLi = (message, className) => {   
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");  /* Creates list HTML element. JavaScript can be used to modify HTML. */
    chatLi.classList.add("chat", `${className}`);  /* classList.add adds one or more class names to the specified element */
    // === is a strict equality operator. Two values must be equal and of the same type.
    // A conditional ternary operator takes three operands - a condition followed by a question mark (?), then an expression to execute if the condition is
    // truthy, followed by a colon, and the expression to execute if the condition is falsy 
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">voice_chat</span><p></p>`;
    // Sets or returns all the HTML content of an element. 
    chatLi.innerHTML = chatContent;
    // The textContent property returns the text content of the specified node and its descendants  
    chatLi.querySelector("p").textContent = message;
    // Equivalent to print() in Python. 
    console.log()
    return chatLi; // return the chatLi element 
}

// Function that details what to do with user-typed messages 
const handleChat = () => {
    typedMessage = textBox.value.trim(); // The value property sets or returns the value of the value attribute of a text field. .trim() removes whitespace from both ends of the string.
    console.log(typedMessage)
    if(!typedMessage) return;   // If no textbox value, exit function

    // Clear the input textarea and set its height to what it was before the user started typing 
    textBox.value = "";
    textBox.style.height = `${textBoxHeight}px`;

    // Append the user's message to the chatMessageStorage. appendChild() appends a node (element) as the last child of an element.
    // We create a new list element with the typed message with a class of outgoing.  
    chatMessageStorage.appendChild(createChatLi(typedMessage, "outgoing"));
    // Now we update the scroll height 
    chatMessageStorage.scrollTo(0, chatMessageStorage.scrollHeight);
    
    // There will be a gap between when we send a message and when we get a response. This function details what to do during that time.
    // setTimeout() method sets a timer which executes a function or a specified piece of code once the timer expires. setTimeout(code, delay) 
    setTimeout(() => {
        // While waiting for the response, we display a "Thinking..." message with the attributes of the "incoming" class 
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatMessageStorage.appendChild(incomingChatLi);
        chatMessageStorage.scrollTo(0, chatMessageStorage.scrollHeight);
        // We're triggering the generateResponse function based on the "Thinking..." bubble. 
        // What we actually send to openAI will be different. 
        generateResponse(incomingChatLi); 
    }, 600);  /* In MS */
}

// This function generates a response from chatGPT. The function parameter name is arbitrary; it represents an input 
const generateResponse = async (chatElement) => {
    const messageElement = chatElement.querySelector("p");

    // Define the API request method, its headers (meta-data associated with request), the body (data sent by your client, say a browser, to the API) 
    messages.push({role: "user", content: typedMessage});
    console.log(messages)

    // var options = {method: 'POST',
    // uri: 'https://chatbotintermediary.azurewebsites.net/api/http_trigger?code=MPBmEhNQfbafCxNqA9nhoAE8-G0BsZ4dtTXuONAEPQt5AzFughGm1w==',
    // body: messages,
    // json: true};
    console.log(url)

    try {
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': "*"
            },
            body: JSON.stringify(messages)
            }
            const response = await fetch('https://chatbotintermediary.azurewebsites.net/api/http_trigger?code=MPBmEhNQfbafCxNqA9nhoAE8-G0BsZ4dtTXuONAEPQt5AzFughGm1w==', config)
                console.log(response)
                messageElement.textContent = response;
                messages.push({role: "assistant", content: response})
            } catch (error) {
                console.log(error)
        
    //Call function containing API key
    // superagent.post('https://chatbotintermediary.azurewebsites.net/api/http_trigger?code=MPBmEhNQfbafCxNqA9nhoAE8-G0BsZ4dtTXuONAEPQt5AzFughGm1w==').set('Content-Type', 'application/json').send('{"role":"system","content":"You are a personable, entertaining chatbot."},{"role":"user","content":"How old is Mark Zuckerberg?"}')
    // Collect the result, turn it into a chat message, and add it to the messages the array

    // A catch block contains statements that specify what to do if there's an error 
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    // The finally method of Promise instances schedules a function to be called when a promise is settled (fulfilled or rejected)
    } finally {() => chatMessageStorage.scrollTo(0, chatMessageStorage.scrollHeight)}};   /* Executes whether there's a valid response or an error */
        
    // Event listeners for sendButton, closeChatBot, and openChatbot. 
    // The addEventListener() function is in-built in JS that takes an event to listen for and a second argument to alled whenever the described event is fired  
    sendButton.addEventListener("click", handleChat);
    closeChatbot.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
    openChatbot.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

// FUTURE DATABASE CALL - Anticipate executing this after the chat session ends 

    // An asychrnouous nested function (still part of generateResponse) takes both outgoing and incoming chat messages. 

//     const postMessagestoDatabase = async(request_message, response_message) => {n
//         try {
//             // The await keyword can only be used inside an async function. The await keyword makes the function pause the execution and wait for a resolved promise before it continues.  
//             // With axios.post, the first parameter is the URL, the second parameter is the request body, and the 3rd parameter is the options.
//             const response = await axios.post("http://localhost:8000/messages-to-database", {
//         // When making a POST request, we include parameters in the request body 
//         params: {
//          request_message,
//         response_message},
//         // 
//         headers: {
//             "Access-Control-Allow-Credentials": true,  /* This header, when set to true, tells browsers to expose the response to our JS Code. Credentials include auth headers from the CORS preflight request */  
//             'content-type': 'text/json'
//         }});
//         console.log(response)
//     } catch (err) {
//         console.error(err);
//     }

// postMessagestoDatabase()
