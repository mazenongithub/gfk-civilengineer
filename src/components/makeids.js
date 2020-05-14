import GFK from './gfk'
import {makeID} from './functions'

class MakeID {
    laborid() {
        let laborid = false;
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this)
        while(!laborid) {
            laborid = makeID(16)
            if(myuser.hasOwnProperty("actuallabor")) {
                // eslint-disable-next-line
                myuser.actuallabor.mylabor.map(mylabor=> {
                    if(mylabor.laborid === laborid) {
                        laborid = false;
                    }
                })
            }
            

        }
        return laborid;
    }
}

export default MakeID;