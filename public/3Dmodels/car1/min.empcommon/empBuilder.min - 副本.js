var scene3D = []
  , scene3DFunction = []
  , debugOutput = !1;
EmpScene = function() {
    this.name = "empscene";
    this.stats = this.grid = this.scene = this.controls = this.camera = this.container = this.renderer = null ;
    this.sceneBoundingBox = new THREE.Box3;
    this.sceneBoundingBox.makeEmpty();
    this.clearColor = 3829413;
    this.clearAlpha = 1;
    this.raycaster = new THREE.Raycaster;
    this.actived = !1;
    this.autoCamClip = !0;
    this.sceneHelpers = null ;
    this.showSelectBoxFlag = !0;
    this.showSkyboxFlag = this.showGridFlag = this.showAxisFlag = !1;
    this.clock = this.mixer = this.skyboxCamera = this.skyboxMesh = this.skyboxTexture = this.skyboxScene = this.box2Helper = this.box1Helper = null ;
    this.group = {};
    this.bindingDomUI = [];
    this.cameras = []
}
;
EmpScene.prototype = {
    constructor: EmpScene,
    findObjectByName: function(a) {
        if (!this.scene)
            return null ;
        for (var b in this.scene.children) {
            var c = this.scene.children[b];
            if (c.name == a)
                return c
        }
        return null
    },
    findObjectByUUID: function(a) {
        if (!this.scene)
            return null ;
        for (var b in this.scene.children) {
            var c = this.scene.children[b];
            if (c.uuid == a)
                return c
        }
        return null
    },
    removeObjectByName: function(a) {
        (a = this.findObjectByName(a)) && a.parent.remove(a)
    },
    addObject: function(a) {
        if (this.findObjectByName(a.name))
            return console.log("addObject, name already exists", a.name),
            null ;
        this.scene.add(a);
        return a
    },
    addHelper: function() {
        var a = new THREE.BoxHelper;
        a.material.depthTest = !1;
        a.material.transparent = !0;
        a.material.opacity = .3;
        a.name = "EMPBOX";
        a.visible = !1;
        this.sceneHelpers.add(a);
        this.box1Helper = a;
        a = new THREE.BoxHelper;
        a.material.depthTest = !0;
        a.material.transparent = !1;
        a.name = "EMPBOX2";
        a.visible = !1;
        this.sceneHelpers.add(a);
        this.box2Helper = a;
        a = new THREE.GridHelper(1E3,10);
        a.name = "EMPGROUND";
        a.visible = !1;
        this.sceneHelpers.add(a);
        a = new THREE.AxisHelper(500);
        a.name = "EMPAXIS";
        a.visible = !1;
        this.sceneHelpers.add(a);
        this.skyboxCamera = new THREE.PerspectiveCamera(70,this.container.offsetWidth / this.container.offsetHeight,1,1E5)
    },
    showAxis: function(a) {
        this.showAxisFlag = a;
        for (var b in this.sceneHelpers.children)
            a = this.sceneHelpers.children[b],
            "EMPAXIS" == a.name && (a.visible = this.showAxisFlag)
    },
    showSelectBox: function(a) {
        if ("undefined" !== typeof empSizeObj && 1 == empSizeObj.builderMode || 1 == debugOutput)
            a = this.findObjectByName(a),
            "undefined" !== typeof a ? (this.box1Helper.visible = this.showSelectBoxFlag,
            this.box1Helper.update(a),
            this.box2Helper.visible = this.showSelectBoxFlag,
            this.box2Helper.update(a)) : (this.box1Helper.visible = !1,
            this.box2Helper.visible = !1)
    },
    showGround: function(a) {
        this.showGridFlag = a;
        for (var b in this.sceneHelpers.children)
            a = this.sceneHelpers.children[b],
            "EMPGROUND" == a.name && (a.visible = this.showGridFlag)
    },
    showSkybox: function(a, b) {
        if (this.showSkyboxFlag = a)
            a = "undefined" !== typeof b ? b : "min.empcommon/emp/c_RT.jpg min.empcommon/emp/c_LF.jpg min.empcommon/emp/c_UP.jpg min.empcommon/emp/c_DN.jpg min.empcommon/emp/c_BK.jpg min.empcommon/emp/c_FR.jpg".split(" "),
            this.skyboxTexture = (new THREE.CubeTextureLoader).load(a),
            this.skyboxTexture.format = THREE.RGBFormat,
            this.skyboxTexture.mapping = THREE.CubeReflectionMapping,
            a = THREE.ShaderLib.cube,
            a = new THREE.ShaderMaterial({
                fragmentShader: a.fragmentShader,
                vertexShader: a.vertexShader,
                uniforms: a.uniforms,
                depthWrite: !1,
                side: THREE.BackSide
            }),
            a.uniforms.tCube.value = this.skyboxTexture,
            null == this.skyboxMesh ? (this.skyboxMesh = new THREE.Mesh(new THREE.BoxGeometry(1E3,1E3,1E3),a),
            this.skyboxScene.add(this.skyboxMesh)) : this.skyboxMesh.material = a;
        null !== this.skyboxMesh && (this.skyboxMesh.visible = this.showSkyboxFlag)
    },
    setClearColor: function(a, b) {
        "undefined" !== typeof a && (this.clearColor = a);
        "undefined" !== typeof b && (this.clearAlpha = b);
        this.renderer.setClearColor(this.clearColor, this.clearAlpha)
    },
    setControlType: function(a) {
        void 0 == a && (a = "orbit");
        "orbit" == a ? this.controls instanceof THREE.OrbitControls || (null !== this.controls && this.controls.dispose(),
        this.controls = new THREE.OrbitControls(this.camera,this.container),
        this.controls.enableDamping = !0,
        this.controls.dampingFactor = .1,
        this.controls.enableZoom = !0,
        this.controls.rotateSpeed = .1) : "fly" == a ? this.controls instanceof THREE.FlyControls || (null !== this.controls && this.controls.dispose(),
        this.controls = new THREE.FlyControls(this.camera,this.container),
        this.controls.movementSpeed = 1E3,
        this.controls.rollSpeed = Math.PI / 24,
        this.controls.autoForward = !1,
        this.controls.dragToLook = !1) : "trackball" == a ? this.controls instanceof THREE.TrackballControls || (null !== this.controls && this.controls.dispose(),
        this.controls = new THREE.TrackballControls(this.camera,this.container)) : "firstperson" != a || this.controls instanceof THREE.FirstPersonControls || (null !== this.controls && this.controls.dispose(),
        this.controls = new THREE.FirstPersonControls(this.camera,this.container),
        this.controls.movementSpeed = 100,
        this.controls.lookSpeed = .1);
        "undefined" !== typeof empSizeObj && 1 == empSizeObj.builderMode && (this.controls.enabled = !1)
    },
    clearScene: function() {
        this.camera.position.set(500, 250, 500);
        this.camera.lookAt(new THREE.Vector3);
        for (var a = this.scene.children; 0 < a.length; )
            this.removeObject(a[0]);
        this.geometries = {};
        this.materials = {};
        this.textures = {};
        this.scripts = {}
    },
    removeHelper: function(a) {},
    removeObject: function(a) {
        if (void 0 !== a.parent) {
            var b = this;
            a.traverse(function(a) {
                b.removeHelper(a)
            });
            a.parent.remove(a)
        }
    },
    getElapsedTime: function() {
        return this.clock ? this.clock.getElapsedTime() : 0
    },
    initScene: function(a, b) {
        function c(a) {
            a.preventDefault();
            var b = new THREE.Vector2
              , c = !!a.touches
              , h = c ? a.touches[0].pageX / EmpGlobalZoom - EmpGlobalLeft - a.currentTarget.offsetLeft : a.offsetX / EmpGlobalZoom
              , c = c ? a.touches[0].pageY / EmpGlobalZoom - EmpGlobalTop - a.currentTarget.offsetTop : a.offsetY / EmpGlobalZoom
              , h = h / a.currentTarget.clientWidth
              , c = c / a.currentTarget.clientHeight;
            b.x = 2 * h - 1;
            b.y = 1 - 2 * c;
            d.raycaster.setFromCamera(b, d.camera);
            b = d.raycaster.intersectObjects(d.scene.children);
            if (0 < b.length && (b = b[0].object) && "Mesh" == b.type)
                if ("mouseup" == a.type || "touchend" == a.type) {
                    if ("function" == typeof scene3DFunction[b.name + "_up"])
                        scene3DFunction[b.name + "_up"]()
                    console.log(b.name + "_up");
                } else if (("mousedown" == a.type || "touchstart" == a.type) && "function" == typeof scene3DFunction[b.name + "_down"])
                    scene3DFunction[b.name + "_down"]()
                    console.log(b.name + "_down");
        }
        this.container = document.getElementById(a);
        if (!this.container)
            return null ;
        this.clock = new THREE.Clock;
        this.scene = new THREE.Scene;
        this.sceneHelpers = new THREE.Scene;
        this.skyboxScene = new THREE.Scene;
        this.addHelper();
        this.camera = new THREE.PerspectiveCamera(50,this.container.offsetWidth / this.container.offsetHeight,.1,1E4);
        this.camera.position.set(500, 250, 500);
        this.camera.lookAt(new THREE.Vector3);
        this.createRender(!0);
        var d = this;
        this.mixer || (this.mixer = new THREE.AnimationMixer(this.scene),
        this.mixer.addEventListener("finished", this.finishedFunc, !1));
        this.container.addEventListener("mousedown", c, !1);
        this.container.addEventListener("mouseup", c, !1);
        this.container.addEventListener("touchstart", c, !1);
        this.container.addEventListener("touchend", c, !1)
    },
    createRender: function(a) {
        a = new THREE.WebGLRenderer({
            antialias: a,
            alpha: !0
        });
        a.setClearColor(this.clearColor, this.clearAlpha);
        a.setPixelRatio(window.devicePixelRatio);
        a.autoClear = !1;
        a.autoUpdateScene = !1;
        a.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.container.appendChild(a.domElement);
        this.renderer = a
    },
    createStat: function() {
        var a = new Stats;
        a.domElement.style.position = "absolute";
        a.domElement.style.top = "0px";
        this.container.appendChild(a.domElement);
        this.stats = a
    },
    getMaterialByObjName: function(a) {
        return (a = this.findObjectByName(a)) && "Mesh" == a.type ? a.material : null
    },
    setMaterialByObjName: function(a, b) {
        var c = this.findObjectByName(a);
        c ? "Mesh" == c.type ? c.material = b : console.log("obj not mesh", a) : console.log("obj not found", a)
    },
    showModelByName: function(a, b) {
        for (var c in this.scene.children) {
            var d = this.scene.children[c];
            "Mesh" != d.type || a != d.name && "EMPALLMODEL" != a || (d.visible = b)
        }
    },
    showGroupByName: function(a, b) {
        for (var c in this.group[a]) {
            var d = this.group[a][c];
            "Mesh" == d.type && (d.visible = b)
        }
    },
    getGroupBoundingBox: function(a) {
        var b = new THREE.Box3;
        b.makeEmpty();
        for (var c in this.group[a]) {
            var d = this.group[a][c];
            if ("Mesh" == d.type) {
                var e = new THREE.Box3;
                e.copy(d.geometry.boundingBox);
                e.applyMatrix4(d.matrixWorld);
                b.expandByPoint(e.min);
                b.expandByPoint(e.max)
            }
        }
        return b
    },
    getSceneBoundingBox: function() {
        var a = new THREE.Box3;
        a.makeEmpty();
        for (var b in this.scene.children) {
            var c = this.scene.children[b];
            if ("Mesh" == c.type) {
                var d = new THREE.Box3;
                d.copy(c.geometry.boundingBox);
                d.applyMatrix4(c.matrixWorld);
                a.expandByPoint(d.min);
                a.expandByPoint(d.max)
            }
        }
        return a
    },
    getBoundingBox: function(a) {
        var b = new THREE.Box3;
        if (a = this.findObjectByName(a))
            b.copy(a.geometry.boundingBox),
            b.applyMatrix4(a.matrixWorld);
        return b
    },
    zoomBestObj: function(a) {
        var b = this.findObjectByName(a);
        if (b && "Mesh" == b.type) {
            var c = new THREE.Box3;
            c.copy(b.geometry.boundingBox);
            c.applyMatrix4(b.matrixWorld);
            b = c.getBoundingSphere();
            c = this.camera.getWorldDirection();
            this.controls.target && this.controls.target.copy(b.center);
            this.camera.lookAt(b.center);
            this.camera.up.set(0, 1, 0);
            var d = new THREE.Vector3;
            d.addVectors(b.center, c.multiplyScalar(2 * b.radius + 1));
            this.camera.position.copy(d);
            debugOutput && this.showSelectBox(a)
        }
    },
    loadEmpObjs: function(a, b, c, d, e, g) {
        var f = this
          , h = new THREE.JsonEmpLoader
          , k = [];
        this.group[b] = k;
        h.load(a, function(a, b, l) {
            var e = new THREE.Matrix4;
            b.notOrth || e.set(b.mat_wts[0], b.mat_wts[1], b.mat_wts[2], b.mat_wts[3], b.mat_wts[4], b.mat_wts[5], b.mat_wts[6], b.mat_wts[7], b.mat_wts[8], b.mat_wts[9], b.mat_wts[10], b.mat_wts[11], b.mat_wts[12], b.mat_wts[13], b.mat_wts[14], b.mat_wts[15]);
            "undefined" !== typeof d && d.computNormal && (a.geometry.computeFaceNormals(),
            a.geometry.computeVertexNormals());
            mesh1 = new THREE.Mesh(a.geometry,a.materials[0]);
            "undefined" !== typeof b.name ? mesh1.name = b.name : "undefined" !== typeof b.meshName && (mesh1.name = b.meshName);
            mesh1.visible = b.visible;
            mesh1.uuid = l;
            c || (c = "");
            mesh1.name = c + mesh1.name;
            f.addObject(mesh1) && (mesh1.applyMatrix(e),
            mesh1.updateMatrixWorld(!0),
            a.geometry.computeBoundingBox(),
            b = new THREE.Box3,
            b.copy(a.geometry.boundingBox),
            b.applyMatrix4(mesh1.matrixWorld),
            isNaN(b.min.x) || isNaN(b.min.y) || isNaN(b.min.z) || isNaN(b.max.x) || isNaN(b.max.y) || isNaN(b.max.z) ? console.log("EMP Warnning:", mesh1.name + " Boundingbox is error! ") : (f.sceneBoundingBox.expandByPoint(b.min),
            f.sceneBoundingBox.expandByPoint(b.max)),
            f.sceneBoundingBox.getBoundingSphere(),
            f.sceneBoundingBox.center(),
            k.push(mesh1),
            "undefined" !== typeof d && d.autoPlay && (f.mixer || (f.mixer = new THREE.AnimationMixer(f.scene),
            f.mixer.addEventListener("finished", f.finishedFunc, !1)),
            geometry.animations && f.mixer.clipAction(geometry.animations[0], mesh1).setDuration(30 * geometry.animations[0].duration).startAt(0).play()));
            return mesh1
        }, {
            camera: function(a, b, c) {
                a = {
                    uuid: c,
                    name: b.name,
                    animations: a,
                    metadata: b
                };
                f.cameras.push(a);
                return a
            },
            PointLight: function(a, b) {
                var c = new THREE.Color
                  , c = new THREE.PointLight(c.fromArray(a.LightColor).getHex(),a.IntenSity,a.Distance,a.Decay);
                c.position.set(a.Position[0], a.Position[1], a.Position[2]);
                c.name = a.name;
                c.visible = a.visible;
                c.uuid = b;
                f.addObject(c);
                return c
            },
            AmbientLight: function(a, b) {
                var c = new THREE.Color
                  , c = new THREE.AmbientLight(c.fromArray(a.LightColor).getHex());
                c.name = a.name;
                c.visible = a.visible;
                c.uuid = b;
                f.addObject(c);
                return c
            },
            DirectionalLight: function(a, b) {
                var c = new THREE.Color
                  , c = new THREE.DirectionalLight(c.fromArray(a.LightColor).getHex(),a.IntenSity);
                c.position.set(a.Position[0], a.Position[1], a.Position[2]);
                c.name = a.name;
                c.visible = a.visible;
                c.uuid = b;
                f.addObject(c);
                return c
            },
            SpotLight: function(a, b) {
                var c = new THREE.Color
                  , c = new THREE.SpotLight(c.fromArray(a.LightColor).getHex(),a.IntenSity,a.Distance,a.Angle,a.Exponent);
                c.position.set(a.Position[0], a.Position[1], a.Position[2]);
                c.name = a.name;
                c.visible = a.visible;
                c.uuid = b;
                f.addObject(c);
                return c
            },
            HemisphereLight: function(a, b) {
                var c = new THREE.Color
                  , c = new THREE.HemisphereLight(c.fromArray(a.LightColor).getHex(),c.fromArray(a.GroundColor).getHex(),a.IntenSity);
                c.position.set(a.Position[0], a.Position[1], a.Position[2]);
                c.name = a.name;
                c.visible = a.visible;
                c.uuid = b;
                f.addObject(c);
                return c
            }
        }, g, void 0, function(a) {
            "undefined" !== typeof a && (a = f.findCameraByUUID(a)) && f._switchCamera(a, .1);
            "function" == typeof e && e();
            if ("undefined" !== typeof empSizeObj && "undefined" !== typeof empSizeObj.builderMode && 1 == empSizeObj.builderMode) {
                a = 0;
                for (var b in f.scene.children)
                    "Mesh" == f.scene.children[b].type && ++a;
                MsgBuilder("BQI:2:\u52a0\u8f7d\u5b8c\u6210\uff0c\u573a\u666f\u4e2d\u73b0\u6709\u6a21\u578b" + a + "\u4e2a\uff01")
            }
        })
    },
    showMesh: function(a, b, c) {
        if ("undefined" != typeof a && "Mesh" === a.type) {
            var d = c;
            "undefined" == typeof c && (d = 1);
            c = 1 == b;
            2 == b && (c = 1 == a.visible ? !1 : !0);
            if (c) {
                if (1 != a.visible) {
                    var e = a.material.opacity;
                    a.material.opacity = 0;
                    var g = a.material.transparent;
                    a.material.transparent = !0;
                    a.visible = !0;
                    (new TWEEN.Tween(a.material)).to({
                        opacity: e
                    }, d * e).easing(TWEEN.Easing.Linear.None).onComplete(function(b) {
                        a.material.transparent = g;
                        a.material.opacity = e
                    }).start()
                }
            } else
                0 != a.visible && (e = a.material.opacity,
                g = a.material.transparent,
                a.material.transparent = !0,
                (new TWEEN.Tween(a.material)).to({
                    opacity: 0
                }, d * e).easing(TWEEN.Easing.Linear.None).onComplete(function(b) {
                    a.material.transparent = g;
                    a.material.opacity = e;
                    a.visible = !1
                }).start())
        }
    },
    _getAniModels: function(a) {
        var b = [];
        if ("undefined" == typeof a || null == a)
            for (var c in this.scene.children)
                a = this.scene.children[c],
                "Mesh" == a.type && a.geometry.animations && b.push(a);
        else
            (a = this.findObjectByName(a)) && "Mesh" == a.type && a.geometry.animations && b.push(a);
        return b
    },
    resetAniModel: function(a) {
        a = this._getAniModels(a);
        for (var b in a) {
            var c = a[b];
            this.mixer.clipAction(c.geometry.animations[0], c).stop()
        }
    },
    pauseAniModel: function() {
        var a = this._getAniModels(modelName), b;
        for (b in a) {
            var c = a[b];
            this.mixer.clipAction(c.geometry.animations[0], c).paused = !0
        }
    },
    replayAniModel: function() {
        var a = this._getAniModels(modelName), b;
        for (b in a) {
            var c = a[b];
            this.mixer.clipAction(c.geometry.animations[0], c).paused = !1
        }
    },
    playAniModel: function(a, b, c, d, e) {
        var g = 0;
        "undefined" !== typeof b && (g = b);
        b = !1;
        "undefined" != typeof c && (b = c);
        a = parseFloat(a);
        isNaN(a) && (a = 1);
        d = this._getAniModels(d);
        c = !1;
        1 == d.length && (c = !0);
        for (var f in d) {
            var h = d[f]
              , k = this.mixer.clipAction(h.geometry.animations[0], h);
            c && "function" === typeof e && (k.callbackFunc = e);
            k.setDuration(30 * h.geometry.animations[0].duration * a).startAt(null ).setLoop(THREE.LoopRepeat, g).play().clampWhenFinished = b
        }
    },
    finishedFunc: function(a) {
        "undefined" !== typeof a && a.action && "function" === typeof a.action.callbackFunc && a.action.callbackFunc()
    },
    resetAniCamera: function(a) {
        for (key in this.cameras) {
            var b = this.cameras[key];
            b.name == a && b.animations && this.mixer.clipAction(b.animations[0], this.controls).stop()
        }
    },
    pauseAniCamera: function(a) {
        for (key in this.cameras) {
            var b = this.cameras[key];
            b.name == a && b.animations && (this.mixer.clipAction(b.animations[0], this.controls).paused = !0)
        }
    },
    replayAniCamera: function(a) {
        for (key in this.cameras) {
            var b = this.cameras[key];
            b.name == a && b.animations && (this.mixer.clipAction(b.animations[0], this.controls).paused = !1)
        }
    },
    playAniCamera: function(a, b, c, d, e) {
        var g = 0;
        "undefined" !== typeof c && (g = c);
        b = parseFloat(b);
        isNaN(b) && (b = 1);
        c = !1;
        "undefined" != typeof d && (c = d);
        for (key in this.cameras)
            if (d = this.cameras[key],
            d.name == a && d.animations) {
                var f = this.mixer.clipAction(d.animations[0], this.controls);
                "function" === typeof e && (f.callbackFunc = e);
                f.setDuration(30 * d.animations[0].duration * b).startAt(null ).setLoop(THREE.LoopRepeat, g).play().clampWhenFinished = c
            }
    },
    playAniCamerasWithLoop: function(a, b) {
        function c() {
            d.resetAniCamera(a[e]);
            d.playAniCamera(a[e], b, 0, !0);
            ++e;
            e >= a.length && (e = 0)
        }
        var d = this
          , e = 0;
        this.mixer.addEventListener("finished", c, !1);
        c()
    },
    findCameraByName: function(a) {
        for (key in this.cameras) {
            var b = this.cameras[key];
            if (b.name == a)
                return b
        }
        return null
    },
    findCameraByUUID: function(a) {
        for (key in this.cameras) {
            var b = this.cameras[key];
            if (b.uuid == a)
                return b
        }
        return null
    },
    _switchCamera: function(a, b, c) {
        if ("undefined" !== typeof a) {
            var d = new THREE.Vector3;
            this.controls.target && d.copy(this.controls.target);
            3 == a.metadata.camSubType ? this.setControlType("orbit") : this.setControlType("firstperson");
            this.camera.fov = a.metadata.fov;
            this.camera.near = a.metadata.near;
            this.camera.far = a.metadata.far;
            this.autoCamClip = a.metadata.AutoClip;
            if (0 == a.metadata.isAniCamera) {
                c = new THREE.Vector3;
                c.fromArray(a.metadata.campos);
                "undefined" != typeof a.metadata.campos && (new TWEEN.Tween(this.controls.object.position)).to(c, b).easing(TWEEN.Easing.Exponential.InOut).start();
                c = new THREE.Vector3;
                "undefined" != typeof a.metadata.lookat && c.fromArray(a.metadata.lookat);
                if ("undefined" != typeof a.metadata.rotObj) {
                    var e = this.findObjectByUUID(a.metadata.rotObj);
                    if (e && "Mesh" == e.type) {
                        var g = new THREE.Box3;
                        g.copy(e.geometry.boundingBox);
                        g.applyMatrix4(e.matrixWorld);
                        e = g.getBoundingSphere();
                        c.copy(e.center)
                    }
                }
                this.controls.target.copy(d);
                (new TWEEN.Tween(this.controls.target)).to(c, b).easing(TWEEN.Easing.Exponential.InOut).start()
            } else
                this.setControlType("orbit"),
                this.resetAniCamera(a.name),
                this.playAniCamera(a.name, c.scale, c.times, c.keep, c.cbFunc);
            return a
        }
        return null
    },
    switchCameraByName: function(a, b, c) {
        var d = this.findCameraByName(a);
        this._switchCamera(d, b, c);
        d || console.log(a, " Not Found!(switchCameraByName)")
    },
    switchCameraByUUID: function(a, b) {
        var c = this.findCameraByUUID(a);
        this._switchCamera(c, b);
        c || console.log(a, " Not Found! (switchCameraByUUID)")
    },
    switchToCameraAni: function(a, b, c) {
        this.controls.object.up.copy(new THREE.Vector3(0,1,0));
        b && (new TWEEN.Tween(this.controls.object.position)).to(b, c).easing(TWEEN.Easing.Exponential.InOut).start();
        a && (new TWEEN.Tween(this.controls.target)).to(a, c).easing(TWEEN.Easing.Exponential.InOut).start()
    },
    addBindingDomUI: function(a, b, c) {
        this.bindingDomUI[a] = {
            domID: a,
            meshName: b,
            offset: c
        }
    },
    bindDomUI: function(a) {
        var b = this.findObjectByName(a.meshName);
        if (b && b.geometry && (b = b.geometry.boundingBox.center(),
        b.x += a.offset.x,
        b.y += a.offset.y,
        b.z += a.offset.z,
        b = b.project(this.camera),
        a = document.getElementById(a.domID))) {
            var c = (1 - b.y) * this.container.offsetHeight / 2 + this.container.offsetTop - a.offsetHeight / 2;
            a.style.left = ((b.x + 1) * this.container.offsetWidth / 2 + this.container.offsetLeft - a.offsetWidth / 2).toFixed(0) + "px";
            a.style.top = c.toFixed(0) + "px"
        }
    },
    enable: function() {
        this.actived = !0;
        this.reszieScene();
        this.animate()
    },
    disable: function() {
        this.actived = !1
    },
    animate: function() {
        if (0 != this.actived) {
            var a = this.clock.getDelta();
            TWEEN.update();
            this.stats && this.stats.update();
            if (this.autoCamClip) {
                var b = this.sceneBoundingBox.getBoundingSphere();
                if (!isNaN(b.center.x) && !isNaN(b.center.y) && !isNaN(b.center.z) && Infinity != b.radius) {
                    var c = new THREE.Vector3;
                    c.subVectors(this.camera.position, b.center);
                    this.camera.up.set(0, 1, 0);
                    c = c.length();
                    this.camera.near = Math.max(b.radius / 1E3, c - b.radius);
                    this.camera.far = Math.max(b.radius, c + b.radius + 1);
                    this.camera.updateProjectionMatrix()
                }
            }
            this.controls && this.controls.update(a);
            for (key in this.bindingDomUI)
                this.bindDomUI(this.bindingDomUI[key]);
            this.mixer && this.mixer.update(a);
            this.render();
            requestAnimationFrame(animateGlobal)
        }
    },
    render: function() {
        this.actived && (this.scene.updateMatrixWorld(),
        this.skyboxCamera.rotation.copy(this.camera.rotation),
        this.renderer.clear(),
        this.renderer.render(this.skyboxScene, this.skyboxCamera),
        this.renderer.render(this.scene, this.camera),
        this.renderer.render(this.sceneHelpers, this.camera))
    },
    reszieScene: function() {
        this.controls && "function" === typeof this.controls.handleResize && this.controls.handleResize();
        this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.skyboxCamera.aspect = this.container.offsetWidth / this.container.offsetHeight;
        this.skyboxCamera.updateProjectionMatrix();
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.render()
    },
    setSceneSize: function(a, b) {
        this.controls && "function" === typeof this.controls.handleResize && this.controls.handleResize();
        this.camera.aspect = a / b;
        this.camera.updateProjectionMatrix();
        this.skyboxCamera.aspect = a / b;
        this.skyboxCamera.updateProjectionMatrix();
        this.renderer.setSize(a, b)
    }
};
function QueryCamInfo(a) {
    var b = "";
    if (a = scene3D[a]) {
        var b = b + ("\u76f8\u673a\u4f4d\u7f6e:" + a.camera.position.x.toFixed(2) + "," + a.camera.position.y.toFixed(2) + "," + a.camera.position.z.toFixed(2))
          , b = b + ("\r\n\u76ee\u6807\u4f4d\u7f6e:" + a.controls.target.x.toFixed(2) + "," + a.controls.target.y.toFixed(2) + "," + a.controls.target.z.toFixed(2))
          , b = b + ("\r\n\u6700\u5c0f\u8ddd\u79bb:" + a.controls.minDistance.toFixed(2))
          , b = b + ("\r\n\u6700\u5927\u8ddd\u79bb:" + a.controls.maxDistance.toFixed(2))
          , c = new THREE.Vector3;
        c.subVectors(a.controls.object.position, a.controls.target);
        b += "\r\n\u5f53\u524d\u8ddd\u79bb:" + c.length().toFixed(2)
    }
    return b
}
function ApplyCurCamInfo(a) {
    var b = ""
      , c = scene3D[a];
    c && (b += "CameraPos:" + c.camera.position.x.toFixed(2) + "," + c.camera.position.y.toFixed(2) + "," + c.camera.position.z.toFixed(2),
    b += "||LookAt:" + c.controls.target.x.toFixed(2) + "," + c.controls.target.y.toFixed(2) + "," + c.controls.target.z.toFixed(2));
    console.log("ApplyCurCamInfo", a, b);
    return b
}
function QueryMeshInfo(a) {
    var b = ""
      , c = a.split(".");
    if (2 != c.length)
        return b;
    var d = scene3D[c[0]];
    if (d && (c = d.findObjectByUUID(c[1]))) {
        var e = c.geometry
          , b = b + ("\u9876\u70b9\u4e2a\u6570:" + e.vertices.length)
          , b = b + ("\r\n\u4e09\u89d2\u9762\u4e2a\u6570:" + e.faces.length)
          , b = b + ("\r\nUV\u901a\u9053\u6570:" + e.faceVertexUvs.length + "\u5c42")
          , d = new THREE.Box3;
        d.copy(e.boundingBox);
        d.applyMatrix4(c.matrixWorld);
        e = d.getBoundingSphere();
        b += "\r\n\u5305\u56f4\u5706\u4e2d\u5fc3\u70b9:" + e.center.x.toFixed(2) + "," + e.center.y.toFixed(2) + "," + e.center.z.toFixed(2) + ", \u534a\u5f84" + e.radius.toFixed(2);
        b += "\r\n\u5305\u56f4\u76d2:" + d.min.x.toFixed(2) + "," + d.min.y.toFixed(2) + "," + d.min.z.toFixed(2) + " ~ " + d.max.x.toFixed(2) + "," + d.max.y.toFixed(2) + "," + d.max.z.toFixed(2);
        c = c.matrix.elements;
        b += "\r\n\u77e9\u9635:\r\n  " + c[0].toFixed(4) + "," + c[1].toFixed(4) + "," + c[2].toFixed(4) + "," + c[3].toFixed(4) + ",\r\n  " + c[4].toFixed(4) + "," + c[5].toFixed(4) + "," + c[6].toFixed(4) + "," + c[7].toFixed(4) + ",\r\n  " + c[8].toFixed(4) + "," + c[9].toFixed(4) + "," + c[10].toFixed(4) + "," + c[11].toFixed(4) + ",\r\n  " + c[12].toFixed(4) + "," + c[13].toFixed(4) + "," + c[14].toFixed(4) + "," + c[15].toFixed(4)
    }
    console.log("QueryMeshInfo", a, b);
    return b
}
function _local_replaceColon(a) {
    return a.replace(/:/g, "%3A")
}
function EMPLyuQuery(a) {
    console.log("EMPLyuQuery", a);
    var b = "QueryInfo:";
    a = a.split(":");
    if (3 != a.length)
        return "";
    "QueryCamInfo" == a[0] ? (b += a[0] + ":",
    b += _local_replaceColon(QueryCamInfo(a[1])),
    b += ":" + a[2]) : "QueryMeshInfo" == a[0] ? (b += a[0] + ":",
    b += _local_replaceColon(QueryMeshInfo(a[1])),
    b += ":" + a[2]) : "ApplyCurCamInfo" == a[0] && (b += a[0] + ":",
    b += _local_replaceColon(ApplyCurCamInfo(a[1])),
    b += ":" + a[2]);
    "function" == typeof MsgBuilder && MsgBuilder(b)
}
function dom3dReszie() {
    for (var a in scene3D)
        scene3D[a].actived && scene3D[a].reszieScene()
}
window.addEventListener("resize", dom3dReszie, !1);
function animateGlobal() {
    for (var a in scene3D)
        scene3D[a].actived && scene3D[a].animate()
}
function create3dScene(a, b) {
    var c = scene3D[a];
    null == c ? (c = new EmpScene,
    c.initScene(a),
    scene3D[a] = c,
    b && ("undefined" !== typeof b.size && c.setSceneSize(b.size[0], b.size[1]),
    c.setClearColor(b.bgcolor, b.bgalpha),
    "undefined" !== typeof b.controls && c.setControlType(b.controls),
    "undefined" !== typeof b.jsonfile && c.loadEmpObjs(b.jsonfile, "", "", {}, b.fileLoadEndFunc, b.progressFuncs))) : b && ("undefined" !== typeof b.size && c.setSceneSize(b.size[0], b.size[1]),
    c.setClearColor(b.bgcolor, b.bgalpha),
    "undefined" !== typeof b.controls && c.setControlType(b.controls));
    return c
}
;