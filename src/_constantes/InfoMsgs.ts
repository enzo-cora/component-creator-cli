import {cSuccess,cInfo} from "./config";
import chalk from "chalk";

export const InfoMsgs = {
  SUCCESS_FILE_CREATON :(fileName) => `Fichier : ${chalk.underline(fileName)} : ${cSuccess("Création OK")}`,
  SUCCESS_COMPONENT_CREATON : cSuccess(`Le composant à été créer avec succès`),
  SUCCESS_EXAMPLE_TEMPLATE_CREATON : cInfo(`Un template d'exemple à été généré !`),
  SUCCESS_INITIALIZATION : cSuccess('Initialisation effectuée avec succès'),
  SUCCESS_RELOAD: `Reload OK`,
}