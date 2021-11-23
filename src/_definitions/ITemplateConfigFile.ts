type advancedWrkDirPath = {
  "rootWorkDir" : string,
  "extensionWorkDir" : string
}

export interface ITemplateConfigFile {
  template : string
  componentWorkDir : string | advancedWrkDirPath
}
](#componentWorkDirectory) | `string` \| `object` | **Required**. Used to set the component working directory. |