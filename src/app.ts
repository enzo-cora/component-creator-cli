import {Command} from "commander";
import {initialize} from "./commands/initialize";
import {create} from "./commands/create";
import Conf from "conf";


const store = new Conf();
const program = new Command();

program.version('0.0.1');
program
  .command('init')
  .description(`If config file does not exist : Create configs files and 1 example modele \n 
  Else if configs files alrady exist : check their validity, and save configuration`)
  .action(initialize)

program
  .command('create')
  .argument('<templateName>',"Template to use")
  .argument('<replacementName>',"Replacement word")
  .description(`Crée un composant`)
  .action(create)
  .parseAsync(process.argv).then()