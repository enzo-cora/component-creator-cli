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