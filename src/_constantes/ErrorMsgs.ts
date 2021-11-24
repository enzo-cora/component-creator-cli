import path from "path";
import {cErr, cInfo, CLIAccess, cSuccess, cWarning, nameConfigDir, nameConfigFile} from "./config";
import {CommandEnum} from "./CommandEnum";
import chalk, {magenta} from "chalk";
import {table} from "table";

const provide_valid_stuff = (stuff) =>`Vous devez fournir ${chalk.underline(stuff)} dans le fichier de configuration "${cInfo(nameConfigFile)}" du composant`
const unable_create_component = cErr("Impossible de créer votre composant")
const contact_creator_unexpected_error = cInfo("Afin que le problème soit résolut, veuillez contacter le créateur du module")

export const ErrorMsgs = {

  UNEXPECTED_ERR (pendant, err) {return `${cWarning("Une erreur inattendue s'est produite pendant " + pendant)}:\n${err?.message ? err.message : err} \n ${contact_creator_unexpected_error}`},

  UNEXPECTRED_FILE_CREATION_ERR : (fileName, err)=>  `${cWarning("Une erreur inattendue s'est produite")} pendant la création du fichier "${cWarning(fileName)}" : 
${err?.message ? err.message : err} \n${contact_creator_unexpected_error}`,

  UNEXPECTRED_DIRECTORY_CREATION_ERR : (dirName, err)=>  `${cWarning("Une erreur inattendue s'est produite")} pendant la création du répertoire "${cWarning(dirName)}" : 
${err?.message ? err.message : err} \n ${contact_creator_unexpected_error}`,

  UNEXPECTRED_EXAMPLE_TEMPLATE_CREATION_ERR :   cInfo("OOPS ! Impossible de générer le template d'exemple !"),

  DUPLICATE_TEMPLATE_NAME  : (dupliName:string, paths:string[]) => {
    const formatedPaths : [string][] = paths.map(path => [`${cWarning(path)}`])
    return `Attention vous avez des templates ayant le même nom "${cErr(dupliName)}" \n${table(formatedPaths)}`
  },

  CONFIG_DIR_MISS :
` 
  ${cWarning("Dossier de configuration manquant: ")}Le dossier de configuration ${cInfo.underline("/"+nameConfigDir)} n'as pas été trouvé !
  Il doit être placé à la racine de votre projet. 
  ${cInfo("Executez la commande:")} "${chalk.green.bgWhite("$",CLIAccess,chalk.bold(CommandEnum.init) )}" pour initialiser le CLI automatiquement
`,

  CONFIG_FIlE_MISS : (tempName)=>`${cWarning("Fichier de configuration manquant")} : Vous devez ajouter le fichier de configuration ${cInfo.underline(nameConfigFile)} au template "${cWarning(tempName)}"`,

  PROJECT_PATH_INVALID_VALUE: (errPath)=>`${cWarning("Propriété invalide dans le fichier config du template:")} Le chemin '${cWarning(errPath)}'  de la pté ${cInfo("componentWorkDir")} est incorrect car vous avez fourni ${cErr("un chemin absolut")} 
  Vous devez fournir un chemin ${chalk.underline("relatif")} à ${cInfo("la racine de votre projet")}`,

  ROOT_PATH_INVALID_VALUE: (errPath)=>`${cWarning("Propriété invalide dans le fichier config du template:")} Le chemin '${cWarning(errPath)}'  de la pté ${cInfo("componentWorkDir.rootWorkDir")} est incorrect car vous avez fourni ${cErr("un chemin absolut")} 
  Vous devez fournir un chemin ${chalk.underline("relatif")} à ${cInfo("la racine de votre projet")}`,

  EXTENTION_PATH_INVALID_VALUE: (errPath)=>`${cWarning("Propriété invalide dans le fichier config du template:")} Le chemin '${cWarning(errPath)}' de la pté ${cInfo("componentWorkDir.extensionWorkDir")} est incorrect car vous avez fourni ${cErr("un chemin absolut")} 
  Vous devez fournir un chemin ${chalk.underline("relatif")} à la pté ${cInfo("componentWorkDir.rootWorkDir")}`,

  SUBDOMAIN_PATH_INVALID_VALUE: (errPath)=>`${cWarning("Valeur d'option invalide:")} Le chemin '${cWarning(errPath)}' de l'option ${cInfo("--subdomain")} est incorrect car vous avez fourni ${cErr("un chemin absolut")} 
  Vous devez fournir un chemin ${chalk.underline("relatif")} à la pté ${cInfo("componentWorkDir")} |  ${cInfo("componentWorkDir.rootWorkDir")} `,

  TEMPLATE_NOT_EXIST : (tempName:string) => `Vous n'avez pas de template nommé "${cErr(tempName)}"`,

  COMPONENT_WRK_DIR_NOT_EXISTE : (compPath:string ) => `${unable_create_component} car l'emplacement "${cWarning(compPath)}" n'existe pas. \n ${provide_valid_stuff("un path valide")}`,

  ROOT_WRK_DIR_NOT_EXISTE : (rootPath:string) => `${unable_create_component} car ${chalk.bold.underline("le répertoire de travail racine")} "${rootPath}" n'existe pas dans votre projet ${path.resolve()}. \n ${provide_valid_stuff("un répertoire racine")}`,

  SUBDOMAIN_PATH_NOT_EXISTE : (subName:string, rootPath:string) => `${unable_create_component} car ${chalk.bold.underline("le sous-répertoire ")} "${subName}" n'existe pas dans "${rootPath}". \n ${provide_valid_stuff("un nom de sous-domaine")}`,

  EXTENTION_WRK_DIR_NOT_EXISTE : (extPath:string, subPath:string) => `${unable_create_component} car ${chalk.bold.underline("l'extention")} "${extPath}" n'existe pas dans le sous-domaine "${subPath}". \n ${provide_valid_stuff("une extention valide")}`,

  CONFIG_FILE_INVALID : (pty, types)=> `${cWarning("Fichier de configuration invalide: ")} : Le fichier de configuration de votre template doit contenir la pté "${cInfo(pty)}" de type ${cSuccess(types)}`,

  COMPONENT_ALREADY_EXIST : (dirName, wrkPath)=>  `Impossible de créer le composant "${cInfo(dirName)}" car ${cWarning("un composant du même nom existe déjà à cet emplacement")} (${wrkPath})`,


  CACHE_UNEXPECTED_INCONSISTENCY :   cErr(`Un problème inattendu de est survenue pendant la vérification de cohérence du cache : ${cErr("Impossible d'établir de cohérence entre le contenu du cache et celui des templates !")} `),
}