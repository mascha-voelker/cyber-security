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
  // Add this as Script4 (after your existing scripts)
window.Script4 = function()
{
  var player = GetPlayer();
  var username = player.GetVar("userName");

  if (!username || username.trim() === "") {
      alert("Please enter a username first!");
      return;
  }

  sessionStorage.setItem('storyline_username', username.trim());
  console.log("Username captured:", username);
  
  player.SetVar("JumpToNextSlide", false);
  setTimeout(function() {
      player.SetVar("JumpToNextSlide", true);
  }, 100);
}
}

window.Script2 = function()
{
  // SCRIPT 1: Strategies validation and capture
window.Script1 = function()
{
  var player = GetPlayer();
  var userStrategies = player.GetVar("userStrategies");

  if (!userStrategies || userStrategies.trim() === "") {
      alert("Please enter your phishing detection strategies first!");
  } else if (userStrategies.trim().length < 20) {
      alert("Please provide more detailed strategies (at least 20 characters). You entered: " + userStrategies.trim().length + " characters");
  } else {
      sessionStorage.setItem('storyline_strategies', userStrategies.trim());
      console.log("Strategies saved:", userStrategies);
      
      // Reset variable to trigger slide jump
      player.SetVar("JumpToNextSlide", false);
      setTimeout(function() {
          player.SetVar("JumpToNextSlide", true);
      }, 100);
  }
}
}

