///<jscompress sourcefile="empRuntime.js" />

var EmpGlobalZoom = 1.0, EmpGlobalLeft = 0, EmpGlobalTop = 0;
function EmpAutoBodySize()
{
	if( isBuilderMode )
	{
		//document.body.style.zoom = 1.0;
		return ;
	}
		
	var bodyleft = 0, bodytop = 0, bodyzoom = 1.0;
	var winWidth =window.innerWidth;
	var winHeight = window.innerHeight;
	//var winFixWidth = 1024, winFixHeight = 768;
	if( ResizePolicy == 3 ) //居中
	{
		if( winHeight >= winFixHeight && winWidth >= winFixWidth  )
		{
			bodyleft = toInt( (winWidth - winFixWidth)/2 );
			bodytop = toInt( (winHeight - winFixHeight)/2 );
			bodyzoom = 1.0;
		}
		else 
		{
			var winScale = winWidth / winHeight;
			var winFixScale = winFixWidth / winFixHeight;
			
			if( winScale > winFixScale )
			{
				//console.log('winScale > winFixScale');
				bodyzoom = winHeight/winFixHeight;
				bodyleft = toInt((winWidth - winFixWidth*bodyzoom)/2 );
				//console.log('winScale > winFixScale', bodyleft);
			}
			else 
			{
				//console.log('winScale <= winFixScale');
				bodyzoom = winWidth/winFixWidth;
				bodytop = toInt((winHeight - winFixHeight*bodyzoom)/2 );
			}
			
			//console.log('ResizePolicy == 3');
		}
	}
	else if( ResizePolicy == 1 ) //宽度度适配
	{
		if( winWidth >= winFixWidth )
		{
			bodyzoom = 1.0;
			bodyleft = toInt( (winWidth - winFixWidth)/2 );
			bodytop = toInt( (winHeight - winFixHeight)/2 );
		}
		else 
		{
			bodyzoom = winWidth/winFixWidth;
			bodytop = toInt((winHeight - winFixHeight*bodyzoom)/2 );
			if( bodytop < 0 )
				bodytop = 0;
			bodyleft = 0;
		}
		//console.log('ResizePolicy == 1');
	}
	else if( ResizePolicy == 2 ) //高度适配
	{
		if( winHeight >= winFixHeight )
		{
			bodyzoom = 1.0;
			bodyleft = toInt( (winWidth - winFixWidth)/2 );
			bodytop = toInt( (winHeight - winFixHeight)/2 );
		}
		else 
		{
			bodyzoom = winHeight/winFixHeight;
			bodytop = 0;
			bodyleft = toInt( (winWidth - winFixWidth*bodyzoom)/2 );
		}
		//console.log('ResizePolicy == 2');
	}
	else if( ResizePolicy == 4) //自动全屏
	{
		bodyleft = 0;
		bodytop = 0;
		document.body.style.width = '100%';
		document.body.style.height = '100%';
	}
	else 
	{
		bodyzoom = 1.0;
		bodyleft = toInt( (winWidth - winFixWidth)/2 );
		bodytop = toInt( (winHeight - winFixHeight)/2 );
		if( bodytop < 0 )
			bodytop = 0;
		if( bodyleft < 0 )
			bodyleft = 0;
		
		//console.log('ResizePolicy == 4');
	}
	
	 if (navigator.userAgent.indexOf('Firefox') !== -1 ) 
	 {
		document.body.style.left =  bodyleft + 'px';
		document.body.style.top = bodytop + 'px';
		document.body.style.MozTransformOrigin = 'top left';
		document.body.style.MozTransform = 'scale('+ bodyzoom+')';
	 }
	 else if( navigator.userAgent.indexOf('Trident') !== -1 || navigator.userAgent.indexOf('MSIE') !== -1){ 
		document.body.style.left = toInt(bodyleft) + 'px' ;
		document.body.style.top =  toInt(bodytop) + 'px' ;
		document.body.style.zoom = bodyzoom;
		
		EmpGlobalZoom = 1;//bodyzoom;
		EmpGlobalLeft = toInt(bodyleft);
		EmpGlobalTop = toInt(bodytop);
	 }
	 else 
	 {
		document.body.style.left = toInt(bodyleft/bodyzoom) + 'px' ;
		document.body.style.top =  toInt(bodytop/bodyzoom) + 'px' ;
		document.body.style.zoom = bodyzoom;
		
		EmpGlobalZoom = bodyzoom;
		EmpGlobalLeft = toInt(bodyleft/bodyzoom);
		EmpGlobalTop = toInt(bodytop/bodyzoom);
	 }
	
	//console.log('body resize', bodyzoom, bodyzoom*winFixWidth, bodyzoom*winFixHeight, bodyleft);
}

function cancelTrans(evt)
{
	var e=(evt)?evt:window.event;
	if (window.event) {
		e.cancelBubble=true;// ie下阻止冒泡
	}
	else {
		e.stopPropagation();
	}
}

function EmpDetectZoom ()
{ 
  var ratio = 0,
    screen = window.screen,
    ua = navigator.userAgent.toLowerCase();
 
   if (window.devicePixelRatio !== undefined) {
      ratio = window.devicePixelRatio;
  }
  else if (~ua.indexOf('msie')) {  
    if (screen.deviceXDPI && screen.logicalXDPI) {
      ratio = screen.deviceXDPI / screen.logicalXDPI;
    }
  }
  else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
    ratio = window.outerWidth / window.innerWidth;
  }
  
  /*
   if (ratio){
    ratio = Math.round(ratio * 100);
  }
  */
   
   return ratio;
}
/*
function EmpInclude(path){
    var jsInc=document.createElement("script");
    jsInc.type = "text/javascript";
    jsInc.src=path;
    var head=document.getElementsByTagName("head")[0];
    head.appendChild(jsInc);
}

function EmpIncludeCss(path){
    var jsInc=document.createElement("link");
    jsInc.type = "text/css";
    jsInc.rel = "stylesheet";
    jsInc.href=path;
    var head=document.getElementsByTagName("head")[0];
    head.appendChild(jsInc);
}

function EmpImport(path)
{
    if ( path.match(".js") )
        EmpInclude( path );
    else
        EmpIncludeCss(path);
}
*/

function EmpGetSelfUrl(name)
{
	var url = window.location.href;
	var words = url.split('?');
	//console.log(words);
	if( words.length != 2)
		return "";
	for( var x in words[1] )
	{
		var params = words[1].split('&');
		for( var y in params )
		{
			var local__ = params[x];
			var tmp = local__.split('=');
			if( tmp && tmp[0] == name )
				return tmp[1];			
		}

	}
	return "";
}

/*
var baseAni = new Array(5);
baseAni[0] = {"index":0, "background-color.r":209,"background-color.g":198,"background-color.b":168,"background-color.a":0.4, "left":255,"top":-205, "width":240,"height":240}
baseAni[2] = {"index":25, "background-color.r":209,"background-color.g":198,"background-color.b":168,"background-color.a":0.4, "left":255,"top":124, "width":240,"height":240}
baseAni[1] = {"index":50, "background-color.r":209,"background-color.g":198,"background-color.b":168,"background-color.a":0.6, "left":182,"top":448, "width":385,"height":384}
baseAni[3] = {"index":75, "background-color.r":209,"background-color.g":198,"background-color.b":168,"background-color.a":0.4, "left":255,"top":920, "width":240,"height":240}
baseAni[4] = {"index":100, "background-color.r":209,"background-color.g":198,"background-color.b":168,"background-color.a":0.4, "left":255,"top":1240, "width":240,"height":240}
*/
var  EmpSortBy = function(name)
{
	return function(o, p)
	{
		var a, b;
		if (typeof o === "object" && typeof p === "object" && o && p) 
		{
			a = o[name];
			b = p[name];
			if (a === b) {return 0;}
			if (typeof a === typeof b) { return a < b ? -1 : 1;}
			return typeof a < typeof b ? -1 : 1;
		}
		else {throw ("error"); }
	}
}

function toInt(number) {
				return number && + number | 0 || 0;
			}

function EmpApplyKeyframeByJs(jsAD,precent, divID)
{
	//console.log("precent", precent );
	
	var anidata = new Array();
	var targetData = jsAD["data"].sort(EmpSortBy("index"));
	for( var i = 0; i< jsAD["count"]-1; ++i )
	{
		if( precent >= targetData[i]["index"] && precent <=  targetData[i+1]["index"] )
		{
			var factor = (precent - targetData[i]["index"]) / (targetData[i+1]["index"] - targetData[i]["index"]);
			for( var x in targetData[i] )
			{
				anidata[x] = targetData[i][x] + (targetData[i+1][x] - targetData[i][x])*factor;
			}
		}
	}
	
	 var cssKey = jsAD["css"];
	 
	 var cssResult = {};//new Array();
	 var transStr, scaleStr, skewStr, rotStr;
	 for( var ck in cssKey )
	 {
		if( cssKey[ck] == "background-color" || cssKey[ck] == "color" )
		{
			cssResult[cssKey[ck]] = "rgba("+toInt(anidata[cssKey[ck]+".r"])+","+toInt(anidata[cssKey[ck]+".g"])+","+toInt(anidata[cssKey[ck]+".b"])+"," + anidata[cssKey[ck]+".a"] + ")";
		}
		else if( cssKey[ck] == "left" || cssKey[ck] == "top" || cssKey[ck] == "width" || cssKey[ck] == "height" 
		|| cssKey[ck] == "font-size" || cssKey[ck] == "text-indent" || cssKey[ck] == "letter-spacing")
		{
			cssResult[cssKey[ck]] = anidata[cssKey[ck]] + "px";
		}
		//以下可能有问题，字符串的问题
		else if( cssKey[ck] == "opacity" || cssKey[ck] == "font-weight" || cssKey[ck] == "line-height")
		{
			cssResult[cssKey[ck]] = anidata[cssKey[ck]];
		}
		else if( cssKey[ck] =="transform-origin")
		{
			cssResult[cssKey[ck]] = toInt(anidata[cssKey[ck]+".x"])+","+toInt(anidata[cssKey[ck]+".y"]);
		}
		else if( cssKey[ck] =="box-shadow" || cssKey[ck] =="text-shadow")
		{ //L"box-shadow: {{$xoffset}}px {{$yoffset}}px {{$blur}}px {{$webcolor}};";
			cssResult[cssKey[ck]] = toInt(anidata[cssKey[ck]+".x"])+"px "+toInt(anidata[cssKey[ck]+".y"]) + "px " 
			+toInt(anidata[cssKey[ck]+".z"]) + "px " +"rgb("+toInt(anidata[cssKey[ck]+".r"])+","+toInt(anidata[cssKey[ck]+".g"])+","+toInt(anidata[cssKey[ck]+".b"])+ ")";
		}
		//"transform","translate(270px,-270px)  rotate(-15deg)  skew(15deg,15deg)  scale(2,2)");
		else if( cssKey[ck] =="Transform.1RotateAngleDegree")
		{
			rotStr = " rotate(" + anidata['rotate']+"deg) ";
		}	
		else if( cssKey[ck] =="Transform.2SkewDegree")
		{
			skewStr = " skew(" + anidata["skew.x"]+"deg,"+ anidata["skew.y"]+"deg) ";
		}		
		else if( cssKey[ck] =="Transform.3Scale")
		{
			scaleStr = " scale(" + anidata["scale.x"]+","+ anidata["scale.y"]+") ";
		}	
		else if( cssKey[ck] =="Transform.0Trans")
		{
			transStr = " translate(" + anidata["translate.x"]+"px,"+ anidata["translate.y"]+"px) ";
		}
	 }
	 if( rotStr || skewStr || scaleStr || transStr )
	 {
		 cssResult["transform"] = (transStr?transStr:"") +(rotStr?rotStr:"") +(skewStr?skewStr:"") +(scaleStr?scaleStr:"");
	 }
	 
	 jQuery('#'+divID).css( cssResult );
}

var precentX = 0;
var precentY = 0;
var minPrecentY = null, maxPrecentY = null,factorY = null;
var minPrecentX = null, maxPrecentX = null,factorX = null;
function setRangeSwipeMoveX(minx, maxx, fx)
{
	minPrecentX = minx;
	maxPrecentX = maxx;
	factorX = fx;
}
function setRangeSwipeMoveY(miny, maxy, fy)
{
	minPrecentY = miny;
	maxPrecentY = maxy;
	factorY = fy;
	
	//console.log('y1111 = ', minPrecentY, maxPrecentY, factorY );
}
function empSwipeMove(event_, obj)
{
	event_.preventDefault();
	obj.originalEvent.preventDefault();

	var _a = obj.description.split(':');
	//jQuery(obj.originalEvent.currentTarget).css('zIndex','1000')
	switch(_a[0]) {
		case  'swipemove':
			if(_a[1] != 1) {break;}
			precentY += obj.delta[0].startY ; 
			precentX += obj.delta[0].startX ; 
			
			if( maxPrecentY != null && minPrecentY != null && factorY != null )
			{
				if( minPrecentY >= maxPrecentY )
					precentY = 0;
				else if( precentY > (maxPrecentY/factorY) )
					precentY = maxPrecentY/factorY; 
				else if( precentY < minPrecentY/factorY )
					precentY = minPrecentY/factorY;
			}
			
			if( maxPrecentX!=null && (precentX > maxPrecentX/factorX) )
				precentX = maxPrecentX/factorX;
			else if( minPrecentX!=null && (precentX < minPrecentX/factorX) )
				precentX = minPrecentX/factorX;
			
			for( var x in swipemoveData) 
			{
				//console.log( swipemoveData[x] );
				swipemoveData[x](precentX, precentY);
			}
						
			break;
	}					
}

//为div组件创建button
function createEmpButton(divid, images,stylestr,offsetx, offsety)
{
	var fatherElement = empGetElementByID(divid, 'div', null);  
	var textElement = empGetElementByID(divid +'_button', 'div', fatherElement); //这个地方保证了唯一性
    fatherElement.appendChild(textElement); 
	
	var normal = images.normal;
	var pressed = images.pressed? images.pressed:images.normal;
	var hover = images.hover? images.hover:images.normal;
	
	//jQuery(textElement).css({'background-size':'100% 100%', 'background-repeat':'no-repeat','pointer-events':'none','width':'100%','height':'100%'}); 
	
	textElement.style.cssText = stylestr ; 
	
	if( images.color )
		jQuery(textElement).css('background-color', images.color);
	
	if( normal )
		jQuery(textElement).css('background-image', images.normal);
		
	
	jQuery(fatherElement).bind('touchstart mousedown', function(){  			
		jQuery(textElement).css({'transform':'translate('+offsetx+'px,'+offsety+'px)'}); 
		if( pressed )
			jQuery(textElement).css('background-image', images.pressed);			
		
		jQuery(document.body).one('touchend mouseup', function(){
			jQuery(textElement).css({'transform':'translate(0px,0px)'});
			if( normal ) jQuery(textElement).css('background-image', images.normal);
		}); 			
	}); 
	if(images.hover) 
	{
		jQuery(fatherElement).mouseenter( function(){  			
			jQuery(textElement).css({'transform':'translate(0px,0px)'}); 
			if( hover ) jQuery(textElement).css('background-image', images.hover);
		});
		jQuery(fatherElement).mouseleave(function(){
			jQuery(textElement).css({'transform':'translate(0px,0px)'});
			if( normal ) jQuery(textElement).css('background-image', images.normal);
		}); 
	}
	
	return textElement;
}

//为某个div组件创建放大镜动画
function createZoomLens(divid, times, imgfile, width, height,offsetx, offsety, borderParams)
{
	var fatherElement = empGetElementByID(divid, 'div', null);  
    var itemElement = empGetElementByID(divid+'_zoomlens', 'div', fatherElement); 
    fatherElement.appendChild(itemElement); 
	var borderradius = "border-radius:1024px;"; 
	var borderSide = parseInt(borderParams.size) || 0;
	var borderColor = borderParams.color || '0xffffff';
	if(width!=height)  
		borderradius = "";
	
	borderradius += "border: " + borderSide + "px solid " +borderColor + ";"
	
	//console.log(borderSide); 
	
	var fatherWidth = parseInt(jQuery('#'+divid).css("width"));
	var fatherHeight = parseInt(jQuery('#'+divid).css("height"));
	//console.log(fatherWidth, fatherHeight);
	itemElement.style.cssText = "visibility:hidden; pointer-events: none;"+borderradius+" background-image:url('"+imgfile+"');background-size:"+times*fatherWidth/width+"% "+times*fatherHeight/height+"%;background-repeat:no-repeat;position:absolute;left:0px;top:0px;width:"+width+"px;height:"+height+"px;opacity:1;"; 
	jQuery('#'+divid +'_zoomlens' ).attr('emplenshidden', 1) ;
		
	jQuery('#'+divid).bind('touchmove mousemove',  function(event_){
		if( jQuery('#'+divid +'_zoomlens' ).attr('emplenshidden') == 1)
			return ;

		event_.preventDefault();
		var _bHasTouches = !!event_.originalEvent.touches;
		var xx = _bHasTouches?(event_.originalEvent.touches[0].pageX / EmpGlobalZoom - EmpGlobalLeft - event_.originalEvent.currentTarget.offsetLeft): (event_.originalEvent.offsetX/ EmpGlobalZoom);
		var yy = _bHasTouches?(event_.originalEvent.touches[0].pageY / EmpGlobalZoom - EmpGlobalTop - event_.originalEvent.currentTarget.offsetTop): (event_.originalEvent.offsetY/ EmpGlobalZoom);

		var precentx = 100.0 * xx / event_.originalEvent.currentTarget.clientWidth;
		var precenty = 100.0 * yy / event_.originalEvent.currentTarget.clientHeight;
		if( precentx<0 || precentx >100 || precenty <0 || precenty > 100)
			return;
		/*if( precentx < 0 ) precentx = 0;
		if( precentx >100 ) precentx = 100;
		if( precenty < 0 ) precenty = 0;
		if( precenty >100 ) precenty = 100;
		
		xx = precentx * event_.originalEvent.currentTarget.clientWidth / 100;
		yy = precenty * event_.originalEvent.currentTarget.clientHeight / 100;
		*/
		jQuery('#'+divid +'_zoomlens').css('visibility','visible');
		var left = xx - width*0.5;
		var top = yy - height*0.5;
		
		var newPx = -1 * (precentx * (times*fatherWidth/100) / 100 - width/2);
		var newPy = -1 * (precenty * (times*fatherHeight/100) / 100 - height/2);
		jQuery('#'+divid +'_zoomlens').css({"left":(offsetx + left)+"px", "top":(offsety+top)+"px"} );
		jQuery('#'+divid +'_zoomlens').css('background-position', newPx + 'px '+ newPy +'px');
	} );
	
	jQuery('#'+divid).bind('touchstart mousedown',  function(){
		jQuery('#'+divid +'_zoomlens' ).attr('emplenshidden', 0);
		//console.log('touchstart');
		jQuery('#'+divid).one('touchend mouseup', function(){
			//console.log('touchend');
			jQuery('#'+divid +'_zoomlens' ).css('visibility','hidden');
			jQuery('#'+divid +'_zoomlens' ).attr('emplenshidden', 1);
		} );
		
		jQuery(document.body).one('touchend mouseup', function(){
			//console.log('mouseup');
			jQuery('#'+divid +'_zoomlens' ).css('visibility','hidden');
			jQuery('#'+divid +'_zoomlens' ).attr('emplenshidden', 1);
		} );
	}); 
}

function createSwitchImage(params)
{
	var switchFlag = false;
	var fatherElement = empGetElementByID(params.divid, 'div', null);  
	var maskElement = empGetElementByID(params.divid + "_mask"  , 'div',  fatherElement); 
		maskElement.style.backgroundImage = "url('"+params.maskImg+"')";
		maskElement.style.backgroundSize="100% 100%";
		maskElement.style.backgroundRepeat="no-repeat";
		maskElement.style.pointerEvents="none";
		maskElement.style.width = params.verticalFlag?'0px':fatherElement.style.width;
		maskElement.style.height = params.verticalFlag? fatherElement.style.height:'0px';
		maskElement.style.left = '0px';
		maskElement.style.top = '0px';
		maskElement.style.position = 'absolute';

	var seperatorElement = empGetElementByID(params.divid + "_seperator"  , 'div',  fatherElement); 
		seperatorElement.style.backgroundImage = "url('"+params.seperatorImg+"')";
		seperatorElement.style.backgroundSize="100% 100%";
		seperatorElement.style.backgroundRepeat="no-repeat";
		seperatorElement.style.pointerEvents="none";
		seperatorElement.style.width = params.verticalFlag? params.sepWidth+'px': (parseInt(fatherElement.style.width) + 2* params.sepWidth)+'px' ;
		seperatorElement.style.height = params.verticalFlag? (parseInt(fatherElement.style.height) + 2* params.sepHeight)+'px' :  params.sepHeight+'px';
		seperatorElement.style.left = params.verticalFlag?(-0.5* params.sepWidth) + 'px':(-1* params.sepWidth) + 'px';
		seperatorElement.style.top = params.verticalFlag?(-1*params.sepHeight)+ 'px':(-0.5*params.sepHeight)+ 'px';	
		seperatorElement.style.position = 'absolute';

	jQuery('#'+params.divid).bind('touchmove mousemove',  function(event_){
		if( switchFlag == false )
			return ;
		event_.preventDefault();
		var _bHasTouches = !!event_.originalEvent.touches;
		var xx = _bHasTouches?(event_.originalEvent.touches[0].pageX / EmpGlobalZoom - EmpGlobalLeft - event_.originalEvent.currentTarget.offsetLeft): (event_.originalEvent.offsetX/ EmpGlobalZoom);
		var yy = _bHasTouches?(event_.originalEvent.touches[0].pageY / EmpGlobalZoom - EmpGlobalTop - event_.originalEvent.currentTarget.offsetTop): (event_.originalEvent.offsetY/ EmpGlobalZoom);
		
				var precentx = 100.0 * xx / event_.originalEvent.currentTarget.clientWidth;
				var precenty = 100.0 * yy / event_.originalEvent.currentTarget.clientHeight;
				if( precentx<0 ) {precentx = 0; xx = 0;}
				if( precentx >100 ) {precentx = 100; xx = event_.originalEvent.currentTarget.clientWidth; }
				if( precenty<0 ) {precenty = 0; yy =0;}
				if( precenty >100 ) {precenty = 100 ; yy = event_.originalEvent.currentTarget.clientHeight;}
				
				if( params.verticalFlag)
					jQuery('#'+params.divid +'_mask').css({'width':xx + 'px', 'background-size': 100*100/precentx+'% 100%'});
				else 
					jQuery('#'+params.divid +'_mask').css({'height':yy + 'px', 'background-size':'100%' + 100*100/precenty+'%'});
					
				if( params.verticalFlag)
					jQuery('#'+params.divid +'_seperator').css({'left':(xx - 0.5*params.sepWidth)+ 'px', });
				else 
					jQuery('#'+params.divid +'_seperator').css({'top':(yy -0.5*params.sepHeight)+ 'px', });
				
				
			event_.preventDefault();
	} );
	
	jQuery('#'+params.divid).bind('touchstart mousedown',  function(){
		switchFlag = true;
		jQuery('#'+params.divid).one('touchend mouseup', function(){
			switchFlag = false;
		} );
		
		jQuery(document.body).one('touchend mouseup', function(){
			switchFlag = false;
		} );
	}); 
}

function empGetElementByID(idstr, elementTypeStr, feObj, createCallBack) 
{
    var textElement = document.getElementById(idstr); //当idstr不存在时，创建物体后会调用craeteCallBack
    if (textElement == null) {
        textElement = document.createElement(elementTypeStr);
        textElement.id = idstr;
        if (feObj) {
            feObj.appendChild(textElement);
        }
        else {
            document.body.appendChild(textElement);
        }
		
		if (typeof createCallBack === "function")
			createCallBack(textElement);
    }
	
    return textElement;
}

function empDeleteElementByID(idstr)
{
    var textElement = document.getElementById(idstr);
    if( textElement ) {
        textElement.parentNode.removeChild(textElement);
    }
}
function empShowElementByID(idstr,showState)
{
    var textElement = document.getElementById(idstr);
    if( textElement ) {
        textElement.style.visibility=showState;
    }
}
function empSetPEElementByID(idstr,trigState)
{
    var textElement = document.getElementById(idstr);
    if( textElement ) {
        textElement.style.pointerEvents=trigState;
    }
}

function empSetOpacityElementByID(idstr,trigState)
{
    var textElement = document.getElementById(idstr);
    if( textElement ) {
        textElement.style.opacity=trigState;
    }
}

function empSetFullScreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.requestFullScreen) {
    element.requestFullScreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

function empExitFullScreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }else if(document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  }
}
	
function empIsFullScreen() {
	var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
	return fullscreenEnabled;
}

/*
 var empPageData = { "image":{
 "1305569153-1073432283-1048722216-1091962774":"resources/page.jpg"
 },
 "text":{"287797625-721443941-636946669-1446587451_text":"详情页_导航栏 副本"
 },
 "3dscene":{
 }
 };
*/
/*
function empInitTemplatePage(_jsonData)
{
    //console.log( _jsonData );
    for( var x in _jsonData['text'])
    {
        //console.log( x , empPageData['text'][x]);
        jQuery("#"+x).html(_jsonData['text'][x]);
        //var textElement = empGetElementByID(x, 'p');
        //textElement.innerHTML = _jsonData['text'][x];
    }
    for( var x in _jsonData['image'])
    {
        //console.log( x , empPageData['image'][x]);
        jQuery("#"+x).css("background-image",'url(\'' + _jsonData['image'][x] +'\')' );
        //var itemElement = empGetElementByID(x, 'div');
        //itemElement.style.backgroundImage  = 'url(' + _jsonData['image'][x] +')';
    }
    for( var x in _jsonData['3dscene'])
    {
        //console.log( x , jsonData['d3scenes'][x]);
		 //var emp3d2 = scene3D[x];  
		 //if( emp3d2 ) 
		 //	 emp3d2.initGold(_jsonData['d3scenes'][x]); 
    }
	
	if(typeof(iniDomFromDB) == 'function')
		iniDomFromDB();
}
*/
window.addEventListener("load",  (function(){
	//empInitTemplatePage(empTempData);  
	EmpAutoBodySize(); 
	} ), false);

if( !isBuilderMode )	
	window.addEventListener('resize', EmpAutoBodySize, false);

///<jscompress sourcefile="animo.js" />
;(function ( $, window, document, undefined ) {

  /**
   * animo is a powerful little tool that makes managing CSS animations extremely easy. Stack animations, set callbacks, make magic.
   * Modern browsers and almost all mobile browsers support CSS animations (http://caniuse.com/css-animation).
   *
   * @author Daniel Raftery : twitter/ThrivingKings
   * @version 1.0.3
  */
  function animo( element, options, callback, other_cb ) {
    
    // Default configuration
    var defaults = {
    	duration: 1,
    	animation: null,
    	iterate: 2,
    	delay: 0,
    	timing: "linear",
    	keep: false, 
		fillmode: 'forwards'    //吕汝涛新添加，在动画执行前执行后的组件状态  none | forwards | backwards | both;
    };

    // Browser prefixes for CSS
    this.prefixes = ["", "-moz-", "-o-animation-", "-webkit-", "-ms-"];

    // Cache the element
    this.element = $(element);

    this.bare = element;

    // For stacking of animations
    this.queue = [];

    // Hacky
    this.listening = false;

    // Figure out where the callback is
    var cb = (typeof callback == "function" ? callback : other_cb);

    // Options can sometimes be a command
    switch(options) {

      case "blur":

      	defaults = {
      		amount: 3,
      		duration: 0.5,
      		focusAfter: null
      	};

      	this.options = $.extend( defaults, callback );

  	    this._blur(cb);

        break;

      case "focus":

  	  	this._focus();

        break;

      case "rotate":

        defaults = {
          degrees: 15,
          duration: 0.5
        };

        this.options = $.extend( defaults, callback );

        this._rotate(cb);

        break;

      case "cleanse":

        this.cleanse();

        break;

      default:

	    this.options = $.extend( defaults, options );

	    this.init(cb);
  	
      break;
    }
  }

  animo.prototype = {

    // A standard CSS animation
    init: function(callback) {
      
      var $me = this;

      // Are we stacking animations?
      if(Object.prototype.toString.call( $me.options.animation ) === '[object Array]') {
      	$.merge($me.queue, $me.options.animation);
      } else {
	      $me.queue.push($me.options.animation);
	    }

	    $me.cleanse();

	    $me.animate(callback);
      
    },

    // The actual adding of the class and listening for completion
    animate: function(callback) {

    	this.element.addClass('animated');

      this.element.addClass(this.queue[0]);

      this.element.data("animo", this.queue[0]);

      var ai = this.prefixes.length;

      // Add the options for each prefix
      while(ai--) {

      	this.element.css(this.prefixes[ai]+"animation-duration", this.options.duration+"s");
        
      	this.element.css(this.prefixes[ai]+"animation-delay", this.options.delay+"s");

      	this.element.css(this.prefixes[ai]+"animation-iteration-count", this.options.iterate);

      	this.element.css(this.prefixes[ai]+"animation-timing-function", this.options.timing);

      	this.element.css(this.prefixes[ai]+"animation-fill-mode", this.options.fillmode);  //lrt add

      }

      var $me = this, _cb = callback;

      if($me.queue.length>1) {
        _cb = null;
      }
      // Listen for the end of the animation
      this._end("AnimationEnd", function() {

        // If there are more, clean it up and move on
        if($me.element.hasClass($me.queue[0])) {

          if(!$me.options.keep) {
            $me.cleanse();
          }

          $me.queue.shift();

          if($me.queue.length) {

            $me.animate(callback);
          }
        }
      }, _cb);
    },

    cleanse: function() {

    	this.element.removeClass('animated');

  		this.element.removeClass(this.queue[0]);

      this.element.removeClass(this.element.data("animo"));

  		var ai = this.prefixes.length;

  		while(ai--) {

      	this.element.css(this.prefixes[ai]+"animation-duration", "");
        
      	this.element.css(this.prefixes[ai]+"animation-delay", "");

      	this.element.css(this.prefixes[ai]+"animation-iteration-count", "");

      	this.element.css(this.prefixes[ai]+"animation-timing-function", "");

      	this.element.css(this.prefixes[ai]+"animation-fill-mode", "");  //lrt add

        this.element.css(this.prefixes[ai]+"transition", "");

        this.element.css(this.prefixes[ai]+"transform", "");

        this.element.css(this.prefixes[ai]+"filter", "");

      }
    },

    _blur: function(callback) {

      if(this.element.is("img")) {

      	var svg_id = "svg_" + (((1 + Math.random()) * 0x1000000) | 0).toString(16).substring(1);
      	var filter_id = "filter_" + (((1 + Math.random()) * 0x1000000) | 0).toString(16).substring(1);

      	$('body').append('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" id="'+svg_id+'" style="height:0;position:absolute;top:-1000px;"><filter id="'+filter_id+'"><feGaussianBlur stdDeviation="'+this.options.amount+'" /></filter></svg>');

      	var ai = this.prefixes.length;

    		while(ai--) {

        	this.element.css(this.prefixes[ai]+"filter", "blur("+this.options.amount+"px)");

        	this.element.css(this.prefixes[ai]+"transition", this.options.duration+"s all linear");

        }

        this.element.css("filter", "url(#"+filter_id+")");

        this.element.data("svgid", svg_id);
      
      } else {

        var color = this.element.css('color');

        var ai = this.prefixes.length;

        // Add the options for each prefix
        while(ai--) {

          this.element.css(this.prefixes[ai]+"transition", "all "+this.options.duration+"s linear");

        }

        this.element.css("text-shadow", "0 0 "+this.options.amount+"px "+color);
        this.element.css("color", "transparent");
      }

      this._end("TransitionEnd", null, callback);

      var $me = this;

      if(this.options.focusAfter) {

        var focus_wait = window.setTimeout(function() {

          $me._focus();

          focus_wait = window.clearTimeout(focus_wait);

        }, (this.options.focusAfter*1000));
      }

    },

    _focus: function() {

    	var ai = this.prefixes.length;

      if(this.element.is("img")) {

    		while(ai--) {

        	this.element.css(this.prefixes[ai]+"filter", "");

        	this.element.css(this.prefixes[ai]+"transition", "");

        }

        var $svg = $('#'+this.element.data('svgid'));

        $svg.remove();
      } else {

        while(ai--) {

          this.element.css(this.prefixes[ai]+"transition", "");

        }

        this.element.css("text-shadow", "");
        this.element.css("color", "");
      }
    },

    _rotate: function(callback) {

      var ai = this.prefixes.length;

      // Add the options for each prefix
      while(ai--) {

        this.element.css(this.prefixes[ai]+"transition", "all "+this.options.duration+"s linear");

        this.element.css(this.prefixes[ai]+"transform", "rotate("+this.options.degrees+"deg)");

      }

      this._end("TransitionEnd", null, callback);

    },

    _end: function(type, todo, callback) {

      var $me = this;

      var binding = type.toLowerCase()+" webkit"+type+" o"+type+" MS"+type;

      this.element.bind(binding, function() {
        
        $me.element.unbind(binding);

        if(typeof todo == "function") {

          todo();
        }

        if(typeof callback == "function") {
          callback($me);
        }
      });
      
    }
  };

  $.fn.animo = function ( options, callback, other_cb ) {
    
    return this.each(function() {
			
			new animo( this, options, callback, other_cb );

		});

  };

})( jQuery, window, document );

