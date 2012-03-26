/*
 *
 * Farming.js
 * Gives a character the ability to farm.
 *
 * @author Collin Hover / http://collinhover.com/
 *
 */
(function (main) {
    
    var shared = main.shared = main.shared || {},
		assetPath = "assets/modules/farming/Farming.js",
		_Farming = {},
		_Game,
		_Puzzles,
		_Planting,
		_Field,
		_GUI,
		_Button,
		_Menu;
	
	/*===================================================
    
    public
    
    =====================================================*/
	
	main.asset_register( assetPath, { 
		data: _Farming,
		requirements: [
			"assets/modules/core/Game.js",
			"assets/modules/puzzles/Puzzles.js",
			"assets/modules/farming/Planting.js",
			"assets/modules/farming/Field.js",
			"assets/modules/core/GUI.js",
			"assets/modules/ui/Button.js",
			"assets/modules/ui/Menu.js"
		],
		callbacksOnReqs: init_internal,
		wait: true
	});
	
	/*===================================================
    
    internal init
    
    =====================================================*/
	
	function init_internal( g, pzl, pl, f, gui, btn, mn ) {
		console.log('internal farming', _Farming);
		
		_Game = g;
		_Puzzles = pzl;
		_Planting = pl;
		_Field = f;
		_GUI = gui;
		_Button = btn;
		_Menu = mn;
		
		_Farming.Instance = Farming;
		
		_Farming.Instance.prototype.plant = plant;
		
		_Farming.Instance.prototype.change_field = change_field;
		
	}
	
	/*===================================================
    
    farming
    
    =====================================================*/
	
	function Farming ( character ) {
		
		var planting;
		
		// store character ref
		
		this.character = character;
		
		// init farming ui
		
		init_farming_ui();
		
		// planting
		
		this.planting = new _Planting.Instance( this );
		
	}
	
	/*===================================================
	
	ui
	
	=====================================================*/
	
	function init_farming_ui() {
		
		var b = _GUI.buttons,
			m = _GUI.menus;
		
		// menu
		
		this.menu = m.farming = new _Menu.Instance( {
            id: 'farming'
        } );
		
		m.farming.buttonOpen = new _Button.Instance( {
			id: 'open',
			image: shared.pathToIcons + 'farming_64.png',
			imageSize: _GUI.sizes.iconMedium,
			size: _GUI.sizes.iconMediumContainer,
			tooltip: 'Farming',
			spacing: _GUI.sizes.buttonSpacing,
			circle: true
		} );
		
		m.farming.buttonClose = _GUI.generate_button_close();
		
		m.farming.add( 
			new _Button.Instance( {
				id: 'plant_001',
				image: shared.pathToIcons + 'plant_64.png',
				imageSize: _GUI.sizes.iconMedium,
				size: _GUI.sizes.iconMediumContainer,
				tooltip: 'plant_001',
				spacing: _GUI.sizes.buttonSpacing,
				circle: true,
				enabled: false
			} ),
			new _Button.Instance( {
				id: 'plant_002',
				image: shared.pathToIcons + 'plant_64.png',
				imageSize: _GUI.sizes.iconMedium,
				size: _GUI.sizes.iconMediumContainer,
				tooltip: 'plant_002',
				spacing: _GUI.sizes.buttonSpacing,
				circle: true,
				enabled: false
			} ),
			new _Button.Instance( {
				id: 'plant_003',
				image: shared.pathToIcons + 'plant_64.png',
				imageSize: _GUI.sizes.iconMedium,
				size: _GUI.sizes.iconMediumContainer,
				tooltip: 'plant_003',
				spacing: _GUI.sizes.buttonSpacing,
				circle: true,
				enabled: false
			} )
		);
		
		m.farming.arrange_circle( {
			degreesAutoFit: true,
			degreeStart: 0,
			direction: -1,
			radius: _GUI.sizes.buttonMedium + _GUI.sizes.buttonSpacing,
			forceShapeOnOpen: true
		} );
		
		m.main.add( m.farming, 0 );
		
		// navigation
		
		this.buttonNavigation = b.farmingMenu = new _Button.Instance( {
			id: 'farmingMenu',
			image: shared.pathToIcons + 'farming_64.png',
			imageSize: _GUI.sizes.iconMedium,
			size: _GUI.sizes.iconMediumContainer,
			tooltip: 'Farming',
			spacing: _GUI.sizes.buttonSpacing,
			circle: true,
			callback: function () {
				
				_Game.pause();
				
				m.farming.open( 0 );
				
			},
			context: this
		} );
		
		m.navigation.add( b.farmingMenu, 0 );
		
	}
	
	/*===================================================
	
	planting
	
	=====================================================*/
	
	function plant ( parameters ) {
		
		// handle parameters
		
		if ( _Game.is_stop_parameter( parameters ) ) {
			
			// stop planting cycle
			
			this.planting.stop();
			
		}
		else {
			
			// store mouse
			
			this.planting.mouse = main.get_mouse( this.planting.event );
			
			// step planting cycle
			
			this.planting.step();
			
		}
		
		return this.planting.started;
		
	}
	
	/*===================================================
	
	fields
	
	=====================================================*/
	
	function change_field ( field ) {
		
		// if new field
		
		if ( this.field !== field ) {
			
			// clear previous field grid
			
			if ( this.field instanceof _Field.Instance ) {
				
				this.field.grid.clean();
				
			}
			
			// store new field
			
			this.field = field;
			
		}
		
	}
	
} (KAIOPUA) );