/**
 * Usage: run find-contracts.js <filter>
 * @param {NS} ns
 */
export async function main(ns) {
    ns.disableLog('ALL')
    ns.tail()
    await visit_all_hosts(ns)
}

async function visit_all_hosts(ns) {
    const visited = {}
    const queue = []
    queue.push("home")

    while (queue.length > 0) {
        let curr = queue.shift()

        // visit
        visited[curr] = true
        let fnames = ns.ls(curr)
        for (let fname_index in fnames) {
          let name = fnames[fname_index]
          if (name.includes("cct") && (!ns.args[0] || name.includes(ns.args[0]))) {
            ns.print(curr + ": " + name)
          }
        }

        // traverse
        let adjacent = await ns.scan(curr)
        for (let adjacent_hostname_index in adjacent) {
            let adjacent_hostname = adjacent[adjacent_hostname_index]
            if (!(adjacent_hostname in visited)) {
                queue.push(adjacent_hostname)
            }
        }
    }
}
