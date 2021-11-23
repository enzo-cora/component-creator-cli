
# Installation
### Run CLI command from eveywhere
Install `component-creator-cli` as **global dependency**
```bash  
  npm i -g component-creator-cli  
```  
- For run any command use :  **`$ ccc`** keyword

### Run CLI command from your project
Install `component-creator-cli` as **dev-dependency**
```bash  
  npm i -D component-creator-cli  
```  
- For run any command use :  **`$ ngx ccc`** keyword



# Component creator CLI

[![NPM Version](http://img.shields.io/npm/v/component-creator-cli.svg)](https://www.npmjs.org/package/component-creator-cli)  
[![NPM Downloads](https://img.shields.io/npm/dm/component-creator-cli.svg)](https://npmcharts.com/compare/component-creator-cli?minimal=true)  
[![Install Size](https://packagephobia.now.sh/badge?p=component-creator-cli)](https://packagephobia.now.sh/result?p=component-creator-cli)  
![Issues](https://img.shields.io/github/issues/enzo-cora/component-creator-cli.svg)  
[![Licence](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)

Are you interested in the **architecture of your project**?  
Do you do Domain Driven Design (DDD), Clean Architecture, React or simply MVC?    
If YES, then you will probably generate a project with repeating components that will have the same file structure.  
And you will reuse these paterns throughout the construction of your project architecture. (And even after) !

Therefore, in order to save time on the creation of your architecture and improve your workflow, you can use "Component creator CLI" to generate your personalized component in 1 second! (via the command line)

**1- Create your custom generic template      
2- And run the CLI `generate` command to generate your component at the chosen locations.**  
(It's like the Angular CLI, with your own custom components !)


## I- CLI Features

| #                                                        | Meaning         |  
|----------------------------------------------------------|-----------------|  
| ![#0a192f](https://via.placeholder.com/10/00A000?text=+) | Implemented     |  
| ![#f8f8f8](https://via.placeholder.com/10/e71837?text=+) | Not yet Implemented |  


- ![green](https://via.placeholder.com/10/00A000?text=+) `Create your custom template`
- ![green](https://via.placeholder.com/10/00A000?text=+) `Define the files created by the template`
- ![green](https://via.placeholder.com/10/00A000?text=+) `Define the files content`
- ![green](https://via.placeholder.com/10/00A000?text=+) `Place the generic replacement keyword`
- ![green](https://via.placeholder.com/10/00A000?text=+)`Choose the formatting convention for your generic keyword`
- ![green](https://via.placeholder.com/10/00A000?text=+) `Configure component work directory component target`
- ![green](https://via.placeholder.com/10/00A000?text=+) `Configure component work directory extension`
- ![green](https://via.placeholder.com/10/00A000?text=+) `Generate your own custom component`
- ![green](https://via.placeholder.com/10/00A000?text=+) `Automatically Replace generic keyword`
- ![green](https://via.placeholder.com/10/00A000?text=+) `Automatically Formate generic keyword`
- ![green](https://via.placeholder.com/10/00A000?text=+) `Automatically Handle import path`
- ![red](https://via.placeholder.com/10/e71837?text=+) `Delete created component`
- ![green](https://via.placeholder.com/10/00A000?text=+) `List all template available`
- ![green](https://via.placeholder.com/10/00A000?text=+) `Generate an example template`


## II- Demo & Examples

Gif incomming  
![Demo animation cli](https://github.com/enzo-cora/component-creator-cli/blob/images/create-component.png?raw=true)

### A- Create component
These 3 commands are the same :
```cmd  
   $ ccc generate extravagant order  
   $ ccc g extravagant user  
   $ ngx ccc generate smartphone  
```  

These commands will generate three components based on a custom "extravagant" template.    
The creation location is configured upstream (in the [template config file](#d--template-config-file) ).    
Here are the generated components :
```  
FancifulEntities/  
├─ my-extravagant-order/  
│  ├─ interfce-order.ts            
│  ├─ show-order-formated.html  
│  ├─ order-beauty.css  
│  ├─ test-my-order-please.test.ts  
│  └─ order.js  
│    
├─ my-extravagant-user/  
│  ├─ interfce-user.ts            
│  ├─ show-user-formated.html  
│  ├─ user-beauty.css  
│  ├─ test-my-user-please.test.ts  
│  └─ user.js  
│    
├─ my-extravagant-smartphone/  
│  ├─ interfce-smartphone.ts            
│  ├─ show-smartphone-formated.html  
│  ├─ smartphone-beauty.css  
│  ├─ test-my-smartphone-please.test.ts  
│  └─ smartphone.js  
  
```  
To choose a subdomain working directory use the  `--subdomain | -s` [option](#options-generate-)


## V- CLI Reference

### A- Definitions:
- **Template** : A template is a way of writing an entity with some information “left generic”, for the CLI to fill in later, when we actually use it.
- **Component** :  A component is built version of a template

### B- Create component

```cmd  
  $ ccc generate <template-name> <replacement-value> [options]  
```  
```cmd  
  $ ccc generate <template-name> <replacement-value> [options]  
```  
#### Arguments : `generate`
|      Argument     |  Type  |                                    Description                                   |  
|:-----------------:|:------:|:--------------------------------------------------------------------------------:|  
|   `<template-name>` | `string` |                            **Required**. Name of template to use.                           |  
| `<replacement-value>` | `string` | **Required**. Replacement value used to replace the [generic keyword](#a--generics-keywords) in brackets |  


#### Options : `generate`
|    Option   | Short |  Type  |                                    Description                                   | Default Value |  
|:-----------:|:-----:|:------:|:--------------------------------------------------------------------------------:|:-------------:|  
| `--subdomain` |   `-s` | `string` | **Optional**. Path of subdomain placed between the **wrk dir** and the **extension wrk dir** |      none     |  

### Display help interface

```cmd  
  $ ccc --help  
```  

## V- Generics keywords
The genereric keywords are recognized by the CLI and replaced by the [replacement value](#arguments-create-) provided.

The value contained in generic keyword defines formatting result :


|      Keyword     |                      Formatting                     |    Exemple   |  
|:----------------:|:---------------------------------------------------:|:------------:|  
|     `$none$` |                Don't apply formatting               |     none     |  
|   `$camelCase$` |          Capitalized word except first one.         |  exempleCase |  
|  `$pascalCase$` |                  Capitalized word.                  |  ExempleCase |  
|   `$snakeCase$` |  Lower case string with underscores between words.  | exemple_case |  
|   `$paramCase$` |    Lower cased string with dashes between words.    | exemple-case |  
| `$constantCase$` | Upper case string with an underscore between words. | EXEMPLE_CASE |  
| `$sentenceCase$` |    Lower cased string with spaces between words.    | exemple case |  




### V- Template directory structure

#### `ccc-config/`
```  
my-project-directory/  
├─ ccc-config/                   ---> CLI config directory  
│  │            
│  ├─ my-extravagant-$none$/         ---> A custom template  
│  │  ├─ template-config.json        ---> Component config file  
│  │  ├─ interfce-$none$.ts    
│  │  ├─ show-$none$-formated.html    
│  │  ├─ $none$-beauty.css    
│  │  ├─ test-my-$none$-please.test.ts    
│  │  └─ $none$.js  
│  │   
│  ├─ other$camelCase$Entity/         ---> Another template  
│  │  └─ ...  
│  │   
└─ ...  
```  
The `ccc-config/`**CLI configuration directory is mandatory** and it must be created at the root of your project.  
In this directory you will stored  all your templates like `my-extravagant-$none$` and `other$camelCase$Entity/`.

- The keywords "`[none]`" and  "`[camelCase]`"  belongs to a family of [generics keywords](#a--generics-keywords) .
- On running `generate` command  : Every `generic keywords` **will be replaced** by the [replacement value](#arguments-generate-)

## VI- Tempalte config file

### A -  Properties

#### `./template-config.json`
| Field | Type | Description |    
|:---------------------------------------------------:|:--------------------:|:----------------------------------------------------------:|    
| `template` | `string` |           **Required** & **Unique**. Template name.          |    
| [`"componentWorkDirectory"`](#componentWorkDirectory) | `string` \| `object` | **Required**. Used to set the component working directory. |  
This  configuration file is **mandatory**.

#### `"componentWorkDirectory"`: string | object
As **string** :  
|                  Field                 |   Type   |                      Description                      |  
|:--------------------------------------:|:--------:|:-----------------------------------------------------:|  
|    `componentWorkDir` | `string` |       **Required**. Component working directory.      |


As **object** :

|                  Field                 |   Type   |                      Description                      |  
|:--------------------------------------:|:--------:|:-----------------------------------------------------:|  
|    `componentWorkDir`.`rootWorkDir` | `string` |       **Required**. Component working directory.      |  
| `componentWorkDir` .`extensionWorkDir` | `string` | **Optional**. Exention of component working directory |  


Use the "`componentWorkDir`"  property as **object** when working with subdomains and want to create your components in different subdomains with  "`--subdomain`" option.

### B- Exemples
In all the examples we will create a '*repository*' component
#### Ex 1 : classic project


*Project* directory `my-classic-project`
```
my-classic-project/  
├─ ccc-config/   
├─ src/            
│  ├─ core/  
├─ node_modules/  
├─ package.json
└─ ...   
```
Repository *template* directory `my-$paramCase$-repository/ `
```
./ccc-config/  
├─ my-$paramCase$-repository/   
│  ├─ template-config.json     
│  ├─ interface-$paramCase$-repository.ts           
│  ├─ implementation-$paramCase$-repository.ts  
│  ├─ $paramCase$-repository.test.ts  
└─ ... 
 ```
Repository *template* file content : `interface-$paramCase$-repository.ts`
```typescript  
interface I$pascaCase$Repo = {  
  anyProperty : string,  
  hello : number  
  getAll$pascalCase$ () : Object[],  
  getOne$pascalCase$ () : Object[],  
}
```  


```json  
{  
  "template" : "repository",  
  "componentWorkDir" :"src/core"  
}
```  
Run


## VII- License & Author

##### Lience : [MIT](https://choosealicense.com/licenses/mit/)

##### Author : [@enzo-cora](https://www.github.com/enzo-cora)