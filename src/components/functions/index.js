export function formatDateforCalendarDisplay(datein) {
    let month = getmonth(datein);
    let year = datein.getFullYear();
    return (`${month} ${year}`)
}
export function getmonth(dateobj) {

    let month = dateobj.getMonth();
    switch (month) {
        case 0:
            return ("January");
        case 1:
            return ("February");
        case 2:
            return ("March");
        case 3:
            return ("April");
        case 4:
            return ("May");
        case 5:
            return ("June");
        case 6:
            return ("July");
        case 7:
            return ("August");
        case 8:
            return ("September");
        case 9:
            return ("October");
        case 10:
            return ("November");
        case 11:
            return ("December");
        default:
            break;
    }
}

export function formatDateReport(datestring) {
    datestring = datestring.replace(/-/g, '/');
    let dateob = new Date(datestring);

    let offset = dateob.getTimezoneOffset();
    offset = offset * 60 * 1000;

    let gettime = dateob.getTime() + offset;
    let dateobj = new Date(gettime);
    let month = Number(dateob.getMonth());
    let datereport = "";
    switch (month) {
        case 0:
            datereport += "January";
            break;
        case 1:
            datereport += "February";
            break;
        case 2:
            datereport += "March";
            break;
        case 3:
            datereport += "April";
            break;
        case 4:
            datereport += "May";
            break;
        case 5:
            datereport += "June";
            break;
        case 6:
            datereport += "July";
            break;
        case 7:
            datereport += "August";
            break;
        case 8:
            datereport += "September";
            break;
        case 9:
            datereport += "October";
            break;
        case 10:
            datereport += "November";
            break;
        case 11:
            datereport += "December";
            break;
        default:
            break;
    }
    let day = dateobj.getDate();
    let year = dateobj.getFullYear();
    return `${datereport} ${day}, ${year}`

}

export function getFirstIsOn(mydate) {
    let monthdisplay = mydate.getMonth() + 1;
    let fullyear = mydate.getFullYear();
    let thefirstofthemonth = new Date(`${fullyear}/${monthdisplay}/1`);
    let firstday = thefirstofthemonth.getDay();
    switch (firstday) {
        case 0:
            return "Sun";
        case 1:
            return "Mon";
        case 2:
            return "Tues";
        case 3:
            return "Weds";
        case 4:
            return "Thurs";
        case 5:
            return "Fri";
        case 6:
            return "Sat";
        default:
            return;
    }
}
export function check_29_feb_leapyear(dateobj) {
    let month = dateobj.getMonth();

    if (month === 1) {
        let year = dateobj.getFullYear();
        if (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) {
            return 29;
        }
        else {
            return;
        }
    }
    else {
        return 29;
    }

}
export function CreateSieve(sampleid, wgt34, wgt38, wgt4, wgt10, wgt30, wgt40, wgt100, wgt200) {
    return ({ sampleid, wgt34, wgt38, wgt4, wgt10, wgt30, wgt40, wgt100, wgt200 })
}
export function Sample(sampleid, boringid, sampledepth, depth, samplenumber, sampleset, diameter, samplelength, description, uscs, spt, sptlength, wetwgt, wetwgt_2, drywgt, tarewgt, tareno, graphiclog, ll, pi, remarks) {
    return ({ sampleid, boringid, sampledepth, depth, samplenumber, sampleset, diameter, samplelength, description, uscs, spt,sptlength, wetwgt, wetwgt_2, drywgt, tarewgt, tareno, graphiclog, ll, pi, remarks })
}
export function CreateImage(imageid, image, caption, fieldid) {
    return ({ imageid, image, caption, fieldid })

}
export function Boring(boringid, projectid, boringnumber, datedrilled, gwdepth, elevation, drillrig, loggedby, latitude, longitude, diameter) {
    return { boringid, projectid, boringnumber, datedrilled, gwdepth, elevation, drillrig, loggedby, latitude, longitude, diameter }
}



