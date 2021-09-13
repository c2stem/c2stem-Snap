(function () {
    var extension;
    SimulationExtension = function() {};
    SimulationExtension.prototype = new Extension('SimulationExtension');
    SimulationExtension.prototype.getMenu = () => {
        return {
            'This is a simulation Extension': function() {},
        };
    };
    SimulationExtension.prototype.getCategories = () => [
        new Extension.Category(
            'Simulation',
            new Color(10, 100, 10),
        )
    ];

    /*
    Setting up blocks for sprite and stage morph. 
    Only the blocks created here will be visible in the block panel. 
    */
    SimulationExtension.prototype.getPalette = () => [
        new Extension.PaletteCategory(
            'Simulation',
            [
                new Extension.Palette.Block('doSimulationStep'),
                new Extension.Palette.Block('startSimulation'),
                new Extension.Palette.Block('stopSimulation'),
                new Extension.Palette.Block('runSimulationSteps'),
                Extension.Palette.BigSpace,
                new Extension.Palette.Block('simulationTime').withWatcherToggle(),
                new Extension.Palette.Block('deltaTime').withWatcherToggle(),
                new Extension.Palette.Block('setDeltaTime'),
                Extension.Palette.BigSpace,
                new Extension.Palette.Block('setPhysicsPosition'),
                new Extension.Palette.Block('setPhysicsXPosition'),
                new Extension.Palette.Block('setPhysicsYPosition'),
                new Extension.Palette.Block('changePhysicsPosition'),
                new Extension.Palette.Block('changePhysicsXPosition'),
                new Extension.Palette.Block('changePhysicsYPosition'),
                new Extension.Palette.Block('physicsXPosition').withWatcherToggle(),
                new Extension.Palette.Block('physicsYPosition').withWatcherToggle(),
                Extension.Palette.BigSpace,
                new Extension.Palette.Block('setVelocity'),
                new Extension.Palette.Block('setXVelocity'),
                new Extension.Palette.Block('setYVelocity'),
                new Extension.Palette.Block('changeVelocity'),
                new Extension.Palette.Block('changeXVelocity'),
                new Extension.Palette.Block('changeYVelocity'),
                new Extension.Palette.Block('xVelocity').withWatcherToggle(),
                new Extension.Palette.Block('yVelocity').withWatcherToggle(),
                Extension.Palette.BigSpace,
                new Extension.Palette.Block('setXAcceleration'),
                new Extension.Palette.Block('setYAcceleration'),
                new Extension.Palette.Block('setAcceleration'),
                new Extension.Palette.Block('xAcceleration').withWatcherToggle(),
                new Extension.Palette.Block('yAcceleration').withWatcherToggle(),
                Extension.Palette.BigSpace,
                new Extension.Palette.Block('getPhysicsAttrOf'),
                Extension.Palette.BigSpace,       
                new Extension.Palette.Block('phySetHeading'),
                new Extension.Palette.Block('phyChangeHeading'),
                new Extension.Palette.Block('phyHeading').withWatcherToggle(),
                Extension.Palette.BigSpace, 
                new Extension.Palette.Block('gravity')
                
                // new Extension.Palette.Block('spriteBlock'),
            ],
            SpriteMorph
        ),
        new Extension.PaletteCategory(
            'Simulation',
            [
                new Extension.Palette.Block('doSimulationStep'),
                Extension.Palette.Space,
                new Extension.Palette.Block('startSimulation'),
                new Extension.Palette.Block('stopSimulation'),
                new Extension.Palette.Block('runSimulationSteps'),
                Extension.Palette.Space,
                new Extension.Palette.Block('setDeltaTime'),
                Extension.Palette.BigSpace,
                new Extension.Palette.Block('simulationTime').withWatcherToggle(),
                new Extension.Palette.Block('deltaTime').withWatcherToggle()
            ],
            StageMorph
        ),
    ];

    /*
    Defining blocks and their functionality
    */
    SimulationExtension.prototype.getBlocks =  function() {
        extension = this;
        this.physicsRunning = false;
        this.physicsSimulationTime = 0;
        this.physicsLastUpdated = null;
        this.physicsDeltaTime = 0;
        this.targetDeltaTime = 0;
        this.physicsFloor = null;
        this.physicsScale = 10;
        this.physicsOrigin = new Point(0, 0);
        this.physicsAxisAngle = 0;
        this.physicsMode = "";
        this.physicsBody = null;
        this.physicsMass = 100;
        this.gravity = -9.8;

        // Graph
        this.graphTable = new Table(0, 0);
        this.graphWatchers = [];

        const newBlockList = [
        new Extension.Block(
            'simulationTime',
            'reporter',
            'Simulation',
            'time in s',
            [],
            () => (extension.physicsSimulationTime)
        ).for(StageMorph, SpriteMorph),
        new Extension.Block(
            'deltaTime',
            'reporter',
            'Simulation',
            '\u2206t in s',
            [],
            () => (extension.physicsDeltaTime)
        ).for(StageMorph, SpriteMorph),
        new Extension.Block(
            'setDeltaTime',
            'command',
            'Simulation',
            'set \u2206t to %n in s',
            [],
            function(dt) {
                if (dt == 0){
                    throw new Error('\u2206t value is unchanged.');
                }else{
                    extension.targetDeltaTime = Math.max(dt || 0, 0);
                    extension.physicsDeltaTime = extension.targetDeltaTime;
                }
            }
        ),
        new Extension.Block(
            'doSimulationStep',
            'hat',
            'Simulation',
            'simulation_step',
            []
        ),
        new Extension.Block(
            'startSimulation',
            'command',
            'Simulation',
            'start simulation',
            [],
            function() {
                extension.physicsSimulationTime = 0;
                extension.physicsRunning = true;
                extension.physicsLastUpdated = Date.now();
                this.receiver.parent.clearGraphData();
            }
        ),
        new Extension.Block(
            'stopSimulation',
            'command',
            'Simulation',
            'stop simulation',
            [],
            function(){
                extension.physicsRunning = false; 
            }
        ),
        new Extension.Block(
            'runSimulationSteps',
            'command',
            'Simulation',
            'run simulation step',
            []
        ),
        new Extension.Block(
            'setPhysicsXPosition',
            'command',
            'Simulation',
            'set x position to %n m',
            [0],
            function(pos) {
                var s = extension.physicsScale;
                var o = extension.physicsOrigin;
                this.receiver.setXPosition(+pos * s + o.x);
            }
        ),
        new Extension.Block(
            'setPhysicsYPosition',
            'command',
            'Simulation',
            'set y position to %n m',
            [0],
            function(pos) {
                var s = extension.physicsScale;
                var o = extension.physicsOrigin;
                this.receiver.setYPosition(+pos * s + o.y);
            }
        ),
        new Extension.Block(
            'physicsXPosition',
            'reporter',
            'Simulation',
            'x position in m',
            [],
            function() {
                var s = extension.physicsScale;
                var o = extension.physicsOrigin;
                return (this.xPosition() - o.x) / s; 
            }
        ).for(StageMorph, SpriteMorph),
        new Extension.Block(
            'physicsYPosition',
            'reporter',
            'Simulation',
            'y position in m',
            [],
            function() {
                var s = extension.physicsScale;
                var o = extension.physicsOrigin;
                return (this.yPosition() - o.y) / s; 
            }
        ).for(StageMorph, SpriteMorph),
        new Extension.Block(
            'changePhysicsXPosition',
            'command',
            'Simulation',
            'change x position by %n m',
            [0],
            function(delta) {
                var s = extension.physicsScale;
                this.receiver.changeXPosition(+delta * s);
            }
        ),
        new Extension.Block(
            'changePhysicsYPosition',
            'command',
            'Simulation',
            'change y position by %n m',
            [0],
            function(delta) {
                var s = extension.physicsScale;
                this.receiver.changeYPosition(+delta * s);
            }
        ),
        new Extension.Block(
            'setPhysicsPosition',
            'command',
            'Simulation',
            'set position to x: %n y: %n m',
            [0, 0],
            function(x, y){
                var s = extension.physicsScale;
                var o = extension.physicsOrigin;
                this.receiver.gotoXY(+x * s + o.x, +y * s + o.y);
            }
        ),
        new Extension.Block(
            'changePhysicsPosition',
            'command',
            'Simulation',
            'change position by x: %n y: %n m',
            [0, 0],
            function(dx, dy){
                this.setPhysicsPosition(this.receiver.physicsXPosition() + dx, this.receiver.physicsYPosition() + dy);
            }
        ),
        new Extension.Block(
            'setXVelocity',
            'command',
            'Simulation',
            'set x velocity to %n m/s',
            [0],
            function(v) {
                if (extension.physicsBody && extension.physicsMode === "dynamic") {
                    extension.physicsBody.velocity[0] = +v;
                } else {
                    this.receiver.physicsXVelocity = +v;
                }
            }
        ),
        new Extension.Block(
            'setYVelocity',
            'command',
            'Simulation',
            'set y velocity to %n m/s',
            [0],
            function(v) {
                if (extension.physicsBody && extension.physicsMode === "dynamic") {
                    extension.physicsBody.velocity[1] = +v;
                } else {
                    this.receiver.physicsYVelocity = +v;
                }
            }
        ),
        new Extension.Block(
            'xVelocity',
            'reporter',
            'Simulation',
            'x velocity in m/s',
            [],
            function() {
                if (extension.physicsBody && extension.physicsMode === "dynamic") {
                    return extension.physicsBody.velocity[0];
                } else {
                    return this.physicsXVelocity || 0;
                }
            }
        ).for(StageMorph, SpriteMorph),
        new Extension.Block(
            'yVelocity',
            'reporter',
            'Simulation',
            'y velocity in m/s',
            [],
            function() {
                if (extension.physicsBody && extension.physicsMode === "dynamic") {
                    return extension.physicsBody.velocity[1];
                } else {
                    return this.physicsYVelocity || 0;
                }
            }
        ).for(StageMorph, SpriteMorph),
        new Extension.Block(
            'changeXVelocity',
            'command',
            'Simulation',
            'change x velocity by %n m/s',
            [0],
            function(delta) {
                this.setXVelocity(this.receiver.xVelocity() + (+delta || 0));
            }
        ),
        new Extension.Block(
            'changeYVelocity',
            'command',
            'Simulation',
            'change y velocity by %n m/s',
            [0],
            function(delta) {
                this.setYVelocity(this.receiver.yVelocity() + (+delta || 0));
            }
        ),
        new Extension.Block(
            'setVelocity',
            'command',
            'Simulation',
            'set velocity to x: %n y: %n m/s',
            [0, 0],
            function(vx, vy){
                if (extension.physicsBody && extension.physicsMode === "dynamic") {
                    extension.physicsBody.velocity[0] = +vx;
                    extension.physicsBody.velocity[1] = +vy;
                } else {
                    this.receiver.physicsXVelocity = +vx;
                    this.receiver.physicsYVelocity = +vy;
                }
            }
        ),
        new Extension.Block(
            'changeVelocity',
            'command',
            'Simulation',
            'change velocity by x: %n y: %n m/s',
            [0, 0],
            function(dx, dy){
                this.setVelocity(this.receiver.xVelocity() + (+dx || 0), this.receiver.yVelocity() + (+dy || 0));
            }
        ),
        new Extension.Block(
            'setXAcceleration',
            'command',
            'Simulation',
            'set x acceleration to %n m/s\u00b2',
            [0],
            function(a) {
                this.receiver.physicsXAcceleration = +a;
            }
        ),
        new Extension.Block(
            'setYAcceleration',
            'command',
            'Simulation',
            'set y acceleration to %n m/s\u00b2',
            [0],
            function(a) {
                this.receiver.physicsYAcceleration = +a;
            }
        ),
        new Extension.Block(
            'xAcceleration',
            'reporter',
            'Simulation',
            'x acceleration in m/s\u00b2',
            [],
            function() {
                return this.physicsXAcceleration || 0;
            }
        ).for(StageMorph, SpriteMorph),
        new Extension.Block(
            'yAcceleration',
            'reporter',
            'Simulation',
            'y acceleration in m/s\u00b2',
            [],
            function() {
                return this.physicsYAcceleration || 0;
            }
        ).for(StageMorph, SpriteMorph),
        new Extension.Block(
            'setAcceleration',
            'command',
            'Simulation',
            'set acceleration to x: %n y: %n m/s\u00b2',
            [0, 0],
            function(ax, ay){
                this.receiver.physicsXAcceleration = +ax;
                this.receiver.physicsYAcceleration = +ay;
            }
        ),
        new Extension.Block(
            'phySetHeading',
            'command',
            'Simulation',
            'set heading to %n degrees',
            [0],
            function(deg){
                //set heading to degrees
                this.setHeading(-deg+90-extension.physicsAxisAngle)
            }
        ),
        new Extension.Block(
            'phyHeading',
            'reporter',
            'Simulation',
            'heading in degrees',
            [],
            function(){
                var angle = (-this.direction() + 90 - extension.physicsAxisAngle) % 360;
                return angle >= 0 ? angle : angle + 360;
            }
        ).for(StageMorph, SpriteMorph),
        new Extension.Block(
            'phyChangeHeading',
            'command',
            'Simulation',
            'change heading by %n degrees',
            [0],
            function(deg){
                 this.phySetHeading(this.receiver.heading() + (+deg || 0));
            }
        ),
        new Extension.Block(
            'gravity',
            'reporter',
            'Simulation',
            'gravity in m/s\u00b2',
            [],
            () => (extension.gravity)
        ),
        new Extension.Block(
            'getPhysicsAttrOf',
            'reporter',
            'Simulation',
            '%physics of %spr',
            ['x position'],
            function (attribute, name) {
                var thisObj = this.blockReceiver(),
                  thatObj;
              
                if (thisObj) {
                  this.assertAlive(thisObj);
                  thatObj = this.getOtherObject(name, thisObj);
                  if (thatObj) {
                    this.assertAlive(thatObj);
                    switch (this.inputOption(attribute)) {
                      case 'mass':
                        return thatObj.mass ? thatObj.mass() : '';
                      case 'x position':
                        return thatObj.physicsXPosition ? thatObj.physicsXPosition() : '';
                      case 'y position':
                        return thatObj.physicsYPosition ? thatObj.physicsYPosition() : '';
                      case 'x velocity':
                        return thatObj.xVelocity ? thatObj.xVelocity() : '';
                      case 'y velocity':
                        return thatObj.yVelocity ? thatObj.yVelocity() : '';
                      case 'x acceleration':
                        return thatObj.xAcceleration ? thatObj.xAcceleration() : '';
                      case 'y acceleration':
                        return thatObj.yAcceleration ? thatObj.yAcceleration() : '';
                    }
                  }
                }
              
                return '';
            }
        )]
        return newBlockList;
    };

    // Setting up custom label for drop doen block types
    SimulationExtension.prototype.getLabelParts = () => [
        new Extension.LabelPart(
            'physics',
            () => {
                const part = new InputSlotMorph(
                    null, // text
                    false, // non-numeric
                    {
                        'x position in m': ['x position'],
                        'y position in m': ['y position'],
                        'x velocity in m/s': ['x velocity'],
                        'y velocity in m/s': ['y velocity'],
                        'x acceleration in m/s': ['x acceleration'],
                        'y acceleration in m/s': ['y acceleration']
                    },
                    true
                );
                part.setContents(['x position']);
                return part;
            }
        )
    ];

    SpriteMorph.prototype.allHatBlocksForSimulation = function () {
        return this.scripts.children.filter(function (morph) {
            return morph.selector === "doSimulationStep";
        });
    };
    StageMorph.prototype.allHatBlocksForSimulation = SpriteMorph.prototype.allHatBlocksForSimulation;

    StageMorph.prototype.phyStep = StageMorph.prototype.step;
    StageMorph.prototype.step = function () {
        this.phyStep();
        if (this.isSimulationRunning()) {
            this.simulationStep();
        }
    };

    StageMorph.prototype.isSimulationRunning = function () {
        return extension.physicsRunning;        
    };

    StageMorph.prototype.simulationStep = function () {
        var i, delta, time; 

        const hatsAndRecvrs = this.children.concat(this).filter(morph => morph.allHatBlocksForSimulation).map(morph => [morph, morph.allHatBlocksForSimulation()])
    
        time = Date.now(); // in milliseconds
        if (extension.physicsLastUpdated) {
            delta = (time - extension.physicsLastUpdated) * 0.001;
    
            if (extension.targetDeltaTime + 0.01 < delta) {
                if (extension.targetDeltaTime > 0.0) {
                    delta = extension.targetDeltaTime;
                } else if (delta > 0.2) {
                    delta = 0.2;
                }

                this.recordGraphData();

                extension.physicsLastUpdated = time;
                extension.physicsDeltaTime = delta;
                extension.physicsSimulationTime += delta;
                
                hatsAndRecvrs.forEach(pair => {
                    const [rcvr, hats] = pair;
                    hats.forEach(hat => this.threads.startProcess(hat, rcvr, this.isThreadSafe));  
                });
            }
        } else {
            extension.physicsLastUpdated = time;
        }
    
        return true;
    };

    StageMorph.prototype.phyFireGreenFlagEvent = StageMorph.prototype.fireGreenFlagEvent;
    StageMorph.prototype.fireGreenFlagEvent = function () {
      var r = this.phyFireGreenFlagEvent();
      return r;
    };

    StageMorph.prototype.phyFireStopAllEvent = StageMorph.prototype.fireStopAllEvent;
    StageMorph.prototype.fireStopAllEvent = function () {
        var r = this.phyFireStopAllEvent();
        extension.physicsRunning = false;
    };

    //Graph 
    StageMorph.prototype.graphData = function () {
        return extension.graphTable.toList();
    };
    
    StageMorph.prototype.refreshGraphViews = function () {
        var ide = this.parentThatIsA(IDE_Morph);
        if (ide && ide.graphDialog) {
            ide.graphDialog.refresh();
        }
        if (ide && ide.tableDialog) {
            ide.tableDialog.refresh();
        }
    };
    
    StageMorph.prototype.clearGraphData = function () {
        extension.graphWatchers = this.watchers().filter(function (w) {
            return w.isVisible && !w.isTemporary();
        });
        
        this.graphChanged = Date.now();
        extension.graphTable.clear(1 + extension.graphWatchers.length, 0);
        extension.graphTable.setColNames(["Time in s"].concat(extension.graphWatchers.map(
            function (w) {
            return w.objName + w.labelText;
            })));
        
        this.refreshGraphViews();
    };
    
    StageMorph.prototype.recordGraphData = function () {
        if (extension.graphTable.rows() >= 1000) {
            return;
        }
        
        extension.graphTable.addRow([extension.physicsSimulationTime].concat(extension.graphWatchers.map(
            function (w) {
            if (w.target instanceof VariableFrame) {
                var v = w.target.vars[w.getter];
                return v ? v.value : NaN;
            } else {
                return w.target[w.getter]();
            }
            })));
        
        var t = Date.now();
        if (t - this.graphChanged >= 500) {
            this.graphChanged = t;
            this.refreshGraphViews();
        }
    };

    // Create buttons on Coral Bar.
    IDE_Morph.prototype.createCoralBar = IDE_Morph.prototype.createCorralBar;
    IDE_Morph.prototype.createCorralBar = function(){
        this.createCoralBar();
        var padding = 5,
        graphbutton,
        tablebutton,
        colors = MorphicPreferences.isFlat ? this.tabColors
        : [
            this.groupColor,
            this.frameColor.darker(50),
            this.frameColor.darker(50)
        ],
        
        leftX = this.getCorralBarLeftX(this.corralBar);

        // Graph button
        graphbutton = new PushButtonMorph(
            this,
            "openGraphDialog",
            new SymbolMorph("graph", 15)
        );
        graphbutton.corner = 12;
        graphbutton.color = colors[0];
        graphbutton.highlightColor = colors[1];
        graphbutton.pressColor = colors[2];
        graphbutton.labelMinExtent = new Point(36, 18);
        graphbutton.padding = 0;
        graphbutton.labelShadowOffset = new Point(-1, -1);
        graphbutton.labelShadowColor = colors[1];
        graphbutton.labelColor = this.buttonLabelColor;
        graphbutton.contrast = this.buttonContrast;
        graphbutton.hint = "graph the simulation data";
        graphbutton.fixLayout();
        graphbutton.setCenter(this.corralBar.center());
        graphbutton.setLeft(leftX+ padding);
        this.corralBar.add(graphbutton);

        leftX = this.getCorralBarLeftX(this.corralBar);

        // Table button
        tablebutton = new PushButtonMorph(
            this,
            "openTableDialog",
            new SymbolMorph("table", 16)
        );
        tablebutton.corner = 12;
        tablebutton.color = colors[0];
        tablebutton.highlightColor = colors[1];
        tablebutton.pressColor = colors[2];
        tablebutton.labelMinExtent = new Point(36, 18);
        tablebutton.padding = 0;
        tablebutton.labelShadowOffset = new Point(-1, -1);
        tablebutton.labelShadowColor = colors[1];
        tablebutton.labelColor = this.buttonLabelColor;
        tablebutton.contrast = this.buttonContrast;
        tablebutton.hint = "table view of simulation data";
        tablebutton.fixLayout();
        tablebutton.setCenter(this.corralBar.center());
        tablebutton.setLeft(leftX + padding);
        this.corralBar.add(tablebutton);

    }

    // end position of a button 
    IDE_Morph.prototype.getCorralBarLeftX= function(corralBar) {
        lastButton = corralBar.children[this.corralBar.children.length -1],
        lastButtonEnd = lastButton.bounds["corner"].x;
        return lastButtonEnd;
    }

    // render symbols for buttons
    SymbolMorph.prototype.superRenderShape = SymbolMorph.prototype.renderShape;
    SymbolMorph.prototype.renderShape = function (ctx, aColor) {
        try{
            this.superRenderShape(ctx, aColor);
        }catch(err){
            if (this.name == 'graph'){
                this.renderSymbolGraph(ctx, aColor)
            }else if(this.name == 'table'){
                this.renderSymbolTable(ctx, aColor)
            }
        }

    }
    SymbolMorph.prototype.renderSymbolGraph = function (ctx, color) {
        var w = this.symbolWidth(),
            h = this.size,
            l = Math.max(w * 0.05, 0.5);
    
        ctx.fillStyle = color.toString();
        ctx.strokeStyle = ctx.fillStyle;
    
        ctx.lineWidth = l;
        ctx.beginPath();
        ctx.moveTo(w * 0.1, h * 0.0);
        ctx.lineTo(w * 0.1, h * 0.9);
        ctx.lineTo(w * 1.0, h * 0.9);
        ctx.moveTo(w * 0.0, h * 0.2);
        ctx.lineTo(w * 0.1, h * 0.0);
        ctx.lineTo(w * 0.2, h * 0.2);
        ctx.moveTo(w * 0.8, h * 0.8);
        ctx.lineTo(w * 1.0, h * 0.9);
        ctx.lineTo(w * 0.8, h * 1.0);
        ctx.stroke();
    
        ctx.lineWidth = 2 * l;
        ctx.beginPath();
        ctx.moveTo(w * 0.2, h * 0.8);
        ctx.lineTo(w * 0.4, h * 0.2);
        ctx.lineTo(w * 0.6, h * 0.6);
        ctx.lineTo(w * 0.8, h * 0.1);
        ctx.lineTo(w * 0.9, h * 0.4);
        ctx.stroke();
    
    }

    SymbolMorph.prototype.renderSymbolTable = function (ctx, color) {
        // answer a canvas showing an atom
        var w = this.symbolWidth(),
            h = this.size;
    
        ctx.fillStyle = color.toString();
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineWidth = Math.max(w * 0.05, 0.5);
        ctx.beginPath();
        for (var i = 0.1; i < 1.0; i += 0.2) {
            ctx.moveTo(0.1 * w, i * h);
            ctx.lineTo(0.9 * w, i * h);
            ctx.moveTo(i * w, 0.1 * h);
            ctx.lineTo(i * w, 0.9 * h);
        }
        ctx.stroke();
    
    };

    // Graph
    // ------- GraphingMorph -------

     function GraphMorph(table) {
        this.init(table);
    }

    GraphMorph.prototype = new Morph();
    GraphMorph.prototype.constructor = GraphMorph;
    GraphMorph.uber = Morph.prototype;

    GraphMorph.prototype.init = function (table) {
    GraphMorph.uber.init.call(this);
        this.table = table;
        this.canvas = newCanvas(this.extent(), false);
    };

    GraphMorph.prototype.colors = ['rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)',
        'rgb(255,255,0)', 'rgb(255,0,255)', 'rgb(0,255,255)', 'rgb(0,0,0)'
    ];

    GraphMorph.prototype.getChartCanvas = function() {
        const size = this.extent();
        const oldSize = new Point(this.canvas.width, this.canvas.height);
        if (!size.eq(oldSize)) {
            this.canvas = newCanvas(size, false, this.canvas);
        }
        return this.canvas;
    };

    GraphMorph.prototype.superRender = Morph.prototype.render;
    GraphMorph.prototype.render = function (dstCtx) {
        if (!this.table) {
            return;
        }

        var pixelRatioHack = window.devicePixelRatio || 1.0;

        const image = this.getChartCanvas();
        image.width = this.width() / pixelRatioHack;
        image.height = this.height() / pixelRatioHack;
        const sourceCtx = image.getContext('2d');


        if(this.chart){
            this.chart.destroy();
        }
        
        const chartConfig = this.getChartJSConfig();
        this.chart = new Chart(sourceCtx, chartConfig);
        dstCtx.drawImage(image, 0, 0);
    };

    GraphMorph.prototype.getChartJSConfig = function () {
        var labels = [];
        for (var r = 1; r < this.table.rows(); r++) {
            var v = +this.table.get(1, r);
            labels.push(v.toFixed(3));
        }

        var datasets = [];
        for (var c = 2; c <= this.table.cols(); c++) {
            var data = [],
            color = this.colors[c - 2 % this.colors.length];

            for (var r = 1; r < this.table.rows(); r++) {
                data.push(this.table.get(c, r));
            }

            datasets.push({
                label: this.table.get(c, 0),
                borderColor: color,
                backgroundColor: color,
                data: data,
                borderWidth: 1,
                pointRadius: 2
            });
        }
        return {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: false,
                scales: {
                    x: {
                        display: true,
                        ticks: {
                            autoSkip: true,
                            autoSkipPadding: 20
                        },
                        title: {
                            display: true,
                            align: 'center',
                            text: 'Time in s'
                        }
                    }
                }
            }
        };
    };

     // ------- GraphDialogMorph -------
     GraphDialogMorph.prototype = new DialogBoxMorph();
     GraphDialogMorph.prototype.constructor = GraphDialogMorph;
     GraphDialogMorph.uber = DialogBoxMorph.prototype;
 
     function GraphDialogMorph(table, mode) {
         this.init(table, mode);
     }
 
     GraphDialogMorph.prototype.init = function (table, mode) {
         // additional properties:
         this.handle = null;
         this.table = table;
         this.mode = mode;
 
         // initialize inherited properties:
         GraphDialogMorph.uber.init.call(this);
 
         // override inherited properites:
         this.labelString = 'Simulation Data';
         this.createLabel();
 
         this.buildContents();
     };
 
     GraphDialogMorph.prototype.buildContents = function () {
         if (this.mode === 'table') {
             this.tableView = new TableMorph(
             this.table,
             null, // scrollBarSize
             null, // extent
             null, // startRow
             null, // startCol
             null, // globalColWidth
             null, // colWidths
             null, // rowHeight
             null, // colLabelHeight
             null // padding
             );
             this.addBody(new TableFrameMorph(this.tableView, true));
         } else {
             this.addBody(new GraphMorph(this.table));
         }
         this.addButton('ok', 'Close');
         this.addButton('exportTable', 'Export');
         this.addButton('refresh', 'Refresh');
     };
 
     GraphDialogMorph.prototype.exportTable = function () {
         if (this.parent instanceof WorldMorph) {
             var ide = this.parent.children[0];
             ide.saveFileAs(this.table.toCSV(), 'text/csv;chartset=utf-8', 'simdata');
             this.ok();
         }
     };
 
     GraphDialogMorph.prototype.setInitialDimensions = function () {
         var world = this.world(),
             mex = world.extent().subtract(new Point(this.padding, this.padding)),
             th = fontHeight(this.titleFontSize) + this.titlePadding * 3, // hm...
             bh = this.buttons.height();
         this.setExtent(new Point(300, 300).min(mex));
         this.setCenter(this.world().center());
     };
 
     GraphDialogMorph.prototype.popUp = function (world) {
         if (world) {
             GraphDialogMorph.uber.popUp.call(this, world);
             if (this.handle) {
                 this.handle.destroy();
             } else {
                 this.setInitialDimensions();
             }
             this.handle = new HandleMorph(
                 this,
                 280,
                 250,
                 this.corner,
                 this.corner
             );
             this.refresh();
         }
     };
 
     GraphDialogMorph.prototype.fixLayout = BlockEditorMorph.prototype.fixLayout;
 
     GraphDialogMorph.prototype.refresh = function () {
         if (this.body instanceof TableFrameMorph) {
             this.body.tableMorph.fixLayout();
         } else if (this.body instanceof GraphMorph) {
            this.body.rerender();
            this.body.changed();
         }
     };

     // Graph IDE morph
    IDE_Morph.prototype.openGraphDialog = function () {
        if (!this.graphDialog) {
            this.graphDialog = new GraphDialogMorph(extension.graphTable);
        }
        
        this.graphDialog.popUp(this.world());
    };

    // ------- Table -------

    Table.prototype.clear = function (cols, rows) {
        this.colCount = +cols;
        this.rowCount = +rows;
        this.colNames = [];
        this.rowNames = [];
        this.contents = new Array(+rows);
        for (var i = 0; i < rows; i += 1) {
            this.contents[i] = new Array(+cols);
        }
        this.lastChanged = Date.now();
    };

    Table.prototype.toCSV = function () {
        var data = this.colNames.join(',') + '\n';
        for (var i = 0; i < this.contents.length; i++) {
            data += this.contents[i].join(',') + '\n';
        }
        return data;
    };

    // Table IDE Morph 
    IDE_Morph.prototype.openTableDialog = function () {
        if (!this.tableDialog) {
            this.tableDialog = new GraphDialogMorph(extension.graphTable, 'table');
        }
        
        this.tableDialog.popUp(this.world());
    };

    TableMorph.prototype.step = function () {
        if (this.dragAnchor) {
            this.shiftCells(this.world().hand.position());
        } else if (this.resizeAnchor) {
            this.resizeCells(this.world().hand.position());
        }
        
        if (this.wantsUpdate) {
            this.update(); // disable automatic refresh
        }
    };

    // hide code
    // ------- ScriptsMorph -------

    ScriptsMorph.prototype.hasHiddenCode = function () {
        return this.children.some(function (block) {
            return block.isHiddenBlock;
        });
    };
  
    ScriptsMorph.prototype.showHiddenCode = function () {
        this.children.forEach(function (block) {
            if (block.unhideBlock && block.isHiddenBlock) {
                block.unhideBlock();
            }
        });
    };
  
    // ------- HatBlockMorph -------
  
    HatBlockMorph.prototype.hideBlock = function () {
        this.isHiddenBlock = true;
        this.hide();
    };
    
    HatBlockMorph.prototype.unhideBlock = function () {
        this.isHiddenBlock = false;
        this.phyShow();
    };

    HatBlockMorph.prototype.physicsSaveToXML = function (serializer) {
        return this.isHiddenBlock ? '<physics hidden="true"></physics>' : '';
    };
    
    HatBlockMorph.prototype.physicsLoadFromXML = function (model) {
        if (model.attributes.hidden === 'true') {
            this.hideBlock();
        }
    };

    HatBlockMorph.prototype.phyShow = HatBlockMorph.prototype.show;
    HatBlockMorph.prototype.show = function () {
        if (this.isHiddenBlock) {
            this.hide();
        } else {
            this.phyShow();
        }
    };

    HatBlockMorph.prototype.toggleVisibility = function () {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    };

    NetsBloxExtensions.register(SimulationExtension);

})();
