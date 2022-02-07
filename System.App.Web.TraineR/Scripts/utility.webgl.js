function initStats(stats_id) {

    if (!stats_id)
    {
        stats_id = "Stats-output";
    }

    var stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms

    // Align top-left
    stats.domElement.style.position = 'relatve'; // 'absolute'
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    $("#"+stats_id).append(stats.domElement);

    return stats;
}

function urlExists(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status != 404;
}

function open3DModel(canvas_id, stats_id, pwd, obj_file, mtl_file, obj2_file) {
    
    /*********** Add stats widgets ************/
    var stats = initStats(stats_id);

    /*********** Create scene, camera, renderer *******/
    // create a scene, that will hold all our elements such as objects, cameras and lights.
    var scene = new THREE.Scene();

    // create a camera, which defines where we're looking at.
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 10000);

    // WebGLRendererだとリッチな処理になります。CanvasRendererは雑な処理になります。
    var renderer;
    var webGLRenderer = new THREE.WebGLRenderer();
    var bkgColor = "#000000";
    webGLRenderer.setClearColor(bkgColor, 1.0);
    webGLRenderer.setSize(window.innerWidth, window.innerHeight);
    renderer = webGLRenderer;
    $("#" + canvas_id).append(renderer.domElement);

    /************* Create camera control  **************/
    var cameraControl = new THREE.OrbitControls(camera, renderer.domElement); //TrackballControls has a defect: cannot rotate/pan after setting target
    cameraControl.addEventListener('change', onCameraControlChange);
    function onCameraControlChange() {
        // console.log(camera.position); // record camera's real-time position
    }
    scene.add(camera);

    /**************  Parameters in the Gui Menu  ***************/
    var parameters;

    /*************  Add Materials ***************/
    // add materials
    var meshBasicMaterial = new THREE.MeshBasicMaterial({
        color: 0x7777ff,
        visible: true,
        transparent: true,
        opacity: 0.3,
        wireframeLinewidth: 1,
        wireframe: true,
        side: THREE.FrontSide,
    });
    var meshLambertMaterial = new THREE.MeshLambertMaterial({
        color: 0x777777,
        visible: true,
        transparent: true,
        opacity: 0.9,
        emissive: 0x000000,
        side: THREE.FrontSide
    });
    var meshPhongMaterial = new THREE.MeshPhongMaterial({
        color: 0x777777,
        visible: true,
        transparent: true,
        opacity: 0.9,
        emissive: 0x000000,
        specular: 0xffffff, //color of reflection. If this is set to the same color as the color property, you will get a more metallic-looking material. If this is set to grey, the material will become more plastic-looking.
        shininess: 30,
        side: THREE.FrontSide,
    });

    /************* Add Lights ***************/
    // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight("#ffffff", 0.0);
    scene.add(ambientLight);

    // add spotlight for the shadows
    var spotLight = new THREE.SpotLight("#ffffff", 1.0, 10000, Math.PI); // SpotLight
    spotLight.castShadow = true;
    scene.add(spotLight);
    camera.add(spotLight.target);

    /************* Load Model **************/
    var mesh, mesh2;
    var bbox, bbox2; // object bounding box

    var onLoad = function (geometry) {
        mesh = geometry;
        scene.add(mesh);

        // get bounding box
        bbox = new THREE.Box3().setFromObject(mesh);
        //console.log(bbox); console.log(bbox.center()); console.log(bbox.size());

        //var axes = new THREE.AxisHelper(Math.max(bbox.size().z, bbox.size().y, bbox.size().x));
        //scene.add(axes);

        // TODO: blockUI
        initCamera();
        initLights();
        initMenu();
        render();
    };
    var onLoad2ndObj = function (geometry) {
        mesh2 = geometry;
        scene.add(mesh2);

        // get bounding box
        bbox2 = new THREE.Box3().setFromObject(mesh2);
        // console.log(bbox2); console.log(bbox2.center()); console.log(bbox2.size());

        // adjust object positions
        initObjPositionForComparison();
    };
    var onLoadProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };
    var onLoadError = function (xhr) {
        console.log("Error loading OBJ file.");
    };

    var objLoader = new THREE.OBJLoader();
    objLoader.setPath(pwd);
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath(pwd);

    if (!mtl_file) { // load OBJ only
        objLoader.load(obj_file, onLoad, onLoadProgress, onLoadError);
    }
    else { // load OBJ + MTL
        mtlLoader.load(mtl_file, function (materials) {
            materials.preload();
            objLoader.setMaterials(materials);
            objLoader.load(obj_file, onLoad, onLoadProgress, onLoadError);
        });
    }

    //
    // load the 2nd OBJ file
    if (obj2_file) {
        objLoader.load(obj2_file, onLoad2ndObj(), onLoadProgress, onLoadError);
    }

    /**************   Place Camera   **************/
    /*
    // look down along the z axis
    function initCamera(){
        var fov, distance;
        if(bbox.size().x > bbox.size().y) {
            fov = camera.fov * (Math.PI/180);
            distance = Math.abs(bbox.size().x/2/Math.tan(fov/2));
        }
        else {
            fov = camera.fov * (Math.PI/180)/camera.aspect;
            distance = Math.abs(bbox.size().y/2/Math.tan(fov/2));
        }
        camera.position.set(bbox.center().x, bbox.center().y, bbox.max.z + distance);
        cameraControl.target.copy(bbox.center()); //THREE.TrackballControls seems to override the camera.lookAt function
    };
    */

    // look forward along the y axis
    function initCamera() {
        var fov, distance;
        if (bbox.size().x > bbox.size().z) {
            fov = camera.fov * (Math.PI / 180);
            distance = Math.abs(bbox.size().x / 2 / Math.tan(fov / 2));
        }
        else {
            fov = camera.fov * (Math.PI / 180) / camera.aspect;
            distance = Math.abs(bbox.size().z / 2 / Math.tan(fov / 2));
        }
        camera.position.set(bbox.center().x, bbox.min.y - distance / 2, bbox.center().z);
        cameraControl.target.copy(bbox.center()); //THREE.TrackballControls seems to override the camera.lookAt function
    };

    /**************** Adjust OBJ positions for comparison mode **********/
    function initObjPositionForComparison() {
        if (mesh && mesh2) {
            var interval = (bbox.size().y + bbox2.size().y) * 1.2;
            mesh.translateY(-interval / 2);
            mesh2.translateY(interval / 2);
        }
    };

    /*************  Add Lights ***************/
    function initLights() {
        spotLight.target.position.set(bbox.center());
        spotLight.position.copy(camera.position);
    }

    /************  Add control menu **********/
    function initMenu() {
        parameters = new function () {
            // toggle full screen mode
            this.切换全屏模式 = function () {
                toggleFullScreen();
            }

            // control actors
            this.旋转速度 = 0.00001;

            // control renderer background color
            this.背景色 = bkgColor;

            // control camera
            this.视角重置 = function () {
                initCamera();
            };

            // control ambient light
            this.氛围光颜色 = ambientLight.color.getStyle();
            this.氛围光强度 = ambientLight.intensity;

            // control spot light
            this.聚光灯强度 = spotLight.intensity;
            this.聚光灯颜色 = spotLight.color.getStyle();
            this.视角跟随 = true;

            // control mesh material type
            this.材质类型 = "默认";

            // control MeshBasicMaterial
            this.线框不透明度 = meshBasicMaterial.opacity;
            this.线框颜色 = meshBasicMaterial.color.getStyle();

            // control meshLambertMaterial
            this.朗伯材质不透明度 = meshLambertMaterial.opacity;
            this.朗伯材质颜色 = meshLambertMaterial.color.getStyle();

            // control meshPhongMaterial
            this.材质不透明度 = meshPhongMaterial.opacity;
            this.镜面反射光颜色 = meshPhongMaterial.specular.getStyle();
            this.材质亮度 = meshPhongMaterial.shininess;
            this.材质颜色 = meshPhongMaterial.color.getStyle();

            // control mesh texture
            this.纹理贴图 = "无";
        };

        // construct the control menu
        var gui = new dat.GUI();
        gui.add(parameters, '切换全屏模式');
        gui.add(parameters, '旋转速度', 0, 0.1);
        gui.addColor(parameters, "背景色").onChange(function (e) {
            renderer.setClearColor(e);
        });

        gui.add(parameters, '视角重置');

        var lightGui = gui.addFolder("光照调节");
        var ambientLightGui = lightGui.addFolder("氛围光");
        ambientLightGui.addColor(parameters, '氛围光颜色').onChange(function (e) {
            ambientLight.color.setStyle(e);
        });
        ambientLightGui.add(parameters, '氛围光强度', 0, 2).onChange(function (e) {
            ambientLight.intensity = e;
        });
        var spotLightGui = lightGui.addFolder("聚光灯");
        spotLightGui.addColor(parameters, '聚光灯颜色').onChange(function (e) {
            spotLight.color.setStyle(e);
        });
        spotLightGui.add(parameters, '聚光灯强度', 0, 5).onChange(function (e) {
            spotLight.intensity = e;
        });
        spotLightGui.add(parameters, '视角跟随');

        gui.add(parameters, '材质类型', ["默认", "线框(WireFrame)", "朗伯(Lambert)", "高反光(Phong)"]).onChange(function (e) {
            var material;
            $(wireframeGui.domElement).attr("hidden", true);
            $(lambertGui.domElement).attr("hidden", true);
            $(phongGui.domElement).attr("hidden", true);
            $("span:contains('纹理贴图')").parent().parent().attr("hidden", true);
            switch (e) {
                case "默认":
                    // MTL loaded material is an "array of materials". Currently no way to reapply the MTL materials is found.
                    // Alternative solution: reload page to restore the default MTL materials
                    location.reload(false); // the parameter is a boolean indicating whether to bypass the cache or not.
                    return;
                case "线框(WireFrame)":
                    material = meshBasicMaterial;
                    $(wireframeGui.domElement).attr("hidden", false);
                    break;
                case "朗伯(Lambert)":
                    material = meshLambertMaterial;
                    $(lambertGui.domElement).attr("hidden", false);
                    $("span:contains('纹理贴图')").parent().parent().attr("hidden", false);
                    break;
                case "高反光(Phong)":
                    material = meshPhongMaterial;
                    $(phongGui.domElement).attr("hidden", false);
                    $("span:contains('纹理贴图')").parent().parent().attr("hidden", false);
                    break;
            }

            mesh.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material = material;
                }
            });
            if (mesh2) {
                mesh2.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        child.material = material;
                    }
                });
            }
        });

        var wireframeGui = gui.addFolder("线框(WireFrame)材质参数调节");
        wireframeGui.add(parameters, '线框不透明度', 0, 1).onChange(function (e) {
            meshBasicMaterial.opacity = e
        });
        wireframeGui.addColor(parameters, '线框颜色').onChange(function (e) {
            meshBasicMaterial.color.setStyle(e);
        });
        var lambertGui = gui.addFolder("朗伯(Lambert)材质参数调节");
        lambertGui.add(parameters, '朗伯材质不透明度', 0, 1).onChange(function (e) {
            meshLambertMaterial.opacity = e;
        });
        lambertGui.addColor(parameters, '朗伯材质颜色').onChange(function (e) {
            meshLambertMaterial.color.setStyle(e);
        });
        var phongGui = gui.addFolder("高反光(Phong)材质参数调节");
        phongGui.add(parameters, '材质不透明度', 0, 1).onChange(function (e) {
            meshPhongMaterial.opacity = e;
        });
        phongGui.addColor(parameters, '镜面反射光颜色').onChange(function (e) {
            meshPhongMaterial.specular = new THREE.Color(e);
        });
        phongGui.add(parameters, '材质亮度', 0, 200).onChange(function (e) {
            meshPhongMaterial.shininess = e;
        });
        phongGui.addColor(parameters, '材质颜色').onChange(function (e) {
            meshPhongMaterial.color.setStyle(e)
        });

        gui.add(parameters, '纹理贴图', ["无", "预设1", "预设2", "预设3"]).onChange(function (e) {
            var texture;
            switch (e) {
                case "无":
                    texture = null;
                    break;
                case "预设1":
                    texture = THREE.ImageUtils.loadTexture("data/" + "floor-wood.jpg");
                    break;
                case "预设2":
                    texture = THREE.ImageUtils.loadTexture("data/" + "weave.jpg");
                    break;
                case "预设3":
                    texture = THREE.ImageUtils.loadTexture("data/" + "wood-2.jpg");
                    break;
            }
            meshBasicMaterial.map = texture;
            meshBasicMaterial.needsUpdate = true;
            meshLambertMaterial.map = texture;
            meshLambertMaterial.needsUpdate = true;
            meshPhongMaterial.map = texture;
            meshPhongMaterial.needsUpdate = true;
        });

        // initialize some UI elements
        $(wireframeGui.domElement).attr("hidden", true);
        $(lambertGui.domElement).attr("hidden", true);
        $(phongGui.domElement).attr("hidden", true);
        $("span:contains('纹理贴图')").parent().parent().attr("hidden", true);
    }

    /**************   resize() event  ************/
    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /**************  render() function  *************/
    function render() {
        stats.update();

        // rotate the object around its axes
        if (mesh && parameters.旋转速度 > 0) {
            mesh.rotation.z += parameters.旋转速度;
        }
        if (mesh2 && parameters.旋转速度 > 0) {
            mesh2.rotation.z += parameters.旋转速度;
        }

        if (parameters.视角跟随) {
            initLights();
        }

        // render using requestAnimationFrame
        requestAnimationFrame(render);
        cameraControl.update();
        renderer.render(scene, camera);
    }
}

// toggle full screen mode
function toggleFullScreen() {
    if ((document.fullScreenElement && document.fullScreenElement !== null) ||
            (!document.mozFullScreen && !document.webkitIsFullScreen)) {
        if (document.documentElement.requestFullScreen) {
            document.documentElement.requestFullScreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullScreen) {
            document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }
}