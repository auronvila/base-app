import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Cube: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initialCameraPosition = new THREE.Vector3(0, 0, 5); // Initial camera position

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry1 = new THREE.BoxGeometry(1, 1, 1);
    const geometry2 = new THREE.BoxGeometry(1.5, 1.5, 1.5);

    const material1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const material2 = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    const cube1 = new THREE.Mesh(geometry1, material1);
    const cube2 = new THREE.Mesh(geometry2, material2);
    cube2.position.x = 3; // Set position of the second cube

    scene.add(cube1);
    scene.add(cube2);

    camera.position.copy(initialCameraPosition); // Set the initial camera position

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseClick = (event: MouseEvent) => {
      event.preventDefault();

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(scene.children, true);

      for (const intersect of intersects) {
        if (intersect.object === cube2) {
          const targetPosition = cube2.position.clone(); // Get the position of the second cube
          const startPosition = camera.position.clone(); // Get the current camera position
          const duration = 10000; // Transition duration in milliseconds

          let startTime: number | null = null;

          const moveCamera = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;

            if (elapsed >= duration) {
              // Transition complete, set the camera position to the target position
              camera.position.copy(targetPosition);
            } else {
              // Transition still in progress, interpolate the camera position
              const t = elapsed / duration;
              const newPosition = startPosition.lerp(targetPosition, t);
              camera.position.copy(newPosition);

              requestAnimationFrame(moveCamera);
            }

            renderer.render(scene, camera);
          };

          requestAnimationFrame(moveCamera);

          // Add a cube to the updated position
          const newCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
          const newCubeMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
          const newCube = new THREE.Mesh(newCubeGeometry, newCubeMaterial);
          newCube.position.x = 3;
          newCube.position.y = 1;
          newCube.position.z = -3;
          scene.add(newCube);

          newCube.addEventListener('click', handleNewCubeClick); // Attach click event listener to the new cube
          
          break;
        }
      }
    };

    const handleNewCubeClick = () => {
      console.log("--------------------------------------");
    };

    const animate = () => {
      requestAnimationFrame(animate);

      cube1.rotation.x += 0.01;
      cube1.rotation.y += 0.01;

      cube2.rotation.x += 0.01;
      cube2.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    if (canvasRef.current) {
      canvasRef.current.addEventListener('click', handleMouseClick);
    }

    animate();

    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('click', handleMouseClick);
      }
      renderer.dispose();
      geometry1.dispose();
      geometry2.dispose();
      material1.dispose();
      material2.dispose();
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Cube;
