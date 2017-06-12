// import {observable, toJS, computed, autorun, action, useStrict} from "mobx";
import {observable, computed} from 'mobx'
import {observer} from 'mobx-react'
import {flatMap} from 'lodash'

class JLPortfolioStore{
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

export {JLPortfolioStore}

