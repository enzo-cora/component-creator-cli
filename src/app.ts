#! /usr/bin/env node

import {Command} from "commander";
import {generate} from "./commands/Generate";
import {CommandEnum} from "./_constantes/CommandEnum";
import {Initializer} from "./commands/Initializer";
import {cInfo} from "./_constantes/config";
import {list} from "./commands/List";
import {InfoMsgs} from "./_constantes/InfoMsgs";


const run = async ()=> {

  const program = new Command()

  program.version('2.1.0')

  program
    .command(CommandEnum.list)
    .description(`List all the available templates of the project`)
    .action(  list)


  program
    .command(CommandEnum.init)
    .description(`Create configs files and 1 example modele if first init. Else, check templates validity and cache your current configuration`)
    .action(  ()=> {new Initializer(InfoMsgs.SUCCESS_INITIALIZATION,true).execute()})


  const generateCommands : CommandEnum[] = [CommandEnum.generate, CommandEnum.generateShortcut]
  for(const cmd of generateCommands){
    const description = cmd === CommandEnum.generate ? "Create component" : `Shortcute for "${cmd}" command"`
    program
      .command(cmd)
      .description(description)
      .argument('<templateName>',"Template to use for generate component")
      .argument('<replacementName>',"Replacement word : This replacement word replace the generic keyword in template")
      .option('-s, --subdomain <subdomain>', 'Allows to choose a subdomain in which the component will be created')
      .action(generate)
  }

  if(process.argv.length > 2)
    await program.parseAsync(process.argv)
  else
    console.log("Bienvenue sur",cInfo.bold.underline("component-creator-CLI"))


}

run().then()