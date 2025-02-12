/**
 * Usage: run find-host.js <I.I.I.I>
 */
export async function main(ns) {
    ns.disableLog('ALL')
    let path = await find(ns, 'home', ns.args[0])
    ns.tail()
    ns.print(path)
}

class HostNode {
    constructor(name, parent=null) {
        this.name = name
        this.parent = parent
    }
}

async function find(ns, src, target) {
  const visited = {}
  const queue = []
  queue.push(new HostNode(src))
  while (queue.length > 0) {
      let curr = queue.shift()
      visited[curr.name] = true
      let adjacent = await ns.scan(curr.name)
      for (let adjacent_hostname_index in adjacent) {
        let adjacent_hostname = adjacent[adjacent_hostname_index]
        let adjacent_node = new HostNode(adjacent_hostname, curr)
        if (adjacent_hostname == target) {
          return build_path(ns, adjacent_node)
        }
        if (!(adjacent_hostname in visited)) {
          queue.push(adjacent_node)
        }
      }
  }
  return "Could not find: " + target
}

function build_path(ns, target_node) {
  let curr = target_node
  let path = [curr]
  while (curr.parent != null) {
    path.push(curr.parent)
    curr = curr.parent
  }
  path.reverse()
  let result = ""
  for (let path_index in path) {
    result += path[path_index].name + " "
  }
  return "Path: " + result
}
