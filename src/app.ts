#!/usr/bin/env node

import {Command} from "commander";
import {create} from "./commands/create";
import {CommandEnum} from "./_definitions/CommandEnum";


const program = new Command();

program.version('0.0.1');
/*program
  .command('init')
  .description(`If config file does not exist : Create configs files and 1 example modele \n 
  Else if configs files alrady exist : check their validity, and save configuration`)
  .action(initialize)*/

program
  .command(CommandEnum.create)
  .argument('<templateName>',"Template to use")
  .argument('<replacementName>',"Replacement word")
  .option('-s, --subdomain', 'Allwos to choose a subdomain in which the component will be created')
  .description(`Create component`)
  .action(create)

program.parseAsync(process.argv).then()