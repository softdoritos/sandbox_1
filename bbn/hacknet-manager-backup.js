/** @param {NS} ns */
export async function main(ns) {

    while(true) {
      await ns.sleep(2000);
      const current_nodes = ns.hacknet.numNodes()
      const current_money = ns.getServerMoneyAvailable('home');
      ns.print("I am waking up with: " + current_nodes + " nodes");
      if (current_nodes <= 8) {
          await strategy_one(ns, current_nodes, current_money)
      } else {
          await strategy_two(ns, current_nodes, current_money)
      }
    }
}

// get 8 nodes up to some decent income at a high use of money
async function strategy_one(ns, current_nodes, current_money) {
      let spent = 0;
      const threshold = current_money * .85;
      ns.print("My current strat 1 spend threshold: " + threshold)

      if (current_nodes < 8) {
          let purchase_cost = await ns.hacknet.getPurchaseNodeCost()
          if (current_nodes < 8 && purchase_cost < spent + threshold) {
              spent += await ns.hacknet.purchaseNode();
          }
      }

      let fully_upgraded = true;
      for (let i = 0; i < current_nodes; ++i) {
          let stats = await ns.hacknet.getNodeStats(i)
          ns.print("node: " + i + " level: " + stats.level + "cpu: " + stats.cores + "ram: " + stats.ram)
          if (stats.level < 100) {
              fully_upgraded = false;
              let level_cost = await ns.hacknet.getLevelUpgradeCost(i, 5);
              if (level_cost + spent < threshold) {
                  ns.print("upgrading level for cost $" + level_cost)
                  await ns.hacknet.upgradeLevel(i, 5);
                  spent += level_cost;
              }
          }
          if (stats.ram < 64) {
              fully_upgraded = false;
              let ram_cost = ns.hacknet.getRamUpgradeCost(i);
              if (ram_cost + spent < threshold) {
                ns.print("upgrading ram for cost $" + ram_cost)
                await ns.hacknet.upgradeRam(i);
                spent += ram_cost;
              }
          }
          if (stats.cores < 8) {
              fully_upgraded = false;
              let cpu_cost = ns.hacknet.getCoreUpgradeCost(i);
              if (cpu_cost + spent < threshold) {
                  ns.print("upgrading cpu for cost $" + cpu_cost)
                  await ns.hacknet.upgradeCore(i);
                  spent += cpu_cost;
              }
          }
      }
      ns.print("I am fully upgraded: " + fully_upgraded)
      if (fully_upgraded) {
          let purchase_cost = await ns.hacknet.getPurchaseNodeCost()
          if (purchase_cost < spent + threshold) {
              spent += await ns.hacknet.purchaseNode();
          }
      }
}

// Once we're at 8 let's flip over to slowly upgrading
async function strategy_two(ns, current_nodes, current_money) {
      let spent = 0;
      const threshold = current_money * .02;
      ns.print("My strat 2 current spend threshold: " + threshold)

      let fully_upgraded = true;
      for (let i = 0; i < current_nodes; ++i) {
          let stats = await ns.hacknet.getNodeStats(i)
          ns.print("node: " + i + " level: " + stats.level + "cpu: " + stats.cores + "ram: " + stats.ram)
          if (stats.level < 200) {
              fully_upgraded = false;
              let level_cost = await ns.hacknet.getLevelUpgradeCost(i, 5);
              if (level_cost + spent < threshold) {
                  ns.print("upgrading level for cost $" + level_cost)
                  await ns.hacknet.upgradeLevel(i, 5);
                  spent += level_cost;
              }
          }
          if (stats.ram < 64) {
              fully_upgraded = false;
              let ram_cost = ns.hacknet.getRamUpgradeCost(i);
              if (ram_cost + spent < threshold) {
                ns.print("upgrading ram for cost $" + ram_cost)
                await ns.hacknet.upgradeRam(i);
                spent += ram_cost;
              }
          }
          if (stats.cores < 16) {
              fully_upgraded = false;
              let cpu_cost = ns.hacknet.getCoreUpgradeCost(i);
              if (cpu_cost + spent < threshold) {
                  ns.print("upgrading cpu for cost $" + cpu_cost)
                  await ns.hacknet.upgradeCore(i);
                  spent += cpu_cost;
              }
          }
      }
      ns.print("I am fully upgraded: " + fully_upgraded)
      if (fully_upgraded) {
          let purchase_cost = await ns.hacknet.getPurchaseNodeCost()
          if (purchase_cost < spent + threshold) {
              spent += await ns.hacknet.purchaseNode();
          }
      }
}
