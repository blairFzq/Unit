//by fei create
//获得当前样式无论是外联还是内嵌的，可以获得复合样式（满足：fontSize）;
function getStyle(obj,attr){
//forIE
    if(obj.currentStyle){
        return obj.currentStyle[attr];
    }
//for ff
    else{
        return obj.ownerDocument.defaultView.getComputedStyle(obj,null)[attr];
    }

}
//缓冲运动的运动框架并且可以取任意值的运动框架
function startMove(obj,target,attr){
//若元素有定时器则先清除，若无则加上这个属性
    if(obj.timer){ clearInterval(obj.timer);}
    else{obj.timer = null}

    obj.timer = setInterval(function(){
//style代表当前样式的属性值
            var style  = null;
            var speed = null;
            if(attr == "opacity"){
                style = getStyle(obj,attr)*100||1;
//opacity:0.1的小数，在电脑内存中小数及其容易出错，所以一定要避免
                speed = (target*100 - style)/10;
            }
            else{
                style = parseInt(getStyle(obj,attr))|| 0;
                speed = (target - style)/10;
                //向下或向上取整，是因为小数容易出错，在像素为单位的世界里小数会被直接舍弃
                speed = speed>0?Math.ceil(speed):Math.floor(speed);
            }
            if(style == target){
                clearInterval(obj.timer);
            }
            else{
                if(attr == "opacity"){
                    obj.style[attr] =  (style +speed)/100;
                    //兼容ie
                    obj.style.filter = "filter:alpha(opacity="+ (style +speed)/10 +")";
                    console.log("改变之后的透明度"+obj.style.opacity);
                }
                else{
                    obj.style[attr] = style+speed+"px";
                }

            }
        }
        ,10)
}

//dom操作
function getNodeByClassName(node,className){
    var result = [];
    var i,len,j;
    if(node.getElementsByClassName){
        return node.getElementsByClassName(className);
    }
    else{
        var allNode = node.getElementsByTagName("*");
        for(i=0,len=allNode.length;i<len;i++){
            var allClassName = allNode[i].className.split(/\+s/);
            for(j=0;j<allClassName.length;j++){
                if(allClassName[j] == className){result.push(allNode[i]);}
            }
        }
    }
    return result;

}
function getChildByClassname(node,classname){
    var childNodes = getChild(node);
    var result = [];
    var nodeClassName=[];
    //如果没有孩子节点返回null
    if(childNodes.length == 0){
        return null;
    }
    else{
        for(var i = 0,len=childNodes.length;i<len;i++){
            nodeClassName = childNodes[i].className.split(" ");
            if(nodeClassName.length == 0){return null}
            else{
                for(var j= 0,lenj=nodeClassName.length;j<lenj;j++){
                    if(nodeClassName[j] == classname){
                        result.push(childNodes[i]);
                    }
                }
            }
        }
    }

    if(result.length == 1){return result[0]}
    else{return  result;}

}
//获得兄弟节点，排除其他节点特别是空白节点
function getPreNode(node){
    if(node.previousSibling === null){
        return null;
    }else{
        var preNode = node.previousSibling;
        if(preNode.nodeType !=1){
            while(preNode.nodeType!= 1){
                preNode = preNode.previousSibling;
            }
        }
        return preNode;
    }
}

function getNextNode(node){
    if(node.nextSibling === null){
        return null;
    }else{
        var preNode = node.nextSibling;
        if(preNode.nodeType !=1){
            while(preNode.nodeType!= 1){
                preNode = preNode.nextSibling;
                if(preNode==null){return null;}
            }
        }
        return preNode;
    }
}

function getFirsrChild(node){
    var child = getChild(node);
    if(child.length == 0){return null}
    else{return child[0]}
}
function getLastChild(node){
    var child = getChild(node);
    if(child.length == 0){return null}
    else{return child[child.length-1]}
}
//删除子元素中除了元素节点外的其他节点（例如空白节点注释节点文本节点),返回结果数组
//未找到元素时候，返回空数组
function  getChild(node){
    var childNodes = node.childNodes;
    var child = [];
    var len=childNodes.length;
    for(var i= 0;i<len;i++){
        if(childNodes[i].nodeType == 1){
            child.push(childNodes[i]);
        }
    }
    return child;
}

