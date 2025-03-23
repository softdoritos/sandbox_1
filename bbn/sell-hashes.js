/** @param {NS} ns */
export async function main(ns) {
    while(true) {
      await ns.hacknet.spendHashes("Sell for Money");
      await ns.sleep(200);
    }
}
