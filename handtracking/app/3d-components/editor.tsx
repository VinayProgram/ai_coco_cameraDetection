import React, { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { useStore } from './store'
import { PerspectiveCamera } from '@react-three/drei'
import { OrbitControls } from '@react-three/drei'
import { Camera, Vector3 } from 'three'

const Editor = () => {
  const { cameraDirection } = useStore()
  const cameraRef = useRef<Camera | null>(null)

  const MIN_DISTANCE = 15 // Minimum distance from the object
  const MAX_DISTANCE = 20 // Maximum distance from the object

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

      // Set the camera position to the new position
      cameraRef.current.position.copy(newPos)
    }
  }, [cameraDirection])

  return (
    <Canvas style={{ position: 'absolute' }}>
      <ambientLight intensity={2} />
      <PerspectiveCamera ref={cameraRef} fov={75} position={cameraDirection} makeDefault />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={'orange'} />
      </mesh>
      <OrbitControls />
    </Canvas>
  )
}

export default Editor
