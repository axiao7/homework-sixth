//事件委托的对象
var EventUntil = {
	addHandler: function (element, type, handler) {
		if (element.addEventListener) {
			element.addEventListener(type, handler, false);
		} else if (element.attachEvent) {
			element.attachEvent("on" + type,handler);
		} else {
			element["on" + type] = handler;
		}
	},
	getEvent: function (event) {
		return event ? event : window.event;
	},
	getTarget: function (event) {
		return event.target || event.srcElement;
	},
	preventDefault: function (event) {
		if (event.preventDefault) {
			event.preventDefault();
		} else {
			event.returnValue = false;
		}
	},
	stopPropagation: function (event) {
		if (event.stopPropagation) {
			event.stopPropagation();
		} else {
			event.cancelBubble = true;
		}
	},
	removeHandler: function (element, type, handler) {
		if (element.removeHandler) {
			element.removeHandler(type, handler, false);
		} else if (element.detachEvent) {
			element.detachEvent("on" + type, handler);
		} else {
			element["on" + type] = null;
		}
	}
};
var num = document.querySelectorAll('.num'),
    output = document.querySelector('.show'),
    container = document.querySelector('.calculation'),
    firstVal,
    secondVal,
    operator = null,
    isfalse = true,//为了让firstVal等于上一次相加的值
    n = 0;//为了在第一次点操作符之后，数字能够正确输入