export function inputDateSecActiveIDTimein(dateencoded, timein) {
    let newDate = new Date(dateencoded)
    let offset = newDate.getTimezoneOffset() / 60;
    let sym = "";
    if (offset < 0) {
        offset = -offset;
        sym = "+"
    }
    else {
        sym = "-"
    }
    if (offset < 10) {
        offset = `0${offset}`
    }

    let datein = new Date(`${timein.replace(/-/g, '/')}-00:00`);
    let month = newDate.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`
    }
    let day = newDate.getDate();
    if (day < 10) {
        day = `0${day}`
    }
    let year = newDate.getFullYear();

    let hours = datein.getHours();
    if (hours < 10) {
        hours = `0${hours}`
    }
    let minutes = datein.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    let seconds = datein.getSeconds();
    if (seconds < 10) {
        seconds = `0${seconds}`
    }
    let fakedate = new Date(`${year}/${month}/${day} ${hours}:${minutes}:${seconds}${sym}${2 * offset}:00`)
    hours = fakedate.getHours();
    if (hours < 10) {
        hours = `0${hours}`
    }
    minutes = fakedate.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    seconds = fakedate.getSeconds();
    if (seconds < 10) {
        seconds = `0${seconds}`
    }
    month = fakedate.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`
    }
    year = fakedate.getFullYear();
    day = fakedate.getDate();
    if (day < 10) {
        day = `0${day}`
    }
    return (`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`)
}

