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
window.isCheckingVideo = false;

// Add connection recovery listener
window.addEventListener('online', function() {
    console.log("Connection restored!");
    var videoId = sessionStorage.getItem('storyline_video_id');
    var videoReady = sessionStorage.getItem('storyline_video_url');
    
    if (videoId && !videoReady && window.isCheckingVideo) {
        console.log("Resuming video status check after reconnection");
        var player = GetPlayer();
        player.SetVar("LoadingMessage", "Connection restored. Checking video status...");
        
        // Resume checking with a fresh start
        setTimeout(() => {
            checkVideoStatus(videoId, 0);
        }, 1000);
    }
});

window.addEventListener('offline', function() {
    console.log("Connection lost!");
    if (window.isCheckingVideo) {
        var player = GetPlayer();
        player.SetVar("LoadingMessage", "Connection lost. Will resume when reconnected...");
    }
});

// SCRIPT 1: Username capture and validation
window.Script1 = function()
{
  console.log("Script1 executed - Username capture");
  var player = GetPlayer();
  var username = player.GetVar("userName");

  if (!username || username.trim() === "") {
      alert("Please enter a username first!");
      return;
  }

  sessionStorage.setItem('storyline_username', username.trim());
  console.log("Username captured:", username);
  
  // Jump to next slide
  player.SetVar("JumpToNextSlide", false);
  setTimeout(function() {
      player.SetVar("JumpToNextSlide", true);
  }, 100);
}

// SCRIPT 2: Strategies capture and validation  
window.Script2 = function()
{
  console.log("Script2 executed - Strategies capture");
  var player = GetPlayer();
  var userStrategies = player.GetVar("userStrategies");

  if (!userStrategies || userStrategies.trim() === "") {
      alert("Please enter your phishing detection strategies first!");
      return;
  } 
  
  if (userStrategies.trim().length < 20) {
      alert("Please provide more detailed strategies (at least 20 characters). You entered: " + userStrategies.trim().length + " characters");
      return;
  }

  sessionStorage.setItem('storyline_strategies', userStrategies.trim());
  console.log("Strategies saved:", userStrategies);
  
  // Jump to next slide
  player.SetVar("JumpToNextSlide", false);
  setTimeout(function() {
      player.SetVar("JumpToNextSlide", true);
  }, 100);
}

// SCRIPT 3: Video generation for strategies
window.Script3 = function()
{
  console.log("Script3 executed - Video generation");
  var userStrategies = sessionStorage.getItem('storyline_strategies');
  var player = GetPlayer();

  console.log("Retrieved strategies from sessionStorage:", userStrategies);

  if (!userStrategies) {
      alert("No strategies found. Please go back and enter your strategies.");
      return;
  }

  console.log("Starting video generation for strategies:", userStrategies.substring(0, 100) + "...");
  player.SetVar("LoadingMessage", "Analyzing your strategies and generating feedback video...");
  
  // Mark that we're checking video status
  window.isCheckingVideo = true;

  var apiBase = "https://cyber-security-sage.vercel.app/api";

  function checkVideoStatus(videoId, retryCount = 0) {
      console.log("Checking video status for ID:", videoId, "Retry:", retryCount);
      
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
                  
                  // Mark that we're done checking
                  window.isCheckingVideo = false;
                  
                  setTimeout(() => {
                      console.log("Jumping to next slide with video URL:", data.video_url);
                      player.SetVar("JumpToNextSlide", true);
                  }, 2000);
                  
              } else if (data.status === "failed") {
                  console.log("Video generation failed");
                  player.SetVar("LoadingMessage", "Video generation failed. Please try again.");
                  window.isCheckingVideo = false;
              } else {
                  console.log("Video still processing, checking again in 3 seconds");
                  setTimeout(() => checkVideoStatus(videoId, 0), 3000);
              }
          } else {
              console.error("API returned success: false", data);
              player.SetVar("LoadingMessage", "Error checking video status. Please try again.");
          }
      })
      .catch(error => {
          console.error("Error checking video status:", error);
          
          // Handle connection errors with exponential backoff
          if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
              console.log("Connection error detected, attempting retry...");
              
              if (retryCount < 10) { // Maximum 10 retries
                  var delay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Max 30 seconds
                  player.SetVar("LoadingMessage", "Connection lost. Retrying in " + Math.round(delay/1000) + " seconds...");
                  
                  setTimeout(() => {
                      player.SetVar("LoadingMessage", "Reconnecting... Checking video status.");
                      checkVideoStatus(videoId, retryCount + 1);
                  }, delay);
              } else {
                  player.SetVar("LoadingMessage", "Connection issues persist. Please check your internet and refresh the page.");
              }
          } else {
              player.SetVar("LoadingMessage", "Error checking video status. Please try again.");
          }
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

// SCRIPT 4: Simple test script
window.Script4 = function()
{
  console.log("STORYLINE TRIGGER FIRED!");
  alert("Test - trigger is working!");
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