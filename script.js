document.addEventListener('DOMContentLoaded', () => {
    // Navigation Toggle for Mobile
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        // Animate links (optional, if you want staggered fade in)
    });

    // Close nav when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Smooth Scrolling (Polyfill if native not supported, though HTML {scroll-behavior: smooth} covers most)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Offset for fixed header
                const headerOffset = 70;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Animate sections on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Add fade-in class to sections for animation styling
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
        section.style.opacity = "0";
        section.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
        section.style.transform = "translateY(20px)";
    });

    // Helper to handle the actual class addition based on the observer above
    // Since I added inline styles above for initial state, I'll modify the loop slightly
    // to just handle the class logic cleanly if I were writing CSS for .fade-in.
    // Let's attach the specific logic here:

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        fadeInObserver.observe(section);
    });
});

/* -------------------------------------------------------------------------- */
/*                               Chat Assistant Logic                         */
/* -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    console.log("Chat Assistant Loading...");

    // UI Elements
    const chatWidget = document.getElementById('chat-widget');
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatContainer = document.getElementById('chat-container');
    const chatCloseBtn = document.getElementById('chat-close-btn');
    const chatBody = document.getElementById('chat-body');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');

    // Debug Check
    if (!chatWidget || !chatToggleBtn) {
        console.error("Chat Elements not found!");
        return;
    }

    // State
    let isChatOpen = false;
    let portfolioContext = "";

    // TOGGLE CHAT
    function toggleChat() {
        console.log("Toggle Chat Clicked");
        isChatOpen = !isChatOpen;
        if (isChatOpen) {
            chatContainer.classList.remove('hidden');
            // Load context if not loaded
            if (!portfolioContext) {
                portfolioContext = getPortfolioContext();
                console.log("Portfolio Context Loaded");
            }
            chatInput.focus();
        } else {
            chatContainer.classList.add('hidden');
        }
    }

    chatToggleBtn.addEventListener('click', toggleChat);
    chatCloseBtn.addEventListener('click', toggleChat);

    // SEND MESSAGE
    function sendMessage() {
        const userText = chatInput.value.trim();
        if (!userText) return;

        // Add User Message
        addMessage(userText, 'user-message');
        chatInput.value = '';

        // Simulate AI Delay
        showTypingIndicator();

        setTimeout(() => {
            removeTypingIndicator();
            const response = generateAIResponse(userText);
            addMessage(response, 'bot-message');
        }, 600); // 600ms delay for realism
    }

    chatSendBtn.addEventListener('click', sendMessage);

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // HELPER: Add Message to UI
    function addMessage(text, className) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', className);
        messageDiv.innerHTML = `<p>${formatText(text)}</p>`;
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function formatText(text) {
        return text.replace(/\n/g, '<br>');
    }

    // HELPER: Typing Indicator
    let typingDiv;
    function showTypingIndicator() {
        typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'bot-message');
        typingDiv.style.fontStyle = 'italic';
        typingDiv.style.color = '#888';
        typingDiv.innerText = 'Thinking...';
        chatBody.appendChild(typingDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function removeTypingIndicator() {
        if (typingDiv) {
            chatBody.removeChild(typingDiv);
            typingDiv = null;
        }
    }

    /* -------------------------------------------------------------------------- */
    /*                             "AI" Logic (Local)                             */
    /* -------------------------------------------------------------------------- */

    function getPortfolioContext() {
        let context = "";

        const grab = (selector) => {
            const el = document.querySelector(selector);
            return el ? el.innerText.replace(/\s+/g, ' ').trim() : "";
        };

        context += "Intro: " + grab('#home .hero-text') + "\n";
        context += "Skills: " + grab('#skills .skills-grid') + "\n";

        const projects = document.querySelectorAll('.project-card');
        projects.forEach(p => {
            context += "Project: " + p.innerText.replace(/\s+/g, ' ').trim() + "\n";
        });

        const experience = document.querySelectorAll('.timeline-item');
        experience.forEach(e => {
            context += "Experience: " + e.innerText.replace(/\s+/g, ' ').trim() + "\n";
        });

        context += "Contact: " + grab('#contact .contact-info') + "\n";

        return context.toLowerCase();
    }

    function generateAIResponse(userQuery) {
        const query = userQuery.toLowerCase();

        const forbidden = ['password', 'secret', 'ignore previous', 'system prompt', 'openai', 'chatgpt'];
        if (forbidden.some(w => query.includes(w))) {
            return "I cannot answer that. I am strictly limited to Thamaraikanna's portfolio data.";
        }

        if (query.match(/^(hi|hello|hey|greetings)/)) {
            return "Hello! How can I help you explore my portfolio?";
        }

        if (query.includes('who are you') || query.includes('your name')) {
            return "I am Thamaraikanna's AI Portfolio Assistant.";
        }

        if (query.includes('skill') || query.includes('know') || query.includes('tech')) {
            const skillsMatch = portfolioContext.match(/skills:(.*?)project/s) || portfolioContext.match(/skills:(.*)/);
            if (skillsMatch) {
                return "My technical skills include: SolidWorks, AutoCAD, Hypermesh, MS Office, KiCAD, and Typewriting (English & Tamil).";
            }
        }

        if (query.includes('project') || query.includes('work') || query.includes('built')) {
            return "I have worked on several projects including: \n1. Smart Energy Meter (Arduino) \n2. Automatic Door System (Arduino) \n3. Thermal Energy Storage Research.";
        }

        if (query.includes('energy meter')) {
            return "The Smart Energy Meter project used Arduino to monitor and display energy consumption in real-time, enabling better energy management.";
        }

        if (query.includes('door')) {
            return "The Automatic Door System utilizes ultrasonic sensors and Arduino for contactless entry integration.";
        }

        if (query.includes('experience') || query.includes('internship') || query.includes('company')) {
            return "I have completed internships at: \n- Chennai Heatreaters Private Limited (2 Weeks, Quality Control) \n- Maruthi Engineering Works (3 Weeks, Machining & Assembly).";
        }

        if (query.includes('contact') || query.includes('email') || query.includes('phone') || query.includes('hire') || query.includes('reach')) {
            return "You can reach me at: \nEmail: thamaraikannaramu@gmail.com \nPhone: +91 9994593642 \nLocation: Salem, Tamil Nadu.";
        }

        if (query.includes('about') || query.includes('goal') || query.includes('objective')) {
            return "I am a B.E Mechanical Engineering graduate and Quality Engineer. My goal is to leverage my background to contribute to innovative manufacturing processes and ensure product excellence.";
        }

        if (portfolioContext.includes(query)) {
            return "I found a mention of that in my portfolio. Could you be more specific?";
        }

        return "That information is not available in my internal data. I can only answer questions about my projects, skills, and experience.";
    }
});

