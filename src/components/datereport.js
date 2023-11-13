import React from 'react'
import { openDateMenu, closeDateMenu, dateYearDown, dateYearUp, dateMonthDown, dateMonthUp } from './svg'
import {
    formatDateforCalendarDisplay,
    getFirstIsOn,
    check_29_feb_leapyear,
    check_30,
    check_31,
    trailingzero,
    getOffset,
    inputDatePickerOutputDateObj,
    decreaseCalendarDaybyOneYear,
    subtractoneYearDateObj,
    increaseCalendarDayOneMonth,
    addoneMonthDateObj,
    decreaseCalendarDaybyOneMonth,
    subtractMonthDateObj,
    inputSecOutDateString,
    inputDateObjandSecReturnObj,
    increaseCalendarDaybyOneYear,
    addoneYearDateObj,
    inputDateObjOutputCalendarDaySeconds,
    makeDatefromObj,
    inputDateStringOutputSeconds


} from './functions'
import { MyStylesheet } from './styles';
import GFK from './gfk';
class DateReport {

    setDay(dateencoded) {

        const gfk = new GFK();
        if (this.state.activefieldid) {
            const fieldid = this.state.activefieldid;
            let myuser = gfk.getuser.call(this)
            let i = gfk.getfieldreportkeybyid.call(this, fieldid);

            let newtimein = inputSecOutDateString(dateencoded)
          
            myuser.fieldreports[i].datereport = newtimein;
            this.props.reduxUser(myuser)
            this.setState({ render: 'render' })


        }
        else {
            let datereport = inputDateObjandSecReturnObj(dateencoded, this.state.datereport);
            this.setState({ datereport, render: 'render' })
        }


    }
    getactivedate(dateencoded) {
        const gfk = new GFK();
        let activeclass = "";
        if (this.state.activefieldid) {


            const fieldid = this.state.activefieldid;
            const fieldreport = gfk.getfieldreportbyid.call(this, fieldid)
            let timein = fieldreport.datereport;
            if (inputDateStringOutputSeconds(timein) === dateencoded) {
                activeclass = "active-calender"
            }
        }
        else {
            let datereport = this.state.datereport;
            if (inputDateObjOutputCalendarDaySeconds(datereport) === dateencoded) {
                activeclass = "active-calender"
            }

        }

        return activeclass;
    }
    showdate(dateobj, day) {
   
        const Datein = new DateReport();
        let showday = [];
        if (day) {
            let month = dateobj.getMonth() + 1;
            month = trailingzero(month)
            let year = dateobj.getFullYear();
            let dayzero = trailingzero(day);
            let datein = `${year}/${month}/${dayzero}`
            let offset = getOffset(datein)
            let timestring = `${datein} 00:00:00${offset}`;

            let calendardate = new Date(timestring);

            let dateencoded = calendardate.getTime();

            showday.push(<div key={`${dateencoded}a`}
                className={`${Datein.getactivedate.call(this, dateencoded)} calendar-date`}
                onClick={() => { Datein.setDay.call(this, dateencoded) }}
            > {day}</div>)
        }
        return showday;
    }
    showgridcalender(datereport) {
        let gridcalender = [];
        const styles = MyStylesheet();
        const Datein = new DateReport();
        if (Object.prototype.toString.call(datereport) === "[object Date]") {

            let firstison = getFirstIsOn(datereport);
            let days = [];
            let numberofcells = 49;
            for (let i = 1; i < numberofcells + 1; i++) {
                days.push(i);
            }
            // eslint-disable-next-line
            days.map((day, i) => {
                if (i === 0) {
                    gridcalender.push(<div style={{ ...styles.showBorder, ...styles.alignCenter }}>
                        Mon
							</div>)
                }
                else if (i === 1) {
                    gridcalender.push(<div style={{ ...styles.showBorder, ...styles.alignCenter }}>
                        Tues
							</div>)
                }
                else if (i === 2) {
                    gridcalender.push(<div style={{ ...styles.showBorder, ...styles.alignCenter }}>
                        Weds
							</div>)
                }
                else if (i === 3) {
                    gridcalender.push(<div style={{ ...styles.showBorder, ...styles.alignCenter }}>
                        Thurs
							</div>)
                }
                else if (i === 4) {
                    gridcalender.push(<div style={{ ...styles.showBorder, ...styles.alignCenter }}>
                        Fri
							</div>)
                }
                else if (i === 5) {
                    gridcalender.push(<div style={{ ...styles.showBorder, ...styles.alignCenter }}>
                        Sat
							</div>)
                }
                else if (i === 6) {
                    gridcalender.push(<div style={{ ...styles.showBorder, ...styles.alignCenter }}>
                        Sun
							</div>)
                }
                else if (i === 7) {
                    let display = " "
                    switch (firstison) {
                        case "Mon":
                            display = Datein.showdate.call(this, datereport, 1);
                            break;
                        default:
                            break;
                    }
                    gridcalender.push(<div style={{ ...styles.showBorder, ...styles.alignCenter }}>
                        {display}&nbsp;
							</div>)

                }
                else if (i === 8) {
                    let display = " "
                    switch (firstison) {
                        case "Mon":
                            display = Datein.showdate.call(this, datereport, 2);
                            break;
                        case "Tues":
                            display = Datein.showdate.call(this, datereport, 1);
                            break;
                        default:
                            break;
                    }
                    gridcalender.push(<div style={{ ...styles.showBorder, ...styles.alignCenter }}>
                        {display}
                    </div>)
                }

                else if (i === 9) {
                    let display = " "
                    switch (firstison) {
                        case "Mon":
                            display = Datein.showdate.call(this, datereport, 3);
                            break;
                        case "Tues":
                            display = Datein.showdate.call(this, datereport, 2);
                            break;
                        case "Weds":
                            display = Datein.showdate.call(this, datereport, 1);
                            break;
                        default:
                            break;
                    }
                    gridcalender.push(<div style={{ ...styles.showBorder, ...styles.alignCenter }}>
                        {display}
                    </div>)

                }
                else if (i === 10) {
                    let display = " "
                    switch (firstison) {
                        case "Mon":
                            display = Datein.showdate.call(this, datereport, 4);
                            break;
                        case "Tues":
                            display = Datein.showdate.call(this, datereport, 3);
                            break;
                        case "Weds":
                            display = Datein.showdate.call(this, datereport, 2);
                            break;
                        case "Thurs":
                            display = Datein.showdate.call(this, datereport, 1);
                            break;
                        default:
                            break
                    }
                    gridcalender.push(<div style={{ ...styles.showBorder, ...styles.alignCenter }}>
                        {display}
                    </div>)


                }
                else if (i === 11) {
                    let display = " "
                    switch (firstison) {
                        case "Mon":
                            display = Datein.showdate.call(this, datereport, 5);
                            break;
                        case "Tues":
                            display = Datein.showdate.call(this, datereport, 4);
                            break;
                        case "Weds":
                            display = Datein.showdate.call(this, datereport, 3);
                            break;
                        case "Thurs":
                            display = Datein.showdate.call(this, datereport, 2);
                            break;
                        case "Fri":
                            display = Datein.showdate.call(this, datereport, 1);
                            break;
                        default:
                            break;
                    }
                    gridcalender.push(<div style={{ ...styles.showBorder, ...styles.alignCenter }}>
                        {display}
                    </div>)

                }
                else if (i === 12) {
                    let display = " "
                    switch (firstison) {
                        case "Mon":
                            display = Datein.showdate.call(this, datereport, 6);
                            break;
                        case "Tues":
                            display = Datein.showdate.call(this, datereport, 5);
                            break;
                        case "Weds":
                            display = Datein.showdate.call(this, datereport, 4);
                            break;
                        case "Thurs":
                            display = Datein.showdate.call(this, datereport, 3);
                            break;
                        case "Fri":
                            display = Datein.showdate.call(this, datereport, 2);
                            break;
                        case "Sat":
                            display = Datein.showdate.call(this, datereport, 1);
                            break;
                        default:
                            break;
                    }

                    gridcalender.push(<div style={{ ...styles.showBorder, ...styles.alignCenter }}>
                        {display}
                    </div>)


                }
                else if (i >= 13 && i <= 34) {
                    let display = " "
                    switch (firstison) {
                        case "Mon":
                            display = Datein.showdate.call(this, datereport, i - 6);
                            break;
                        case "Tues":
                            display = Datein.showdate.call(this, datereport, i - 7);
                            break;
                        case "Weds":
                            display = Datein.showdate.call(this, datereport, i - 8);
                            break;
                        case "Thurs":
                            display = Datein.showdate.call(this, datereport, i - 9);
                            break;
                        case "Fri":
                            display = Datein.showdate.call(this, datereport, i - 10);
                            break;
                        case "Sat":
                            display = Datein.showdate.call(this, datereport, i - 11);
                            break;
                        case "Sun":
                            display = Datein.showdate.call(this, datereport, i - 12);
                            break;
                        default:
                            break;
                    }


                    gridcalender.push(<div style={{ ...styles.showBorder, ...styles.alignCenter }}>
                        {display}
                    </div>)

                }


                else if (i === 35) {
                    let display = " ";
                    switch (firstison) {
                        case "Mon":
                            display = Datein.showdate.call(this, datereport, check_29_feb_leapyear(datereport));
                            break;
                        case "Tues":
                            display = Datein.showdate.call(this, datereport, 28);
                            break;
                        case "Weds":
                            display = Datein.showdate.call(this, datereport, 27);
                            break;
                        case "Thurs":
                            display = Datein.showdate.call(this, datereport, 26);
                            break;
                        case "Fri":
                            display = Datein.showdate.call(this, datereport, 25);
                            break;
                        case "Sat":
                            display = Datein.showdate.call(this, datereport, 24);
                            break;
                        case "Sun":
                            display = Datein.showdate.call(this, datereport, 23);
                            break;
                        default:
                            break;
                    }
                    gridcalender.push(<div style={{ ...styles.showBorder, ...styles.alignCenter }}>
                        {display}
                    </div>)
                }
                else if (i === 36) {
                    let display = " ";
                    switch (firstison) {
                        case "Mon":
                            display = Datein.showdate.call(this, datereport, check_30(datereport));
                            break;
                        case "Tues":
                            display = Datein.showdate.call(this, datereport, check_29_feb_leapyear(datereport));
                            break;
                        case "Weds":
                            display = Datein.showdate.call(this, datereport, 28);
                            break;
                        case "Thurs":
                            display = Datein.showdate.call(this, datereport, 27);
                            break;
                        case "Fri":
                            display = Datein.showdate.call(this, datereport, 26);
                            break;
                        case "Sat":
                            display = Datein.showdate.call(this, datereport, 25);
                            break;
                        case "Sun":
                            display = Datein.showdate.call(this, datereport, 24);
                            break;
                        default:
                            break;
                    }
                    gridcalender.push(<div style={{ ...styles.showBorder, ...styles.alignCenter }}>
                        {display}
                    </div>)
                }
                else if (i === 37) {
                    let display = " ";
                    switch (firstison) {
                        case "Mon":
                            display = Datein.showdate.call(this, datereport, check_31(datereport));
                            break;
                        case "Tues":
                            display = Datein.showdate.call(this, datereport, check_30(datereport));
                            break;
                        case "Weds":
                            display = Datein.showdate.call(this, datereport, check_29_feb_leapyear(datereport))
                            break;
                        case "Thurs":
                            display = Datein.showdate.call(this, datereport, 28);
                            break;
                        case "Fri":
                            display = Datein.showdate.call(this, datereport, 27);
                            break;
                        case "Sat":
                            display = Datein.showdate.call(this, datereport, 26);
                            break;
                        case "Sun":
                            display = Datein.showdate.call(this, datereport, 25);
                            break;
                        default:
                            break;
                    }
                    gridcalender.push(<div style={{ ...styles.showBorder, ...styles.alignCenter }}>
                        {display}
                    </div>)
                }
                else if (i === 38) {
                    let display = " ";
                    switch (firstison) {
                        case "Mon":
                            break;
                        case "Tues":
                            display = Datein.showdate.call(this, datereport, check_31(datereport));
                            break;
                        case "Weds":
                            display = Datein.showdate.call(this, datereport, check_30(datereport));
                            break;
                        case "Thurs":
                            display = Datein.showdate.call(this, datereport, check_29_feb_leapyear(datereport));
                            break;
                        case "Fri":
                            display = Datein.showdate.call(this, datereport, 28);
                            break;
                        case "Sat":
                            display = Datein.showdate.call(this, datereport, 27);
                            break;
                        case "Sun":
                            display = Datein.showdate.call(this, datereport, 26);
                            break;
                        default:
                            break;
                    }
                    gridcalender.push(<div style={{ ...styles.showBorder, ...styles.alignCenter }}>
                        {display}
                    </div>)
                }
                else if (i === 39) {
                    let display = " ";
                    switch (firstison) {
                        case "Mon":
                            break;
                        case "Tues":
                            break;
                        case "Weds":
                            display = Datein.showdate.call(this, datereport, check_31(datereport));
                            break;
                        case "Thurs":
                            display = Datein.showdate.call(this, datereport, check_30(datereport));
                            break;
                        case "Fri":
                            display = Datein.showdate.call(this, datereport, check_29_feb_leapyear(datereport));
                            break;
                        case "Sat":
                            display = Datein.showdate.call(this, datereport, 28);
                            break;
                        case "Sun":
                            display = Datein.showdate.call(this, datereport, 27);
                            break;
                        default:
                            break;
                    }
                    gridcalender.push(<div style={{ ...styles.showBorder, ...styles.alignCenter }}>
                        {display}
                    </div>)
                }
                else if (i === 40) {
                    let display = " ";
                    switch (firstison) {
                        case "Mon":
                            break;
                        case "Tues":
                            break;
                        case "Weds":
                            break;
                        case "Thurs":
                            display = Datein.showdate.call(this, datereport, check_31(datereport));
                            break;
                        case "Fri":
                            display = Datein.showdate.call(this, datereport, check_30(datereport));
                            break;
                        case "Sat":
                            display = Datein.showdate.call(this, datereport, check_29_feb_leapyear(datereport));
                            break;
                        case "Sun":
                            display = Datein.showdate.call(this, datereport, 28);
                            break;
                        default:
                            break;
                    }
                    gridcalender.push(<div style={{ ...styles.showBorder, ...styles.alignCenter }}>
                        {display}
                    </div>)
                }
                else if (i === 41) {
                    let display = " ";
                    switch (firstison) {
                        case "Mon":
                            break;
                        case "Tues":
                            break;
                        case "Weds":
                            break;
                        case "Thurs":
                            break;
                        case "Fri":
                            display = Datein.showdate.call(this, datereport, check_31(datereport));
                            break;
                        case "Sat":
                            display = Datein.showdate.call(this, datereport, check_30(datereport));
                            break;
                        case "Sun":
                            display = Datein.showdate.call(this, datereport, check_29_feb_leapyear(datereport));
                            break;
                        default:
                            break;
                    }
                    gridcalender.push(<div style={{ ...styles.showBorder, ...styles.alignCenter }}>
                        {display}
                    </div>)
                }
                else if (i === 42) {
                    let display = " ";
                    switch (firstison) {
                        case "Mon":
                            break;
                        case "Tues":
                            break;
                        case "Weds":
                            break;
                        case "Thurs":
                            break;
                        case "Fri":
                            break;
                        case "Sat":
                            display = Datein.showdate.call(this, datereport, check_31(datereport));
                            break;
                        case "Sun":
                            display = Datein.showdate.call(this, datereport, check_30(datereport));
                            break;
                        default:
                            break;
                    }
                    gridcalender.push(<div style={{ ...styles.showBorder, ...styles.alignCenter }}>
                        {display}
                    </div>)
                }
                else if (i === 43) {
                    let display = " ";
                    switch (firstison) {
                        case "Mon":
                            break;
                        case "Tues":
                            break;
                        case "Weds":
                            break;
                        case "Thurs":
                            break;
                        case "Fri":
                            break;
                        case "Sat":
                            break;
                        case "Sun":
                            display = Datein.showdate.call(this, datereport, check_31(datereport));
                            break;
                        default:
                            break;
                    }
                    gridcalender.push(<div style={{ ...styles.showBorder, ...styles.alignCenter }}>
                        {display}
                    </div>)
                }
                else {
                    gridcalender.push(<div style={{ ...styles.showBorder, ...styles.alignCenter }}>
                        &nbsp;
							</div>)
                }
            })
        }
        return gridcalender;
    }
    showgrid() {
        const gfk = new GFK();
        const Datein = new DateReport();
        let showgrid = [];

        // begin show grid
        if (this.state.activefieldid) {
            const fieldid = this.state.activefieldid;
            const fieldreport = gfk.getfieldreportbyid.call(this, fieldid)
            let timein = fieldreport.datereport;

            let datereport = new Date(`${timein.replace(/-/g, '/')} UTC`);

            showgrid.push(Datein.showgridcalender.call(this, datereport))

        }
        else {
            if (this.state.datereport) {

                let datereport = this.state.datereport;

                showgrid.push(Datein.showgridcalender.call(this, datereport))
            }
        }

        return showgrid;


    }

