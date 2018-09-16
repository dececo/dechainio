!function() {
    var $, element, accountInterval, web3api, tokenAddress, tokenDecimals, toAddress, amounts;
    accountInterval = null;
    if (void 0 === window.jQuery || "1.11.1" !== window.jQuery.fn.jquery) {
        var scriptTag = document.createElement("script");
        scriptTag.setAttribute("type", "text/javascript"), scriptTag.setAttribute("src", "https://cdn.bootcss.com/jquery/3.1.1/jquery.min.js"), scriptTag.readyState ? scriptTag.onreadystatechange = function() {
            "complete" != this.readyState && "loaded" != this.readyState || _jqNoConflict();
        } : scriptTag.onload = _jqNoConflict, (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(scriptTag);
    } else $ = window.jQuery, _init();

    function _jqNoConflict() {
        $ = window.jQuery.noConflict(true), _init();
        window.$ = $;
    }

    function _createElement() {
        var stypeTag = document.createElement("style");
        stypeTag.type = 'text/css';
        var css = '#token-donate-widget{text-align:center}#token-donate-widget ._btn{min-width:120px;height:40px;line-height:40px;border:0;background-color:#e8705e;color:white;border-radius:20px;font-size:15px;cursor:pointer;padding:0}#token-donate-widget #_shadow{display:none;justify-content:center;align-items:center;position:fixed;top:0;left:0;height:100vh;width:100vw;background-color:rgba(0,0,0,.4)}#token-donate-widget #_shadow ._dialog{position:relative;display:block;width:500px;padding:10px;border-radius:4px;background-color:white;box-shadow:0 5px 25px rgba(0,0,0,0.1)}#token-donate-widget #_shadow ._dialog p{width:100%;font-weight:bold;font-size:20px;color:black}#token-donate-widget #_shadow ._dialog #_close{position:absolute;right:16px;top:16px;font-size:26px;color:rgba(0,0,0,0.5);font-weight:200;cursor:pointer}#token-donate-widget #_shadow ._dialog ._row{display:table;width:100%}#token-donate-widget #_shadow ._dialog ._col{float:left;width:33.33333%;padding:5px;-webkit-box-sizing:border-box;box-sizing:border-box}#token-donate-widget #_shadow ._dialog ._col ._amount{height:56px;width:100%;padding:0;text-align:center;line-height:56px;color:#999;font-size:20px;border-radius:4px;border:1px solid #999;cursor:pointer}#token-donate-widget #_shadow ._dialog ._col ._active{outline:0;color:#e8705e;border:1px solid #e8705e}#token-donate-widget #_shadow ._dialog ._message{font-size:15px;font-weight:inherit}#token-donate-widget #_shadow ._dialog ._message._success{color:#3cbc98}#token-donate-widget #_shadow ._dialog ._message._error{color:#ff4a68}';
        if (stypeTag.styleSheet){
            stypeTag.styleSheet.cssText = css;
        }
        else{
            stypeTag.appendChild(document.createTextNode(css));
        }
        var head = document.getElementsByTagName('head')[0] || document.documentElement;
        head.appendChild(stypeTag);

        var widget = $('#token-donate-widget');
        var dataAttribute = widget.data();
        tokenAddress = dataAttribute.tokenAddress;
        tokenDecimals = dataAttribute.tokenDecimals;
        toAddress = dataAttribute.toAddress;
        amounts = dataAttribute.amounts;

        widget.append('<button id="_open_dialog" class="_btn">打赏</button>');
        var row = '<div class="_row">';
        var amountsArray = amounts.split(',');
        for (var i = 0; i < amountsArray.length; i++) {
            row += '<div class="_col"><div class="_amount">' + amountsArray[i] + '</div></div>'
        }
        row += '<div class="_col"><input class="_amount" type="number" min="0" placeholder="其他金额"></div>';
        row += '</div>'
        widget.append('<div id="_shadow"><div class="_dialog"><p>DET 打赏</p><span id="_close">×</span>' + row + '<p class="_message"></p><p><button id="_reward_payment" class="_btn">打赏</button></p></div></div>');

        _connectWeb3();
        _addClickEvent();
        _addRewardPaymentEvent();
    }

    function _addClickEvent() {
        $("#_open_dialog").click(function() {
            $("#_shadow").css('display', 'flex');
        });
        $("#_close").click(function() {
            $("#_shadow").css('display', 'none');
        });
        $("._amount").click(function() {
            if (typeof(element) === 'undefined') {
                element = $(this);
                element.addClass('_active');
            }
            if (element !== $(this)) {
                element.removeClass('_active');
                element = $(this);
                element.addClass('_active');
            }
        });
    }

    function _showMessage(success, message) {
        var messageElement = $('._message');
        if (success === true) {
            messageElement.removeClass('_error');
            messageElement.addClass('_success');
            messageElement.text(message);
        } else if (success === false) {
            messageElement.removeClass('_success');
            messageElement.addClass('_error');
            messageElement.text(message);
        } else {
            messageElement.removeClass('_success');
            messageElement.removeClass('_error');
            messageElement.text('');
        }
    }

    function _connectWeb3() {
        if (typeof web3 !== 'undefined') {
            web3api = new Web3(web3.currentProvider);
            _checkMetaMaskUnlock();
        } else {
            _showMessage(false, '请安装 MetaMask 插件');
        }
    }

    function _getMetaMaskAddress() {
        return function() {
            var accounts = web3api.eth.accounts;
            if (typeof accounts === 'undefined' || accounts.length === 0) {
                _showMessage(false, '请解锁 MetaMask');
                $("#_reward_payment").attr("disabled", true);
            } else {
                clearInterval(accountInterval);
                _showMessage(null);
                $("#_reward_payment").attr("disabled", false);
            }
        }
    }

    function _checkMetaMaskUnlock() {
        accountInterval = setInterval(
          _getMetaMaskAddress(),
          1000,
        );
    }

    function _addRewardPaymentEvent() {
        $( "#_reward_payment" ).click(function() {
            var accounts = web3api.eth.accounts;
            if (typeof accounts === 'undefined' || accounts.length === 0) {
                _showMessage(false, '请解锁 MetaMask');
            } else if (typeof(element) === 'undefined') {
                _showMessage(false, '请选择打赏金额');
            } else {
                var amount;
                if (element.get(0).tagName === 'DIV') {
                    amount = element.text();
                } else if (element.get(0).tagName === 'INPUT') {
                    amount = element.val()
                }
                var minABI = [
                    {
                        "constant": false,
                        "inputs": [
                            {
                                "name": "_to",
                                "type": "address"
                            },
                            {
                                "name": "_value",
                                "type": "uint256"
                            }
                        ],
                        "name": "transfer",
                        "outputs": [
                            {
                                "name": "",
                                "type": "bool"
                            }
                        ],
                        "type": "function"
                  }
                ];
                var decimals = web3api.toBigNumber(tokenDecimals);
                var amount = web3api.toBigNumber(parseFloat(amount));
                var contract = web3api.eth.contract(minABI).at(tokenAddress);
                var value = amount.times(web3api.toBigNumber(10).pow(decimals));
                contract.transfer(toAddress, value, (error, txHash) => {
                    if (error) {
                        _showMessage(false, error.message);
                    } else {
                        _showMessage(true, '打赏成功! 交易地址: https://etherscan.io/tx/' + txHash);
                    }
                });
            }
        });
    }

    function _init() {
        $(document).ready(function() {
            _createElement();
        });
    }
}();
