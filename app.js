dataController = (function() {
    var data =  {
        op1: 0,
        op2: 0,
        oprn: '',
        equalFlag: false
    };
    return {
        setData: function(input, num) {
            data.oprn = input;
            data.equalFlag = false;
            switch(data.oprn) {
                case 'mul':
                case 'minus':
                case 'plus':
                case 'divide':

                    data.op1 = num;
                    break;
            }       
        },

        resetData: function() {
            data.op1 = 0;
            data.op2 = 0;
            data.oprn = '';
        },

        calPercentage: function(num) {
            // todo: take care of all cases
            var str = (num/100).toString()
            var n = parseInt(str.substring(str.length - 3, str.length));
            if(isNaN(num))
                return 'Not A Number';
            else if((num / 100).toString().includes('e') && n > 100)
                return 'Not A Number';
            else {
               if((num / 100).toString().length > 12) {
                var result = (num / 100);
                return data.op1 = result.toPrecision(10);
               }
               else
                return data.op1 = num / 100;
           }
            
        },
        calcResult: function(num){
            if(!data.equalFlag)
                data.op2 = num;
            data.equalFlag = true;
            switch(data.oprn) {
                case 'plus':
                    if((data.op1 + data.op2).toString().length > 12)
                        return data.op1 = (data.op1 + data.op2).toExponential(3);
                    else
                        return data.op1 = data.op1 + data.op2;
                    break;
                case 'minus':
                    if((data.op1  / data.op2) % 1 !== 0 ) {
                        if((data.op1  / data.op2) < 0)
                            return data.op1 = parseFloat(((data.op1 * 10  - data.op2 * 10) / 10).toFixed(10));
                        else 
                            return data.op1 = parseFloat(((data.op1 * 10  - data.op2 * 10) / 10).toFixed(11));
                    }
                    else 
                        return data.op1 = (data.op1 * 10  - data.op2 * 10) / 10;
                    break;
                case 'mul':
                    if((data.op1  * data.op2).toString().length > 12) {
                        return data.op1 = (data.op1  * data.op2).toExponential(1 + 3);
                    }

                    else
                        return data.op1 = data.op1  * data.op2;
                    break;
                case 'divide':
                    if(data.op2 === 0)
                        return 'Not A Number';
                    else {
                        if((data.op1  / data.op2) % 1 != 0) {
                            if((data.op1  / data.op2) < 0)
                                return data.op1 = parseFloat((data.op1  / data.op2).toFixed(10));
                            else 
                                return data.op1 = parseFloat((data.op1  / data.op2).toFixed(11));
                        }
                        else 
                        return data.op1 = (data.op1  / data.op2);
                    }
            }
            return num;
        }

    };
})();



UIController = (function() {
    return {
        display: function(input, flag) {
            var text = document.querySelector('p');
            if(text.innerHTML !=='0' && text.innerHTML !=='-0' && text.innerHTML.length < 13 && flag !== true) {
                if(input === '-' && !text.innerHTML.includes(input)) {
                text.innerHTML = input + text.innerHTML;
                }
                else if(input === '-' && text.innerHTML.includes(input))
                    text.innerHTML = text.innerHTML.slice(1);
                else if(input !== '-' && text.innerHTML.includes('-'))
                    text.innerHTML = input;
                else  {
                    if(input === '.' && text.innerHTML.includes(input))
                        ; // do nothing, leave display as is 
                    else
                        text.innerHTML += input;
                }
            }
                
            else if(text.innerHTML === '0' || text.innerHTML === '-0' || text.innerHTML.length >= 13 || flag === true) {
                if(input === '-' && !text.innerHTML.includes(input)) {
                    text.innerHTML = input + text.innerHTML;
                    }
                else if(input === '-' && text.innerHTML.includes(input))
                    text.innerHTML = text.innerHTML.slice(1);
                else if(input === '.') {
                    if(text.innerHTML.includes('.') && !flag === true)
                        ;
                    else
                        text.innerHTML = '0' + input;
                }
                else
                    document.querySelector('p').innerHTML = input;
            }
        },
        toggleClear: function() {
            var clear = document.querySelector('.clear').innerHTML;
            if(clear === 'AC')
                document.querySelector('.clear').innerHTML = 'C';
        },
        clearAll: function() {
            var clear = document.querySelector('.clear').innerHTML;
            if(clear === 'C')
                document.querySelector('.clear').innerHTML = 'AC';
        },

        getDisplay: function() {
            return document.querySelector('p').innerHTML;
        }
    };
})();


appController = (function(dataCtrl, UICtrl) {

    var operatorFlag = false;

    var setUpEventListener = function() {
        document.querySelector('.buttons-container').addEventListener('click', function(event) {
            calculator(event);
        });
    }

    var calculator = function(event) {
        var target = event.target;
        var result;
        switch(target.className) {
            case "number":
                UICtrl.display(target.innerHTML, operatorFlag);
                UICtrl.toggleClear();
                operatorFlag = false;
                break;
            case "operator":
                dataCtrl.setData(target.id, parseFloat(UICtrl.getDisplay()));
                operatorFlag = true;
                break;
            case "plus-minus":
                UICtrl.display('-', operatorFlag);
                break;
            case 'decimal':
                UICtrl.display(target.innerHTML, operatorFlag);
                operatorFlag = false;
                break;
                
            case "percentage":
                result = dataCtrl.calPercentage(parseFloat(UICtrl.getDisplay()));
                operatorFlag = true;
                UICtrl.display(result, operatorFlag);
                break;
            case "equal":
                result = dataCtrl.calcResult(parseFloat(UICtrl.getDisplay()));
                operatorFlag = true;
                UICtrl.display(result, operatorFlag);
            case "clear":
                if(target.innerHTML === 'C') {
                    operatorFlag = true;
                    UICtrl.display('0', operatorFlag);
                    UICtrl.clearAll();
                }
                else if(target.innerHTML === 'AC') {
                    dataCtrl.resetData();
                    operatorFlag = true;
                    UICtrl.display('0', operatorFlag);
                }
                break;
            default:
                break;

        }
    }
    return {
        init: function() {
            setUpEventListener();
        }
    }
})(dataController, UIController);


appController.init();