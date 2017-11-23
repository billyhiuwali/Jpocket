/* For the usage ,plrease,check  https://jpocket.readme.io/ */

var JPocket = (function () {
    // 全局變數
    var window, global;
    //[全局函數]
    function G_var2Array(variable) {
        var value = variable;
        if (value.constructor === Array) {
            return value;
        } else {
            return false;
        }

    }
    function G_var2Function(variable) {
        var value = variable;
        if (typeof value === 'function') {
            return value;
        }
        else {
            return false;
        }

    }
    function G_var2String(variable) {
        if (typeof variable === 'string') {
            var value = String(variable).replace(/ /g, '').toUpperCase();
            if (value.length > 0) {
                return value;
            }

        } else {
            return false;
        }

    }
    function G_SystemCheck() {
        var arr = [];
        for (var i in localStorage) {
            if (i.substring(0, 5) === 'USER_') {
                arr.push(i);
            }
        }
        localStorage.setItem('SYS_TBList', G_JS(arr));
    }
    function G_TB2UP2USER(str) {
        //Table name to UPPERCASE and append to 'USER_'
        var txt = 'USER_' + str;
        return txt.toUpperCase();
    }
    function G_TB2UP2ATT(str) {
        var txt = 'ATT_' + str;
        return txt.toUpperCase();
    }
    function G_TB2UP2VERSION(str) {
        var txt = 'VER_' + str;
        return txt.toUpperCase();
    }
    
    function G_JS(arr) {
        return JSON.stringify(arr);
    }
    function G_JP(arr) {
        return JSON.parse(arr);
    }
    function G_DBExist(str) {
        return (localStorage.getItem(str) !== null) ? true : false;
    }
    function G_Get(str) {
        return localStorage.getItem(str);
    }
    function G_Set(str, arr) {
        return localStorage.setItem(str, arr);
    }
    function G_Remove(str) {
        return localStorage.removeItem(str);
    }

    //[]
    var JPocket = {
        //[篩選資料]
        select: function (table, condition) {
            var _Table = '';
            var _Function;
            var tbData = [];


            L_DataType_handler(table, condition);

            if (!_Table || !_Function) {
                console.error("ERROR");
            }
            else {
                return L_SEARCH(_Table, _Function);
            }
            function L_SEARCH(table_name, func_obj) {

                var USER_TABLE = G_JP(G_Get('USER_' + table_name));
                var result;
                for (var j in USER_TABLE) {
                    var num = parseInt(j);
                    result = G_JP(USER_TABLE[num]);

                    //   console.info(func_obj(greenapple)); //if true .... else ....
                    // var obj = { name: 'Ken', address: 'secret', unused: true };
                    // console.info(func_obj(obj));

                    if (func_obj(result)) {
                        tbData.push(G_JP(USER_TABLE[num]));
                    } else {

                    }
                }
                return tbData;
                //console.log(tbData);
            }
            function L_DataType_handler(st, func) {

                _Table = G_var2String(st);
                _Function = G_var2Function(func);


            }
        },
        //[新增資料]
        insert: function (table, column) {
            var _Table = '';
            var _Column = {};
            var _AttTable = [];
            var _UserTable = '';
            var tbData = [];


            L_DataType_handler(table, column);
            return (L_PUSH(_Table, _Column) ? true : false);


            function L_PUSH(table_name, column_obj) {
                if (G_DBExist(_AttTable) && G_DBExist(_UserTable)) {
                    tbData = G_JP(G_Get(_UserTable));
                    tbData.push(G_JS(_Column));
                    G_Set(_UserTable, G_JS(tbData));
                    return true;
                } else {
                    return false;
                }

                //  var USER_TABLE = G_JP(G_Get('USER_SAMPLE'));
                //  console.info(USER_TABLE);

            }
            function L_DataType_handler(st, obj) {
                _Table = G_var2String(st);
                _Column = obj;
                _AttTable = G_TB2UP2ATT(_Table);
                _UserTable = G_TB2UP2USER(_Table);
            }
        },
        //[更新資料]
        update: function (table, condition) {
            var _Table = '';
            var _Function;
            var tbData = [];

            L_DataType_handler(table, condition);
            if (!_Table || !_Function) {
                console.error("ERROR");
            } else {
                L_MODIFY(_Table, _Function);
            }


            function L_MODIFY(table_name, func_obj) {
                var USER_TABLE = G_JP(G_Get('USER_' + table_name));
                if (!(USER_TABLE === null)) {
                    var result;
                    for (var j in USER_TABLE) {
                        var num = parseInt(j);
                        result = G_JP(USER_TABLE[num]);
                        var row = func_obj(result);
                        if (row !== false) {
                            //更新陣列[j]
                            USER_TABLE[num] = G_JS(row);
                        } else {
                            //Do nothing 
                        }
                    }
                    G_Set('USER_' + table_name, G_JS(USER_TABLE));
                } else {
                    //TABLE 並不存在於數據庫
                }

            }
            function L_DataType_handler(st, func) {
                _Table = G_var2String(st);
                _Function = G_var2Function(func);

            }
        },
        //[刪除資料]
        clean: function (table, condition) {
            var _Table = '';
            var _Function;
            var tbData = [];
            var tbDatafinal = [];
            L_DataType_handler(table, condition);

            if (!_Table || !_Function) {
                console.error("ERROR");
            } else {
                L_REMOVE(_Table, _Function);
            }


            function L_REMOVE(table_name, func_obj) {
                var USER_TABLE = G_JP(G_Get('USER_' + table_name));

                if (!(USER_TABLE === null)) {
                    var result;
                    for (var j in USER_TABLE) {
                        var num = parseInt(j);
                        result = G_JP(USER_TABLE[num]);
                        var row = func_obj(result);
                        if (row === true) {
                            //條件匹配，捨棄數據
                        } else {
                            //數據交換
                            tbDatafinal.push(USER_TABLE[num]);
                        }
                    }
                    G_Set('USER_' + table_name, G_JS(tbDatafinal));

                } else {
                    //TABLE 並不存在於數據庫
                }

            }
            function L_DataType_handler(st, func) {
                _Table = G_var2String(st);
                _Function = G_var2Function(func);

            }
        },
        //[建立資料表]
        add: function (table, attribute) {
            var _Table = '';
            var _Attribute = [];
            var tb_empty = [];

            L_DataType_handler(table, attribute)

            if (!_Table || !_Attribute) {
                console.error("ERROR");
            }
            else {
                return (L_CREATE(_Table, _Attribute)) ? true : false;
            }
            function L_CREATE(table_name, attribute_arr) {
                if (G_Get(G_TB2UP2USER(table_name)) === null) {
                    G_Set(G_TB2UP2USER(table_name), G_JS(tb_empty));
                    G_Set(G_TB2UP2ATT(table_name), G_JS(attribute_arr));
                    G_Set(G_TB2UP2VERSION(table_name), 0);
                    G_SystemCheck();
                    return true;
                } else {
                    console.warn('[警告] ' + table_name + ' 已存在於數據庫');
                    G_SystemCheck();
                    return false;
                }

            }
            function L_DataType_handler(st, ar) {
                _Table = G_var2String(st);
                _Attribute = G_var2Array(ar);

            }
        },
        //[修改資料表]
        modify: function (table, attribute) {
            var _Table = '';
            var _Attribute = [];

            L_DataType_handler(table, attribute);
            if (!_Table || !_Attribute) {
                console.error("ERROR");
            }
            else {
                return (L_UPDATE(_Table, _Attribute) ? true : false);
            }
            function L_UPDATE(table_name, attribute_arr) {
                if (G_Get(G_TB2UP2USER(table_name)) !== null) {
                    G_Set(G_TB2UP2ATT(table_name), G_JS(attribute_arr));

                    G_Set(G_TB2UP2VERSION(table_name),Number( G_Get(G_TB2UP2VERSION(table_name)))+1);
                    //G_Set(G_TB2UP2VERSION(table_name),2);
                    G_SystemCheck();
                    return true;
                } else {
                    console.warn('[警告] ' + table_name + ' 並不存在於數據庫');
                    G_SystemCheck();
                    return false;
                }

            }
            function L_DataType_handler(st, ar) {
                _Table = G_var2String(st);
                _Attribute = G_var2Array(ar);
            }
        },
        //[刪除資料表]
        drop: function (table) {
            var _Table = '';
            L_DataType_handler(table);
            if (!_Table) {
                console.error("ERROR");
            }
            else {
                return (L_DELETE(_Table)) ? true : false;
            }
            function L_DELETE(table_name) {
                if (G_Get(G_TB2UP2USER(table_name)) !== null) {
                    G_Remove(G_TB2UP2USER(table_name));
                    G_Remove(G_TB2UP2ATT(table_name));
                    G_SystemCheck();
                    return true;
                } else {
                    console.warn('[警告] ' + table_name + ' 並不存在於數據庫');
                    G_SystemCheck();
                    return false;
                }

            }
            function L_DataType_handler(st) {
                _Table = G_var2String(st);

            }

        },
        version: function (table) {
            var _Table = '';


            L_DataType_handler(table);
            if (!_Table) {
                console.error("ERROR");
            } else {
                return L_VERSION(_Table);
            }
            function L_VERSION(table_name) {
                if (G_Get(G_TB2UP2VERSION(table_name)) !== null) {
                    //  G_SystemCheck();
                    return G_Get(G_TB2UP2VERSION(table_name));
                } else {
                    console.warn('[警告] ' + table_name + ' 版本資料已遺失');
                }
            }
            function L_DataType_handler(st) {
                _Table = G_var2String(st);
            }
        }

    }


    return JPocket;
})();