///<jscompress sourcefile="Detector.js" />
/**
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 */

var Detector = {

	canvas: !! window.CanvasRenderingContext2D,
	webgl: ( function () { try { var canvas = document.createElement( 'canvas' ); return !! ( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) ); } catch ( e ) { return false; } } )(),
	workers: !! window.Worker,
	fileapi: window.File && window.FileReader && window.FileList && window.Blob,

	getWebGLErrorMessage: function () {

		var element = document.createElement( 'div' );
		element.id = 'webgl-error-message';
		element.style.fontFamily = 'monospace';
		element.style.fontSize = '13px';
		element.style.fontWeight = 'normal';
		element.style.textAlign = 'center';
		element.style.background = '#fff';
		element.style.color = '#000';
		element.style.padding = '1.5em';
		element.style.width = '400px';
		element.style.margin = '5em auto 0';

		if ( ! this.webgl ) {

			element.innerHTML = window.WebGLRenderingContext ? [
				'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />',
				'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
			].join( '\n' ) : [
				'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>',
				'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
			].join( '\n' );

		}

		return element;

	},

	addGetWebGLMessage: function ( parameters ) {

		var parent, id, element;

		parameters = parameters || {};

		parent = parameters.parent !== undefined ? parameters.parent : document.body;
		id = parameters.id !== undefined ? parameters.id : 'oldie';

		element = Detector.getWebGLErrorMessage();
		element.id = id;

		parent.appendChild( element );

	}

};

// browserify support
if ( typeof module === 'object' ) {

	module.exports = Detector;

}

///<jscompress sourcefile="OrbitControls.js" />
/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author erich666 / http://erichaines.com
 */

// This set of controls performs orbiting, dollying (zooming), and panning.
// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
//
//    Orbit - left mouse / touch: one finger move
//    Zoom - middle mouse, or mousewheel / touch: two finger spread or squish
//    Pan - right mouse, or arrow keys / touch: three finter swipe

THREE.OrbitControls = function ( object, domElement ) {

	this.object = object;

	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// Set to false to disable this control
	this.enabled = true;

	// "target" sets the location of focus, where the object orbits around
	this.target = new THREE.Vector3();

	// How far you can dolly in and out ( PerspectiveCamera only )
	this.minDistance = 0;
	this.maxDistance = Infinity;

	// How far you can zoom in and out ( OrthographicCamera only )
	this.minZoom = 0;
	this.maxZoom = Infinity;

	// How far you can orbit vertically, upper and lower limits.
	// Range is 0 to Math.PI radians.
	this.minPolarAngle = 0; // radians
	this.maxPolarAngle = Math.PI; // radians

	// How far you can orbit horizontally, upper and lower limits.
	// If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
	this.minAzimuthAngle = - Infinity; // radians
	this.maxAzimuthAngle = Infinity; // radians

	// Set to true to enable damping (inertia)
	// If damping is enabled, you must call controls.update() in your animation loop
	this.enableDamping = false;
	this.dampingFactor = 0.25;

	// This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
	// Set to false to disable zooming
	this.enableZoom = true;
	this.zoomSpeed = 1.0;

	// Set to false to disable rotating
	this.enableRotate = true;
	this.rotateSpeed = 1.0;

	// Set to false to disable panning
	this.enablePan = true;
	this.keyPanSpeed = 7.0;	// pixels moved per arrow key push

	// Set to true to automatically rotate around the target
	// If auto-rotate is enabled, you must call controls.update() in your animation loop
	this.autoRotate = false;
	this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

	// Set to false to disable use of the keys
	this.enableKeys = true;

	// The four arrow keys
	this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

	// Mouse buttons
	this.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };

	// for reset
	this.target0 = this.target.clone();
	this.position0 = this.object.position.clone();
	this.zoom0 = this.object.zoom;

	//
	// public methods
	//

	this.getPolarAngle = function () {

		return phi;

	};

	this.getAzimuthalAngle = function () {

		return theta;

	};

	this.reset = function () {

		scope.target.copy( scope.target0 );
		scope.object.position.copy( scope.position0 );
		scope.object.zoom = scope.zoom0;

		scope.object.updateProjectionMatrix();
		scope.dispatchEvent( changeEvent );

		scope.update();

		state = STATE.NONE;

	};

	// this method is exposed, but perhaps it would be better if we can make it private...
	this.update = function() {

		var offset = new THREE.Vector3();

		// so camera.up is the orbit axis
		var quat = new THREE.Quaternion().setFromUnitVectors( object.up, new THREE.Vector3( 0, 1, 0 ) );
		var quatInverse = quat.clone().inverse();

		var lastPosition = new THREE.Vector3();
		var lastQuaternion = new THREE.Quaternion();

		return function () {

			var position = scope.object.position;

			offset.copy( position ).sub( scope.target );

			// rotate offset to "y-axis-is-up" space
			offset.applyQuaternion( quat );

			// angle from z-axis around y-axis
			spherical.setFromVector3( offset );

			if ( scope.autoRotate && state === STATE.NONE ) {

				rotateLeft( getAutoRotationAngle() );

			}

			spherical.theta += sphericalDelta.theta;
			spherical.phi += sphericalDelta.phi;

			// restrict theta to be between desired limits
			spherical.theta = Math.max( scope.minAzimuthAngle, Math.min( scope.maxAzimuthAngle, spherical.theta ) );

			// restrict phi to be between desired limits
			spherical.phi = Math.max( scope.minPolarAngle, Math.min( scope.maxPolarAngle, spherical.phi ) );

			spherical.makeSafe();


			spherical.radius *= scale;

			// restrict radius to be between desired limits
			spherical.radius = Math.max( scope.minDistance, Math.min( scope.maxDistance, spherical.radius ) );

			// move target to panned location
			scope.target.add( panOffset );

			offset.setFromSpherical( spherical );

			// rotate offset back to "camera-up-vector-is-up" space
			offset.applyQuaternion( quatInverse );

			position.copy( scope.target ).add( offset );

			scope.object.lookAt( scope.target );

			if ( scope.enableDamping === true ) {

				sphericalDelta.theta *= ( 1 - scope.dampingFactor );
				sphericalDelta.phi *= ( 1 - scope.dampingFactor );

			} else {

				sphericalDelta.set( 0, 0, 0 );

			}

			scale = 1;
			panOffset.set( 0, 0, 0 );

			// update condition is:
			// min(camera displacement, camera rotation in radians)^2 > EPS
			// using small-angle approximation cos(x/2) = 1 - x^2 / 8

			if ( zoomChanged ||
				lastPosition.distanceToSquared( scope.object.position ) > EPS ||
				8 * ( 1 - lastQuaternion.dot( scope.object.quaternion ) ) > EPS ) {

				scope.dispatchEvent( changeEvent );

				lastPosition.copy( scope.object.position );
				lastQuaternion.copy( scope.object.quaternion );
				zoomChanged = false;

				return true;

			}

			return false;

		};

	}();

	this.dispose = function() {

		scope.domElement.removeEventListener( 'contextmenu', onContextMenu, false );
		scope.domElement.removeEventListener( 'mousedown', onMouseDown, false );
		scope.domElement.removeEventListener( 'mousewheel', onMouseWheel, false );
		scope.domElement.removeEventListener( 'MozMousePixelScroll', onMouseWheel, false ); // firefox

		scope.domElement.removeEventListener( 'touchstart', onTouchStart, false );
		scope.domElement.removeEventListener( 'touchend', onTouchEnd, false );
		scope.domElement.removeEventListener( 'touchmove', onTouchMove, false );

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );
		document.removeEventListener( 'mouseout', onMouseUp, false );

		window.removeEventListener( 'keydown', onKeyDown, false );

		//scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?

	};

	//
	// internals
	//

	var scope = this;

	var changeEvent = { type: 'change' };
	var startEvent = { type: 'start' };
	var endEvent = { type: 'end' };

	var STATE = { NONE : - 1, ROTATE : 0, DOLLY : 1, PAN : 2, TOUCH_ROTATE : 3, TOUCH_DOLLY : 4, TOUCH_PAN : 5 };

	var state = STATE.NONE;

	var EPS = 0.000001;

	// current position in spherical coordinates
	var spherical = new THREE.Spherical();
	var sphericalDelta = new THREE.Spherical();

	var scale = 1;
	var panOffset = new THREE.Vector3();
	var zoomChanged = false;

	var rotateStart = new THREE.Vector2();
	var rotateEnd = new THREE.Vector2();
	var rotateDelta = new THREE.Vector2();

	var panStart = new THREE.Vector2();
	var panEnd = new THREE.Vector2();
	var panDelta = new THREE.Vector2();

	var dollyStart = new THREE.Vector2();
	var dollyEnd = new THREE.Vector2();
	var dollyDelta = new THREE.Vector2();

	function getAutoRotationAngle() {

		return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

	}

	function getZoomScale() {

		return Math.pow( 0.95, scope.zoomSpeed );

	}

	function rotateLeft( angle ) {

		sphericalDelta.theta -= angle;

	}

	function rotateUp( angle ) {

		sphericalDelta.phi -= angle;

	}

	this.handleResize = function () {
		//console.log( "lrt add: just for tc");
	}
	
	var panLeft = function() {

		var v = new THREE.Vector3();

		return function panLeft( distance, objectMatrix ) {

			v.setFromMatrixColumn( objectMatrix, 0 ); // get X column of objectMatrix
			v.multiplyScalar( - distance );

			panOffset.add( v );

		};

	}();

	var panUp = function() {

		var v = new THREE.Vector3();

		return function panUp( distance, objectMatrix ) {

			v.setFromMatrixColumn( objectMatrix, 1 ); // get Y column of objectMatrix
			v.multiplyScalar( distance );

			panOffset.add( v );

		};

	}();

	// deltaX and deltaY are in pixels; right and down are positive
	var pan = function() {

		var offset = new THREE.Vector3();

		return function( deltaX, deltaY ) {

			var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

			if ( scope.object instanceof THREE.PerspectiveCamera ) {

				// perspective
				var position = scope.object.position;
				offset.copy( position ).sub( scope.target );
				var targetDistance = offset.length();

				// half of the fov is center to top of screen
				targetDistance *= Math.tan( ( scope.object.fov / 2 ) * Math.PI / 180.0 );

				// we actually don't use screenWidth, since perspective camera is fixed to screen height
				panLeft( 2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix );
				panUp( 2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix );

			} else if ( scope.object instanceof THREE.OrthographicCamera ) {

				// orthographic
				panLeft( deltaX * ( scope.object.right - scope.object.left ) / scope.object.zoom / element.clientWidth, scope.object.matrix );
				panUp( deltaY * ( scope.object.top - scope.object.bottom ) / scope.object.zoom / element.clientHeight, scope.object.matrix );

			} else {

				// camera neither orthographic nor perspective
				console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.' );
				scope.enablePan = false;

			}

		};

	}();

	function dollyIn( dollyScale ) {

		if ( scope.object instanceof THREE.PerspectiveCamera ) {

			scale /= dollyScale;

		} else if ( scope.object instanceof THREE.OrthographicCamera ) {

			scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom * dollyScale ) );
			scope.object.updateProjectionMatrix();
			zoomChanged = true;

		} else {

			console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
			scope.enableZoom = false;

		}

	}

	function dollyOut( dollyScale ) {

		if ( scope.object instanceof THREE.PerspectiveCamera ) {

			scale *= dollyScale;

		} else if ( scope.object instanceof THREE.OrthographicCamera ) {

			scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom / dollyScale ) );
			scope.object.updateProjectionMatrix();
			zoomChanged = true;

		} else {

			console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
			scope.enableZoom = false;

		}

	}

	//
	// event callbacks - update the object state
	//

	function handleMouseDownRotate( event ) {

		//console.log( 'handleMouseDownRotate' );

		rotateStart.set( event.clientX, event.clientY );

	}

	function handleMouseDownDolly( event ) {

		//console.log( 'handleMouseDownDolly' );

		dollyStart.set( event.clientX, event.clientY );

	}

	function handleMouseDownPan( event ) {

		//console.log( 'handleMouseDownPan' );

		panStart.set( event.clientX, event.clientY );

	}

	function handleMouseMoveRotate( event ) {

		//console.log( 'handleMouseMoveRotate' );

		rotateEnd.set( event.clientX, event.clientY );
		rotateDelta.subVectors( rotateEnd, rotateStart );

		var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

		// rotating across whole screen goes 360 degrees around
		rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );

		// rotating up and down along whole screen attempts to go 360, but limited to 180
		rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );

		rotateStart.copy( rotateEnd );

		scope.update();

	}

	function handleMouseMoveDolly( event ) {

		//console.log( 'handleMouseMoveDolly' );

		dollyEnd.set( event.clientX, event.clientY );

		dollyDelta.subVectors( dollyEnd, dollyStart );

		if ( dollyDelta.y > 0 ) {

			dollyIn( getZoomScale() );

		} else if ( dollyDelta.y < 0 ) {

			dollyOut( getZoomScale() );

		}

		dollyStart.copy( dollyEnd );

		scope.update();

	}

	function handleMouseMovePan( event ) {

		//console.log( 'handleMouseMovePan' );

		panEnd.set( event.clientX, event.clientY );

		panDelta.subVectors( panEnd, panStart );

		pan( panDelta.x, panDelta.y );

		panStart.copy( panEnd );

		scope.update();

	}

	function handleMouseUp( event ) {

		//console.log( 'handleMouseUp' );

	}

	function handleMouseWheel( event ) {

		//console.log( 'handleMouseWheel' );

		var delta = 0;

		if ( event.wheelDelta !== undefined ) {

			// WebKit / Opera / Explorer 9

			delta = event.wheelDelta;

		} else if ( event.detail !== undefined ) {

			// Firefox

			delta = - event.detail;

		}

		if ( delta > 0 ) {

			dollyOut( getZoomScale() );

		} else if ( delta < 0 ) {

			dollyIn( getZoomScale() );

		}

		scope.update();

	}

	function handleKeyDown( event ) {

		//console.log( 'handleKeyDown' );

		switch ( event.keyCode ) {

			case scope.keys.UP:
				pan( 0, scope.keyPanSpeed );
				scope.update();
				break;

			case scope.keys.BOTTOM:
				pan( 0, - scope.keyPanSpeed );
				scope.update();
				break;

			case scope.keys.LEFT:
				pan( scope.keyPanSpeed, 0 );
				scope.update();
				break;

			case scope.keys.RIGHT:
				pan( - scope.keyPanSpeed, 0 );
				scope.update();
				break;

		}

	}

	function handleTouchStartRotate( event ) {

		//console.log( 'handleTouchStartRotate' );

		rotateStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

	}

	function handleTouchStartDolly( event ) {

		//console.log( 'handleTouchStartDolly' );

		var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
		var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

		var distance = Math.sqrt( dx * dx + dy * dy );

		dollyStart.set( 0, distance );

	}

	function handleTouchStartPan( event ) {

		//console.log( 'handleTouchStartPan' );

		panStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

	}

	function handleTouchMoveRotate( event ) {

		//console.log( 'handleTouchMoveRotate' );

		rotateEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
		rotateDelta.subVectors( rotateEnd, rotateStart );

		var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

		// rotating across whole screen goes 360 degrees around
		rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );

		// rotating up and down along whole screen attempts to go 360, but limited to 180
		rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );

		rotateStart.copy( rotateEnd );

		scope.update();

	}

	function handleTouchMoveDolly( event ) {

		//console.log( 'handleTouchMoveDolly' );

		var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
		var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

		var distance = Math.sqrt( dx * dx + dy * dy );

		dollyEnd.set( 0, distance );

		dollyDelta.subVectors( dollyEnd, dollyStart );

		if ( dollyDelta.y > 0 ) {

			dollyOut( getZoomScale() );

		} else if ( dollyDelta.y < 0 ) {

			dollyIn( getZoomScale() );

		}

		dollyStart.copy( dollyEnd );

		scope.update();

	}

	function handleTouchMovePan( event ) {

		//console.log( 'handleTouchMovePan' );

		panEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

		panDelta.subVectors( panEnd, panStart );

		pan( panDelta.x, panDelta.y );

		panStart.copy( panEnd );

		scope.update();

	}

	function handleTouchEnd( event ) {

		//console.log( 'handleTouchEnd' );

	}

	//
	// event handlers - FSM: listen for events and reset state
	//

	function onMouseDown( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();

		if ( event.button === scope.mouseButtons.ORBIT ) {

			if ( scope.enableRotate === false ) return;

			handleMouseDownRotate( event );

			state = STATE.ROTATE;

		} else if ( event.button === scope.mouseButtons.ZOOM ) {

			if ( scope.enableZoom === false ) return;

			handleMouseDownDolly( event );

			state = STATE.DOLLY;

		} else if ( event.button === scope.mouseButtons.PAN ) {

			if ( scope.enablePan === false ) return;

			handleMouseDownPan( event );

			state = STATE.PAN;

		}

		if ( state !== STATE.NONE ) {

			document.addEventListener( 'mousemove', onMouseMove, false );
			document.addEventListener( 'mouseup', onMouseUp, false );
			document.addEventListener( 'mouseout', onMouseUp, false );

			scope.dispatchEvent( startEvent );

		}

	}

	function onMouseMove( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();

		if ( state === STATE.ROTATE ) {

			if ( scope.enableRotate === false ) return;

			handleMouseMoveRotate( event );

		} else if ( state === STATE.DOLLY ) {

			if ( scope.enableZoom === false ) return;

			handleMouseMoveDolly( event );

		} else if ( state === STATE.PAN ) {

			if ( scope.enablePan === false ) return;

			handleMouseMovePan( event );

		}

	}

	function onMouseUp( event ) {

		if ( scope.enabled === false ) return;

		handleMouseUp( event );

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );
		document.removeEventListener( 'mouseout', onMouseUp, false );

		scope.dispatchEvent( endEvent );

		state = STATE.NONE;

	}

	function onMouseWheel( event ) {

		if ( scope.enabled === false || scope.enableZoom === false || state !== STATE.NONE ) return;

		event.preventDefault();
		event.stopPropagation();

		handleMouseWheel( event );

		scope.dispatchEvent( startEvent ); // not sure why these are here...
		scope.dispatchEvent( endEvent );

	}

	function onKeyDown( event ) {

		if ( scope.enabled === false || scope.enableKeys === false || scope.enablePan === false ) return;

		handleKeyDown( event );

	}

	function onTouchStart( event ) {

		if ( scope.enabled === false ) return;

		switch ( event.touches.length ) {

			case 1:	// one-fingered touch: rotate

				if ( scope.enableRotate === false ) return;

				handleTouchStartRotate( event );

				state = STATE.TOUCH_ROTATE;

				break;

			case 2:	// two-fingered touch: dolly

				if ( scope.enableZoom === false ) return;

				handleTouchStartDolly( event );

				state = STATE.TOUCH_DOLLY;

				break;

			case 3: // three-fingered touch: pan

				if ( scope.enablePan === false ) return;

				handleTouchStartPan( event );

				state = STATE.TOUCH_PAN;

				break;

			default:

				state = STATE.NONE;

		}

		if ( state !== STATE.NONE ) {

			scope.dispatchEvent( startEvent );

		}

	}

	function onTouchMove( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		switch ( event.touches.length ) {

			case 1: // one-fingered touch: rotate

				if ( scope.enableRotate === false ) return;
				if ( state !== STATE.TOUCH_ROTATE ) return; // is this needed?...

				handleTouchMoveRotate( event );

				break;

			case 2: // two-fingered touch: dolly

				if ( scope.enableZoom === false ) return;
				if ( state !== STATE.TOUCH_DOLLY ) return; // is this needed?...

				handleTouchMoveDolly( event );

				break;

			case 3: // three-fingered touch: pan

				if ( scope.enablePan === false ) return;
				if ( state !== STATE.TOUCH_PAN ) return; // is this needed?...

				handleTouchMovePan( event );

				break;

			default:

				state = STATE.NONE;

		}

	}

	function onTouchEnd( event ) {

		if ( scope.enabled === false ) return;

		handleTouchEnd( event );

		scope.dispatchEvent( endEvent );

		state = STATE.NONE;

	}

	function onContextMenu( event ) {

		event.preventDefault();

	}

	//

	scope.domElement.addEventListener( 'contextmenu', onContextMenu, false );

	scope.domElement.addEventListener( 'mousedown', onMouseDown, false );
	scope.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
	scope.domElement.addEventListener( 'MozMousePixelScroll', onMouseWheel, false ); // firefox

	scope.domElement.addEventListener( 'touchstart', onTouchStart, false );
	scope.domElement.addEventListener( 'touchend', onTouchEnd, false );
	scope.domElement.addEventListener( 'touchmove', onTouchMove, false );

	window.addEventListener( 'keydown', onKeyDown, false );

	// force an update at start

	this.update();

};

THREE.OrbitControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.OrbitControls.prototype.constructor = THREE.OrbitControls;

Object.defineProperties( THREE.OrbitControls.prototype, {

	center: {

		get: function () {

			console.warn( 'THREE.OrbitControls: .center has been renamed to .target' );
			return this.target;

		}

	},

	// backward compatibility

	noZoom: {

		get: function () {

			console.warn( 'THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.' );
			return ! this.enableZoom;

		},

		set: function ( value ) {

			console.warn( 'THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.' );
			this.enableZoom = ! value;

		}

	},

	noRotate: {

		get: function () {

			console.warn( 'THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.' );
			return ! this.enableRotate;

		},

		set: function ( value ) {

			console.warn( 'THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.' );
			this.enableRotate = ! value;

		}

	},

	noPan: {

		get: function () {

			console.warn( 'THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.' );
			return ! this.enablePan;

		},

		set: function ( value ) {

			console.warn( 'THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.' );
			this.enablePan = ! value;

		}

	},

	noKeys: {

		get: function () {

			console.warn( 'THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.' );
			return ! this.enableKeys;

		},

		set: function ( value ) {

			console.warn( 'THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.' );
			this.enableKeys = ! value;

		}

	},

	staticMoving : {

		get: function () {

			console.warn( 'THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.' );
			return ! this.constraint.enableDamping;

		},

		set: function ( value ) {

			console.warn( 'THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.' );
			this.constraint.enableDamping = ! value;

		}

	},

	dynamicDampingFactor : {

		get: function () {

			console.warn( 'THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.' );
			return this.constraint.dampingFactor;

		},

		set: function ( value ) {

			console.warn( 'THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.' );
			this.constraint.dampingFactor = value;

		}

	}

} );

///<jscompress sourcefile="TrackballControls.js" />
/**
 * @author Eberhard Graether / http://egraether.com/
 * @author Mark Lundin 	/ http://mark-lundin.com
 * @author Simone Manini / http://daron1337.github.io
 * @author Luca Antiga 	/ http://lantiga.github.io
 */

THREE.TrackballControls = function ( object, domElement ) {

	var _this = this;
	var STATE = { NONE: - 1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM_PAN: 4 };

	this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// API

	this.enabled = true;

	this.screen = { left: 0, top: 0, width: 0, height: 0 };

	this.rotateSpeed = 1.0;
	this.zoomSpeed = 1.2;
	this.panSpeed = 0.3;

	this.noRotate = false;
	this.noZoom = false;
	this.noPan = false;

	this.staticMoving = false;
	this.dynamicDampingFactor = 0.2;

	this.minDistance = 0;
	this.maxDistance = Infinity;

	this.keys = [ 65 /*A*/, 83 /*S*/, 68 /*D*/ ];

	// internals

	this.target = new THREE.Vector3();

	var EPS = 0.000001;

	var lastPosition = new THREE.Vector3();

	var _state = STATE.NONE,
	_prevState = STATE.NONE,

	_eye = new THREE.Vector3(),

	_movePrev = new THREE.Vector2(),
	_moveCurr = new THREE.Vector2(),

	_lastAxis = new THREE.Vector3(),
	_lastAngle = 0,

	_zoomStart = new THREE.Vector2(),
	_zoomEnd = new THREE.Vector2(),

	_touchZoomDistanceStart = 0,
	_touchZoomDistanceEnd = 0,

	_panStart = new THREE.Vector2(),
	_panEnd = new THREE.Vector2();

	// for reset

	this.target0 = this.target.clone();
	this.position0 = this.object.position.clone();
	this.up0 = this.object.up.clone();

	// events

	var changeEvent = { type: 'change' };
	var startEvent = { type: 'start' };
	var endEvent = { type: 'end' };


	// methods

	this.handleResize = function () {

		if ( this.domElement === document ) {

			this.screen.left = 0;
			this.screen.top = 0;
			this.screen.width = window.innerWidth;
			this.screen.height = window.innerHeight;

		} else {

			var box = this.domElement.getBoundingClientRect();
			// adjustments come from similar code in the jquery offset() function
			var d = this.domElement.ownerDocument.documentElement;
			this.screen.left = box.left + window.pageXOffset - d.clientLeft;
			this.screen.top = box.top + window.pageYOffset - d.clientTop;
			this.screen.width = box.width;
			this.screen.height = box.height;

		}

	};

	this.handleEvent = function ( event ) {

		if ( typeof this[ event.type ] == 'function' ) {

			this[ event.type ]( event );

		}

	};

	var getMouseOnScreen = ( function () {

		var vector = new THREE.Vector2();

		return function getMouseOnScreen( pageX, pageY ) {

			vector.set(
				( pageX - _this.screen.left ) / _this.screen.width,
				( pageY - _this.screen.top ) / _this.screen.height
			);

			return vector;

		};

	}() );

	var getMouseOnCircle = ( function () {

		var vector = new THREE.Vector2();

		return function getMouseOnCircle( pageX, pageY ) {

			vector.set(
				( ( pageX - _this.screen.width * 0.5 - _this.screen.left ) / ( _this.screen.width * 0.5 ) ),
				( ( _this.screen.height + 2 * ( _this.screen.top - pageY ) ) / _this.screen.width ) // screen.width intentional
			);

			return vector;

		};

	}() );

	this.rotateCamera = ( function() {

		var axis = new THREE.Vector3(),
			quaternion = new THREE.Quaternion(),
			eyeDirection = new THREE.Vector3(),
			objectUpDirection = new THREE.Vector3(),
			objectSidewaysDirection = new THREE.Vector3(),
			moveDirection = new THREE.Vector3(),
			angle;

		return function rotateCamera() {

			moveDirection.set( _moveCurr.x - _movePrev.x, _moveCurr.y - _movePrev.y, 0 );
			angle = moveDirection.length();

			if ( angle ) {

				_eye.copy( _this.object.position ).sub( _this.target );

				eyeDirection.copy( _eye ).normalize();
				objectUpDirection.copy( _this.object.up ).normalize();
				objectSidewaysDirection.crossVectors( objectUpDirection, eyeDirection ).normalize();

				objectUpDirection.setLength( _moveCurr.y - _movePrev.y );
				objectSidewaysDirection.setLength( _moveCurr.x - _movePrev.x );

				moveDirection.copy( objectUpDirection.add( objectSidewaysDirection ) );

				axis.crossVectors( moveDirection, _eye ).normalize();

				angle *= _this.rotateSpeed;
				quaternion.setFromAxisAngle( axis, angle );

				_eye.applyQuaternion( quaternion );
				_this.object.up.applyQuaternion( quaternion );

				_lastAxis.copy( axis );
				_lastAngle = angle;

			} else if ( ! _this.staticMoving && _lastAngle ) {

				_lastAngle *= Math.sqrt( 1.0 - _this.dynamicDampingFactor );
				_eye.copy( _this.object.position ).sub( _this.target );
				quaternion.setFromAxisAngle( _lastAxis, _lastAngle );
				_eye.applyQuaternion( quaternion );
				_this.object.up.applyQuaternion( quaternion );

			}

			_movePrev.copy( _moveCurr );

		};

	}() );


	this.zoomCamera = function () {

		var factor;

		if ( _state === STATE.TOUCH_ZOOM_PAN ) {

			factor = _touchZoomDistanceStart / _touchZoomDistanceEnd;
			_touchZoomDistanceStart = _touchZoomDistanceEnd;
			_eye.multiplyScalar( factor );

		} else {

			factor = 1.0 + ( _zoomEnd.y - _zoomStart.y ) * _this.zoomSpeed;

			if ( factor !== 1.0 && factor > 0.0 ) {

				_eye.multiplyScalar( factor );

				if ( _this.staticMoving ) {

					_zoomStart.copy( _zoomEnd );

				} else {

					_zoomStart.y += ( _zoomEnd.y - _zoomStart.y ) * this.dynamicDampingFactor;

				}

			}

		}

	};

	this.panCamera = ( function() {

		var mouseChange = new THREE.Vector2(),
			objectUp = new THREE.Vector3(),
			pan = new THREE.Vector3();

		return function panCamera() {

			mouseChange.copy( _panEnd ).sub( _panStart );

			if ( mouseChange.lengthSq() ) {

				mouseChange.multiplyScalar( _eye.length() * _this.panSpeed );

				pan.copy( _eye ).cross( _this.object.up ).setLength( mouseChange.x );
				pan.add( objectUp.copy( _this.object.up ).setLength( mouseChange.y ) );

				_this.object.position.add( pan );
				_this.target.add( pan );

				if ( _this.staticMoving ) {

					_panStart.copy( _panEnd );

				} else {

					_panStart.add( mouseChange.subVectors( _panEnd, _panStart ).multiplyScalar( _this.dynamicDampingFactor ) );

				}

			}

		};

	}() );

	this.checkDistances = function () {

		if ( ! _this.noZoom || ! _this.noPan ) {

			if ( _eye.lengthSq() > _this.maxDistance * _this.maxDistance ) {

				_this.object.position.addVectors( _this.target, _eye.setLength( _this.maxDistance ) );
				_zoomStart.copy( _zoomEnd );

			}

			if ( _eye.lengthSq() < _this.minDistance * _this.minDistance ) {

				_this.object.position.addVectors( _this.target, _eye.setLength( _this.minDistance ) );
				_zoomStart.copy( _zoomEnd );

			}

		}

	};

	this.update = function () {

		_eye.subVectors( _this.object.position, _this.target );

		if ( ! _this.noRotate ) {

			_this.rotateCamera();

		}

		if ( ! _this.noZoom ) {

			_this.zoomCamera();

		}

		if ( ! _this.noPan ) {

			_this.panCamera();

		}

		_this.object.position.addVectors( _this.target, _eye );

		_this.checkDistances();

		_this.object.lookAt( _this.target );

		if ( lastPosition.distanceToSquared( _this.object.position ) > EPS ) {

			_this.dispatchEvent( changeEvent );

			lastPosition.copy( _this.object.position );

		}

	};

	this.reset = function () {

		_state = STATE.NONE;
		_prevState = STATE.NONE;

		_this.target.copy( _this.target0 );
		_this.object.position.copy( _this.position0 );
		_this.object.up.copy( _this.up0 );

		_eye.subVectors( _this.object.position, _this.target );

		_this.object.lookAt( _this.target );

		_this.dispatchEvent( changeEvent );

		lastPosition.copy( _this.object.position );

	};

	// listeners

	function keydown( event ) {

		if ( _this.enabled === false ) return;

		window.removeEventListener( 'keydown', keydown );

		_prevState = _state;

		if ( _state !== STATE.NONE ) {

			return;

		} else if ( event.keyCode === _this.keys[ STATE.ROTATE ] && ! _this.noRotate ) {

			_state = STATE.ROTATE;

		} else if ( event.keyCode === _this.keys[ STATE.ZOOM ] && ! _this.noZoom ) {

			_state = STATE.ZOOM;

		} else if ( event.keyCode === _this.keys[ STATE.PAN ] && ! _this.noPan ) {

			_state = STATE.PAN;

		}

	}

	function keyup( event ) {

		if ( _this.enabled === false ) return;

		_state = _prevState;

		window.addEventListener( 'keydown', keydown, false );

	}

	function mousedown( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		if ( _state === STATE.NONE ) {

			_state = event.button;

		}

		if ( _state === STATE.ROTATE && ! _this.noRotate ) {

			_moveCurr.copy( getMouseOnCircle( event.pageX, event.pageY ) );
			_movePrev.copy( _moveCurr );

		} else if ( _state === STATE.ZOOM && ! _this.noZoom ) {

			_zoomStart.copy( getMouseOnScreen( event.pageX, event.pageY ) );
			_zoomEnd.copy( _zoomStart );

		} else if ( _state === STATE.PAN && ! _this.noPan ) {

			_panStart.copy( getMouseOnScreen( event.pageX, event.pageY ) );
			_panEnd.copy( _panStart );

		}

		document.addEventListener( 'mousemove', mousemove, false );
		document.addEventListener( 'mouseup', mouseup, false );

		_this.dispatchEvent( startEvent );

	}

	function mousemove( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		if ( _state === STATE.ROTATE && ! _this.noRotate ) {

			_movePrev.copy( _moveCurr );
			_moveCurr.copy( getMouseOnCircle( event.pageX, event.pageY ) );

		} else if ( _state === STATE.ZOOM && ! _this.noZoom ) {

			_zoomEnd.copy( getMouseOnScreen( event.pageX, event.pageY ) );

		} else if ( _state === STATE.PAN && ! _this.noPan ) {

			_panEnd.copy( getMouseOnScreen( event.pageX, event.pageY ) );

		}

	}

	function mouseup( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		_state = STATE.NONE;

		document.removeEventListener( 'mousemove', mousemove );
		document.removeEventListener( 'mouseup', mouseup );
		_this.dispatchEvent( endEvent );

	}

	function mousewheel( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		var delta = 0;

		if ( event.wheelDelta ) {

			// WebKit / Opera / Explorer 9

			delta = event.wheelDelta / 40;

		} else if ( event.detail ) {

			// Firefox

			delta = - event.detail / 3;

		}

		_zoomStart.y += delta * 0.01;
		_this.dispatchEvent( startEvent );
		_this.dispatchEvent( endEvent );

	}

	function touchstart( event ) {

		if ( _this.enabled === false ) return;

		switch ( event.touches.length ) {

			case 1:
				_state = STATE.TOUCH_ROTATE;
				_moveCurr.copy( getMouseOnCircle( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
				_movePrev.copy( _moveCurr );
				break;

			case 2:
				_state = STATE.TOUCH_ZOOM_PAN;
				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				_touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt( dx * dx + dy * dy );

				var x = ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX ) / 2;
				var y = ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY ) / 2;
				_panStart.copy( getMouseOnScreen( x, y ) );
				_panEnd.copy( _panStart );
				break;

			default:
				_state = STATE.NONE;

		}
		_this.dispatchEvent( startEvent );


	}

	function touchmove( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		switch ( event.touches.length ) {

			case 1:
				_movePrev.copy( _moveCurr );
				_moveCurr.copy( getMouseOnCircle(  event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
				break;

			case 2:
				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				_touchZoomDistanceEnd = Math.sqrt( dx * dx + dy * dy );

				var x = ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX ) / 2;
				var y = ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY ) / 2;
				_panEnd.copy( getMouseOnScreen( x, y ) );
				break;

			default:
				_state = STATE.NONE;

		}

	}

	function touchend( event ) {

		if ( _this.enabled === false ) return;

		switch ( event.touches.length ) {

			case 1:
				_movePrev.copy( _moveCurr );
				_moveCurr.copy( getMouseOnCircle(  event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
				break;

			case 2:
				_touchZoomDistanceStart = _touchZoomDistanceEnd = 0;

				var x = ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX ) / 2;
				var y = ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY ) / 2;
				_panEnd.copy( getMouseOnScreen( x, y ) );
				_panStart.copy( _panEnd );
				break;

		}

		_state = STATE.NONE;
		_this.dispatchEvent( endEvent );

	}

	function contextmenu( event ) {

		event.preventDefault();

	}

	this.dispose = function() {

		this.domElement.removeEventListener( 'contextmenu', contextmenu, false );
		this.domElement.removeEventListener( 'mousedown', mousedown, false );
		this.domElement.removeEventListener( 'mousewheel', mousewheel, false );
		this.domElement.removeEventListener( 'MozMousePixelScroll', mousewheel, false ); // firefox

		this.domElement.removeEventListener( 'touchstart', touchstart, false );
		this.domElement.removeEventListener( 'touchend', touchend, false );
		this.domElement.removeEventListener( 'touchmove', touchmove, false );

		document.removeEventListener( 'mousemove', mousemove, false );
		document.removeEventListener( 'mouseup', mouseup, false );

		window.removeEventListener( 'keydown', keydown, false );
		window.removeEventListener( 'keyup', keyup, false );

	}

	this.domElement.addEventListener( 'contextmenu', contextmenu, false );
	this.domElement.addEventListener( 'mousedown', mousedown, false );
	this.domElement.addEventListener( 'mousewheel', mousewheel, false );
	this.domElement.addEventListener( 'MozMousePixelScroll', mousewheel, false ); // firefox

	this.domElement.addEventListener( 'touchstart', touchstart, false );
	this.domElement.addEventListener( 'touchend', touchend, false );
	this.domElement.addEventListener( 'touchmove', touchmove, false );

	window.addEventListener( 'keydown', keydown, false );
	window.addEventListener( 'keyup', keyup, false );

	this.handleResize();

	// force an update at start
	this.update();

};

