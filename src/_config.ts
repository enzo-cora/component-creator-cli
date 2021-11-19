import fs from "fs"
import path from "path";
import {IGlogalConfigFile} from "./_definitions/IGlogalConfigFile";


export const keywordReplacement :string = "[camelCase]"

export const cliCommandName = "compo"
export const separator :string = "@"


export const nameConfigDir :string = "component-creator-config"
export const absolutePathConfigDir : string = path.resolve(nameConfigDir)

export const nameGlobalConfigFile :string = "config-global.json"
export const JsonGlobalConfigFile : IGlogalConfigFile = JSON.parse(fs.readFileSync(path.resolve(`${nameConfigDir}/${nameGlobalConfigFile}`)).toString())

export const nameComponentConfigFile :string = "config-component.json"

const exempleMsg =  `(Exemple : ex: TemplateName${separator}Future${keywordReplacement}Name)`
export const ERR_TEMPLATE_DIR_NAME_PART1 :string  = `Vous devez donner un nom à votre template,ecrivez-le nom en toute lettre DEVANT le séparateur "${separator}" \n ${exempleMsg}`
export const ERR_TEMPLATE_DIR_NAME_PART2 :string = `Le nom du répertoire du template doit contenir le Format du future Nom ! \n ${exempleMsg}`



export const regexDirectory : RegExp =  new RegExp(`(^[\\w]+)${separator}([\\S]+)`)
