/****************************************
css 选择器采集 ->
{
    tree: 'a div.head.1 div.wrap.1 body',
    className: '',
    siblings: 1,
    content: "B"
    domain: "cc.58.com:8124"
    path: "/data_caiji/index.html"
    xpath: "/a"
}
******************************************/

//one className

/**
 * [domTree 获取当前dom元素相对于body的domTree]
 * @param  {[DomObject]} e [Dom对象]
 * @return {[String]}   [domTree]
 *
 * 输出事例：a div#test5.1 div.test4.3 div.test3.3 div#test2.1 div.test1.5
 * 如果是ID 则为# Class为.
 */
function domTree(e) {
    var nodeName = e.nodeName.toLowerCase(),
        /**
         * [HtmlFormat HTML标签转义单字符]
         * @type {Object}
         */

        HtmlFormat = {
            'div': 'd',
            'span': 's',
            'lable': 'l'
        },
        /**
         * [toNodeName 标签名称转小写]
         * @param  {[domObj]} e [dom元素]
         * @return {[String]}   [输出dom标签简称]
         */

        toNodeName = function (e) {
            return HtmlFormat[e.nodeName.toLowerCase()] || e.nodeName.toLowerCase();
        },

        eleTree = [nodeName];

    while (toNodeName(e.parentNode) != 'body') {
        e = e.parentNode;

        var eClass = (function () {
                var idStr = e.getAttribute('id'),
                    classArr = (e.getAttribute('class') || ' ').split(' '),
                    /**
                     * [getClassOne 获取Class列表中的第一个Class名称]
                     * @param  {[Array]} arr [Class数组]
                     * @return {[String]}     [第一个Class名称]
                     */

                    getClassOne = function (arr) {
                        for(var i = 0; i < arr.length; i++) {
                            if(!arr[i]) {
                                arr.splice(i--, 1);
                            }
                        }

                        return arr[0];
                    },

                    /**
                     * [eIndex 获取dom元素的index]
                     * @param  {[domObj]} ele [domObj]
                     * @return {[String]}   [下标索引]
                     */

                    eIndex = function (ele) {
                        var getByClass = function (sClass, sParent){
                            var aResult = [],
                                aEle = (sParent? sParent: document).getElementsByTagName('*'),
                                re = new RegExp('\\b' + sClass + '\\b', 'g');

                            for(var i = 0, len = aEle.length; i < len; i++){
                                if(aEle[i].className.search(re) != -1){
                                    aResult.push(aEle[i]);
                                }
                            }

                            return aResult;
                        },
                        //默认下标为1
                        index = 1,
                        domArr = getByClass(getClassOne(classArr), ele.parentNode);

                        for (var i = 0, len = domArr.length; i < len; i++) {
                            if (domArr[i] == ele) {
                                index =  i + 1;
                                break;
                            }
                        };

                        return index;
                    }

                return idStr? '#' + idStr + '.0': '.' + getClassOne(classArr) + '.' + eIndex(e);
            } ()),

            eString = toNodeName(e) + eClass;

        eleTree.push(eString);
    }

    return eleTree.join(' ');
}