THREE.TrackballControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.TrackballControls.prototype.constructor = THREE.TrackballControls;

///<jscompress sourcefile="TransformControls.js" />
/**
 * @author arodic / https://github.com/arodic
 */
 /*jshint sub:true*/

( function () {

	'use strict';


	var GizmoMaterial = function ( parameters ) {

		THREE.MeshBasicMaterial.call( this );

		this.depthTest = false;
		this.depthWrite = false;
		this.side = THREE.FrontSide;
		this.transparent = true;

		this.setValues( parameters );

		this.oldColor = this.color.clone();
		this.oldOpacity = this.opacity;

		this.highlight = function( highlighted ) {

			if ( highlighted ) {

				this.color.setRGB( 1, 1, 0 );
				this.opacity = 1;

			} else {

				this.color.copy( this.oldColor );
				this.opacity = this.oldOpacity;

			}

		};

	};

	GizmoMaterial.prototype = Object.create( THREE.MeshBasicMaterial.prototype );
	GizmoMaterial.prototype.constructor = GizmoMaterial;


	var GizmoLineMaterial = function ( parameters ) {

		THREE.LineBasicMaterial.call( this );

		this.depthTest = false;
		this.depthWrite = false;
		this.transparent = true;
		this.linewidth = 1;

		this.setValues( parameters );

		this.oldColor = this.color.clone();
		this.oldOpacity = this.opacity;

		this.highlight = function( highlighted ) {

			if ( highlighted ) {

				this.color.setRGB( 1, 1, 0 );
				this.opacity = 1;

			} else {

				this.color.copy( this.oldColor );
				this.opacity = this.oldOpacity;

			}

		};

	};

	GizmoLineMaterial.prototype = Object.create( THREE.LineBasicMaterial.prototype );
	GizmoLineMaterial.prototype.constructor = GizmoLineMaterial;


	var pickerMaterial = new GizmoMaterial( { visible: false, transparent: false } );


	THREE.TransformGizmo = function () {

		var scope = this;

		this.init = function () {

			THREE.Object3D.call( this );

			this.handles = new THREE.Object3D();
			this.pickers = new THREE.Object3D();
			this.planes = new THREE.Object3D();

			this.add( this.handles );
			this.add( this.pickers );
			this.add( this.planes );

			//// PLANES

			var planeGeometry = new THREE.PlaneBufferGeometry( 50, 50, 2, 2 );
			var planeMaterial = new THREE.MeshBasicMaterial( { visible: false, side: THREE.DoubleSide } );

			var planes = {
				"XY":   new THREE.Mesh( planeGeometry, planeMaterial ),
				"YZ":   new THREE.Mesh( planeGeometry, planeMaterial ),
				"XZ":   new THREE.Mesh( planeGeometry, planeMaterial ),
				"XYZE": new THREE.Mesh( planeGeometry, planeMaterial )
			};

			this.activePlane = planes[ "XYZE" ];

			planes[ "YZ" ].rotation.set( 0, Math.PI / 2, 0 );
			planes[ "XZ" ].rotation.set( - Math.PI / 2, 0, 0 );

			for ( var i in planes ) {

				planes[ i ].name = i;
				this.planes.add( planes[ i ] );
				this.planes[ i ] = planes[ i ];

			}

			//// HANDLES AND PICKERS

			var setupGizmos = function( gizmoMap, parent ) {

				for ( var name in gizmoMap ) {

					for ( i = gizmoMap[ name ].length; i --; ) {

						var object = gizmoMap[ name ][ i ][ 0 ];
						var position = gizmoMap[ name ][ i ][ 1 ];
						var rotation = gizmoMap[ name ][ i ][ 2 ];

						object.name = name;

						if ( position ) object.position.set( position[ 0 ], position[ 1 ], position[ 2 ] );
						if ( rotation ) object.rotation.set( rotation[ 0 ], rotation[ 1 ], rotation[ 2 ] );

						parent.add( object );

					}

				}

			};

			setupGizmos( this.handleGizmos, this.handles );
			setupGizmos( this.pickerGizmos, this.pickers );

			// reset Transformations

			this.traverse( function ( child ) {

				if ( child instanceof THREE.Mesh ) {

					child.updateMatrix();

					var tempGeometry = child.geometry.clone();
					tempGeometry.applyMatrix( child.matrix );
					child.geometry = tempGeometry;

					child.position.set( 0, 0, 0 );
					child.rotation.set( 0, 0, 0 );
					child.scale.set( 1, 1, 1 );

				}

			} );

		};

		this.highlight = function ( axis ) {

			this.traverse( function( child ) {

				if ( child.material && child.material.highlight ) {

					if ( child.name === axis ) {

						child.material.highlight( true );

					} else {

						child.material.highlight( false );

					}

				}

			} );

		};

	};

	THREE.TransformGizmo.prototype = Object.create( THREE.Object3D.prototype );
	THREE.TransformGizmo.prototype.constructor = THREE.TransformGizmo;

	THREE.TransformGizmo.prototype.update = function ( rotation, eye ) {

		var vec1 = new THREE.Vector3( 0, 0, 0 );
		var vec2 = new THREE.Vector3( 0, 1, 0 );
		var lookAtMatrix = new THREE.Matrix4();

		this.traverse( function( child ) {

			if ( child.name.search( "E" ) !== - 1 ) {

				child.quaternion.setFromRotationMatrix( lookAtMatrix.lookAt( eye, vec1, vec2 ) );

			} else if ( child.name.search( "X" ) !== - 1 || child.name.search( "Y" ) !== - 1 || child.name.search( "Z" ) !== - 1 ) {

				child.quaternion.setFromEuler( rotation );

			}

		} );

	};

	THREE.TransformGizmoTranslate = function () {

		THREE.TransformGizmo.call( this );

		var arrowGeometry = new THREE.Geometry();
		var mesh = new THREE.Mesh( new THREE.CylinderGeometry( 0, 0.05, 0.2, 12, 1, false ) );
		mesh.position.y = 0.5;
		mesh.updateMatrix();

		arrowGeometry.merge( mesh.geometry, mesh.matrix );

		var lineXGeometry = new THREE.BufferGeometry();
		lineXGeometry.addAttribute( 'position', new THREE.Float32Attribute( [ 0, 0, 0,  1, 0, 0 ], 3 ) );

		var lineYGeometry = new THREE.BufferGeometry();
		lineYGeometry.addAttribute( 'position', new THREE.Float32Attribute( [ 0, 0, 0,  0, 1, 0 ], 3 ) );

		var lineZGeometry = new THREE.BufferGeometry();
		lineZGeometry.addAttribute( 'position', new THREE.Float32Attribute( [ 0, 0, 0,  0, 0, 1 ], 3 ) );

		this.handleGizmos = {

			X: [
				[ new THREE.Mesh( arrowGeometry, new GizmoMaterial( { color: 0xff0000 } ) ), [ 0.5, 0, 0 ], [ 0, 0, - Math.PI / 2 ] ],
				[ new THREE.Line( lineXGeometry, new GizmoLineMaterial( { color: 0xff0000 } ) ) ]
			],

			Y: [
				[ new THREE.Mesh( arrowGeometry, new GizmoMaterial( { color: 0x00ff00 } ) ), [ 0, 0.5, 0 ] ],
				[	new THREE.Line( lineYGeometry, new GizmoLineMaterial( { color: 0x00ff00 } ) ) ]
			],

			Z: [
				[ new THREE.Mesh( arrowGeometry, new GizmoMaterial( { color: 0x0000ff } ) ), [ 0, 0, 0.5 ], [ Math.PI / 2, 0, 0 ] ],
				[ new THREE.Line( lineZGeometry, new GizmoLineMaterial( { color: 0x0000ff } ) ) ]
			],

			XYZ: [
				[ new THREE.Mesh( new THREE.OctahedronGeometry( 0.1, 0 ), new GizmoMaterial( { color: 0xffffff, opacity: 0.25 } ) ), [ 0, 0, 0 ], [ 0, 0, 0 ] ]
			],

			XY: [
				[ new THREE.Mesh( new THREE.PlaneBufferGeometry( 0.29, 0.29 ), new GizmoMaterial( { color: 0xffff00, opacity: 0.25 } ) ), [ 0.15, 0.15, 0 ] ]
			],

			YZ: [
				[ new THREE.Mesh( new THREE.PlaneBufferGeometry( 0.29, 0.29 ), new GizmoMaterial( { color: 0x00ffff, opacity: 0.25 } ) ), [ 0, 0.15, 0.15 ], [ 0, Math.PI / 2, 0 ] ]
			],

			XZ: [
				[ new THREE.Mesh( new THREE.PlaneBufferGeometry( 0.29, 0.29 ), new GizmoMaterial( { color: 0xff00ff, opacity: 0.25 } ) ), [ 0.15, 0, 0.15 ], [ - Math.PI / 2, 0, 0 ] ]
			]

		};

		this.pickerGizmos = {

			X: [
				[ new THREE.Mesh( new THREE.CylinderGeometry( 0.2, 0, 1, 4, 1, false ), pickerMaterial ), [ 0.6, 0, 0 ], [ 0, 0, - Math.PI / 2 ] ]
			],

			Y: [
				[ new THREE.Mesh( new THREE.CylinderGeometry( 0.2, 0, 1, 4, 1, false ), pickerMaterial ), [ 0, 0.6, 0 ] ]
			],

			Z: [
				[ new THREE.Mesh( new THREE.CylinderGeometry( 0.2, 0, 1, 4, 1, false ), pickerMaterial ), [ 0, 0, 0.6 ], [ Math.PI / 2, 0, 0 ] ]
			],

			XYZ: [
				[ new THREE.Mesh( new THREE.OctahedronGeometry( 0.2, 0 ), pickerMaterial ) ]
			],

			XY: [
				[ new THREE.Mesh( new THREE.PlaneBufferGeometry( 0.4, 0.4 ), pickerMaterial ), [ 0.2, 0.2, 0 ] ]
			],

			YZ: [
				[ new THREE.Mesh( new THREE.PlaneBufferGeometry( 0.4, 0.4 ), pickerMaterial ), [ 0, 0.2, 0.2 ], [ 0, Math.PI / 2, 0 ] ]
			],

			XZ: [
				[ new THREE.Mesh( new THREE.PlaneBufferGeometry( 0.4, 0.4 ), pickerMaterial ), [ 0.2, 0, 0.2 ], [ - Math.PI / 2, 0, 0 ] ]
			]

		};

		this.setActivePlane = function ( axis, eye ) {

			var tempMatrix = new THREE.Matrix4();
			eye.applyMatrix4( tempMatrix.getInverse( tempMatrix.extractRotation( this.planes[ "XY" ].matrixWorld ) ) );

			if ( axis === "X" ) {

				this.activePlane = this.planes[ "XY" ];

				if ( Math.abs( eye.y ) > Math.abs( eye.z ) ) this.activePlane = this.planes[ "XZ" ];

			}

			if ( axis === "Y" ) {

				this.activePlane = this.planes[ "XY" ];

				if ( Math.abs( eye.x ) > Math.abs( eye.z ) ) this.activePlane = this.planes[ "YZ" ];

			}

			if ( axis === "Z" ) {

				this.activePlane = this.planes[ "XZ" ];

				if ( Math.abs( eye.x ) > Math.abs( eye.y ) ) this.activePlane = this.planes[ "YZ" ];

			}

			if ( axis === "XYZ" ) this.activePlane = this.planes[ "XYZE" ];

			if ( axis === "XY" ) this.activePlane = this.planes[ "XY" ];

			if ( axis === "YZ" ) this.activePlane = this.planes[ "YZ" ];

			if ( axis === "XZ" ) this.activePlane = this.planes[ "XZ" ];

		};

		this.init();

	};

	THREE.TransformGizmoTranslate.prototype = Object.create( THREE.TransformGizmo.prototype );
	THREE.TransformGizmoTranslate.prototype.constructor = THREE.TransformGizmoTranslate;

	THREE.TransformGizmoRotate = function () {

		THREE.TransformGizmo.call( this );

		var CircleGeometry = function ( radius, facing, arc ) {

			var geometry = new THREE.BufferGeometry();
			var vertices = [];
			arc = arc ? arc : 1;

			for ( var i = 0; i <= 64 * arc; ++ i ) {

				if ( facing === 'x' ) vertices.push( 0, Math.cos( i / 32 * Math.PI ) * radius, Math.sin( i / 32 * Math.PI ) * radius );
				if ( facing === 'y' ) vertices.push( Math.cos( i / 32 * Math.PI ) * radius, 0, Math.sin( i / 32 * Math.PI ) * radius );
				if ( facing === 'z' ) vertices.push( Math.sin( i / 32 * Math.PI ) * radius, Math.cos( i / 32 * Math.PI ) * radius, 0 );

			}

			geometry.addAttribute( 'position', new THREE.Float32Attribute( vertices, 3 ) );
			return geometry;

		};

		this.handleGizmos = {

			X: [
				[ new THREE.Line( new CircleGeometry( 1, 'x', 0.5 ), new GizmoLineMaterial( { color: 0xff0000 } ) ) ]
			],

			Y: [
				[ new THREE.Line( new CircleGeometry( 1, 'y', 0.5 ), new GizmoLineMaterial( { color: 0x00ff00 } ) ) ]
			],

			Z: [
				[ new THREE.Line( new CircleGeometry( 1, 'z', 0.5 ), new GizmoLineMaterial( { color: 0x0000ff } ) ) ]
			],

			E: [
				[ new THREE.Line( new CircleGeometry( 1.25, 'z', 1 ), new GizmoLineMaterial( { color: 0xcccc00 } ) ) ]
			],

			XYZE: [
				[ new THREE.Line( new CircleGeometry( 1, 'z', 1 ), new GizmoLineMaterial( { color: 0x787878 } ) ) ]
			]

		};

		this.pickerGizmos = {

			X: [
				[ new THREE.Mesh( new THREE.TorusGeometry( 1, 0.12, 4, 12, Math.PI ), pickerMaterial ), [ 0, 0, 0 ], [ 0, - Math.PI / 2, - Math.PI / 2 ] ]
			],

			Y: [
				[ new THREE.Mesh( new THREE.TorusGeometry( 1, 0.12, 4, 12, Math.PI ), pickerMaterial ), [ 0, 0, 0 ], [ Math.PI / 2, 0, 0 ] ]
			],

			Z: [
				[ new THREE.Mesh( new THREE.TorusGeometry( 1, 0.12, 4, 12, Math.PI ), pickerMaterial ), [ 0, 0, 0 ], [ 0, 0, - Math.PI / 2 ] ]
			],

			E: [
				[ new THREE.Mesh( new THREE.TorusGeometry( 1.25, 0.12, 2, 24 ), pickerMaterial ) ]
			],

			XYZE: [
				[ new THREE.Mesh( new THREE.Geometry() ) ]// TODO
			]

		};

		this.setActivePlane = function ( axis ) {

			if ( axis === "E" ) this.activePlane = this.planes[ "XYZE" ];

			if ( axis === "X" ) this.activePlane = this.planes[ "YZ" ];

			if ( axis === "Y" ) this.activePlane = this.planes[ "XZ" ];

			if ( axis === "Z" ) this.activePlane = this.planes[ "XY" ];

		};

		this.update = function ( rotation, eye2 ) {

			THREE.TransformGizmo.prototype.update.apply( this, arguments );

			var group = {

				handles: this[ "handles" ],
				pickers: this[ "pickers" ],

			};

			var tempMatrix = new THREE.Matrix4();
			var worldRotation = new THREE.Euler( 0, 0, 1 );
			var tempQuaternion = new THREE.Quaternion();
			var unitX = new THREE.Vector3( 1, 0, 0 );
			var unitY = new THREE.Vector3( 0, 1, 0 );
			var unitZ = new THREE.Vector3( 0, 0, 1 );
			var quaternionX = new THREE.Quaternion();
			var quaternionY = new THREE.Quaternion();
			var quaternionZ = new THREE.Quaternion();
			var eye = eye2.clone();

			worldRotation.copy( this.planes[ "XY" ].rotation );
			tempQuaternion.setFromEuler( worldRotation );

			tempMatrix.makeRotationFromQuaternion( tempQuaternion ).getInverse( tempMatrix );
			eye.applyMatrix4( tempMatrix );

			this.traverse( function( child ) {

				tempQuaternion.setFromEuler( worldRotation );

				if ( child.name === "X" ) {

					quaternionX.setFromAxisAngle( unitX, Math.atan2( - eye.y, eye.z ) );
					tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionX );
					child.quaternion.copy( tempQuaternion );

				}

				if ( child.name === "Y" ) {

					quaternionY.setFromAxisAngle( unitY, Math.atan2( eye.x, eye.z ) );
					tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionY );
					child.quaternion.copy( tempQuaternion );

				}

				if ( child.name === "Z" ) {

					quaternionZ.setFromAxisAngle( unitZ, Math.atan2( eye.y, eye.x ) );
					tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionZ );
					child.quaternion.copy( tempQuaternion );

				}

			} );

		};

		this.init();

	};

	THREE.TransformGizmoRotate.prototype = Object.create( THREE.TransformGizmo.prototype );
	THREE.TransformGizmoRotate.prototype.constructor = THREE.TransformGizmoRotate;

	THREE.TransformGizmoScale = function () {

		THREE.TransformGizmo.call( this );

		var arrowGeometry = new THREE.Geometry();
		var mesh = new THREE.Mesh( new THREE.BoxGeometry( 0.125, 0.125, 0.125 ) );
		mesh.position.y = 0.5;
		mesh.updateMatrix();

		arrowGeometry.merge( mesh.geometry, mesh.matrix );

		var lineXGeometry = new THREE.BufferGeometry();
		lineXGeometry.addAttribute( 'position', new THREE.Float32Attribute( [ 0, 0, 0,  1, 0, 0 ], 3 ) );

		var lineYGeometry = new THREE.BufferGeometry();
		lineYGeometry.addAttribute( 'position', new THREE.Float32Attribute( [ 0, 0, 0,  0, 1, 0 ], 3 ) );

		var lineZGeometry = new THREE.BufferGeometry();
		lineZGeometry.addAttribute( 'position', new THREE.Float32Attribute( [ 0, 0, 0,  0, 0, 1 ], 3 ) );

		this.handleGizmos = {

			X: [
				[ new THREE.Mesh( arrowGeometry, new GizmoMaterial( { color: 0xff0000 } ) ), [ 0.5, 0, 0 ], [ 0, 0, - Math.PI / 2 ] ],
				[ new THREE.Line( lineXGeometry, new GizmoLineMaterial( { color: 0xff0000 } ) ) ]
			],

			Y: [
				[ new THREE.Mesh( arrowGeometry, new GizmoMaterial( { color: 0x00ff00 } ) ), [ 0, 0.5, 0 ] ],
				[ new THREE.Line( lineYGeometry, new GizmoLineMaterial( { color: 0x00ff00 } ) ) ]
			],

			Z: [
				[ new THREE.Mesh( arrowGeometry, new GizmoMaterial( { color: 0x0000ff } ) ), [ 0, 0, 0.5 ], [ Math.PI / 2, 0, 0 ] ],
				[ new THREE.Line( lineZGeometry, new GizmoLineMaterial( { color: 0x0000ff } ) ) ]
			],

			XYZ: [
				[ new THREE.Mesh( new THREE.BoxGeometry( 0.125, 0.125, 0.125 ), new GizmoMaterial( { color: 0xffffff, opacity: 0.25 } ) ) ]
			]

		};

		this.pickerGizmos = {

			X: [
				[ new THREE.Mesh( new THREE.CylinderGeometry( 0.2, 0, 1, 4, 1, false ), pickerMaterial ), [ 0.6, 0, 0 ], [ 0, 0, - Math.PI / 2 ] ]
			],

			Y: [
				[ new THREE.Mesh( new THREE.CylinderGeometry( 0.2, 0, 1, 4, 1, false ), pickerMaterial ), [ 0, 0.6, 0 ] ]
			],

			Z: [
				[ new THREE.Mesh( new THREE.CylinderGeometry( 0.2, 0, 1, 4, 1, false ), pickerMaterial ), [ 0, 0, 0.6 ], [ Math.PI / 2, 0, 0 ] ]
			],

			XYZ: [
				[ new THREE.Mesh( new THREE.BoxGeometry( 0.4, 0.4, 0.4 ), pickerMaterial ) ]
			]

		};

		this.setActivePlane = function ( axis, eye ) {

			var tempMatrix = new THREE.Matrix4();
			eye.applyMatrix4( tempMatrix.getInverse( tempMatrix.extractRotation( this.planes[ "XY" ].matrixWorld ) ) );

			if ( axis === "X" ) {

				this.activePlane = this.planes[ "XY" ];
				if ( Math.abs( eye.y ) > Math.abs( eye.z ) ) this.activePlane = this.planes[ "XZ" ];

			}

			if ( axis === "Y" ) {

				this.activePlane = this.planes[ "XY" ];
				if ( Math.abs( eye.x ) > Math.abs( eye.z ) ) this.activePlane = this.planes[ "YZ" ];

			}

			if ( axis === "Z" ) {

				this.activePlane = this.planes[ "XZ" ];
				if ( Math.abs( eye.x ) > Math.abs( eye.y ) ) this.activePlane = this.planes[ "YZ" ];

			}

			if ( axis === "XYZ" ) this.activePlane = this.planes[ "XYZE" ];

		};

		this.init();

	};

	THREE.TransformGizmoScale.prototype = Object.create( THREE.TransformGizmo.prototype );
	THREE.TransformGizmoScale.prototype.constructor = THREE.TransformGizmoScale;

	THREE.TransformControls = function ( camera, domElement ) {

		// TODO: Make non-uniform scale and rotate play nice in hierarchies
		// TODO: ADD RXYZ contol

		THREE.Object3D.call( this );

		domElement = ( domElement !== undefined ) ? domElement : document;

		this.object = undefined;
		this.visible = false;
		this.translationSnap = null;
		this.rotationSnap = null;
		this.space = "world";
		this.size = 1;
		this.axis = null;

		var scope = this;

		var _mode = "translate";
		var _dragging = false;
		var _plane = "XY";
		var _gizmo = {

			"translate": new THREE.TransformGizmoTranslate(),
			"rotate": new THREE.TransformGizmoRotate(),
			"scale": new THREE.TransformGizmoScale()
		};

		for ( var type in _gizmo ) {

			var gizmoObj = _gizmo[ type ];

			gizmoObj.visible = ( type === _mode );
			this.add( gizmoObj );

		}

		var changeEvent = { type: "change" };
		var mouseDownEvent = { type: "mouseDown" };
		var mouseUpEvent = { type: "mouseUp", mode: _mode };
		var objectChangeEvent = { type: "objectChange" };

		var ray = new THREE.Raycaster();
		var pointerVector = new THREE.Vector2();

		var point = new THREE.Vector3();
		var offset = new THREE.Vector3();

		var rotation = new THREE.Vector3();
		var offsetRotation = new THREE.Vector3();
		var scale = 1;

		var lookAtMatrix = new THREE.Matrix4();
		var eye = new THREE.Vector3();

		var tempMatrix = new THREE.Matrix4();
		var tempVector = new THREE.Vector3();
		var tempQuaternion = new THREE.Quaternion();
		var unitX = new THREE.Vector3( 1, 0, 0 );
		var unitY = new THREE.Vector3( 0, 1, 0 );
		var unitZ = new THREE.Vector3( 0, 0, 1 );

		var quaternionXYZ = new THREE.Quaternion();
		var quaternionX = new THREE.Quaternion();
		var quaternionY = new THREE.Quaternion();
		var quaternionZ = new THREE.Quaternion();
		var quaternionE = new THREE.Quaternion();

		var oldPosition = new THREE.Vector3();
		var oldScale = new THREE.Vector3();
		var oldRotationMatrix = new THREE.Matrix4();

		var parentRotationMatrix  = new THREE.Matrix4();
		var parentScale = new THREE.Vector3();

		var worldPosition = new THREE.Vector3();
		var worldRotation = new THREE.Euler();
		var worldRotationMatrix  = new THREE.Matrix4();
		var camPosition = new THREE.Vector3();
		var camRotation = new THREE.Euler();

		domElement.addEventListener( "mousedown", onPointerDown, false );
		domElement.addEventListener( "touchstart", onPointerDown, false );

		domElement.addEventListener( "mousemove", onPointerHover, false );
		domElement.addEventListener( "touchmove", onPointerHover, false );

		domElement.addEventListener( "mousemove", onPointerMove, false );
		domElement.addEventListener( "touchmove", onPointerMove, false );

		domElement.addEventListener( "mouseup", onPointerUp, false );
		domElement.addEventListener( "mouseout", onPointerUp, false );
		domElement.addEventListener( "touchend", onPointerUp, false );
		domElement.addEventListener( "touchcancel", onPointerUp, false );
		domElement.addEventListener( "touchleave", onPointerUp, false );

		this.dispose = function () {

			domElement.removeEventListener( "mousedown", onPointerDown );
			domElement.removeEventListener( "touchstart", onPointerDown );

			domElement.removeEventListener( "mousemove", onPointerHover );
			domElement.removeEventListener( "touchmove", onPointerHover );

			domElement.removeEventListener( "mousemove", onPointerMove );
			domElement.removeEventListener( "touchmove", onPointerMove );

			domElement.removeEventListener( "mouseup", onPointerUp );
			domElement.removeEventListener( "mouseout", onPointerUp );
			domElement.removeEventListener( "touchend", onPointerUp );
			domElement.removeEventListener( "touchcancel", onPointerUp );
			domElement.removeEventListener( "touchleave", onPointerUp );

		};

		this.attach = function ( object ) {

			this.object = object;
			this.visible = true;
			this.update();

		};

		this.detach = function () {

			this.object = undefined;
			this.visible = false;
			this.axis = null;

		};

		this.getMode = function () {

			return _mode;

		};

		this.setMode = function ( mode ) {

			_mode = mode ? mode : _mode;

			if ( _mode === "scale" ) scope.space = "local";

			for ( var type in _gizmo ) _gizmo[ type ].visible = ( type === _mode );

			this.update();
			scope.dispatchEvent( changeEvent );

		};

		this.setTranslationSnap = function ( translationSnap ) {

			scope.translationSnap = translationSnap;

		};

		this.setRotationSnap = function ( rotationSnap ) {

			scope.rotationSnap = rotationSnap;

		};

		this.setSize = function ( size ) {

			scope.size = size;
			this.update();
			scope.dispatchEvent( changeEvent );

		};

		this.setSpace = function ( space ) {

			scope.space = space;
			this.update();
			scope.dispatchEvent( changeEvent );

		};

		this.update = function () {

			if ( scope.object === undefined ) return;

			scope.object.updateMatrixWorld();
			worldPosition.setFromMatrixPosition( scope.object.matrixWorld );
			worldRotation.setFromRotationMatrix( tempMatrix.extractRotation( scope.object.matrixWorld ) );

			camera.updateMatrixWorld();
			camPosition.setFromMatrixPosition( camera.matrixWorld );
			camRotation.setFromRotationMatrix( tempMatrix.extractRotation( camera.matrixWorld ) );

			scale = worldPosition.distanceTo( camPosition ) / 6 * scope.size;
			this.position.copy( worldPosition );
			this.scale.set( scale, scale, scale );

			eye.copy( camPosition ).sub( worldPosition ).normalize();

			if ( scope.space === "local" ) {

				_gizmo[ _mode ].update( worldRotation, eye );

			} else if ( scope.space === "world" ) {

				_gizmo[ _mode ].update( new THREE.Euler(), eye );

			}

			_gizmo[ _mode ].highlight( scope.axis );

		};

		function onPointerHover( event ) {

			if ( scope.object === undefined || _dragging === true || ( event.button !== undefined && event.button !== 0 ) ) return;

			var pointer = event.changedTouches ? event.changedTouches[ 0 ] : event;

			var intersect = intersectObjects( pointer, _gizmo[ _mode ].pickers.children );

			var axis = null;

			if ( intersect ) {

				axis = intersect.object.name;

				event.preventDefault();

			}

			if ( scope.axis !== axis ) {

				scope.axis = axis;
				scope.update();
				scope.dispatchEvent( changeEvent );

			}

		}

		function onPointerDown( event ) {

			if ( scope.object === undefined || _dragging === true || ( event.button !== undefined && event.button !== 0 ) ) return;

			var pointer = event.changedTouches ? event.changedTouches[ 0 ] : event;

			if ( pointer.button === 0 || pointer.button === undefined ) {

				var intersect = intersectObjects( pointer, _gizmo[ _mode ].pickers.children );

				if ( intersect ) {

					event.preventDefault();
					event.stopPropagation();

					scope.dispatchEvent( mouseDownEvent );

					scope.axis = intersect.object.name;

					scope.update();

					eye.copy( camPosition ).sub( worldPosition ).normalize();

					_gizmo[ _mode ].setActivePlane( scope.axis, eye );

					var planeIntersect = intersectObjects( pointer, [ _gizmo[ _mode ].activePlane ] );

					if ( planeIntersect ) {

						oldPosition.copy( scope.object.position );
						oldScale.copy( scope.object.scale );

						oldRotationMatrix.extractRotation( scope.object.matrix );
						worldRotationMatrix.extractRotation( scope.object.matrixWorld );

						parentRotationMatrix.extractRotation( scope.object.parent.matrixWorld );
						parentScale.setFromMatrixScale( tempMatrix.getInverse( scope.object.parent.matrixWorld ) );

						offset.copy( planeIntersect.point );

					}

				}

			}

			_dragging = true;

		}

		function onPointerMove( event ) {

			if ( scope.object === undefined || scope.axis === null || _dragging === false || ( event.button !== undefined && event.button !== 0 ) ) return;

			var pointer = event.changedTouches ? event.changedTouches[ 0 ] : event;

			var planeIntersect = intersectObjects( pointer, [ _gizmo[ _mode ].activePlane ] );

			if ( planeIntersect === false ) return;

			event.preventDefault();
			event.stopPropagation();

			point.copy( planeIntersect.point );

			if ( _mode === "translate" ) {

				point.sub( offset );
				point.multiply( parentScale );

				if ( scope.space === "local" ) {

					point.applyMatrix4( tempMatrix.getInverse( worldRotationMatrix ) );

					if ( scope.axis.search( "X" ) === - 1 ) point.x = 0;
					if ( scope.axis.search( "Y" ) === - 1 ) point.y = 0;
					if ( scope.axis.search( "Z" ) === - 1 ) point.z = 0;

					point.applyMatrix4( oldRotationMatrix );

					scope.object.position.copy( oldPosition );
					scope.object.position.add( point );

				}

				if ( scope.space === "world" || scope.axis.search( "XYZ" ) !== - 1 ) {

					if ( scope.axis.search( "X" ) === - 1 ) point.x = 0;
					if ( scope.axis.search( "Y" ) === - 1 ) point.y = 0;
					if ( scope.axis.search( "Z" ) === - 1 ) point.z = 0;

					point.applyMatrix4( tempMatrix.getInverse( parentRotationMatrix ) );

					scope.object.position.copy( oldPosition );
					scope.object.position.add( point );

				}

				if ( scope.translationSnap !== null ) {

					if ( scope.space === "local" ) {

						scope.object.position.applyMatrix4( tempMatrix.getInverse( worldRotationMatrix ) );

					}

					if ( scope.axis.search( "X" ) !== - 1 ) scope.object.position.x = Math.round( scope.object.position.x / scope.translationSnap ) * scope.translationSnap;
					if ( scope.axis.search( "Y" ) !== - 1 ) scope.object.position.y = Math.round( scope.object.position.y / scope.translationSnap ) * scope.translationSnap;
					if ( scope.axis.search( "Z" ) !== - 1 ) scope.object.position.z = Math.round( scope.object.position.z / scope.translationSnap ) * scope.translationSnap;

					if ( scope.space === "local" ) {

						scope.object.position.applyMatrix4( worldRotationMatrix );

					}

				}

			} else if ( _mode === "scale" ) {

				point.sub( offset );
				point.multiply( parentScale );

				if ( scope.space === "local" ) {

					if ( scope.axis === "XYZ" ) {

						scale = 1 + ( ( point.y ) / 50 );

						scope.object.scale.x = oldScale.x * scale;
						scope.object.scale.y = oldScale.y * scale;
						scope.object.scale.z = oldScale.z * scale;

					} else {

						point.applyMatrix4( tempMatrix.getInverse( worldRotationMatrix ) );

						if ( scope.axis === "X" ) scope.object.scale.x = oldScale.x * ( 1 + point.x / 50 );
						if ( scope.axis === "Y" ) scope.object.scale.y = oldScale.y * ( 1 + point.y / 50 );
						if ( scope.axis === "Z" ) scope.object.scale.z = oldScale.z * ( 1 + point.z / 50 );

					}

				}

			} else if ( _mode === "rotate" ) {

				point.sub( worldPosition );
				point.multiply( parentScale );
				tempVector.copy( offset ).sub( worldPosition );
				tempVector.multiply( parentScale );

				if ( scope.axis === "E" ) {

					point.applyMatrix4( tempMatrix.getInverse( lookAtMatrix ) );
					tempVector.applyMatrix4( tempMatrix.getInverse( lookAtMatrix ) );

					rotation.set( Math.atan2( point.z, point.y ), Math.atan2( point.x, point.z ), Math.atan2( point.y, point.x ) );
					offsetRotation.set( Math.atan2( tempVector.z, tempVector.y ), Math.atan2( tempVector.x, tempVector.z ), Math.atan2( tempVector.y, tempVector.x ) );

					tempQuaternion.setFromRotationMatrix( tempMatrix.getInverse( parentRotationMatrix ) );

					quaternionE.setFromAxisAngle( eye, rotation.z - offsetRotation.z );
					quaternionXYZ.setFromRotationMatrix( worldRotationMatrix );

					tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionE );
					tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionXYZ );

					scope.object.quaternion.copy( tempQuaternion );

				} else if ( scope.axis === "XYZE" ) {

					quaternionE.setFromEuler( point.clone().cross( tempVector ).normalize() ); // rotation axis

					tempQuaternion.setFromRotationMatrix( tempMatrix.getInverse( parentRotationMatrix ) );
					quaternionX.setFromAxisAngle( quaternionE, - point.clone().angleTo( tempVector ) );
					quaternionXYZ.setFromRotationMatrix( worldRotationMatrix );

					tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionX );
					tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionXYZ );

					scope.object.quaternion.copy( tempQuaternion );

				} else if ( scope.space === "local" ) {

					point.applyMatrix4( tempMatrix.getInverse( worldRotationMatrix ) );

					tempVector.applyMatrix4( tempMatrix.getInverse( worldRotationMatrix ) );

					rotation.set( Math.atan2( point.z, point.y ), Math.atan2( point.x, point.z ), Math.atan2( point.y, point.x ) );
					offsetRotation.set( Math.atan2( tempVector.z, tempVector.y ), Math.atan2( tempVector.x, tempVector.z ), Math.atan2( tempVector.y, tempVector.x ) );

					quaternionXYZ.setFromRotationMatrix( oldRotationMatrix );

					if ( scope.rotationSnap !== null ) {

						quaternionX.setFromAxisAngle( unitX, Math.round( ( rotation.x - offsetRotation.x ) / scope.rotationSnap ) * scope.rotationSnap );
						quaternionY.setFromAxisAngle( unitY, Math.round( ( rotation.y - offsetRotation.y ) / scope.rotationSnap ) * scope.rotationSnap );
						quaternionZ.setFromAxisAngle( unitZ, Math.round( ( rotation.z - offsetRotation.z ) / scope.rotationSnap ) * scope.rotationSnap );

					} else {

						quaternionX.setFromAxisAngle( unitX, rotation.x - offsetRotation.x );
						quaternionY.setFromAxisAngle( unitY, rotation.y - offsetRotation.y );
						quaternionZ.setFromAxisAngle( unitZ, rotation.z - offsetRotation.z );

					}

					if ( scope.axis === "X" ) quaternionXYZ.multiplyQuaternions( quaternionXYZ, quaternionX );
					if ( scope.axis === "Y" ) quaternionXYZ.multiplyQuaternions( quaternionXYZ, quaternionY );
					if ( scope.axis === "Z" ) quaternionXYZ.multiplyQuaternions( quaternionXYZ, quaternionZ );

					scope.object.quaternion.copy( quaternionXYZ );

				} else if ( scope.space === "world" ) {

					rotation.set( Math.atan2( point.z, point.y ), Math.atan2( point.x, point.z ), Math.atan2( point.y, point.x ) );
					offsetRotation.set( Math.atan2( tempVector.z, tempVector.y ), Math.atan2( tempVector.x, tempVector.z ), Math.atan2( tempVector.y, tempVector.x ) );

					tempQuaternion.setFromRotationMatrix( tempMatrix.getInverse( parentRotationMatrix ) );

					if ( scope.rotationSnap !== null ) {

						quaternionX.setFromAxisAngle( unitX, Math.round( ( rotation.x - offsetRotation.x ) / scope.rotationSnap ) * scope.rotationSnap );
						quaternionY.setFromAxisAngle( unitY, Math.round( ( rotation.y - offsetRotation.y ) / scope.rotationSnap ) * scope.rotationSnap );
						quaternionZ.setFromAxisAngle( unitZ, Math.round( ( rotation.z - offsetRotation.z ) / scope.rotationSnap ) * scope.rotationSnap );

					} else {

						quaternionX.setFromAxisAngle( unitX, rotation.x - offsetRotation.x );
						quaternionY.setFromAxisAngle( unitY, rotation.y - offsetRotation.y );
						quaternionZ.setFromAxisAngle( unitZ, rotation.z - offsetRotation.z );

					}

					quaternionXYZ.setFromRotationMatrix( worldRotationMatrix );

					if ( scope.axis === "X" ) tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionX );
					if ( scope.axis === "Y" ) tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionY );
					if ( scope.axis === "Z" ) tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionZ );

					tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionXYZ );

					scope.object.quaternion.copy( tempQuaternion );

				}

			}

			scope.update();
			scope.dispatchEvent( changeEvent );
			scope.dispatchEvent( objectChangeEvent );

		}

		function onPointerUp( event ) {

			if ( event.button !== undefined && event.button !== 0 ) return;

			if ( _dragging && ( scope.axis !== null ) ) {

				mouseUpEvent.mode = _mode;
				scope.dispatchEvent( mouseUpEvent )

			}

			_dragging = false;
			onPointerHover( event );

		}

		function intersectObjects( pointer, objects ) {

			var rect = domElement.getBoundingClientRect();
			var x = ( pointer.clientX - rect.left ) / rect.width;
			var y = ( pointer.clientY - rect.top ) / rect.height;

			pointerVector.set( ( x * 2 ) - 1, - ( y * 2 ) + 1 );
			ray.setFromCamera( pointerVector, camera );

			var intersections = ray.intersectObjects( objects, true );
			return intersections[ 0 ] ? intersections[ 0 ] : false;

		}

	};

	THREE.TransformControls.prototype = Object.create( THREE.Object3D.prototype );
	THREE.TransformControls.prototype.constructor = THREE.TransformControls;

}() );

