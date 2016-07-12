/**
 * Created by finnb on 7/2/16.
 */

var Game = {fps:60, width:1080, height:720};

var frames = 0;

//this is a loop
Game.run = (function() {
    var loops = 0;
    var skipTicks = 1000 / Game.fps;
    //maxFrameSkip = 10,
    var nextGameTick = (new Date).getTime();
    //lastGameTick;

    return function() {
        loops = 0;
        //loops = 0 is the only one necessary if FPS does not fluctuate

        while ((new Date).getTime() > nextGameTick) {
            Game.update();
            nextGameTick += skipTicks;
            loops++;
        }

        if (!loops) {
            Game.draw((nextGameTick - (new Date).getTime()) / skipTicks); //Pass in elapsed time to be used later.
        } else {
            Game.draw(0);
        }
    };
})();

Game.init = function() {
    // SCENE
    this.scene = new THREE.Scene();
    // CAMERA
    //var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 45;
    var ASPECT = this.width / this.height;
    var NEAR = 0.1;
    var FAR = 20000;
    this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    this.scene.add(this.camera);
    this.camera.position.set(0,500,0);
    this.camera.lookAt(this.scene.position);
    // RENDERER
    if ( Detector.webgl ) {
        this.renderer = new THREE.WebGLRenderer({antialias: true});
    }
    else {
        alert("Using Canvas Renderer");
        this.renderer = new THREE.CanvasRenderer();
    }
    this.renderer.setSize(this.width, this.height);
    this.container = document.getElementById( 'game' );
    this.container.appendChild( this.renderer.domElement );
    // EVENTS
    //THREEx.WindowResize(renderer, camera);
    //THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
    // CONTROLS
    //controls = new THREE.OrbitControls( camera, renderer.domElement );
    // LIGHT
    var light = new THREE.PointLight(0xffffff);
    light.position.set(0,250,0);
    this.scene.add(light);
    // FLOOR
    var floorTexture = new THREE.ImageUtils.loadTexture( "../public/images/crate.gif" );
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set( 10, 10 );
    var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
    var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.5;
    floor.rotation.x = Math.PI / 2;
    this.scene.add(floor);
    //Model Test
    var manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {

        console.log( item, loaded, total );

    };

    loadObj(manager, "../public/models/test_obj.obj", function(object) {
        object.scale.x = 10;
        object.scale.y = 10;
        object.scale.z = 10;

        Game.scene.add(object);
        Game.person = object; //Test
    });

    // SKYBOX/FOG
    var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
    var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
    var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
    // scene.add(skyBox);
    this.scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );

    // Using wireframe materials to illustrate shape details.
    var darkMaterial = new THREE.MeshBasicMaterial( { color: 0xffffcc } );
    var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, transparent: true } );
    var multiMaterial = [ darkMaterial, wireframeMaterial ];

    this.shapes = [];


    // cube
    this.shapes[0] = THREE.SceneUtils.createMultiMaterialObject(
        new THREE.CubeGeometry(50, 50, 50, 1, 1, 1),
        multiMaterial );
    this.shapes[0].position.set(-200, 50, 0);
    this.scene.add( this.shapes[0] );

    // icosahedron
    this.shapes[1] = THREE.SceneUtils.createMultiMaterialObject(
        new THREE.IcosahedronGeometry( 40, 0 ), // radius, subdivisions
        multiMaterial );
    this.shapes[1].position.set(-100, 50, 0);
    this.scene.add( this.shapes[1] );

    // octahedron
    this.shapes[2] = THREE.SceneUtils.createMultiMaterialObject(
        new THREE.OctahedronGeometry( 40, 0 ),
        multiMaterial );
    this.shapes[2].position.set(0, 50, 0);
    this.scene.add( this.shapes[2] );

    // tetrahedron
    this.shapes[3] = THREE.SceneUtils.createMultiMaterialObject(
        new THREE.TetrahedronGeometry( 40, 0 ),
        multiMaterial );
    this.shapes[3].position.set(100, 50, 0);
    this.scene.add( this.shapes[3] );

    // sphere
    this.shapes[4] = THREE.SceneUtils.createMultiMaterialObject(
        new THREE.SphereGeometry( 40, 32, 16 ),
        multiMaterial );
    this.shapes[4].position.set(200, 50, 0);
    this.scene.add( this.shapes[4] );


};

var px = 0;
var pv = -1;
var pys = [0, 0, 0, 0, 0];
var pyvs = [1, -1, 1, -1 ,1];

Game.update = function() {
    if (this.person != null) {
        if (px < -250)
        {
            pv = 1;
        }
        if (px > 100)
        {
            pv = -1
        }
        px += pv;
        this.person.position.x = px;
    }
    for (var i = 0; i < 5; i += 1)
    {
        if (pys[i] < -50)
        {
            pyvs[i] = 1;
        }
        if (pys[i] > 50)
        {
            pyvs[i] = -1
        }
        pys[i] += pyvs[i];
        this.shapes[i].position.z = pys[i];
    }
};

Game.draw = function() {
    this.renderer.render( this.scene, this.camera );
};