import fs from "fs"
import path from "path";
import {IGlogalConfigFile} from "./_definitions/IGlogalConfigFile";

export const argPosition = {
  subdomain:2,
  componentType: 2,
  cmd: 3,
  componentName:4
}
export const keywordReplacement = "[CamelCase]"
export const nameConfigDir = "component-architect-config"
export const nameGlobalConfigFile = "config-global.json"
export const nameComponentConfigFile = "config-component.json"
export const separator = "@"

const globalConfigFile : IGlogalConfigFile = JSON.parse(fs.readFileSync(path.resolve(`${nameConfigDir}/${nameGlobalConfigFile}`)).toString())
export const pathGlobalWorkDir  = path.resolve(globalConfigFile.globalWorkDir)