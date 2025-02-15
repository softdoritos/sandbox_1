/**
 * Usage in game: 'run buy-server.js home01 4096' 
 * @param {NS} ns
 */
export async function main(ns) {
    ns.purchaseServer(ns.args[0], ns.args[1])
}
