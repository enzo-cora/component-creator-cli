import fs from "fs"
import path from "path";
import {IGlogalConfigFile} from "./_definitions/IGlogalConfigFile";


export const keywordReplacement = "[CamelCase]"
export const nameConfigDir = "component-architect-config"
export const nameGlobalConfigFile = "config-global.json"
export const nameComponentConfigFile = "config-component.json"
export const separator = "@"

export const JsonGlobalConfigFile : IGlogalConfigFile = JSON.parse(fs.readFileSync(path.resolve(`${nameConfigDir}/${nameGlobalConfigFile}`)).toString())
export const pathGlobalWorkDir  = path.resolve(JsonGlobalConfigFile.globalWorkDir)



const exempleMsg =  `(Exemple : ex: TemplateName${separator}Future${keywordReplacement}Name)`
export const ERR_TEMPLATE_DIR_NAME_PART1 = `Vous devez donner un nom à votre template,ecrivez-le nom en toute lettre DEVANT le séparateur "${separator}" \n ${exempleMsg}`
export const ERR_TEMPLATE_DIR_NAME_PART2 = `Le nom du répertoire du template doit contenir le Format du future Nom ! \n ${exempleMsg}`