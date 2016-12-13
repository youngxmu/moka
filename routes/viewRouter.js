var express = require('express');
var config = require('../config');
var path = require('path');
var articleModel = require('../models/articleModel.js');
var logger =  require('../lib/log.js').logger('viewRouter');
var router = express.Router();
var exec = require('child_process').exec;
var fs=require("fs");
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
	['7141','jsjn/课件/战略环境/2011-2012国际形势与中国周边安全环境.pptx'],
	['8','gsjyzy/file/2016-05-12_doc.doc'],
	['9','gsjyzy/file/2016-05-12_doc_1.doc'],
	['10','gsjyzy/file/2016-05-12_doc_10.doc'],
	['11','gsjyzy/file/2016-05-12_doc_100.doc'],
	['12','gsjyzy/file/2016-05-12_doc_101.doc'],
	['13','gsjyzy/file/2016-05-12_doc_102.doc'],
	['14','gsjyzy/file/2016-05-12_doc_103.doc'],
	['15','gsjyzy/file/2016-05-12_doc_104.doc'],
	['16','gsjyzy/file/2016-05-12_doc_105.doc'],
	['18','gsjyzy/file/2016-05-12_doc_107.doc'],
	['19','gsjyzy/file/2016-05-12_doc_108.doc'],
	['20','gsjyzy/file/2016-05-12_doc_109.doc'],
	['21','gsjyzy/file/2016-05-12_doc_11.doc'],
	['23','gsjyzy/file/2016-05-12_doc_111.doc'],
	['24','gsjyzy/file/2016-05-12_doc_112.doc'],
	['25','gsjyzy/file/2016-05-12_doc_113.doc'],
	['26','gsjyzy/file/2016-05-12_doc_114.doc'],
	['27','gsjyzy/file/2016-05-12_doc_115.doc'],
	['28','gsjyzy/file/2016-05-12_doc_116.doc'],
	['29','gsjyzy/file/2016-05-12_doc_117.doc'],
	['30','gsjyzy/file/2016-05-12_doc_118.doc'],
	['31','gsjyzy/file/2016-05-12_doc_119.doc'],
	['32','gsjyzy/file/2016-05-12_doc_12.doc'],
	['33','gsjyzy/file/2016-05-12_doc_120.doc'],
	['34','gsjyzy/file/2016-05-12_doc_121.doc'],
	['35','gsjyzy/file/2016-05-12_doc_122.doc'],
	['36','gsjyzy/file/2016-05-12_DOC_123.doc'],
	['37','gsjyzy/file/2016-05-12_doc_124.doc'],
	['38','gsjyzy/file/2016-05-12_doc_125.doc'],
	['39','gsjyzy/file/2016-05-12_doc_126.doc'],
	['40','gsjyzy/file/2016-05-12_doc_127.doc'],
	['41','gsjyzy/file/2016-05-12_doc_128.doc'],
	['42','gsjyzy/file/2016-05-12_doc_129.doc'],
	['43','gsjyzy/file/2016-05-12_doc_13.doc'],
	['44','gsjyzy/file/2016-05-12_doc_130.doc'],
	['45','gsjyzy/file/2016-05-12_doc_131.doc'],
	['46','gsjyzy/file/2016-05-12_doc_132.doc'],
	['47','gsjyzy/file/2016-05-12_doc_133.doc'],
	['48','gsjyzy/file/2016-05-12_doc_134.doc'],
	['49','gsjyzy/file/2016-05-12_doc_135.doc'],
	['50','gsjyzy/file/2016-05-12_doc_136.doc'],
	['51','gsjyzy/file/2016-05-12_doc_137.doc'],
	['52','gsjyzy/file/2016-05-12_doc_138.doc'],
	['53','gsjyzy/file/2016-05-12_doc_139.doc'],
	['54','gsjyzy/file/2016-05-12_doc_14.doc'],
	['55','gsjyzy/file/2016-05-12_doc_140.doc'],
	['56','gsjyzy/file/2016-05-12_doc_141.doc'],
	['57','gsjyzy/file/2016-05-12_doc_142.doc'],
	['58','gsjyzy/file/2016-05-12_doc_143.doc'],
	['59','gsjyzy/file/2016-05-12_doc_144.doc'],
	['60','gsjyzy/file/2016-05-12_doc_145.doc'],
	['61','gsjyzy/file/2016-05-12_doc_146.doc'],
	['62','gsjyzy/file/2016-05-12_doc_147.doc'],
	['63','gsjyzy/file/2016-05-12_doc_148.doc'],
	['64','gsjyzy/file/2016-05-12_doc_149.doc'],
	['65','gsjyzy/file/2016-05-12_doc_15.doc'],
	['66','gsjyzy/file/2016-05-12_doc_150.doc'],
	['67','gsjyzy/file/2016-05-12_doc_151.doc'],
	['68','gsjyzy/file/2016-05-12_doc_152.doc'],
	['69','gsjyzy/file/2016-05-12_doc_153.doc'],
	['70','gsjyzy/file/2016-05-12_doc_154.doc'],
	['71','gsjyzy/file/2016-05-12_doc_155.doc'],
	['72','gsjyzy/file/2016-05-12_doc_156.doc'],
	['73','gsjyzy/file/2016-05-12_doc_157.doc'],
	['74','gsjyzy/file/2016-05-12_doc_158.doc'],
	['75','gsjyzy/file/2016-05-12_doc_159.doc'],
	['76','gsjyzy/file/2016-05-12_doc_16.doc'],
	['77','gsjyzy/file/2016-05-12_doc_160.doc'],
	['78','gsjyzy/file/2016-05-12_doc_161.doc'],
	['79','gsjyzy/file/2016-05-12_doc_162.doc'],
	['80','gsjyzy/file/2016-05-12_doc_163.doc'],
	['81','gsjyzy/file/2016-05-12_doc_164.doc'],
	['82','gsjyzy/file/2016-05-12_doc_165.doc'],
	['83','gsjyzy/file/2016-05-12_doc_166.doc'],
	['84','gsjyzy/file/2016-05-12_doc_167.doc'],
	['85','gsjyzy/file/2016-05-12_doc_168.doc'],
	['86','gsjyzy/file/2016-05-12_doc_169.doc'],
	['87','gsjyzy/file/2016-05-12_doc_17.doc'],
	['88','gsjyzy/file/2016-05-12_doc_170.doc'],
	['89','gsjyzy/file/2016-05-12_doc_171.doc'],
	['90','gsjyzy/file/2016-05-12_doc_172.doc'],
	['91','gsjyzy/file/2016-05-12_doc_173.doc'],
	['92','gsjyzy/file/2016-05-12_doc_174.doc'],
	['93','gsjyzy/file/2016-05-12_doc_175.doc'],
	['94','gsjyzy/file/2016-05-12_doc_176.doc'],
	['95','gsjyzy/file/2016-05-12_doc_177.doc'],
	['96','gsjyzy/file/2016-05-12_doc_178.doc'],
	['97','gsjyzy/file/2016-05-12_doc_179.doc'],
	['98','gsjyzy/file/2016-05-12_doc_18.doc'],
	['99','gsjyzy/file/2016-05-12_doc_180.doc'],
	['100','gsjyzy/file/2016-05-12_doc_181.doc'],
	['101','gsjyzy/file/2016-05-12_doc_182.doc'],
	['102','gsjyzy/file/2016-05-12_doc_183.doc'],
	['103','gsjyzy/file/2016-05-12_doc_184.doc'],
	['104','gsjyzy/file/2016-05-12_doc_185.doc'],
	['105','gsjyzy/file/2016-05-12_doc_186.doc'],
	['106','gsjyzy/file/2016-05-12_doc_187.doc'],
	['107','gsjyzy/file/2016-05-12_doc_188.doc'],
	['108','gsjyzy/file/2016-05-12_doc_189.doc'],
	['109','gsjyzy/file/2016-05-12_doc_19.doc'],
	['110','gsjyzy/file/2016-05-12_doc_190.doc'],
	['111','gsjyzy/file/2016-05-12_doc_191.doc'],
	['112','gsjyzy/file/2016-05-12_doc_192.doc'],
	['113','gsjyzy/file/2016-05-12_doc_193.doc'],
	['114','gsjyzy/file/2016-05-12_doc_194.doc'],
	['115','gsjyzy/file/2016-05-12_doc_195.doc'],
	['116','gsjyzy/file/2016-05-12_doc_196.doc'],
	['117','gsjyzy/file/2016-05-12_doc_197.doc'],
	['118','gsjyzy/file/2016-05-12_doc_198.doc'],
	['119','gsjyzy/file/2016-05-12_doc_199.doc'],
	['120','gsjyzy/file/2016-05-12_doc_2.doc'],
	['121','gsjyzy/file/2016-05-12_doc_20.doc'],
	['122','gsjyzy/file/2016-05-12_doc_200.doc'],
	['123','gsjyzy/file/2016-05-12_doc_201.doc'],
	['124','gsjyzy/file/2016-05-12_doc_202.doc'],
	['125','gsjyzy/file/2016-05-12_doc_203.doc'],
	['126','gsjyzy/file/2016-05-12_doc_204.doc'],
	['127','gsjyzy/file/2016-05-12_doc_205.doc'],
	['128','gsjyzy/file/2016-05-12_doc_206.doc'],
	['129','gsjyzy/file/2016-05-12_doc_207.doc'],
	['130','gsjyzy/file/2016-05-12_doc_208.doc'],
	['131','gsjyzy/file/2016-05-12_doc_209.doc'],
	['132','gsjyzy/file/2016-05-12_doc_21.doc'],
	['133','gsjyzy/file/2016-05-12_doc_211.doc'],
	['134','gsjyzy/file/2016-05-12_doc_212.doc'],
	['135','gsjyzy/file/2016-05-12_doc_213.doc'],
	['136','gsjyzy/file/2016-05-12_doc_214.doc'],
	['137','gsjyzy/file/2016-05-12_doc_215.doc'],
	['138','gsjyzy/file/2016-05-12_doc_216.doc'],
	['139','gsjyzy/file/2016-05-12_doc_218.doc'],
	['140','gsjyzy/file/2016-05-12_doc_219.doc'],
	['141','gsjyzy/file/2016-05-12_doc_22.doc'],
	['142','gsjyzy/file/2016-05-12_doc_220.doc'],
	['143','gsjyzy/file/2016-05-12_doc_221.doc'],
	['144','gsjyzy/file/2016-05-12_doc_222.doc'],
	['145','gsjyzy/file/2016-05-12_doc_223.doc'],
	['146','gsjyzy/file/2016-05-12_doc_224.doc'],
	['147','gsjyzy/file/2016-05-12_doc_225.doc'],
	['148','gsjyzy/file/2016-05-12_doc_226.doc'],
	['149','gsjyzy/file/2016-05-12_doc_227.doc'],
	['150','gsjyzy/file/2016-05-12_doc_228.doc'],
	['151','gsjyzy/file/2016-05-12_doc_229.doc'],
	['152','gsjyzy/file/2016-05-12_doc_23.doc'],
	['153','gsjyzy/file/2016-05-12_doc_230.doc'],
	['154','gsjyzy/file/2016-05-12_doc_231.doc'],
	['155','gsjyzy/file/2016-05-12_doc_232.doc'],
	['156','gsjyzy/file/2016-05-12_doc_233.doc'],
	['157','gsjyzy/file/2016-05-12_doc_234.doc'],
	['158','gsjyzy/file/2016-05-12_doc_235.doc'],
	['159','gsjyzy/file/2016-05-12_doc_236.doc'],
	['160','gsjyzy/file/2016-05-12_doc_237.doc'],
	['161','gsjyzy/file/2016-05-12_doc_238.doc'],
	['162','gsjyzy/file/2016-05-12_doc_239.doc'],
	['163','gsjyzy/file/2016-05-12_doc_24.doc'],
	['164','gsjyzy/file/2016-05-12_doc_240.doc'],
	['165','gsjyzy/file/2016-05-12_doc_241.doc'],
	['166','gsjyzy/file/2016-05-12_doc_242.doc'],
	['167','gsjyzy/file/2016-05-12_doc_243.doc'],
	['168','gsjyzy/file/2016-05-12_doc_244.doc'],
	['169','gsjyzy/file/2016-05-12_doc_245.doc'],
	['170','gsjyzy/file/2016-05-12_doc_246.doc'],
	['171','gsjyzy/file/2016-05-12_doc_247.doc'],
	['172','gsjyzy/file/2016-05-12_doc_248.doc'],
	['173','gsjyzy/file/2016-05-12_doc_249.doc'],
	['174','gsjyzy/file/2016-05-12_doc_25.doc'],
	['175','gsjyzy/file/2016-05-12_doc_250.doc'],
	['176','gsjyzy/file/2016-05-12_doc_251.doc'],
	['177','gsjyzy/file/2016-05-12_doc_252.doc'],
	['178','gsjyzy/file/2016-05-12_doc_253.doc'],
	['179','gsjyzy/file/2016-05-12_doc_255.doc'],
	['180','gsjyzy/file/2016-05-12_doc_256.doc'],
	['181','gsjyzy/file/2016-05-12_doc_257.doc'],
	['182','gsjyzy/file/2016-05-12_doc_258.doc'],
	['183','gsjyzy/file/2016-05-12_doc_259.doc'],
	['184','gsjyzy/file/2016-05-12_doc_26.doc'],
	['185','gsjyzy/file/2016-05-12_doc_260.doc'],
	['186','gsjyzy/file/2016-05-12_doc_261.doc'],
	['187','gsjyzy/file/2016-05-12_doc_262.doc'],
	['188','gsjyzy/file/2016-05-12_doc_263.doc'],
	['189','gsjyzy/file/2016-05-12_doc_264.doc'],
	['190','gsjyzy/file/2016-05-12_doc_265.doc'],
	['191','gsjyzy/file/2016-05-12_doc_266.doc'],
	['192','gsjyzy/file/2016-05-12_doc_267.doc'],
	['193','gsjyzy/file/2016-05-12_doc_268.doc'],
	['194','gsjyzy/file/2016-05-12_doc_269.doc'],
	['195','gsjyzy/file/2016-05-12_doc_27.doc'],
	['196','gsjyzy/file/2016-05-12_doc_270.doc'],
	['197','gsjyzy/file/2016-05-12_doc_271.doc'],
	['198','gsjyzy/file/2016-05-12_doc_272.doc'],
	['199','gsjyzy/file/2016-05-12_doc_273.doc'],
	['200','gsjyzy/file/2016-05-12_doc_274.doc'],
	['201','gsjyzy/file/2016-05-12_doc_275.doc'],
	['202','gsjyzy/file/2016-05-12_doc_276.doc'],
	['203','gsjyzy/file/2016-05-12_doc_277.doc'],
	['204','gsjyzy/file/2016-05-12_doc_278.doc'],
	['205','gsjyzy/file/2016-05-12_doc_279.doc'],
	['206','gsjyzy/file/2016-05-12_doc_28.doc'],
	['207','gsjyzy/file/2016-05-12_doc_280.doc'],
	['208','gsjyzy/file/2016-05-12_doc_281.doc'],
	['209','gsjyzy/file/2016-05-12_doc_282.doc'],
	['210','gsjyzy/file/2016-05-12_doc_283.doc'],
	['211','gsjyzy/file/2016-05-12_doc_284.doc'],
	['212','gsjyzy/file/2016-05-12_doc_285.doc'],
	['213','gsjyzy/file/2016-05-12_doc_286.doc'],
	['214','gsjyzy/file/2016-05-12_doc_287.doc'],
	['215','gsjyzy/file/2016-05-12_doc_288.doc'],
	['216','gsjyzy/file/2016-05-12_doc_289.doc']
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
	// articleModel.getArticleById(id, function(err, article){
	// 	if(err){
	// 		console.log(id + ' err');
	// 		cursor++;
	// 		batch(cursor);
	// 	}else{
	// 		if(article.view_name){
	// 			console.log(article.view_name + ' is exsited！');
	// 			cursor++;
	// 			batch(cursor);
	// 		}else{
	// 			var index = path.lastIndexOf('.');
	// 			var pdfPath = path.substr(0,index) + '.pdf';
	// 			var srcPath = pdfPath;
	// 			path = config.uploadDir + '/' + path;
	// 			pdfPath = config.uploadDir + '/' + pdfPath;
	// 			path= path.replace(/\//g,'\\');
	// 			pdfPath= pdfPath.replace(/\//g,'\\');
				
	// 			var cmd = 'java -jar d://pptUtils.jar "' + path + '" "'+ pdfPath +'"';
	// 			console.log(cmd);
	// 			exec(cmd, [], function(re){
	// 				articleModel.updateViewName(id, srcPath, function(err){
	// 					if(err){
	// 						logger.error(err, 'update error');
	// 					}else{
	// 						console.log(id + ' is completed！');
	// 					}
	// 					cursor++;
	// 					batch(cursor);
	// 				});
	// 			})
	// 		}
	// 	}
	// });

	var index = path.lastIndexOf('.');
	var pdfPath = path.substr(0,index) + '.pdf';
	var srcPath = pdfPath;
	path = config.uploadDir + '/' + path;
	pdfPath = config.uploadDir + '/' + pdfPath;
	path= path.replace(/\//g,'\\');
	pdfPath= pdfPath.replace(/\//g,'\\');

	fs.exists(pdfPath,function(exists){
	  	if(exists){
	  		console.log(pdfPath + ' is exsited！');
	     	cursor++;
	     	batch(cursor);
	  	}
     	if(!exists){
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
  	});
};



module.exports = router;