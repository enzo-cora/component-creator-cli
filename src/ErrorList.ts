import path from "path";
import {nameConfigDir, nameConfigFile} from "./_config";


export const ErrorList = {
  UNEXPECTED_ERROR :(err) => "Une erreur inattendue s'est produite : \n" + err,
  CONFIG_DIR_MISS : `Le dossier de configuration ${nameConfigDir} n'as pas été trouvé ! \n Il doit être placé à la racine de votre projet`,
  CONFIG_FIlE_MISS : (templatePath)=>`Vous devez ajouter un fichier de configuration "${nameConfigFile}" au template ${templatePath}`,
  TEMPLATE_NOT_EXIST : (tempName:string) => `Vous n'avez pas de template nommé "${tempName}"`,
  COMPONENT_WRK_DIR_NOT_EXISTE : (compPath:string ) => `L'emplacement "${compPath}" n'existe pas. \n Vous devez fournir un répertoire valide pour la création de votre composant`,
  ROOT_WRK_DIR_NOT_EXISTE : (rootPath:string) => `Le répertoire de travail racine "${rootPath}" n'existe pas dans votre projet ${path.resolve()}. \n Vous devez fournir un répertoire racine valide`,
  SUBDOMAIN_PATH_NOT_EXISTE : (subName:string, rootPath:string) => `Le sous-répertoire "${subName}" n'existe pas dans "${rootPath}". \n Vous devez fournir un nom de sous-domaine valide`,
  EXTENTION_WRK_DIR_NOT_EXISTE : (extPath:string, subPath:string) => `L'extention "${extPath}" n'existe pas dans le sous-domaine "${subPath}". \n Vous devez fournir une extention valide pour la création de votre composant`,
  // REPLACEMENT_FORMATAGE_NOT_EXIST : "",
  CONFIG_FILE_INVALID : (pty, type)=> `Le fichier de configuration doit contenir la pté "${pty}" de type ${type}`,
  COMPONENT_ALREADY_EXIST : (dirName, wrkPath)=>  `Impossible de créer le composant "${dirName}" à l'emplacement "${wrkPath}" car un composant du même nom existe déjà à cet emplacement`
}