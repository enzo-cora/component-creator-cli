import * as fs from "fs";
import {
  edging,
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
    let formatedDirName = templateDirName
    if(convention){
      formatedDirName = templateDirName.replace(this._buildClassicRegex(convention), this.replaceVal)
      if(convention !== "none")
        formatedDirName = caseTransform[convention](formatedDirName)
    }
    return formatedDirName
  }

  async getComponentFiles() : Promise<IComponentFileInfo[] | Error> {
    const filesResult = await this.templateReader.getTemplateFiles()
    if (filesResult instanceof Error)
      return filesResult

    return filesResult.map(fileInfo =>{

      const conventioFileName : NamingConvention|null = this._getConvention(fileInfo.fileName)
      let formatedFileName = fileInfo.fileName
      if(conventioFileName){
        formatedFileName = fileInfo.fileName.replace(this._buildClassicRegex(conventioFileName), this.replaceVal)
        if(conventioFileName !== "none")
          formatedFileName = caseTransform[conventioFileName](formatedFileName)
      }

      const formatedData = this._changeFileContent(fileInfo.fileData)
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

    const superRegex : RegExp = this._buildSuperRefex(conventions)
    return  data.replace(superRegex,(matchWord,...rest) => {
      const capture = rest.filter(arg=> Object.values(NamingConvention).includes(arg))[0]
      if(capture === "none")
        return matchWord.replace(`${edging}${capture}${edging}`,this.replaceVal)

      const typedReplaceValue = " " + this.replaceVal
      const newWord = matchWord.replace(`${edging}${capture}${edging}`,typedReplaceValue)
      return caseTransform[capture](newWord)
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

  private _buildSuperRefex(conventions:NamingConvention[]) : RegExp  {
    const preRegex = (convention) : string  => `\\b\\w*\\${edging}(${convention})\\${edging}\\w*\\b`//Capture word that contain generic keyword
    const preRegexArr : string[] = conventions.map(conv => preRegex(conv))
    return new RegExp(preRegexArr.join("|"),"g")
  }

}