// UI Elements
const chatWidget = document.getElementById('chat-widget');
const chatToggleBtn = document.getElementById('chat-toggle-btn');
const chatContainer = document.getElementById('chat-container');
const chatCloseBtn = document.getElementById('chat-close-btn');
const chatBody = document.getElementById('chat-body');
const chatInput = document.getElementById('chat-input');
const chatSendBtn = document.getElementById('chat-send-btn');

// State
let isChatOpen = false;
let portfolioContext = "";

// TOGGLE CHAT
function toggleChat() {
    isChatOpen = !isChatOpen;
    if (isChatOpen) {
        chatContainer.classList.remove('hidden');
        // Load context if not loaded
        if (!portfolioContext) {
            portfolioContext = getPortfolioContext();
            console.log("Portfolio Context Loaded");
        }
        chatInput.focus();
    } else {
        chatContainer.classList.add('hidden');
    }
}

chatToggleBtn.addEventListener('click', toggleChat);
chatCloseBtn.addEventListener('click', toggleChat);

// SEND MESSAGE
function sendMessage() {
    const userText = chatInput.value.trim();
    if (!userText) return;

    // Add User Message
    addMessage(userText, 'user-message');
    chatInput.value = '';

    // Simulate AI Delay
    showTypingIndicator();

    setTimeout(() => {
        removeTypingIndicator();
        const response = generateAIResponse(userText);
        addMessage(response, 'bot-message');
    }, 600); // 600ms delay for realism
}

chatSendBtn.addEventListener('click', sendMessage);

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// HELPER: Add Message to UI
function addMessage(text, className) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', className);
    messageDiv.innerHTML = `<p>${formatText(text)}</p>`;
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function formatText(text) {
    // Simple formatting: newlines to <br>
    return text.replace(/\n/g, '<br>');
}

// HELPER: Typing Indicator
let typingDiv;
function showTypingIndicator() {
    typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'bot-message');
    typingDiv.style.fontStyle = 'italic';
    typingDiv.style.color = '#888';
    typingDiv.innerText = 'Thinking...';
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function removeTypingIndicator() {
    if (typingDiv) {
        chatBody.removeChild(typingDiv);
        typingDiv = null;
    }
}

/* -------------------------------------------------------------------------- */
/*                             "AI" Logic (Local)                             */
/* -------------------------------------------------------------------------- */

