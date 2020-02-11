import React from 'react';
import { MyStylesheet } from './styles';
import GFK from './gfk'
class CurveID {

    showsearchresult(curve) {
        return (
            <option value={curve.curveid}>{curve.curvenumber} {curve.description} {curve.maxden}pcf @ {curve.moist}%
             </option>
        )
    }
    showmenu(projectid) {
        const gfk = new GFK();
        const curveid = new CurveID();
        let searchresults = [];
        searchresults.push(<option value={false}>Select A Curve </option>)
        const curves = gfk.getcurves.call(this)

        if (curves) {
            // eslint-disable-next-line
            curves.map(curve => {

                if (curve.projectid === projectid) {
                    searchresults.push(curveid.showsearchresult.call(this, curve))
                }
            })
        }

        return searchresults;
    }

    showcurveid(projectid) {
        const gfk = new GFK();
        const styles = MyStylesheet();
        const smallFont = gfk.getSmallFont.call(this)
        const curveid = new CurveID();

        return (<select value={this.getcurveid()}
            onChange={event => { this.handlecurveid(event.target.value) }} style={{ ...styles.generalField, ...smallFont }}>
            {curveid.showmenu.call(this, projectid)}
        </select>)
    }

}
export default CurveID