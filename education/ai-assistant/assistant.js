document.addEventListener('DOMContentLoaded', () => {
    // Get the base URL dynamically
    const BASE_URL = window.location.origin;
    const API_URL = `${BASE_URL}/api`;

    // Initialize DOM elements
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendMessage');
    const voiceButton = document.getElementById('startVoice');
    const voiceStatus = document.getElementById('voiceStatus');
    const languageSelect = document.getElementById('languageSelect');
    const questionButtons = document.querySelectorAll('.question-btn');

    // Camera elements
    const toggleCameraBtn = document.getElementById('toggleCamera');
    const cameraModal = document.getElementById('cameraModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const cameraFeed = document.getElementById('cameraFeed');
    const photoCanvas = document.getElementById('photoCanvas');
    const capturePhotoBtn = document.getElementById('capturePhoto');
    const retakePhotoBtn = document.getElementById('retakePhoto');
    const sendPhotoBtn = document.getElementById('sendPhoto');
    const switchCameraBtn = document.getElementById('switchCamera');
    const photoPreview = document.getElementById('photoPreview');
    const capturedImage = document.getElementById('capturedImage');

    let recognition = null;
    let isListening = false;
    let stream = null;
    let currentFacingMode = 'environment'; // Start with back camera

    // Camera event listeners
    toggleCameraBtn.addEventListener('click', openCamera);
    closeModalBtn.addEventListener('click', closeCamera);
    capturePhotoBtn.addEventListener('click', capturePhoto);
    retakePhotoBtn.addEventListener('click', retakePhoto);
    sendPhotoBtn.addEventListener('click', sendPhotoToAI);
    switchCameraBtn.addEventListener('click', switchCamera);

    // Camera functions
    async function openCamera() {
        cameraModal.style.display = 'block';
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: currentFacingMode },
                audio: false
            });
            cameraFeed.srcObject = stream;
        } catch (err) {
            console.error('Camera error:', err);
            alert('Unable to access camera. Please make sure you have granted camera permissions.');
            closeCamera();
        }
    }

    function closeCamera() {
        cameraModal.style.display = 'none';
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }
        resetCameraUI();
    }

    function resetCameraUI() {
        cameraFeed.style.display = 'block';
        photoPreview.style.display = 'none';
        capturePhotoBtn.style.display = 'block';
        retakePhotoBtn.style.display = 'none';
        sendPhotoBtn.style.display = 'none';
    }

    async function switchCamera() {
        currentFacingMode = currentFacingMode === 'environment' ? 'user' : 'environment';
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: currentFacingMode },
                audio: false
            });
            cameraFeed.srcObject = stream;
        } catch (err) {
            console.error('Camera switch error:', err);
        }
    }

    function capturePhoto() {
        const context = photoCanvas.getContext('2d');
        photoCanvas.width = cameraFeed.videoWidth;
        photoCanvas.height = cameraFeed.videoHeight;
        context.drawImage(cameraFeed, 0, 0, photoCanvas.width, photoCanvas.height);
        
        capturedImage.src = photoCanvas.toDataURL('image/jpeg');
        cameraFeed.style.display = 'none';
        photoPreview.style.display = 'block';
        capturePhotoBtn.style.display = 'none';
        retakePhotoBtn.style.display = 'block';
        sendPhotoBtn.style.display = 'block';
    }

    function retakePhoto() {
        resetCameraUI();
    }

    async function sendPhotoToAI() {
        try {
            // Show loading indicator
            addLoadingMessage();

            // Convert canvas to blob
            const blob = await new Promise(resolve => {
                photoCanvas.toBlob(resolve, 'image/jpeg');
            });

            // Create form data
            const formData = new FormData();
            formData.append('image', blob, 'photo.jpg');
            formData.append('language', languageSelect.value);

            // Send to backend
            const response = await fetch(`${API_URL}/analyze-image`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Image analysis failed');
            }

            const data = await response.json();
            
            // Remove loading message
            removeLoadingMessage();

            // Add image and response to chat
            addImageMessage('user', capturedImage.src);
            addMessage('bot', data.translated_text || data.text);

            // Add suggestions if available
            if (data.suggestions && data.suggestions.length > 0) {
                addSuggestions(data.suggestions);
            }

            // Close camera modal
            closeCamera();

        } catch (error) {
            console.error('Error:', error);
            removeLoadingMessage();
            addMessage('bot', 'Sorry, I encountered an error analyzing the image. Please try again.');
            closeCamera();
        }
    }

    function addImageMessage(type, imageUrl) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;

        const content = document.createElement('div');
        content.className = 'message-content';

        if (type === 'bot') {
            const icon = document.createElement('i');
            icon.className = 'fas fa-robot bot-icon';
            content.appendChild(icon);
        }

        const imageContent = document.createElement('div');
        imageContent.className = 'image-content';
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'Captured photo';
        imageContent.appendChild(img);
        content.appendChild(imageContent);

        messageDiv.appendChild(content);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            voiceStatus.textContent = 'Listening...';
            voiceButton.classList.add('active');
        };

        recognition.onend = () => {
            voiceStatus.textContent = 'Click to speak';
            voiceButton.classList.remove('active');
            isListening = false;
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
            processUserInput(transcript);
        };

        recognition.onerror = (event) => {
            voiceStatus.textContent = 'Error: ' + event.error;
            voiceButton.classList.remove('active');
            isListening = false;
        };
    }

    // Event Listeners
    voiceButton.addEventListener('click', toggleVoiceInput);
    sendButton.addEventListener('click', () => processUserInput(userInput.value));
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            processUserInput(userInput.value);
        }
    });

    questionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const question = button.dataset.question;
            processUserInput(question);
        });
    });

    // Toggle voice input
    function toggleVoiceInput() {
        if (!recognition) {
            alert('Speech recognition is not supported in your browser');
            return;
        }

        if (!isListening) {
            recognition.lang = getRecognitionLanguage(languageSelect.value);
            recognition.start();
            isListening = true;
        } else {
            recognition.stop();
            isListening = false;
        }
    }

    // Get recognition language code
    function getRecognitionLanguage(selectValue) {
        const langMap = {
            'en': 'en-US',
            'hi': 'hi-IN',
            'te': 'te-IN',
            'ta': 'ta-IN',
            'kn': 'kn-IN'
        };
        return langMap[selectValue] || 'en-US';
    }

    // Process user input and generate response
    async function processUserInput(input) {
        if (!input.trim()) return;

        // Add user message
        addMessage('user', input);

        // Clear input field
        userInput.value = '';

        try {
            // Show loading indicator
            addLoadingMessage();

            // Call backend API
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: input,
                    language: languageSelect.value
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            
            // Remove loading message
            removeLoadingMessage();

            // Add AI response
            addMessage('bot', data.translated_text || data.text);

            // Add suggestions if available
            if (data.suggestions && data.suggestions.length > 0) {
                addSuggestions(data.suggestions);
            }

        } catch (error) {
            console.error('Error:', error);
            removeLoadingMessage();
            addMessage('bot', 'Sorry, I encountered an error. Please try again.');
        }
    }

    // Add message to chat
    function addMessage(type, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;

        const content = document.createElement('div');
        content.className = 'message-content';

        if (type === 'bot') {
            const icon = document.createElement('i');
            icon.className = 'fas fa-robot bot-icon';
            content.appendChild(icon);
        }

        const textDiv = document.createElement('div');
        textDiv.className = 'text';
        textDiv.textContent = text;
        content.appendChild(textDiv);

        messageDiv.appendChild(content);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Add loading message
    function addLoadingMessage() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message bot loading';
        loadingDiv.innerHTML = `
            <div class="message-content">
                <i class="fas fa-robot bot-icon"></i>
                <div class="text">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Remove loading message
    function removeLoadingMessage() {
        const loadingMessage = chatMessages.querySelector('.loading');
        if (loadingMessage) {
            loadingMessage.remove();
        }
    }

    // Add suggestion buttons
    function addSuggestions(suggestions) {
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'message bot suggestions';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        const textDiv = document.createElement('div');
        textDiv.className = 'text';
        
        suggestions.forEach(suggestion => {
            const button = document.createElement('button');
            button.className = 'suggestion-btn';
            button.textContent = suggestion;
            button.addEventListener('click', () => processUserInput(suggestion));
            textDiv.appendChild(button);
        });
        
        content.appendChild(textDiv);
        suggestionsDiv.appendChild(content);
        chatMessages.appendChild(suggestionsDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Check API health on startup
    fetch(`${API_URL}/health`)
        .catch(error => {
            console.error('API health check failed:', error);
            addMessage('bot', 'Warning: Unable to connect to the AI service. Some features may be limited.');
        });
});
