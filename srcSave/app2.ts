import {ComponentDispatcher} from "./ComponentDispatcher";
import {ComponentReader} from "./ComponentReader";
import {CLIHandler} from "./CLIHandler";
import {program} from "commander";
import {initCommand} from "./commands/initCommand";



program
  .command('init')
  .description(`If config file does not exist : Create configs files and 1 example modele \n 
  Else if configs files alrady exist : check their validity, and save configuration`)
  .action(initCommand)