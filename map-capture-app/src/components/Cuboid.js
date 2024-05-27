// src/components/Cuboid.js
import React, { useEffect, useRef } from 'react';
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';

function Cuboid({ textureUrl }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const engine = new BABYLON.Engine(canvas, true);
        const scene = new BABYLON.Scene(engine);

        const camera = new BABYLON.ArcRotateCamera(
            'camera1',
            Math.PI / 2,
            Math.PI / 2,
            2,
            BABYLON.Vector3.Zero(),
            scene
        );
        camera.attachControl(canvas, true);
        camera.upperRadiusLimit = 5;

        const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0.6;

        const box = BABYLON.MeshBuilder.CreateBox('box', { size: 1 }, scene);
        const material = new BABYLON.StandardMaterial('material', scene);
        material.diffuseTexture = new BABYLON.Texture(textureUrl, scene);
        box.material = material;

        engine.runRenderLoop(() => {
            scene.render();
        });

        // window.addEventListener('resize', () => {
        //     engine.resize();
        // });

        return () => {
            engine.dispose();
        };
    }, [textureUrl]);

    return <canvas ref={canvasRef} style={{ width: '100%', height: '400px' }} />;
}

export default Cuboid;