///<jscompress sourcefile="JsonEmpLoader.js" />
/*
Copyright (c) 2011 Juan Mellado

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
References:
- "LZMA SDK" by Igor Pavlov
  http://www.7-zip.org/sdk.html
*/

var LZMA = LZMA || {};

LZMA.OutWindow = function(){
  this._windowSize = 0;
};

LZMA.OutWindow.prototype.create = function(windowSize){
  if ( (!this._buffer) || (this._windowSize !== windowSize) ){
    this._buffer = [];
  }
  this._windowSize = windowSize;
  this._pos = 0;
  this._streamPos = 0;
};

LZMA.OutWindow.prototype.flush = function(){
  var size = this._pos - this._streamPos;
  if (size !== 0){
    while(size --){
      this._stream.writeByte(this._buffer[this._streamPos ++]);
    }
    if (this._pos >= this._windowSize){
      this._pos = 0;
    }
    this._streamPos = this._pos;
  }
};

LZMA.OutWindow.prototype.releaseStream = function(){
  this.flush();
  this._stream = null;
};

LZMA.OutWindow.prototype.setStream = function(stream){
  this.releaseStream();
  this._stream = stream;
};

LZMA.OutWindow.prototype.init = function(solid){
  if (!solid){
    this._streamPos = 0;
    this._pos = 0;
  }
};

LZMA.OutWindow.prototype.copyBlock = function(distance, len){
  var pos = this._pos - distance - 1;
  if (pos < 0){
    pos += this._windowSize;
  }
  while(len --){
    if (pos >= this._windowSize){
      pos = 0;
    }
    this._buffer[this._pos ++] = this._buffer[pos ++];
    if (this._pos >= this._windowSize){
      this.flush();
    }
  }
};

LZMA.OutWindow.prototype.putByte = function(b){
  this._buffer[this._pos ++] = b;
  if (this._pos >= this._windowSize){
    this.flush();
  }
};

LZMA.OutWindow.prototype.getByte = function(distance){
  var pos = this._pos - distance - 1;
  if (pos < 0){
    pos += this._windowSize;
  }
  return this._buffer[pos];
};

LZMA.RangeDecoder = function(){
};

LZMA.RangeDecoder.prototype.setStream = function(stream){
  this._stream = stream;
};

LZMA.RangeDecoder.prototype.releaseStream = function(){
  this._stream = null;
};

LZMA.RangeDecoder.prototype.init = function(){
  var i = 5;

  this._code = 0;
  this._range = -1;
  
  while(i --){
    this._code = (this._code << 8) | this._stream.readByte();
  }
};

LZMA.RangeDecoder.prototype.decodeDirectBits = function(numTotalBits){
  var result = 0, i = numTotalBits, t;

  while(i --){
    this._range >>>= 1;
    t = (this._code - this._range) >>> 31;
    this._code -= this._range & (t - 1);
    result = (result << 1) | (1 - t);

    if ( (this._range & 0xff000000) === 0){
      this._code = (this._code << 8) | this._stream.readByte();
      this._range <<= 8;
    }
  }

  return result;
};

LZMA.RangeDecoder.prototype.decodeBit = function(probs, index){
  var prob = probs[index],
      newBound = (this._range >>> 11) * prob;

  if ( (this._code ^ 0x80000000) < (newBound ^ 0x80000000) ){
    this._range = newBound;
    probs[index] += (2048 - prob) >>> 5;
    if ( (this._range & 0xff000000) === 0){
      this._code = (this._code << 8) | this._stream.readByte();
      this._range <<= 8;
    }
    return 0;
  }

  this._range -= newBound;
  this._code -= newBound;
  probs[index] -= prob >>> 5;
  if ( (this._range & 0xff000000) === 0){
    this._code = (this._code << 8) | this._stream.readByte();
    this._range <<= 8;
  }
  return 1;
};

LZMA.initBitModels = function(probs, len){
  while(len --){
    probs[len] = 1024;
  }
};

LZMA.BitTreeDecoder = function(numBitLevels){
  this._models = [];
  this._numBitLevels = numBitLevels;
};

LZMA.BitTreeDecoder.prototype.init = function(){
  LZMA.initBitModels(this._models, 1 << this._numBitLevels);
};

LZMA.BitTreeDecoder.prototype.decode = function(rangeDecoder){
  var m = 1, i = this._numBitLevels;

  while(i --){
    m = (m << 1) | rangeDecoder.decodeBit(this._models, m);
  }
  return m - (1 << this._numBitLevels);
};

LZMA.BitTreeDecoder.prototype.reverseDecode = function(rangeDecoder){
  var m = 1, symbol = 0, i = 0, bit;

  for (; i < this._numBitLevels; ++ i){
    bit = rangeDecoder.decodeBit(this._models, m);
    m = (m << 1) | bit;
    symbol |= bit << i;
  }
  return symbol;
};

LZMA.reverseDecode2 = function(models, startIndex, rangeDecoder, numBitLevels){
  var m = 1, symbol = 0, i = 0, bit;

  for (; i < numBitLevels; ++ i){
    bit = rangeDecoder.decodeBit(models, startIndex + m);
    m = (m << 1) | bit;
    symbol |= bit << i;
  }
  return symbol;
};

LZMA.LenDecoder = function(){
  this._choice = [];
  this._lowCoder = [];
  this._midCoder = [];
  this._highCoder = new LZMA.BitTreeDecoder(8);
  this._numPosStates = 0;
};

LZMA.LenDecoder.prototype.create = function(numPosStates){
  for (; this._numPosStates < numPosStates; ++ this._numPosStates){
    this._lowCoder[this._numPosStates] = new LZMA.BitTreeDecoder(3);
    this._midCoder[this._numPosStates] = new LZMA.BitTreeDecoder(3);
  }
};

LZMA.LenDecoder.prototype.init = function(){
  var i = this._numPosStates;
  LZMA.initBitModels(this._choice, 2);
  while(i --){
    this._lowCoder[i].init();
    this._midCoder[i].init();
  }
  this._highCoder.init();
};

LZMA.LenDecoder.prototype.decode = function(rangeDecoder, posState){
  if (rangeDecoder.decodeBit(this._choice, 0) === 0){
    return this._lowCoder[posState].decode(rangeDecoder);
  }
  if (rangeDecoder.decodeBit(this._choice, 1) === 0){
    return 8 + this._midCoder[posState].decode(rangeDecoder);
  }
  return 16 + this._highCoder.decode(rangeDecoder);
};

LZMA.Decoder2 = function(){
  this._decoders = [];
};

LZMA.Decoder2.prototype.init = function(){
  LZMA.initBitModels(this._decoders, 0x300);
};

LZMA.Decoder2.prototype.decodeNormal = function(rangeDecoder){
  var symbol = 1;

  do{
    symbol = (symbol << 1) | rangeDecoder.decodeBit(this._decoders, symbol);
  }while(symbol < 0x100);

  return symbol & 0xff;
};

LZMA.Decoder2.prototype.decodeWithMatchByte = function(rangeDecoder, matchByte){
  var symbol = 1, matchBit, bit;

  do{
    matchBit = (matchByte >> 7) & 1;
    matchByte <<= 1;
    bit = rangeDecoder.decodeBit(this._decoders, ( (1 + matchBit) << 8) + symbol);
    symbol = (symbol << 1) | bit;
    if (matchBit !== bit){
      while(symbol < 0x100){
        symbol = (symbol << 1) | rangeDecoder.decodeBit(this._decoders, symbol);
      }
      break;
    }
  }while(symbol < 0x100);

  return symbol & 0xff;
};

LZMA.LiteralDecoder = function(){
};

LZMA.LiteralDecoder.prototype.create = function(numPosBits, numPrevBits){
  var i;

  if (this._coders
    && (this._numPrevBits === numPrevBits)
    && (this._numPosBits === numPosBits) ){
    return;
  }
  this._numPosBits = numPosBits;
  this._posMask = (1 << numPosBits) - 1;
  this._numPrevBits = numPrevBits;

  this._coders = [];

  i = 1 << (this._numPrevBits + this._numPosBits);
  while(i --){
    this._coders[i] = new LZMA.Decoder2();
  }
};

LZMA.LiteralDecoder.prototype.init = function(){
  var i = 1 << (this._numPrevBits + this._numPosBits);
  while(i --){
    this._coders[i].init();
  }
};

LZMA.LiteralDecoder.prototype.getDecoder = function(pos, prevByte){
  return this._coders[( (pos & this._posMask) << this._numPrevBits)
    + ( (prevByte & 0xff) >>> (8 - this._numPrevBits) )];
};

LZMA.Decoder = function(){
  this._outWindow = new LZMA.OutWindow();
  this._rangeDecoder = new LZMA.RangeDecoder();
  this._isMatchDecoders = [];
  this._isRepDecoders = [];
  this._isRepG0Decoders = [];
  this._isRepG1Decoders = [];
  this._isRepG2Decoders = [];
  this._isRep0LongDecoders = [];
  this._posSlotDecoder = [];
  this._posDecoders = [];
  this._posAlignDecoder = new LZMA.BitTreeDecoder(4);
  this._lenDecoder = new LZMA.LenDecoder();
  this._repLenDecoder = new LZMA.LenDecoder();
  this._literalDecoder = new LZMA.LiteralDecoder();
  this._dictionarySize = -1;
  this._dictionarySizeCheck = -1;

  this._posSlotDecoder[0] = new LZMA.BitTreeDecoder(6);
  this._posSlotDecoder[1] = new LZMA.BitTreeDecoder(6);
  this._posSlotDecoder[2] = new LZMA.BitTreeDecoder(6);
  this._posSlotDecoder[3] = new LZMA.BitTreeDecoder(6);
};

LZMA.Decoder.prototype.setDictionarySize = function(dictionarySize){
  if (dictionarySize < 0){
    return false;
  }
  if (this._dictionarySize !== dictionarySize){
    this._dictionarySize = dictionarySize;
    this._dictionarySizeCheck = Math.max(this._dictionarySize, 1);
    this._outWindow.create( Math.max(this._dictionarySizeCheck, 4096) );
  }
  return true;
};

LZMA.Decoder.prototype.setLcLpPb = function(lc, lp, pb){
  var numPosStates = 1 << pb;

  if (lc > 8 || lp > 4 || pb > 4){
    return false;
  }

  this._literalDecoder.create(lp, lc);

  this._lenDecoder.create(numPosStates);
  this._repLenDecoder.create(numPosStates);
  this._posStateMask = numPosStates - 1;

  return true;
};

LZMA.Decoder.prototype.init = function(){
  var i = 4;

  this._outWindow.init(false);

  LZMA.initBitModels(this._isMatchDecoders, 192);
  LZMA.initBitModels(this._isRep0LongDecoders, 192);
  LZMA.initBitModels(this._isRepDecoders, 12);
  LZMA.initBitModels(this._isRepG0Decoders, 12);
  LZMA.initBitModels(this._isRepG1Decoders, 12);
  LZMA.initBitModels(this._isRepG2Decoders, 12);
  LZMA.initBitModels(this._posDecoders, 114);

  this._literalDecoder.init();

  while(i --){
    this._posSlotDecoder[i].init();
  }

  this._lenDecoder.init();
  this._repLenDecoder.init();
  this._posAlignDecoder.init();
  this._rangeDecoder.init();
};

LZMA.Decoder.prototype.decode = function(inStream, outStream, outSize){
  var state = 0, rep0 = 0, rep1 = 0, rep2 = 0, rep3 = 0, nowPos64 = 0, prevByte = 0,
      posState, decoder2, len, distance, posSlot, numDirectBits;

  this._rangeDecoder.setStream(inStream);
  this._outWindow.setStream(outStream);

  this.init();

  while(outSize < 0 || nowPos64 < outSize){
    posState = nowPos64 & this._posStateMask;

    if (this._rangeDecoder.decodeBit(this._isMatchDecoders, (state << 4) + posState) === 0){
      decoder2 = this._literalDecoder.getDecoder(nowPos64 ++, prevByte);

      if (state >= 7){
        prevByte = decoder2.decodeWithMatchByte(this._rangeDecoder, this._outWindow.getByte(rep0) );
      }else{
        prevByte = decoder2.decodeNormal(this._rangeDecoder);
      }
      this._outWindow.putByte(prevByte);

      state = state < 4? 0: state - (state < 10? 3: 6);

    }else{

      if (this._rangeDecoder.decodeBit(this._isRepDecoders, state) === 1){
        len = 0;
        if (this._rangeDecoder.decodeBit(this._isRepG0Decoders, state) === 0){
          if (this._rangeDecoder.decodeBit(this._isRep0LongDecoders, (state << 4) + posState) === 0){
            state = state < 7? 9: 11;
            len = 1;
          }
        }else{
          if (this._rangeDecoder.decodeBit(this._isRepG1Decoders, state) === 0){
            distance = rep1;
          }else{
            if (this._rangeDecoder.decodeBit(this._isRepG2Decoders, state) === 0){
              distance = rep2;
            }else{
              distance = rep3;
              rep3 = rep2;
            }
            rep2 = rep1;
          }
          rep1 = rep0;
          rep0 = distance;
        }
        if (len === 0){
          len = 2 + this._repLenDecoder.decode(this._rangeDecoder, posState);
          state = state < 7? 8: 11;
        }
      }else{
        rep3 = rep2;
        rep2 = rep1;
        rep1 = rep0;

        len = 2 + this._lenDecoder.decode(this._rangeDecoder, posState);
        state = state < 7? 7: 10;

        posSlot = this._posSlotDecoder[len <= 5? len - 2: 3].decode(this._rangeDecoder);
        if (posSlot >= 4){

          numDirectBits = (posSlot >> 1) - 1;
          rep0 = (2 | (posSlot & 1) ) << numDirectBits;

          if (posSlot < 14){
            rep0 += LZMA.reverseDecode2(this._posDecoders,
                rep0 - posSlot - 1, this._rangeDecoder, numDirectBits);
          }else{
            rep0 += this._rangeDecoder.decodeDirectBits(numDirectBits - 4) << 4;
            rep0 += this._posAlignDecoder.reverseDecode(this._rangeDecoder);
            if (rep0 < 0){
              if (rep0 === -1){
                break;
              }
              return false;
            }
          }
        }else{
          rep0 = posSlot;
        }
      }

      if (rep0 >= nowPos64 || rep0 >= this._dictionarySizeCheck){
        return false;
      }

      this._outWindow.copyBlock(rep0, len);
      nowPos64 += len;
      prevByte = this._outWindow.getByte(0);
    }
  }

  this._outWindow.flush();
  this._outWindow.releaseStream();
  this._rangeDecoder.releaseStream();

  return true;
};

LZMA.Decoder.prototype.setDecoderProperties = function(properties){
  var value, lc, lp, pb, dictionarySize;

  if (properties.size < 5){
    return false;
  }

  value = properties.readByte();
  lc = value % 9;
  value = ~~(value / 9);
  lp = value % 5;
  pb = ~~(value / 5);

  if ( !this.setLcLpPb(lc, lp, pb) ){
    return false;
  }

  dictionarySize = properties.readByte();
  dictionarySize |= properties.readByte() << 8;
  dictionarySize |= properties.readByte() << 16;
  dictionarySize += properties.readByte() * 16777216;

  return this.setDictionarySize(dictionarySize);
};

LZMA.decompress = function(properties, inStream, outStream, outSize){
  var decoder = new LZMA.Decoder();

  if ( !decoder.setDecoderProperties(properties) ){
    throw "Incorrect stream properties";
  }

  if ( !decoder.decode(inStream, outStream, outSize) ){
    throw "Error in data stream";
  }

  return true;
};

LZMA.decompressFile = function(inStream, outStream){
  var decoder = new LZMA.Decoder(), outSize;

  if ( !decoder.setDecoderProperties(inStream) ){
    throw "Incorrect stream properties";
  }

  outSize = inStream.readByte();
  outSize |= inStream.readByte() << 8;
  outSize |= inStream.readByte() << 16;
  outSize += inStream.readByte() * 16777216;

  inStream.readByte();
  inStream.readByte();
  inStream.readByte();
  inStream.readByte();
  
  if ( !decoder.decode(inStream, outStream, outSize) ){
    throw "Error in data stream";
  }

  return true;
};

/**
 * 	SEA3D LZMA
 * 	@author Sunag / http://www.sunag.com.br/
 */

 EMPLZMAUncompress = function( data ) {

	data = new Uint8Array( data );

	var inStream = {
		data: data,
		position: 0,
		readByte: function() {

			return this.data[ this.position ++ ];

		}
	}

	var outStream = {
		data: [],
		position: 0,
		writeByte: function( value ) {

			this.data[ this.position ++ ] = value;

		}
	}

	LZMA.decompressFile( inStream, outStream );

	return new Uint8Array( outStream.data ).buffer;

}





/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * modify from JSONLoader. by RutaoLyu 2016.04,18
 */

THREE.JsonEmpLoader = function ( manager ) {

	if ( typeof manager === 'boolean' ) {

		console.warn( 'THREE.JsonEmpLoader: showStatus parameter has been removed from constructor.' );
		manager = undefined;

	}

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

	this.withCredentials = false;

};

