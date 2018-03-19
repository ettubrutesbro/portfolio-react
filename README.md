
for the 3rd time since i got my first "real" yob, i'm trying to make a portfolio!

using 

* react (create-react-app with custom-react-scripts)
* mobx 
* three (w/ react-three-renderer) 
* oimo, 
* tween, 
* lodash and probably more shit before i'm done

### setup (worked as of 3/19/18)
* `git clone https://github.com/ettubrutesbro/portfolio-react`
* `cd portfolio-react`
* `git checkout reorg`
* `npm install`
* `npm run storybook`

package versions as of working, 3/19: 

* +-- @storybook/addon-knobs@3.3.15
* +-- @storybook/addon-options@3.3.15
* +-- @storybook/react@3.3.15
* +-- @tweenjs/tween.js@16.7.0
* +-- UNMET PEER DEPENDENCY babel-core@^6.26.0 || ^7.0.0-0
* +-- babel-plugin-transform-decorators-legacy@1.3.4
* +-- babel-preset-es2015@6.24.1
* +-- custom-react-scripts@0.0.23
* +-- lodash@4.17.5
* +-- mobx@3.6.2
* +-- mobx-react@4.4.3
* +-- oimo@1.0.9
* +-- prettier@1.11.1
* +-- react@15.6.2
* +-- react-dom@15.6.2
* +-- react-motion@0.5.2
* +-- react-stats@0.0.5
* +-- react-three-renderer@3.2.4
* +-- three@0.86.0



### major branches
* `working-old`: contains the most progress from master before i started setting things up for reorganization in storybook (the time cost of developing w/out storybook seemed to be getting very high)
* `reorg`: contains the latest progress on storybook-involved things - bit broken rn (3/16/18) 

### important
when installing on a new machine, make sure to cd into `node-modules/react-three-renderer` and `npm install` -- r3r needs to contain its own instance of react to work (?)
