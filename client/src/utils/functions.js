function getThresholds(key) {
    const data = localStorage.getItem(key);
    if (!data) return null;
    const levels = JSON.parse(data);
    return [
        levels[1],
        levels[2],
        levels[3],
        levels[4]
    ];
}

function returnClassMetrics(value, thresholds) {
    if (value < thresholds[0]) return "mLevel1";
    if (value <= thresholds[1]) return "mLevel2";
    if (value <= thresholds[2]) return "mLevel3";
    if (value <= thresholds[3]) return "mLevel4";
    return "mLevel5";
}

export function getPSClass(value) {
    const thresholds = getThresholds("ps");
    return returnClassMetrics(value, thresholds);
}

export function getPEGClass(value) {
    const thresholds = getThresholds("peg");
    return returnClassMetrics(value, thresholds);
}

export function getPEClass(value) {
    const thresholds = getThresholds("pe");
    return returnClassMetrics(value, thresholds);
}

export function getDebtToEquityClass(value) {
    const thresholds = getThresholds("de");
    return returnClassMetrics(value, thresholds);
}

export function getPBClass(value) {
    const thresholds = getThresholds("pb");
    return returnClassMetrics(value, thresholds);
}

export function getGrossMarginClass(value) {
    const thresholds = getThresholds("gm");
    if (value > thresholds[0]) return "mLevel1";
    if (value >= thresholds[1]) return "mLevel2";
    if (value >= thresholds[2]) return "mLevel3";
    if (value >= thresholds[3]) return "mLevel4";
    return "mLevel5";
}


export function getFiftyDayAvgClass(value, price) {
    const ratio = price / value;

    if (ratio <= 0.70) {
        return 'mLevel1'; 
    }
    if (ratio <= 0.85) {
        return 'mLevel2'; 
    }
    if (ratio <= 1.15) {
        return 'mLevel3';
    }
    if (ratio <= 1.30) {
        return 'mLevel4'; 
    }
    return 'mLevel5'; 
}

export function getFiftyTwoWeekHighClass(value, price) {
    const ratio = price / value;

    if (ratio <= 0.70) {
        return 'mLevel1';
    }
    if (ratio <= 0.85) {
        return 'mLevel2';
    }
    if (ratio <= 1.15) {
        return 'mLevel3';
    }
    if (ratio <= 1.30) {
        return 'mLevel4';
    }
    return 'mLevel5';
}


export function truncate(num, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.trunc(num * factor) / factor;
}