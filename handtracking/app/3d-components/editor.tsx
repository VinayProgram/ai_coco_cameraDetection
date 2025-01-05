import React, { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useStore } from './store'
import { PerspectiveCamera } from '@react-three/drei'
import { OrbitControls } from '@react-three/drei'
import { Camera, Vector3 } from 'three'

const Editor = () => {
  const { cameraDirection } = useStore()
  const cameraRef = useRef<Camera | null>(null)

  const MIN_DISTANCE = 5 // Minimum distance from the object
  const MAX_DISTANCE = 20 // Maximum distance from the object
  const SMOOTHING = 0.1 // Smoothness factor for camera movement

  const [smoothCameraPos, setSmoothCameraPos] = useState(new Vector3(...cameraDirection))

  // Update camera position based on cameraDirection from handPosition
  useEffect(() => {
    if (cameraRef.current) {
      // Create a Vector3 to represent the camera position
      const cameraPos = new Vector3(...cameraDirection)

      // Get the direction vector from the camera to the origin (or object position)
      const direction = cameraPos.clone().normalize()

      // Calculate the new position by scaling the direction with the desired distance
      const distance = Math.max(MIN_DISTANCE, Math.min(cameraPos.length(), MAX_DISTANCE))
      const newPos = direction.multiplyScalar(distance)

      // Smoothly interpolate the camera position
      setSmoothCameraPos((prevPos) => {
        const smoothedPos = new Vector3().lerpVectors(prevPos, newPos, SMOOTHING)
        return smoothedPos
      })
    }
  }, [cameraDirection])

  useEffect(() => {
    if (cameraRef.current) {
      // Apply the smoothed camera position
      cameraRef.current.position.copy(smoothCameraPos)
    }
  }, [smoothCameraPos])

  return (
    <Canvas style={{ position: 'absolute' }}>
      <ambientLight intensity={2} />
      <PerspectiveCamera ref={cameraRef} fov={75} position={smoothCameraPos.toArray()} makeDefault />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={'orange'} />
      </mesh>
      <OrbitControls />
    </Canvas>
  )
}

export default Editor
