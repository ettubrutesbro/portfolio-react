
for the 3rd time since i got my first "real" yob, i'm trying to make a portfolio!

using 

* react (create-react-app with custom-react-scripts)
* mobx 
* three (w/ react-three-renderer) 
* oimo, 
* tween, 
* lodash and probably more shit before i'm done

### major branches
* `working-old`: contains the most progress from master before i started setting things up for reorganization in storybook (the time cost of developing w/out storybook seemed to be getting very high)
* `reorg`: contains the latest progress on storybook-involved things - bit broken rn (3/16/18) 

### important
when installing on a new machine, make sure to cd into `node-modules/react-three-renderer` and `npm install` -- r3r needs to contain its own instance of react to work (?)
