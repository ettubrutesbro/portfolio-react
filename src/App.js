import React from 'react'

import Body from './components/core/Body'
import {SendbloomModel} from './components/Sendbloom'
// import Body from './components/core/Bo'
import AscendingCatcher from './components/AscendingCatcher'


export default class App extends React.Component{
    render(){
        return(
            <div>
                
                <AscendingCatcher>
                    <Body
                        name="sendbloom"
                        // exists={showbox}
                        isSelectable
                        showCollider={false}
                        physicsModel={{
                            pos: [0, 10, 0],
                            type: 'box',
                            size: [1, 1, 1],
                        }}
                    >
                        <SendbloomModel />
                    </Body>
                </AscendingCatcher>
            </div>
        )
    }
}