window.Script3 = function()
{
  // SCRIPT 2: Strategies video generation
window.Script2 = function()
{
  var userStrategies = sessionStorage.getItem('storyline_strategies');
  var player = GetPlayer();

  console.log("Retrieved strategies from sessionStorage:", userStrategies);
  console.log("API endpoint:", "https://cyber-security-sage.vercel.app/api");

  if (!userStrategies) {
      alert("No strategies found. Please go back and enter your strategies.");
      return;
  }

  console.log("Starting video generation for strategies:", userStrategies.substring(0, 100) + "...");
  player.SetVar("LoadingMessage", "Analyzing your strategies and generating feedback video...");

  var apiBase = "https://cyber-security-sage.vercel.app/api";

  function checkVideoStatus(videoId) {
      console.log("Checking video status for ID:", videoId);
      
      fetch(apiBase + "/get-video?video_id=" + videoId)
      .then(response => response.json())
      .then(data => {
          console.log("Video status response:", data);
          
          if (data.success) {
              console.log("Video status:", data.status);
              
              if (data.status === "completed") {
                  console.log("Video URL received:", data.video_url);
                  sessionStorage.setItem('storyline_video_url', data.video_url);
                  player.SetVar("LoadingMessage", "Video ready! Loading...");
                  player.SetVar("VideoURL", data.video_url);
                  createVideoElement(data.video_url);
                  
                  setTimeout(() => {
                      console.log("Jumping to next slide with video URL:", data.video_url);
                      player.SetVar("JumpToNextSlide", true);
                  }, 2000);
                  
              } else if (data.status === "failed") {
                  console.log("Video generation failed");
                  player.SetVar("LoadingMessage", "Video generation failed. Please try again.");
              } else {
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

  // Step 1: Generate script for strategies
  fetch(apiBase + "/generate-script", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          userStrategies: userStrategies
      })
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          console.log("Script generated successfully");
          player.SetVar("LoadingMessage", "Creating video with AI avatar...");
          
          return fetch(apiBase + "/create-video", {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  script: data.script,
                  userStrategies: userStrategies
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
          sessionStorage.setItem('storyline_video_id', data.video_id);
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
}

window.Script4 = function()
{
  window.Script2 = function()
{
  // Get the strategies from previous slide (CHANGED from username)
var userStrategies = sessionStorage.getItem('storyline_strategies');
var player = GetPlayer();

console.log("Retrieved strategies from sessionStorage:", userStrategies);
console.log("API endpoint:", "https://cyber-security-sage.vercel.app/api");

if (!userStrategies) {  // CHANGED from username
    alert("No strategies found. Please go back and enter your strategies.");
    return;
}

console.log("Starting video generation for strategies:", userStrategies.substring(0, 100) + "...");

// Show loading message
player.SetVar("LoadingMessage", "Analyzing your strategies and generating feedback video...");

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

// Step 1: Generate script (CHANGED the payload)
fetch(apiBase + "/generate-script", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        userStrategies: userStrategies  // CHANGED from username: username
    })
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        console.log("Script generated successfully");
        player.SetVar("LoadingMessage", "Creating video with AI avatar...");
        
        // Step 2: Create video (CHANGED the payload)
        return fetch(apiBase + "/create-video", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                script: data.script,
                userStrategies: userStrategies  // CHANGED from username: username
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
}

window.Script5 = function()
{
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

// Global variables for video management
window.videoPollingInterval = null;
window.currentVideoId = null;

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

// SCRIPT 2: Start Video Generation (Execute when timeline starts on video loading slide)
window.Script2 = function()
{
  // Get the username from previous slide
var username = sessionStorage.getItem('storyline_username');
var player = GetPlayer();

console.log("Retrieved username from sessionStorage:", username);

if (!username) {
    alert("No username found. Please go back and enter a username.");
    return;
}

console.log("Starting video generation for:", username);

// Initialize button states
player.SetVar("VideoButtonText", "Loading Video");
player.SetVar("VideoButtonEnabled", false);
player.SetVar("VideoProgress", 0);
player.SetVar("ShowVideoButton", true);
player.SetVar("ShowContinueButton", true);

// API base URL
var apiBase = "https://cyber-security-sage.vercel.app/api";

// Enhanced function to check video status with progress
function checkVideoStatus(videoId) {
    console.log("Checking video status for ID:", videoId);
    
    fetch(apiBase + "/get-video?video_id=" + videoId)
    .then(response => response.json())
    .then(data => {
        console.log("Video status response:", data);
        
        if (data.success) {
            console.log("Video status:", data.status, "Progress:", data.progress);
            
            // Update progress bar
            var progress = data.progress || 0;
            player.SetVar("VideoProgress", progress);
            
            if (data.status === "completed") {
                // Video is ready!
                console.log("Video URL received:", data.video_url);
                sessionStorage.setItem('storyline_video_url', data.video_url);
                sessionStorage.setItem('storyline_video_ready', 'true');
                
                // Update button to ready state
                player.SetVar("VideoButtonText", "Watch Video");
                player.SetVar("VideoButtonEnabled", true);
                player.SetVar("VideoProgress", 100);
                player.SetVar("VideoURL", data.video_url);
                
                // Stop polling
                if (window.videoPollingInterval) {
                    clearInterval(window.videoPollingInterval);
                    window.videoPollingInterval = null;
                }
                
                console.log("Video ready - button updated");
                
            } else if (data.status === "failed") {
                console.log("Video generation failed");
                player.SetVar("VideoButtonText", "Try Again");
                player.SetVar("VideoButtonEnabled", true);
                player.SetVar("VideoProgress", 0);
                
                // Stop polling
                if (window.videoPollingInterval) {
                    clearInterval(window.videoPollingInterval);
                    window.videoPollingInterval = null;
                }
                
            } else {
                // Still processing - update progress
                var displayText = data.status === "pending" ? "Queued..." : "Loading Video";
                player.SetVar("VideoButtonText", displayText);
            }
        } else {
            console.error("API returned success: false", data);
            player.SetVar("VideoButtonText", "Try Again");
            player.SetVar("VideoButtonEnabled", true);
        }
    })
    .catch(error => {
        console.error("Error checking video status:", error);
        player.SetVar("VideoButtonText", "Try Again");
        player.SetVar("VideoButtonEnabled", true);
    });
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
        
        // Store video ID for checking status
        window.currentVideoId = data.video_id;
        sessionStorage.setItem('storyline_video_id', data.video_id);
        
        // Start polling every 3 seconds
        window.videoPollingInterval = setInterval(() => {
            checkVideoStatus(data.video_id);
        }, 3000);
        
        // Check immediately
        checkVideoStatus(data.video_id);
        
    } else {
        throw new Error("Failed to create video");
    }
})
.catch(error => {
    console.error("Error:", error);
    player.SetVar("VideoButtonText", "Try Again");
    player.SetVar("VideoButtonEnabled", true);
});
}

// Script for when video button is clicked
window.Script3 = function()
{
  var player = GetPlayer();
var videoURL = player.GetVar("VideoURL");
var buttonText = player.GetVar("VideoButtonText");

console.log("Video button clicked, URL:", videoURL, "Button text:", buttonText);

if (buttonText === "Try Again") {
    // Restart the video generation process
    window.Script2();
    return;
}

if (videoURL && videoURL !== "" && videoURL !== null) {
    // Create and show video
    createVideoElement(videoURL);
} else {
    // Try to get from session storage as backup
    var backupURL = sessionStorage.getItem('storyline_video_url');
    if (backupURL) {
        console.log("Found backup URL in session storage:", backupURL);
        player.SetVar("VideoURL", backupURL);
        createVideoElement(backupURL);
    } else {
        console.log("No video URL available");
        alert("Video not ready yet. Please wait a moment and try again.");
    }
}
}

// Script to check video status when returning to course
window.Script4 = function()
{
  var player = GetPlayer();

// Check if we have a video ready from previous session
var videoReady = sessionStorage.getItem('storyline_video_ready');
var videoURL = sessionStorage.getItem('storyline_video_url');
var videoId = sessionStorage.getItem('storyline_video_id');

console.log("Checking previous video status:", {videoReady, videoURL, videoId});

if (videoReady === 'true' && videoURL) {
    // Video was ready, update button immediately
    player.SetVar("VideoButtonText", "Watch Video");
    player.SetVar("VideoButtonEnabled", true);
    player.SetVar("VideoProgress", 100);
    player.SetVar("VideoURL", videoURL);
    player.SetVar("ShowVideoButton", true);
} else if (videoId) {
    // Had a video in progress, check its status
    player.SetVar("VideoButtonText", "Loading Video");
    player.SetVar("VideoButtonEnabled", false);
    player.SetVar("ShowVideoButton", true);
    
    // Start checking status if not already polling
    if (!window.videoPollingInterval) {
        var apiBase = "https://cyber-security-sage.vercel.app/api";
        
        window.videoPollingInterval = setInterval(() => {
            fetch(apiBase + "/get-video?video_id=" + videoId)
            .then(response => response.json())
            .then(data => {
                if (data.success && data.status === "completed") {
                    sessionStorage.setItem('storyline_video_url', data.video_url);
                    sessionStorage.setItem('storyline_video_ready', 'true');
                    
                    player.SetVar("VideoButtonText", "Watch Video");
                    player.SetVar("VideoButtonEnabled", true);
                    player.SetVar("VideoProgress", 100);
                    player.SetVar("VideoURL", data.video_url);
                    
                    clearInterval(window.videoPollingInterval);
                    window.videoPollingInterval = null;
                } else if (data.progress) {
                    player.SetVar("VideoProgress", data.progress);
                }
            })
            .catch(console.error);
        }, 5000); // Check every 5 seconds when returning
    }
} else {
    // No video data, hide button
    player.SetVar("ShowVideoButton", false);
}
}

// Helper function to create video modal
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
    videoElement.width = 800;
    videoElement.height = 450;
    videoElement.controls = true;
    videoElement.autoplay = true;
    videoElement.src = videoUrl;
    videoElement.style.maxWidth = '90vw';
    videoElement.style.maxHeight = '90vh';
    videoElement.style.borderRadius = '10px';
    
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
    container.style.borderRadius = '15px';
    container.style.textAlign = 'center';
    container.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
    
    // Add close button
    var closeButton = document.createElement('button');
    closeButton.innerHTML = '✕ Close';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '15px';
    closeButton.style.background = 'rgba(255,255,255,0.9)';
    closeButton.style.border = 'none';
    closeButton.style.padding = '8px 12px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.borderRadius = '20px';
    closeButton.style.fontWeight = 'bold';
    closeButton.onclick = function() {
        container.remove();
    };
    
    container.appendChild(closeButton);
    container.appendChild(videoElement);
    document.body.appendChild(container);
    
    console.log("Video element created and added to page");
}

// Clean up polling when leaving pages
window.addEventListener('beforeunload', function() {
    if (window.videoPollingInterval) {
        clearInterval(window.videoPollingInterval);
        window.videoPollingInterval = null;
    }
});

};
}

window.Script6 = function()
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

window.Script7 = function()
{
  // SCRIPT 3: Handle Video Button Click (Execute when video button is clicked)
window.Script3 = function()
{
  var player = GetPlayer();
  var videoURL = player.GetVar("VideoURL");
  var buttonText = player.GetVar("VideoButtonText");

  if (buttonText === "Try Again") {
      // Restart the video generation process
      window.Script2();
      return;
  }

  if (videoURL && videoURL !== "" && videoURL !== null) {
      // Create and show video
      createVideoElement(videoURL);
  } else {
      alert("Video not ready yet. Please wait a moment and try again.");
  }
}
}

};