    handleopendatemenu() {
        if (this.state.calender === 'open') {
            return (closeDateMenu())
        } else if (this.state.calender === 'close') {
            return (openDateMenu())
        }

    }
    showCalender() {
        if (this.state.calender === 'open') {
            this.setState({ calender: 'close' })
        } else if (this.state.calender === 'close') {
            this.setState({ calender: 'open' })
        }

    }
    handleChange(value) {
        const gfk = new GFK();
        let myuser = this.getuser();
        if (myuser) {

            if (this.state.activefieldid) {
                const fieldid = this.state.activefieldid;
                let i = gfk.getfieldreportkeybyid.call(this, fieldid);

                let newtimein = value
                myuser.fieldreports[i].datereport = newtimein;
                this.props.reduxUser(myuser)
                this.setState({ render: 'render' })

            }
            else {

                this.setState({ datereport: inputDatePickerOutputDateObj(value) })
            }


        }

    }

    showcalendar() {

        if (this.state.calendar === 'open') {
            this.setState({ calendar: 'closed' })
        } else if (this.state.calendar === 'closed') {
            this.setState({ calendar: 'open' })
        }
    }

    yeardown() {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this)
        if (myuser) {

            if (this.state.activefieldid) {
                const fieldid = this.state.activefieldid;
                const fieldreport = gfk.getfieldreportbyid.call(this, fieldid);
                let timein = fieldreport.datereport;
                let newtime = decreaseCalendarDaybyOneYear(timein);
                let i = gfk.getfieldreportkeybyid.call(this, fieldid);

                myuser.fieldreports[i].datereport = newtime;
                this.props.reduxUser(myuser)
                this.setState({ render: 'render' })
            }
            else {
                let newDate = subtractoneYearDateObj(this.state.datereport);
                this.setState({ datereport: newDate })
            }
        }


    }
    yearup() {


        if (this.state.activefieldid) {
            const gfk = new GFK();
            const myuser = gfk.getuser.call(this)
            const fieldid = this.state.activefieldid;
            const fieldreport = gfk.getfieldreportbyid.call(this, fieldid);
            let timein = fieldreport.datereport;
            let newtimein = increaseCalendarDaybyOneYear(timein);
            let i = gfk.getfieldreportkeybyid.call(this, fieldid);

            myuser.fieldreports[i].datereport = newtimein;
            this.props.reduxUser(myuser);
            this.setState({ render: 'render' })

        }
        else {
            let newDate = addoneYearDateObj(this.state.datereport);
            this.setState({ datereport: newDate })
        }

    }
    increasemonth(event) {
        if (this.state.activefieldid) {
            const gfk = new GFK();
            const myuser = gfk.getuser.call(this)
            const fieldid = this.state.activefieldid;
            const fieldreport = gfk.getfieldreportbyid.call(this, fieldid);
            let timein = fieldreport.datereport;
            let newtimein = increaseCalendarDayOneMonth(timein);
            let i = gfk.getfieldreportkeybyid.call(this, fieldid);

            myuser.fieldreports[i].datereport = newtimein;

            this.props.reduxUser(myuser)
            this.setState({ render: 'render' })

        }
        else {
            let newDate = addoneMonthDateObj(this.state.datereport);
            this.setState({ datereport: newDate })
        }

    }
    decreasemonth() {
        if (this.state.activefieldid) {
            const gfk = new GFK();
            const myuser = gfk.getuser.call(this)
            const fieldid = this.state.activefieldid;
            const fieldreport = gfk.getfieldreportbyid.call(this, fieldid);
            let timein = fieldreport.datereport;
            let i = gfk.getfieldreportkeybyid.call(this, fieldid);
            let newtimein = decreaseCalendarDaybyOneMonth(timein);
            myuser.fieldreports[i].datereport = newtimein;
            this.props.reduxUser(myuser)
            this.setState({ render: 'render' })

        }
        else {
            let newDate = subtractMonthDateObj(this.state.datereport);
            this.setState({ datereport: newDate })
        }
    }
    getvalue() {
        const gfk = new GFK();
        let value = "";
        if (this.state.activefieldid) {
            const fieldid = this.state.activefieldid;
            const fieldreport = gfk.getfieldreportbyid.call(this, fieldid)

            value = fieldreport.datereport;


        }
        else {
            value = makeDatefromObj(this.state.datereport)

        }
        return value;

    }

    showdateforcalendar() {
        const gfk = new GFK();
        if (this.state.activefieldid) {

            const fieldid = this.state.activefieldid;
            const fieldreport = gfk.getfieldreportbyid.call(this, fieldid)

            let timein = fieldreport.datereport;
            let datereport = new Date(`${timein.replace(/-/g, '/')}-00:00`);
            return (formatDateforCalendarDisplay(datereport))
        }
        else

            return (formatDateforCalendarDisplay(this.state.datereport))


    }
    showdatemenu() {
        const styles = MyStylesheet();
        const Datein = new DateReport();
        const gfk = new GFK();
        const smallFont = gfk.getSmallFont.call(this);
        if (this.state.calender === 'open') {
            return (
                <div style={{ ...styles.generalFlex }}>
                    <div style={{ ...styles.flex1 }}>
                        <div style={{ ...styles.generalFlex, ...styles.generalFont, ...smallFont, ...styles.calendarContainer, ...styles.marginAuto }}>
                            <div style={{ ...styles.flex1 }}>
                                <button style={{ ...styles.dateButton, ...styles.generalButton }}
                                    onClick={() => { Datein.yeardown.call(this) }}> {dateYearDown()}</button>
                            </div>
                            <div style={{ ...styles.flex1 }}>
                                <button style={{ ...styles.dateButton, ...styles.generalButton }}
                                    onClick={() => { Datein.decreasemonth.call(this) }}>{dateMonthDown()} </button>
                            </div>
                            <div style={{ ...styles.flex2, ...styles.smallFont, ...styles.alignCenter }}>
                                {Datein.showdateforcalendar.call(this)}
                            </div>
                            <div style={{ ...styles.flex1 }}>
                                <button style={{ ...styles.dateButton, ...styles.generalButton }}
                                    onClick={() => { Datein.increasemonth.call(this) }}>{dateMonthUp()} </button>
                            </div>
                            <div style={{ ...styles.flex1 }}>
                                <button style={{ ...styles.dateButton, ...styles.generalButton }}
                                    onClick={() => { Datein.yearup.call(this) }}> {dateYearUp()}</button>
                            </div>

                        </div>

                        <div style={{ ...styles.generalFlex }}>
                            <div style={{ ...styles.flex1, ...styles.generalFont, ...smallFont }}>

                                <div className="calendar-grid">
                                    {Datein.showgrid.call(this)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)

        }

    }

    showdatein() {
        const styles = MyStylesheet();
        const gfk = new GFK()
        const regularFont = gfk.getRegularFont.call(this);
        const Datein = new DateReport();
        const smallFont = gfk.getSmallFont.call(this)


        return (
            <div style={{ ...styles.generalFlex }}>
                <div style={{ ...styles.flex1, ...styles.calenderContainer }}>

                    <div style={{ ...styles.dateinContainer, ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex5, ...regularFont, ...styles.generalFont }}>
                            Date Report  <input type="date"
                                value={Datein.getvalue.call(this)}
                                style={{ ...styles.generalField, ...regularFont, ...styles.generalFont }}
                                onChange={event => { Datein.handleChange.call(this, event.target.value) }} />
                        </div>
                        <div style={{ ...styles.flex1, ...smallFont, ...styles.generalFont }}>
                            <button style={{ ...styles.dateButton, ...styles.generalButton }}
                                onClick={() => { Datein.showCalender.call(this) }}
                                id="btn-opendatemenu">
                                {Datein.handleopendatemenu.call(this)}
                            </button>
                        </div>
                    </div>

                    {Datein.showdatemenu.call(this)}

                </div>
            </div>
        )

    }

}
export default DateReport;