THREE.JsonEmpLoader.prototype = {

	constructor: THREE.JsonEmpLoader,

	// Deprecated

	get statusDomElement () {

		if ( this._statusDomElement === undefined ) {

			this._statusDomElement = document.createElement( 'div' );

		}

		console.warn( 'THREE.JsonEmpLoader: .statusDomElement has been removed.' );
		return this._statusDomElement;

	},

	load: function( url, onLoadMesh, onLoadCamera, onProgress, onError, onLoadEnd ) {

		var scope = this;

		var texturePath = this.texturePath && ( typeof this.texturePath === "string" ) ? this.texturePath : THREE.Loader.prototype.extractUrlBase( url );

		var loader = new THREE.XHRLoader( this.manager );
		loader.setWithCredentials( this.withCredentials );
		loader.load( url, function ( text ) {
			var json = JSON.parse( text );
			
			var zipUrl = texturePath + 'index.lz.js';
			//console.log( zipUrl );
			var Ziploader = new THREE.XHRLoader( this.manager );
			Ziploader.setWithCredentials( this.withCredentials );
			Ziploader.setPath( this.path );
			Ziploader.setResponseType( 'arraybuffer' );
			Ziploader.load( zipUrl, function ( buffer ) {				
				if( typeof json.guid !== 'undefined' )
				{
					for( key in json.guid )
					{
						var jsonModel = json.guid[key];

						//bin中读取数据并更晚上json
						var modelZipBuffer = new Uint8Array(buffer, jsonModel.l0, jsonModel.l1 );
						scope.convertBufferToJson(jsonModel, modelZipBuffer, texturePath);
						{
							var metadata = jsonModel.metadata;
							var object = scope.parse(jsonModel, texturePath );
							var wts = new THREE.Matrix4;
							if( !metadata.notOrth )
								wts.set( metadata.mat_wts[0],metadata.mat_wts[1],metadata.mat_wts[2],metadata.mat_wts[3],metadata.mat_wts[4],metadata.mat_wts[5],metadata.mat_wts[6],metadata.mat_wts[7],metadata.mat_wts[8],metadata.mat_wts[9],metadata.mat_wts[10],metadata.mat_wts[11],metadata.mat_wts[12],metadata.mat_wts[13],metadata.mat_wts[14],metadata.mat_wts[15]);
							//console.log( wts );
							var mesh = onLoadMesh( object.geometry, object.materials, wts);
							mesh.name = metadata.meshName;
							mesh.visible = metadata.visible; 
							//console.log("load function", mesh.name, key);
							mesh.uuid = key;
						}
					}
				}
				if( typeof json.guidCam !== 'undefined' )
				{
					//modelCount += json.guidCam.length; 
					for( key in json.guidCam )
					{
						var jsonCam = json.guidCam[key];
						//bin中读取数据并更晚上json
						if( jsonCam.metadata !== undefined && jsonCam.metadata.isAniCamera == false)
						{
							var metadata = jsonCam.metadata;
							var object = scope.parseCamera(jsonCam, texturePath );
							var camera = onLoadCamera( object );
							camera.name = metadata.name;
						}
						else 
						{
							var modelZipBuffer = new Uint8Array(buffer, jsonCam.l0, jsonCam.l1 );
							//console.log( "camera,modelZipBuffer ", modelZipBuffer);
							scope.convertBufferToJson(jsonCam,modelZipBuffer );
							{
								var metadata = jsonCam.metadata;
								var object = scope.parseCamera(jsonCam, texturePath );
								var camera = onLoadCamera( object );
								camera.name = metadata.name;
							}
						}
					}
				}
				
				//lrt add 进入这个函数后，都是串行的了
				if( typeof onLoadEnd == 'function' )
					onLoadEnd();

			} );//Ziploader.load::function
		}, onProgress, onError ); //loader.load
	},

	setTexturePath: function ( value ) {
		this.texturePath = value; 
	},
	
	convertBufferToJson: function( json, modelZipBuffer)
	{
		//LRT BUFFERIS LZMA COMPRESS
		var uncompressBuffer = EMPLZMAUncompress(modelZipBuffer);
		
		json.vertices = this._loadBinFileWithBuffer( json.vertices, uncompressBuffer, "float" );
		json.normals = this._loadBinFileWithBuffer( json.normals, uncompressBuffer, "float" );
		if( json.uvs !== undefined && json.uvs[0] !== undefined )
			json.uvs[0] = this._loadBinFileWithBuffer( json.uvs[0], uncompressBuffer, "float" );
		if( json.uvs !== undefined && json.uvs[1] !== undefined )
			json.uvs[1] = this._loadBinFileWithBuffer( json.uvs[1], uncompressBuffer, "float" );
		json.faces = this._loadBinFileWithBuffer( json.faces, uncompressBuffer, "int32");
		
		//animations的数据
		if( typeof json.animations !== "undefined" && typeof json.animations.tracks != "undefined")
		{
			
			for( keyIdx in json.animations.tracks )
			{
				var keys = json.animations.tracks[keyIdx];
				//console.log( keys.name );
				if( keys.type === "vector3" )
				{
					keys.keys = this._loadBinFileWithBuffer( keys.keys, uncompressBuffer, "timeVector3" );
				}
				else if( keys.type === "quaternion")
				{
					keys.keys = this._loadBinFileWithBuffer( keys.keys, uncompressBuffer, "timeQuaternion" );
				}
				else if(keys.type === "float")
				{
					keys.keys = this._loadBinFileWithBuffer( keys.keys, uncompressBuffer, "timefloat" );
				}
			}
		}
	},
	
	_loadBinFileWithBuffer: function( binJson, buffer, type)
	{
		if( binJson !== undefined && buffer !== undefined)
		{
			//console.log( binJson );
			if( binJson.offset !== undefined && binJson.length !== undefined && binJson.length > 0)
			{
				var bufJson,arrayJson = [];
				if( type == "float")
				{
					bufJson = new Float32Array(buffer,binJson.offset, binJson.length/4 );
					return bufJson;
				}	
				else if( type === "int32")
				{
					bufJson = new Int32Array(buffer,binJson.offset, binJson.length/4 );
					return bufJson;
				}	
				else if( type === "timeVector3")
				{
					//console.log( "_bufJson", buffer, binJson, "timeVector3");
					var _bufJson = new Float32Array(buffer,binJson.offset, binJson.length/4 );
					for( var i = 0; i< (binJson.length/4);  )
					{
						var obj= {"time":_bufJson[i],"value":[ _bufJson[i+1],_bufJson[i+2],_bufJson[i+3] ] };
						i = i+4;
						arrayJson.push( obj );
					}
					return arrayJson;
				}
				else if( type === "timeQuaternion")
				{
					var _bufJson = new Float32Array(buffer,binJson.offset, binJson.length/4 );
					for( var i = 0; i< (binJson.length/4);  )
					{
						var obj= {"time":_bufJson[i],"value":[ _bufJson[i+1],_bufJson[i+2],_bufJson[i+3],_bufJson[i+4] ] };
						i = i+5;
						arrayJson.push( obj );
					}
					return arrayJson;
				}
				else if( type === "timefloat")
				{
					var _bufJson = new Float32Array(buffer,binJson.offset, binJson.length/4 );
					for( var i = 0; i< (binJson.length/4);  )
					{
						var obj= {"time":_bufJson[i],"value":_bufJson[i+1]};
						i = i+2;
						arrayJson.push( obj );
					}
					return arrayJson;
				}	
				
			}
			//console.log( binJson );
		}
	},
	
	parseCamera: function ( json ) {

		return parseAnimations();

		function parseAnimations() {

			var outputAnimations = [];

			// parse old style Bone/Hierarchy animations
			var animations = [];

			if ( json.animation !== undefined ) {

				animations.push( json.animation );
			}

			if ( json.animations !== undefined ) {

				if ( json.animations.length ) {

					animations = animations.concat( json.animations );

				} else {

					animations.push( json.animations );

				}

			}
			//自己加一个相机刚体动画 lrt
			if ( animations ) {
				for ( var i = 0; i < animations.length; i ++ ) {
					var clip = THREE.AnimationClip.parse( animations[ i ] ); //参考ObjectLoader.js相关代码写的
					if ( clip ) outputAnimations.push( clip );
				}
			}

			//if ( outputAnimations.length > 0 ) geometry.animations = outputAnimations;
			return outputAnimations;
		};
	},
	
	parse: function ( json, texturePath ) {

		//console.log( 'parse', json);
		var geometry = new THREE.Geometry(),
		scale = ( json.scale !== undefined ) ? 1.0 / json.scale : 1.0;

		parseModel( scale );

		parseSkin();
		parseMorphing( scale );
		parseAnimations();

		geometry.computeFaceNormals();
		geometry.computeBoundingSphere();

		function parseModel( scale ) {

			function isBitSet( value, position ) {

				return value & ( 1 << position );

			}

			var i, j, fi,

			offset, zLength,

		colorIndex, normalIndex, uvIndex, materialIndex,

			type,
			isQuad,
			hasMaterial,
			hasFaceVertexUv,
			hasFaceNormal, hasFaceVertexNormal,
			hasFaceColor, hasFaceVertexColor,

		vertex, face, faceA, faceB, hex, normal,

			uvLayer, uv, u, v,

			faces = json.faces,
			vertices = json.vertices,
			normals = json.normals,
			colors = json.colors,

			nUvLayers = 0;

			if ( json.uvs !== undefined ) {

				// disregard empty arrays

				for ( i = 0; i < json.uvs.length; i ++ ) {

					if ( json.uvs[ i ].length ) nUvLayers ++;

				}
				for ( i = 0; i < nUvLayers; i ++ ) {

					geometry.faceVertexUvs[ i ] = [];

				}

			}

			offset = 0;
			zLength = vertices.length;

			while ( offset < zLength ) {

				vertex = new THREE.Vector3();

				vertex.x = vertices[ offset ++ ] * scale;
				vertex.y = vertices[ offset ++ ] * scale;
				vertex.z = vertices[ offset ++ ] * scale;

				geometry.vertices.push( vertex );

			}

			offset = 0;
			zLength = faces.length;

			while ( offset < zLength ) {

				type = faces[ offset ++ ];


				isQuad              = isBitSet( type, 0 );
				hasMaterial         = isBitSet( type, 1 );
				hasFaceVertexUv     = isBitSet( type, 3 );
				hasFaceNormal       = isBitSet( type, 4 );
				hasFaceVertexNormal = isBitSet( type, 5 );
				hasFaceColor	     = isBitSet( type, 6 );
				hasFaceVertexColor  = isBitSet( type, 7 );

				//console.log("faces type", type, isQuad, hasMaterial,  hasFaceVertexUv, hasFaceNormal, hasFaceVertexNormal, hasFaceColor, hasFaceVertexColor);
				if ( isQuad ) {

					faceA = new THREE.Face3();
					faceA.a = faces[ offset ];
					faceA.b = faces[ offset + 1 ];
					faceA.c = faces[ offset + 3 ];

					faceB = new THREE.Face3();
					faceB.a = faces[ offset + 1 ];
					faceB.b = faces[ offset + 2 ];
					faceB.c = faces[ offset + 3 ];

					offset += 4;

					if ( hasMaterial ) {

						materialIndex = faces[ offset ++ ];
						faceA.materialIndex = materialIndex;
						faceB.materialIndex = materialIndex;

					}

					// to get face <=> uv index correspondence

					fi = geometry.faces.length;

					if ( hasFaceVertexUv ) {

						for ( i = 0; i < nUvLayers; i ++ ) {

							uvLayer = json.uvs[ i ];

							geometry.faceVertexUvs[ i ][ fi ] = [];
							geometry.faceVertexUvs[ i ][ fi + 1 ] = [];

							for ( j = 0; j < 4; j ++ ) {

								uvIndex = faces[ offset ++ ];

								u = uvLayer[ uvIndex * 2 ];
								v = uvLayer[ uvIndex * 2 + 1 ];

								uv = new THREE.Vector2( u, v );

								if ( j !== 2 ) geometry.faceVertexUvs[ i ][ fi ].push( uv );
								if ( j !== 0 ) geometry.faceVertexUvs[ i ][ fi + 1 ].push( uv );

							}

						}

					}

					if ( hasFaceNormal ) {

						normalIndex = faces[ offset ++ ] * 3;

						faceA.normal.set(
							normals[ normalIndex ++ ],
							normals[ normalIndex ++ ],
							normals[ normalIndex ]
						);

						faceB.normal.copy( faceA.normal );

					}

					if ( hasFaceVertexNormal ) {

						for ( i = 0; i < 4; i ++ ) {

							normalIndex = faces[ offset ++ ] * 3;

							normal = new THREE.Vector3(
								normals[ normalIndex ++ ],
								normals[ normalIndex ++ ],
								normals[ normalIndex ]
							);


							if ( i !== 2 ) faceA.vertexNormals.push( normal );
							if ( i !== 0 ) faceB.vertexNormals.push( normal );

						}

					}


					if ( hasFaceColor ) {

						colorIndex = faces[ offset ++ ];
						hex = colors[ colorIndex ];

						faceA.color.setHex( hex );
						faceB.color.setHex( hex );

					}


					if ( hasFaceVertexColor ) {

						for ( i = 0; i < 4; i ++ ) {

							colorIndex = faces[ offset ++ ];
							hex = colors[ colorIndex ];

							if ( i !== 2 ) faceA.vertexColors.push( new THREE.Color( hex ) );
							if ( i !== 0 ) faceB.vertexColors.push( new THREE.Color( hex ) );

						}

					}

					geometry.faces.push( faceA );
					geometry.faces.push( faceB );

				} else {

					face = new THREE.Face3();
					face.a = faces[ offset ++ ];
					face.b = faces[ offset ++ ];
					face.c = faces[ offset ++ ];

					if ( hasMaterial ) {

						materialIndex = faces[ offset ++ ];
						face.materialIndex = materialIndex;

					}

					// to get face <=> uv index correspondence

					fi = geometry.faces.length;

					if ( hasFaceVertexUv ) {

						for ( i = 0; i < nUvLayers; i ++ ) {

							uvLayer = json.uvs[ i ];

							geometry.faceVertexUvs[ i ][ fi ] = [];

							for ( j = 0; j < 3; j ++ ) {

								uvIndex = faces[ offset ++ ];

								u = uvLayer[ uvIndex * 2 ];
								v = uvLayer[ uvIndex * 2 + 1 ];

								uv = new THREE.Vector2( u, v );

								geometry.faceVertexUvs[ i ][ fi ].push( uv );

							}

						}

					}

					if ( hasFaceNormal ) {

						normalIndex = faces[ offset ++ ] * 3;

						face.normal.set(
							normals[ normalIndex ++ ],
							normals[ normalIndex ++ ],
							normals[ normalIndex ]
						);

					}

					if ( hasFaceVertexNormal ) {

						for ( i = 0; i < 3; i ++ ) {

							normalIndex = faces[ offset ++ ] * 3;

							normal = new THREE.Vector3(
								normals[ normalIndex ++ ],
								normals[ normalIndex ++ ],
								normals[ normalIndex ]
							);

							face.vertexNormals.push( normal );

						}

					}


					if ( hasFaceColor ) {

						colorIndex = faces[ offset ++ ];
						face.color.setHex( colors[ colorIndex ] );

					}


					if ( hasFaceVertexColor ) {

						for ( i = 0; i < 3; i ++ ) {

							colorIndex = faces[ offset ++ ];
							face.vertexColors.push( new THREE.Color( colors[ colorIndex ] ) );

						}

					}

					geometry.faces.push( face );

				}

			}

		};

		function parseSkin() {

			var influencesPerVertex = ( json.influencesPerVertex !== undefined ) ? json.influencesPerVertex : 2;

			if ( json.skinWeights ) {

				for ( var i = 0, l = json.skinWeights.length; i < l; i += influencesPerVertex ) {

					var x =                               json.skinWeights[ i ];
					var y = ( influencesPerVertex > 1 ) ? json.skinWeights[ i + 1 ] : 0;
					var z = ( influencesPerVertex > 2 ) ? json.skinWeights[ i + 2 ] : 0;
					var w = ( influencesPerVertex > 3 ) ? json.skinWeights[ i + 3 ] : 0;

					geometry.skinWeights.push( new THREE.Vector4( x, y, z, w ) );

				}

			}

			if ( json.skinIndices ) {

				for ( var i = 0, l = json.skinIndices.length; i < l; i += influencesPerVertex ) {

					var a =                               json.skinIndices[ i ];
					var b = ( influencesPerVertex > 1 ) ? json.skinIndices[ i + 1 ] : 0;
					var c = ( influencesPerVertex > 2 ) ? json.skinIndices[ i + 2 ] : 0;
					var d = ( influencesPerVertex > 3 ) ? json.skinIndices[ i + 3 ] : 0;

					geometry.skinIndices.push( new THREE.Vector4( a, b, c, d ) );

				}

			}

			geometry.bones = json.bones;

			if ( geometry.bones && geometry.bones.length > 0 && ( geometry.skinWeights.length !== geometry.skinIndices.length || geometry.skinIndices.length !== geometry.vertices.length ) ) {

				console.warn( 'When skinning, number of vertices (' + geometry.vertices.length + '), skinIndices (' +
					geometry.skinIndices.length + '), and skinWeights (' + geometry.skinWeights.length + ') should match.' );

			}

		};

		function parseMorphing( scale ) {

			if ( json.morphTargets !== undefined ) {

				for ( var i = 0, l = json.morphTargets.length; i < l; i ++ ) {

					geometry.morphTargets[ i ] = {};
					geometry.morphTargets[ i ].name = json.morphTargets[ i ].name;
					geometry.morphTargets[ i ].vertices = [];

					var dstVertices = geometry.morphTargets[ i ].vertices;
					var srcVertices = json.morphTargets[ i ].vertices;

					for ( var v = 0, vl = srcVertices.length; v < vl; v += 3 ) {

						var vertex = new THREE.Vector3();
						vertex.x = srcVertices[ v ] * scale;
						vertex.y = srcVertices[ v + 1 ] * scale;
						vertex.z = srcVertices[ v + 2 ] * scale;

						dstVertices.push( vertex );

					}

				}

			}

			if ( json.morphColors !== undefined && json.morphColors.length > 0 ) {

				console.warn( 'THREE.JsonEmpLoader: "morphColors" no longer supported. Using them as face colors.' );

				var faces = geometry.faces;
				var morphColors = json.morphColors[ 0 ].colors;

				for ( var i = 0, l = faces.length; i < l; i ++ ) {

					faces[ i ].color.fromArray( morphColors, i * 3 );

				}

			}

		}

		function parseAnimations() {

			var outputAnimations = [];

			// parse old style Bone/Hierarchy animations
			var animations = [];

			if ( json.animation !== undefined ) {

				animations.push( json.animation );

			}

			if ( json.animations !== undefined ) {

				if ( json.animations.length ) {

					animations = animations.concat( json.animations );

				} else {

					animations.push( json.animations );

				}

			}

			//这个是骨骼动画 lrt
			if ( geometry.bones && geometry.bones.length > 0 ) //lrt 加个判断条件
			{
				for ( var i = 0; i < animations.length; i ++ ) {

					var clip = THREE.AnimationClip.parseAnimation( animations[ i ], geometry.bones );
					if ( clip ) outputAnimations.push( clip );

				}
			}

			//这个是柔体动画 lrt
			// parse implicit morph animations
			if ( geometry.morphTargets ) {

				// TODO: Figure out what an appropraite FPS is for morph target animations -- defaulting to 10, but really it is completely arbitrary.
				var morphAnimationClips = THREE.AnimationClip.CreateClipsFromMorphTargetSequences( geometry.morphTargets, 10 );
				outputAnimations = outputAnimations.concat( morphAnimationClips );

			}
			
			//自己加一个刚体动画 lrt
			if ( animations ) {
				for ( var i = 0; i < animations.length; i ++ ) {
					var clip = THREE.AnimationClip.parse( animations[ i ] ); //参考ObjectLoader.js相关代码写的
					
					if ( clip ) outputAnimations.push( clip );
				}
			}

			if ( outputAnimations.length > 0 ) geometry.animations = outputAnimations;

		};

		if ( json.materials === undefined || json.materials.length === 0 ) {

			return { geometry: geometry };

		} else {

			var materials = THREE.Loader.prototype.initMaterials( json.materials, texturePath, this.crossOrigin );

			return { geometry: geometry, materials: materials };

		}

	}

};
///<jscompress sourcefile="Tween.js" />
/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */

// Include a performance.now polyfill
(function () {

	if ('performance' in window === false) {
		window.performance = {};
	}

	// IE 8
	Date.now = (Date.now || function () {
		return new Date().getTime();
	});

	if ('now' in window.performance === false) {
		var offset = window.performance.timing && window.performance.timing.navigationStart ? window.performance.timing.navigationStart
		                                                                                    : Date.now();

		window.performance.now = function () {
			return Date.now() - offset;
		};
	}

})();

var TWEEN = TWEEN || (function () {

	var _tweens = [];

	return {

		getAll: function () {

			return _tweens;

		},

		removeAll: function () {

			_tweens = [];

		},

		add: function (tween) {

			_tweens.push(tween);

		},

		remove: function (tween) {

			var i = _tweens.indexOf(tween);

			if (i !== -1) {
				_tweens.splice(i, 1);
			}

		},

		update: function (time) {

			if (_tweens.length === 0) {
				return false;
			}

			var i = 0;

			time = time !== undefined ? time : window.performance.now();

			while (i < _tweens.length) {

				if (_tweens[i].update(time)) {
					i++;
				} else {
					_tweens.splice(i, 1);
				}

			}

			return true;

		}
	};

})();

TWEEN.Tween = function (object) {

	var _object = object;
	var _valuesStart = {};
	var _valuesEnd = {};
	var _valuesStartRepeat = {};
	var _duration = 1000;
	var _repeat = 0;
	var _yoyo = false;
	var _isPlaying = false;
	var _reversed = false;
	var _delayTime = 0;
	var _startTime = null;
	var _easingFunction = TWEEN.Easing.Linear.None;
	var _interpolationFunction = TWEEN.Interpolation.Linear;
	var _chainedTweens = [];
	var _onStartCallback = null;
	var _onStartCallbackFired = false;
	var _onUpdateCallback = null;
	var _onCompleteCallback = null;
	var _onStopCallback = null;

	// Set all starting values present on the target object
	for (var field in object) {
		_valuesStart[field] = parseFloat(object[field], 10);
	}

	this.to = function (properties, duration) {

		if (duration !== undefined) {
			_duration = duration;
		}

		_valuesEnd = properties;

		return this;

	};

	this.start = function (time) {

		TWEEN.add(this);

		_isPlaying = true;

		_onStartCallbackFired = false;

		_startTime = time !== undefined ? time : window.performance.now();
		_startTime += _delayTime;

		for (var property in _valuesEnd) {

			// Check if an Array was provided as property value
			if (_valuesEnd[property] instanceof Array) {

				if (_valuesEnd[property].length === 0) {
					continue;
				}

				// Create a local copy of the Array with the start value at the front
				_valuesEnd[property] = [_object[property]].concat(_valuesEnd[property]);

			}

			_valuesStart[property] = _object[property];

			if ((_valuesStart[property] instanceof Array) === false) {
				_valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
			}

			_valuesStartRepeat[property] = _valuesStart[property] || 0;

		}

		return this;

	};

	this.stop = function () {

		if (!_isPlaying) {
			return this;
		}

		TWEEN.remove(this);
		_isPlaying = false;

		if (_onStopCallback !== null) {
			_onStopCallback.call(_object);
		}

		this.stopChainedTweens();
		return this;

	};

	this.stopChainedTweens = function () {

		for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
			_chainedTweens[i].stop();
		}

	};

	this.delay = function (amount) {

		_delayTime = amount;
		return this;

	};

	this.repeat = function (times) {

		_repeat = times;
		return this;

	};

	this.yoyo = function (yoyo) {

		_yoyo = yoyo;
		return this;

	};


	this.easing = function (easing) {

		_easingFunction = easing;
		return this;

	};

	this.interpolation = function (interpolation) {

		_interpolationFunction = interpolation;
		return this;

	};

	this.chain = function () {

		_chainedTweens = arguments;
		return this;

	};

	this.onStart = function (callback) {

		_onStartCallback = callback;
		return this;

	};

	this.onUpdate = function (callback) {

		_onUpdateCallback = callback;
		return this;

	};

	this.onComplete = function (callback) {

		_onCompleteCallback = callback;
		return this;

	};

	this.onStop = function (callback) {

		_onStopCallback = callback;
		return this;

	};

	this.update = function (time) {

		var property;
		var elapsed;
		var value;

		if (time < _startTime) {
			return true;
		}

		if (_onStartCallbackFired === false) {

			if (_onStartCallback !== null) {
				_onStartCallback.call(_object);
			}

			_onStartCallbackFired = true;

		}

		elapsed = (time - _startTime) / _duration;
		elapsed = elapsed > 1 ? 1 : elapsed;

		value = _easingFunction(elapsed);

		for (property in _valuesEnd) {

			var start = _valuesStart[property] || 0;
			var end = _valuesEnd[property];

			if (end instanceof Array) {

				_object[property] = _interpolationFunction(end, value);

			} else {

				// Parses relative end values with start as base (e.g.: +10, -3)
				if (typeof (end) === 'string') {
					end = start + parseFloat(end, 10);
				}

				// Protect against non numeric properties.
				if (typeof (end) === 'number') {
					_object[property] = start + (end - start) * value;
				}

			}

		}

		if (_onUpdateCallback !== null) {
			_onUpdateCallback.call(_object, value);
		}

		if (elapsed === 1) {

			if (_repeat > 0) {

				if (isFinite(_repeat)) {
					_repeat--;
				}

				// Reassign starting values, restart by making startTime = now
				for (property in _valuesStartRepeat) {

					if (typeof (_valuesEnd[property]) === 'string') {
						_valuesStartRepeat[property] = _valuesStartRepeat[property] + parseFloat(_valuesEnd[property], 10);
					}

					if (_yoyo) {
						var tmp = _valuesStartRepeat[property];

						_valuesStartRepeat[property] = _valuesEnd[property];
						_valuesEnd[property] = tmp;
					}

					_valuesStart[property] = _valuesStartRepeat[property];

				}

				if (_yoyo) {
					_reversed = !_reversed;
				}

				_startTime = time + _delayTime;

				return true;

			} else {

				if (_onCompleteCallback !== null) {
					_onCompleteCallback.call(_object);
				}

				for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
					// Make the chained tweens start exactly at the time they should,
					// even if the `update()` method was called way past the duration of the tween
					_chainedTweens[i].start(_startTime + _duration);
				}

				return false;

			}

		}

		return true;

	};

};


TWEEN.Easing = {

	Linear: {

		None: function (k) {

			return k;

		}

	},

	Quadratic: {

		In: function (k) {

			return k * k;

		},

		Out: function (k) {

			return k * (2 - k);

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k;
			}

			return - 0.5 * (--k * (k - 2) - 1);

		}

	},

	Cubic: {

		In: function (k) {

			return k * k * k;

		},

		Out: function (k) {

			return --k * k * k + 1;

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k;
			}

			return 0.5 * ((k -= 2) * k * k + 2);

		}

	},

	Quartic: {

		In: function (k) {

			return k * k * k * k;

		},

		Out: function (k) {

			return 1 - (--k * k * k * k);

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k;
			}

			return - 0.5 * ((k -= 2) * k * k * k - 2);

		}

	},

	Quintic: {

		In: function (k) {

			return k * k * k * k * k;

		},

		Out: function (k) {

			return --k * k * k * k * k + 1;

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k * k;
			}

			return 0.5 * ((k -= 2) * k * k * k * k + 2);

		}

	},

	Sinusoidal: {

		In: function (k) {

			return 1 - Math.cos(k * Math.PI / 2);

		},

		Out: function (k) {

			return Math.sin(k * Math.PI / 2);

		},

		InOut: function (k) {

			return 0.5 * (1 - Math.cos(Math.PI * k));

		}

	},

	Exponential: {

		In: function (k) {

			return k === 0 ? 0 : Math.pow(1024, k - 1);

		},

		Out: function (k) {

			return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k);

		},

		InOut: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			if ((k *= 2) < 1) {
				return 0.5 * Math.pow(1024, k - 1);
			}

			return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2);

		}

	},

	Circular: {

		In: function (k) {

			return 1 - Math.sqrt(1 - k * k);

		},

		Out: function (k) {

			return Math.sqrt(1 - (--k * k));

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return - 0.5 * (Math.sqrt(1 - k * k) - 1);
			}

			return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);

		}

	},

	Elastic: {

		In: function (k) {

			var s;
			var a = 0.1;
			var p = 0.4;

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			if (!a || a < 1) {
				a = 1;
				s = p / 4;
			} else {
				s = p * Math.asin(1 / a) / (2 * Math.PI);
			}

			return - (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));

		},

		Out: function (k) {

			var s;
			var a = 0.1;
			var p = 0.4;

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			if (!a || a < 1) {
				a = 1;
				s = p / 4;
			} else {
				s = p * Math.asin(1 / a) / (2 * Math.PI);
			}

			return (a * Math.pow(2, - 10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1);

		},

		InOut: function (k) {

			var s;
			var a = 0.1;
			var p = 0.4;

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			if (!a || a < 1) {
				a = 1;
				s = p / 4;
			} else {
				s = p * Math.asin(1 / a) / (2 * Math.PI);
			}

			if ((k *= 2) < 1) {
				return - 0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
			}

			return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;

		}

	},

	Back: {

		In: function (k) {

			var s = 1.70158;

			return k * k * ((s + 1) * k - s);

		},

		Out: function (k) {

			var s = 1.70158;

			return --k * k * ((s + 1) * k + s) + 1;

		},

		InOut: function (k) {

			var s = 1.70158 * 1.525;

			if ((k *= 2) < 1) {
				return 0.5 * (k * k * ((s + 1) * k - s));
			}

			return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);

		}

	},

	Bounce: {

		In: function (k) {

			return 1 - TWEEN.Easing.Bounce.Out(1 - k);

		},

		Out: function (k) {

			if (k < (1 / 2.75)) {
				return 7.5625 * k * k;
			} else if (k < (2 / 2.75)) {
				return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
			} else if (k < (2.5 / 2.75)) {
				return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
			} else {
				return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
			}

		},

		InOut: function (k) {

			if (k < 0.5) {
				return TWEEN.Easing.Bounce.In(k * 2) * 0.5;
			}

			return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;

		}

	}

};

TWEEN.Interpolation = {

	Linear: function (v, k) {

		var m = v.length - 1;
		var f = m * k;
		var i = Math.floor(f);
		var fn = TWEEN.Interpolation.Utils.Linear;

		if (k < 0) {
			return fn(v[0], v[1], f);
		}

		if (k > 1) {
			return fn(v[m], v[m - 1], m - f);
		}

		return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);

	},

	Bezier: function (v, k) {

		var b = 0;
		var n = v.length - 1;
		var pw = Math.pow;
		var bn = TWEEN.Interpolation.Utils.Bernstein;

		for (var i = 0; i <= n; i++) {
			b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
		}

		return b;

	},

	CatmullRom: function (v, k) {

		var m = v.length - 1;
		var f = m * k;
		var i = Math.floor(f);
		var fn = TWEEN.Interpolation.Utils.CatmullRom;

		if (v[0] === v[m]) {

			if (k < 0) {
				i = Math.floor(f = m * (1 + k));
			}

			return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);

		} else {

			if (k < 0) {
				return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
			}

			if (k > 1) {
				return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
			}

			return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);

		}

	},

	Utils: {

		Linear: function (p0, p1, t) {

			return (p1 - p0) * t + p0;

		},

		Bernstein: function (n, i) {

			var fc = TWEEN.Interpolation.Utils.Factorial;

			return fc(n) / fc(i) / fc(n - i);

		},

		Factorial: (function () {

			var a = [1];

			return function (n) {

				var s = 1;

				if (a[n]) {
					return a[n];
				}

				for (var i = n; i > 1; i--) {
					s *= i;
				}

				a[n] = s;
				return s;

			};

		})(),

		CatmullRom: function (p0, p1, p2, p3, t) {

			var v0 = (p2 - p0) * 0.5;
			var v1 = (p3 - p1) * 0.5;
			var t2 = t * t;
			var t3 = t * t2;

			return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (- 3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;

		}

	}

};

// UMD (Universal Module Definition)
(function (root) {

	if (typeof define === 'function' && define.amd) {

		// AMD
		define([], function () {
			return TWEEN;
		});

	} else if (typeof exports === 'object') {

		// Node.js
		module.exports = TWEEN;

	} else if (root !== undefined) {

		// Global variable
		root.TWEEN = TWEEN;

	}

})(this);

///<jscompress sourcefile="empBuilder.js" />
var scene3D = [];
var scene3DFunction = [];

EmpScene = function() {
    this.name = 'empscene';
    this.renderer = null;
    this.container = null;
    this.camera = null;
    this.controls = null;
    this.scene = null;
    this.valid = false;
    this.grid = null;
    this.stats = null;
    this.sceneBoundingBox = new THREE.Box3();
    this.sceneBoundingBox.makeEmpty();
	this.clearColor = 0x3a6ea5;
	this.clearAlpha = 1.0;
	this.selected = null;
	this.raycaster = new THREE.Raycaster();
	this.actived = false;
	this.autoCamClip = false; //自动相机裁剪
	
	this.sceneHelpers = null;
	this.showAxisFlag = false;
	this.showGridFlag = false;
	this.showSkyboxFlag = false;
	
	this.skyboxScene = null;
	this.skyboxTexture = null;
	this.skyboxMesh = null;
    this.skyboxCamera = null;

    //this.helpers = {};
	this.mixer = null;
	this.clock = null;
	
    //this.models = [];
	this.group = {};
	this.bindingDomUI = [];
	this.cameras = [];
};

