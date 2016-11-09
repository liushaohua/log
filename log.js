(function () {
    //参数对象，拼接参数串Str
    var params = {},
        args = '',
        load_time = {
            date: new Date(),
            start: new Date().getTime()
        };

    //Document对象数据
    if(document) {
        params.d = window.location.host || '';
        params.url = document.URL || '';
        //params.title = document.title || '';
        //params.ua = navigator.userAgent || '';
        var ref = (document.referrer || '').split('/'),
            ref_arr = [],
            rd = ref_arr.concat(ref[0],ref[1],ref[2]).join('/');
        params.rd = (rd == '//' ? '': rd);
        params.rd = params.rd.replace('http://','').replace('https://','');
    }
    //Window对象数据
    if(window && window.screen) {
        params.sh = window.screen.height || 0;
        params.sw = window.screen.width || 0;
    }
    //navigator对象数据
    if(navigator) {
        //params.lang = navigator.language || '';
    }

    //解析_maq配置
    if(window._maq) {
        for(var i in _maq) {
            switch(_maq[i][0]) {
                case '_setAccount':
                    params.account = _maq[i][1];
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * [_util 通用方法]
     * @type {Object}
     */
    var _util = {
        isNew: 0,
        dom: {
            /**
             * [$ 通过class获取dom]
             * @param  {[string]} sClass  [class名称]
             * @param  {[dom]} oParent [父dom]
             * @return {[array]}         [dom数组]
             */
            $: function (sClass, oParent) {
                oParent = oParent || document;
                var aResult = [];
            	var aEle = oParent.getElementsByTagName('*');
                var reg = new RegExp('\\b' + sClass + '\\b', 'i');

            	for(var i = 0, l = aEle.length; i < l; i++) {
                    reg.test(aEle[i].className) && (aResult.push(aEle[i]));
            	}

            	return aResult;
            },
            /**
             * [hasClass 是否包含class]
             * @param  {[string]}  sClass [className]
             * @param  {[dom]}  oEle   [dom元素]
             * @return {Boolean}        [yes/true]
             */
            hasClass: function (sClass,oEle) {
                var reg = new RegExp('\\b' + sClass + '\\b', 'i');

                if (reg.test(oEle.className)) {
                    return true;
                }
                return false;
            }
        },


        /**
         * [addEventHandler 事件注册]
         * @param {[element]} eObj [dom元素]
         * @param {[string]} sEventType [事件类型]
         * @param {[function]} fnHandler  [触发函数]
         */
        addEventHandler: function(eObj, sEventType, fnHandler) {
           if (document.addEventListener) {
               eObj.addEventListener(sEventType, fnHandler, false);
           }
           else if (document.attachEvent) {
               eObj.attachEvent("on" + sEventType, fnHandler);
           }
           else {
               eObj["on" + sEventType] = fnHandler;
           }
       },

        /**
         * [getCookie 获取cookie]
         * @param  {[string]} name [名称]
         * @return {[string]}      [对应的value]
         */
        getCookie: function(name) {
             var cookieName = encodeURIComponent(name) + "=",
                 cookieStart = document.cookie.indexOf(cookieName),
                 cookieValue = null;

             if (cookieStart > -1) {
                 var cookieEnd = document.cookie.indexOf(";", cookieStart);
                 if (cookieEnd == -1) {
                     cookieEnd = document.cookie.length;
                 }
                 cookieValue = decodeURIComponent(escape(document.cookie.substring(cookieStart + cookieName.length, cookieEnd)));
             }

             return cookieValue;
        },

        /**
         * [setCookie 设置cookie]
         * @param {[strin]} name    [名称]
         * @param {[number]} value   [值]
         * @param {[{}]} expires [过期时间obj]
         * @param {[string]} path    [路径]
         * @param {[string]} domain  [主域]
         * @param {[string]} secure  [secure]
         * @return {[obj]}      [_util]
         */
        setCookie: function(name, value, expires, path, domain, secure) {
             var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value),
                 exp = new Date();

             if (expires.type == 'day') {
                 exp.setTime(exp.getTime() + expires.value * 86400000);
             } else {
                 exp.setTime(exp.getTime() + expires.value * 60 * 1000);
             }

             if (exp instanceof Date) {
                 cookieText += "; expires=" + exp.toGMTString();
             }

             if (path) {
                 cookieText += "; path=" + path;
             }

             if (secure) {
                 cookieText += "; secure";
             }

             if (name) {
                 cookieText +=  "; domain=." + window.location.hostname + "; path=/";
             }

             document.cookie = cookieText;

             return this;
        },

        /**
         * [removeCookie remove Cookie]
         * @param  {[string]} name   [name]
         * @param  {[string]} path   [path]
         * @param  {[string]} domain [domain]
         * @param  {[string]} secure [secure]
         * @return {}        [description]
         */
        removeCookie: function(name, path, domain, secure) {
            this.setCookie(name, '', {type: 'minute', value: 0}, path, domain, secure);
        },

        /**
         * [guid get uuid]
         * @return {[string]} [uuid]
         */
        guid: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        },

        //设置session
        setConsole: function () {
            window.__session =  _util.getCookie('UUID').split('.').join('|');
        },

        getNowFormatDate: function(d) {
            var date = d || new Date(),
                seperator1 = "-",
                seperator2 = ":",
                month = date.getMonth() + 1,
                strDate = date.getDate(),
                getSec = date.getSeconds(),
                add0 = function (n) {
                    return (n < 10? '0'+ n: n );
                };
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                    + " " + add0(date.getHours()) + seperator2 + add0(date.getMinutes())
                    + seperator2 + add0(getSec);
            return currentdate;
        },

        /**
         * [logInputFn input埋点触发方法]
         * @return {[type]} [description]
         */
        logInputFn: function() {
            var aInput = document.getElementsByTagName('input'),
                _this = this;
            for (var i = 0, l = aInput.length; i < l; i++) {
                var oInput = aInput[i];
                if (oInput.getAttribute('dc')) {
                    oInput.onblur = function () {
                        var dc = eval('(' + this.getAttribute('dc') + ')');
                        dc.value = this.value;
                        _this.sendLog('blur', dc);
                    }
                }
            }
        },

        /**
         * [logBtnFn 埋点btn触发方法]
         * @return {} []
         */
        logBtnFn: function() {
            var _this = this;

            _this.addEventHandler(document, 'click', function(ev) {
                var ev = ev || window.event,
                    target = ev.srcElement || ev.target;

                if (target.getAttribute('dc')) {
                    _this.sendLog('click', eval('(' + target.getAttribute('dc') + ')'));
                }
            });

            setTimeout(function () {
                window.__MisLog = _this.sendLog;
            },50);
        },

        /**
         * [put_img 发送img]
         * @param  {[boject]} paramsObj [参数对象]
         * @return {}           [description]
         */
        put_img: function(paramsObj) {
            paramsObj = paramsObj || {};
            paramsObj.pid = _util.pid;
            //paramsObj.domain = _util.pid;

            var args = '';

            for(var i in paramsObj) {
                if(args != '') {
                    args += '&';
                }
                args += i + '=' + encodeURIComponent(paramsObj[i]);
            }

            if (_util.isLoad) {
                delete params.sh;
                delete params.sw;
                delete params.domain;
                //delete params.rd;

                _util.isLoad = 0;
            }


            //设置VD
            if (+_util.getCookie('STEP') == 1) {
                var vd = params.rd.replace('http://','').replace('https://','') || '';
                _util.setCookie('VD', vd, {
                    type: 'day',
                    value: 180
                });
                params.vd = vd;
            } else {
                params.vd = _util.getCookie('VD') || '';
            }

            for(var i in params) {
                if(args != '') {
                    args += '&';
                }
                args += i + '=' + encodeURIComponent(params[i]);
            }

            _util.isLoad = 1;

            //Image send
            var img = new Image(1, 1);

            img.src = 'http://testlog.58corp.com/1.gif?' + args;
        },

        /**
         * [sendLog send log]
         * @param  {[string]} type  [view time]
         * @param  {[object]} param [param obj]
         * @return {}       [description]
         */
        sendLog: function (type, param) {
            var _this = this;

            param = param || {};
            //have uuid && set param
            if (_util.getCookie('UUID')) {
                param.uuid =  _util.getCookie('UUID').split('.')[0];
            }

            //view
            if (arguments.length == 0) {
                type = type || 'view';
            //手动触发
            } else if (typeof arguments[0] == 'object') {
                _util.put_img(eval('(' + arguments[0].getAttribute('dc') + ')'));
                return;
            }

            if (type == 'time') {
                load_time.end = new Date().getTime();
                var difference = load_time.end - load_time.start;

                param.lt = difference;
                param.st = _util.getNowFormatDate(load_time.date);

                _this.put_img(param);
            } else if (type == 'unload') {
                param.st = _util.getNowFormatDate(load_time.date);
                param.et = _util.getNowFormatDate(new Date());

                _this.put_img(param);
            } else if (type == 'click' || type == 'blur') {
                _this.put_img(param);
            } else {
                //没有UUID-新用户
                if (!_util.getCookie('UUID')) {

                    var _uuid = _this.guid() + '.1';

                    //是新用户
                    _util.isNew = 1;

                    //设置UUID
                    _util.setCookie('UUID', _uuid, {
                        type: 'day',
                        value: 180
                    });

                    //设置VISITING
                    /*_util.setCookie('VISITING', 1, {
                        type: 'day',
                        value: 180
                    });*/

                    //设置STEP
                    _util.setCookie('STEP', 1, {
                        type: 'minute',
                        value: 30
                    });

                    //update到控制台
                    this.setConsole();
                } else {
                    // have UUID-老用户-180天有效
                    //设置UUID
                    _util.setCookie('UUID', _util.getCookie('UUID'), {
                        type: 'day',
                        value: 180
                    });

                    //don't have SETP步长
                    if(!_util.getCookie('STEP')) {
                        //设置SETP 30分钟 ++
                        _util.setCookie('UUID', _util.getCookie('UUID').split('.')[0] + '.' +(+_util.getCookie('UUID').split('.')[1] + 1), {
                            type: 'day',
                            value: 180
                        });

                        //not have SETP
                        //设置STEP 1
                        _util.setCookie('STEP', 1, {
                            type: 'minute',
                            value: 30
                        });
                    } else {
                        //have SETP
                        _util.setCookie('STEP', +_util.getCookie('STEP') + 1, {
                            type: 'minute',
                            value: 30
                        });
                    }
                }

                _util.pid = _util.getCookie('UUID').split('.')[0] + new Date().getTime();

                _this.put_img({
                    'uuid': _util.getCookie('UUID').split('.')[0],
                    'sid': _util.getCookie('UUID').split('.').join('|'),
                    'st': _util.getNowFormatDate(load_time.date),
                    'v': +_util.getCookie('UUID').split('.')[1],
                    's': _util.getCookie('STEP'),
                    'nu': _util.isNew
                },1);
            }

        }
    };

    /**
     *  pageInit
     */
     _util.sendLog();


    /**
     * pageLoad后send日志
     */
    _util.addEventHandler(window, 'load', function() {
        //send page load
        _util.sendLog('time');

        //bind logBtn Fn
        _util.logBtnFn();

        //bind logInput fn
        _util.logInputFn();
    });
})();
