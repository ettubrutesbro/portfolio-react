// import {observable, toJS, computed, autorun, action, useStrict} from "mobx";
import {observable} from 'mobx';
import {observer} from 'mobx-react';

class JLPortfolioStore{
    @observable loadcontent = {
        introvideo: false
    }
}

export {JLPortfolioStore}
