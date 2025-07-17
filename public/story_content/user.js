window.InitUserScripts = function()
{
var player = GetPlayer();
var object = player.object;
var once = player.once;
var addToTimeline = player.addToTimeline;
var setVar = player.SetVar;
var getVar = player.GetVar;
var update = player.update;
var pointerX = player.pointerX;
var pointerY = player.pointerY;
var showPointer = player.showPointer;
var hidePointer = player.hidePointer;
var slideWidth = player.slideWidth;
var slideHeight = player.slideHeight;

window.Script1 = function()
{
  // Get the username from Storyline variable
var player = GetPlayer();
var username = player.GetVar("userName");

// Validate username
if (!username || username.trim() === "") {
    alert("Please enter a username first!");
    return;
}

// Store username in session for use on next slides
sessionStorage.setItem('storyline_username', username.trim());
console.log("Username captured:", username);

// Now jump to next slide
player.SetVar("JumpToNextSlide", true);
}

window.Script2 = function()
{
  // Get the username from previous slide
var username = sessionStorage.getItem('storyline_username');
var player = GetPlayer();

console.log("Retrieved username from sessionStorage:", username);
console.log("API endpoint:", "https://cyber-security-sage.vercel.app/api");

if (!username) {
    alert("No username found. Please go back and enter a username.");
    return;
}

console.log("Starting video generation for:", username);

// Show loading message
player.SetVar("LoadingMessage", "Generating your personalized video...");

// API base URL - MOVED TO GLOBAL SCOPE
var apiBase = "https://cyber-security-sage.vercel.app/api";

// Function to check video status - IMPROVED VERSION
function checkVideoStatus(videoId) {
    console.log("Checking video status for ID:", videoId);
    
    fetch(apiBase + "/get-video?video_id=" + videoId)
    .then(response => response.json())
    .then(data => {
        console.log("Video status response:", data);
        
        if (data.success) {
            console.log("Video status:", data.status);
            
            if (data.status === "completed") {
                // Video is ready!
                console.log("Video URL received:", data.video_url);
                sessionStorage.setItem('storyline_video_url', data.video_url);
                player.SetVar("LoadingMessage", "Video ready! Loading...");
                
                // Set the VideoURL variable properly
                player.SetVar("VideoURL", data.video_url);
                
                // IMPROVED: Create video element immediately instead of waiting for next slide
                createVideoElement(data.video_url);
                
                // Go to next slide after short delay
                setTimeout(() => {
                    console.log("Jumping to next slide with video URL:", data.video_url);
                    player.SetVar("JumpToNextSlide", true);
                }, 2000); // Increased delay to 2 seconds
                
            } else if (data.status === "failed") {
                console.log("Video generation failed");
                player.SetVar("LoadingMessage", "Video generation failed. Please try again.");
            } else {
                // Still processing, check again in 3 seconds
                console.log("Video still processing, checking again in 3 seconds");
                setTimeout(() => checkVideoStatus(videoId), 3000);
            }
        } else {
            console.error("API returned success: false", data);
            player.SetVar("LoadingMessage", "Error checking video status. Please try again.");
        }
    })
    .catch(error => {
        console.error("Error checking video status:", error);
        player.SetVar("LoadingMessage", "Error checking video status. Please try again.");
    });
}

// IMPROVED: Function to create video element
function createVideoElement(videoUrl) {
    console.log("Creating video element with URL:", videoUrl);
    
    // Remove any existing video elements
    var existingVideo = document.getElementById('storyline-custom-video');
    if (existingVideo) {
        existingVideo.remove();
    }
    
    // Create video element
    var videoElement = document.createElement('video');
    videoElement.id = 'storyline-custom-video';
    videoElement.width = 640;
    videoElement.height = 360;
    videoElement.controls = true;
    videoElement.autoplay = true;
    videoElement.src = videoUrl;
    videoElement.style.maxWidth = '100%';
    videoElement.style.height = 'auto';
    
    // Create container
    var container = document.createElement('div');
    container.id = 'storyline-video-container';
    container.style.position = 'fixed';
    container.style.top = '50%';
    container.style.left = '50%';
    container.style.transform = 'translate(-50%, -50%)';
    container.style.zIndex = '9999';
    container.style.backgroundColor = 'rgba(0,0,0,0.9)';
    container.style.padding = '20px';
    container.style.borderRadius = '10px';
    container.style.textAlign = 'center';
    
    // Add close button
    var closeButton = document.createElement('button');
    closeButton.innerHTML = '✕ Close';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.background = 'rgba(255,255,255,0.8)';
    closeButton.style.border = 'none';
    closeButton.style.padding = '5px 10px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.borderRadius = '5px';
    closeButton.onclick = function() {
        container.remove();
    };
    
    container.appendChild(closeButton);
    container.appendChild(videoElement);
    document.body.appendChild(container);
    
    console.log("Video element created and added to page");
}

// Step 1: Generate script
fetch(apiBase + "/generate-script", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        username: username
    })
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        console.log("Script generated successfully");
        player.SetVar("LoadingMessage", "Creating video with AI avatar...");
        
        // Step 2: Create video
        return fetch(apiBase + "/create-video", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                script: data.script,
                username: username
            })
        });
    } else {
        throw new Error("Failed to generate script");
    }
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        console.log("Video creation started, ID:", data.video_id);
        player.SetVar("LoadingMessage", "Processing video... This may take a moment.");
        
        // Store video ID for checking status
        sessionStorage.setItem('storyline_video_id', data.video_id);
        
        // Step 3: Check video status periodically
        checkVideoStatus(data.video_id);
    } else {
        throw new Error("Failed to create video");
    }
})
.catch(error => {
    console.error("Error:", error);
    player.SetVar("LoadingMessage", "Sorry, there was an error generating your video. Please try again.");
});
}

