const combineReducers = reducers => {
  return (state = {}, action) => {
    return Object.keys(reducers).reduce(
      (nextState, key) => {
        nextState[key] = reducers[key](state[key], action);
        return nextState;
      },
      {} 
    );
  };
};

function compose(...funcs){
	if(funcs.length === 0){
		return arg => arg
	}
	if(funcs.length === 1){
		return funcs[0]
	}
	return function(...args){
		return funcs.reduceRight(function(a,b){
			return b(a(...args))
		})
	}
}

/**
 * 中间件处理
 */
function applyMiddleware(...middlewares){
	//第一层匿名函数(createStore)接收一个参数
	return (createStore) => (...args) => { 
		// 第二层匿名函数...args代表(reducer, preloadedState)接收两个参数   
		/**
		 * 在下面的函数creatStore的enhancer(creatStore)(reducer, preloadState)
		 * 只传了reducer, preloadState两个参数  也就是在这个过程中就当做无中间件的情况处理
		 */
		var store = createStore(...args)
		
		//初始化变量  记录上次的state
    var dispatch = store.dispatch
    var chain = []

    var middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action)
    }
    //遍历中间件   将middlewareAPI回调出去  所以中间件中可以使用dispatch getState   chain代表调用中间件之后的返回函数集合
    chain = middlewares.map(middleware => middleware(middlewareAPI))

    //compose函数上面有解释
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}

/**
 * 创建store
 * 发布订阅模式 
 */
function creatStore(reducer, preloadState, enhancer){
	
	//creatStore(reducer,middelewareFun)  只有两个参数时（第二个参数为中间件函数，preloadState可选） 将第二个参数视为enhancer增强函数
	if(typeof preloadState === 'function' && typeof enhancer === 'undefined'){
		enhancer = preloadState;
		preloadState = undefined;
	}
	
	//如果传了中间件则处理 否则直接执行无中间的情况
	if(typeof enhancer !== 'undefined'){
		if(typeof enhancer !== 'function'){
			throw new Error('中间件必须是一个函数！');
		}
		/**
		 * enhancer是上面applyMiddleware函数返回的匿名函数 接收了 enhancer 传来的 createStore
		 * 第一层匿名函数
		 * return function (createStore) { 
			    // 接收了 enhancer(createStore) 传来的 reducer, preloadedState
			    return function (reducer, preloadedState, enhancer) {
			        ...
			    }
			};
		 */
		return enhancer(creatStore)(reducer, preloadState);
	}
	
	//reducer为一个函数必须
	if(typeof reducer !== 'function'){
		throw new Error('reducer 必须为一个函数');
	}
	
	/*
	 * isDispatching
	 * 比如我们在reducer函数中又执行了 dispatch store.dispatch({type:'UPDATA',data:2}) 不加锁就会死循环
	 * 不允许在reducer中进行任何操作  保证reducer是一个纯函数
	 */
	let isDispatching = false;
	let listeners = [];
	let state = null;
	const subscribe = (listenerFun) => {
		//订阅不允许在reducer操作
		if(isDispatching){
			throw new Error('Reducer 中不可以subscribe');
		}
		listeners.push(listenerFun);
	}
	const getState = () => {
		/**
		 * reducer中是不允许操作state  执行到state = reducer(state, action);  isDispatching变成true  未执行到finally
		 * 尽管可以取到值但是不允许这么做
		 */
		if(isDispatching){
			throw new Error('Reducer 中不可以读取state');
		}
		return state
	};
	const dispatch = (action) => {
		if (isDispatching) {
	      throw new Error('Reducers中不允许执行dispatch')
	    }
		try{
			//到这里会出现死循环的情况  所以需要加锁
			isDispatching = true;
			state = reducer(state, action);
		}finally{
			isDispatching = false;
		}
		for(let i = 0, len = listeners.length; i < len; i++){
			listeners[i](state);
		}
	}
	dispatch({});
	return {
		getState,
		dispatch,
		subscribe
	}
}

//middleware log
let logger = ({ dispatch, getState }) => next => action => {
	console.log('dispatch之前数据：', getState())
	let result = next(action)
	console.log('dispatch之后数据：', getState())
	return result;
}
//middleware thunk
let thunk = ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
        return action(dispatch, getState)
    }
    return next(action)
}

const UP_DATA = "UPDATA";
function changeState(states, action){
	if(!states){
		return {
			count: 0
		}
	}
 	switch (action.type){
 		case UP_DATA:
 			return {
 				...states,
 				count: action.data
 			}
 		default:
 			return states;
 	}
}

const store = creatStore(changeState, applyMiddleware(thunk,logger));

store.subscribe(()=>{
	const newState = store.getState();
	render(newState);
})

store.dispatch({ type: UP_DATA,data:2 })
store.dispatch({ type: UP_DATA,data:3 })

store.dispatch(function(dispatch){
	console.log('2s之后会打印这个异步结果，请稍后...')
	setTimeout(function(){
		dispatch({
			type: 'UPDATAS',
			data: 4
		})
	},2000)
})

function render(newData){
  console.log('newData.count: ', newData.count)
}