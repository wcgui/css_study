var wsUpload=(function(){
	Date.prototype.format = function (fmt) { 
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "h+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
	}
const materialData=function(data){
	$.ajax({
		type:"post",
		url:"/api/users/queryAllByMaterialType",
		data:{type:data},
		async:true,
		success:function(data){
			data=data.result;
			if(data.length==0){
				$("#pic-material-content").html(`<p>暂无该系列素材</p>`);
			}else{
				$("#pic-material-content").html("");
			}
			for(let i=0;i<data.length;i++){
				let date=new Date(data[i].ImageDate).format("yyyy-MM-dd hh:mm:ss");
				let tpl=`
				<div class="pic-img-show">
					<div class="pic-img-click">应用</div>
					<p>
						<img src=${"/api"+data[i].material_path}  data-type="${data[i].ImageType}" data-imgid="${data[i].id}">
					</p>
				</div>`;
				$("#pic-material-content").append(tpl);
			}
		},
		error:function(e){
			console.log(e);
		}
	});
}
//初始化弹窗点击事件
const initClick=function(type,userId,fun){
	//点击弹窗操作
	$("#pic-up>header").click(function(e){
		let target=e.target;
		if($(target).data("value")=="close"){
			$("#pic-up").parent().remove();
            // $("head>link#pic-up-css").remove();   
		}else if(target.nodeName=="SPAN"){
			$(target).addClass("btn-active").siblings().removeClass("btn-active");
			if($(target).data("value")=="tab1"){
				$("#pic-form1").show().siblings().hide();
			}else if($(target).data("value")=="tab3"){
				$("#pic-material-box").show().siblings().hide();
				materialData($(".material-btn-active").attr("data-value"));
			}else if($(target).data("value")=="tab2"){
				$("#pic-history-box").show().siblings().hide();
				$.ajax({
					type:"get",
					url:"/api/users/queryAll",
					data:{"userId":userId},
					async:true,
					success:function(data){
						if(data.length==0){
							$("#pic-history-box").html(`<p>暂无历史记录</p>`);
						}else{
							$("#pic-history-box").html("");
						}
						for(let i=0;i<data.length;i++){
							let date=new Date(data[i].ImageDate).format("yyyy-MM-dd hh:mm:ss");
							let tpl=`
							<div class="pic-img-show">
								<div class="pic-img-click">应用</div>
								<p>
									<img src=${"/api"+data[i].ImageURL} title="${date}" data-type="${data[i].ImageType}" data-imgid="${data[i].id}">
								</p>
								<p>${data[i].ImageOriginalName}</p>
							</div>`;
							$("#pic-history-box").append(tpl);
						}
					},
					error:function(e){
						console.log(e);
					}
				});
			}
		}
	});
	$(".pic-material-header").on("click","span",function(){
		let $tar = $(this);
		
		$tar.addClass("material-btn-active").siblings().removeClass("material-btn-active");
		materialData($tar.attr("data-value"));
	});
	$("#pic-up-box").click(function(e){
		if($(e.target).data("value")=="upload"){
			$("#editor_contentFooter").show();
			$("#pic-up-box").html("");
			createFiles($("#pic-up-box")[0]);
			let pics=document.querySelectorAll(".upload_pictures input");
			if(type=="bg"||type=="change"){
				if(pics.length==1){
					$("#no").addClass("disabled");
				}else{
					$("#no").removeClass("disabled");
				}
			}
		}else if(e.target.nodeName=="INPUT"){
			e.target.onchange=function(){
				var pics=document.querySelectorAll(".upload_pictures input");
				if(pics.length>=1){
					var bool=[].some.call(pics,function(elem,i,arr){
						if(i!=arr.length-1){
							return arr[arr.length-1].value==arr[i].value;
						}
					});
					if(/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(pics[pics.length-1].files[0].name)){
						if(bool||pics[pics.length-1].files[0]==undefined){
							$("#pic-hint-box").html("重复图片").fadeIn();
							setTimeout(function(){
								$("#pic-hint-box").fadeOut();
							},1200);
							$("#pic-up-box")[0].removeChild(this.parentNode);
							createFiles($("#pic-up-box")[0])
						}else if(pics[pics.length-1].files[0].size<=0){
							$("#pic-hint-box").html("不允许上传大小为0kb的文件").fadeIn();
							setTimeout(function(){
								$("#pic-hint-box").fadeOut();
							},1200);
							$("#pic-up-box")[0].removeChild(this.parentNode);
							createFiles($("#pic-up-box")[0])
						}else{
							$(this).prev()[0].title=this.files[0].name;
							this.previousElementSibling.src=window.URL.createObjectURL(this.files[0]);
							$(this).parent().children("div").hide();
						}
					}else{
						$("#pic-hint-box").html("格式不正确").fadeIn();
						setTimeout(function(){
							$("#pic-hint-box").fadeOut();
						},1200);
						$("#pic-up-box")[0].removeChild(this.parentNode);
						createFiles($("#pic-up-box")[0])
					}
				}
			}
		}
	});
	//进入时
	$("#pic-up-box")[0].ondragenter=function(){
		console.log(1);
	}
	//在内部移动
	$("#pic-up-box")[0].ondragover=function(e){
		e.preventDefault();
	}
	//释放
	$("#pic-up-box")[0].ondrop=function(e){
		//阻止默认事件
		e.preventDefault();
		//获取拖过来的文件
		let images=e.dataTransfer.files;
		let length=images.length;
		let pics=document.querySelectorAll(".upload_pictures input");
		if(pics.length==0){
			$("#editor_contentFooter").show();
			$("#pic-up-box").html("");
		}
		for(let i=0;i<length;i++){
			let _type=images[i].type;
			//判断是否是图片
			if(_type.indexOf("image")!=-1){
				let fd=new FileReader();
				fd.readAsDataURL(images[i]);
				createFiles($("#pic-up-box")[0])
				fd.onload=function(){
					console.log("li");
				}
			}
		}
	}
	$("#pic-history-box").click(function(e){
		let targetName=e.target.tagName;
		if(targetName=="DIV"&&e.target.getAttribute("class")=="pic-img-click"){
			let imgs=$(e.target).parent().find("img");
			// $(target).attr("data-url",imgs.attr("src"));
			let imageMessage={
				id:imgs.data("imgid"),
				url:type=='bg'?"http://172.26.1.10:3080"+imgs.attr("src").split("/api")[1]:imgs.attr("src")
			}
			fun(imageMessage);
			if(type!=imgs.data("type")){
				let id=imgs.data("imgid");
				$.ajax({
					type:"get",
					url:"/api/users/updateImageType",
					data:{ImageType:type,id:id},
					async:true,
					success:function(data){
						// $("#pic-hint-box").html("应用成功").fadeIn();
						// setTimeout(function(){
							$("#pic-hint-box").fadeOut();
							$("#pic-up").parent().remove();
							// $("head>link#pic-up-css").remove();
						// },1200);
					},
					error:function(e){
						// console.log(e);
					}
				});
			}else{
				// $("#pic-hint-box").html("应用成功").fadeIn();
				// setTimeout(function(){
					$("#pic-hint-box").fadeOut();
					$("#pic-up").parent().remove();
					// $("head>link#pic-up-css").remove();
				// },1200);
			}
		}
	});
	$("#pic-material-box").click(function(e){
		let targetName=e.target.tagName;
		if(targetName=="DIV"&&e.target.getAttribute("class")=="pic-img-click"){
			let imgs=$(e.target).parent().find("img");
			// $(target).attr("data-url",imgs.attr("src"));
			let imageMessage={
				id:imgs.data("imgid"),
				url:type=='bg'?"http://172.26.1.10:3080"+imgs.attr("src").split("/api")[1]:imgs.attr("src")
			}
			fun(imageMessage);
			
			$("#pic-hint-box").fadeOut();
			$("#pic-up").parent().remove();
		}
	});
	$("#editor_contentFooter").click(function(e){
		if(e.target.nodeName=="SPAN"){
			var pics=document.querySelectorAll(".upload_pictures input");
			if($(e.target).data("value")=="yes"){
				//表单提交事件,
				let picSize=0;
				if(pics.length>=1){
					var bool=[].some.call(pics,function(elem,i,arr){
						if(arr[i].files[0]){
							picSize+=arr[i].files[0].size;
						}
						return arr[i].files[0]==undefined;
					});
					if(bool){
						$("#pic-hint-box").html("请继续添加图片或将空位删除").fadeIn();
						setTimeout(function(){
							$("#pic-hint-box").fadeOut();
						},1200);
					}else if(picSize>10*1024*1024){
						$("#pic-hint-box").html("图片太大,最多10M").fadeIn();
						setTimeout(function(){
							$("#pic-hint-box").fadeOut();
						},1200);
					}else if(picSize<=0){
						$("#pic-hint-box").html("该文件是一个空文件").fadeIn();
						setTimeout(function(){
							$("#pic-hint-box").fadeOut();
						},1200);
					}else{
						$("#pic-form1").submit();
					}
				}
			}else if($(e.target).data("value")=="no"){
				//继续点击事件
				if(type=="bg"||type=="change"){
					if(pics.length==1){
						$("#pic-hint-box").html("只能选择一张").fadeIn();
						setTimeout(function(){
							$("#pic-hint-box").fadeOut();
						},1200);
					}
				}else{
					if(!(pics[pics.length-1].files[0]==undefined)){
						pics[pics.length-1].style.visibility="hidden";
						createFiles($("#pic-up-box")[0]);
					}else{
						$("#pic-hint-box").html("请继续添加图片或将空位删除").fadeIn();
						setTimeout(function(){
							$("#pic-hint-box").fadeOut();
						},1200);
					}
				}
			}
		}
	});
}
//生成美化的input框
const createFiles=function(str){
	var div=document.createElement("div");
	div.className="upload_pictures";
	var div1=document.createElement("div");
	div1.innerHTML="添加图片";
	div.appendChild(div1);
	var img=document.createElement("span");
	// img.src="../../public/images/close.png";
	img.className="close_img";
	img.title="删除";
	img.onclick=function(){
		var count=$("#pic-up-box")[0].getElementsByClassName("upload_pictures").length;
		if(count<=1){
			$("#editor_contentFooter").hide();
			$("#pic-up-box").html(`
			<div class="pic-up-show">
				<span class="pic-up-click" data-value="upload" style="margin-bottom:10px;">本地文件上传</span>
				<span>图片最大传输量:10M</span><br>
				<span>支持图片格式：gif&nbsp;|&nbsp;jpg&nbsp;|&nbsp;jpeg&nbsp;|&nbsp;png</span>
			</div>`);
			return false;
		}
		$("#pic-up-box")[0].removeChild(this.parentNode);
		$("#pic-up-box")[0].getElementsByClassName("upload_pictures")[$("#pic-up-box")[0].getElementsByClassName("upload_pictures").length-1].getElementsByTagName("input")[0].style.visibility="visible";
	}
	div.appendChild(img);
	var img=document.createElement("img");
	div.appendChild(img);
	var input=document.createElement("input");
	input.type="file";
	input.title="点击添加图片";
	input.name="mypic[]";
	div.appendChild(input);
	str.appendChild(div);
}
const initiframe=function(type,fun){
	$("#uploadiframe")[0].onload=function(){
		let textStr= $(this)[0].contentDocument.body.textContent;
		if(textStr.length==0){
			return false;
		}
		textStr=JSON.parse(textStr);
		if(textStr.length>0){
			$("#pic-hint-box").html("上传成功");
			$("#pic-hint-box").fadeIn();
			setTimeout(function(){
				$("#pic-hint-box").fadeOut();
				$("#pic-up").parent().remove();
				// $("head>link#pic-up-css").remove();
				// $(target).attr("data-url","api"+textStr[0].ImageURL);
				let imageMessage={
					id:textStr[0].filename.split(".")[0],
					url:(type=='bg'?"http://172.26.1.10:3080":"/api")+textStr[0].ImageURL,
				}
				fun(imageMessage);
			},1200);
		}else{
			$("#pic-hint-box").html("添加失败");
			$("#pic-hint-box").fadeIn();
			setTimeout(function(){
				$("#pic-hint-box").fadeOut();
			},1200);
		}
	};
}
//初始化弹窗
const init=function(type,userId,fun){
	let tpl=`
	<div style="width:100%;height:100%;position:fixed;top:0px;left:0px;z-index:99999;background:rgba(0,0,0,0.5);">
		<div id="pic-up">
			<header>
				<span class="btn-active" data-value="tab1">图片上传</span>
				<span data-value="tab2">已上传图片</span>
				<span data-value="tab3">素材图片</span>
				<i title="关闭" data-value="close"></i>
			</header>
			<div>
				<form action="http://172.26.1.233:9000" id="pic-form1" method="post" enctype="multipart/form-data" target="uploadiframe">
					<input name="type" type="hidden" value="${type}">
					<input name="userId" type="hidden" value="${userId}">
					<iframe id="uploadiframe" name="uploadiframe" src="about:blank;" style="display:none">
					</iframe>
					<div class="pic-up-box" id="pic-up-box">
						<div class="pic-up-show">
							<span class="pic-up-click" data-value="upload" style="margin-bottom:10px;">本地文件上传</span>
							<span>图片最大传输量:10M</span><br>
							<span>支持图片格式：gif&nbsp;|&nbsp;jpg&nbsp;|&nbsp;jpeg&nbsp;|&nbsp;png</span>
						</div>
					</div>
					<div id="editor_contentFooter">
						<span id="yes" data-value="yes">开始上传</span>
						
					</div>
				</form>
				<div class="pic-history-box" id="pic-history-box" style="display: none;">
				</div>
				<div class="pic-material-box" id="pic-material-box" style="display:none;">
					<header class="pic-material-header">
						<span class="material-btn-active" data-value="border">边框</span>
						<span data-value="icon">icon</span>
					</header>
					<div class="pic-material-content" id="pic-material-content">
					</div>
				</div>
			</div>
			<div id="pic-hint-box">
				请继续添加图片或将空位删除
			</div>
		</div>
	</div>`;
	//<span id="no" data-value="no">继续添加</span>332行
	// 						
	// style=`<link href="css/index.css" type="text/css" rel="stylesheet" id="pic-up-css">`;
	$("body").append(tpl);
	// $("head").append(style);
	initClick(type,userId,fun);
	initiframe(type,fun);
}
var show=function(type,userId,fun){
	if(!$("#pic-up")[0]){
		init(type,userId,fun);
	}else{
		$("#pic-up").parent().remove();
		// $("head>link#pic-up-css").remove();
	}
};
return {
	show:show
}
})();
//export{
//	wsUpload
//}
