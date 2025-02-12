/**
 * Usage in game: 'run s-hack.js <server>'
 * @param {NS} ns
 */
export async function main(ns) {
    const target = ns.args[0]
    const moneyThresh = ns.getServerMaxMoney(target) * .95;
    const securityThresh = ns.getServerMinSecurityLevel(target) * 1.05;

    while(true) {
        if (ns.getServerSecurityLevel(target) > securityThresh) {
            await ns.weaken(target);
        } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
            await ns.grow(target);
        } else {
            await ns.hack(target);
        }
    }
}