EventUntil.addHandler(container, "click", function (evt) {
	evtR = EventUntil.getEvent(evt);
	element = EventUntil.getTarget(evtR);
	var otherCal = /^[\+\-\*\/]$/,//过滤除运算符以外的字符
	    isNum = /^[0-9]$/;//过滤除数字以外的字符
	if (otherCal.test(element.value)) {
		if (operator) {//第一次点击运算符,不能计算结果，所以这样设置
			initialE();
			isfalse = false;
		}
		n++;
		operator = element.value;	
	} else if (isNum.test(Number(element.value))) {
		var temp0,temp1;
		if (output.value === '0') {
		    temp1 = Number(element.value);
		} else if (n===1) {
			temp1 = Number(element.value);
			n++;
		} else {
			if (isfalse) {
				temp0 = output.value;
		        temp1 = temp0 + element.value;
		        temp1 = Number(temp1);
			}else {
				temp1 = Number(element.value);
			}
		}
		if (operator) {
			if (isfalse) {
				secondVal = temp1;
			    output.value = secondVal;
			}else {
				firstVal = Calculate(firstVal, secondVal, operator);
				secondVal = temp1;
				output.value = secondVal;
				isfalse = true;
			}			
		}else {
			firstVal = temp1;
			output.value = firstVal;
		}
	} else if (element.value === '.') {
		var temp0 = output.value,
		    temp1 = temp0 + '.';
		output.value = temp1;
	} else if (element.value === '=') {
		initialE();
	}else {//所有都重置
		n = 0;
		isfalse = true;
		output.value = 0;
		operator = null;
	    firstVal = null;
	    secondVal = null;
	}
})
function initialE () {
	output.value = Calculate(firstVal, secondVal, operator);
}
function Calculate (val1, val2, oper) {
	switch(oper)
	{
		case '+': return calculation.addNum(val1, val2);break;
		case '-': return calculation.minusNum(val1, val2);break;
		case '*': return calculation.multiplyNum(val1, val2);break;
		case '/': return calculation.divideNum(val1, val2);
	}
}
var calculation = {
	addNum: function  (val1, val2) {
		var val1Arr = val1.toString().split('.'),
		    val2Arr = val2.toString().split('.'),
		    intNum1 = val1Arr[0].split(''),
		    // floatNum1,
		    intNum2 = val2Arr[0].split(''),
		    // floatNum2,
		    checkNum = false,
		    realfloat,
		    realint;
		    // if (val1Arr[1]) {
		    // 	floatNum1 = val1Arr[1].split('');
		    // }else {
		    // 	val1Arr[1] = 0;
		    // 	floatNum1 = ['0'];
		    // }
		    // if (val2Arr[1]) {
		    // 	floatNum2 = val2Arr[1].split('');
		    // }else {
		    // 	val2Arr[1] = 0;
		    // 	floatNum2 = ['0'];
		    // }
		// if (Number(val1Arr[1]) >= Number(val2Arr[1])) {
		// 	for (var i = floatNum2.length-1; i >= 0; i--) {
		// 		if (checkNum) {
		// 			floatNum1[i] = Number(floatNum2[i]) + Number(floatNum1[i]) + 1;
		// 			checkNum = false;
		// 		} else {
		// 			floatNum1[i] = Number(floatNum2[i]) + Number(floatNum1[i]);
		// 		}
				
		// 		if (floatNum1[i] > 10) {
		// 			floatNum1[i] -= 10;
		// 			checkNum = true;
		// 		}
		// 	}
		// 	realfloat = floatNum1;
		// }else {
		// 	for (var i = floatNum1.length-1; i >= 0; i--) {
		// 		if (checkNum) {
		// 			floatNum2[i] = Number(floatNum2[i]) + Number(floatNum1[i]) + 1;
		// 			checkNum = false;
		// 		} else {
		// 			floatNum2[i] = Number(floatNum2[i]) + Number(floatNum1[i]);
		// 		}
				
		// 		if (floatNum2[i] > 10) {
		// 			floatNum2[i] -= 10;
		// 			checkNum = true;
		// 		}
		// 	}
		// 	realfloat = floatNum2;
		// }
		if (Number(val1Arr[0]) >= Number(val2Arr[0])) {//第一个数大于第二个数
			intNum1.unshift(0);//大的数前面增加一位0，可以进行+1操作，比如56+55，否则只有十位个位
			var largelen = intNum1.length-1;//对齐，使得按照个位十位百等能够运算
			for (var i = intNum2.length-1; i >= 0; i--) {//相加操作，按小的数的位数
				if (checkNum) {
					intNum1[largelen] = Number(intNum2[i]) + Number(intNum1[largelen]) + 1;
					checkNum = false;
				} else {
					intNum1[largelen] = Number(intNum2[i]) + Number(intNum1[largelen]);
				}				
				if (intNum1[largelen] >= 10) {
					intNum1[largelen] -= 10;
					checkNum = true;
				}
				largelen--;
			}
			for (var i = largelen; i >= 0; i--) {//对大的数剩下的部分进行操作
				if (checkNum) {
					intNum1[i] = Number(intNum1[i]) + 1;
					checkNum = false;
				}else {
					break;
				}
				if (intNum1[i] >= 10) {
					intNum1[i] -= 10;
					checkNum = true;
				}			
			}
			realint = intNum1;
		}else {//其实if(){}else{}可以写成函数，用? :即可，没时间了。。。其实逻辑和上面几乎相同
			intNum2.unshift(0);
			var largelen = intNum2.length-1;
			for (var i = intNum1.length-1; i >= 0; i--) {
				if (checkNum) {
					intNum2[largelen] = Number(intNum1[i]) + Number(intNum2[largelen]) + 1;
					checkNum = false;
				} else {
					intNum2[largelen] = Number(intNum1[i]) + Number(intNum2[largelen]);
				}				
				if (intNum2[largelen] >= 10) {
					intNum2[largelen] -= 10;
					checkNum = true;
				}
				largelen--;
			}
			for (var i = largelen; i >= 0; i--) {
				if (checkNum) {
					intNum2[i] = Number(intNum2[i]) + 1;
					checkNum = false;
				}else {
					break;
				}	
				if (intNum2[i] >= 10) {
					intNum2[i] -= 10;
					checkNum = true;
				}	
				largelen--;		
			}
			realint = intNum2;
		}
		// return Number(realint.join('') + '.' + realfloat.join(''));
		return Number(realint.join(''));
    },
	minusNum: function  (val1, val2) {
		var val1Arr = val1.toString().split('.'),
		    val2Arr = val2.toString().split('.'),
		    intNum1 = val1Arr[0].split(''),
		    intNum2 = val2Arr[0].split(''),
		    checkNum = false,
		    realfloat,
		    realint;
		if (Number(val1Arr[0]) >= Number(val2Arr[0])) {
			var largelen = intNum1.length-1;
			for (var i = intNum2.length-1; i >= 0; i--) {
				intNum1[largelen] = Number(intNum1[largelen]) - Number(intNum2[i]);	
				if (intNum1[largelen] < 0 && i===0) {//这是为了防止对齐的时候小的数最前面一位相加结果为负,尤其是0-1===9的情况
					checkNum = true;
				}			
				if (intNum1[largelen] < 0) {
					intNum1[largelen] += 10;
				}
				largelen--;
			}
			for (var i = largelen; i >= 0; i--) {
				if (checkNum) {
					intNum1[i] = Number(intNum1[i]) - 1;
					checkNum = false;
				}else {
					break;
				}
				var nowNum = intNum1[i] + 1;//0-1===9的时候
				if (nowNum === 0) {
					intNum1[i] += 10;
					checkNum = true;
				}			
			}
			realint = intNum1;
		}else {//可以写成函数的。。。
			var largelen = intNum2.length-1;
			for (var i = intNum1.length-1; i >= 0; i--) {
				intNum2[largelen] = Number(intNum2[largelen]) - Number(intNum1[i]);	
				if (intNum2[largelen] < 0 && i===0) {
					checkNum = true;
				}			
				if (intNum2[largelen] < 0) {
					intNum2[largelen] += 10;
				}
				largelen--;
			}
			for (var i = largelen; i >= 0; i--) {
				if (checkNum) {
					intNum2[i] = Number(intNum2[i]) - 1;
					checkNum = false;
				}else {
					break;
				}
				var nowNum = intNum2[i] + 1;
				if (nowNum === 0) {
					intNum2[i] += 10;
					checkNum = true;
				}			
			}
			intNum2.unshift('-');
			realint = intNum2;
		}
		return Number(realint.join(''));
	},
	multiplyNum: function  (val1, val2) {
		var result = 0;
		for (var i = 0; i < val2; i++) {
			result += parseInt(calculation.addNum(val1, 0));//直接进行val2个val1相加就行
		}
		if (result > Math.pow(2, 1024)) {
			return 'Infinite';
		}else {
			return result;
		}		
	},
	divideNum: function  (val1, val2) {
		if (val2 === 0) {
			return 'Infinite';
		}
		var val2ano = val2,
		    val1ano = val1,
		    result = [],
		    n = 0,
		    h = 0,
		    p = 0,
		    l = 0,
		    c = 0,
		    checkGo = 1;
		while(val1 < val2){
			val1 *= 10;
			n++;//记录小数点后面的0
		}
		while(val1ano > val2ano){
			val2ano *= 10;
			l++;
		}
		if ((val1ano%val2)==0) {
			c++;
		}
		while(checkGo)
		{
			for (var i = 0; i < p; i++) {
				result.push(0);
			}
			p = 0;
			result.push(Math.floor(val1/val2));
			val1 = (val1%val2)*10;
			while(val1 < val2 && val1!=0){
				val1 *= 10;
				p++;
			}
			h++;
			if (h > 10) {
				break;
			}
			if (val1 == 0) {
				checkGo--;
			}
		}
		if (!n) {
			if (c) {
				return val1ano/val2;
			}else {
				result.splice(l,0,'.')
			}
		}else {
			for (var i = 0; i < n-1; i++) {
		        result.unshift(0);	
		    }
		    result.unshift('.');
		    result.unshift('0');
		}
		

		return result.join('');
	}
}