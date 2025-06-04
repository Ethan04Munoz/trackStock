export function getPSClass(value) {
    if (value < 1) return "mLevel1";
    if (value >= 1 && value <= 1.5) return "mLevel2";
    if (value > 1.5 && value <= 2) return "mLevel3";
    if (value > 2 && value <= 3) return "mLevel4";
    return "mLevel5";
};

export function getPEGClass(value) {
    if (value < 1) return "mLevel1";
    if (value >= 1 && value <= 1.5) return "mLevel2";
    if (value > 1.5 && value <= 2) return "mLevel3";
    if (value > 2 && value <= 3) return "mLevel4";
    return "mLevel5";
};

export function getPEClass(value) {
    if (value < 10) return "mLevel1";
    if (value >= 10 && value <= 17) return "mLevel2";
    if (value > 17 && value <= 24) return "mLevel3";
    if (value > 24 && value <= 31) return "mLevel4";
    return "mLevel5";
};

export function truncate(num, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.trunc(num * factor) / factor;
}