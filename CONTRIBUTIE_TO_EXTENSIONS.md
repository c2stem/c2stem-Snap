# custom-SNAP

## Setting up the snap environment.

Checkout repository:


    git clone https://github.com/c2stem/c2stem-Snap.git c2stem-Snap
    cd c2stem-Snap
    

The current changes are in the dev branch of c2stem-Snap. We need to change the branch from master to dev-extensions.


    git checkout dev-extensions


Running the snap on browser:

Open `index.dev.html` in a browser. 'Simulation-extension' should automatically load with the Snap. 

Below is the description of the template and how to use and create new blocks:

#### SpriteMorph, Setting up Blocks:
Blocks can be setup with a json template like earlier, 
[https://github.com/c2stem/c2stem-Snap/blob/a9de6454e9b2091cf20263be9db18820ee9a5230/src/simulation-extension.js#L62](https://github.com/c2stem/c2stem-Snap/blob/a9de6454e9b2091cf20263be9db18820ee9a5230/src/simulation-extension.js#L62 "Link to implementation code")



    	ExtensionName.prototype.getBlocks = () => [
    		new Extension.Block(
    			'block_specification_name',
    			'reporter'/ 'command'/ 'hat',
    			'Category_Name',
    			'name_of _the_block',
    			[]
    	)];
    
example:

    	simulationExtension.prototype.getBlocks = () => [
		new Extension.Block(
			'reportsimulationTime',
			'reporter',
			'Simulation',
			'time in s',
			[]
	)];


We then declare the getters and setters associated with the blocks in SpriteMorph.
[https://github.com/c2stem/c2stem-Snap/blob/a9de6454e9b2091cf20263be9db18820ee9a5230/src/simulation-extension.js#L298](https://github.com/c2stem/c2stem-Snap/blob/a9de6454e9b2091cf20263be9db18820ee9a5230/src/simulation-extension.js#L298)

    SpriteMorph.prototype.testBlock = function () {
    	var stage = this.getStage();
    	return (stage && stage.testBlock()) || 0;
    };
    
	SpriteMorph.prototype.setTest = function (dt) {
    	var stage = this.getStage();
    	if (stage) {
    		stage.setTest(dt);
    	}
    };

#### StageMorph, defining block usage:
We define the functions declared in the SpriteMorph portion of the setup in StageMorph. 
[https://github.com/c2stem/c2stem-Snap/blob/a9de6454e9b2091cf20263be9db18820ee9a5230/src/simulation-extension.js#L504](https://github.com/c2stem/c2stem-Snap/blob/a9de6454e9b2091cf20263be9db18820ee9a5230/src/simulation-extension.js#L504)

    StageMorph.prototype.testBlock = function () {
    	return this.testBlockvalue;
    };
    
	StageMorph.prototype.setTest = function (value) {
    	this.targetTestValue = Math.max(value || 0, 0);
    	this.testBlockvalue = this.targetTestValue;
    };