EmpScene.prototype = {
    constructor: EmpScene,
	
	setScene: function ( scene ) {

		this.scene.uuid = scene.uuid;
		this.scene.name = scene.name;
		this.scene.userData = JSON.parse( JSON.stringify( scene.userData ) );

		// avoid render per object

		//this.signals.sceneGraphChanged.active = false;

		while ( scene.children.length > 0 ) {

			this.addObject( scene.children[ 0 ] );

		}

		//this.signals.sceneGraphChanged.active = true;
		//this.signals.sceneGraphChanged.dispatch();

	},
	select: function ( object ) {

		if ( this.selected === object ) return;

		var uuid = null;

		if ( object !== null ) {

			uuid = object.uuid;

		}

		this.selected = object;

		//this.config.setKey( 'selected', uuid );
		//this.signals.objectSelected.dispatch( object );

	},

	selectById: function ( id ) {

		if ( id === this.camera.id ) {

			this.select( this.camera );
			return;

		}

		this.select( this.scene.getObjectById( id, true ) );

	},

	selectByUuid: function ( uuid ) {

		var scope = this;

		this.scene.traverse( function ( child ) {

			if ( child.uuid === uuid ) {

				scope.select( child );

			}

		} );

	},

	deselect: function () {

		this.select( null );

	},
		
	findObjectByName: function( name ) 
	{
		//console.log( 'findObjectByName', name );
		if( !this.scene )
            return null;
        for(var key in  this.scene.children )
        {
            var obj = this.scene.children[key];
			if( obj.name == name )
				return obj;
		}
		return null;
	},
	
	findObjectByUUID: function( UUID ) 
	{
		if( !this.scene )
            return null;
        for(var key in  this.scene.children )
        {
            var obj = this.scene.children[key];
			if( obj.uuid == UUID )
				return obj;
		}
		return null;
	},
	
	removeObjectByName:function( name )
	{
		var obj = this.findObjectByName(name );
		if( obj )
			obj.parent.remove( obj );
	},

	addObject: function ( object ) {

		var scope = this;

		if( this.findObjectByName( object.name ) ) //如果已经存在同名的文件，则不添加
		{
			//console.log('addObject, name already exists', object.name);
		}
		else 
			this.scene.add( object );
	},
	
	addHelper: function () {

			var bbox = new THREE.BoxHelper( );
			bbox.material.depthTest = false;
			bbox.material.transparent = true;
			bbox.name = "EMPBOX";
			bbox.visible = false;
			//console.log( this.sceneHelpers );
			this.sceneHelpers.add( bbox );
			
			var gridHelper = new THREE.GridHelper( 1000, 10 );
			gridHelper.name = "EMPGROUND";
			gridHelper.visible = false;
			this.sceneHelpers.add( gridHelper );
			
			var axisHelper = new THREE.AxisHelper( 500 );
			axisHelper.name = 'EMPAXIS';
			axisHelper.visible = false;
			this.sceneHelpers.add( axisHelper );

			this.skyboxCamera = new THREE.PerspectiveCamera( 70,  this.container.offsetWidth / this.container.offsetHeight, 1, 100000 );
			// Skybox
			
				var r = "empcommon/emp/c_";
				var urls = [ r + "RT.jpg", r + "LF.jpg",
							 r + "UP.jpg", r + "DN.jpg",
							 r + "BK.jpg", r + "FR.jpg" ];
				this.skyboxTexture = new THREE.CubeTextureLoader().load( urls );
				this.skyboxTexture.format = THREE.RGBFormat;
				this.skyboxTexture.mapping = THREE.CubeReflectionMapping;
				
				var cubeShader = THREE.ShaderLib[ "cube" ];
				var cubeMaterial = new THREE.ShaderMaterial( {
					fragmentShader: cubeShader.fragmentShader,
					vertexShader: cubeShader.vertexShader,
					uniforms: cubeShader.uniforms,
					depthWrite: false,
					side: THREE.BackSide
				} );
				cubeMaterial.uniforms[ "tCube" ].value = this.skyboxTexture;
				this.skyboxMesh = new THREE.Mesh( new THREE.BoxGeometry( 1000, 1000, 1000 ), cubeMaterial );
				this.skyboxScene.add( this.skyboxMesh );
			//this.signals.helperAdded.dispatch( helper );
	},
	
	showAxis: function(flag)
	{
		this.showAxisFlag = flag;
		for(var key in  this.sceneHelpers.children )
        {
            var obj = this.sceneHelpers.children[key];
			if( obj.name == 'EMPAXIS' )
				obj.visible = this.showAxisFlag;
		}
	},
	
	showGround: function(flag)
	{
		this.showGridFlag = flag;
		for(var key in  this.sceneHelpers.children )
        {
            var obj = this.sceneHelpers.children[key];
			if( obj.name == 'EMPGROUND' )
				obj.visible = this.showGridFlag;
		}
	},
	
	showSkybox: function(flag)
	{
		this.showSkyboxFlag = flag;
		this.skyboxMesh.visible = this.showSkyboxFlag;
	},
	
	setClearColor: function(color, alpha)
	{
		if( typeof color !== 'undefined')
			this.clearColor = color;
		if( typeof alpha !== 'undefined')
			this.clearAlpha = alpha;
		
		this.renderer.setClearColor( this.clearColor, this.clearAlpha);
	},
	
	setControlType: function(typeControl) {
		var _typeControl = typeControl;
		if( _typeControl == undefined )
			_typeControl = 'orbit';
		
		if( _typeControl == "orbit")
		{
			this.controls = new THREE.OrbitControls(this.camera, this.container);
			this.controls.enableDamping = true;
			this.controls.dampingFactor = 0.1;
			this.controls.enableZoom = true;
			this.controls.rotateSpeed = 0.1;
		}
		else if( _typeControl == "fly")
		{
			this.controls = new THREE.FlyControls(this.camera, this.container);
			this.controls.movementSpeed = 1000; 
			this.controls.rollSpeed = Math.PI / 24;
			this.controls.autoForward = false;
			this.controls.dragToLook = false;
		}
		else if( _typeControl == "trackball")
		{
			this.controls = new THREE.TrackballControls(this.camera, this.container);
		}
		
		if( isBuilderMode )
			this.controls.enabled = false;
	},
	
    /*
	getObjs: function() {
        //var ret = "";
        if( !this.scene )
            return ;
        for(var key in  this.scene.children )
        {
            var obj = this.scene.children[key];
            //ret += key + ":" + obj.name + '; type:' +  obj.type + '; uuid:' +obj.uuid + " ";
			//console.log(ret);

            if( obj.type == "Mesh" )
            {
                this.modelsmodels[obj.uuid] = obj;
                this.models[obj.material.uuid] = obj.material;
                //obj.material.uuid = '123456-123456-123456-123456';
            }
            else
            {
                this.models[obj.uuid] = obj;
            }
        }
       //console.log(this.models);
    },
	*/

	clearScene: function () {

		this.camera.position.set( 500, 250, 500 );
		this.camera.lookAt( new THREE.Vector3() );

		var objects = this.scene.children;

		while ( objects.length > 0 ) {

			this.removeObject( objects[ 0 ] );

		}

		this.geometries = {};
		this.materials = {};
		this.textures = {};
		this.scripts = {};

		this.deselect();

		//this.signals.editorCleared.dispatch();

	},
	removeHelper: function ( object ) {

		/*if ( this.helpers[ object.id ] !== undefined ) {

			var helper = this.helpers[ object.id ];
			helper.parent.remove( helper );

			delete this.helpers[ object.id ];

			//this.signals.helperRemoved.dispatch( helper );

		}*/

	},
	removeObject: function ( object ) {

		if ( object.parent === undefined ) return; // avoid deleting the camera or scene

		var scope = this;

		object.traverse( function ( child ) {

			scope.removeHelper( child );

		} );

		object.parent.remove( object );

		//this.signals.objectRemoved.dispatch( object );
		//this.signals.sceneGraphChanged.dispatch();

	},
	getElapsedTime:function() {
		
		if( this.clock )
			return this.clock.getElapsedTime();
		
		return 0;
	},

    initScene: function(divID, typeControl) {
		
		
        this.valid = false;
        this.container = document.getElementById(divID);
        if (!this.container)
            return null;

		this.clock = new THREE.Clock();
		
        this.scene = new THREE.Scene();
		
		this.sceneHelpers = new THREE.Scene();
		this.skyboxScene = new THREE.Scene();
		this.addHelper();
		
        this.camera = new THREE.PerspectiveCamera(50, this.container.offsetWidth / this.container.offsetHeight, 0.1, 10000);
		
        this.createRender(true);
		
        //this.animate();
		
		var scoptinit = this;
		
		function onPickTest(event) 
		{
			event.preventDefault();

			var mouse = new THREE.Vector2();
			//var rect = scoptinit.container.getBoundingClientRect();
			//var x = ( event.pageX  - rect.left ) / rect.width;
			//var y = ( event.pageY - rect.top ) / rect.height;
			
			var _bHasTouches = !!event.touches;
			var xx = _bHasTouches?(event.touches[0].pageX / EmpGlobalZoom - EmpGlobalLeft - event.currentTarget.offsetLeft): (event.offsetX/ EmpGlobalZoom);
			var yy = _bHasTouches?(event.touches[0].pageY / EmpGlobalZoom - EmpGlobalTop - event.currentTarget.offsetTop): (event.offsetY/ EmpGlobalZoom);
			xx =  xx / event.currentTarget.clientWidth;
			yy = yy / event.currentTarget.clientHeight;

			mouse.x = xx*2 -1;
			mouse.y = 1-2*yy;
						
			scoptinit.raycaster.setFromCamera( mouse, scoptinit.camera );

			var intersects = scoptinit.raycaster.intersectObjects( scoptinit.scene.children );

			if ( intersects.length > 0 ) 
			{
				var obj = intersects[ 0 ].object;
				if( obj && obj.type == "Mesh")
				{
					if( event.type == "mouseup" || event.type == "touchend")
					{
						if( typeof(scene3DFunction[obj.name+'_up']) == 'function' )
							scene3DFunction[obj.name+'_up']();
					}
					else if( event.type == "mousedown" || event.type == "touchstart")
					{
						if( typeof(scene3DFunction[obj.name+'_down']) == 'function' )
							scene3DFunction[obj.name+'_down']();
					}
				}
			}
		};
		this.container.addEventListener( 'mousedown', onPickTest, false );
		this.container.addEventListener( 'mouseup',  onPickTest, false );
		this.container.addEventListener( 'touchstart',  onPickTest, false );
		this.container.addEventListener( 'touchend',  onPickTest, false );
    },
	
    createRender: function(antialias) {
        var renderer = new THREE.WebGLRenderer({antialias: antialias, alpha: true});
        renderer.setClearColor(this.clearColor, this.clearAlpha); //setClearColor( 0xff0000, 0 );
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.autoClear = false;
        renderer.autoUpdateScene = false;
        renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);

        this.container.appendChild(renderer.domElement);
        // window.addEventListener('resize', dom3dReszie);
        this.renderer =  renderer;
    },

    createStat: function() {
        var stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        this.container.appendChild(stats.domElement);
        this.stats = stats;
    },
	
	getMaterialByObjName:function( objName)
	{
		var obj = this.findObjectByName( objName );
		if( obj )
		{
			if( obj.type == "Mesh" )
            {
                return obj.material;
			}
		}
		return null;
	},

	setMaterialByObjName:function( objName, material)
	{
		var obj = this.findObjectByName( objName );
		if( obj )
		{
			if( obj.type == "Mesh" )
            {
                obj.material = material;
			}
			else 
			{
				console.log('obj not mesh', objName);
			}
		}
		else
		{
			console.log('obj not found', objName);
		}
	},
	
	showModelByName:function( modelName, showflag)
	{		
		for(var key in  this.scene.children )
        {
            var obj = this.scene.children[key];
            if( obj.type == "Mesh" && (modelName == obj.name || modelName == 'EMPALLMODEL')   )
            {
				obj.visible = showflag;
            }
        }
	},
	
	showGroupByName:function( groupName, showflag)
	{		
		for(var key in this.group[groupName] )
        {
            var obj = this.group[groupName][key];
            if( obj.type == "Mesh"   )
            {
				obj.visible = showflag;
            }
        }
	},
	
	getGroupBoundingBox:function(groupName)
	{
		var bb2 = new THREE.Box3();
		bb2.makeEmpty();
		for(var key in this.group[groupName] )
        {
            var obj = this.group[groupName][key];
            if( obj.type == "Mesh"   )
            {
				var bb = obj.geometry.boundingBox;
				bb2.expandByPoint( bb.min );
				bb2.expandByPoint( bb.max );
            }
        }
		return bb2;
	},
	
	//params :{computNormal:true, autoPlay:true, autoLookAtCenter:true}
	loadEmpObjs: function(objJsonFile, groupName, PrefixName, params, onEmpResLoadEnd) {

		var autoLookAtCenter = true;
		if(  typeof params !== 'undefined' && typeof params.autoLookAtCenter != 'undefined' )
			autoLookAtCenter = params.autoLookAtCenter;
		//console.log( autoLookAtCenter );
		var scope = this;
		var loader = new THREE.JsonEmpLoader();
		var subgroup = [];
		this.group[groupName] = subgroup;
		var endcount = 0, modelCount = 0;
		loader.load( objJsonFile, function( geometry, materials, wts) { return createEmpModel( geometry, materials[0],  wts);},
				createEmpCamera, undefined, undefined ,onEmpResLoadEnd		);
		/*
		indexLoader.load( objJsonFile,  function( jsonData ) { 
			if( typeof jsonData.guidCam !== 'undefined' )
			{
				for( var i =0 ; i < jsonData.guidCam.length; ++i)
				{
					var key = jsonData.guidCam[i];
					var modelstr = objJsonFile.replace("index.js", key+".js");
					cameraLoader.load( modelstr,  createEmpCamera );				
				}
			}
			if( typeof jsonData.guid !== 'undefined' )
			{
				modelCount = jsonData.guid.length;
				for( var i = 0; i< jsonData.guid.length; ++i )
				{
					var key = jsonData.guid[i];
					var modelstr = objJsonFile.replace("index.js", key+".js");
					loader.load( modelstr,  function( geometry, materials, wts) { createEmpModel( geometry, materials[0],  wts)}   );
				}
			}
		} );
		*/
		
		function createEmpCamera( animations )
		{
			var camera = new THREE.PerspectiveCamera(50, scope.container.offsetWidth / scope.container.offsetHeight, 0.1, 10000);
			if( animations !== undefined  && animations.length >= 1 )
			{
				camera.animations = animations;
				//console.log( animations );
			}	
			scope.cameras.push( camera );
			
			return camera;
		}
		
		function createEmpModel( geometry, material, wts) {
			if( typeof params !== 'undefined' && !!params.computNormal )
			{
				geometry.computeFaceNormals ();
				geometry.computeVertexNormals ();
			}	
			//material.side = THREE.DoubleSide;
			mesh1 = new THREE.Mesh( geometry, material );
			if( !PrefixName )
				PrefixName = '';
			mesh1.name = PrefixName + geometry.name;
			mesh1.visible = geometry.visible;
			mesh1.applyMatrix( wts );
			mesh1.updateMatrixWorld(true);
			geometry.computeBoundingBox();
			var bb =  new THREE.Box3();
			bb.copy( geometry.boundingBox );
			bb.applyMatrix4( mesh1.matrixWorld );
			//console.log( mesh1.matrixWorld );
			scope.sceneBoundingBox.expandByPoint( bb.min );
			scope.sceneBoundingBox.expandByPoint( bb.max );

			var bbspere = scope.sceneBoundingBox.getBoundingSphere(); //sceneBoundingBox.getBoundingSphere();
			var bbcenter = scope.sceneBoundingBox.center();
			var boxlen = bbspere.radius;

			/*
			if( autoLookAtCenter )
			{
				scope.camera.lookAt(bbcenter);
				scope.controls.target.copy( bbcenter );
			}
			*/
			
			scope.scene.add( mesh1 );
			subgroup.push( mesh1 );
			
			//if( params.initHide )
			//	mesh1.visible = !params.initHide;
			
			if( typeof params !== 'undefined' && !!params.autoPlay )
			{
				if( !scope.mixer )
				{
					scope.mixer = new THREE.AnimationMixer( scope.scene );
				}	
		
				if( geometry.animations)
				{
					scope.mixer.clipAction( geometry.animations[0], mesh1 )
						.setDuration( geometry.animations[0].duration * 30 )
						.startAt( 0 )	
						//.setLoop( THREE.LOOPONCE, 1)
						.play();	
				}		
			}
			
			/*
			++endcount;
			
			if( endcount >= modelCount )
			{
				if( typeof onEmpResLoadEnd == 'function' )
					onEmpResLoadEnd();
			}
			*/
			
			//console.log( mesh1 );
			return mesh1;
		}
		
	},
	
	resetAniModel:function() 
	{
		if( !this.mixer )
			this.mixer = new THREE.AnimationMixer( this.scene );
		for(var key in  this.scene.children )
        {
            var obj = this.scene.children[key];
            if( obj.type == "Mesh" )
            {
				if( obj.geometry.animations)
				{
					this.mixer.clipAction( obj.geometry.animations[0], obj )
						.stop();
				}				
            }
        }
	},
	
	resetAniCamera:function(camName)
	{
		if( !this.mixer )
			this.mixer = new THREE.AnimationMixer( this.scene );

		for( key  in this.cameras )
		{
			var cam = this.cameras[key];
			if( cam.name == camName )
			{
				if( cam.animations)
				{
					this.mixer.clipAction( cam.animations[0], this.controls )
						.stop();	
				}		
			}
		}
	},
	
	pauseAniCamera:function(camName)
	{
		if( !this.mixer )
			this.mixer = new THREE.AnimationMixer( this.scene );

		for( key  in this.cameras )
		{
			var cam = this.cameras[key];
			if( cam.name == camName )
			{
				if( cam.animations)
				{
					this.mixer.clipAction( cam.animations[0], this.controls )
						.paused = true;	
				}		
			}
		}
	},
	
	replayAniCamera:function(camName)
	{
		if( !this.mixer )
			this.mixer = new THREE.AnimationMixer( this.scene );

		for( key  in this.cameras )
		{
			var cam = this.cameras[key];
			if( cam.name == camName )
			{
				if( cam.animations)
				{
					this.mixer.clipAction( cam.animations[0], this.controls )
						.paused = false;	
				}		
			}
		}
	},
	
	pauseAniModel:function ( )
	{
		if( !this.mixer )
			this.mixer = new THREE.AnimationMixer( this.scene );
		for(var key in  this.scene.children )
        {
            var obj = this.scene.children[key];
            if( obj.type == "Mesh" )
            {
				if( obj.geometry.animations)
				{
					this.mixer.clipAction( obj.geometry.animations[0], obj )
						.paused = true;
				}				
            }
        }
	},
	replayAniModel:function() 
	{
		if( !this.mixer )
			this.mixer = new THREE.AnimationMixer( this.scene );
		for(var key in  this.scene.children )
        {
            var obj = this.scene.children[key];
            if( obj.type == "Mesh" )
            {
				if( obj.geometry.animations)
				{
					this.mixer.clipAction( obj.geometry.animations[0], obj )
						.paused = false;
				}				
            }
        }
	},
	
	playAniModel:function(durationScale, times, keepEnd) 
	{
		var emptimes = 1;
		if( typeof times !== "undefined" )
			emptimes = times;
		var _keepEnd = false;
		if( typeof keepEnd != 'undefined')
			_keepEnd = keepEnd;
		
		if( !this.mixer )
			this.mixer = new THREE.AnimationMixer( this.scene );
		var scale = parseFloat(durationScale);
		if( isNaN( scale ) )
			scale = 1.0;
	
		var curtime = 0;//this.getElapsedTime();
		for(var key in  this.scene.children )
        {
            var obj = this.scene.children[key];
            if( obj.type == "Mesh" )
            {
				if( obj.geometry.animations)
				{
					this.mixer.clipAction( obj.geometry.animations[0], obj )
						.setDuration( obj.geometry.animations[0].duration * 30 * scale )
						.startAt( curtime )	
						.setLoop( THREE.LoopRepeat, emptimes)
						.play()
						.clampWhenFinished = _keepEnd;	
				}				
            }
        }
	},
	palyAniCamera: function( camName, durationScale , times, keepEnd)
	{
		var emptimes = 1;
		if( typeof times !== "undefined" )
			emptimes = times;
		
		var scale = parseFloat(durationScale);
		if( isNaN( scale ) )
			scale = 1.0;
		
		var _keepEnd = false;
		if( typeof keepEnd != 'undefined')
			_keepEnd = keepEnd;
		
		if( !this.mixer )
			this.mixer = new THREE.AnimationMixer( this.scene );

		var curtime = 0;//this.getElapsedTime();
		for( key  in this.cameras )
		{
			var cam = this.cameras[key];
			if( cam.name == camName )
			{
				if( cam.animations)
				{
					this.mixer.clipAction( cam.animations[0], this.controls )
						.setDuration( cam.animations[0].duration * 30 * scale )
						.startAt( curtime )	
						.setLoop( THREE.LoopRepeat, emptimes)
						.play()
						.clampWhenFinished = _keepEnd;							
				}		
			}
		}
	},

    switchCamera: function(oldtarget, oldPos, newTarget,newPos) {
        /*var bbspere = fatherClass.sceneBoundingBox.getBoundingSphere(); //sceneBoundingBox.getBoundingSphere();
        var bbcenter = bbspere.center;
        var boxlen = bbspere.radius;
        */
        this.controls.target = ( newTarget );
        this.controls.object.position.copy( newPos );
        //this.controls.lastPosition.copy( newPos );
        this.controls.object.up.copy( new THREE.Vector3(0,1,0));
    },
	
	switchToCameraAni:function(newTarget,newPos, timelenByMs) {

        this.controls.object.up.copy( new THREE.Vector3(0,1,0));
        //TWEEN.removeAll();
		if( newPos )
		{
			 new TWEEN.Tween( this.controls.object.position )
            .to( newPos, timelenByMs )
            .easing( TWEEN.Easing.Exponential.InOut )
            .start();
		}
		
		if(newTarget)
        {
			new TWEEN.Tween( this.controls.target )
            .to( newTarget, timelenByMs )
            .easing( TWEEN.Easing.Exponential.InOut )
            .start();
		}
    },

	/*
    emitLight:function(enable) {
        //发射光线

        if( enable )
        {
            var pageElement213 = empGetElementByID('353242553-2007828006-1563581018-2129400898', 'div', null);
            for( var i = 1; i< 6 ;++i )
            {
                var itemElement = empGetElementByID('1042967337-1343699393-1591084812-1325097130-'+i, 'div', pageElement213);
                pageElement213.appendChild(itemElement);
                itemElement.style.cssText = "pointer-events:none;border-radius:1024px; background-image:url('resources/red.png');background-size:100% 100%;background-repeat:no-repeat;position:absolute;left:339px;top:264px;width:119px;height:121px; opacity:0;transform-origin:50% 50% ;transform:rotate(0deg) skew(0deg,0deg); z-index:"+ (120-i)+";";
                this.bindDomUI('1042967337-1343699393-1591084812-1325097130-'+i, new THREE.Vector3(-0.0,0.45,-0.14) );
                $('#'+'1042967337-1343699393-1591084812-1325097130-'+i).animo({animation: 'fadeOutDownLRT', iterate: 'infinite',  delay:(i-1)*0.5, duration: 2.5, keep: false, timing:'ease-in'}, function() {  });
            }
        }
        else
        {
            for( var i = 1; i< 6 ;++i )
            {
               empDeleteElementByID('1042967337-1343699393-1591084812-1325097130-'+i);
            }
        }
    },
	*/
	/*
    bindDomUI:function(idstr, offsetV3) {
        var bbspere = this.sceneBoundingBox.getBoundingSphere(); //sceneBoundingBox.getBoundingSphere();
        var bbcenter =  bbspere.center;
        var bbradius = bbspere.radius;

        var bbsize = this.sceneBoundingBox.size();

        bbcenter.x += offsetV3.x *bbsize.x;
        bbcenter.y += offsetV3.y *bbsize.y;
        bbcenter.z += offsetV3.z * bbsize.z;
        //console.log(bbcenter);
        var d2 = bbcenter.project(this.camera);
        var obj = document.getElementById(idstr);
        if(obj )
        {
            var newLeft= (d2.x + 1)  * this.container.offsetWidth / 2.0 + this.container.offsetLeft - obj.offsetWidth/2.;
            var newTop = (1-d2.y)  * this.container.offsetHeight / 2.0  +  this.container.offsetTop - obj.offsetHeight/2;

            obj.style.left =  newLeft.toFixed(0) + 'px';
            obj.style.top = newTop.toFixed(0) + 'px';

            //console.log(d2, obj.style.left, obj.style.top, this.container.offsetLeft );

        }
    },
	*/
	
	addBindingDomUI:function(idstr, meshName, offsetV3)
	{
		this.bindingDomUI[idstr] = {'domID':idstr, 'meshName':meshName, 'offset':offsetV3} ;
	},
	
	bindDomUI:function(info) {
		var mesh111 = this.findObjectByName( info.meshName );
		if( mesh111 && mesh111.geometry )
		{
			var bb = mesh111.geometry.boundingBox;
			var bbcenter =  bb.center();	
			bbcenter.x += info.offset.x;
			bbcenter.y += info.offset.y;
			bbcenter.z += info.offset.z;
			
			var d2 = bbcenter.project(this.camera);
			var obj = document.getElementById(info.domID);
			if(obj )
			{
				var newLeft= (d2.x + 1)  * this.container.offsetWidth / 2.0 + this.container.offsetLeft - obj.offsetWidth/2.;
				var newTop = (1-d2.y)  * this.container.offsetHeight / 2.0  +  this.container.offsetTop - obj.offsetHeight/2;

				obj.style.left =  newLeft.toFixed(0) + 'px';
				obj.style.top = newTop.toFixed(0) + 'px';
			}
		}
    },

	
	enable :function() {
		this.actived = true;
		this.reszieScene();
		this.animate();
	},
	disable:function() {
		this.actived = false;
	},

    animate:function () {
		if( this.actived == false )
			return;

		var delta = this.clock.getDelta();
					
        TWEEN.update();
        if( this.stats)
            this.stats.update();
        if (this.autoCamClip )
        {			
            var bbspere = new THREE.Sphere();
			this.sceneBoundingBox.getBoundingSphere(bbspere); //sceneBoundingBox.getBoundingSphere();
           // var eyedir = new THREE.Vector3();
            //eyedir.subVectors(this.controls.object.position,  this.controls.target ); //视线方向/*
			var eyeDistanceBBCenter = new THREE.Vector3();
			eyeDistanceBBCenter.subVectors(this.controls.object.position, bbspere.center );

            //设置远近裁剪面
            var len = eyeDistanceBBCenter.length(); //eyedir.length();
            this.camera.near = Math.max(0.1, len - bbspere.radius);
			this.camera.far = Math.max(1000, len + bbspere.radius + 1);
            this.camera.updateProjectionMatrix();
		}
		if (this.controls)
            this.controls.update();

		for( key in this.bindingDomUI )
		{
			var dinfo = this.bindingDomUI[key];
			this.bindDomUI(dinfo);
		}
		/*
        this.bindDomUI('1042967337-1343699393-1591084812-1325097130', new THREE.Vector3(-0.0,0.49,-0.14) );
        this.bindDomUI('7684589-1449286809-1419840563-124480809', new THREE.Vector3(-0.35,-0.04,0.35) );
        this.bindDomUI('580413177-2019174623-684029539-1619343458', new THREE.Vector3(0.32,-0.02,0.4) );
        //this.bindDomUI('764757400-859141024-1477064060-1242193633', new THREE.Vector3(0.0,-0.6,-0.2) );

        var timer = Date.now() * 0.001;
         this.Light1.position.set(Math.cos(timer) * 12, Math.sin(timer) * 12, 6);
        var timer2 = timer * 0.7;
        this.Light2.position.set( 6, Math.sin(timer2) * 12, Math.cos(timer2) * 12);
		*/

		
		if( this.mixer)
		{
			this.mixer.update( delta );
		}			
				
        this.render();
		
		requestAnimationFrame(animateGlobal);
    },

    render: function () {
		if( !this.actived )
			return;

        this.scene.updateMatrixWorld();
		this.skyboxCamera.rotation.copy( this.camera.rotation );

        this.renderer.clear();
		this.renderer.render( this.skyboxScene, this.skyboxCamera);
        this.renderer.render(this.scene, this.camera);
		
		this.renderer.render( this.sceneHelpers, this.camera);
    },
    reszieScene :function () {
		if(this.controls &&  typeof this.controls.handleResize === "function")
			this.controls.handleResize();
        this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
        this.camera.updateProjectionMatrix();
		
		this.skyboxCamera.aspect = this.container.offsetWidth / this.container.offsetHeight;
		this.skyboxCamera.updateProjectionMatrix();
				
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
		//console.log("reszieScene",  this.renderer.getSize(), this.container.offsetWidth , this.container.offsetHeight );
        this.render();
		//console.log("reszieScene");
    },
	
	setSceneSize:function(width, height) {
		if( this.controls && typeof this.controls.handleResize === "function")
			this.controls.handleResize();
		this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
		
		this.skyboxCamera.aspect =  width / height;
		this.skyboxCamera.updateProjectionMatrix();
		
        this.renderer.setSize(width, height);
		
		//console.log( "setSceneSize", this.renderer.getSize() );
	}
	
};

function QueryCamInfo( sceneID)
{
	var retStr = "";
	var sceneObj = scene3D[sceneID];
	if( sceneObj )
	{
		retStr += "相机位置:" + sceneObj.camera.position.x.toFixed(2)  +','+ sceneObj.camera.position.y.toFixed(2)  +','+ sceneObj.camera.position.z.toFixed(2) ;
		retStr += "\r\n目标位置:" + sceneObj.controls.target.x.toFixed(2) + ',' + sceneObj.controls.target.y.toFixed(2) + ','+ sceneObj.controls.target.z.toFixed(2) ;
		retStr += '\r\n最小距离:'+sceneObj.controls.minDistance.toFixed(2);
		retStr += '\r\n最大距离:'+sceneObj.controls.maxDistance.toFixed(2) ;
		var eyedir = new THREE.Vector3();
        eyedir.subVectors(sceneObj.controls.object.position,  sceneObj.controls.target );
		retStr += '\r\n当前距离:'+eyedir.length().toFixed(2) ;
	}
	//console.log("QueryCamInfo", sceneID, retStr);
	return retStr;
}

function QueryMeshInfo( meshstr)
{
	var retStr = "";
	var words = meshstr.split('.');
	if( words.length != 2 )
		return retStr;
	
	var sceneObj = scene3D[words[0]];
	if( sceneObj )
	{	
		//var meshObj = sceneObj.findObjectByName( words[1] );
		var meshObj = sceneObj.findObjectByUUID( words[1] );
		if( meshObj )
		{
			var gem = meshObj.geometry;
			
			retStr += "顶点个数:" + gem.vertices.length;
			retStr += "\r\n三角面个数:" + gem.faces.length;
			retStr += "\r\nUV通道数:" + gem.faceVertexUvs.length + '层';
			var bb =  new THREE.Box3();
			bb.copy( gem.boundingBox );
			bb.applyMatrix4( meshObj.matrixWorld );
			var bs = bb.getBoundingSphere();
			
			retStr += "\r\n包围圆中心点:" + bs.center.x.toFixed(2) + ','+ bs.center.y.toFixed(2) + ','+ bs.center.z.toFixed(2) + ', 半径' + bs.radius.toFixed(2);		
			retStr += "\r\n包围盒:" + bb.min.x.toFixed(2) + ','+ bb.min.y.toFixed(2) + ','+ bb.min.z.toFixed(2) + ' ~ ' + bb.max.x.toFixed(2) + ','+ bb.max.y.toFixed(2) + ','+ bb.max.z.toFixed(2);	
			var el = meshObj.matrix.elements;
			retStr += "\r\n矩阵:\r\n  " + el[0].toFixed(4) + ','+ el[1].toFixed(4) + ','+ el[2].toFixed(4) + ','+ el[3].toFixed(4) + ',\r\n  '+
			el[4].toFixed(4) + ','+ el[5].toFixed(4) + ','+ el[6].toFixed(4) + ','+ el[7].toFixed(4) + ',\r\n  ' +
			el[8].toFixed(4) + ','+ el[9].toFixed(4) + ','+ el[10].toFixed(4) + ','+ el[11].toFixed(4) + ',\r\n  '+
			el[12].toFixed(4) + ','+ el[13].toFixed(4) + ','+ el[14].toFixed(4) + ','+ el[15].toFixed(4); 
		}
	}
	console.log("QueryMeshInfo", meshstr, retStr);
	return retStr;
}

function _local_replaceColon(str)
{
	var ret = str.replace(/:/g, "%3A");
	return ret;
}
function EMPLyuQuery(cmdStr)
{
	console.log( 'EMPLyuQuery', cmdStr );
	var retstr = 'QueryInfo:' ;
	var words = cmdStr.split(':');
	if( words.length != 3)
		return "";
	if( words[0] == 'QueryCamInfo')
	{
		retstr += words[0] + ':';
		retstr += _local_replaceColon( QueryCamInfo( words[1] ) );  //使用escape编码
		retstr += ':'+ words[2];
	}
	else if( words[0] == 'QueryMeshInfo')
	{
		retstr += words[0] + ':';
		retstr += _local_replaceColon( QueryMeshInfo( words[1] ) );  //使用escape编码
		retstr += ':'+ words[2];
	}
	
	if( typeof MsgBuilder == "function")
		MsgBuilder(retstr);
}

function dom3dReszie() {
    for(var key in scene3D)
    {
        //console.log("dom3dReszie", key + ": " + scene3D[key] );
		if( !!scene3D[key].actived )
			scene3D[key].reszieScene();
    }
}
window.addEventListener('resize', dom3dReszie, false);


function animateGlobal() {
    for(var key in scene3D)
    {
        //console.log(key + ": " + scene3D[key] );
        if( !!scene3D[key].actived )
			scene3D[key].animate();
    }
    //requestAnimationFrame(animateGlobal);
}
/*
animateGlobal();
*/

//var paramObj = {'size':[1024,768], 'bgcolor':color,'bgalpha':alpha, 'controls':typeCtrl, 'jsonfile':file, 'fileLoadEndFunc':func}
function create3dScene(divID, paramsObj)
{
	var emp3d = scene3D[divID]; 
	if( emp3d == null ) { 
		emp3d = new EmpScene();  					 
		emp3d.initScene(divID); 
		scene3D[divID] = emp3d;
		if( paramsObj)
		{
			if( typeof paramsObj.size !== "undefined" )
				emp3d.setSceneSize(paramsObj.size[0], paramsObj.size[1]);

			emp3d.setClearColor(paramsObj.bgcolor, paramsObj.bgalpha);
			
			if( typeof paramsObj.controls !== 'undefined')
				emp3d.setControlType( paramsObj.controls );
			
			//loadEmpObjs: function(objJsonFile, groupName, PrefixName, params, onEmpResLoadEnd)
			if( typeof paramsObj.jsonfile !== 'undefined')
				emp3d.loadEmpObjs( paramsObj.jsonfile, '', '', {}, paramsObj.fileLoadEndFunc );
		}
	}  
	else 
	{
		if( paramsObj)
		{
			if( typeof paramsObj.size !== "undefined" )
				emp3d.setSceneSize(paramsObj.size[0], paramsObj.size[1]);

			emp3d.setClearColor(paramsObj.bgcolor, paramsObj.bgalpha);
			
			if( typeof paramsObj.controls !== 'undefined')
				emp3d.setControlType( paramsObj.controls );
			
			//不进行文件修改
			//if( typeof paramsObj.jsonfile !== 'undefined')
			//	emp3d.loadEmpObjs( paramsObj.jsonfile, '', '', {}, paramsObj.fileLoadEndFunc );
		}
	}
	
	return emp3d;
}
/*
function create3dScene(divID,width, height, color, alpha, typeCtrl)
{
	var emp3d = scene3D[divID]; 
	if( emp3d == null ) { 
		emp3d = new  EmpScene();  					 
		emp3d.initScene(divID, typeCtrl); 
		scene3D[divID] = emp3d;
	}  
	emp3d.setSceneSize(width, height);
	//console.log( width, height );
	emp3d.setClearColor(color, alpha);
	
	return emp3d;
}
*/

