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
export function Sample(sampleid, boringid, sampledepth, depth, samplenumber, sampleset, diameter, samplelength, description, uscs, spt, wetwgt, wetwgt_2, drywgt, tarewgt, tareno, graphiclog, ll, pi) {
    return ({ sampleid, boringid, sampledepth, depth, samplenumber, sampleset, diameter, samplelength, description, uscs, spt, wetwgt, wetwgt_2, drywgt, tarewgt, tareno, graphiclog, ll, pi })
}
export function CreateImage(imageid, image, caption, fieldid) {
    return ({ imageid, image, caption, fieldid })

}
export function Boring(boringid, projectid, boringnumber, datedrilled, gwdepth, elevation, drillrig, loggedby, latitude, longitude, diameter) {
    return { boringid, projectid, boringnumber, datedrilled, gwdepth, elevation, drillrig, loggedby, latitude, longitude, diameter }
}
export function check_31(dateobj) {
    let month = dateobj.getMonth();
    if (month === 0 || month === 2 || month === 4 || month === 6 || month === 7 || month === 9 || month === 11) {
        return 31;
    }
}
export function getOffset() {
    let offset = new Date().getTimezoneOffset() / 60
    let sym = "+";
    if (offset > 0) {
        sym = "-";
    }
    if (Math.abs(offset) < 10) {
        offset = `0${offset}`
    }
    return (`${sym}${offset}:00`)

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
    let offset = getOffset();
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
    let offset = getOffset();
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
export function decreaseCalendarDaybyOneMonth(timein) {
    let offset = getOffset();
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
    let offset = getOffset();
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
export function inputDateStringOutputSeconds(timein) {
    let offset = getOffset()
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