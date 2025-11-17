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
    const curveid = new CurveID();
    const curves = new GFK().getcurves.call(this, projectid) || [];

    return [
        <option key="none" value={false}>Select A Curve</option>,
        ...curves.map(curve => curveid.showsearchresult.call(this, curve))
    ];
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