///<jscompress sourcefile="jgestures.js" />
/*jslint undef: true, browser: true, continue: true, eqeq: true, vars: true, forin: true, white: true, newcap: false, nomen: true, plusplus: true, maxerr: 50, indent: 4 */

/**
 * jGestures: a jQuery plugin for gesture events
 * Copyright 2010-2011 Neue Digitale / Razorfish GmbH
 * Copyright 2011-2012, Razorfish GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @fileOverview
 * Razorfish GmbH javascript library: add touch events such as 'pinch',
 * 'rotate', 'swipe', 'tap' and 'orientationchange' on capable user agents.
 * For incapable devices there's a basic event substitution: a "tapone" event
 * can be triggered by "clicking", a "swipeone" by performing a swipe-ish
 * gesture using the mouse (buttondown - mousemove - buttonup).
 *
 * This is still a beta version, bugfixes and improvements appreciated.
 *
 * @author martin.krause@razorfish.de
 * @version 0.90.1
 * @contributor NicolasBernie
 *
 * @requires
 * jQuery JavaScript Library v1.4.2 - http://jquery.com/
 *	Copyright 2010, John Resig
 *	Dual licensed under the MIT or GPL Version 2 licenses.
 *	http://jquery.org/license
 *
 * @example	jQuery('#swipe').bind('swipeone',eventHandler);
 *
 * Notification on native events:
 * On every native touchstart, touchend, gesturestart and gestureend-event,
 * jgestures triggers a corresponding custom event
 * ('jGestures.touchstart', 'jGestures.touchend;start', 'jGestures.touchend;processed',
 * 'jGestures.gesturestart', 'jGestures.gestureend;start', 'jGestures.gestureend;processed') on the event-element.
 * The  eventhandler's second argument represents the original touch event (yes: including all touchpoints).
 * Use this if you need very detailed control e.g. kinetic scrolling or implementing additional gestures.
 *
 * Every jGesture-eventhandler receives a custom object as second argument
 * containing the original event (originalEvent property) and processed
 * information (such as delta values and timesptamp).
 * Example:{
 *				type: eventtype e.g. "swipe","pinch",
 *				originalEvent: {DOM-Event},
 *				// default: just one entry on the delta-array - the first touchpoint
 *				// the first touchpoint is the reference point for every gesture,
 *				// because moving touchpoints in various directions would result in
 *				// a gesture.
 *				// delta and direction details are just provided for touch not for gesture / motion events
 *				delta : [
 *					{
 *						lastX:{Number} , // x-axis: relative to the last touchevent (e.g. touchmove!)
 *						lastY:{Number}, // y-axis: relative to the last touchevent (e.g. touchmove!)
 *						moved: {Number},  // distance: relative to the original touchpoint
 *						startX: {Number} , // relative to the original touchpoint
 *						startY: {Number} ,// relative to the original touchpoint
 *					} ],
 *				// based on the first touchpoint
 *				direction : { // relative to the last touchevent (e.g. touchmove!)
 *					vector: {Number}, // -1|+1, indicates the direction if necessary(pinch/rotate)
 *					orientation: {Number} // window.orientation: -90,0,90,180 || null (window.orienntation)
 *					lastX : {Number}, // -1,0,+1 || null (orientationchange) // relative to the last touchevent (e.g. touchmove!)
 *					lastY : {Number}, // -1,0,+1 || null (orientationchange)// relative to the last touchevent (e.g. touchmove!)
 *					startX: {Number} , // relative to the original touchpoint
 *					startY: {Number} ,// relative to the original touchpoint
 *					name  : {String} // name of the direction (left, right, up, down, rightup, leftup, rightdown, leftdown)
 *				},
 *				rotation: {Number} || null, // gestureonly: amount of rotation relative to the current position NOT the original
 *				scale: {Number} || null, // gestureonly: amount of scaling relative to the current position NOT the original
 *				duration: {Number}, // ms: relative to the original touchpoint
 *				description : {String} // details as String: {TYPE *}:{TOUCHES 1|2|3|4}:{X-AXIS 'right'|'left'|'steady'}:{Y-AXIS 'down'|'up'|'steady'} e.g. "swipe:1:left:steady" relative to the last touchpoint
 *			};
 *
 * Available jGesture-events can be grouped into:
 *
 *
 * Device events:
 *	The jGesture-Events in this group are triggered by the device.
 *
 * @event 'orientationchange'
 *		The device is turned clockwise or counterclockwise. This event is triggered
 *		by the device and might use an internal gyroscope.
 *	obj.description:
 *		orientationchange:landscape:clockwise:-90
 *		orientationchange:portrait:default:0
 *		orientationchange:landscape:counterclockwise|portrait:90
 *		orientationchange:portrait:upsidedown:180
 *
 *
 * Move events:
 *	The jGesture-Events in this group are triggered during the touch/gesture
 *	execution whenever a touchpoint changes.
 *	In contrast to touchend/gestureend-events which are triggered after
 *	the touch/gesture has completed.
 *
 * @event 'pinch'
 *		Is triggered during a pinch gesture (two fingers moving away from or
 *		towards each other).
 *	obj.description:
 *		pinch:-1:close
 *		pinch:+1:open
 *
 * @event 'rotate'
 *		Is triggered during a rotation gesture (two fingers rotating clockwise
 *		or counterclockwise).
 *	obj.description:
 *		rotate:-1:counterclockwise
 *		rotate:+1:+clockwise
 *
 * @event 'swipemove'
 *		Is triggered during a swipe move gesture (finger(s) being moved around
 *		the device, e.g. dragging)
 *	obj.description:
 *		swipemove:1:left:down
 *		swipemove:1:left:up
 *		swipemove:1:left:steady
 *		swipemove:1:right:down
 *		swipemove:1:right:up
 *		swipemove:1:right:steady
 *		swipemove:2:left:down
 *		swipemove:2:left:up
 *		swipemove:2:left:steady
 *		swipemove:2:right:down
 *		swipemove:2:right:up
 *		swipemove:2:right:steady
 *		swipemove:2:left:down
 *		swipemove:3:left:up
 *		swipemove:3:left:steady
 *		swipemove:3:right:down
 *		swipemove:3:right:up
 *		swipemove:3:right:steady
 *		swipemove:3:left:down
 *		swipemove:4:left:up
 *		swipemove:4:left:steady
 *		swipemove:4:right:down
 *		swipemove:4:right:up
 *		swipemove:4:right:steady
 *
 *
 * Toucheend events:
 *	The jGesture-Events in this group are triggered after the touch/gesture
 *	has completed.
 *	In contrast to touchmove-events which are triggered during the touch/gesture
 *	execution whenever a touchpoint changes.
 *
 * @event 'swipeone'
 *		Is triggered after a swipe move gesture with one touchpoint (one finger
 *		was moved around the device)
 *	obj.description:
 *		swipeone:1:left:down
 *		swipeone:1:left:up
 *		swipeone:1:left:steady
 *		swipeone:1:right:down
 *		swipeone:1:right:up
 *		swipeone:1:right:steady
 *
 * @event 'swipetwo'
 *		Is triggered after a swipe move gesture with two touchpoints (two fingers
 *		were moved around the device)
 *	obj.description:
 *		swipetwo:2:left:down
 *		swipetwo:2:left:up
 *		swipetwo:2:left:steady
 *		swipetwo:2:right:down
 *		swipetwo:2:right:up
 *		swipetwo:2:right:steady
 *
 * @event 'swipethree'
 *		Is triggered after a swipe move gesture with three touchpoints (three
 *		fingers were moved around the device)
 *	obj.description:
 *		swipethree:3:left:down
 *		swipethree:3:left:up
 *		swipethree:3:left:steady
 *		swipethree:3:right:down
 *		swipethree:3:right:up
 *		swipethree:3:right:steady
 *
 * @event 'swipefour'
 *		Is triggered after a swipe move gesture with four touchpoints (four
 *		fingers were moved around the device)
 *	obj.description:
 *		swipefour:4:left:down
 *		swipefour:4:left:up
 *		swipefour:4:left:steady
 *		swipefour:4:right:down
 *		swipefour:4:right:up
 *		swipefour:4:right:steady
 *
 *
 * @event 'swipeup'
 *		Is triggered after an  strict upwards swipe move gesture
 *	obj.description:
 *		swipe:1:steady:up
 *		swipe:2:steady:up
 *		swipe:3:steady:up
 *		swipe:4:steady:up
 *
 * @event 'swiperightup'
 *		Is triggered after a rightwards and upwards swipe move gesture
 *	obj.description:
 *		swipe:1:right:up
 *		swipe:2:right:up
 *		swipe:3:right:up
 *		swipe:4:right:up
 *
 * @event 'swiperight'
 *		Is triggered after a  strict rightwards swipe move gesture
 *	obj.description:
 *		swipe:1:right:steady
 *		swipe:2:right:steady
 *		swipe:3:right:steady
 *		swipe:4:right:steady
 *
 * @event 'swiperightdown'
 *		Is triggered after a rightwards and downwards swipe move gesture
 *	obj.description:
 *		swipe:1:right:down
 *		swipe:2:right:down
 *		swipe:3:right:down
 *		swipe:4:right:down
 *
 * @event 'swipedown'
 *		Is triggered after a  strict downwards swipe move gesture
 *	obj.description:
 *		swipe:1:steady:down
 *		swipe:2:steady:down
 *		swipe:3:steady:down
 *		swipe:4:steady:down
 *
 * @event 'swipeleftdown'
 *		Is triggered after a leftwards and downwards swipe move gesture
 *	obj.description:
 *		swipe:1:left:down
 *		swipe:2:left:down
 *		swipe:3:left:down
 *		swipe:4:left:down
 *
 * @event 'swipeleft'
 *		Is triggered after a strict leftwards swipe move gesture
 *	obj.description:
 *		swipe:1:left:steady
 *		swipe:2:left:steady
 *		swipe:3:left:steady
 *		swipe:4:left:steady
 *
 * @event 'swipeleftup'
 *		Is triggered after a leftwards and upwards swipe move gesture
 *	obj.description:
 *		swipe:1:left:up
 *		swipe:2:left:up
 *		swipe:3:left:up
 *		swipe:4:left:up
 *
 * @event 'tapone'
 *		Is triggered after a single (one finger) tap gesture
 *	obj.description:
 *		tapone
 *
 * @event 'taptwo'
 *		Is triggered after a double (two finger) tap gesture
 *	obj.description:
 *		taptwo
 * *
 * @event 'tapthree'
 *		Is triggered after a tripple (three finger) tap gesture
 *	obj.description:
 *		tapthree
 *
 *
 * Gestureend events:
 *	A gesture is an interpretation of different touchpoints.
 *	The jGesture-Events in this group are triggered when a gesture has finished
 *	and the touchpoints are removed from the device.
 *
 * @event 'pinchopen'
 *		Is triggered when a pinchopen gesture (two fingers moving away from each
 *		other) occured and the touchpoints (fingers) are removed the device.
 *	obj.description:
 *		pinch:+1:open
 *
 * @event 'pinchclose'
 *		Is triggered when a pinchclose gesture (two fingers moving towards each
 *		other) occured and the touchpoints (fingers) are removed the device.
 *	obj.description:
 *		pinch:-1:close
 *
 * @event 'rotatecw'
 *		Is triggered when a clockwise rotation gesture (two fingers rotating
 *		clockwise) occured and the touchpoints (fingers) are removed the device.
 *	obj.description:
 *		rotate:+1:+clockwise
 *
 * @event 'rotateccw'
 *		Is triggered when a counterclockwise rotation gesture (two fingers
 *		rotating counterclockwise) occured and the touchpoints (fingers) are
 *		removed the device.
 *	obj.description:
 *		rotate:-1:+counterclockwise
 *
 *
 * Motion events:
 *  A "motion event" is an interpretation of changes in space, e.g. a "shaking motion"
 *  consists of a specified number of acceleration changes in a given interval.
 * For understanding "directions", place your mobile device on a table with the bottom
 * (home button) close to you:
 *  - x-axis: horizontal left / right
 *  - y-axis: horizontal front / back (through the home button)
 *  - z-axis: vertical through your device
 *
 *  Note: Devicemotion / deviceorientation don't send custom event (such as: jGestures.touchstart).
 *  Note: Devicemotion should be bound on the "window-element" - because the whole device moves
 *
 * @event 'shake'
 *		Is triggered when a shaking motion is detected
 *	obj.description:
 *		shake:leftright:x-axisfrontback:y-axis:updown:z-axis
 *
 * @event 'shakefrontback'
 *		Is triggered when a shaking motion is detected and the gesture can be interpreted as a mainly front-back movement.
  *	obj.description:
 *		shakefrontback:shakefrontback:y-axis
 *
 * @event 'shakeleftright'
 *		Is triggered when a shaking motion is detected and the gesture can be interpreted as a mainly left-right movement.
 *		Additional major movements are mentioned in the obj.description.
 *	obj.description:
 *		shakeleftright:leftright:x-axis
 *
 * @event 'shakeupdown'
 *		Is triggered when a shaking motion is detected and the gesture can be interpreted as a mainly up-down movement.
 *		Additional major movements are mentioned in the obj.description.
 *	obj.description:
 *		shake:shakeupdown:updown:z-axis
 *
 * @example
 *		.bind( eventType, [ eventData ], handler(eventObject) )
 * jQuery('body').bind('tapone',function(){alert(arguments[1].description);})
 *
 */

 (function($) {

	/**
	* General thresholds.
	*/
	// @TODO: move to $...defaults
	// @TODO: shake to defaults freeze etc
	// change of x deg in y ms


	$.jGestures = {};
	$.jGestures.defaults = {};
	$.jGestures.defaults.thresholdShake =  {
		requiredShakes : 10,
		freezeShakes: 100,
		frontback : {
			sensitivity: 10
		 },
		leftright : {
			sensitivity: 10
		},
		updown : {
			sensitivity: 10
		}
	};

	$.jGestures.defaults.thresholdPinchopen = 0.05;
	$.jGestures.defaults.thresholdPinchmove = 0.05;
	$.jGestures.defaults.thresholdPinch = 0.05;
	$.jGestures.defaults.thresholdPinchclose = 0.05;
	$.jGestures.defaults.thresholdRotatecw = 5; //deg
	$.jGestures.defaults.thresholdRotateccw = 5; // deg
	// a tap becomes a swipe if x/y values changes are above this threshold
	$.jGestures.defaults.thresholdMove = 20;
	$.jGestures.defaults.thresholdSwipe = 100;
	// get capable user agents
	$.jGestures.data = {};
	$.jGestures.data.capableDevicesInUserAgentString = ['iPad','iPhone','iPod','Mobile Safari']; // basic functionality such as swipe, pinch, rotate, tap should work on every mobile safari, e.g. GalaxyTab
	$.jGestures.data.hasGestures = (function () { var _i; for(_i = 0; _i < $.jGestures.data.capableDevicesInUserAgentString.length; _i++ ) {  if (navigator.userAgent.indexOf($.jGestures.data.capableDevicesInUserAgentString[_i]) !== -1 ) {return true;} } return false; } )();
	$.hasGestures = $.jGestures.data.hasGestures;
	$.jGestures.events = {
		touchstart : 'jGestures.touchstart',
		touchendStart: 'jGestures.touchend;start',
		touchendProcessed: 'jGestures.touchend;processed',
		gesturestart: 'jGestures.gesturestart',
		gestureendStart: 'jGestures.gestureend;start',
		gestureendProcessed: 'jGestures.gestureend;processed'
	};

	jQuery
		.each({
			// "first domevent necessary"_"touch event+counter" : "exposed as"
			// event: orientationchange
			orientationchange_orientationchange01: "orientationchange",
			// event: gestures
			gestureend_pinchopen01: "pinchopen",
			gestureend_pinchclose01: "pinchclose",
			gestureend_rotatecw01 : 'rotatecw',
			gestureend_rotateccw01 : 'rotateccw',
			// move events
			gesturechange_pinch01: 'pinch',
			gesturechange_rotate01: 'rotate',
			touchstart_swipe13: 'swipemove',
			// event: touches
			touchstart_swipe01: "swipeone",
			touchstart_swipe02: "swipetwo",
			touchstart_swipe03: "swipethree",
			touchstart_swipe04: "swipefour",
			touchstart_swipe05: 'swipeup',
			touchstart_swipe06: 'swiperightup',
			touchstart_swipe07: 'swiperight',
			touchstart_swipe08: 'swiperightdown',
			touchstart_swipe09: 'swipedown',
			touchstart_swipe10: 'swipeleftdown',
			touchstart_swipe11: 'swipeleft',
			touchstart_swipe12: 'swipeleftup',
			touchstart_tap01: 'tapone',
			touchstart_tap02: 'taptwo',
			touchstart_tap03: 'tapthree',
			touchstart_tap04: 'tapfour',

			devicemotion_shake01: 'shake',
			devicemotion_shake02: 'shakefrontback',
			devicemotion_shake03: 'shakeleftright',
			devicemotion_shake04: 'shakeupdown'

		},

		/**
		* Add gesture events inside the jQuery.event.special namespace
		*/
		function( sInternal_, sPublicFN_ ) {

			// add as funciton to jQuery.event.special.sPublicFN_
			jQuery.event.special[ sPublicFN_ ] = {

				/**
				* When the first event handler is bound, jQuery executes the setup function.
				* This plugin just uses one eventhandler per element, regardless of the number of bound events.
				* All Events are stored internally as properties on the dom-element using the $.data api.
				* The setup-function adds the eventlistener, acting as a proxy function for the internal events.
				* $.data.ojQueryGestures[_sDOMEvent ('tap') ] = {Boolean}
				* @return {Void}
				*/
				setup: function () {
					// split the arguments to necessary controll arguements
					var _aSplit = sInternal_.split('_');
					var _sDOMEvent = _aSplit[0]; //
					// get the associated gesture event and strip the counter: necessary for distinguisihng similliar events such as tapone-tapfour
					var _sGestureEvent = _aSplit[1].slice(0,_aSplit[1].length-2);
					var _$element = jQuery(this);
					var _oDatajQueryGestures ;
					var oObj;
					// bind the event handler on the first $.bind() for a gestureend-event, set marker
					if (!_$element.data('ojQueryGestures') || !_$element.data('ojQueryGestures')[_sDOMEvent])  {
						// setup pseudo event
						_oDatajQueryGestures = _$element.data('ojQueryGestures') || {};
						oObj = {};
						// marker for:  domEvent being set on this element
						// e.g.: $.data.oGestureInternals['touchstart'] = true;
						// since they're grouped, i'm just marking the first one being added
						oObj[_sDOMEvent] = true;
						$.extend(true,_oDatajQueryGestures,oObj);
						_$element.data('ojQueryGestures' ,_oDatajQueryGestures);
						// add gesture events
						if($.hasGestures) {
							switch(_sGestureEvent) {

								// event: orientationchange
								case 'orientationchange':
									_$element.get(0).addEventListener('orientationchange', _onOrientationchange, false);
								break;

								// event:
								// - shake
								// - tilt
								case 'shake':
								case 'shakefrontback':
								case 'shakeleftright':
								case 'shakeupdown':
								case 'tilt':
									//$.hasGyroscope = true //!window.DeviceOrientationEvent;
									//_$element.get(0).addEventListener('devicemotion', _onDevicemotion, false);
									//_$element.get(0).addEventListener('deviceorientation', _onDeviceorientation, false);
									_$element.get(0).addEventListener('devicemotion', _onDevicemotion, false);
								break;

								// event:
								// - touchstart
								// - touchmove
								// - touchend
								case 'tap':
								case 'swipe':
								case 'swipeup':
								case 'swiperightup':
								case 'swiperight':
								case 'swiperightdown':
								case 'swipedown':
								case 'swipeleftdown':
								case 'swipeleft':
									_$element.get(0).addEventListener('touchstart', _onTouchstart, false);
								break;

								// event: gestureend
								case 'pinchopen':
								case 'pinchclose' :
								case 'rotatecw' :
								case 'rotateccw' :
									_$element.get(0).addEventListener('gesturestart', _onGesturestart, false);
									_$element.get(0).addEventListener('gestureend', _onGestureend, false);
								break;

								// event: gesturechange
								case 'pinch':
								case 'rotate':
									_$element.get(0).addEventListener('gesturestart', _onGesturestart, false);
									_$element.get(0).addEventListener('gesturechange', _onGesturechange, false);
								break;
							}
						}
						// create substitute for gesture events
						else {
							switch(_sGestureEvent) {
								// event substitutes:
								// - touchstart: mousedown
								// - touchmove: none
								// - touchend: mouseup
								case 'tap':
								case 'swipe':
									// _$element.get(0).addEventListener('mousedown', _onTouchstart, false);
									 _$element.bind('mousedown', _onTouchstart);
								break;

								// no substitution
								case 'orientationchange':
								case 'pinchopen':
								case 'pinchclose' :
								case 'rotatecw' :
								case 'rotateccw' :
								case 'pinch':
								case 'rotate':
								case 'shake':
								case 'tilt':

								break;
							}
						}

					}
					return false;
				},

				/**
				* For every $.bind(GESTURE) the add-function will be called.
				* Instead of binding an actual eventlister, the event is stored as $.data on the element.
				* The handler will be triggered using $.triggerHandler(GESTURE) if the internal
				* eventhandler (proxy being bound on setup()) detects a GESTURE event
				* @param {Object} event_ jQuery-Event-Object being passed by $.bind()
				* @return {Void}
				*/
				add : function(event_) {
					// add pseudo event: properties on $.data
					var _$element = jQuery(this);
					var _oDatajQueryGestures = _$element.data('ojQueryGestures');
//					_oDatajQueryGestures[event_.type] = { 'originalType' : event_.type , 'threshold' : event_.data.threshold, 'preventDefault' : event_.data.preventDefault } ;
					_oDatajQueryGestures[event_.type] = { 'originalType' : event_.type } ;
					return false;
				},

				/**
				* For every $.unbind(GESTURE) the remove-function will be called.
				* Instead of removing the actual eventlister, the event is removed from $.data on the element.
				* @param {Object} event_ jQuery-Event-Object being passed by $.bind()
				* @return {Void}
				*/
				remove : function(event_) {
					// remove pseudo event: properties on $.data
					var _$element = jQuery(this);
					var _oDatajQueryGestures = _$element.data('ojQueryGestures');
					_oDatajQueryGestures[event_.type] = false;
					_$element.data('ojQueryGestures' ,_oDatajQueryGestures );
					return false;
				},

				/**
				* The last $.unbind()-call on the domElement triggers the teardown function
				* removing the eventlistener
				* @return {Void}
				*/
				// @TODO: maybe rework teardown to work with event type?!
				teardown : function() {
					// split the arguments to necessary controll arguements
					var _aSplit = sInternal_.split('_');
					var _sDOMEvent = _aSplit[0]; //
					// get the associated gesture event and strip the counter: necessary for distinguisihng similliar events such as tapone-tapfour
					var _sGestureEvent = _aSplit[1].slice(0,_aSplit[1].length-2);
					var _$element = jQuery(this);
					var _oDatajQueryGestures;
					var oObj;
					// bind the event handler on the first $.bind() for a gestureend-event, set marker
					if (!_$element.data('ojQueryGestures') || !_$element.data('ojQueryGestures')[_sDOMEvent])  {
						// setup pseudo event
						_oDatajQueryGestures = _$element.data('ojQueryGestures') || {};
						oObj = {};
						// remove marker for:  domEvent being set on this element
						oObj[_sDOMEvent] = false;
						$.extend(true,_oDatajQueryGestures,oObj);
						_$element.data('ojQueryGestures' ,_oDatajQueryGestures);

						// remove gesture events
						if($.hasGestures) {
							switch(_sGestureEvent) {

								// event: orientationchange
								case 'orientationchange':
									_$element.get(0).removeEventListener('orientationchange', _onOrientationchange, false);
								break;

								case 'shake':
								case 'shakefrontback':
								case 'shakeleftright':
								case 'shakeupdown':
								case 'tilt':
									_$element.get(0).removeEventListener('devicemotion', _onDevicemotion, false);
								break;

								// event :
								// - touchstart
								// - touchmove
								// - touchend
								case 'tap':
								case 'swipe':
								case 'swipeup':
								case 'swiperightup':
								case 'swiperight':
								case 'swiperightdown':
								case 'swipedown':
								case 'swipeleftdown':
								case 'swipeleft':
								case 'swipeleftup':
									_$element.get(0).removeEventListener('touchstart', _onTouchstart, false);
									_$element.get(0).removeEventListener('touchmove', _onTouchmove, false);
									_$element.get(0).removeEventListener('touchend', _onTouchend, false);
								break;

								// event: gestureend
								case 'pinchopen':
								case 'pinchclose' :
								case 'rotatecw' :
								case 'rotateccw' :
									_$element.get(0).removeEventListener('gesturestart', _onGesturestart, false);
									_$element.get(0).removeEventListener('gestureend', _onGestureend, false);
								break;

								// event: gesturechange
								case 'pinch':
								case 'rotate':
									_$element.get(0).removeEventListener('gesturestart', _onGesturestart, false);
									_$element.get(0).removeEventListener('gesturechange', _onGesturechange, false);
								break;
							}
						}
						// remove substitute for gesture events
						else {
							switch(_sGestureEvent) {
								// event substitutes:
								// - touchstart: mousedown
								// - touchmove: none
								// - touchend: mouseup
								case 'tap':
								case 'swipe':
//									_$element.get(0).removeEventListener('mousedown', _onTouchstart, false);
//									_$element.get(0).removeEventListener('mousemove', _onTouchmove, false);
//									_$element.get(0).removeEventListener('mouseup', _onTouchend, false);
									_$element.unbind('mousedown', _onTouchstart);
									_$element.unbind('mousemove', _onTouchmove);
									_$element.unbind('mouseup', _onTouchend);
								break;

								// no substitution
								case 'orientationchange':
								case 'pinchopen':
								case 'pinchclose' :
								case 'rotatecw' :
								case 'rotateccw' :
								case 'pinch':
								case 'rotate':
								case 'shake':
								case 'tilt':

								break;
							}
						}

					}
				return false;
				}

			};
		});

	/**
	* Creates the object that ist passed as second argument to the $element.triggerHandler function.
	* This object contains detailed informations about the gesture event.
	* @param {Object} oOptions_  {type: {String}, touches: {String}, deltaY: {String},deltaX : {String}, startMove: {Object}, event:{DOM-Event}, timestamp:{String},vector: {Number}}
	* @example _createOptions (
	*				{
	*					type: 'swipemove',
	*					touches: '1',
	*					deltaY: _iDeltaY,
	*					deltaX : _iDeltaX,
	*					startMove: _oDatajQueryGestures.oStartTouch,
	*					event:event_,
	*					timestamp:_oEventData.timestamp,
	*					vector: -1
	*				}
	*			);
	* @returns {Object}
	*			{
	*				type: eventtype e.g. "swipe","pinch",
	*				originalEvent: {DOM-Event},
	*				// default: just one entry on the delta-array - the first touchpoint
	*				// the first touchpoint is the reference point for every gesture,
	*				// because moving touchpoints in various directions would result in
	*				// a gesture.
	*				// delta and direction details are just provided for touch not for gesture / motion events
	*				delta : [
	*					{
	*						lastX:{Number} , // x-axis: relative to the last touchevent (e.g. touchmove!)
	*						lastY:{Number}, // y-axis: relative to the last touchevent (e.g. touchmove!)
	*						moved: {Number},  // distance: relative to the original touchpoint
	*						startX: {Number} , // relative to the original touchpoint
	*						startY: {Number} ,// relative to the original touchpoint
	*					} ],
	*				// based on the first touchpoint
	*				direction : { // relative to the last touchevent (e.g. touchmove!)
	*					vector: {Number}, // -1|+1, indicates the direction if necessary(pinch/rotate)
	*					orientation: {Number} // window.orientation: -90,0,90,180 || null (window.orienntation)
	*					lastX : {Number}, // -1,0,+1 relative to the last touchevent (e.g. touchmove!)
	*					lastY : {Number}, // -1,0,+1 relative to the last touchevent (e.g. touchmove!)
	*					startX: {Number} , //-1,0,+1 relative to the original touchpoint
	*					startY: {Number} ,// -1,0,+1 relative to the original touchpoint
 *					name  : {String} // name of the direction (left, right, up, down, rightup, leftup, rightdown, leftdown)
	*				},
	*				rotation: {Number} || null, // gestureonly: amount of rotation relative to the current position NOT the original
	*				scale: {Number} || null, // gestureonly: amount of scaling relative to the current position NOT the original
	*				duration: {Number}, // ms: relative to the original touchpoint
	*				description : {String} // details as String: {TYPE *}:{TOUCHES 1|2|3|4}:{X-AXIS 'right'|'left'|'steady'}:{Y-AXIS 'down'|'up'|'steady'} e.g. "swipe:1:left:steady" relative to the last touchpoint
	*			};
	*/
	function _createOptions(oOptions_) {
		// force properties
		oOptions_.startMove = (oOptions_.startMove) ? oOptions_.startMove : {startX: null,startY:null,timestamp:null}  ;
		var _iNow = new Date().getTime();
		var _oDirection;
		var _oDelta;
		// calculate touch differences
		if (oOptions_.touches) {
			// store delta values
			_oDelta = [
				{
					lastX: oOptions_.deltaX ,
					lastY: oOptions_.deltaY,
					moved: null,
					startX:  oOptions_.screenX - oOptions_.startMove.screenX ,
					startY: oOptions_.screenY - oOptions_.startMove.screenY
				}
			];

			_oDirection =  {
				vector: oOptions_.vector || null,
				orientation : window.orientation || null,
				lastX : ((_oDelta[0].lastX > 0) ? +1 : ( (_oDelta[0].lastX < 0) ? -1 : 0 ) ),
				lastY : ((_oDelta[0].lastY > 0) ? +1 : ( (_oDelta[0].lastY < 0) ? -1 : 0 ) ),
				startX : ((_oDelta[0].startX > 0) ? +1 : ( (_oDelta[0].startX < 0) ? -1 : 0 ) ),
				startY : ((_oDelta[0].startY > 0) ? +1 : ( (_oDelta[0].startY < 0) ? -1 : 0 ) )
			};

			// calculate distance traveled using the pythagorean theorem
			_oDelta[0].moved =  Math.sqrt(Math.pow(Math.abs(_oDelta[0].startX), 2) + Math.pow(Math.abs(_oDelta[0].startY), 2));

			// determine direction name
			var x = _oDelta[0].lastX,
					y = _oDelta[0].lastY;
					direction = null;

			if (x == 0 || y/x <= -2 || y/x >= 2) {
				if (y > 0)
					direction = 'down';
				else if (y < 0)
					direction = 'up';
			}
			else if (y == 0 || x/y <= -2 || x/y >= 2) {
				if (x > 0)
					direction = 'right';
				else if (x < 0)
					direction = 'left';
			}
			else if (0.5 < y/x && y/x < 2) {
				if (y > 0)
					direction = 'rightdown';
				else if (y < 0)
					direction = 'leftup';
			}
			else if (-2 < y/x && y/x < -0.5) {
				if (y > 0)
					direction = 'leftdown';
				else if (y < 0)
					direction = 'rightup';
			}

			_oDirection.name = direction;
		}
		return {
			type: oOptions_.type || null,
			originalEvent: oOptions_.event || null,
			delta : _oDelta  || null,
			direction : _oDirection || { orientation : window.orientation || null, vector: oOptions_.vector || null},
			duration: (oOptions_.duration) ? oOptions_.duration : ( oOptions_.startMove.timestamp ) ? _iNow - oOptions_.timestamp : null,
			rotation: oOptions_.rotation || null,
			scale: oOptions_.scale || null,
			description : oOptions_.description || [
				oOptions_.type,
				':',
				oOptions_.touches,
				':',
				((_oDelta[0].lastX != 0) ? ((_oDelta[0].lastX > 0) ? 'right' : 'left') : 'steady'),
				':',
				((_oDelta[0].lastY != 0) ? ( (_oDelta[0].lastY > 0) ? 'down' : 'up') :'steady')
				].join('')
		};

	}



	/**
	* DOM-event handlers
	*/

	/**
	* Handler: orientationchange
	* Triggers the bound orientationchange handler on the window element
	* The "orientationchange" handler will receive an object with additional information
	* about the event.
	*  {
	*	direction : {
	*		orientation: {-90|0|90|180}
	*	},
	*	description : [
	*		'orientationchange:{landscape:clockwise:|portrait:default|landscape:counterclockwise|portrait:upsidedown}:{-90|0|90|180}' // e.g. 'orientation:landscape:clockwise:-90
	*	}
	* @param {DOM-Event} event_
	* @return {Void}
	*/
	function _onOrientationchange(event_) {

		// window.orientation: -90,0,90,180
		var _aDict = ['landscape:clockwise:','portrait:default:','landscape:counterclockwise:','portrait:upsidedown:'];

		$(window).triggerHandler('orientationchange',
			{
				direction : {orientation: window.orientation},
				description : [
					'orientationchange:',
					_aDict[( (window.orientation / 90) +1)],
					window.orientation
					].join('')
			});
	}


	/**
	* Handler: devicemotion
	* Calculates "motion events" such as shake, tilt, wiggle by observing "changes in space"
	* For understanding "directions", place your mobile device on a table with the bottom
	* (home button) close to you:
	*  - x-axis: horizontal left / right
	*  - y-axis: horizontal front / back (through the home button)
	*  - z-axis: vertical through your device
	* @param {DOM-Event} event_
	* @returns {Object}
	*			{
	*				type: eventtype e.g. "shake",
	*				originalEvent: {DOM-Event},
	*				// delta and direction details are just provided for touch not for gesture / motion events
	*				delta : null,
	*				direction :{
	*					vector: null,
	*					orientation: -90,0,90,180 || null (window.orienntation)
	*				}
	*				rotation: {Number} , //  amount of rotation relative to the current position NOT the original
	*				scale: {Number} , // amount of scaling relative to the current position NOT the original
	*				duration: {Number}, // ms: duration of the motion
	*				description : {String} // details as String: pinch:{'close'|'open'} e.g. "pinch:-1:close" ||  rotate:{'counterclockwise'|'clockwise'} e.g. "rotate:-1:counterclockwise"
	*			};
	* @param {DOM-Event} event_
	* @return {Void}
	*/
	function _onDevicemotion(event_) {

		var _sType;
		var _$element = jQuery(window);
		//var _bHasGyroscope = $.hasGyroscope;

		// skip custom notification: devicemotion is triggered every 0.05s regardlesse of any gesture

		// get options
		var _oDatajQueryGestures = _$element.data('ojQueryGestures');

		var _oThreshold = $.jGestures.defaults.thresholdShake;

		// get last position or set initital values
		var _oLastDevicePosition = _oDatajQueryGestures.oDeviceMotionLastDevicePosition || {
			accelerationIncludingGravity : {
				x: 0,
				y: 0,
				z: 0
			},
			shake : {
				eventCount: 0,
				intervalsPassed: 0,
				intervalsFreeze: 0
			},
			shakeleftright : {
				eventCount: 0,
				intervalsPassed: 0,
				intervalsFreeze: 0
			},
			shakefrontback : {
				eventCount: 0,
				intervalsPassed: 0,
				intervalsFreeze: 0
			},
			shakeupdown : {
				eventCount: 0,
				intervalsPassed: 0,
				intervalsFreeze: 0
			}
		};

		// cache current values
		var _oCurrentDevicePosition = {
			accelerationIncludingGravity : {
				x: event_.accelerationIncludingGravity.x,
				y: event_.accelerationIncludingGravity.y,
				z: event_.accelerationIncludingGravity.z
			},
			shake: {
				eventCount: _oLastDevicePosition.shake.eventCount,
				intervalsPassed: _oLastDevicePosition.shake.intervalsPassed,
				intervalsFreeze: _oLastDevicePosition.shake.intervalsFreeze
			 },
			 shakeleftright: {
				eventCount: _oLastDevicePosition.shakeleftright.eventCount,
				intervalsPassed: _oLastDevicePosition.shakeleftright.intervalsPassed,
				intervalsFreeze: _oLastDevicePosition.shakeleftright.intervalsFreeze
			 },
			 shakefrontback: {
				eventCount: _oLastDevicePosition.shakefrontback.eventCount,
				intervalsPassed: _oLastDevicePosition.shakefrontback.intervalsPassed,
				intervalsFreeze: _oLastDevicePosition.shakefrontback.intervalsFreeze
			 },
			 shakeupdown: {
				eventCount: _oLastDevicePosition.shakeupdown.eventCount,
				intervalsPassed: _oLastDevicePosition.shakeupdown.intervalsPassed,
				intervalsFreeze: _oLastDevicePosition.shakeupdown.intervalsFreeze
			 }

		};


		// options
		var _aType;
		var _aDescription;
		var _oObj;


		// trigger events for all bound pseudo events on this element
		for (_sType in _oDatajQueryGestures) {
			// get current pseudo event


			// trigger bound events on this element
			switch(_sType) {

				case 'shake':
				case 'shakeleftright':
				case 'shakefrontback':
				case 'shakeupdown':

					// options
					_aType = [];
					_aDescription = [];

					_aType.push(_sType);

					// freeze shake - prevent multiple shake events on one  shaking motion (user won't stop shaking immediately)
					if (++_oCurrentDevicePosition[_sType].intervalsFreeze > _oThreshold.freezeShakes && _oCurrentDevicePosition[_sType].intervalsFreeze < (2*_oThreshold.freezeShakes) ) { break;	}

					// set control values
					_oCurrentDevicePosition[_sType].intervalsFreeze  = 0;
					_oCurrentDevicePosition[_sType].intervalsPassed++;

					// check for shaking motions: massive acceleration changes in every direction
					if ( ( _sType === 'shake' ||_sType === 'shakeleftright' ) && ( _oCurrentDevicePosition.accelerationIncludingGravity.x > _oThreshold.leftright.sensitivity  || _oCurrentDevicePosition.accelerationIncludingGravity.x < (-1* _oThreshold.leftright.sensitivity) ) ) {
						_aType.push('leftright');
						_aType.push('x-axis');
					}

					if ( ( _sType === 'shake' ||_sType === 'shakefrontback' ) && (_oCurrentDevicePosition.accelerationIncludingGravity.y > _oThreshold.frontback.sensitivity  || _oCurrentDevicePosition.accelerationIncludingGravity.y < (-1 * _oThreshold.frontback.sensitivity) ) ) {
						_aType.push('frontback');
						_aType.push('y-axis');
					}

					if ( ( _sType === 'shake' ||_sType === 'shakeupdown' ) && ( _oCurrentDevicePosition.accelerationIncludingGravity.z+9.81 > _oThreshold.updown.sensitivity  || _oCurrentDevicePosition.accelerationIncludingGravity.z+9.81 < (-1 * _oThreshold.updown.sensitivity) ) ) {
						_aType.push('updown');
						_aType.push('z-axis');
					}

					// at least one successful shaking event
					if (_aType.length > 1) {
						// minimum number of shaking motions during  the defined "time" (messured by events - device event interval: 0.05s)
						if (++_oCurrentDevicePosition[_sType].eventCount == _oThreshold.requiredShakes && (_oCurrentDevicePosition[_sType].intervalsPassed) < _oThreshold.freezeShakes ) {
							// send event
							_$element.triggerHandler(_sType, _createOptions ({type: _sType, description: _aType.join(':'), event:event_,duration:_oCurrentDevicePosition[_sType].intervalsPassed*5 }) );
							// reset
							_oCurrentDevicePosition[_sType].eventCount = 0;
							_oCurrentDevicePosition[_sType].intervalsPassed = 0;
							// freeze shake
							_oCurrentDevicePosition[_sType].intervalsFreeze = _oThreshold.freezeShakes+1;
						}
						// too slow, reset
						else if (_oCurrentDevicePosition[_sType].eventCount == _oThreshold.requiredShakes && (_oCurrentDevicePosition[_sType].intervalsPassed) > _oThreshold.freezeShakes ) {
							_oCurrentDevicePosition[_sType].eventCount = 0 ;
							_oCurrentDevicePosition[_sType].intervalsPassed = 0;
						}
					}
				break;

			}

			// refresh pseudo events
			_oObj = {};
			_oObj.oDeviceMotionLastDevicePosition = _oCurrentDevicePosition;
			_$element.data('ojQueryGestures',$.extend(true,_oDatajQueryGestures,_oObj));

		}
	}


	/**
	* Handler: touchstart or mousedown
	* Setup pseudo-event by storing initial values such as :
	*	screenX : {Number}
	*	screenY : {Number}
	*	timestamp: {Number}
	*  on the pseudo gesture event and
	*  sets up additional eventlisteners for handling touchmove events.
	* @param {DOM-Event} event_
	* @return {Void}
	*/
	function _onTouchstart(event_) {

		// ignore bubbled handlers
		// if ( event_.currentTarget !== event_.target ) { return; }

		var _$element = jQuery(event_.currentTarget);
		// var _$element = jQuery(event_.target);

		// trigger custom notification
		_$element.triggerHandler($.jGestures.events.touchstart,event_);


		// set the necessary touch events
		if($.hasGestures) {
			event_.currentTarget.addEventListener('touchmove', _onTouchmove, false);
			event_.currentTarget.addEventListener('touchend', _onTouchend, false);
		}
		// event substitution
		else {
//			event_.currentTarget.addEventListener('mousemove', _onTouchmove, false);
//			event_.currentTarget.addEventListener('mouseup', _onTouchend, false);
			_$element.bind('mousemove', _onTouchmove);
			_$element.bind('mouseup', _onTouchend);
		}

		// get stored pseudo event
		var _oDatajQueryGestures = _$element.data('ojQueryGestures');

		// var _oEventData = _oDatajQueryGestures[_sType];
		var _eventBase = (event_.touches) ? event_.touches[0] : event_;
		// store current values for calculating relative values (changes between touchmoveevents)
		var _oObj = {};
		_oObj.oLastSwipemove = { screenX : _eventBase.screenX, screenY : _eventBase.screenY, timestamp:new Date().getTime()};
		_oObj.oStartTouch = { screenX : _eventBase.screenX, screenY : _eventBase.screenY, timestamp:new Date().getTime()};

		_$element.data('ojQueryGestures',$.extend(true,_oDatajQueryGestures,_oObj));
	}


	/**
	* Handler: touchmove or mousemove
	* Calculates the x/y changes since the last event,
	* compares it to $.jGestures.defaults.thresholdMove and triggers
	* an swipemove event if the distance exceed the
	* threshold.
	* Custom-event argument object:
	* {Object}
	*			{
	*				type: e.g. 'swipemove',
	*				≈: {DOM-Event},
	*				// default: just one entry on the delta-array - the first touchpoint
	*				// the first touchpoint is the reference point for every gesture,
	*				// because moving touchpoints in various directions would result in
	*				// a gesture.
	*				// delta and direction details are just provided for touch not for gesture / motion events
	*				delta : [
	*					{
	*						lastX:{Number} , // x-axis: relative to the last touchevent (e.g. touchmove!)
	*						lastY:{Number}, // y-axis: relative to the last touchevent (e.g. touchmove!)
	*						moved: {Number},  // distance: relative to the original touchpoint
	*						startX: {Number} , // relative to the original touchpoint
	*						startY: {Number} ,// relative to the original touchpoint
	*					} ],
	*				// based on the first touchpoint
	*				direction : { // relative to the last touchevent (e.g. touchmove!)
	*					vector: {Number}, // -1|+1, indicates the direction if necessary(pinch/rotate)
	*					orientation: {Number} // window.orientation: -90,0,90,180 || null (window.orienntation)
	*					lastX : {Number}, // -1,0,+1 relative to the last touchevent (e.g. touchmove!)
	*					lastY : {Number}, // -1,0,+1 relative to the last touchevent (e.g. touchmove!)
	*					startX: {Number} , //-1,0,+1 relative to the original touchpoint
	*					startY: {Number} ,// -1,0,+1 relative to the original touchpoint
	*				},
	*				rotation: null, // gestureonly: amount of rotation relative to the current position NOT the original
	*				scale: null, // gestureonly: amount of scaling relative to the current position NOT the original
	*				duration: {Number}, // ms: relative to the original touchpoint
	*				description : {String} // details as String: {TYPE *}:{TOUCHES 1|2|3|4}:{X-AXIS 'right'|'left'|'steady'}:{Y-AXIS 'down'|'up'|'steady'} e.g. "swipe:1:left:steady" relative to the last touchpoint
	*			};
	*
	* @param {DOM-Event} event_
	* @return {Void}
	*/
	function _onTouchmove(event_) {

		var _$element = jQuery(event_.currentTarget);
		// var _$element = jQuery(event_.target);

		event_.preventDefault(); //lvrutao 201228 屏蔽
		
		// get stored pseudo event
		var _oDatajQueryGestures = _$element.data('ojQueryGestures');

		var _bHasTouches = !!event_.touches;
		var _iScreenX = (_bHasTouches) ? event_.changedTouches[0].screenX : event_.screenX;
		var _iScreenY = (_bHasTouches) ? event_.changedTouches[0].screenY : event_.screenY;

		//relative to the last event
		var _oEventData = _oDatajQueryGestures.oLastSwipemove;
		var _iDeltaX = _iScreenX - _oEventData.screenX   ;
		var _iDeltaY = _iScreenY - _oEventData.screenY;

		var _oDetails;

			// there's a swipemove set (not the first occurance), trigger event
		if (!!_oDatajQueryGestures.oLastSwipemove) {
			// check
			_oDetails = _createOptions({type: 'swipemove', touches: (_bHasTouches) ? event_.touches.length: '1', screenY: _iScreenY,screenX:_iScreenX ,deltaY: _iDeltaY,deltaX : _iDeltaX, startMove:_oEventData, event:event_, timestamp:_oEventData.timestamp});
			_$element.triggerHandler(_oDetails.type,_oDetails);
		}
		// store the new values
		var _oObj = {};
		var _eventBase = (event_.touches) ? event_.touches[0] : event_;
		_oObj.oLastSwipemove = { screenX : _eventBase.screenX, screenY : _eventBase.screenY, timestamp:new Date().getTime()};
		_$element.data('ojQueryGestures',$.extend(true,_oDatajQueryGestures,_oObj));
	}


	/**
	* Handler: touchend or mouseup
	* Removes the additional handlers (move/end)
	* Calculates the x/y changes since the touchstart event
	* not in relation to the last move event.
	* Triggers the
	*	swipeone|swipetwo|swipethree|swipefour|
	*	swipeup|swiperightup|swiperight|swiperightdown|swipedown|
	*	swipeleftdown|swipeleft|swipeleftup|
	*	tapone|taptwo|tapthree|tapfour
	* event.
	*		{Object}
	*			{
	*				type: eventtype e.g. "swipeone","swipeleftdown",
	*				originalEvent: {DOM-Event},
	*				// default: just one entry on the delta-array - the first touchpoint
	*				// the first touchpoint is the reference point for every gesture,
	*				// because moving touchpoints in various directions would result in
	*				// a gesture.
	*				// delta and direction details are just provided for touch not for gesture / motion events
	*				delta : [
	*					{
	*						lastX:{Number} , // x-axis: relative to the last touchevent (e.g. touchmove!)
	*						lastY:{Number}, // y-axis: relative to the last touchevent (e.g. touchmove!)
	*						moved: {Number},  // distance: relative to the original touchpoint
	*						startX: {Number} , // relative to the original touchpoint
	*						startY: {Number} ,// relative to the original touchpoint
	*					} ],
	*				// based on the first touchpoint
	*				direction : { // relative to the last touchevent (e.g. touchmove!)
	*					vector: {Number}, // -1|+1, indicates the direction if necessary(pinch/rotate)
	*					orientation: {Number} // window.orientation: -90,0,90,180 || null (window.orienntation)
	*					lastX : {Number}, // -1,0,+1 relative to the last touchevent (e.g. touchmove!)
	*					lastY : {Number}, // -1,0,+1 relative to the last touchevent (e.g. touchmove!)
	*					startX: {Number} , //-1,0,+1 relative to the original touchpoint
	*					startY: {Number} ,// -1,0,+1 relative to the original touchpoint
	*				},
	*				rotation: null,
	*				scale: null ,
	*				duration: {Number}, // ms: relative to the original touchpoint
	*				description : {String} // details as String: {TYPE *}:{TOUCHES 1|2|3|4}:{X-AXIS 'right'|'left'|'steady'}:{Y-AXIS 'down'|'up'|'steady'} e.g. "swipe:1:left:steady" relative to the last touchpoint
	*			};
	* @param {DOM-Event} event_
	* @return {Void}
	*/
	function _onTouchend(event_) {

		// ignore bubbled handlers
		// if ( event_.currentTarget !== event_.target ) { return; }

		var _$element = jQuery(event_.currentTarget);
		var _bHasTouches = !!event_.changedTouches;
		var _iTouches = (_bHasTouches) ? event_.changedTouches.length : '1';
		var _iScreenX = (_bHasTouches) ? event_.changedTouches[0].screenX : event_.screenX;
		var _iScreenY = (_bHasTouches) ? event_.changedTouches[0].screenY : event_.screenY;

		// trigger custom notification
		_$element.triggerHandler($.jGestures.events.touchendStart,event_);

		// var _$element = jQuery(event_.target);
		// remove events
		if($.hasGestures) {
			event_.currentTarget.removeEventListener('touchmove', _onTouchmove, false);
			event_.currentTarget.removeEventListener('touchend', _onTouchend, false);
		}
		// event substitution
		else {
//			event_.currentTarget.removeEventListener('mousemove', _onTouchmove, false);
//			event_.currentTarget.removeEventListener('mouseup', _onTouchend, false);
			_$element.unbind('mousemove', _onTouchmove);
			_$element.unbind('mouseup', _onTouchend);
		}
		// get all bound pseudo events
		var _oDatajQueryGestures = _$element.data('ojQueryGestures');

		// if the current change on the x/y position is above the defined threshold for moving an element set the moved flag
		// to distinguish between a moving gesture and a shaking finger trying to tap
		var _bHasMoved = (
			Math.abs(_oDatajQueryGestures.oStartTouch.screenX - _iScreenX) > $.jGestures.defaults.thresholdMove ||
			Math.abs(_oDatajQueryGestures.oStartTouch.screenY - _iScreenY) > $.jGestures.defaults.thresholdMove
		) ? true : false;

		// if the current change on the x/y position is above the defined threshold for swiping set the moved flag
		// to indicate we're dealing with a swipe gesture
		var _bHasSwipeGesture = (
			Math.abs(_oDatajQueryGestures.oStartTouch.screenX - _iScreenX) > $.jGestures.defaults.thresholdSwipe ||
			Math.abs(_oDatajQueryGestures.oStartTouch.screenY - _iScreenY) > $.jGestures.defaults.thresholdSwipe
		) ? true : false;


		var _sType;
		var _oEventData ;

		var _oDelta;

		// calculate distances in relation to the touchstart position not the last touchmove event!
		var _iDeltaX;
		var _iDeltaY;
		var _oDetails;

		var _aDict = ['zero','one','two','three','four'];

		// swipe marker
		var _bIsSwipe;


		// trigger events for all bound pseudo events on this element
		for (_sType in _oDatajQueryGestures) {

			// get current pseudo event
			_oEventData = _oDatajQueryGestures.oStartTouch;

			_oDelta = {};
			_iScreenX = (_bHasTouches) ? event_.changedTouches[0].screenX : event_.screenX;
			_iScreenY = (_bHasTouches) ? event_.changedTouches[0].screenY : event_.screenY;
			// calculate distances in relation to the touchstart position not the last touchmove event!
			_iDeltaX = _iScreenX - _oEventData.screenX ;
			_iDeltaY = _iScreenY - _oEventData.screenY;
			_oDetails = _createOptions({type: 'swipe', touches: _iTouches, screenY: _iScreenY,screenX:_iScreenX ,deltaY: _iDeltaY,deltaX : _iDeltaX, startMove:_oEventData, event:event_, timestamp:  _oEventData.timestamp });


			// swipe marker
			_bIsSwipe = false;

			// trigger bound events on this element
			switch(_sType) {
				case 'swipeone':
				case 'swipetwo':
				case 'swipethree':
				case 'swipefour':
				case 'swipeup':
				case 'swiperightup':
				case 'swiperight':
				case 'swiperightdown':
				case 'swipedown':
				case 'swipeleftdown':
				case 'swipeleft':
				case 'swipeleftup':

					if( _bHasTouches === false && _iTouches >= 1 && _bHasMoved === false){
						// trigger tap!
						break;
					}
					if (_bHasTouches===false || ( _iTouches >= 1  && _bHasMoved === true && _bHasSwipeGesture===true)) {
						_bIsSwipe = true;

						// trigger simple swipe
						_oDetails.type = ['swipe',_aDict[_iTouches]].join('');

						if (_oDetails.type == _sType) {
							_$element.triggerHandler(_oDetails.type,_oDetails);
							break;
						}

						// trigger directional swipe
						if (_oDetails.direction.name !== null) {
							_oDetails.type = 'swipe' + _oDetails.direction.name;

							if (_oDetails.type == _sType)
								_$element.triggerHandler(_oDetails.type,_oDetails);
						}
					}
				break;

				case 'tapone':
				case 'taptwo':
				case 'tapthree':
				case 'tapfour':
					if (( /* _bHasTouches && */ _bHasMoved !== true && _bIsSwipe !==true) && (_aDict[_iTouches] ==_sType.slice(3)) ) {
						_oDetails.description = ['tap',_aDict[_iTouches]].join('');
						_oDetails.type = ['tap',_aDict[_iTouches]].join('');

						if (_oDetails.type == _sType)
							_$element.triggerHandler(_oDetails.type,_oDetails);
						}
					break;

			}

			// refresh pseudo events
			var _oObj = {};
//			_oObj[_sType] = false;
//			_oObj.hasTouchmoved = false;
			_$element.data('ojQueryGestures',$.extend(true,_oDatajQueryGestures,_oObj));
			_$element.data('ojQueryGestures',$.extend(true,_oDatajQueryGestures,_oObj));

		}
		_$element.triggerHandler($.jGestures.events.touchendProcessed,event_);
		_$element.triggerHandler('EmpUpEnd',event_);
	}


	/**
	* Handler: gesturestart
	* Setup pseudo-event by storing initial values such as :
	*	timestamp: {Number}
	*  on the pseudo gesture event
	* Since the gesture-event doesn't supply event.touches no tuchpoints will be calculated
	* @param {DOM-Event} event_
	* @return {Void}
	*/
	function _onGesturestart(event_) {

		// ignore bubbled handlers
		// if ( event_.currentTarget !== event_.target ) { return; }

		var _$element = jQuery(event_.currentTarget);
		// var _$element = jQuery(event_.target);

		// trigger custom notification
		_$element.triggerHandler($.jGestures.events.gesturestart,event_);


		// get stored pseudo event
		var _oDatajQueryGestures = _$element.data('ojQueryGestures');

		// var _oEventData = _oDatajQueryGestures[_sType];
		// store current values for calculating relative values (changes between touchmoveevents)
		var _oObj = {};
		_oObj.oStartTouch = {timestamp:new Date().getTime()};
		_$element.data('ojQueryGestures',$.extend(true,_oDatajQueryGestures,_oObj));
	}

	/**
	* Handler: gesturechange
	* Read the event_.scale / event_.rotate values,
	* an triggers a pinch|rotate event if necessary.
	* Since the gesture-event doesn't supply event.touches no tuchpoints will be calculated
	* @returns {Object}
	*			{
	*				type: eventtype e.g. "pinch","rotate",
	*				originalEvent: {DOM-Event},
	*				// delta and direction details are just provided for touch not for gesture / motion events
	*				delta : null,
	*				direction : {
	*					vector: {Number}, // -1|+1, indicates the direction if necessary(pinch/rotate)
	*					 orientation: {Number} // window.orientation: -90,0,90,180 || null (window.orienntation)
	*				 },
	*				rotation: {Number} , //  amount of rotation relative to the current position NOT the original
	*				scale: {Number} , // amount of scaling relative to the current position NOT the original
	*				duration: {Number}, // ms: relative to the original touchpoint
	*				description : {String} // details as String: pinch:{'close'|'open'} e.g. "pinch:-1:close" ||  rotate:{'counterclockwise'|'clockwise'} e.g. "rotate:-1:counterclockwise"
	*			};
	* @param {DOM-Event} event_
	* @return {Void}
	*/
	function _onGesturechange(event_) {

		// ignore bubbled handlers
		// if ( event_.currentTarget !== event_.target ) { return; }

		var _$element = jQuery(event_.currentTarget);
		// var _$element = jQuery(event_.target);
		var _iDelta,_iDirection,_sDesc,_oDetails;
		// get all pseudo events
		var _oDatajQueryGestures = _$element.data('ojQueryGestures');

		// trigger events for all bound pseudo events on this element
		var _sType;
		for (_sType in _oDatajQueryGestures) {

			// trigger a specific bound event
			switch(_sType) {

				case 'pinch':
					_iDelta = event_.scale;
					if ( ( ( _iDelta < 1 ) && (_iDelta % 1) < (1 - $.jGestures.defaults.thresholdPinchclose) ) || ( ( _iDelta > 1 ) && (_iDelta % 1) > ($.jGestures.defaults.thresholdPinchopen) ) ) {
						_iDirection = (_iDelta < 1 ) ? -1 : +1 ;
						_oDetails = _createOptions({type: 'pinch', scale: _iDelta, touches: null,startMove:_oDatajQueryGestures.oStartTouch, event:event_, timestamp: _oDatajQueryGestures.oStartTouch.timestamp, vector:_iDirection, description: ['pinch:',_iDirection,':' , ( (_iDelta < 1 ) ? 'close' : 'open' )].join('') });
						_$element.triggerHandler(_oDetails.type, _oDetails);
					}
				break;

				case 'rotate':
					_iDelta = event_.rotation;
					if ( ( ( _iDelta < 1 ) &&  ( -1*(_iDelta) > $.jGestures.defaults.thresholdRotateccw ) ) || ( ( _iDelta > 1 ) && (_iDelta  > $.jGestures.defaults.thresholdRotatecw) ) ) {
						_iDirection = (_iDelta < 1 ) ? -1 : +1 ;
						_oDetails = _createOptions({type: 'rotate', rotation: _iDelta, touches: null, startMove:_oDatajQueryGestures.oStartTouch, event:event_, timestamp: _oDatajQueryGestures.oStartTouch.timestamp, vector:_iDirection, description: ['rotate:',_iDirection,':' , ( (_iDelta < 1 ) ? 'counterclockwise' : 'clockwise' )].join('') });
						_$element.triggerHandler(_oDetails.type, _oDetails);
					}
				break;

			}
		}

	}


	/**
	* Handler: gestureend
	* Read the event_.scale / event_.rotate values,
	* compares it to $.jGestures.defaults.threshold* and triggers
	* a pinchclose|pinchclose|rotatecw|rotateccw event if the distance exceed the
	* Since the gesture-event doesn't supply event.touches no tuchpoints will be calculated
	* * Custom-event argument object:
	* @returns {Object}
	*			{
	*				type: eventtype e.g. "pinchclose","pinchopen", "rotatecw", "rotateccw",
	*				originalEvent: {DOM-Event},
	*				// delta and direction details are just provided for touch not for gesture / motion events
	*				delta : null,
	*				// based on the first touchpoint
	*				direction : {
	*					vector: {Number}, // -1|+1, indicates the direction if necessary(pinch/rotate)
	*					orientation: {Number} // window.orientation: -90,0,90,180 || null (window.orienntation)
	*				},
	*				rotation: {Number} , //  amount of rotation relative to the current position NOT the original
	*				scale: {Number} , // amount of scaling relative to the current position NOT the original
	*				duration: {Number}, // ms: relative to the original touchpoint
	*				description : {String} // details as String: pinch:{'close'|'open'} e.g. "pinch:-1:close" ||  rotate:{'counterclockwise'|'clockwise'} e.g. "rotate:-1:counterclockwise"
	*			};
	* @param {DOM-Event} event_
	* @return {Void}
	*/
	function _onGestureend(event_) {
		// ignore bubbled handlers
		// if ( event_.currentTarget !== event_.target ) { return; }

		var _$element = jQuery(event_.currentTarget);
		// var _$element = jQuery(event_.target);

		// trigger custom notification
		_$element.triggerHandler($.jGestures.events.gestureendStart,event_);

		var _iDelta;
		var _oDatajQueryGestures = _$element.data('ojQueryGestures');

		// trigger handler for every bound event
		var _sType;
		for (_sType in _oDatajQueryGestures) {

			switch(_sType) {

				case 'pinchclose':
					_iDelta = event_.scale;
					if (( _iDelta < 1 ) && (_iDelta % 1) < (1 - $.jGestures.defaults.thresholdPinchclose)) {
						_$element.triggerHandler('pinchclose', _createOptions ({type: 'pinchclose', scale:_iDelta, vector: -1, touches: null, startMove: _oDatajQueryGestures.oStartTouch, event:event_, timestamp:_oDatajQueryGestures.oStartTouch.timestamp,description: 'pinch:-1:close' }) );
					}
				break;

				case 'pinchopen':
					_iDelta = event_.scale;
					if ( ( _iDelta > 1 ) && (_iDelta % 1) > ($.jGestures.defaults.thresholdPinchopen) ) {
						_$element.triggerHandler('pinchopen', _createOptions ({type: 'pinchopen', scale:_iDelta, vector: +1, touches: null, startMove: _oDatajQueryGestures.oStartTouch, event:event_, timestamp:_oDatajQueryGestures.oStartTouch.timestamp,description: 'pinch:+1:open'}) );
					}
				break;

				case 'rotatecw':
					_iDelta = event_.rotation;
					if ( ( _iDelta > 1 ) && (_iDelta  > $.jGestures.defaults.thresholdRotatecw) ) {
						_$element.triggerHandler('rotatecw', _createOptions ({type: 'rotatecw', rotation:_iDelta, vector: +1, touches: null, startMove: _oDatajQueryGestures.oStartTouch, event:event_, timestamp:_oDatajQueryGestures.oStartTouch.timestamp,description: 'rotate:+1:clockwise'}) );
					}
				break;

				case 'rotateccw':
					_iDelta = event_.rotation;
					if ( ( _iDelta < 1 ) &&  ( -1*(_iDelta) > $.jGestures.defaults.thresholdRotateccw ) ) {
							_$element.triggerHandler('rotateccw', _createOptions ({type: 'rotateccw', rotation:_iDelta, vector: -1, touches: null, startMove: _oDatajQueryGestures.oStartTouch, event:event_, timestamp:_oDatajQueryGestures.oStartTouch.timestamp,description: 'rotate:-1:counterclockwise'}) );
						}
				break;

				}
			}
			_$element.triggerHandler($.jGestures.events.gestureendProcessed,event_);
		}
	}
)(jQuery);

