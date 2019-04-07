export function getInClauseText(emailArr: Array<string>): string {
    let emails = "";
    const len = emailArr.length
    emailArr.forEach((e, index) => {
        emails += "'" + e + "'";
        if ((index < len - 1)) {
            emails = emails + ",";
        }
    });
    return emails
}