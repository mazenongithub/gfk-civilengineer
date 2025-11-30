import GFK from './gfk'
import { MyStylesheet } from './styles';
class CompactionTable {

    showRow(test) {
        const curveNo = () => this.getcurvenumber(test.curveid);

        return (
            <tr>
                <td style={{ textAlign:'center', border: "1px solid #000", fontSize: "16px" }}>{test.testnum}</td>
                 <td style={{ textAlign:'center', border: "1px solid #000", fontSize: "16px" }}>{test.elevation}</td>
                 <td style={{ textAlign:'center', border: "1px solid #000", fontSize: "16px" }}>{test.location}</td>
                 <td style={{ textAlign:'center', border: "1px solid #000", fontSize: "16px" }}>{test.wetpcf}</td>
                 <td style={{ textAlign:'center', border: "1px solid #000", fontSize: "16px" }}>{test.moistpcf}</td>
                 <td style={{ textAlign:'center', border: "1px solid #000", fontSize: "16px" }}>{test.dryden}</td>
                 <td style={{ textAlign:'center', border: "1px solid #000", fontSize: "16px" }}>{test.moist}</td>
                 <td style={{ textAlign:'center', border: "1px solid #000", fontSize: "16px" }}>{test.maxden}</td>
                 <td style={{ textAlign:'center', border: "1px solid #000", fontSize: "16px" }}>{test.relative}</td>
                 <td style={{ textAlign:'center', border: "1px solid #000", fontSize: "16px" }}>{curveNo()}</td>
            </tr>
        );
    }


    showRows() {
        const compactiontable = new CompactionTable();
        const tests = this.getCompactionTests();
        return Array.isArray(tests) ? tests.map(test => compactiontable.showRow.call(this,test)) : null;
    }



    showCompactionTable() {
        const styles = MyStylesheet();
        const compactiontable = new CompactionTable();
        return (<div style={{ ...styles.generalContainer }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th style={{ width: "5%", border: "1px solid #000", fontSize: "16px" }}>Test No.</th>
                        <th style={{ width: "5%", border: "1px solid #000", fontSize: "16px" }}>El.</th>
                        <th style={{ width: "30%", border: "1px solid #000", fontSize: "16px" }}>Location</th>
                        <th style={{ width: "10%", border: "1px solid #000", fontSize: "16px" }}>Wet Den (pcf)</th>
                        <th style={{ width: "10%", border: "1px solid #000", fontSize: "16px" }}>Moisture (pcf)</th>
                        <th style={{ width: "10%", border: "1px solid #000", fontSize: "16px" }}>Dry Den (pcf)</th>
                        <th style={{ width: "10%", border: "1px solid #000", fontSize: "16px" }}>Moisture %</th>
                        <th style={{ width: "10%", border: "1px solid #000", fontSize: "16px" }}>Max Den (pfc)</th>
                        <th style={{ width: "5%", border: "1px solid #000", fontSize: "16px" }}>%</th>
                        <th style={{ width: "5%", border: "1px solid #000", fontSize: "16px" }}>Curve No.</th>
                    </tr>
                </thead>

                <tbody>
                    {compactiontable.showRows.call(this)}
                </tbody>
            </table>


        </div>)

    }

}

export default CompactionTable;