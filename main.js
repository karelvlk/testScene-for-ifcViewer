
import AppScene from './appScene.js'

function start() {
    let isOrbit = false
    let scene = new AppScene()
    console.log('sceneCreated!')
    let cube = createCube()
    let tControls = createTControls(scene, cube)
    scene.addToScene(cube)
    scene.addToScene(tControls)

    let arr = []

    let colorArray = [new THREE.Color( 0xFF0000 ), new THREE.Color( 0xF1948A) , new THREE.Color( 0x00FF00 ), new THREE.Color( 0xA9DFBF ), new THREE.Color( 0x0000FF ), new THREE.Color( 0x85C1E9 )]
    let normalArray = [new THREE.Vector3(1,0,0,0), new THREE.Vector3(-1,0,0,0), new THREE.Vector3(0,1,0,0), new THREE.Vector3(0,-1,0,0), new THREE.Vector3(0,0,1,0), new THREE.Vector3(0,0,-1,0)]
    for(let i = 0; i < cube.faceCenters.length; i++) {
        let {mesh, line} = createFaceObjs(cube.faceCenters[i], colorArray[i], normalArray[i])
        scene.addToScene(mesh)
        scene.addToScene(line)
        arr.push({origin: mesh, normal: line})
    }

    startTControlsListener(tControls, cube, arr, normalArray)

    document.addEventListener('keypress', event => {
        if (event.key == 'q') {
            console.log('cube', cube, arr)
        }
        if (event.key == 'w') {
            console.log('cube', cube, arr)
        }
        if (event.key == 'a') {
            console.log('cube', cube, arr)
        }
        if (event.key == 's') {
            console.log('cube', cube, arr)
        }
        if (event.key == 'z') {
            console.log('cube', cube, arr)
        }
        if (event.key == 'x') {
            console.log('cube', cube, arr)
        }

        if (event.key == 'o') {
            isOrbit = !isOrbit
            if (isOrbit) {
                scene.setOrbitEnabled()
            } else {
                scene.setOrbitDisabled()
            }
        }

    });
}

function getRotationMatrix3(eulerRot) {
    let eulerMatrix = new THREE.Matrix4()
    eulerMatrix.makeRotationFromEuler( eulerRot )
    let m3 = new THREE.Matrix3()
    m3.set(
        eulerMatrix.elements[0], eulerMatrix.elements[4], eulerMatrix.elements[8],
        eulerMatrix.elements[1], eulerMatrix.elements[5], eulerMatrix.elements[9],
        eulerMatrix.elements[2], eulerMatrix.elements[6], eulerMatrix.elements[10],
    )
    return eulerMatrix
}

function processRotation(cube, arr, normalArray) {
    let cubeCenter = new THREE.Vector3(0,0,0,0)
    let rotation = cube.rotation
    console.log('>>> rotation', rotation)
    for(let i = 0; i < cube.faceCenters.length; i++) {
        let defaultCenter = cube.faceCenters[i].clone()
        let defaultNormal = normalArray[i].clone()
        let rm = getRotationMatrix3(rotation)
        let center = defaultCenter.applyMatrix4( rm );
        arr[i].origin.position.set(center.x, center.y, center.z)
        let normal = center.clone().sub(cubeCenter.clone())

        console.log('~~', arr[i].normal)

        console.log('>>>', arr[i].normal.geometry.attributes.position)
        arr[i].normal.geometry.attributes.position.needsUpdate = true;
        arr[i].normal.geometry.attributes.position[0] = center.x
        arr[i].normal.geometry.attributes.position[1] = center.y
        arr[i].normal.geometry.attributes.position[2] = center.z
        arr[i].normal.geometry.attributes.position[3] = normal.x + center.x
        arr[i].normal.geometry.attributes.position[4] = normal.y + center.y
        arr[i].normal.geometry.attributes.position[5] = normal.z + center.z
        arr[i].normal.geometry.attributes.position.needsUpdate = true;
        console.log('>>>', arr[i].normal.geometry.attributes.position)



        console.log('arr[i].normal',  arr[i].normal)

    }
}

function startTControlsListener( tControls, cube, arr, normalArray ) {
    let currentRotation = new THREE.Vector3(0,0,0)
    tControls.addEventListener('change', (event) => {
        console.log('>>>', event)
        console.log(tControls, cube)
        if (cube.rotation.x !== currentRotation.x || cube.rotation.y !== currentRotation.y || cube.rotation.z !== currentRotation.z) {
            processRotation(cube, arr, normalArray)
            currentRotation = cube.rotation.clone()
        }

        console.log('>>>')
    })
}

function createTControls(scene, cube) {
    let tControls = new THREE.TransformControls(scene.getCamera(), scene.getRenderer().domElement);
    tControls.setSpace('local');
    tControls.showX = true
    tControls.showY = true
    tControls.showZ = true
    tControls.setMode('rotate')
    tControls.attach(cube)
    return tControls
}

function createFaceObjs(pos, color, normal) {
    let lineGeometry = new THREE.BufferGeometry().setFromPoints( [pos, normal.multiplyScalar(5)] );
    let line = new THREE.Line( lineGeometry, new THREE.LineBasicMaterial({color: color}) );

    let boxGeom = new THREE.BoxGeometry( 0.2, 0.2, 0.2 )
    let mesh = new THREE.Mesh( boxGeom, new THREE.MeshBasicMaterial( { color: color } ))
    mesh.position.set(pos.x, pos.y, pos.z)

    console.log('line', line)

    return {mesh: mesh, line: line}
}

function createCube() {
    let boxGeom = new THREE.BoxGeometry( 3, 3, 3 )
    let edges = new THREE.EdgesGeometry( boxGeom );
    let mesh = new THREE.Mesh( boxGeom, new THREE.MeshBasicMaterial( { color: 0xFFFFFF, transparent: true, opacity: 0.1 } ) );
    let egdesMesh = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000}))
    mesh.add(egdesMesh)
    mesh.boundingBox = new THREE.Box3().setFromObject(mesh);
    let bbox = mesh.boundingBox
    let bboxX1 = new THREE.Vector4(bbox.max.x, (bbox.min.y + bbox.max.y)/2, (bbox.max.z + bbox.min.z)/2)
    let bboxX0 = new THREE.Vector4(bbox.min.x, (bbox.min.y + bbox.max.y)/2, (bbox.max.z + bbox.min.z)/2)
    let bboxZ1 = new THREE.Vector4((bbox.max.x + bbox.min.x)/2, (bbox.min.y + bbox.max.y)/2, bbox.max.z)
    let bboxZ0 = new THREE.Vector4((bbox.max.x + bbox.min.x)/2, (bbox.min.y + bbox.max.y)/2, bbox.min.z)
    let bboxY1 = new THREE.Vector4((bbox.max.x + bbox.min.x)/2, bbox.max.y, (bbox.max.z + bbox.min.z)/2)
    let bboxY0 = new THREE.Vector4((bbox.max.x + bbox.min.x)/2, bbox.min.y, (bbox.max.z + bbox.min.z)/2)
    mesh.faceCenters = [bboxX1, bboxX0, bboxY1, bboxY0, bboxZ1, bboxZ0]
    console.log('mesh.faceCenters', mesh.faceCenters)
    return mesh
}

start()