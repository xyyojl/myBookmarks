/*
思路：
    1. 分析页面，使用什么数据结构
    2. 使用JS自动生成标签，不用手动写，生成三个div，每个div里面有对应的个数的kbd
    3. 可以假设kbd是一样，然后将固定的个数修改对应的多少个
    4. 使用css美化界面
    5. 封装函数，优化代码

*/
//1.初始化数据
var hashA = init();
var keys = hashA['keys'];
var hash = hashA['hash'];

//2.生成键盘
generateKeyBoard(keys,hash);


//3.监听用户动作
//要监听谁的键盘事件 main还是document，需要知道用户按的是什么键
//key的兼容性不是很好
listenToUser(hash);



// 下面是工具函数
function init(){
    var keys = {
        '0' : {0:'q',1:'w',2:'e',3:'r',4:'t',5:'y',6:'u',7:'i',8:'o',9:'p',length:10},
        '1' : {0:'a',1:'s',2:'d',3:'f',4:'g',5:'h',6:'j',7:'k',8:'l',length:9},
        '2' : {0:'z',1:'x',2:'c',3:'v',4:'b',5:'n',6:'m',length:7},
        'length' : 3
    }
    var hash = {
        q : 'qq.com',
        w : 'weibo.com',
        e : 'ele.me',
        t : 'tianya.cn',
        y : 'youtube.com',
        u : 'uc.cn',
        i : 'iqiyi.com',
        o : 'opera.com',
        p : 'python.org',
        a : 'acfun.cn',
        s :  undefined,
        d : 'dilidili.wang',
        z : 'zhihu.com',
        x : 'xiaohuochai.cc',
        c : 'csdn.net',
        m : 'meizu.com'
    }
    //取出localStorage中的zzz对应的hash
    var hashInLocalStorage = getFormLocalStorage('zzz');
    if(hashInLocalStorage){
        hash = hashInLocalStorage;
    }
    return {
        'keys':keys,
        'hash':hash
    }
}
function generateKeyBoard(keys,hash){
    for(var index = 0;index < keys['length'];index = index + 1){//0 1 2
        var div = tag('div');
        div.className = 'row';

        main.appendChild(div);

        var row = keys[index];
        // console.log(keys[index]['length']);
        for(var index2 = 0;index2 < row['length'];index2=index2+1){//将固定的10换成可控制的
            var span = createSpan(row[index2]);

            var img = createImage(hash[row[index2]]);

            var button = createButton(row[index2]);

            var kbd = tag('kbd');
            kbd.className = 'key';

            kbd.appendChild(span);
            kbd.appendChild(img);
            kbd.appendChild(button);
            div.appendChild(kbd);
        }
    }
}
function listenToUser(hash){
    document.onkeypress = function(xyz){
        var key = xyz['key'];
        var website = hash[key];
        window.open('http://'+website,'_blank');
    }
}
function getFormLocalStorage(name){
    return JSON.parse(localStorage.getItem(name) || null)
}
function tag(tagName){
    var element = document.createElement(tagName);
    return element;
}
function tag1(tagName,attributes){
    var element = document.createElement(tagName);
    for(var key in attributes){
        element[key] = attributes[key];
    }
    return element;
}
function createSpan(textContent){
    var span = tag('span');
    span.textContent = textContent;//第一个数组 第二个数组 第三个数组
    span.className = 'text';
    return span;
}
function createButton(id){
    var button = tag('button');
        button.textContent = '编辑';
        button.id = id;
        button.onclick = function(xyz){
            var button2 = xyz['target'];
            var img2 = button2.previousSibling;
            //获取当前的id
            var key = button2['id'];
            //用户输入一个网址
            var web = prompt('请输入一个网址：');
            //将原来的hash给替换掉
            hash[key] = web;
            img2.src = 'http://' + web + '/favicon.ico';
            xyz.target.src = '//i.loli.net/2017/11/10/5a05afbc5e183.png';
            localStorage.setItem('zzz',JSON.stringify(hash));
        }
    return button;
}
function createImage(domain){//hash[row[index2]]
    var img = tag('img');
    if(domain){
        img.src = 'http://' + domain + '/favicon.ico';
    }else{
        img.src = '//i.loli.net/2017/11/10/5a05afbc5e183.png';
    }
    img.onerror = function(xyz){
        xyz.target.src = '//i.loli.net/2017/11/10/5a05afbc5e183.png';
    }
    return img;
}
