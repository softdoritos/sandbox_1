/**
 * Usage in game 'run run-script.js 500 s-weaken-only.js <server>'
 * @param {NS} ns 
 */
export async function main(ns) {
    const times = ns.args[0]
    const script = ns.args[1]
    const remaining_args = ns.args.slice(2)
    for (let i = 0; i < times; ++i) {
        ns.exec(script, ns.getHostname(), 1, ...remaining_args)
    }
}
