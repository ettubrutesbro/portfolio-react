
import React from 'react'
import {observable} from 'mobx'
import {observer} from 'mobx-react'
import styles from './QuirkyVid.css'


@observer export default class QuirkyVid extends React.Component{
	//takes multiple video files (raw assets), wraps them in HTML5 video element,
	//gives control over randomized / ordered playback and stopping etc.

	@observable readyclips = this.props.clips.map(()=>{return false})
	@observable playingclip = 0

	aClipLoaded = (i)=>{
		console.log('clip #',i+1,'loaded')
		this.readyclips[i] = true
		if(!this.readyclips.includes(false)){
			console.log('all clips are ready, playing...')
		}
	}
	aClipEnded = (evt) =>{
		console.log(evt)
	}

	render(){
		// console.log('qv render')
		return(
			<div>
				{this.props.clips.map((clip,i)=>{

					return(
						<video 
							key={'qvid-'+this.props.id+'-clip-'+i} 
							className={styles.quirkyVid} 
							src={clip} 
							onEnded={this.aClipEnded} 
							onLoadedData={()=>this.aClipLoaded(i)} 
						/>
					)
				})}
			</div>
		)
	}
}

QuirkyVid.defaultProps = {
	play: false,
}