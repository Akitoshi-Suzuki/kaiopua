/*
 *
 * Game.js
 * Game specific methods and functionality.
 *
 * @author Collin Hover / http://collinhover.com/
 *
 */
(function (main) {
    
    var shared = main.shared = main.shared || {},
		assetPath = "assets/modules/core/Game.js",
		_Game = {},
        _AssetLoader,
		_ErrorHandler,
		_MathHelper,
		_ObjectHelper,
		_Physics,
		_UIElement,
		_MenuMaker,
		_Menu,
		_Button,
		_Launcher,
		_Intro,
        transitioner,
        domElement,
		containerOverlayAll,
		containerOverlayDisplay,
		containerUI,
		containerDisplay,
        renderer, 
        renderTarget,
		renderComposer,
        renderPasses,
		scene,
		sceneBG,
		sceneDefault,
		sceneBGDefault,
		fog,
		camera,
		cameraBG,
		cameraDefault,
		cameraBGDefault,
		bg,
		menus = {},
        currentSection, 
        previousSection,
        paused = false,
		started = false,
		utilProjector1Selection,
		utilRay1Selection,
		utilVec31Selection,
        transitionOut = 1000, 
        transitionIn = 400,
		transitionerAlpha = 0.75,
        loadAssetsDelay = 500,
		dependencies = [
			"assets/modules/utils/AssetLoader.js",
            "assets/modules/utils/ErrorHandler.js",
			"assets/modules/ui/UIElement.js",
			"assets/modules/utils/UIHelper.js", // TODO: remove me!
			"assets/modules/utils/MathHelper.js",
			"assets/modules/utils/Dev.js",
		],
        assetsBasic = [
			"js/lib/jquery.transform2d.js",
            "js/lib/three/Three.js",
            "js/lib/three/ThreeExtras.js",
            "js/lib/three/postprocessing/ShaderExtras.js",
            "js/lib/three/postprocessing/EffectComposer.js",
            "js/lib/three/postprocessing/RenderPass.js",
            "js/lib/three/postprocessing/ShaderPass.js",
            "js/lib/three/postprocessing/MaskPass.js",
            "assets/modules/effects/FocusVignette.js"
        ],
        assetsLauncher = [
            "assets/modules/sections/Launcher.js",
            "assets/modules/env/WaterLauncher.js",
            "assets/modules/env/SkyLauncher.js",
            "assets/textures/cloud256.png",
            "assets/textures/light_ray.png",
			"assets/textures/skybox_launcher_xz.jpg",
			"assets/textures/skybox_launcher_posy.jpg",
            "assets/textures/skybox_launcher_negy.jpg"
        ],
        assetsGame = [
			/*"js/lib/ammo.js",*/
			"js/lib/three/physics/Collisions.js",
			"js/lib/three/physics/CollisionUtils.js",
			"assets/modules/core/Physics.js",
			"assets/modules/core/Player.js",
			"assets/modules/core/Model.js",
			"assets/modules/core/CameraControls.js",
			"assets/modules/ui/Button.js",
			"assets/modules/ui/Menu.js",
			"assets/modules/ui/MenuDynamic.js",
			"assets/modules/ui/Inventory.js",
			"assets/modules/utils/ObjectMaker.js",
			"assets/modules/utils/ObjectHelper.js",
			"assets/modules/utils/MenuMaker.js",
			"assets/modules/characters/Character.js",
			"assets/modules/characters/Hero.js",
			"assets/modules/env/World.js",
			"assets/modules/env/WorldIsland.js",
			"assets/modules/env/Water.js",
			"assets/modules/puzzles/Puzzles.js",
			"assets/modules/puzzles/Grid.js",
			"assets/modules/puzzles/GridModule.js",
			"assets/modules/puzzles/GridModuleState.js",
			"assets/modules/puzzles/GridElement.js",
			"assets/modules/farming/Farming.js",
			"assets/modules/farming/Planting.js",
			"assets/modules/farming/Field.js",
			"assets/modules/farming/Plant.js",
			"assets/modules/sections/Intro.js",
            { path: "assets/models/Whale_Head.js", type: 'model' },
			{ path: "assets/models/Whale_Tail.js", type: 'model' },
			{ path: "assets/models/Hero.js", type: 'model' },
			{ path: "assets/models/Sun_Moon.js", type: 'model' },
			{ path: "assets/models/Cloud_001.js", type: 'model' },
			{ path: "assets/models/Cloud_002.js", type: 'model' },
			{ path: "assets/models/Hut.js", type: 'model' },
			{ path: "assets/models/Hut_Hill.js", type: 'model' },
			{ path: "assets/models/Hut_Steps.js", type: 'model' },
			{ path: "assets/models/Bed.js", type: 'model' },
			{ path: "assets/models/Banana_Leaf_Door.js", type: 'model' },
			{ path: "assets/models/Surfboard.js", type: 'model' },
			{ path: "assets/models/Grass_Clump_001.js", type: 'model' },
			{ path: "assets/models/Grass_Clump_002.js", type: 'model' },
			{ path: "assets/models/Grass_Line_001.js", type: 'model' },
			{ path: "assets/models/Grass_Line_002.js", type: 'model' },
			{ path: "assets/models/Palm_Tree.js", type: 'model' },
			{ path: "assets/models/Palm_Trees.js", type: 'model' },
			{ path: "assets/models/Kukui_Tree.js", type: 'model' },
			{ path: "assets/models/Kukui_Trees.js", type: 'model' },
			{ path: "assets/models/Taro_Plant_001.js", type: 'model' },
			{ path: "assets/models/Volcano_Large.js", type: 'model' },
			{ path: "assets/models/Volcano_Small.js", type: 'model' },
			{ path: "assets/models/Volcano_Rocks_001.js", type: 'model' },
			{ path: "assets/models/Volcano_Rocks_002.js", type: 'model' },
			{ path: "assets/models/Volcano_Rocks_003.js", type: 'model' },
			{ path: "assets/models/Volcano_Rocks_004.js", type: 'model' },
			{ path: "assets/models/Volcano_Rocks_005.js", type: 'model' },
			{ path: "assets/models/Field_Tutorial.js", type: 'model' },
			"assets/textures/skybox_world_posx.jpg",
            "assets/textures/skybox_world_negx.jpg",
			"assets/textures/skybox_world_posy.jpg",
            "assets/textures/skybox_world_negy.jpg",
			"assets/textures/skybox_world_posz.jpg",
            "assets/textures/skybox_world_negz.jpg",
            "assets/textures/waves_512.png"
        ],
		loadingHeader = 'Hold on, we need some stuff from Hawaii...',
		loadingTips = [
            ///////////////////////////////////////////// = bad sentence size
            "Aloha kaua means may there be friendship or love between us.",
            "Mahalo nui loa means thanks very much.",
            "Kali iki means wait a moment.",
            "Ko'u hoaloha means my friend.",
            "Kane means male or man.",
            "Wahine means female or woman.",
            "Ali'i kane means king or chieftan.",
            "Ali'i wahine means queen or chiefess.",
            "He mea ho'opa'ani means to play a game.",
            "Kai means sea or ocean.",
            "'Opua means puffy clouds.",
			"Kai 'Opua means clouds over the ocean.",
            "Iki means small or little.",
            "Nui means large or huge."
        ];
    
    /*===================================================
    
    public properties
    
    =====================================================*/
    
	// functions
	
    _Game.resume = resume;
    _Game.pause = pause;
	
	_Game.add_to_scene = add_to_scene;
	_Game.remove_from_scene = remove_from_scene;
	
	_Game.get_mouse = get_mouse;
	_Game.get_intersection_from_mouse = get_intersection_from_mouse;
	_Game.get_object_under_mouse = get_object_under_mouse;
	
	_Game.is_stop_parameter = is_stop_parameter;
	
	// getters and setters
	
	Object.defineProperty(_Game, 'domElement', { 
		get : function () { return domElement; }
	});
	
	Object.defineProperty(_Game, 'paused', { 
		get : function () { return paused; }
	});
	
	Object.defineProperty(_Game, 'started', { 
		get : function () { return started; }
	});
	
	Object.defineProperty(_Game, 'scene', { 
		get : function () { return scene; },  
		set : set_scene
	});
	
	Object.defineProperty(_Game, 'sceneBG', { 
		get : function () { return sceneBG; },  
		set : set_scene_bg
	});
	
	Object.defineProperty(_Game, 'camera', { 
		get : function () { return camera; },  
		set : set_camera
	});
	
	Object.defineProperty(_Game, 'cameraBG', { 
		get : function () { return cameraBG; },  
		set : set_camera_bg
	});

	main.asset_register( assetPath, { 
		data: _Game,
		readyAutoUpdate: false,
		requirements: dependencies,
		callbacksOnReqs: init_internal,
		wait: true
	});
	
	/*===================================================
    
    internal init and loading
    
    =====================================================*/
	
	function init_internal ( al, err, uie ) {
		console.log('internal game');
		_AssetLoader = al;
		_ErrorHandler = err;
		_UIElement = uie;
		
		// register error listeners
		
		window.onerror = on_error;
		shared.signals.error.add( on_error );
		
		// check for errors
        
        if (_ErrorHandler.check()) {
			
            _ErrorHandler.process();
			
        }
        // safe to start game
        else {
			
			// set loading messages
			
			_AssetLoader.loadingHeader = loadingHeader;
			_AssetLoader.loadingTips = loadingTips;
			
			// start loading
			
			load_basics();
			
        }
		
	}
	
	function load_basics () {
		
		main.asset_require( assetsBasic, [init_basics, load_launcher] );
		
	}
	
	function load_launcher () {
		
		main.asset_require( assetsLauncher, [init_launcher, load_game] );
		
	}
	
	function load_game () {
		
		// pause for short delay
		
		window.requestTimeout( function () {
			
			// load game assets and init game
			
			main.asset_require( assetsGame, init_game, true, containerUI.domElement );
			
		}, loadAssetsDelay);
		
	}
	
	/*===================================================
    
    init with basic assets
    
    =====================================================*/
    
    function init_basics () {
		
		var shaderScreen = THREE.ShaderExtras[ "screen" ],
            shaderFocusVignette = main.get_asset_data("assets/modules/effects/FocusVignette");
			/*bg = effects.LinearGradient.generate( {
				colors: [0x0F042E, 0x1D508F, 0x529AD1, 0x529AD1, 0x455AE0],
				stops: [0, 0.4, 0.6, 0.8, 1.0],
				startBottom: true
			} )*/
		
		// modify THREE classes
		
		add_three_modifications();
		
		// utility
		
		_MathHelper = main.get_asset_data( "assets/modules/utils/MathHelper.js" );
		
		utilProjector1Selection = new THREE.Projector();
		utilRay1Selection = new THREE.Ray();
		utilVec31Selection = new THREE.Vector3();
		
		// cardinal axes
		shared.cardinalAxes = {
			up: new THREE.Vector3( 0, 1, 0 ),
			forward: new THREE.Vector3( 0, 0, 1 ),
			right: new THREE.Vector3( -1, 0, 0 )
		}
        
        // game signals
        shared.signals = shared.signals || {};
        shared.signals.paused = new signals.Signal();
        shared.signals.resumed = new signals.Signal();
        shared.signals.update = new signals.Signal();
		
		// set up game dom elements
		
		domElement = shared.html.gameContainer;
		
		containerOverlayAll = new _UIElement.Instance( {
			id: 'game_overlay_all',
			pointerEventsOnlyWithChildren: true,
			fullwindow: true
        });
		containerOverlayDisplay = new _UIElement.Instance( {
			id: 'game_overlay_display',
			pointerEventsOnlyWithChildren: true,
			fullwindow: true
        });
		containerUI = new _UIElement.Instance( {
			id: 'game_ui',
			fullwindow: true
        });
		containerDisplay = new _UIElement.Instance( {
			id: 'game_visuals',
			fullwindow: true
        });
		
		domElement.append( containerDisplay.domElement );
		domElement.append( containerOverlayDisplay.domElement );
		domElement.append( containerUI.domElement );
		domElement.append( containerOverlayAll.domElement );
		
        // transitioner
		
        transitioner = new _UIElement.Instance({
			id: 'transitioner',
			cssmap: {
				"background-color" : "#333333"
			},
			fullwindow: true
        });
		
		// renderer
        renderer = new THREE.WebGLRenderer( { antialias: true, clearColor: 0x000000, clearAlpha: 0, maxLights: 8 } );
        renderer.setSize( shared.screenWidth, shared.screenHeight );
        renderer.autoClear = false;
		
		// shadows
		/*
		renderer.shadowCameraNear = 3;
		renderer.shadowCameraFar = 20000;
		renderer.shadowCameraFov = 90;
		
		renderer.shadowMapBias = 0.0039;
		renderer.shadowMapDarkness = 0.5;
		renderer.shadowMapWidth = 2048;
		renderer.shadowMapHeight = 2048;
		
		renderer.shadowMapEnabled = true;
		renderer.shadowMapSoft = true;
		*/
        // render target
        renderTarget = new THREE.WebGLRenderTarget( shared.screenWidth, shared.screenHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter } );
        
        // share renderer
        shared.renderer = renderer;
        shared.renderTarget = renderTarget;
		
		// scenes
		
		sceneDefault = new THREE.Scene();
		sceneBGDefault = new THREE.Scene();
        
        // fog
		
		fog = new THREE.Fog( 0xffffff, -100, 10000 );
		
        sceneDefault.fog = fog;
		
		// camera
		
		cameraDefault = new THREE.PerspectiveCamera(60, shared.screenWidth / shared.screenHeight, 1, 20000);
		cameraBGDefault = new THREE.PerspectiveCamera(60, shared.screenWidth / shared.screenHeight, 1, 20000);
		
		cameraDefault.useQuaternion = cameraBGDefault.useQuaternion = true;
		
		// passes
        
        renderPasses = {
			bg: new THREE.RenderPass( sceneBGDefault, cameraBGDefault ),
            env: new THREE.RenderPass( sceneDefault, cameraDefault ),
            screen: new THREE.ShaderPass( shaderScreen ),
            focusVignette: new THREE.ShaderPass ( shaderFocusVignette )
        };
        
		// settings
		
		renderPasses.env.clear = false;
		
        renderPasses.screen.renderToScreen = true;
		
        renderPasses.focusVignette.uniforms[ "screenWidth" ].value = shared.screenWidth;
        renderPasses.focusVignette.uniforms[ "screenHeight" ].value = shared.screenHeight;
        renderPasses.focusVignette.uniforms[ "vingenettingOffset" ].value = 0.6;
        renderPasses.focusVignette.uniforms[ "vingenettingDarkening" ].value = 0.5;
        renderPasses.focusVignette.uniforms[ "sampleDistance" ].value = 0.1;
        renderPasses.focusVignette.uniforms[ "waveFactor" ].value = 0.3;
		
		// set default scene and camera
		
		set_default_cameras_scenes();
		
        // composer
        
        set_render_processing();
		
		// add to display
		
        containerDisplay.domElement.append( renderer.domElement );
		
		// resize
		
        shared.signals.windowresized.add(resize);
		resize(shared.screenWidth, shared.screenHeight);
		
		// set ready
		
		main.asset_ready( assetPath );
        
		// start drawing
        
        animate();
		
    }
	
	function add_three_modifications () {
		
		// quaternion normalized lerp
		
		THREE.Quaternion.nlerp = function ( qa, qb, qr, t ) {
			
			var tFrom = 1 - t;
			
			qr.x = qa.x * tFrom + qb.x * t;
			qr.y = qa.y * tFrom + qb.y * t;
			qr.z = qa.z * tFrom + qb.z * t;
			qr.w = qa.w * tFrom + qb.w * t;
			
			qr.normalize();
			
			return qr;
			
		}
		
		// vector3 normalized lerp
		
		THREE.Vector3.nlerp = function ( va, vb, vr, t ) {
			
			var tFrom = 1 - t;
			
			vr.x = va.x * tFrom + vb.x * t;
			vr.y = va.y * tFrom + vb.y * t;
			vr.z = va.z * tFrom + vb.z * t;
			
			vr.normalize();
			
			return vr;
			
		}
		
	}
	
	/*===================================================
    
    init launcher
    
    =====================================================*/
	
	function init_launcher ( l ) {
		
		_Launcher = l;
		console.log('init launcher', _Launcher);
		set_section( _Launcher );
		
	}
	
	/*===================================================
    
    init game
    
    =====================================================*/
	
    function init_game () {
		
		// assets
		
		_ObjectHelper = main.get_asset_data( "assets/modules/utils/ObjectHelper.js" );
		_MenuMaker = main.get_asset_data( 'assets/modules/utils/MenuMaker.js' );
		_Button = main.get_asset_data( 'assets/modules/ui/Button.js' );
		_Menu = main.get_asset_data( 'assets/modules/ui/Menu.js' );
		
		// init menus
		
		init_footer_menu();
		
		init_start_menu();
		
		init_pause_menu();
		
		// show start menu
		
		menus.start.show( containerUI.domElement );
		
    }
	
	/*===================================================
    
    game menus
    
    =====================================================*/
	
	function init_footer_menu() {
		
		// init footer menu
		
		menus.footer = new _UIElement.Instance( { domElement: shared.html.footerMenu } );
			
	}
	
	function init_start_menu () {
        
        // init start menu
		
        menus.start = new _Menu.Instance( {
            id: 'start_menu',
			transparent: true,
            width: 570
        } );
        
        menus.start.add_item( new _Button.Instance( {
            id: 'Start',
            classes: 'item_big',
			width: 160,
			circle: true,
            callback: function () {
                start_game();
            },
			context: this
        } ) );
        menus.start.add_item( new _Button.Instance( {
            id: 'Continue', 
			width: 160,
			circle: true,
            callback: function () {},
			context: this,
            enabled: false
        } ) );
        menus.start.add_item( new _Button.Instance( {
            id: 'Options',
			width: 160,
			circle: true,
            callback: function () {},
			context: this,
            enabled: false
        } ) );
		
        menus.start.centerAutoUpdate = true;
        
        menus.start.hide( true, 0 );
		
	}
	
	function init_pause_menu () {
        
        // init menu
        
		menus.pause = new _Menu.Instance( {
            id: 'pause_menu',
            width: 760,
			transparent: true
        } );
        
        menus.pause.add_item( new _Button.Instance( {
            id: 'Resume',
            classes: 'item_big',
			circle: true, 
            callback: function () {
                resume();
            },
			context: this
        } ) );
		menus.pause.add_item( new _Button.Instance( {
            id: 'Options',
			circle: true, 
            callback: function () {},
			context: this,
            enabled: false
        } ) );
        menus.pause.add_item( new _Button.Instance( {
            id: 'Save',
			circle: true, 
            callback: function () {},
			context: this,
            enabled: false
        } ) );
		menus.pause.add_item( new _Button.Instance( {
            id: 'End Game',
			circle: true, 
            callback: function () {
				stop_game();
			},
			context: this
        } ) );
        
        menus.pause.centerAutoUpdate = true;
        
        menus.pause.hide( true, 0 );
        
	}
	
	/*===================================================
    
    render functions
    
    =====================================================*/
	
	function set_render_processing ( passesNames ) {
		
		var i, l,
			requiredPre = ['bg', 'env' ],
			requiredPost = ['screen'],
			passName,
			bgPass = renderPasses.bg,
			envPass = renderPasses.env,
			defaultPassIndex;
		
		// init composer
		
		renderComposer = new THREE.EffectComposer( renderer );
		
		// check that passes camera and scene match current
		
		// bg
		
		if ( bgPass.scene !== sceneBG ) {
			bgPass.scene = sceneBG;
		}
		
		if ( bgPass.camera !== cameraBG ) {
			bgPass.camera = cameraBG;
		}
		
		// env
		
		if ( envPass.scene !== scene ) {
			envPass.scene = scene;
		}
		
		if ( envPass.camera !== camera ) {
			envPass.camera = camera;
		}
		
		// if should use default passes
		
		if ( typeof passesNames === 'undefined' || passesNames.hasOwnProperty('length') === false ) {
			
			passesNames = [];
			
		}
		
		// add required
		
		// required pre
		
		for ( i = requiredPre.length - 1; i >= 0; i-- ) {
			
			passName = requiredPre[ i ];
			
			defaultPassIndex = passesNames.indexOf( passName );
			
			if ( defaultPassIndex === -1 ) {
				
				passesNames.unshift( passName );
				
			}
			
		}
		
		// required post
		
		for ( i = requiredPost.length - 1; i >= 0; i-- ) {
			
			passName = requiredPost[ i ];
			
			defaultPassIndex = passesNames.indexOf( passName );
			
			if ( defaultPassIndex === -1 ) {
				
				passesNames.push( passName );
				
			}
			
		}
		
		// add each pass in passes names
		
		for ( i = 0, l = passesNames.length; i < l; i ++ ) {
			
			passName = passesNames[ i ];
			
			if ( typeof renderPasses[ passName ] !== 'undefined' ) {
				
				renderComposer.addPass( renderPasses[ passName ] );
				
			}
			
		}
		
	}
	
	/*===================================================
    
    scene functions
    
    =====================================================*/
	
	function set_scene ( sceneNew ) {
		
		var scenePrev = scene;
		
		renderPasses.env.scene = scene = sceneNew || sceneDefault;
		
		if( scene !== scenePrev && typeof camera !== 'undefined') {
			
			if ( typeof scenePrev !== 'undefined' ) {
				scenePrev.remove( camera );
			}
			
			scene.add( camera );
			
		}
		
	}
	
	function set_scene_bg ( sceneNew ) {
		
		var sceneBGPrev = sceneBG;
		
		renderPasses.bg.scene = sceneBG = sceneNew || sceneBGDefault;
		
		if( sceneBG !== sceneBGPrev && typeof cameraBG !== 'undefined') {
			
			if ( typeof sceneBGPrev !== 'undefined' ) {
				sceneBGPrev.remove( cameraBG );
			}
			
			sceneBG.add( cameraBG );
			
		}
		
	}
	
	function add_to_scene ( objects, sceneDefault ) {
		
		var i, l,
			object,
			object3D,
			sceneTarget,
			callback;
		
		// handle parameters
		
		sceneDefault = sceneDefault || scene;
		
		// for each object
		
		if ( objects.hasOwnProperty('length') === false ) {
			objects = [ objects ];
		}
		
		for ( i = 0, l = objects.length; i < l; i ++ ) {
		
			object = objects[ i ];
			
			callback = object.callbackAdd;
			
			sceneTarget = object.sceneTarget || sceneDefault;
			
			object3D = object.addTarget || object;
			
			// add
			
			if ( typeof object3D !== 'undefined' ) {
				
				sceneTarget.add( object3D );
				
			}
			
			// if callback passed
			
			if ( typeof callback === 'function' ) {
				
				callback.call( this );
				
			}
			
        }
		
	}
	
	function remove_from_scene ( objects, sceneDefault ) {
		
		var i, l,
			object,
			object3D,
			sceneTarget,
			callback;
		
		// handle parameters
		
		sceneDefault = sceneDefault || scene;
		
		// for each object
		
		if ( objects.hasOwnProperty('length') === false ) {
			objects = [ objects ];
		}
		
		for ( i = 0, l = objects.length; i < l; i ++ ) {
		
			object = objects[ i ];
			
			callback = object.callbackRemove;
			
			sceneTarget = object.sceneTarget || sceneDefault;
			
			object3D = object.addTarget || object;
			
			// remove
			
			if ( typeof object3D !== 'undefined' ) {
				
				sceneTarget.remove( object3D );
				
			}
			
			// if callback passed
			
			if ( typeof callback === 'function' ) {
				
				callback.call( this );
				
			}
			
        }
		
	}
	
	/*===================================================
    
    camera functions
    
    =====================================================*/
	
	function set_camera ( cameraNew ) {
		
		var cameraPrev = camera;
		
		if ( typeof cameraPrev !== 'undefined' && typeof scene !== 'undefined' ) {
			
			scene.remove( cameraPrev );
			
		}
		
		renderPasses.env.camera = camera = cameraNew || cameraDefault;
		
		if ( typeof scene !== 'undefined' ) {
			
			scene.add( camera );
			
		}
		
	}
	
	function set_camera_bg ( cameraNew ) {
		
		var cameraBGPrev = cameraBG;
		
		if ( typeof cameraBGPrev !== 'undefined' && typeof sceneBG !== 'undefined' ) {
			
			sceneBG.remove( cameraBGPrev );
			
		}
		
		renderPasses.bg.camera = cameraBG = cameraNew || cameraBGDefault;
		
		if ( typeof sceneBG !== 'undefined' ) {
			
			sceneBG.add( cameraBG );
			
		}
		
	}
	
	/*===================================================
    
    mouse functions
    
    =====================================================*/
	
	function get_mouse ( parameters ) {
		
		var mouse;
		
		if ( typeof parameters === 'number' ) {
			
			mouse = shared.mice[ parameters ];
			
		}
		else if ( typeof parameters === 'object' && parameters.hasOwnProperty( 'mouseIndex' ) && parameters.mouseIndex > 0 && parameters.mouseIndex < shared.mice.length ) {
			
			mouse = shared.mice[ parameters.mouseIndex ];
			
		}
		else {
			
			mouse = shared.mice[ 0 ];
			
		}
		
		return mouse;
	}
	
	function get_intersection_from_mouse ( objects, traverseHierarchy, mouse, cameraTarget ) {
		
		var projector = utilProjector1Selection,
			ray = utilRay1Selection,
			mousePosition = utilVec31Selection,
			intersections,
			intersectedMesh;
		
		// handle parameters
		
		objects = objects || scene;
		
		traverseHierarchy = ( typeof traverseHierarchy === 'boolean' ) ? traverseHierarchy : true;
		
		mouse = mouse || get_mouse();
		
		cameraTarget = cameraTarget || camera;
		
		// account for hierarchy and extract all children
		
		if ( traverseHierarchy !== false ) {
			
			objects = _ObjectHelper.extract_children_from_objects( objects, objects );
			
		}
		
		// get corrected mouse position
		
		mousePosition.x = ( mouse.x / shared.screenWidth ) * 2 - 1;
		mousePosition.y = -( mouse.y / shared.screenHeight ) * 2 + 1;
		mousePosition.z = 0.5;
		
		// unproject mouse position
		
		projector.unprojectVector( mousePosition, cameraTarget );
		
		// set ray

		ray.origin = cameraTarget.position;
		ray.direction = mousePosition.subSelf( cameraTarget.position ).normalize();
		
		// find ray intersections
		
		intersections = ray.intersectObjects( objects );
		
		if ( intersections.length > 0 ) {
			
			return intersections[ 0 ];
			
		}
		
	}
	
	function get_object_under_mouse ( objects, traverseHierarchy, mouse, cameraTarget ) {
		
		var intersection = get_intersection_from_mouse( objects, traverseHierarchy, mouse, cameraTarget );
		
		if ( typeof intersection !== 'undefined' ) {
			
			return intersection.object;
			
		}
		
	}
	
	/*===================================================
    
    section functions
    
    =====================================================*/
	
	function set_default_cameras_scenes () {
		
		set_scene();
		set_scene_bg();
		
		set_camera();
		set_camera_bg();
		
	}

    function set_section ( section, callback ) {
		
		var hadPreviousSection = false,
			newSectionCallback = function () {
				
				if ( typeof previousSection !== 'undefined' ) {
					
					previousSection.remove();
					
				}
				
				transitioner.hide( true, transitionOut );
				
				section.resize(shared.screenWidth, shared.screenHeight);
				
                section.show();
				
                currentSection = section;
				
				resume();
				
				// callback after transition out time
				
				window.requestTimeout( function () {
					if ( typeof callback !== 'undefined' ) {
						
						callback.call();
						
					}
				}, transitionOut );
				
			};
		
		// pause game while switching
		
		pause();
		
        // hide current section
        if (typeof currentSection !== 'undefined') {
			
			hadPreviousSection = true;
            
            previousSection = currentSection;
            
            previousSection.hide();
            
			transitioner.show( containerOverlayAll.domElement, transitionIn );
            
        }
		
        // no current section
		
        currentSection = undefined;
		
		// default scene and camera
		
		set_default_cameras_scenes();
		
		// set started
		
		if ( typeof startedValue !== 'undefined' ) {
		
			started = startedValue;
			
		}
        
        // start and show new section
        if (typeof section !== 'undefined') {
			
            // wait for transitioner to finish fading in
			
			if ( hadPreviousSection === true ) {
				
				window.requestTimeout( function () {
					
					newSectionCallback();
					
				}, transitionIn );
			
			}
			// no previous section, create new immediately
			else {
				
				newSectionCallback();
				
			}
            
        }
		
    }
	
	/*===================================================
    
    start / stop game
    
    =====================================================*/
    
    function start_game () {
		
		// assets
		
		_Physics = main.get_asset_data( 'assets/modules/core/Physics.js' );
		_Intro = main.get_asset_data( 'assets/modules/sections/Intro.js' );
		
		// hide footer menu
		
		menus.footer.hide( true );
		
        // disable start menu
		
        menus.start.disable();
        
        // hide start menu
		
        menus.start.hide( true );
        
		// set intro section
		
        set_section( _Intro );
		
		// set started
		
		started = true;
		
    }
	
	function stop_game () {
		
		// set started
		
		started = false;
		
		// hide and disable pause menu
		
		if ( typeof menus.pause !== 'undefined' ) {
			
			menus.pause.disable();
		
			menus.pause.hide( true );
			
		}
		
		// show footer menu
		
		menus.footer.show();
		
		// set launcher section
		
        set_section( _Launcher, function () {
			
			// show / enable start menu
			
			menus.start.show( containerUI.domElement );
			
			menus.start.enable();
			
		});
		
	}
    
    function pause () {
		
        if (paused === false) {
            
            paused = true;
			
			if ( started === true ) {
				
				transitioner.show( containerOverlayDisplay.domElement, transitionIn, transitionerAlpha );
				
				menus.pause.show( containerUI.domElement );
				
				menus.pause.enable();
				
				menus.footer.show();
				
			}
			else {
				
				transitioner.show( containerOverlayAll.domElement, transitionIn, transitionerAlpha );
				
			}
            
            shared.signals.paused.dispatch();
            
        }
		
    }
    
    function resume () {
		
		var on_menu_hidden = function () {
			
			paused = false;
			
			shared.signals.resumed.dispatch();
			
		};
		
        if (paused === true) {
			
			transitioner.hide( true, transitionOut );
			
			if ( started === true ) {
				
				menus.pause.disable();
				
				menus.pause.hide( true, undefined, 0, on_menu_hidden );
				
				menus.footer.hide( true );
				
			}
			else {
				
				on_menu_hidden();
				
			}
            
        }
    }
    
    function animate () {
    
    	var timeDelta,
			timeDeltaMod;
        
        requestAnimationFrame( animate );
		
		// handle time
		
		shared.timeLast = shared.time;
		
		shared.time = new Date().getTime();
		
		timeDelta = shared.time - shared.timeLast;
		
		// get time delta modifier from timeDelta vs expected refresh interval
		
		timeDeltaMod = _MathHelper.round( timeDelta / shared.timeDeltaExpected, 2 );
		
		if ( _MathHelper.is_number( timeDeltaMod ) !== true ) {
			
			timeDeltaMod = 1;
			
		}
		
		// update
		
		if ( paused !== true ) {
			
			// update physics
			
			if ( typeof _Physics !== 'undefined' ) {
				_Physics.update( timeDelta, timeDeltaMod );
			}
			
			// update all others
			
			shared.signals.update.dispatch( timeDelta, timeDeltaMod );
			
		}
		
		// have camera bg mimic camera rotation
		
		cameraBG.quaternion.copy( camera.quaternion );
		
		// render
        
        renderer.setViewport( 0, 0, shared.screenWidth, shared.screenHeight );

        renderer.clear();
        
		renderComposer.render();
		
    }
    
    function resize( W, H ) {
		
		// render passes
		
		renderPasses.focusVignette.uniforms[ "screenWidth" ].value = W;
        renderPasses.focusVignette.uniforms[ "screenHeight" ].value = H;
        
        // renderer
		
        renderer.setSize( W, H );
        renderTarget.width = W;
        renderTarget.height = H;
		
		// cameras
		
		camera.aspect = W / H;
        camera.updateProjectionMatrix();
		
		cameraBG.aspect = W / H;
        cameraBG.updateProjectionMatrix();
        
		// composer
		
        renderComposer.reset();
        
    }
	
	/*===================================================
	
	utility
	
	=====================================================*/
	
	function is_stop_parameter ( parameters ) {
		
		return parameters === false || ( typeof parameters !== 'undefined' && parameters.stop === true );
		
	}
	
	function on_error ( error, url, lineNumber ) {
        
		// pause game
		
        pause();
		
		// save game
		// TODO
		
		// debug
        
        if (typeof main.assets.modules.utils.dev !== 'undefined') {
            main.assets.modules.utils.dev.log_error(error, url, lineNumber);
        }
		else {
			throw error + " at " + lineNumber + " in " + url;
		}
        
    }
    
} ( KAIOPUA ) );