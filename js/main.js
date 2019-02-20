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
switchSearchEngin();

// 下面是工具函数
function init(){
    var keys = {
        0 : ['q','w','e','r','t','y','u','i','o','p'],
        1 : ['a','s','d','f','g','h','j','k','l'],
        2 : ['z','x','c','v','b','n','m'],
        length : 3
    }
    var hash = {
        q : 'qq.com',
        w : 'wangdoc.com',
        e : undefined,
        r : 'react-juejin.foreversnsd.cn',
        t : 'tgideas.qq.com/doc/',
        y : 'youtube.com',
        i : 'iciba.com',
        o : undefined,
        p : undefined,
        a : undefined,
        s : 'segmentfault.com',
        d : 'dribbble.com',
        f : undefined,
        g : 'github.com',
        h : undefined,
        j : 'jianshu.com',
        k : 'ke.qq.com',
        l : undefined,
        z : 'zhihu.com',
        x : 'xiedaimala.com',
        c : 'csdn.net',
        v : undefined,
        b : 'bilibili.com',
        n : undefined,
        m : 'mail.163.com'
    }
	//取出localStorage里面的zzz对应的hash 
    var hasInLocalStorage = getFromLocalStorage('zzz');
    if(hasInLocalStorage){
        hash = hasInLocalStorage;
    }
    return {
        'keys' : keys,
        'hash' : hash
    }
}

function generateKeyBoard(keys,hash){
    for(var index = 0;index < keys['length'];index = index + 1){//0 1 2
        var div = tag('div');
        div.className = 'row';

        main.appendChild(div);

        var row = keys[index];
        for(var index2 = 0;index2 < row['length'];index2=index2+1){//将固定的10换成可控制的
            var span = createSpan(row[index2]);

            var img = createImage(hash[row[index2]]);

            var button = createButton(row[index2]);

            var kbd = tag('kbd');
            var kbd_wrapper = tag('div');
            kbd.className = 'key';

            if(hash[row[index2]] === undefined){
                kbd.setAttribute('title','未设置网站导航');
            }else{
                kbd.setAttribute('title',hash[row[index2]]);
            }

            kbd.onclick = function(e){
                var website = e.currentTarget.getAttribute('title');
                if (website === '未设置网站导航') {
                    alert('请编辑此按键的网站再跳转')
                } else {
                    window.open('http://' + website, "_blank");
                }
            }
            kbd_wrapper.className = 'kbd_wrapper';

            kbd.appendChild(span);
            kbd.appendChild(img);
            kbd.appendChild(button);
            kbd_wrapper.appendChild(kbd);
            div.appendChild(kbd_wrapper);
        }
    }
}
function listenToUser(hash){
    var ifInputting = false;
    var inputBar = document.getElementById('inputBar');
    var searchBtn = document.querySelector('.searchBtn');
    inputBar.addEventListener('focus',function(e){
        ifInputting = true;
        e.target.placeholder = '';    
    })
    inputBar.addEventListener('focusout',function(e){
        ifInputting = false;
        e.target.placeholder = '点击左边图标切换搜索引擎';
    })
    searchBtn.onclick = function(e){
        e.preventDefault();
        var searchContent = inputBar.value;
        // 判断是什么搜索引擎
        var searchEnginLogo = document.getElementById('searchEnginLogo');
        var engin = searchEnginLogo.getAttribute('data-engin');
        switch (engin) {
            case 'baidu':
                window.open("https://www.baidu.com/s?wd="+searchContent,'_blank');
                break;
            case 'google':
                window.open("https://www.google.com/search?q="+searchContent,'_blank');
                break;
        }
    }

    document.onkeypress = function(xyz){
        var key = xyz['key'];
        var website = hash[key];
        // && website !== undefined
        if(!ifInputting){
            if (website === undefined) {
                alert('请编辑此按键的网站再跳转')
            } else {
                // window.open('http://' + website, "_blank");
                setTimeout(function(){
                    window.open('http://'+website,'_blank')	//新窗口打开网页	
                },500)
            }
        }
    }
}
function getFromLocalStorage(name){
    return JSON.parse(localStorage.getItem(name) || 'null');
}
function tag(tagName){
    var element = document.createElement(tagName);
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
        button.textContent = 'e';
        button.id = id;
        button.onclick = function(e){
            //阻止事件冒泡
            e.stopPropagation();
            var button2 = e['target'];
            var img2 = button2.previousSibling;
            //获取当前的id
            var key = button2['id'];
            //用户输入一个网址
            var web = prompt('请输入一个网址：');
            //将原来的hash给替换掉
            hash[key] = web;
            img2.src = 'http://' + web + '/favicon.ico';
            e.target.src = './image/dot.png';
            localStorage.setItem('zzz',JSON.stringify(hash));
        }
    
    return button;
}
function createImage(domain){//hash[row[index2]]
    var img = tag('img');
    if(domain){
        img.src = 'http://' + domain + '/favicon.ico';
    }else{
        img.src = './image/dot.png';
    }
    img.onerror = function(xyz){
        xyz.target.src = './image/dot.png';
    }
    return img;
}

// 切换搜索引擎
function switchSearchEngin() {
    var ifSwitch = false;
    // false代表要切换成引擎google，true代表要切换成引擎baidu
    var searchEnginLogo = document.getElementById('searchEnginLogo');
    var baiduLogo = document.querySelector('#searchEnginLogo li:nth-child(1)');
    var googleLogo = document.querySelector('#searchEnginLogo li:nth-child(2)');
    var baiduPic = document.querySelector('#searchEnginPic li:nth-child(1)');
    var googlePic = document.querySelector('#searchEnginPic li:nth-child(2)');
    searchEnginLogo.setAttribute('data-engin','baidu');
    searchEnginLogo.onclick = function(){
        if (!ifSwitch) {
            // baidu --> google
            baiduLogo.classList.remove('active');
            googleLogo.classList.add('active');
            baiduPic.classList.remove('active');
            googlePic.classList.add('active');
            searchEnginLogo.setAttribute('data-engin','google');
        }else{
            // google --> baidu
            googleLogo.classList.remove('active');
            baiduLogo.classList.add('active');
            googlePic.classList.remove('active');
            baiduPic.classList.add('active');
            searchEnginLogo.setAttribute('data-engin','baidu');
        }
        ifSwitch = !ifSwitch;
    }
}
