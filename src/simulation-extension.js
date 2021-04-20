(function SimulationExtension() {
    
    simulationExtension = function() {};
    simulationExtension.prototype = new Extension('SimulationExtension');
    simulationExtension.prototype.getMenu = () => {
        return {
            'Will do something, someday': function() {
            },
        };
    };
    simulationExtension.prototype.getCategories = () => [
        new Extension.Category(
            'Simulation',
            new Color(10, 100, 10),
            [
                'doSimulationStep',
                '-',
                '-',
                'startSimulation',
                'stopSimulation',
                'runSimulationSteps',
                '-',
                '-',
                'setDeltaTime',
                'setPhysicsXPosition',
                'setPhysicsYPosition',
                'setPhysicsPosition',
                'changePhysicsXPosition',
                'changePhysicsYPosition',
                'changePhysicsPosition',
                '-',
                '-',
                'simulationTimereport',
                'simulationTimereport',
                'deltaTimereport',
                'deltaTimereport',
                'physicsXPositionreport',
                'physicsXPositionreport',
                'physicsYPositionreport',
                'physicsYPositionreport'

            ]
        )
    ];
    simulationExtension.prototype.getBlocks = () => [
        new Extension.Block(
            'simulationTimereport',
            'reporter',
            'Simulation',
            'time in s',
            []
        ),
        new Extension.Block(
            'deltaTimereport',
            'reporter',
            'Simulation',
            '\u2206t in s',
            []
        ),
        new Extension.Block(
            'setDeltaTime',
            'command',
            'Simulation',
            'set \u2206t to %n in s',
            []
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
            []
        ),
        new Extension.Block(
            'stopSimulation',
            'command',
            'Simulation',
            'stop simulation',
            []
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
            [0]
        ),
        new Extension.Block(
            'setPhysicsYPosition',
            'command',
            'Simulation',
            'set y position to %n m',
            [0]
        ),
        new Extension.Block(
            'physicsXPositionreport',
            'repoter',
            'Simulation',
            'x position in m',
            []
        ),
        new Extension.Block(
            'physicsYPositionreport',
            'reporter',
            'Simulation',
            'y position in m',
            []
        ),
        new Extension.Block(
            'changePhysicsXPosition',
            'command',
            'Simulation',
            'change x position by %n m',
            [0]
        ),
        new Extension.Block(
            'changePhysicsYPosition',
            'command',
            'Simulation',
            'change y position by %n m',
            [0]
        ),
        new Extension.Block(
            'setPhysicsPosition',
            'command',
            'Simulation',
            'set position to x: %n y: %n m',
            [0, 0]
        ),
        new Extension.Block(
            'changePhysicsPosition',
            'command',
            'Simulation',
            'change position by x: %n y: %n m',
            [0, 0]
        )

    ];


    SpriteMorph.prototype.phyInit = SpriteMorph.prototype.init;
    SpriteMorph.prototype.init = function (globals) {
        this.phyInit(globals);
        this.physicsMode = "";
        this.physicsBody = null;
        this.physicsMass = 100;
        this.customConceptValues = {};
    };
    SpriteMorph.prototype.getStage = function () {
        var stage = this.parentThatIsA(StageMorph);
        if (!stage) {
          var hand = this.parentThatIsA(HandMorph);
          if (hand.world instanceof WorldMorph &&
            hand.world.children[0] instanceof IDE_Morph &&
            hand.world.children[0].stage instanceof StageMorph) {
            stage = hand.world.children[0].stage;
            }
        }
        return stage;
    };
    
    SpriteMorph.prototype.startSimulation = function () {
        var stage = this.getStage();
        if (stage) {
            stage.startSimulation();
        }
    };
    
    SpriteMorph.prototype.stopSimulation = function () {
        var stage = this.getStage();
        if (stage) {
            stage.stopSimulation();
        }
    };
    
    SpriteMorph.prototype.deltaTimereport = function () {
        var stage = this.getStage();
        return (stage && stage.deltaTimereport()) || 0;
    };
    
    SpriteMorph.prototype.setDeltaTime = function (dt) {
        var stage = this.getStage();
        if (stage) {
            stage.setDeltaTime(dt);
        }
    };
    
    SpriteMorph.prototype.simulationTimereport = function () {
        var stage = this.getStage();
        return (stage && stage.simulationTimereport()) || 0;
    };

    SpriteMorph.prototype.physicsScale = function () {
        var stage = this.getStage();
        return (stage && stage.physicsScale) || 1.0;
    };
      
    SpriteMorph.prototype.physicsOrigin = function () {
        var stage = this.getStage();
        return (stage && stage.physicsOrigin) || new Point(0, 0);
    };

    SpriteMorph.prototype.setPhysicsPosition = function (x, y) {
        var s = this.physicsScale();
        var o = this.physicsOrigin();
        this.gotoXY(+x * s + o.x, +y * s + o.y);
    };
      
    SpriteMorph.prototype.setPhysicsXPosition = function (pos) {
        var s = this.physicsScale();
        var o = this.physicsOrigin();
        this.setXPosition(+pos * s + o.x);
    };
      
    SpriteMorph.prototype.setPhysicsYPosition = function (pos) {
        var s = this.physicsScale();
        var o = this.physicsOrigin();
        this.setYPosition(+pos * s + o.y);
    };
      
    SpriteMorph.prototype.changePhysicsXPosition = function (delta) {
        var s = this.physicsScale();
        this.changeXPosition(+delta * s);
    };
      
    SpriteMorph.prototype.changePhysicsYPosition = function (delta) {
        var s = this.physicsScale();
        this.changeYPosition(+delta * s);
    };
      
    SpriteMorph.prototype.changePhysicsPosition = function (dx, dy) {
        this.setPhysicsPosition(this.physicsXPosition() + dx, this.physicsYPosition() + dy);
    };
      
    SpriteMorph.prototype.physicsXPositionreport = function () {
        var s = this.physicsScale();
        var o = this.physicsOrigin();
        return (this.xPosition() - o.x) / s;
    };
      
    SpriteMorph.prototype.physicsYPositionreport = function () {
        var s = this.physicsScale();
        var o = this.physicsOrigin();
        return (this.yPosition() - o.y) / s;
    };
      
    SpriteMorph.prototype.allHatBlocksForSimulation = function () {
        return this.scripts.children.filter(function (morph) {
            return morph.selector === "doSimulationStep";
        });
    };

    StageMorph.prototype.phyInit = StageMorph.prototype.init;
    StageMorph.prototype.init = function (globals) {
        this.phyInit(globals);
    
        this.physicsRunning = false;
        this.physicsSimulationTime = 0;
        this.physicsLastUpdated = null;
        this.physicsDeltaTime = 0;
        this.targetDeltaTime = 0;
        this.physicsFloor = null;
        this.physicsScale = 10;
        this.physicsOrigin = new Point(0, 0);
        this.physicsAxisAngle = 0;
    
        this.testBlockvalue = 0;
    };
    
    // SpriteMorph.prototype.SimulationTimereport = function () {
    //     var stage = this.getStage();
    //     return (stage && stage.SimulationTimereport()) || 0;
    // };

    StageMorph.prototype.phyStep = StageMorph.prototype.step;
    StageMorph.prototype.step = function () {
        this.phyStep();
        if (this.isSimulationRunning()) {
            this.simulationStep();
        }
    };

    StageMorph.prototype.isSimulationRunning = function () {
        return this.physicsRunning;
    };

    StageMorph.prototype.startSimulation = function (norefresh) {
        this.physicsSimulationTime = 0;
        this.physicsRunning = true;
        this.physicsLastUpdated = Date.now();
        //this.clearGraphData();

        if (!norefresh) {
            var ide = this.parentThatIsA(IDE_Morph);
            if (ide && ide.controlBar.physicsButton) {
                ide.controlBar.physicsButton.refresh();
            }
        }
    };

    StageMorph.prototype.stopSimulation = function (norefresh) {
        this.physicsRunning = false;

        if (!norefresh) {
            var ide = this.parentThatIsA(IDE_Morph);
            if (ide && ide.controlBar.physicsButton) {
                ide.controlBar.physicsButton.refresh();
            }
        }
    };

    StageMorph.prototype.phyFireGreenFlagEvent = StageMorph.prototype.fireGreenFlagEvent;
    StageMorph.prototype.fireGreenFlagEvent = function () {
        var r = this.phyFireGreenFlagEvent();
        // this.physicsSimulationTime = 0;
        // this.clearGraphData();
        return r;
    };

    StageMorph.prototype.phyFireStopAllEvent = StageMorph.prototype.fireStopAllEvent;
    StageMorph.prototype.fireStopAllEvent = function () {
        var r = this.phyFireStopAllEvent();
        this.stopSimulation();
        return r;
    };

    // function deltaTime () {
    //     return this.physicsDeltaTime;
    // }
    StageMorph.prototype.deltaTimereport = function () {
        return this.physicsDeltaTime;
    };
    
    StageMorph.prototype.setDeltaTime = function (dt) {
        if (dt == 0){
            throw new Error('\u2206t value is unchanged.');
        }else{
            this.targetDeltaTime = Math.max(dt || 0, 0);
            this.physicsDeltaTime = this.targetDeltaTime;
        }
        
    };
    
    StageMorph.prototype.simulationTimereport = function () {
        return this.physicsSimulationTime;
    };
    
    StageMorph.prototype.simulationStep = function () {
        var i, delta, time,
            hats = this.allHatBlocksForSimulation();
    
        this.children.forEach(function (morph) {
            if (morph.allHatBlocksForSimulation) {
                hats = hats.concat(morph.allHatBlocksForSimulation());
            }
        });
    
        for (i = 0; i < hats.length; i++) {
            if (this.threads.findProcess(hats[i])) {
                return false; // step is still running
            }
        }
    
        time = Date.now(); // in milliseconds
        if (this.physicsLastUpdated) {
            delta = (time - this.physicsLastUpdated) * 0.001;
    
            if (this.targetDeltaTime + 0.01 < delta) {
                if (this.targetDeltaTime > 0.0) {
                    delta = this.targetDeltaTime;
                } else if (delta > 0.2) {
                    delta = 0.2;
                }
    
                //this.recordGraphData();
    
                this.physicsLastUpdated = time;
                this.physicsDeltaTime = delta;
                this.physicsSimulationTime += delta;
                //this.physicsWorld.step(delta);
                //this.updateMorphicPosition();
                for (i = 0; i < hats.length; i++) {
                    this.threads.startProcess(hats[i], this.isThreadSafe);
                }
            }
        } else {
            this.physicsLastUpdated = time;
        }
    
        return true;
    };
    
    StageMorph.prototype.physicsXOrigin = function () {
        return this.physicsOrigin.x;
    };
      
    StageMorph.prototype.physicsYOrigin = function () {
        return this.physicsOrigin.y;
    };
      
    StageMorph.prototype.setPhysicsXOrigin = function (x) {
        this.physicsOrigin.x = x;
        this.setPhysicsFloor(!!this.physicsFloor);
        if (this.coordinateMorph) {
          this.toggleCoordinateAxes();
          this.toggleCoordinateAxes();
        }
    };
      
    StageMorph.prototype.setPhysicsYOrigin = function (y) {
        this.physicsOrigin.y = y;
        this.setPhysicsFloor(!!this.physicsFloor);
        if (this.coordinateMorph) {
          this.toggleCoordinateAxes();
          this.toggleCoordinateAxes();
        }
    };

    StageMorph.prototype.toggleCoordinateAxes = function () {
        if (this.coordinateMorph) {
          this.coordinateMorph.destroy();
          this.coordinateMorph = null;
        } else {
          var size = Math.max(this.width() + 2 * Math.abs(this.physicsOrigin.x * this.scale),
            this.height() + 2 * Math.abs(this.physicsOrigin.y * this.scale)),
            pos = this.center().subtract(0.5 * size);
          pos.x += this.physicsOrigin.x * this.scale;
          pos.y -= this.physicsOrigin.y * this.scale;
          this.coordinateMorph = new SymbolMorph("coordinateAxes", size, new Color(120, 120, 120, 0.3));
          this.coordinateMorph.fixLayout = function () { console.log("fixlayout"); }
          this.add(this.coordinateMorph);
          this.coordinateMorph.setPosition(pos);
        }
    };
      
    StageMorph.prototype.isCoordinateAxesEnabled = function () {
        return !!this.coordinateMorph;
    };

    
    StageMorph.prototype.allHatBlocksForSimulation = SpriteMorph.prototype.allHatBlocksForSimulation;
    
    NetsBloxExtensions.register(simulationExtension);
})();
