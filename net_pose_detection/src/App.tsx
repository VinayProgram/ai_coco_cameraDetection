import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
import React, { useState, useEffect, useRef } from "react";
import "@tensorflow/tfjs-backend-webgl";

// Register one of the TF.js backends.
const App = () => {
  const [detection, setDetectionModel] = useState<poseDetection.PoseDetector>();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);


  React.useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    await tf.setBackend("webgl");
    await tf.ready();
    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
      enableTracking: true,
      trackerType: poseDetection.TrackerType.BoundingBox,
    };
    const detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      detectorConfig
    );
    setDetectionModel(detector);
  };
  const startPoseDetection = async () => {
    if (navigator.mediaDevices && videoRef.current) {
      // Access the webcam
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.srcObject = stream;

      videoRef.current.onloadeddata = () => {
        detectPose();
      };
    }
  };

  useEffect(() => {
    if (detection && videoRef.current) {
      startPoseDetection();
    }
  }, [detection]);

  // Function to detect poses continuously
  const detectPose = async () => {
    if (videoRef.current && detection && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Resize canvas to video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Perform pose detection
      const poses = await detection.estimatePoses(video);
      ctx?.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

      // Draw pose keypoints on canvas
      poses.forEach((pose:poseDetection.Pose) => {
        drawPose(pose, ctx);
      });

      // Request next frame
      requestAnimationFrame(detectPose);
    }
  };

  // Function to draw pose on the canvas
  const drawPose = (pose:poseDetection.Pose, ctx: CanvasRenderingContext2D | null) => {
    pose.keypoints.forEach((keypoint) => {
      if (keypoint?.score&& keypoint?.score > 0.5 && ctx) {

        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
      }
    });
  };

  return (
    <div>
      <h1>Pose Detection</h1>
      <video ref={videoRef}  autoPlay playsInline style={{position:'absolute'}}/>
      <canvas ref={canvasRef}  style={{ border: "1px solid black",position:'absolute' }} />
    </div>
  );
};

export default App;
