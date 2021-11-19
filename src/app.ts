#! /usr/bin/env node

import {Command} from "commander";
import {create} from "./commands/create";
import {CommandEnum} from "./_definitions/CommandEnum";
import {
  absolutePathConfigDir,
  cliCommandName,
  JsonGlobalConfigFile,
  nameConfigDir,
  nameGlobalConfigFile
} from "./_config";
import fs from "fs";

const preChecking =(): void | Error => {

  if(!fs.existsSync(absolutePathConfigDir))
    return new Error(`Le répertoire de configuration "${nameConfigDir}" est manquant ! \n 
    Lancez la cmd "$${cliCommandName} init" pour initialiser les fichiers de configuration obligatoires.
    `)

  if(!JsonGlobalConfigFile)
    return new Error(`Le fichier de configuration "${nameConfigDir}/${nameGlobalConfigFile}" est manquant
    Lancez la cmd "$${cliCommandName} init" pour initialiser les fichiers de configuration obligatoires.
    `)

  if(!JsonGlobalConfigFile.domainWorkDirectory)
    return new Error(`Le chemin du domain de travail principal est manquant ! \n 
    Vous devez founir le chemin du répertoire de travail (Exemple : "/src/core")`)
}


const run = async ()=> {

  const preCheckResult = preChecking()
  if(preCheckResult instanceof Error)
    return console.log(preCheckResult.message)

  const program = new Command()

  program.version('0.0.1')
  /*program
    .command('init')
    .description(`If config file does not exist : Create configs files and 1 example modele \n
    Else if configs files alrady exist : check their validity, and save configuration`)
    .action(initialize)*/

  program
    .command(CommandEnum.create)
    .argument('<templateName>',"Template to use")
    .argument('<replacementName>',"Replacement word")
    .option('-s, --subdomain <subdomain>', 'Allwos to choose a subdomain in which the component will be created')
    .description(`Create component`)
    .action(create)

  await program.parseAsync(process.argv)

}

run().then()