export function inputtimeDBoutputCalendarDaySeconds(timein) {

    let datein = new Date(`${timein.replace(/-/g, '/')} UTC`);
    let month = datein.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`
    }
    let date = datein.getDate();
    if (date < 10) {
        date = `0${date}`
    }
    let year = datein.getFullYear();
    let offset = getOffsetTime(timein);
    let newDate = new Date(`${year}/${month}/${date} 00:00:00${offset}`)
    return (newDate.getTime())
}
export function check_31(dateobj) {
    let month = dateobj.getMonth();
    if (month === 0 || month === 2 || month === 4 || month === 6 || month === 7 || month === 9 || month === 11) {
        return 31;
    }
}

export function AMPMfromTimeIn(timein) {
    let datein = new Date(`${timein.replace(/-/g, '/')} UTC`);
    let hours = datein.getHours();
    let ampm = "";
    if (hours >= 12) {
        ampm = "PM"
    } else {
        ampm = "AM"
    }
    return (ampm)
}
export function getOffsetTime(timein) {
    let datein = new Date(`${timein.replace(/-/g, '/')} UTC`)
let offset = datein.getTimezoneOffset() / 60;

    let sym = "+";
    if (offset > 0) {
        sym = "-";
    }
    if (Math.abs(offset) < 10) {
        offset = `0${offset}`
    }
 return(`${sym}${offset}:00`)

}

export function moist (drywgt,tarewgt, wetwgt,wetwgt_2) {
    let wgtwater = 0;
    let netweight = Number(drywgt) - Number(tarewgt)

    if (Number(wetwgt_2) > 0) {
        wgtwater = Number(wetwgt_2) - Number(drywgt)

    } else {
        wgtwater = Number(wetwgt) - Number(drywgt);

    }
    if ((wgtwater / netweight) > 0) {
        return (wgtwater / netweight)
    } else {
        return 0;
    }

}

export function  netwgt_1 (wetwgt_2, wetwgt,tarewgt, drywgt) {
    let netwgt_1 = 0
    if (Number(wetwgt_2) > 0) {
         netwgt_1 = (Number(wetwgt) - Number(tarewgt)) / (1 + moist(drywgt,tarewgt, wetwgt,wetwgt_2))
        
    }
    return netwgt_1;
}
export function netwgt (drywgt,tarewgt) {
    if (Number(drywgt) && Number(tarewgt) > 0) {
        return (Number(drywgt) - Number(tarewgt));
    } else {
        return 0;
    }
}

export function calcdryden (wetwgt_2, wetwgt, tarewgt, drywgt, diameter,samplelength) {
    let netweight = 0;
    if (Number(wetwgt_2) > 0) {
        netweight = netwgt_1(wetwgt_2, wetwgt,tarewgt, drywgt)
    } else {
        netweight = netwgt(drywgt,tarewgt);
    }
    if (netweight > 0 && diameter > 0 && samplelength > 0) {
        return Math.round(Number((netweight / (.25 * Math.pow(Number(diameter), 2) * Math.PI * Number(samplelength))) * (1 / 453.592) * (144 * 12)))
    } else {
        return 0;
    }
}
export function CreateTime(laborid,projectid,timein,timeout,traveltimein,traveltimeout,description,invoiceid) {
    return({laborid,projectid,timein,timeout,traveltimein,traveltimeout,description,invoiceid})
}
export function getOffset(timein) {
    let datein = new Date(`${timein.replace(/-/g, '/')} 00:00:00`)
let offset = datein.getTimezoneOffset() / 60;

    let sym = "+";
    if (offset > 0) {
        sym = "-";
    }
    if (Math.abs(offset) < 10) {
        offset = `0${offset}`
    }
 return(`${sym}${offset}:00`)

}
export function check_30(dateobj) {
    let month = dateobj.getMonth();
    if (month !== 1) {
        return 30;
    }
}
export function trailingzero(num) {
    let reg_ex = /^0\d$/;
    var test = reg_ex.test(num.toString());

    if (!test) {
        if (Number(num) < 10) {
            return `0${Number(num)}`;
        }
        else {
            return num;
        }
    }
    else {
        return num;
    }
}
export function inputDatePickerOutputDateObj(value) {

    let offset = new Date().getTimezoneOffset() / 60
    let sym = "+";
    if (offset > 0) {
        sym = "-";
    }
    if (Math.abs(offset) < 10) {
        offset = `0${offset}`
    }

    let newDate = new Date(`${value.replace(/-/g, '-')} 00:00:00${sym}${offset}:00`)
    return newDate;
}
export function decreaseCalendarDaybyOneYear(timein) {
    let offset = getOffsetTime(timein);
    let datein = new Date(`${timein.replace(/-/g, '/')} 00:00:00${offset}`)
    let currentYear = datein.getFullYear();
    let decreaseYear = currentYear - 1;
    let month = datein.getMonth() + 1;
    let day = datein.getDate();
    if (month < 10) {
        month = `0${month}`
    }
    if (day < 10) {
        day = `0${day}`
    }
    let newDate = `${decreaseYear}-${month}-${day}`
    return (newDate)
}
export function subtractoneYearDateObj(datein) {
    let month = datein.getMonth();
    let year = datein.getFullYear();
    year = year - 1;

    let date = datein.getDate();
    let hours = datein.getHours();
    month = month + 1
    if (month < 10) {
        month = `0${month}`
    }
    date = datein.getDate();
    if (date < 10) {
        date = `0${date}`
    }
    hours = datein.getHours();
    if (hours < 10) {
        hours = `0${hours}`
    }
    let minutes = datein.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    let seconds = datein.getSeconds();
    if (seconds < 10) {
        seconds = `0${seconds}`
    }


    return (new Date(`${year}/${month}/${date} ${hours}:${minutes}:${seconds}`))
}
export function increaseCalendarDayOneMonth(timein) {
    let offset = getOffsetTime(timein);
    let datein = new Date(`${timein.replace(/-/g, '/')} 00:00:00${offset}`)
    let currentMonth = datein.getMonth() + 1;
    let year = datein.getFullYear();
    let increaseMonth = currentMonth;
    if (currentMonth === 12) {
        increaseMonth = 1;
        year += 1
    } else {
        increaseMonth += 1;
    }

    let day = datein.getDate();
    if (increaseMonth < 10) {
        increaseMonth = `0${increaseMonth}`
    }

    if (day < 10) {
        day = `0${day}`
    }

    let newDate = `${year}-${increaseMonth}-${day}`
    return (newDate)
}

export function decreaseDateStringByOneMonth(timein) {
    let offset = new Date().getTimezoneOffset() / 60;
    let sym = "";
    if (offset > 0) {
        sym = "-";
    }
    else {
        sym = "+";
        offset = -offset;
    }

    let datein = new Date(`${timein.replace(/-/g, '/')}${sym}${offset}:00`);
    let month = datein.getMonth();
    let year = datein.getFullYear();
    if (month === 0) {
        month = 11;
        year = year - 1;
    }
    else {
        month = month - 1;
    }

    let date = datein.getDate();
    let hours = datein.getHours();
    month = month + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    date = datein.getDate();
    if (date < 10) {
        date = `0${date}`;
    }
    hours = datein.getHours();
    if (hours < 10) {
        hours = `0${hours}`;
    }
    let minutes = datein.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    let seconds = datein.getSeconds();
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    return (`${year}-${month}-${date} ${hours}:${minutes}:${seconds}`);
}

export function addoneMonthDateObj(datein) {
    let month = datein.getMonth();
    let year = datein.getFullYear();
    if (month === 11) {
        month = 0;
        year = year + 1;
    }
    else {
        month = month + 1;
    }

    let date = datein.getDate();
    let hours = datein.getHours();
    month = month + 1
    if (month < 10) {
        month = `0${month}`
    }
    date = datein.getDate();
    if (date < 10) {
        date = `0${date}`
    }
    hours = datein.getHours();
    if (hours < 10) {
        hours = `0${hours}`
    }
    let minutes = datein.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    let seconds = datein.getSeconds();
    if (seconds < 10) {
        seconds = `0${seconds}`
    }


    return (new Date(`${year}/${month}/${date} ${hours}:${minutes}:${seconds}`))
}

export function inputTimeDateOutputUTCString(timein) {
    let offset = new Date().getTimezoneOffset() / 60;
    let sym = "";

    if (offset > 0) {
        sym = "-";
    }
    else {
        sym = "+";

    }
    if (Math.abs(offset) < 10) {
        offset = `0${offset}`
    }
    let dates = timein.split('T');
    let datein = dates[0];
    timein = dates[1];

    let newDate = new Date(`${datein.replace(/-/g, '/')} ${timein}:00${sym}${offset}:00`)
    let newDatesec = newDate.getTime();
    let offsetsec = newDate.getTimezoneOffset() * (60 * 1000)
    let fakedate = new Date(newDatesec + offsetsec)
    let year = fakedate.getFullYear()
    let month = fakedate.getMonth() + 1;
    let date = fakedate.getDate();
    let hours = fakedate.getHours();
    if (month < 10) {
        month = `0${month}`;
    }

    if (date < 10) {
        date = `0${date}`;
    }

    if (hours < 10) {
        hours = `0${hours}`;
    }
    let minutes = fakedate.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    let seconds = fakedate.getSeconds();
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }
    return (`${year}-${month}-${date} ${hours}:${minutes}:${seconds}`);
}

export function inputUTCStringAddOffsetString(timein) {

    let datein = new Date(`${timein.replace(/-/g, '/')}-00:00`)
    let fullyear = datein.getFullYear();
    let month = datein.getMonth() + 1
    let date = datein.getDate();
    let hours = datein.getHours();
    fullyear = datein.getFullYear();
    month = datein.getMonth() + 1
    if (month < 10) {
        month = `0${month}`
    }
    date = datein.getDate();
    if (date < 10) {
        date = `0${date}`
    }
    hours = datein.getHours();
    if (hours < 10) {
        hours = `0${hours}`
    }
    let minutes = datein.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    let seconds = datein.getSeconds();
    if (seconds < 10) {
        seconds = `0${seconds}`
    }


    return (`${fullyear}-${month}-${date} ${hours}:${minutes}:${seconds}`)

}


export function inputDateObjOutputCalendarString(datein) {

    let month = datein.getMonth() + 1;
    let day = datein.getDate();
    let hours = datein.getHours();
    let ampm = 'AM'
    if (hours > 12) {
        hours = hours - 12;
        ampm = 'PM'
    }
    let minutes = datein.getMinutes();
    let year = datein.getFullYear();
    if (month < 10) {
        month = `0${month}`
    }
    if (day < 10) {
        day = `0${day}`
    }

    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    return (`${month}/${day}/${year} ${hours}:${minutes} ${ampm}`)
}
export function inputDateTimeOutDateObj(timein) {

    let newDate = new Date(`${timein.replace(/-/g, '/')} UTC`);
    return (newDate)
}
export function inputDateObjOutputString(dateobj) {
    let day = dateobj.getDate();
    let year = dateobj.getFullYear();
    let hours = dateobj.getHours();
    let month = dateobj.getMonth() + 1;
    hours = trailingzero(hours);
    let minutes = dateobj.getMinutes();
    minutes = trailingzero(minutes);
    let dayzero = trailingzero(day);
    month = trailingzero(month)
    let timestring = `${year}-${month}-${dayzero}T${hours}:${minutes}`;
    return timestring;
}

export function toggleAMDateObj(datein) {
    let hours = datein.getHours();
    let newDate = {};
    if (hours > 12) {
        newDate = new Date(datein.getTime() - (1000 * 60 * 60 * 12))
    }
    else {
        newDate = new Date(datein.getTime() + (1000 * 60 * 60 * 12))
    }
    return (newDate)

}


export function toggleAMTimeString(timein) {
    let datein = new Date(`${timein.replace(/-/g, '/')} UTC`)
    let hours = datein.getHours();
    let newDate = {};
    if (hours > 12) {
        newDate = new Date(datein.getTime() - (1000 * 60 * 60 * 12))
    }
    else {
        newDate = new Date(datein.getTime() + (1000 * 60 * 60 * 12))
    }
    let year = newDate.getFullYear();

    let month = newDate.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`
    }
    hours = newDate.getHours()


    let day = newDate.getDate()
    if (day < 10) {
        day = `0${day}`
    }
    let minutes = newDate.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    let offset = 2 * new Date().getTimezoneOffset() / 60
    let sym = "+";
    if (offset > 0) {
        sym = "-";
    }
    if (Math.abs(offset) < 10) {
        offset = `0${offset}`
    }
    offset = `${sym}${offset}:00`
    let UTCDate = new Date(`${year}-${month}-${day} ${hours}:${minutes}:00${offset}`)
    hours = UTCDate.getHours()
    if (hours < 10) {
        hours = `0${hours}`
    }
    month = UTCDate.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`
    }
    day = UTCDate.getDate();
    if (day < 10) {
        day = `0${day}`
    }
    year = UTCDate.getFullYear();
    return (`${year}-${month}-${day} ${hours}:${minutes}:00`)

}

export function inputTimeInDateStringforPicker(timein) {
    let dateobj = new Date(`${timein.replace(/-/g, '/')}-00:00`)


    let day = dateobj.getDate();
    let year = dateobj.getFullYear();
    let hours = dateobj.getHours();
    let month = dateobj.getMonth() + 1;
    hours = trailingzero(hours);
    let minutes = dateobj.getMinutes();
    minutes = trailingzero(minutes);
    let dayzero = trailingzero(day);
    month = trailingzero(month)
    let timestring = `${year}-${month}-${dayzero}T${hours}:${minutes}`;
    return timestring;
}

export function addincDateObj(datein, inc) {
    return (new Date(datein.getTime() + inc))
}

export function increasedateStringbyInc(timein, inc) {

    let offset = new Date().getTimezoneOffset() / 60;
    let sym = "";
    if (offset > 0) {
        sym = "-";
    }
    else {
        sym = "+";
        offset = -offset;
    }

    let datein = new Date(`${timein.replace(/-/g, '/')}${sym}${offset}:00`);
    let newdate = new Date(datein.getTime() + inc)

    let month = newdate.getMonth();
    let year = newdate.getFullYear();

    let date = newdate.getDate();
    let hours = newdate.getHours();
    month = month + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    date = newdate.getDate();
    if (date < 10) {
        date = `0${date}`;
    }
    hours = newdate.getHours();
    if (hours < 10) {
        hours = `0${hours}`;
    }
    let minutes = newdate.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    let seconds = newdate.getSeconds();
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }
    return (`${year}-${month}-${date} ${hours}:${minutes}:${seconds}`);
}

export function subtractincDateObj(datein, inc) {
    return (new Date(datein.getTime() - inc))
}

export function decreasedateStringbyInc(timein, inc) {

    let offset = new Date().getTimezoneOffset() / 60;
    let sym = "";
    if (offset > 0) {
        sym = "-";
    }
    else {
        sym = "+";
        offset = -offset;
    }

    let datein = new Date(`${timein.replace(/-/g, '/')}${sym}${offset}:00`);
    let newdate = new Date(datein.getTime() - inc)

    let month = newdate.getMonth();
    let year = newdate.getFullYear();

    let date = newdate.getDate();
    let hours = newdate.getHours();
    month = month + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    date = newdate.getDate();
    if (date < 10) {
        date = `0${date}`;
    }
    hours = newdate.getHours();
    if (hours < 10) {
        hours = `0${hours}`;
    }
    let minutes = newdate.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    let seconds = newdate.getSeconds();
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }
    return (`${year}-${month}-${date} ${hours}:${minutes}:${seconds}`);
}

export function decreaseCalendarDaybyOneMonth(timein) {
    let offset = getOffsetTime(timein);
    let datein = new Date(`${timein.replace(/-/g, '/')} 00:00:00${offset}`)
    let currentMonth = datein.getMonth() + 1;
    let year = datein.getFullYear();
    let decreaseMonth = currentMonth;
    if (currentMonth === 1) {
        decreaseMonth = 12;
        year -= 1
    } else {
        decreaseMonth -= 1;
    }

    let day = datein.getDate();
    if (decreaseMonth < 10) {
        decreaseMonth = `0${decreaseMonth}`
    }

    if (day < 10) {
        day = `0${day}`
    }

    let newDate = `${year}-${decreaseMonth}-${day}`
    return (newDate)
}



export function decreaseDateStringByOneYear(timein) {
    let offset = new Date().getTimezoneOffset() / 60;
    let sym = "";
    if (offset > 0) {
        sym = "-";
    }
    else {
        sym = "+";
        offset = -offset;
    }

    let datein = new Date(`${timein.replace(/-/g, '/')}${sym}${offset}:00`);
    let month = datein.getMonth();
    let year = datein.getFullYear();
    year = year - 1;

    let date = datein.getDate();
    let hours = datein.getHours();
    month = month + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    date = datein.getDate();
    if (date < 10) {
        date = `0${date}`;
    }
    hours = datein.getHours();
    if (hours < 10) {
        hours = `0${hours}`;
    }
    let minutes = datein.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    let seconds = datein.getSeconds();
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    return (`${year}-${month}-${date} ${hours}:${minutes}:${seconds}`);
}

export function addoneYearDateObj(datein) {
    let month = datein.getMonth();
    let year = datein.getFullYear();
    year = year + 1;

    let date = datein.getDate();
    let hours = datein.getHours();
    month = month + 1
    if (month < 10) {
        month = `0${month}`
    }
    date = datein.getDate();
    if (date < 10) {
        date = `0${date}`
    }
    hours = datein.getHours();
    if (hours < 10) {
        hours = `0${hours}`
    }
    let minutes = datein.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    let seconds = datein.getSeconds();
    if (seconds < 10) {
        seconds = `0${seconds}`
    }


    return (new Date(`${year}/${month}/${date} ${hours}:${minutes}:${seconds}`))
}
export function increaseDateStringByOneYear(timein) {
    let offset = new Date().getTimezoneOffset() / 60;
    let sym = "";
    if (offset > 0) {
        sym = "-";
    }
    else {
        sym = "+";
        offset = -offset;
    }

    let datein = new Date(`${timein.replace(/-/g, '/')}${sym}${offset}:00`);
    let month = datein.getMonth();
    let year = datein.getFullYear();
    year = year + 1;

    let date = datein.getDate();
    let hours = datein.getHours();
    month = month + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    date = datein.getDate();
    if (date < 10) {
        date = `0${date}`;
    }
    hours = datein.getHours();
    if (hours < 10) {
        hours = `0${hours}`;
    }
    let minutes = datein.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    let seconds = datein.getSeconds();
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    return (`${year}-${month}-${date} ${hours}:${minutes}:${seconds}`);
}

export function subtractMonthDateObj(datein) {
    let month = datein.getMonth();
    let year = datein.getFullYear();
    if (month === 0) {
        month = 11;
        year = year - 1;
    }
    else {
        month = month - 1;
    }

    let date = datein.getDate();
    let hours = datein.getHours();
    month = month + 1
    if (month < 10) {
        month = `0${month}`
    }
    date = datein.getDate();
    if (date < 10) {
        date = `0${date}`
    }
    hours = datein.getHours();
    if (hours < 10) {
        hours = `0${hours}`
    }
    let minutes = datein.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    let seconds = datein.getSeconds();
    if (seconds < 10) {
        seconds = `0${seconds}`
    }


    return (new Date(`${year}/${month}/${date} ${hours}:${minutes}:${seconds}`))
}
export function inputSecOutDateString(dateencoded) {
    const newDate = new Date(dateencoded)
    let year = newDate.getFullYear();
    let month = newDate.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`
    }
    let day = newDate.getDate();
    if (day < 10) {
        day = `0${day}`
    }
    return (`${year}-${month}-${day}`)
}
export function inputDateObjandSecReturnObj(dateencoded, datein) {
    let newDate = new Date(dateencoded);
    let month = newDate.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`
    }
    let day = newDate.getDate();
    if (day < 10) {
        day = `0${day}`
    }
    let year = newDate.getFullYear();
    if (year < 10) {
        year = `0${year}`
    }
    let hours = datein.getHours();
    if (hours < 10) {
        hours = `0${hours}`
    }
    let minutes = datein.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    let seconds = datein.getSeconds();
    if (seconds < 10) {
        seconds = `0${seconds}`
    }
    let sym = "";
    let offset = new Date().getTimezoneOffset() / 60;
    if (offset < 0) {
        offset = -offset;
        sym = "+"
    }
    else {
        sym = "-"
    }
    if (offset < 10) {
        offset = `0${offset}`
    }

    newDate = new Date(`${month}/${day}/${year} ${hours}:${minutes}:${seconds}${sym}${offset}:00`)
    return newDate;
}

export function increaseCalendarDaybyOneYear(timein) {
    let offset = getOffsetTime(timein);
    let datein = new Date(`${timein.replace(/-/g, '/')} 00:00:00${offset}`)
    let currentYear = datein.getFullYear();
    let increaseYear = currentYear + 1;
    let month = datein.getMonth() + 1;
    let day = datein.getDate();
    if (month < 10) {
        month = `0${month}`
    }
    if (day < 10) {
        day = `0${day}`
    }
    let newDate = `${increaseYear}-${month}-${day}`
    return (newDate)
}



export function inputDateObjOutputCalendarDaySeconds(datein) {
    let offset = datein.getTimezoneOffset() / 60;
    let sym = "";
    if (offset < 0) {
        offset = -offset;
        sym = "+";
    }
    if (offset < 10) {
        offset = `0${offset}`
        sym = "-";
    }
    else {
        sym = "-";
    }

    let month = datein.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`
    }
    let day = datein.getDate();
    if (day < 10) {
        day = `0${day}`
    }
    let year = datein.getFullYear();
    let dateinsec = new Date(`${month}/${day}/${year} 00:00:00${sym}${offset}:00`).getTime();
    return dateinsec;
}
export function makeUTCStringCurrentTime(datereport) {
    //let datereport = '2020-02-10';

    let currentDate = new Date();
    let month = currentDate.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`
    }
    let day = currentDate.getDate();
    if (day < 10) {
        day = `0${day}`
    }
    let year = currentDate.getFullYear();

    let offset = currentDate.getTimezoneOffset() / 60;
    let sym = "";
    if (offset < 0) {
        offset = -offset;
        sym = "+"
    } else {
        sym = "-"
    }
    if (offset < 10) {
        offset = `0${offset}`
    }
    let hours = currentDate.getHours();
    if (hours < 10) {
        hours = `0${hours}`
    }
    let minutes = currentDate.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    let seconds = currentDate.getSeconds();
    if (seconds < 10) {
        seconds = `0${seconds}`
    }
    const datestring = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}${sym}${2 * offset}:00`;

    const newDate = new Date(datestring)
    hours = newDate.getHours();
    month = newDate.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`
    }
    day = newDate.getDate();
    if (day < 10) {
        day = `0${day}`
    }
    year = newDate.getFullYear();
    if (hours < 10) {
        hours = `0${hours}`
    }
    minutes = newDate.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    seconds = newDate.getSeconds();
    if (seconds < 10) {
        seconds = `0${seconds}`
    }
    return (`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`)
}
export function milestoneformatdatestring(datein) {

    let dateinArray = datein.split('-');
    if (dateinArray.length === 3) {
        let newDate = `${dateinArray[1]}/${dateinArray[2]}/${dateinArray[0]}`
        return newDate;
    } else {
        return datein;
    }

}
export function increaseDateStringByOneMonth(timein) {

    let offset = new Date().getTimezoneOffset() / 60;
    let sym = "";
    if (offset > 0) {
        sym = "-";
    }
    else {
        sym = "+";
        offset = -offset;
    }

    let datein = new Date(`${timein.replace(/-/g, '/')}${sym}${offset}:00`);
    let month = datein.getMonth() + 1;
    let year = datein.getFullYear();
    if (month === 12) {
        month = 1;
        year = year + 1;
    }
    else {
        month = month + 1;
    }

    let date = datein.getDate();
    let hours = datein.getHours();

    if (month < 10) {
        month = `0${month}`;
    }
    date = datein.getDate();
    if (date < 10) {
        date = `0${date}`;
    }
    hours = datein.getHours();
    if (hours < 10) {
        hours = `0${hours}`;
    }
    let minutes = datein.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    let seconds = datein.getSeconds();
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    return (`${year}-${month}-${date} ${hours}:${minutes}:${seconds}`);
}
export function inputUTCStringForLaborID(timein) {

    let datein = new Date(`${timein.replace(/-/g, '/')}-00:00`)
    let hours = datein.getHours();
    let ampm
    if (hours > 12) {
        hours = hours - 12;
        ampm = "PM"
    }
    else if (hours < 12) {
        ampm = "AM"
    }
    else if (hours === 0) {
        hours = 12;
        ampm = "AM"
    }
    else if (hours === 12) {
        ampm = "PM"
    }
    let minutes = datein.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    let date = datein.getDate();
    if (date < 10) {
        date = `0${date}`
    }
    let year = datein.getFullYear()
    let month = datein.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`
    }
    return (`${month}/${date}/${year} ${hours}:${minutes} ${ampm}`)

}
export function sortdisplacementdesc(testb, testa) {

    if (Number(testa.displacement) < Number(testb.displacement)) {

        return -1;
    }
    else if (Number(testb.displacement) < Number(testa.displacement)) {

        return 1;
    }
    else {
        return 0;
    }
}
export function sortdisplacementagain(testb, testa) {
    if (Number(testa.displacement) > Number(testb.displacement)) {
        console.log("sorting")
        return -1;
    } else if (Number(testa) < Number(testb)) {
        return 1;
    } else {
        return 0;
    }
}
export function sortdisplacement(testb, testa) {


    if (Number(testa.displacement) < Number(testb.displacement)) {

        return 1;
    }
    else if (Number(testb.displacement) < Number(testa.displacement)) {

        return -1;
    }
    else {
        return 0;
    }
}
export function sorttimesdesc(timeina, timeinb) {

    timeina = new Date(timeina.replace(/-/g, '/'))
    timeinb = new Date(timeinb.replace(/-/g, '/'))

    if (timeina < timeinb) {
        return 1;
    }
    else if (timeinb < timeina) {
        return -1;
    }
    else {
        return 0;
    }
}
export function compactionTest(testid, timetest, testnum, elevation, location, wetpcf, moistpcf, curveid, fieldid, letterid) {
    return ({ testid, timetest, testnum, elevation, location, wetpcf, moistpcf, curveid, fieldid, letterid })
}
export function makeDatefromObj(datein) {
    let year = datein.getFullYear();
    let month = datein.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`
    }
    let date = datein.getDate();
    if (date < 10) {
        date = `0${date}`
    }

    return (`${year}-${month}-${date}`)
}
export function fieldReport(fieldid, projectid, datereport, content) {
    return ({ fieldid, projectid, datereport, content })
}
export function UnconfinedTestData(unid, loadreading, displacement) {
    return ({
        unid,
        loadreading,
        displacement
    }
    )
}
export function UnconfinedTest(unid, sampleid, loadreading, displacement) {
    return ({
        sampleid,
        testdata: {
            data: [{
                unid,
                loadreading,
                displacement
            }]
        }
    })
}
export function CreateProject(projectid,projectnumber,series,title,address,city,proposedproject,projectapn,engineerid,clientid) {
   return({projectid,projectnumber,series,title,address,city,proposedproject,projectapn,engineerid,clientid})
}
export function inputDateObjOutputAdjString(datein) {
    let offset = new Date().getTimezoneOffset() / 60
    let sym = "-";
    if (offset < 0) {
        sym = "+";
        offset = -offset;
    }
    if (offset < 10) {
        offset = `0${offset}`
    }
    let year = datein.getFullYear();


    let month = datein.getMonth() + 1;
    let day = datein.getDate();
    let hours = datein.getHours();
    let minutes = datein.getMinutes();
    if (month < 10) {
        month = `0${month}`
    }
    if (day < 10) {
        day = `0${day}`
    }
    if (hours < 10) {
        hours = `0${hours}`
    }
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    let newDate = new Date(`${year}/${month}/${day} ${hours}:${minutes}:00${sym}${2 * offset}:00`)

    hours = newDate.getHours()
    month = newDate.getMonth() + 1;
    day = newDate.getDate();
    minutes = newDate.getMinutes();
    year = newDate.getFullYear();
    if (month < 10) {
        month = `0${month}`
    }
    if (day < 10) {
        day = `0${day}`
    }
    if (hours < 10) {
        hours = `0${hours}`
    }
    if (minutes < 10) {
        minutes = `0${minutes}`
    }

    return (`${year}-${month}-${day} ${hours}:${minutes}:00`)
}
export function inputDateStringOutputSeconds(timein) {
    let offset = getOffsetTime(timein)
    let datein = new Date(`${timein.replace(/-/g, '/')} 00:00:00${offset}`);
    return (datein.getTime())
}
export function makeID(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
export function UnLoadChart() {
    return
}