///<jscompress sourcefile="stats.js" />
// stats.js - http://github.com/mrdoob/stats.js
var Stats=function(){var l=Date.now(),m=l,g=0,n=Infinity,o=0,h=0,p=Infinity,q=0,r=0,s=0,f=document.createElement("div");f.id="stats";f.addEventListener("mousedown",function(b){b.preventDefault();t(++s%2)},!1);f.style.cssText="width:80px;opacity:0.9;cursor:pointer";var a=document.createElement("div");a.id="fps";a.style.cssText="padding:0 0 3px 3px;text-align:left;background-color:#002";f.appendChild(a);var i=document.createElement("div");i.id="fpsText";i.style.cssText="color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";
i.innerHTML="FPS";a.appendChild(i);var c=document.createElement("div");c.id="fpsGraph";c.style.cssText="position:relative;width:74px;height:30px;background-color:#0ff";for(a.appendChild(c);74>c.children.length;){var j=document.createElement("span");j.style.cssText="width:1px;height:30px;float:left;background-color:#113";c.appendChild(j)}var d=document.createElement("div");d.id="ms";d.style.cssText="padding:0 0 3px 3px;text-align:left;background-color:#020;display:none";f.appendChild(d);var k=document.createElement("div");
k.id="msText";k.style.cssText="color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";k.innerHTML="MS";d.appendChild(k);var e=document.createElement("div");e.id="msGraph";e.style.cssText="position:relative;width:74px;height:30px;background-color:#0f0";for(d.appendChild(e);74>e.children.length;)j=document.createElement("span"),j.style.cssText="width:1px;height:30px;float:left;background-color:#131",e.appendChild(j);var t=function(b){s=b;switch(s){case 0:a.style.display=
"block";d.style.display="none";break;case 1:a.style.display="none",d.style.display="block"}};return{REVISION:11,domElement:f,setMode:t,begin:function(){l=Date.now()},end:function(){var b=Date.now();g=b-l;n=Math.min(n,g);o=Math.max(o,g);k.textContent=g+" MS ("+n+"-"+o+")";var a=Math.min(30,30-30*(g/200));e.appendChild(e.firstChild).style.height=a+"px";r++;b>m+1E3&&(h=Math.round(1E3*r/(b-m)),p=Math.min(p,h),q=Math.max(q,h),i.textContent=h+" FPS ("+p+"-"+q+")",a=Math.min(30,30-30*(h/100)),c.appendChild(c.firstChild).style.height=
a+"px",m=b,r=0);return b},update:function(){l=this.end()}}};

