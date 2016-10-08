(function () {
    //参数对象，拼接参数串Str
    var params = {},
        args = '',
        load_time = {
            start: new Date().getTime()
        };

    //Document对象数据
    if(document) {
        //params.domain = document.domain || '';
        params.url = document.URL || '';
        //params.title = document.title || '';
        //params.ua = navigator.userAgent || '';
        params.referrer = document.referrer || '';
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
    if(_maq) {
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

    var _util = {
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

        //minute
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
            window.__session =  _util.getCookie('UUID') + '|' + _util.getCookie('VISITING');
        },

        /**
         * [logBtnFn 埋点btn触发方法]
         * @return {[null]} [description]
         */
        logBtnFn: function() {
            var _this = this;

            _this.addEventHandler(document, 'click', function(ev) {
                var ev = ev || window.event,
                    target = ev.srcElement || ev.target;

                if (_this.dom.hasClass('OP_LOG_BTN', target)) {
                    _this.sendLog('click', {'tag': eval('(' + target.getAttribute('data-click') + ')').tag});
                }
            });
        },

        /**
         * [put_img 发送img]
         * @param  {[boject]} paramsObj [参数对象]
         * @return {}           [description]
         */
        put_img: function(paramsObj) {
            paramsObj = paramsObj || {};
            var args = '';

            for(var i in paramsObj) {
                if(args != '') {
                    args += '&';
                }
                args += i + '=' + encodeURIComponent(paramsObj[i]);
            }

            for(var i in params) {
                if(args != '') {
                    args += '&';
                }
                args += i + '=' + encodeURIComponent(params[i]);
            }

            //Image send
            var img = new Image(1, 1);

            img.src = 'http://fvp.58.com/1.gif?' + args;
        },

        /**
         * [sendLog send log]
         * @param  {[string]} type  [view time]
         * @param  {[object]} param [param obj]
         * @return {}       [description]
         */
        sendLog: function (type, param) {
            var _this = this,
                type = type || 'view';

            if (type == 'time') {
                load_time.end = new Date().getTime();
                var difference = load_time.end - load_time.start;
                _this.put_img({
                    'timer': difference,
                    'uuid': _util.getCookie('UUID') || ''
                });
            } else if (type == 'click') {
                _this.put_img({
                    'tag': param.tag,
                    'uuid': _util.getCookie('UUID') || ''
                });
            } else {
                //没有UUID-新用户
                if (!_util.getCookie('UUID')) {

                    var _uuid = _this.guid();

                    //设置UUID
                    _util.setCookie('UUID', _uuid, {
                        type: 'day',
                        value: 180
                    });

                    //设置VISITING
                    _util.setCookie('VISITING', 1, {
                        type: 'minute',
                        value: 30
                    });

                    //设置STEP
                    _util.setCookie('STEP', 1, {
                        type: 'minute',
                        value: 30
                    });

                    //update到控制台
                    this.setConsole();
                } else {
                    // have UUID-老用户-180天有效

                    //设置VISITING ++
                    _util.setCookie('VISITING', +_util.getCookie('VISITING') + 1, {
                        type: 'minute',
                        value: 180
                    });

                    //have SETP步长
                    if(_util.getCookie('STEP')) {

                        //设置SETP 30分钟 ++
                        _util.setCookie('STEP', +_util.getCookie('STEP') + 1, {
                            type: 'minute',
                            value: 30
                        });

                    } else {
                        //not have SETP
                        //设置STEP 1
                        _util.setCookie('STEP', 1, {
                            type: 'minute',
                            value: 30
                        });
                    }
                }

                _this.put_img({
                    'uuid': _util.getCookie('UUID') || '',
                    'sid': _util.getCookie('UUID') + '|' + _util.getCookie('STEP'),
                    'visiting': _util.getCookie('VISITING'),
                    'step': _util.getCookie('STEP')
                });
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
    });
})();