function addClassName(node,className){
    //用flag标志是否含有这个类名，防止反复添加同一个类名
    var flag = false;
    var nodeClass = node.className.split(/\s+/);
    var i,len;
    for(i=0,len=nodeClass.length;i<len;i++){
        if(className == nodeClass[i]){
            flag = true;
        }
    }
    if(flag == false){
        node.className = node.className +" "+className;
    }
}

function removeClassName(node,Name){
    var classNames = node.className.split(/\s+/);
    var   pos = -1,
        i,
        len;
    for(i=0,len=classNames.length;i<len;i++){
        if(classNames[i] == Name){pos=i;break}
    }
    alert(classNames);
    //无法删除为什么？
    classNames.splice(pos,2);
    //classNames = classNames.join(" ");
}


//dom事件对象
var  EventUtil = {
    //给元素添加事件，参数为要操作的元素、事件类型、执行函数
    addHandler:function(node,tpye,handler){
        if(node.addEventListener){node.addEventListener(type,handler,false)}
        else if(node.attachEvent){node.attachEvent("on"+type,handler);}
        else{node["on"+type] = handler;}
    },
    removeHandler:function(node,type,handler){
        if(node.removeEventListener){node.removeEventListener(type,handler,false);}
        else if(node.attachEvent){node.detachEvent();}
        else{node["on"+type] = null;}
    },
    //取消时间默认行为
    preventDefault:function(event){
        if(event.preventDefault){event.preventDefault()}
        else{event.returnValue = false;}
    },
    //阻止冒泡
    stopPropagation :function(event){
        if(event.stopPropagation){event.stopPropagation();}
        else{event.cancleBubble = true;}
    },
    //取得实际目标元素
    getTarget:function(event){return event.target||event.srcELement;}
};


//用于替换部分字符串
function replaceStrPart(str,targetStr,replaceStr){
    str = str.split("/");
    for(var i = 0;i<str.length;i++){
        if(str[i] == targetStr){
            str[i] = replaceStr;
        }
    }
    str = str.join("/");
    return str;
}

function addURLParam(url,name,value){
    url +=   url.indexOf("?")== -1 ? "?":"&";
    url +=encodeURIComponent(name)+"="+encodeURIComponent(value);
    return url;
}

/*ajax函數
 * data，表示传递给后台的数据,name=milk&age=17,data可能没有
 * sucess,表示回调函数
 *         */
function getAjax(method,url,success,data){
    var xml;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xml=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xml=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xml.onreadystatechange = function(){
        if(xml.readyState==4){
            if((xml.status >= 200&&xml.status<300)  ||xml.status == 304 ){
                success(xml.responseText);
            }
            else{
                console.log(xml.statusText);
                console.log(xml.status);
            }
        }
    };
    if(method == "get"){
        if(data){url = url+"?"+data}
        xml.open("GET",url,true);
        xml.send(null);
    }
    else{
        xml.open("POST",url,true);
        xml.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        if(data){xml.send(data);}
        else{xml.send(null);}

    }

}


/*获取元素距离页面的偏移量*/
function getElementLeft(dom){
    var offsetLeft = dom.offsetLeft;
    var current = dom.offsetParent;
    var body = document.body;
    while(current!= body ){
        current = dom.offsetParent;
        offsetLeft += current.offsetLeft;
        tes = current.parentNode;
    }
    return offsetLeft;
}
function getElementTop(dom){
    var offsetTop = dom.offsetTop;
    var current = dom.offsetParent;
    var body = document.body;

    while(current!= body){
        current = dom.offsetParent;
        offsetTop += current.offsetTop;
    }
    return offsetTop;
}
/*获取浏览器类别，火狐，chrome,ie*/
function getBrowser(){
    var browser;
    if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)){
        browser = "ie";
     }
    else if (navigator.userAgent.indexOf('Firefox') >= 0){
        browser = "Firefox";
    }
    else if (navigator.userAgent.indexOf('Opera') >= 0){alert('你是使用Opera')}else
    {
        //其他浏览器主要是chrome或者opera
        browser = "chrome"
    }
    return browser;
}