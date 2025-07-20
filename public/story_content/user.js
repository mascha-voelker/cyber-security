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

// SCRIPT 3: Video display
window.Script3 = function()
{
  var player = GetPlayer();
  var videoURL = player.GetVar("VideoURL");

  console.log("Script3 called, VideoURL:", videoURL);

  if (videoURL && videoURL !== "" && videoURL !== null) {
      var existingVideo = document.getElementById('storyline-custom-video');
      if (!existingVideo) {
          console.log("No existing video found, creating new one");
          createVideoElement(videoURL);
      } else {
          console.log("Video already exists on page");
      }
  } else {
      console.log("No video URL available, VideoURL:", videoURL);
      
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

// Helper function to create video modal
function createVideoElement(videoUrl) {
    console.log("Creating video element with URL:", videoUrl);
    
    var existingVideo = document.getElementById('storyline-custom-video');
    if (existingVideo) {
        existingVideo.remove();
    }
    
    var videoElement = document.createElement('video');
    videoElement.id = 'storyline-custom-video';
    videoElement.width = 640;
    videoElement.height = 360;
    videoElement.controls = true;
    videoElement.autoplay = true;
    videoElement.src = videoUrl;
    videoElement.style.maxWidth = '100%';
    videoElement.style.height = 'auto';
    
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