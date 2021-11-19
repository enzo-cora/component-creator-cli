
# Component creator CLI

![Tag github](https://img.shields.io/github/tag/enzo-cora/component-creator-cli.svg)
[![NPM Version](http://img.shields.io/npm/v/component-creator-cli.svg)](https://www.npmjs.org/package/component-creator-cli)
[![NPM Downloads](https://img.shields.io/npm/dm/component-creator-cli.svg)](https://npmcharts.com/compare/component-creator-cli?minimal=true)
[![Install Size](https://packagephobia.now.sh/badge?p=component-creator-cli)](https://packagephobia.now.sh/result?p=component-creator-cli)
![Issues](https://img.shields.io/github/issues/enzo-cora/component-creator-cli.svg)
[![Licence](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)

Description incomming ...


## CLI Features

| #                                                        | Meaning         |
|----------------------------------------------------------|-----------------|
| ![#0a192f](https://via.placeholder.com/10/00A000?text=+) | Implemented     |
| ![#f8f8f8](https://via.placeholder.com/10/e71837?text=+) | Not Implemented |


- ![green](https://via.placeholder.com/10/00A000?text=+) `Create you own custom component`
    - ![green](https://via.placeholder.com/10/00A000?text=+) `Define the files created by the component`
    - ![red](https://via.placeholder.com/10/e71837?text=+) `Define the files content`
- ![red](https://via.placeholder.com/10/e71837?text=+) `Delete created component`
- ![red](https://via.placeholder.com/10/e71837?text=+) `List component`
- ![red](https://via.placeholder.com/10/e71837?text=+) `Generate example component`
- ![green](https://via.placeholder.com/10/00A000?text=+) `Configure component for targeted domain `
- ![green](https://via.placeholder.com/10/00A000?text=+) `Configure component with flexibility subdomain`
- ![red](https://via.placeholder.com/10/e71837?text=+) `Choose formatting convention for auto-format each entities name`

## Demo

Gif incomming
![Demo animation cli](../images/create-component.png?raw=true)

## Usage & Examples

### Create component
```cmd
   $ ccc create extravagant order
   $ ccc create extravagant user
   $ ccc create extravagant smartphone
```

These commands will generate three components based on a custom "extravagant" template.  
The creation location is configured upstream (in the [template config file](#template-config-file) on "`componentWorkDirectory`" field).  
Here are the generated components :
```
FancifulEntities/
├─ MyExtravagantOrder/
│  ├─ ImplefaceOrder.ts          
│  ├─  showOrderInHtml.html
│  ├─ beautyOrder.css
│  ├─ testMyOrderPlease.test.ts
│  └─ someOrderJavascript.js
│  
├─ MyExtravagantUser/
│  ├─ ImplefaceUser.ts          
│  ├─ showUserInHtml.html
│  ├─ beautyUser.css
│  ├─ testMyUserPlease.test.ts
│  └─ someUserJavascript.js
│  
├─ MyExtravagantSmartphone/
│  ├─  ImplefaceSmartphone.ts          
│  ├─ showSmartphoneInHtml.html
│  ├─ beautySmartphone.css
│  ├─ testMySmartphonePlease.test.ts
│  └─ someSmartphoneJavascript.js

```
To change the default creation location you can use the `--subdomain` option
## Installation

Install `component-creator-cli` with npm as dev-dependency

```bash
  npm i -D component-creator-cli
```

For **run commands**, you will have to use
- `ccc` keyword




## CLI Reference

### Definitions:
  - **Template** : A template is a way of writing an entity with some information “left generic”, for the CLI to fill in later, when we actually use it.
  - **Component** :  A component is built version of a template
  
### Create component

```cmd
  $ ccc create <template-name> <replacement-value> [options]
```
#### Arguments `create` :
|      Argument     |  Type  |                                    Description                                   |
|:-----------------:|:------:|:--------------------------------------------------------------------------------:|
|   `<template-name>`   | `string` |                            **Required**. Name of template to use.                           |
| `<replacement-value>` | `string` | **Required**. Replacement value used to replace the [generic keyword](#generics-keywords) in brackets |


#### Options `create`:
|    Option   | Short |  Type  |                                    Description                                   | Default Value |
|:-----------:|:-----:|:------:|:--------------------------------------------------------------------------------:|:-------------:|
| `--subdomain` |   `-s`  | `string` | **Optional**. Name of subdomain placed between *main Domain* and *Component working directory* |      none     |

### Display help interface

```cmd
  $ ccc --help
```
## Configuration
### Generics keywords
The genereric keywords in brackets are recognized by the CLI and replaced by the [replacement value](#arguments-create-) provided.    
The value contained between the brackets defines formatting name of the 
- directory
- file
- class
- variable
- function 
- ...

|      Keyword     |           Formatting                                   |
|:-----------------:|:-----------------------------------:|
|   `[raw]`      |     Don't apply formatting 
|   `[camelCase]` |       Capitalizes the first letter of each word except the first one. |
|   `[PascalCase]` |      Capitalizes the first letter of each word |
|   `[snake_case]` |      Add a dash between each word and all of them are lowercase. |
|   `[kebab-case]` |      Add an underscore between each word and all of them are lowercase. |

### Structure : 
#### Your project structure
`my-app/`
```
my-app/
├─ component-creator-config/              ---> Config directory for CLI
│  ├─ ...
|
├─ package.json
├─ src/
├─ node_modules/
├─ ...

```
The CLI configuration directory is mandatory and it must be created at the root of your project.

#### CLI config directory structure
`component-creator-config/`
```
component-creator-config/
├─ config-component.json            ---> Main config file for CLI
├─ myName@Prefix[camelCase]Sufix/   ---> A custom template named "myName"
│  ├─ ...
│  │
├─ otherName@TheBest[snake_case]/   ---> Another custom template named "otherName"
│  ├─ ...

```
In this directory you will stored the global configuration file and your templates

#### Template directory structure
`myName@Prefix[camelCase]Sufix`
```
myName@Prefix[camelCase]Sufix/
├─ config-component.json            ---> (Falcultative) Component config file for CLI
├─ Imple[camelCase].ts
├─ Interface[camelCase].ts
├─ test[camelCase].test.ts
```


- In directory name , "`@`" is a separator
  - The name of the template is defined to the left of the separator. This name **should be unique**
  - The future component directory name is defined to the right of the separator
- The keyword "`[camelCase]`" belongs to a family of [generics keywords](#generics-keywords) in brackts.
- On running `create` command  : Every `[camelCase]` keywords **will be replaced** by the [replacement value](#arguments-create)

### Global config file

`config-global.json`
The global configuration file is **mandatory**.  

```json
{
  "domainWorkDirectory": "src/core"
}
```

|      Field     |  Type  |                                    Description                                   |
|:-----------------:|:------:|:--------------------------------------------------------------------------------:|
|   `domainWorkDirectory`   | `string` |**Required**. It's used to define the root working directory of CLI |


### Template config file
`config-component.json` The template configuration file is **optional**.

```json
{
  "componentWorkDirectory": "application/usecases"
}
```

|      Field     |  Type  |                                    Description                                   |
|:-----------------:|:------:|:--------------------------------------------------------------------------------:|
|   `componentWorkDirectory`   | `string` |**Required**. It's used to set the component working directory ifrom the root directory. |

## License

[MIT](https://choosealicense.com/licenses/mit/)


## Author

[@enzo-cora](https://www.github.com/enzo-cora)
