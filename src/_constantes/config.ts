import chalk from "chalk";
import {NamingConvention} from "./NamingConvention";

export const edging = "$"

export const keywordExemple = `${edging}${NamingConvention.none}${edging}`

export const CLIAccess : string = "ccc"

export const nameConfigDir :string = "ccc-config"
export const nameConfigFile:string = "template-config.json"


export const cErr = chalk.bold.red;
export const cWarning = chalk.yellow
export const cInfo = chalk.blue
export const cSuccess = chalk.green

