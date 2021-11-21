#! /usr/bin/env node

import {Command} from "commander";
import {create} from "./commands/Create";
import {CommandEnum} from "./_definitions/CommandEnum";
import {initializer} from "./commands/Initialize";


const run = async ()=> {

  const program = new Command()

  program.version('2.0.0')

  program
    .command(CommandEnum.init)
    .description(`If config directory does not exist : Create configs files and 1 example modele. Else, check templates validity and cache your current configurations`)
    .action(  ()=> {initializer.reload(true)})


  program
    .command(CommandEnum.create)
    .argument('<templateName>',"Template to use")
    .argument('<replacementName>',"Replacement word")
    .option('-s, --subdomain <subdomain>', 'Allows to choose a subdomain in which the component will be created')
    .description(`Create component`)
    .action(create)

  if(process.argv.length > 2)
    await program.parseAsync(process.argv)
  else
    console.log("Bienvenue sur component-creator-CLI")


}

run().then()
