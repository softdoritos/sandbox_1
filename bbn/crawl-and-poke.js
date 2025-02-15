/**
 * Usage in game: 'run crawl-and-poke.js'
 * needs share.js and s-hack.js
 * @param {NS} ns
 */
export async function main(ns) {
    ns.disableLog('ALL')
    while (true) {
        let graph = await build_network_graph(ns);
        await attempt_to_hack_hosts(ns, graph)
        await ns.sleep(5000);
    }
}

async function attempt_to_hack_hosts(ns, graph) {
    const my_hacking_level = await ns.getHackingLevel()
    for (let hostname in graph.hosts) {
        let host = graph.hosts[hostname]
        if (!host.is_hacked) {
            let required_hacking_level = await ns.getServerRequiredHackingLevel(hostname)
            if (my_hacking_level >= required_hacking_level) {
                if (ns.fileExists("BruteSSH.exe")) {
                    await ns.brutessh(hostname)
                }
                if (ns.fileExists("FTPCrack.exe")) {
                    await ns.ftpcrack(hostname)
                }
                if (ns.fileExists("relaySMTP.exe")) {
                    await ns.relaysmtp(hostname)
                }
                if (ns.fileExists("HTTPWorm.exe")) {
                    await ns.httpworm(hostname)
                }
                if (ns.fileExists("SQLInject.exe")) {
                    await ns.sqlinject(hostname)
                }
                try {
                    await ns.nuke(hostname)
                } catch (errors) {  
                }
                let has_root = await ns.hasRootAccess(hostname)
                if (has_root) {
                    host.is_hacked = true
               }
           }
        } else {
            if (hostname.includes("home")) {
                continue
            }
            let max_ram = await ns.getServerMaxRam(hostname)
            let used_ram = await ns.getServerUsedRam(hostname)
            let available_ram = max_ram - used_ram 
            if (!ns.fileExists("s-hack.js", hostname)) {
                await ns.scp("s-hack.js", hostname, "home")
            }
            if (!ns.fileExists("share.js", hostname)) {
                await ns.scp("share.js", hostname, "home")
            }
            let share_ram = await ns.getScriptRam("share.js", hostname)
            let hack_ram = await ns.getScriptRam("s-hack.js", hostname)
            if (available_ram > share_ram) {
                await ns.exec("share.js", hostname, 1)
                available_ram -= share_ram
            }
            while (available_ram > hack_ram) {
                await ns.exec("s-hack.js", hostname, 1, hostname)
                available_ram -= hack_ram
            }
        }
    }
}

class Host {
    constructor(name, is_hacked) {
        this.name = name
        this.is_hacked = is_hacked
    }

    toString() {
        return "HOST: {" + this.name + ", " + this.is_hacked + "}";
    }
}

class HostMap {
    constructor() {
        this.graph = {}
        this.hosts = {}
    }

    add_host(host) {
        if (!(host.name in this.hosts)) {
            this.hosts[host.name] = host
            this.graph[host.name] = {}
        }
    }

    add_edge(host_1, host_2) {
        this.add_host(host_1)
        this.add_host(host_2)
        this.graph[host_1.name][host_2.name] = 1
        this.graph[host_2.name][host_1.name] = 1
    }
}

async function build_network_graph(ns) {
    const map = new HostMap()
    const home = new Host("home", true)
    map.add_host(home)
    const visited = {}
    const queue = []
    queue.push(home)

    while (queue.length > 0) {
        let curr = queue.shift()

        // visit
        visited[curr.name] = true

        // traverse
        let adjacent = await ns.scan(curr.name)
        for (let adjacent_hostname_index in adjacent) {
            let adjacent_hostname = adjacent[adjacent_hostname_index]
            let is_hacked = await ns.hasRootAccess(adjacent_hostname)
            let adjacent_host = new Host(adjacent_hostname, is_hacked)
            map.add_edge(curr, adjacent_host)
            if (!(adjacent_hostname in visited)) {
                queue.push(adjacent_host)
            }
        }
    }
    return map
}
