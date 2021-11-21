import chalk from "chalk";

export const framingSymbol = "$"
export const genericKeyword = `${framingSymbol}raw${framingSymbol}`

export const cliKeyword : string = "ccc"

export const nameConfigDir :string = "component-cli-config"
export const nameConfigFile:string = "template-config.json"


export const cErr = chalk.bold.red;
export const cWarning = chalk.yellow
export const cInfo = chalk.blue
export const cSuccess = chalk.green