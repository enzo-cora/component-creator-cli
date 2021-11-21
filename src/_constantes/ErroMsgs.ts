import path from "path";
import {cErr, cInfo, CLIAccess, cSuccess, cWarning, nameConfigDir, nameConfigFile} from "./config";
import {CommandEnum} from "./CommandEnum";
import chalk from "chalk";

const provide_valid_stuff = (stuff) =>`Vous devez fournir ${chalk.underline(stuff)} dans le fichier de configuration "${cInfo(nameConfigFile)}" du composant`
const unable_create_component = cErr("Impossible de créer votre composant")
const contact_creator_unexpected_error = cInfo("Afin que le problème soit résolut, veuillez contacter le créateur du module")

export const ErroMsgs = {
  UNEXPECTED_ERROR (err) {return `${cWarning("Une erreur inattendue s'est produite")}:\n${err?.message ? err.message : err} \n ${contact_creator_unexpected_error}`},
  CONFIG_DIR_MISS : `Le dossier de configuration ${cInfo.underline("/"+nameConfigDir)} n'as pas été trouvé ! \n Il doit être placé à la racine de votre projet \n
  ${cInfo("Executez la commande :")} ${CLIAccess}${CommandEnum.init} pour initialiser le CLI automatiquement`,

  CONFIG_FIlE_MISS : (tempName)=>`${cWarning("Fichier de configuration manquant")} : Vous devez ajouter le fichier de configuration ${cInfo.underline(nameConfigFile)} au template "${cWarning(tempName)}"`,
  TEMPLATE_NOT_EXIST : (tempName:string) => `Vous n'avez pas de template nommé "${cErr(tempName)}"`,
  COMPONENT_WRK_DIR_NOT_EXISTE : (compPath:string ) => `${unable_create_component} car l'emplacement "${cWarning(compPath)}" n'existe pas. \n ${provide_valid_stuff("un path valide")}`,
  ROOT_WRK_DIR_NOT_EXISTE : (rootPath:string) => `${unable_create_component} car ${chalk.bold.underline("le répertoire de travail racine")} "${rootPath}" n'existe pas dans votre projet ${path.resolve()}. \n ${provide_valid_stuff("un répertoire racine")}`,
  SUBDOMAIN_PATH_NOT_EXISTE : (subName:string, rootPath:string) => `${unable_create_component} car ${chalk.bold.underline("le sous-répertoire ")} "${subName}" n'existe pas dans "${rootPath}". \n ${provide_valid_stuff("un nom de sous-domaine")}`,
  EXTENTION_WRK_DIR_NOT_EXISTE : (extPath:string, subPath:string) => `${unable_create_component} car ${chalk.bold.underline("l'extention")} "${extPath}" n'existe pas dans le sous-domaine "${subPath}". \n ${provide_valid_stuff("une extention valide")}`,
  // REPLACEMENT_FORMATAGE_NOT_EXIST : "",
  CONFIG_FILE_INVALID : (pty, types)=> `${cWarning("Fichier de configuration invalide: ")} : Le fichier de configuration de votre template doit contenir la pté "${cInfo(pty)}" de type ${cSuccess(types)}`,
  COMPONENT_ALREADY_EXIST : (dirName, wrkPath)=>  `Impossible de créer le composant "${cInfo(dirName)}" car ${cWarning("un composant du même nom existe déjà à cet emplacement")} (${wrkPath})`,
  FILE_CREATION_UNEXPECTRED_ERR : (fileName, err)=>  `${cWarning("Une erreur inattendue s'est produite")} pendant la création du fichier ${cWarning(fileName)} : 
  \n${err?.message ? err.message : err} \n${contact_creator_unexpected_error}`,
  DIRECTORY_CREATION_UNEXPECTRED_ERR : (dirName, err)=>  `${cWarning("Une erreur inattendue s'est produite")} pendant la création du répertoire ${cWarning(dirName)} : 
  \n ${err?.message ? err.message : err} \n ${contact_creator_unexpected_error}`,
  CACHE_UNEXPECTED_NOREFRESH :   cErr(`Un problème inattendu de mise en cache des templates est survenue ! \n ${contact_creator_unexpected_error}`),
  EXAMPLE_TEMPLATE_CREATION_UNEXPECTRED_ERR :   cInfo("OOPS ! Impossible de générer le template d'exemple !"),
}