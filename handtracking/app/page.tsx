"use client"
import { GestureRecognizer, NormalizedLandmark } from '@mediapipe/tasks-vision';
import React, { useState, useCallback, useEffect } from 'react';
import CameraComponent from './logic-componets/camera-component';
import GestureRecognizerComponent from './logic-componets/gesture-recognize-component';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';

const App: React.FC = () => {
  const [gestureRecognizer, setGestureRecognizer] = useState<GestureRecognizer | null>(null);
  const [detectedGesture, setDetectedGesture] = useState<string | null>(null);
  
  const handleFrame = useCallback(
    async (video: HTMLVideoElement) => {
      if (gestureRecognizer) {
        try {
          // Ensure video dimensions are valid
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            const result = await gestureRecognizer.recognizeForVideo(video, performance.now());
            trackMouse(result.landmarks);
            if (result?.gestures?.length) {
              setDetectedGesture(result.gestures[0][0].categoryName);
            }
          } else {
            console.warn("Invalid video frame dimensions.");
          }
        } catch (error) {
          console.error("Gesture recognition error:", error);
        }
      }
    },
    [gestureRecognizer]
  );

  // Assuming you already have the landmarks data
  function trackMouse(landmarks: NormalizedLandmark[][]) {
    // Select the index finger tip (landmark 8)
    const indexFingerTip = landmarks[0]; // The correct index is 8 for index finger tip
    if (!indexFingerTip) return;

    // Normalize coordinates to screen dimensions
    const { innerWidth, innerHeight } = window;
    const x = indexFingerTip[8].x * innerWidth;
    const y = indexFingerTip[8].y * innerHeight;
    // console.log(x, y);

    // Move a custom cursor element to the calculated position
    const cursor = document.getElementById("custom-cursor");
    if (cursor) {
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
    }

    // Check for "Closed_Fist" gesture and trigger click event
    if (detectedGesture == 'Pointing_Up') {
      const elementUnderCursor = document.elementFromPoint(x, y);
      console.log(elementUnderCursor)
      if (elementUnderCursor) {
        const clickEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
        });
        elementUnderCursor.dispatchEvent(clickEvent);
      }
    }
  }

  // Create and add the fake cursor element on component mount
  useEffect(() => {
    const cursorElement = document.createElement("div");
    cursorElement.id = "custom-cursor";
    cursorElement.style.position = "absolute";
    cursorElement.style.width = "10px";
    cursorElement.style.height = "10px";
    cursorElement.style.borderRadius = "50%";
    cursorElement.style.zIndex = '245';
    cursorElement.style.backgroundColor = "red";
    cursorElement.style.pointerEvents = "none"; // Ensure it doesn't interfere with actual mouse events
    document.body.appendChild(cursorElement);

    return () => {
      // Clean up the cursor element when the component is unmounted
      const cursorElement = document.getElementById("custom-cursor");
      if (cursorElement) {
        document.body.removeChild(cursorElement);
      }
    };
  }, []);

  return (
    <div>
      <GestureRecognizerComponent setGestureRecognizer={setGestureRecognizer} />
      {gestureRecognizer && <CameraComponent onFrame={handleFrame} />}
    </div>
  );
};

export default App;
