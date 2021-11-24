type advancedWrkDirPath = {
  "rootWorkDir" : string,
  "extensionWorkDir" : string
}

export interface ITemplateConfigFile {
  template : string
  componentWorkDir : string | advancedWrkDirPath
}