window.Script3 = function()
{
  var player = GetPlayer();
var videoURL = player.GetVar("VideoURL");

console.log("Script3 called, VideoURL:", videoURL);

if (videoURL && videoURL !== "" && videoURL !== null) {
    // Video should already be created by Script2, but create it again if needed
    var existingVideo = document.getElementById('storyline-custom-video');
    if (!existingVideo) {
        console.log("No existing video found, creating new one");
        createVideoElement(videoURL);
    } else {
        console.log("Video already exists on page");
    }
} else {
    console.log("No video URL available, VideoURL:", videoURL);
    
    // Try to get from session storage as backup
    var backupURL = sessionStorage.getItem('storyline_video_url');
    if (backupURL) {
        console.log("Found backup URL in session storage:", backupURL);
        player.SetVar("VideoURL", backupURL);
        createVideoElement(backupURL);
    } else {
        console.log("No backup URL found either");
    }
}
}

// Helper function available globally
function createVideoElement(videoUrl) {
    console.log("Creating video element with URL:", videoUrl);
    
    // Remove any existing video elements
    var existingVideo = document.getElementById('storyline-custom-video');
    if (existingVideo) {
        existingVideo.remove();
    }
    
    // Create video element
    var videoElement = document.createElement('video');
    videoElement.id = 'storyline-custom-video';
    videoElement.width = 640;
    videoElement.height = 360;
    videoElement.controls = true;
    videoElement.autoplay = true;
    videoElement.src = videoUrl;
    videoElement.style.maxWidth = '100%';
    videoElement.style.height = 'auto';
    
    // Create container
    var container = document.createElement('div');
    container.id = 'storyline-video-container';
    container.style.position = 'fixed';
    container.style.top = '50%';
    container.style.left = '50%';
    container.style.transform = 'translate(-50%, -50%)';
    container.style.zIndex = '9999';
    container.style.backgroundColor = 'rgba(0,0,0,0.9)';
    container.style.padding = '20px';
    container.style.borderRadius = '10px';
    container.style.textAlign = 'center';
    
    // Add close button
    var closeButton = document.createElement('button');
    closeButton.innerHTML = '✕ Close';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.background = 'rgba(255,255,255,0.8)';
    closeButton.style.border = 'none';
    closeButton.style.padding = '5px 10px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.borderRadius = '5px';
    closeButton.onclick = function() {
        container.remove();
    };
    
    container.appendChild(closeButton);
    container.appendChild(videoElement);
    document.body.appendChild(container);
    
    console.log("Video element created and added to page");
}

};