// import {observable, toJS, computed, autorun, action, useStrict} from "mobx";
import {observable, computed} from 'mobx'
import {observer} from 'mobx-react'
import {flatMap} from 'lodash'
import {projects} from './data/projects'
import * as OIMO from 'oimo'

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

    @observable world = new OIMO.World({
            timestep: 1/500,
            iterations: 8,
            broadphase: 2,
            worldscale: 1,
            random: true,
            gravity: [0, -9.8, 0]
        })


    @observable physicsBodies = []

    @observable threeMeshes = []

}

export {JLPortfolioStore}

