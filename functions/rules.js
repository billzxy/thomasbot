const utils = require("./utils");

const sendRules = async (msg) => {
	const SERVER_INVITE_LINK = "https://discord.gg/thecommunistreet";

    const introEmbed = {
		color: 0x3399cc,
		title: 'The Communi St. ',
		fields: [
			{
				name: '🏙️ 关于本街',
				value: '这是一个由朋友们组成，由朋友们维护，由朋友们支持，服务于朋友们的社区; 欢迎朋友们一起来玩游戏，聊天，整活，搞🟨色。'
			},
			{
				name: '🛂 户籍制度',
				value: '任何人都可以入驻本街，但是仅拥有*有限的*访问权限；*Kamerad/同志*户籍持有者，将会享受更多的社交权利；如果您想申请*Kamerad/同志*户籍，需要有一位拥有户籍的朋友邀请您; 户籍审核办事处的工作人员会尽快为您办理户籍和访问许可。'
			},
			{
				name: '🅰️ 官方语言',
				value: '官方语言为*中文*与*英文*，在与说不同语言的街民交流时，建议使用对方能听得懂的语言表达；禁止语言或口音歧视'
			},
			{
				name: '🔗 邀请好友',
				value: `[**邀请链接**](${SERVER_INVITE_LINK})`
			},
			{
				name: '🏙️ About the Street',
				value: ' This is a community formed by, maintained by, funded by, and created for friends and comrades. Friends and comrades are welcomed to hang out, play games, and meme around.'
			},
			{
				name: '🛂 Immigration Policy',
				value: 'Everyone is welcomed to join the community, *with limited access however.* Residents with a *Kamerad* permit will enjoy full social benefits.\n'+
					'The *Kamerad* permit is issued on an invitation-only basis: you need to be refered by a friend who is an existing *Kamerad* permit holder.\n'+
					'Your residency application will be reviewed, and your access permission granted, by registration administrators.'
			},
			{
				name: '🅰️ Official Languages',
				value: 'The official languages are *Mandarin Chinese* and *English*. Please also respect the presence of those who speak different languages, and choose the proper language during vocal communication.\n'+
					'*Language or accent discrimination will not be tolerated.*',
			},
			{
				name: '🔗 Invite a Friend',
				value: `[**Invitation Link**](${SERVER_INVITE_LINK})`
			}
		],
		image: {
			url: 'attachment://building.jpg',
		},
	};

	const basicLawEmbed = {
		title: '📜 基本法 | Basic Law ',
		description: '请阅读并遵守以下基本法条例\n'+'Please read and abide by the Basic Law',
		fields: [
			{
				name: '基本行为准则',
				value: '请尊重其他街民，做一个友善的、有礼貌的、亦可赛艇的街民。'
			},
			{
				name: 'Basic Code of Conduct',
				value: 'Please be respectful, friendly, polite, and exciting/excited.',
			},
			{
				name: '⚠️惩戒措施',
				value: '违法者将会受到惩戒。根据情节严重性，违法违纪者将会受到暂时性（或永久性）的：*禁言*、*收回特殊访问和权限许可*、*收回户籍及访问许可*、*赛博驱逐离街*等惩罚！'
			},
			{
				name: '⚠️Disciplinary Actions',
				value: 'Those who break the law shall be punished. Perpetrators will be temporarily(or permanently): *timed-out*, *having special access permissions revoked*, *having residency permit revoked*, *cyberly deported*, et cetera.',
			},
		],
	};

	const dosEmbed = {
		color: 0x40ff00,
		title: '🉑 Do\'s',
		fields: [
			{
				name: '请尊重',
				value: '我们能自豪地宣称：我们的街道是开放包容的；社区群体由多个性别、多种性向、多个族群、多个国籍、多种复杂背景的朋友们组成；请尊重其他人的权益、权利、主张、观点、相貌、爱好、性癖等。',
			},
			{
				name: '请分享',
				value: '分享：资讯、梗图、音乐、游戏相关内容、自制游戏精彩合集、政治讨论、促销打折商品、汽车赛车内容、猫猫狗狗、飞机坦克、涩图（仅限特定频道）等',
			},
			{
				name: '请交流',
				value: '欢迎随时进入语音频道聊天吹🅱️',
			},
			{
				name: 'Respect',
				value: 'This proudly open and tolerant community consists of friends of different genders, sexualities, ethnicities, nationalities, and complex backgrounds. Respect others\' rights, opinions, hobbies, and kinks.',
			},
			{
				name: 'Share',
				value: 'Share news, memes, emotes, music, gaming contents, game clips, politics, deals, cars, racing stuffs, cats, dogs, pets, tanks, props, jets, and NSFW stuffs (only in NSFW channels plz).',
			},
			{
				name: 'Communicate',
				value: 'You are welcomed to join voice channel any time and chat!',
			},
		]
	};

	const dontsEmbed = {
		color: 0xfc0341,
		title: '🈲 Don\'ts',
		fields: [
			{
				name: '不尊重人',
				value: '小朋友都知道应该怎么做',
			},
			{
				name: '不和平讨论',
				value: '允许讨论和争执，但请控制住情绪，就事论事；请不要煽风点火，禁止（逻辑学意义上的）人身攻击，严禁使用污言秽语骂人！！',
			},
			{
				name: '乱发涩图',
				value: '不要在不该发涩图的地方发涩图！！Discord官方审核机制会介入的！！',
			},
			{
				name: '炸麦',
				value: '偶然性炸麦并非人为可控事件，但还请照顾其他同志的听力健康；如果被指出有电流麦、炸麦，请及时自行闭麦或者修复。',
			},
			{
				name: 'Disrespect',
				value: 'You should know it by now',
			},
			{
				name: 'Heated Discussions Go South',
				value: 'Discussions and debates are allowed. However, please control your emotions and keep the boundaries in check. Do not add fuel to the fire. Ad hominem is not acceptable. Absolutly never will namecalling ever be allowed.',
			},
			{
				name: 'Nuclear Microphone',
				value: 'Please control your microphone input volume (or simply mute your mic) if someone points out that your mic is making disturbing noises.',
			},
		]
	};

	const disclaimerEmbed = {
		color: 0xf0c20c,
		title: 'ℹ️ 其他 | Miscellaneous',
		fields: [
			{
				name: '免责声明',
				value: '本Discord服务器为非盈利社区，服务器所有者和各个成员不对其他成员发布的内容承担任何法律责任；本服务器的名称和规则中的各种名称用语等都是以营造氛围和产生幽默效果为主，并非特定政治影射，请勿上纲上线。',
			},
			{
				name: '特别访问权限',
				value: 'NSFW频道的访问权限仅对特定成员开放; 请向管理员申请(不保证不会被驳回)',
			},
			{
				name: 'THOMAS',
				value: '大统领Thomas是本服的人工制杖, [**开源**](https://github.com/billzxy/thomasbot), 功能有限, 仅服务本服务器, 不定期维护',
			},
			{
				name: '特别感谢',
				value: '感谢所有为本服务器助力充电的*Kontributor*成员们, 因为有你们的存在, 我们才能享受高质量语音通话、1080p 60帧高质量直播、100MB大文件上传限制、可动服务器头像和横幅、自定义表情包等Level3超级服务器权限！',
			},
			{
				name: 'Disclaimer',
				value: 'This discord server is a non-for-profit community. The server owner and members are not responsible for any information shared or content created by other server members.\n'+
					'All the elements of the profile of the server (including but not limited to server name, avatar, banner, etc.) and terms used in this server rule serve only for aesthetic purposes;'+
					'they do not bear any connection to or serve as propaganda for real-world political organizations.',
			},
			{
				name: 'Special Access Permission',
				value: 'NSFW channels are only open to certain members. Please ask a moderator (админ) for permission. Not guaranteed, no promises.',
			},
			{
				name: 'THOMAS',
				value: 'The Superintendent Thomas is an [**open-source**](https://github.com/billzxy/thomasbot) BOT. Thomas only serves this server. Pardon the spaghetti code.',
			},
			{
				name: 'Special Thanks',
				value: 'Please thank our generous server *Kontributors*, who make awesome features like high-definiton voice chat, 1080p 60fps streaming, 100MB file attachments, '+
					'animated server avatars and banners, customized server emotes and stickers, and many other Level 3 Perks available to us!',
			},
		]
	};

	const thumbnail = {
		attachment: './imgs/building.jpg',
		name: 'building.jpg'
	};

	await msg.channel.send({embed: introEmbed, files: [thumbnail]}).then(utils.consoleLog(msg)).catch(console.error);
	await msg.channel.send({embed: basicLawEmbed}).then(utils.consoleLog(msg)).catch(console.error);
	await msg.channel.send({embed: dosEmbed}).then(utils.consoleLog(msg)).catch(console.error);
	await msg.channel.send({embed: dontsEmbed}).then(cutils.onsoleLog(msg)).catch(console.error);
	await msg.channel.send({embed: disclaimerEmbed}).then(utils.consoleLog(msg)).catch(console.error);

}

module.exports ={
    sendRules
}