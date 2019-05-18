'use strict';
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

/**
 * 文件生成器
 */
class FileGenerator {
  constructor(filePath) {
    this.generateFile(filePath);
  }

  /**
   * 生成文件
   * @param {*} filePath 文件路径
   */
  generateFile(filePath) {
    // 切分路径，上一个/后面文件名
    const index = filePath.lastIndexOf('/');
    const fileSourcePath = filePath.slice(0, index).replace('"', '');
	let fileNamePath = `${filePath.slice(index + 1, filePath.length).replace('"', '')}`;
	const checkFirstUpperCase = this.checkFirstUpperCase(fileNamePath);

	if (!checkFirstUpperCase) {
		console.log(`Error: 组件名 ${fileNamePath} 首字母必须大写`);
		return;
	}
	if (fileNamePath.indexOf('-') !== -1) {
		console.log(`Error: 组件名 ${fileNamePath} 不应该包含 - 符号`);
		return;
	}

	// 去除后缀
	const pointIndex = fileNamePath.lastIndexOf('.');
	if (pointIndex !== -1) {
		fileNamePath = fileNamePath.substr(0, pointIndex);
		console.log(fileNamePath);
	}

    // 检测目录是否存在,不存在创建
	const folderExist = this.checkFolderOrFileExist(fileSourcePath);
	const folderPath = path.resolve(process.cwd(), fileSourcePath);
  const componentName = `${fileSourcePath}/${fileNamePath}.vue`;
    if (folderExist && fs.readdirSync(folderPath).length > 0) {
		  console.error(`Error: 组件 ${folderPath} 目录不能存在文件`);
		  return;
    } else {
		mkdirp.sync(folderPath);
		const createResult = this.createTemplate(folderPath, fileNamePath);

		if (createResult && createResult.success) {
			console.log('Success 成功创建组件: ', componentName);
		}
  	}
  }

  /**
   * 检测目录是否存在,不存在创建
   * @param {*} fileSourcePath 目录路径
   */
  checkFolderOrFileExist(fileSourcePath) {
	const pathStr = path.resolve(process.cwd(), fileSourcePath);
	console.log(pathStr);
    let result = false;
    try {
      if (fs.existsSync(pathStr)) {
        // file exists
        result = true;
      }
    } catch(err) {
      // console.error(err)
      result = false;
    }
    return result;
  }

  /**
   * 创建模板
   * @param {*} fileSourcePath 路径名
   * @param {*} fileName 文件名
   */
  createTemplate(fileSourcePath, fileName) {
    let result = {
		success: false
	};
    try {
      // 主入口文件
      const vuePath = `${fileSourcePath}/${fileName}.vue`;
      const vueContent = this.getVueTemplate(fileName);
      fs.writeFileSync(vuePath, vueContent);

      // 样式
      const vueCssPath = `${fileSourcePath}/${fileName}.vue.css`;
      const vueCssContent = this.getCssTemplate();
      fs.writeFileSync(vueCssPath, vueCssContent);

      // JS逻辑
      const fileCommentName = this.getFileComponentName(fileName);
      const vueJSPath = `${fileSourcePath}/${fileName}.vue.js`;
      const vueJSContent = this.getJsContent(fileCommentName);
      fs.writeFileSync(vueJSPath, vueJSContent);

      // HTML模板
      const vueHtmlPath = `${fileSourcePath}/${fileName}.vue.html`;
      const vueHtmlContent = this.getHtmlContent(fileCommentName);
      fs.writeFileSync(vueHtmlPath, vueHtmlContent);

      result = {
        success: true
      };
    } catch (error) {
      result = {
        success: false,
        error
	  };
    }

    return result;
  }

  /**
   * 获取组件名
   * @param {*} compentName 组件名
   */
  getFileComponentName(compentName) {
    const compentNameList = compentName.split('');
    let compentGenerateName = '';
    for(let i = 0; i < compentNameList.length; i++) {
      let wordsItem = compentNameList[i];
      if (i != 0) {
        if (this.checkUpperCase(wordsItem)) {
          wordsItem = `-${wordsItem.toLowerCase()}`;
        }
      } else {
        wordsItem = wordsItem.toLowerCase();
      }
      compentGenerateName += wordsItem
    }

    return compentGenerateName;
  }

  /**
   * 检测组件名是否首字母大写
   * @param {*} compentName 文件名
   */
  checkFirstUpperCase(compentName) {
	const compentNameList = compentName.split('');
	if (compentNameList && compentNameList.length > 0) {
		const checkItem = compentNameList[0] || '';

		if (this.checkUpperCase(checkItem)) {
			return true;
		}
	}

	return false;
  }

  /**
   * 大小写
   * @param {*} checkItem 比较字符
   */
  checkUpperCase(checkItem) {
    const reg = /^[A-Z]+$/;
    return reg.test(checkItem);
  }

  /**
   * HTML模板
   * @param {*} compentName 组件名
   */
  getHtmlContent(compentName) {
    return `
<div class="labelTxt">
  {{title}}
</div>
`;
  }

  /**
   * JS模板
   * @param {*} compentName 组件名
   */
  getJsContent(compentName) {
    return `
export default {
  name: '${compentName}',
  data () {
    return {
      title: '测试内容'
    }
  }
}
`;
  }

  /**
   * CSS样式模板
   */
  getCssTemplate() {
    return `
.labelTxt{
  font-size: 18px;
  color: aqua;
}
`;
  }

  /**
   * VUE入口模板
   * @param {*} fileName 文件名
   */
  getVueTemplate(fileName) {
    return `
/** 模板 */
<template src="./${fileName}.vue.html" lang="html"></template>

/** JS */
<script src="./${fileName}.vue.js" lang="js"></script>

/** 样式 */
<style src="./${fileName}.vue.css" lang="css"></style>
`;
  }

}

const splitString = process.env.npm_package_scripts_vux_generate || '';
const splitStringArray = splitString.split(' ');

if (splitStringArray.length > 1) {
  // 拿到用户创建目录
  const filePath = splitStringArray[2];

  // 检测目录
  if (filePath) {
    new FileGenerator(filePath);
  } else {
    console.log('请输入文件路径');
  }
}
