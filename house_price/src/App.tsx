import * as tf from '@tensorflow/tfjs-core';
import * as tfjs from '@tensorflow/tfjs';
import React, { useState, useEffect } from 'react';

// Example vegetable data and prices (weight in grams, price in dollars)
const vegetableData = [200, 400, 600, 800, 1000, 1200, 1500, 1800, 2200, 2500];
const vegetablePrices = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]; 

const App = () => {
  const [model, setModel] = useState<tfjs.Sequential | null>(null); // Model state
  const [weight, setWeight] = useState<string>(''); // User input for weight
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null); // Predicted price
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  
  // Load and train the model
  const loadModel = async () => {
    const model = tfjs.sequential();
    model.add(tfjs.layers.dense({ inputShape: [1], units: 1 }));

    model.compile({
      optimizer: tf.train.sgd(0.01),
      loss: 'meanAbsoluteError',
    });

    const data = tf.tensor2d(vegetableData, [vegetableData.length, 1]);
    const answers = tf.tensor2d(vegetablePrices, [vegetablePrices.length, 1]);

    // Train the model
    await model.fit(data, answers, {
      epochs: 50,
      batchSize: 8,
      shuffle: true,
      validationSplit: 0.1,
    });

    setModel(model); // Save the trained model in state
  };

  // Handle form input change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(event.target.value);
  };

  // Handle form submission to make predictions
  const handleSubmit = async () => {
    if (!weight || !model) return; // Return if weight is not provided or model is not loaded
    setLoading(true); // Start loading
    const inputTensor = tfjs.tensor1d([parseFloat(weight)]); // Convert weight input to tensor
    const prediction = model.predict(inputTensor) as tf.Tensor; // Get prediction
    const predictedValue = prediction.dataSync()[0]; // Extract value from tensor

    setPredictedPrice(predictedValue); // Update predicted price
    setLoading(false); // Stop loading
  };

  // Load the model when the component mounts
  useEffect(() => {
    loadModel();
  }, []);

  return (
    <div className="App">
      <h1>Vegetable Price Prediction</h1>
      
      {/* Input field for weight */}
      <div>
        <label htmlFor="weight">Enter Vegetable Weight (grams): </label>
        <input
          type="number"
          id="weight"
          value={weight}
          onChange={handleChange}
        />
      </div>

      {/* Button to trigger prediction */}
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Predicting...' : 'Predict Price'}
      </button>

      {/* Display predicted price */}
      {predictedPrice !== null && (
        <div>
          <h3>Predicted Price: ${predictedPrice.toFixed(2)}</h3>
        </div>
      )}
    </div>
  );
}

export default App;