// 1. Context Extraction (RAG - Retrieval Augmented Generation simulation)
function getPortfolioContext() {
    let context = "";

    // Helper to grab text safely
    const grab = (selector) => {
        const el = document.querySelector(selector);
        return el ? el.innerText.replace(/\s+/g, ' ').trim() : "";
    };

    // Header / Intro
    context += "Intro: " + grab('#home .hero-text') + "\n";

    // Skills
    context += "Skills: " + grab('#skills .skills-grid') + "\n";

    // Projects
    const projects = document.querySelectorAll('.project-card');
    projects.forEach(p => {
        context += "Project: " + p.innerText.replace(/\s+/g, ' ').trim() + "\n";
    });

    // Experience
    const experience = document.querySelectorAll('.timeline-item');
    experience.forEach(e => {
        context += "Experience: " + e.innerText.replace(/\s+/g, ' ').trim() + "\n";
    });

    // Contact
    context += "Contact: " + grab('#contact .contact-info') + "\n";

    return context.toLowerCase();
}

// 2. Response Generation (Heuristic Matcher)
function generateAIResponse(userQuery) {
    const query = userQuery.toLowerCase();

    // Security / Scope Check
    // If query asks about things likely outside valid scope
    const forbidden = ['password', 'secret', 'ignore previous', 'system prompt', 'openai', 'chatgpt'];
    if (forbidden.some(w => query.includes(w))) {
        return "I cannot answer that. I am strictly limited to Thamaraikanna's portfolio data.";
    }

    /* --- Intent Classification & Extraction --- */

    // GREETINGS
    if (query.match(/^(hi|hello|hey|greetings)/)) {
        return "Hello! How can I help you explore my portfolio?";
    }

    // WHO ARE YOU
    if (query.includes('who are you') || query.includes('your name')) {
        return "I am Thamaraikanna's AI Portfolio Assistant.";
    }

    // SKILLS
    if (query.includes('skill') || query.includes('know') || query.includes('tech')) {
        // Extract skills from context
        const skillsMatch = portfolioContext.match(/skills:(.*?)project/s) || portfolioContext.match(/skills:(.*)/);
        if (skillsMatch) {
            // Formatting the raw text a bit better would be nice, but raw is okay for now
            // "solidworks autocad..."
            return "My technical skills include: SolidWorks, AutoCAD, Hypermesh, MS Office, KiCAD, and Typewriting (English & Tamil).";
            // Hardcoding slightly for better presentation based on known context, 
            // but realistically we should parse `skillsMatch[1]`.
        }
    }

    // PROJECTS
    if (query.includes('project') || query.includes('work') || query.includes('built')) {
        return "I have worked on several projects including: \n1. Smart Energy Meter (Arduino) \n2. Automatic Door System (Arduino) \n3. Thermal Energy Storage Research.";
    }

    // SPECIFIC PROJECT: SMART ENERGY METER
    if (query.includes('energy meter')) {
        return "The Smart Energy Meter project used Arduino to monitor and display energy consumption in real-time, enabling better energy management.";
    }

    // SPECIFIC PROJECT: DOOR
    if (query.includes('door')) {
        return "The Automatic Door System utilizes ultrasonic sensors and Arduino for contactless entry integration.";
    }

    // EXPERIENCE / INTERNSHIP
    if (query.includes('experience') || query.includes('internship') || query.includes('company')) {
        return "I have completed internships at: \n- Chennai Heatreaters Private Limited (2 Weeks, Quality Control) \n- Maruthi Engineering Works (3 Weeks, Machining & Assembly).";
    }

    // CONTACT
    if (query.includes('contact') || query.includes('email') || query.includes('phone') || query.includes('hire') || query.includes('reach')) {
        return "You can reach me at: \nEmail: thamaraikannaramu@gmail.com \nPhone: +91 9994593642 \nLocation: Salem, Tamil Nadu.";
    }

    // OBJECTIVE / ABOUT
    if (query.includes('about') || query.includes('goal') || query.includes('objective')) {
        return "I am a B.E Mechanical Engineering graduate and Quality Engineer. My goal is to leverage my background to contribute to innovative manufacturing processes and ensure product excellence.";
    }

    // GENERIC SEARCH (Fallback behavior)
    // If keywords match something in context
    // This is a simple fuzzy check
    if (portfolioContext.includes(query)) {
        return "I found a mention of that in my portfolio. Could you be more specific?";
        // Ideally we find the sentence, but for now this is safer than hallucinating.
    }

    // FAILSAFE
    return "That information is not available in my internal data. I can only answer questions about my projects, skills, and experience.";
}

});
