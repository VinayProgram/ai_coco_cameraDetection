/* eslint-disable @typescript-eslint/no-explicit-any */
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import React from 'react';

const App = () => {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [model, setModel] = React.useState<any>(null);
  const [predictions, setPredictions] = React.useState<any[]>([]); // Store predictions in state

  const enableCam = async () => {
    if (!videoRef.current) {
      return;
    }

    // Load the COCO-SSD model
    const loadedModel = await cocoSsd.load();
    setModel(loadedModel);

    // Set up webcam stream
    const constraints = { video: true };
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    });
  };

  const detectObjects = async () => {
    if (model && videoRef.current) {
      // Perform object detection on the current video frame
      const predictions = await model.detect(videoRef.current);
      
      // Only update state if there are predictions
      if (predictions.length > 0) {
        setPredictions(predictions);
      }
    }
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      detectObjects();
    }, 100);

    // Clean up interval when the component is unmounted
    return () => clearInterval(interval);
  }, [model]);

  return (
    <div>
      <section id="demos" className="invisible">
        <p>
          Hold some objects up close to your webcam to get a real-time
          classification! When ready, click "Enable Webcam" below and accept
          access to the webcam when the browser asks (check the top left of your
          window).
        </p>

        <div id="liveView" className="webcam">
          <button id="webcamButton" onClick={enableCam}>
            Enable Webcam
          </button>
          <video ref={videoRef} id="webcam" autoPlay  />
          
          {/* Render bounding boxes and labels */}
          {predictions.map((prediction, index) => (
            prediction.score > 0.66 ? (
              <div key={index} style={{ position: 'absolute', left: prediction.bbox[0], top: prediction.bbox[1], width: prediction.bbox[2], height: prediction.bbox[3] }}>
                <div
                  className="highlighter"
                  style={{
                    position: 'absolute',
                    left: prediction.bbox[0],
                    top: prediction.bbox[1],
                    width: prediction.bbox[2],
                    height: prediction.bbox[3],
                    border: '2px solid red',
                    pointerEvents: 'none',
                  }}
                />
                <p
                  style={{
                    position: 'absolute',
                    left: prediction.bbox[0],
                    top: prediction.bbox[1] - 10,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    padding: '2px 5px',
                    fontSize: '12px',
                    pointerEvents: 'none',
                  }}
                >
                  {prediction.class} - {Math.round(prediction.score * 100)}% confidence
                </p>
              </div>
            ) : null
          ))}
        </div>
      </section>
    </div>
  );
};

export default App;
