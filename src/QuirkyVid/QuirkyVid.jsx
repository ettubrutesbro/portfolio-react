
import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styles from './QuirkyVid.css'


@observer export default class QuirkyVid extends React.Component{
    //takes multiple video files (raw assets), wraps them in HTML5 video element,
    //gives control over randomized / ordered playback and stopping etc.

    @observable readyclips = this.props.clips.map(()=>{return false})
    @observable playingclip = null

    @action
    aClipLoaded = (i)=>{
        console.log('clip #',i+1,'loaded')
        this.readyclips[i] = true
        if(!this.readyclips.includes(false)){
            if(this.props.loaded) this.props.loaded()
            this.startClip(0)
            console.log('all clips are ready, playing...')
        }
    }
    aClipEnded = (i) =>{
        // console.log('clip',i,'ended')
        if(i===this.props.clips.length-1) this.startClip(0)
        else this.startClip(this.playingclip+1)
    }

    @action
    startClip(clip){
        this.playingclip = clip
        this.refs['clip'+clip].play()
    }

    render(){
        return(
            <div className = {styles.quirkyVid}>
                {this.props.clips.map((clip,i)=>{
                    return(
                        <video 
                            ref={'clip'+i}
                            key={'qvid-'+this.props.id+'-clip-'+i} 
                            className={[
                                styles.clip, 
                                i===this.playingclip?styles.active: ''
                            ].join(' ')} 
                            src={clip} 
                            onEnded={()=>this.aClipEnded(i)} 
                            onLoadedData={()=>this.aClipLoaded(i)} 
                        />
                    )
                })}
            </div>
        )
    }
}

QuirkyVid.defaultProps = {
}