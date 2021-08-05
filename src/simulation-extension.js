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

    SimulationExtension.prototype.getPalette = () => [
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
                new Extension.Palette.Block('setPhysicsXPosition'),
                new Extension.Palette.Block('setPhysicsYPosition'),
                new Extension.Palette.Block('setPhysicsPosition'),
                new Extension.Palette.Block('changePhysicsXPosition'),
                new Extension.Palette.Block('changePhysicsYPosition'),
                new Extension.Palette.Block('changePhysicsPosition'),
                new Extension.Palette.Block('setXVelocity'),
                new Extension.Palette.Block('setYVelocity'),
                new Extension.Palette.Block('setVelocity'),
                new Extension.Palette.Block('changeXVelocity'),
                new Extension.Palette.Block('changeYVelocity'),
                new Extension.Palette.Block('changeVelocity'),
                new Extension.Palette.Block('setXAcceleration'),
                new Extension.Palette.Block('setYAcceleration'),
                new Extension.Palette.Block('setAcceleration'),
                Extension.Palette.BigSpace,
                new Extension.Palette.Block('simulationTime').withWatcherToggle(),
                new Extension.Palette.Block('deltaTime').withWatcherToggle(),
                new Extension.Palette.Block('physicsXPosition').withWatcherToggle(),
                new Extension.Palette.Block('physicsYPosition').withWatcherToggle(),
                new Extension.Palette.Block('xVelocity').withWatcherToggle(),
                new Extension.Palette.Block('yVelocity').withWatcherToggle(),
                new Extension.Palette.Block('xAcceleration').withWatcherToggle(),
                new Extension.Palette.Block('yAcceleration').withWatcherToggle()
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
                    extension.physicsXVelocity = +v;
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
                    extension.physicsYVelocity = +v;
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
                    return extension.physicsXVelocity || 0;
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
                    return extension.physicsYVelocity || 0;
                }
            }
        ).for(StageMorph, SpriteMorph),
        new Extension.Block(
            'changeXVelocity',
            'command',
            'Simulation',
            'change x velocity to %n m/s',
            [0],
            function(delta) {
                this.setXVelocity(this.receiver.xVelocity() + (+delta || 0));
            }
        ),
        new Extension.Block(
            'changeYVelocity',
            'command',
            'Simulation',
            'change y velocity to %n m/s',
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
                    extension.physicsXVelocity = +vx;
                    extension.physicsYVelocity = +vy;
                }
            }
        ),
        new Extension.Block(
            'changeVelocity',
            'command',
            'Simulation',
            'change velocity to x: %n y: %n m/s',
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
                extension.physicsXAcceleration = +a;
            }
        ),
        new Extension.Block(
            'setYAcceleration',
            'command',
            'Simulation',
            'set y acceleration to %n m/s\u00b2',
            [0],
            function(a) {
                extension.physicsYAcceleration = +a;
            }
        ),
        new Extension.Block(
            'xAcceleration',
            'reporter',
            'Simulation',
            'x acceleration in m/s\u00b2',
            [],
            function() {
                return extension.physicsXAcceleration || 0;
            }
        ).for(StageMorph, SpriteMorph),
        new Extension.Block(
            'yAcceleration',
            'reporter',
            'Simulation',
            'y acceleration in m/s\u00b2',
            [],
            function() {
                return extension.physicsYAcceleration || 0;
            }
        ).for(StageMorph, SpriteMorph),
        new Extension.Block(
            'setAcceleration',
            'command',
            'Simulation',
            'set acceleration to x: %n y: %n m/s\u00b2',
            [0, 0],
            function(ax, ay){
                extension.physicsXAcceleration = +ax;
                extension.physicsYAcceleration = +ay;
            }
        ),
        new Extension.Block(
            'spriteBlock',
            'command',
            'Simulation',
            'sprite-only block',
            [],
            () => 'This is another test.'
        )]
        return newBlockList;
    };

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

    NetsBloxExtensions.register(SimulationExtension);

})();