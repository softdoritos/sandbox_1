/**
 * Usage in game 'run t-run-script.js 500 s-weaken-only.js <server>'
 * @param {NS} ns 
 */
export async function main(ns) {
    const times = ns.args[0]
    const script = ns.args[1]
    const remaining_args = ns.args.slice(2)
    const hostname = ns.getHostname()
    const max_ram = ns.getServerMaxRam(hostname)
    const used_ram = ns.getServerUsedRam(hostname)
    const script_ram = ns.getScriptRam(script, hostname)
    const max_instances = Math.floor((max_ram - used_ram) / script_ram)
    const times_to_run = Math.min(times, max_instances)
    ns.exec(script, hostname, times_to_run, ...remaining_args)
}
