// import {observable, toJS, computed, autorun, action, useStrict} from "mobx";
import {observable, computed} from 'mobx'
import {observer} from 'mobx-react'
import {flatMap} from 'lodash'
// import {projects} from './data/projects'
import {World} from 'oimo'

class JLPortfolioStore{

    @observable projects 

    @observable activesection = null
    @observable scrollposition = 0
    @observable worktop = null
    @computed get userViewingWork(){ return this.scrollposition >= this.worktop }
    @observable loadcontent = {
        //wait until all contents are true 
        //before rendering any page content

        //although, only relevant content should hold up the render
        //so maybe this needs to be modified to reflect viewed section only

        introvideo: false
    }
    @computed get assetsReady(){ return !flatMap(this.loadcontent).includes(false) }

}

class Debug{
    @observable walls = true
    @observable amblight = true
    @observable spotlight = true
    @observable runWorld = true
    @observable physicsMeshes = true
    @observable fps = true
}

class ThreePhysicsStore{
    @observable world = new World({
        broadphase: 3
    })
    @observable bodies = []
    @observable meshes = []
    @observable physicsMeshes = []
    @observable viewableSizingConstant = 8

    //SCARY COLLISION HEX SHIT???
    //belongsTo collision hexes
    @observable belongsToBackWall = 1 << 0
    @observable noCollisionsWithBackWall = 1 << 1
    @observable normalCollisions = 1 << 2
    //collidesWith hexes
    @observable collidesWithAll = 0xffffffff
}

export {JLPortfolioStore, Debug, ThreePhysicsStore}

