import * as fs from "fs";
import {
  edging, nameConfigDir,
} from "./_constantes/config";

import path from "path";
import {ITemplateReader} from "./_definitions/ITemplateReader";
import {IComponentFileInfo, ITemplateExtractor} from "./_definitions/ITemplateExtractor";
import {ErroMsgs} from "./_constantes/ErroMsgs";
import {ITemplateConfigFile} from "./_definitions/ITemplateConfigFile";
import {NamingConvention} from "./_constantes/NamingConvention";
import {camelCase} from "camel-case";
import {paramCase} from "param-case";
import {pascalCase} from "pascal-case";
import {snakeCase} from "snake-case";
import {constantCase} from "constant-case";
import {sentenceCase} from "sentence-case";


type compWrkDir = ITemplateConfigFile['componentWorkDir']
type regExpInfo = {regex : RegExp, convention: NamingConvention}
type caseTransform = Omit<Record<NamingConvention, (str:string)=> string >,"none">


const optionsCaseTransform = {
  stripRegexp : new RegExp("[ _-]","g"),
  splitRegexp: /([a-z])([A-Z0-9])/g
}

const caseTransform : caseTransform  = {
  camelCase : (str)=> camelCase(str,optionsCaseTransform),
  paramCase :  (str)=> paramCase(str,optionsCaseTransform),
  pascalCase : (str)=> pascalCase(str,optionsCaseTransform),
  snakeCase : (str)=> snakeCase(str,optionsCaseTransform),
  constantCase : (str)=> constantCase(str,optionsCaseTransform),
  sentenceCase : (str)=> sentenceCase(str,optionsCaseTransform)
}

const regexPath : RegExp = new RegExp("(?<!\\/)(\\.\\.\\/)+[\\w\\/_-]+","g")

export class TemplateExtractor implements ITemplateExtractor{

  constructor(
    public templateReader:ITemplateReader,
    public replaceVal : string,
    public subdomain? : string
  ) {
  }


  getComponentDirName() : string {
    const templateDirName = this.templateReader.templateDirName
    const convention : NamingConvention | null = this._getConvention(templateDirName)

    let formatedReplaceValue = this.replaceVal

    if(!convention)
      return templateDirName

    else if(convention && convention !== "none" )
      formatedReplaceValue = caseTransform[convention](formatedReplaceValue)

    return templateDirName.replace(this._buildClassicRegex(convention), formatedReplaceValue)


  }

  async getComponentFiles(componentWrkDir:string) : Promise<IComponentFileInfo[] | Error> {
    const filesResult = await this.templateReader.getTemplateFiles()
    if (filesResult instanceof Error)
      return filesResult

    return filesResult.map(fileInfo =>{


      const conventionFileName : NamingConvention|null = this._getConvention(fileInfo.fileName)

      let formatedFileName = fileInfo.fileName
      let formatedReplaceValue = this.replaceVal


      if(conventionFileName && conventionFileName !== "none" )
        formatedReplaceValue = caseTransform[conventionFileName](formatedReplaceValue)

      if(conventionFileName)
        formatedFileName = fileInfo.fileName.replace(this._buildClassicRegex(conventionFileName), formatedReplaceValue)

      let formatedData = this._changeFileContent(fileInfo.fileData)
      formatedData =  this._transformPaths(formatedData,`${componentWrkDir}/COMPONENT_DIRECTORY`)


      return {
        fileName : formatedFileName,
        data : formatedData
      }
    })
  }


  getComponentWrkDirPath (componentWrkDir : compWrkDir) : string | Error {

    let compWrkDirPath : string
    if(typeof componentWrkDir === "string"){
      compWrkDirPath = path.resolve( componentWrkDir)
      if(!fs.existsSync(compWrkDirPath))
        return new Error(ErroMsgs.COMPONENT_WRK_DIR_NOT_EXISTE(compWrkDirPath))
      return compWrkDirPath
    }

    const {rootWorkDir,extensionWorkDir} = componentWrkDir

    const rootWrkDirPath = path.resolve( rootWorkDir)
    if(!fs.existsSync(rootWrkDirPath))
      return new Error(ErroMsgs.ROOT_WRK_DIR_NOT_EXISTE(rootWorkDir))

    let subdomainPath
    if(this.subdomain){
      subdomainPath = `${rootWrkDirPath}/${this.subdomain}`
      if(!fs.existsSync(subdomainPath))
        return new Error(ErroMsgs.SUBDOMAIN_PATH_NOT_EXISTE(this.subdomain, path.relative(path.resolve(),rootWrkDirPath)))
      compWrkDirPath = `${subdomainPath}/${this.subdomain}/${extensionWorkDir}`
      if(!fs.existsSync(compWrkDirPath))
        return new Error(ErroMsgs.EXTENTION_WRK_DIR_NOT_EXISTE(extensionWorkDir, path.relative(path.resolve(),subdomainPath)))
      return compWrkDirPath
    }

    compWrkDirPath = `${rootWrkDirPath}/${extensionWorkDir}`
    if(!fs.existsSync(compWrkDirPath))
      return new Error(ErroMsgs.EXTENTION_WRK_DIR_NOT_EXISTE(extensionWorkDir, path.relative(path.resolve(),subdomainPath)))
    return compWrkDirPath
  }


  private _changeFileContent(data:string) : string {
    if(!data)
      return ""
    const conventions : NamingConvention[] = this._getAllConventions(data)
    if(!conventions.length)
      return data
    const superRegex : RegExp = this._buildSuperRegex(conventions)


    return  data.replace(superRegex,generic => {
      const convention : NamingConvention = this._getConvention(generic) as NamingConvention
      let formatedReplaceValue =  this.replaceVal
      if(convention !== "none" )
        formatedReplaceValue = caseTransform[convention](formatedReplaceValue)

      return formatedReplaceValue
    })

  }

  private _getConvention(str:string) : NamingConvention | null {
    let nameConvention : NamingConvention | null = null
    for(const namingConv of Object.values(NamingConvention)){
      if(str.includes(`${edging}${namingConv}${edging}`)){
        nameConvention =  namingConv
        break
      }
    }
    return nameConvention
  }

  private _getAllConventions(text:string) : NamingConvention[]  {
    let conventions : NamingConvention[]  = []
    for(const namingConv of Object.values(NamingConvention)){
      if(text.includes(`${edging}${namingConv}${edging}`))
        conventions.push(namingConv)
    }
    return conventions
  }

  private _buildClassicRegex(convention:NamingConvention) : RegExp  {
    return new RegExp( `\\${edging}${convention}\\${edging}`,"g")//Capture only generic keyword
  }

  private _buildSuperRegex(conventions:NamingConvention[]) : RegExp  {
    const preRegexArray : string[] = conventions.map(conv =>`\\${edging}${conv}\\${edging}`)
    return new RegExp(preRegexArray.join("|"),"g")
  }

  private _transformPaths(data:string,compDir:string) : string{
    return data.replace(regexPath,(prevPath)=>{
        const templateFileAbsolutPath = `${path.resolve(nameConfigDir)}/TEMPLATE_NAME/TEMPLATE_FILE`
        const importAbsolutePath = path.relative(templateFileAbsolutPath, prevPath)
        const importPathRelativeToProjectRoot = path.resolve(importAbsolutePath).substring(1)
        const newRelativeImport = path.relative(compDir,importPathRelativeToProjectRoot)
        return newRelativeImport
    })
  }

}
