var express = require('express');
var config = require('../config');
var path = require('path');
var articleModel = require('../models/articleModel.js');
var logger =  require('../lib/log.js').logger('viewRouter');
var router = express.Router();
var exec = require('child_process').exec;

router.post('/ppt', function(req, res) {
	var path = req.body.path;
	var id = req.body.id;
	var index = path.lastIndexOf('.');
	var pdfPath = path.substr(0,index) + '.pdf';
	var srcPath = pdfPath;
	path = config.uploadDir + '/' + path;
	pdfPath = config.uploadDir + '/' + pdfPath;
	path= path.replace(/\//g,'\\');
	pdfPath= pdfPath.replace(/\//g,'\\');
	
	var cmd = 'java -jar d://pptUtils.jar "' + path + '" "'+ pdfPath +'"';
	console.log(cmd);
	exec(cmd, [], function(re){
		articleModel.updateViewName(id, srcPath, function(err){
			if(err){
				logger.error(err, 'update error');
			}
			res.json({
				src : srcPath
			});
		});
	})
});


var arr = [
	['282','gsjyzy/ppt/单兵战术.ppt'],
	['283','gsjyzy/ppt/共同条令.ppt'],
	['284','gsjyzy/ppt/国防动员.ppt'],
	['285','gsjyzy/ppt/核化生武器防护.ppt'],
	['286','gsjyzy/ppt/军事思想概述.ppt'],
	['287','gsjyzy/ppt/军训意义和作用.ppt'],
	['288','gsjyzy/ppt/轻武器.ppt'],
	['289','gsjyzy/ppt/识图用图.ppt'],
	['290','gsjyzy/ppt/心理卫生讲座.ppt'],
	['291','gsjyzy/ppt/信息化战争.ppt'],
	['292','gsjyzy/ppt/战伤救护.ppt'],
	['293','gsjyzy/ppt/中国当代军事思想.ppt'],
	['294','gsjyzy/ppt/中国国防概述.ppt'],
	['295','gsjyzy/ppt/中国国防历史与新中国国防建设.ppt'],
	['296','gsjyzy/ppt/中国武装力量.ppt'],
	['297','gsjyzy/ppt/中国周边安全环境.ppt'],
	['7085','jsjn/课件/军训技能/共同条令.ppt'],
	['7086','jsjn/课件/军训技能/军训意义和作用.ppt'],
	['7087','jsjn/课件/军训技能/单兵战术.ppt'],
	['7088','jsjn/课件/军训技能/心理卫生讲座.ppt'],
	['7089','jsjn/课件/军训技能/战伤救护.ppt'],
	['7090','jsjn/课件/军训技能/核化生武器防护.ppt'],
	['7091','jsjn/课件/军训技能/识图用图.ppt'],
	['7092','jsjn/课件/军训技能/轻武器.ppt'],
	['7093','jsjn/课件/示范课件/中国周边安全环境.ppt'],
	['7094','jsjn/课件/示范课件/中国国防历史与新中国国防建设.ppt'],
	['7095','jsjn/课件/示范课件/中国国防概述.ppt'],
	['7096','jsjn/课件/示范课件/中国当代军事思想.ppt'],
	['7097','jsjn/课件/示范课件/中国武装力量.ppt'],
	['7098','jsjn/课件/示范课件/信息化战争.ppt'],
	['7099','jsjn/课件/示范课件/军事思想概述.ppt'],
	['7100','jsjn/课件/示范课件/国防动员.ppt'],
	['7101','jsjn/课件/示范课件/国防法规.ppt'],
	['7102','jsjn/课件/示范课件/国际战略格局.ppt'],
	['7103','jsjn/课件/示范课件/国际战略环境.ppt'],
	['7104','jsjn/课件/示范课件/战略环境概述.ppt'],
	['7105','jsjn/课件/示范课件/新概念武器.ppt'],
	['7106','jsjn/课件/示范课件/核化生武器.ppt'],
	['7107','jsjn/课件/示范课件/毛泽东军事思想.ppt'],
	['7108','jsjn/课件/示范课件/美日本军事基本情况.ppt'],
	['7109','jsjn/课件/示范课件/高技术与新军事变革.ppt'],
	['7110','jsjn/课件/中国国防/世界军事与中国国防.ppt'],
	['7111','jsjn/课件/中国国防/中国国防.pptx'],
	['7112','jsjn/课件/中国国防/中国国防（一）.ppt'],
	['7113','jsjn/课件/中国国防/中国国防（二）.ppt'],
	['7114','jsjn/课件/中国国防/中国武装力量 (2).ppt'],
	['7115','jsjn/课件/中国国防/中国武装力量.ppt'],
	['7116','jsjn/课件/中国国防/国防动员 (2).ppt'],
	['7117','jsjn/课件/中国国防/国防动员 (3).ppt'],
	['7118','jsjn/课件/中国国防/国防动员.ppt'],
	['7119','jsjn/课件/中国国防/国防历史.ppt'],
	['7120','jsjn/课件/中国国防/国防建设.ppt'],
	['7121','jsjn/课件/中国国防/国防建设和动员.ppt'],
	['7122','jsjn/课件/中国国防/国防概述 (2).ppt'],
	['7123','jsjn/课件/中国国防/国防概述 (3).ppt'],
	['7124','jsjn/课件/中国国防/国防概述 (4).ppt'],
	['7125','jsjn/课件/中国国防/国防概述.ppt'],
	['7126','jsjn/课件/中国国防/国防法规 (2).PPT'],
	['7127','jsjn/课件/中国国防/国防法规.ppt'],
	['7128','jsjn/课件/中国国防/武装力量建设.ppt'],
	['7129','jsjn/课件/军事思想/中国古代军事思想 (2).ppt'],
	['7130','jsjn/课件/军事思想/中国古代军事思想.ppt'],
	['7131','jsjn/课件/军事思想/中国古代近代军事思想.pptx'],
	['7132','jsjn/课件/军事思想/军事思想.ppt'],
	['7133','jsjn/课件/军事思想/军事思想概述 (2).ppt'],
	['7134','jsjn/课件/军事思想/军事思想概述.ppt'],
	['7135','jsjn/课件/军事思想/毛泽东军事思想 (2).PPT'],
	['7136','jsjn/课件/军事思想/毛泽东军事思想 (3).ppt'],
	['7137','jsjn/课件/军事思想/毛泽东军事思想.ppt'],
	['7138','jsjn/课件/军事思想/江泽民论国防和军队建设思想.ppt'],
	['7139','jsjn/课件/军事思想/胡锦涛关于国防和军队建设重要论述.ppt'],
	['7140','jsjn/课件/军事思想/邓小平新时期军队建设思想.ppt'],
	['7142','jsjn/课件/战略环境/世界战略环境.ppt'],
	['7143','jsjn/课件/战略环境/中国周边安全态势.ppt'],
	['7144','jsjn/课件/战略环境/中国周边安全环境.ppt'],
	['7145','jsjn/课件/战略环境/中国周边安全环境（一）.ppt'],
	['7146','jsjn/课件/战略环境/中国周边安全环境（二）.ppt'],
	['7147','jsjn/课件/战略环境/中日关系.ppt'],
	['7148','jsjn/课件/战略环境/台海局势问题.ppt'],
	['7149','jsjn/课件/战略环境/国际战略格局.ppt'],
	['7150','jsjn/课件/战略环境/国际战略环境概述.ppt'],
	['7151','jsjn/课件/战略环境/我国周边安全环境 (2).ppt'],
	['7152','jsjn/课件/战略环境/我国周边安全环境 (3).ppt'],
	['7153','jsjn/课件/战略环境/我国周边安全环境(三).ppt'],
	['7154','jsjn/课件/战略环境/我国周边安全环境.ppt'],
	['7155','jsjn/课件/战略环境/我国周边安全环境（一).ppt'],
	['7156','jsjn/课件/战略环境/我国周边安全环境（二）.ppt'],
	['7157','jsjn/课件/战略环境/战略环境与国际战略格局.ppt'],
	['7158','jsjn/课件/战略环境/战略环境概述.ppt'],
	['7159','jsjn/课件/军事高技术/侦察监视技术.ppt'],
	['7160','jsjn/课件/军事高技术/侦查监视技术.ppt'],
	['7161','jsjn/课件/军事高技术/光电对抗.ppt'],
	['7162','jsjn/课件/军事高技术/军事航天技术.ppt'],
	['7163','jsjn/课件/军事高技术/军事高技术 (2).ppt'],
	['7164','jsjn/课件/军事高技术/军事高技术.ppt'],
	['7165','jsjn/课件/军事高技术/军事高技术概述 (2).ppt'],
	['7166','jsjn/课件/军事高技术/军事高技术概述.ppt'],
	['7167','jsjn/课件/军事高技术/导弹制导原理.ppt'],
	['7168','jsjn/课件/军事高技术/新军事变革与国防现代化.ppt'],
	['7169','jsjn/课件/军事高技术/激光武器.ppt'],
	['7170','jsjn/课件/军事高技术/电子战与指挥自动.ppt'],
	['7171','jsjn/课件/军事高技术/精确制导技术.ppt'],
	['7172','jsjn/课件/军事高技术/精确制导技术及应用.ppt'],
	['7173','jsjn/课件/军事高技术/隐身技术及应用.ppt'],
	['7174','jsjn/课件/军事高技术/雷达干扰原理.ppt'],
	['7175','jsjn/课件/军事高技术/高技术与新军事变革.ppt'],
	['7176','jsjn/课件/军事高技术/高技术在军事上的应用 (2).PPT'],
	['7177','jsjn/课件/军事高技术/高技术在军事上的应用.ppt'],
	['7178','jsjn/课件/军事高技术/高技术战争 (2).ppt'],
	['7179','jsjn/课件/军事高技术/高技术战争.ppt'],
	['7180','jsjn/课件/信息化战争/信息化战争 (2).ppt'],
	['7181','jsjn/课件/信息化战争/信息化战争 (3).ppt'],
	['7182','jsjn/课件/信息化战争/信息化战争.ppt'],
	['7183','jsjn/课件/信息化战争/信息化战争与国防建设.ppt'],
	['7184','jsjn/课件/信息化战争/信息化战争与现代国防.ppt'],
	['7185','jsjn/课件/信息化战争/信息化战争概述.ppt'],
	['7186','jsjn/课件/信息化战争/信息化战争的特征与发展趋势.ppt'],
	['7187','jsjn/课件/信息化战争/高技术战争.ppt'],
	['7188','jsjn/课件/相关课件/2012国际形势的回顾与展望.ppt'],
	['7189','jsjn/课件/相关课件/世界军事形势与反台独军事斗争准备.ppt'],
	['7190','jsjn/课件/相关课件/中国南沙群岛安全问题凸显.ppt'],
	['7191','jsjn/课件/相关课件/中国南海、东海海权之争.ppt'],
	['7192','jsjn/课件/相关课件/中国航母----辽宁舰.ppt'],
	['7193','jsjn/课件/相关课件/中菲黄岩岛问题.ppt'],
	['7194','jsjn/课件/相关课件/争议地区.ppt'],
	['7195','jsjn/课件/相关课件/关于战争观的几个问题.ppt'],
	['7196','jsjn/课件/相关课件/军事高技术的发展与国防观念的更新.PPT'],
	['7197','jsjn/课件/相关课件/国际国内形势政策分析.ppt'],
	['7198','jsjn/课件/相关课件/坦克.ppt'],
	['7199','jsjn/课件/相关课件/孙子兵法及应用.ppt'],
	['7200','jsjn/课件/相关课件/我国的钓鱼岛问题-2013年4月.ppt'],
	['7201','jsjn/课件/相关课件/战机.ppt'],
	['7202','jsjn/课件/相关课件/新世纪新阶段我军历史使命.ppt'],
	['7203','jsjn/课件/相关课件/枪械.ppt'],
	['7204','jsjn/课件/相关课件/核武器.ppt'],
	['7205','jsjn/课件/相关课件/毛泽东战略战术.ppt'],
	['7206','jsjn/课件/相关课件/海洋权益问题.ppt'],
	['7207','jsjn/课件/相关课件/火炮.ppt'],
	['7208','jsjn/课件/相关课件/航天科普知识.ppt'],
	['7209','jsjn/课件/相关课件/舰艇.ppt'],
	['7210','jsjn/课件/相关课件/隐形战斗机.ppt'],
	['7211','jsjn/课件/相关课件/雷达卫星.ppt'],
	['7212','jsjn/课件/教学指导/军事科学概论.ppt'],
	['7213','jsjn/课件/教学指导/军事课教学大纲解读.ppt'],
	['7214','jsjn/课件/教学指导/多媒体教材界面设计.ppt'],
	['7215','jsjn/课件/教学指导/怎样上好军事课.ppt'],
	['7216','jsjn/课件/教学指导/教学原理和方法.PPT'],
	['7217','jsjn/课件/教学指导/普通高校军事理论课教学.ppt'],
	['7218','jsjn/课件/教学指导/邓小平新时期军队建设思想的教学.ppt'],
	['7219','jsjn/课件/教学辅助/1764个透明水晶图标素材.ppt'],
	['7220','jsjn/课件/教学辅助/300个精美3D图标.ppt'],
	['7221','jsjn/课件/教学辅助/PPT制作十大内功.pptx'],
	['7222','jsjn/课件/教学辅助/PPT图片创意七招.pptx'],
	['7223','jsjn/课件/教学辅助/PPT图表全集.ppt'],
	['7224','jsjn/课件/教学辅助/PPT排版技巧.pptx'],
	['7225','jsjn/课件/教学辅助/军事符号.pptx'],
	['7141','jsjn/课件/战略环境/2011-2012国际形势与中国周边安全环境.pptx']
];
var length = arr.length;
router.get('/batch', function(req, res) {
	console.log('start');
	batch(0);
});

var batch = function(cursor){
	if(cursor >= length){
		console.log('全部完成');
		return false;
	}

	console.log('batch cursor ' + cursor);
	var item = arr[cursor];
	var id = item[0];
	var path = item[1];
	articleModel.getArticleById(id, function(err, article){
		if(err){
			console.log(id + ' err');
			cursor++;
			batch(cursor);
		}else{
			if(article.view_name){
				console.log(article.view_name + ' is exsited！');
				cursor++;
				batch(cursor);
			}else{
				var index = path.lastIndexOf('.');
				var pdfPath = path.substr(0,index) + '.pdf';
				var srcPath = pdfPath;
				path = config.uploadDir + '/' + path;
				pdfPath = config.uploadDir + '/' + pdfPath;
				path= path.replace(/\//g,'\\');
				pdfPath= pdfPath.replace(/\//g,'\\');
				
				var cmd = 'java -jar d://pptUtils.jar "' + path + '" "'+ pdfPath +'"';
				console.log(cmd);
				exec(cmd, [], function(re){
					articleModel.updateViewName(id, srcPath, function(err){
						if(err){
							logger.error(err, 'update error');
						}else{
							console.log(id + ' is completed！');
						}
						cursor++;
						batch(cursor);
					});
				})
			}
		}
	});
};



module.exports = router;