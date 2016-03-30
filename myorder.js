
	


        function initDatabase() {
            var db = getCurrentDb();//初始化数据库
            if(!db) {alert("您的浏览器不支持HTML5本地数据库");return;}
            db.transaction(function (trans) {//启动一个事务，并设置回调函数
                //执行创建表的Sql脚本
                trans.executeSql("create table if not exists Receiver(dname text null,dprovince text null,dcity text null,ddistrict text null,daddress text null,dpostcode text null,demail text null,didno text null,dphone text null)", [], 
                function (trans, result) {
                }, function (trans, message) {//消息的回调函数alert(message);
                });
            }, function (trans, result) {
            }, function (trans, message) {
            });
            db.transaction(function (trans) {//启动一个事务，并设置回调函数
                //创建货物清单  名称，品牌，中文名，价格，重量
                trans.executeSql("create table if not exists Medicine(mname text null,mbrand text null,mcnname text null,mprice text null,mweight text null)", [], 
                function (trans, result) {
                }, function (trans, message) {//消息的回调函数alert(message);
                });
            }, function (trans, result) {
            }, function (trans, message) {
            });
          db.transaction(function (trans) {//启动一个事务，并设置回调函数
                //创建订单详情 单号 人名 物品名称 
                trans.executeSql("create table if not exists MyOrders(ordid text null,orname text null,omname text null,realID text null)", [], 
                function (trans, result) {
                }, function (trans, message) {//消息的回调函数alert(message);
                });
            }, function (trans, result) {
            }, function (trans, message) {
            });
            
        }
 
        
        $(function () {//页面加载完成后绑定页面按钮的点击事件 //$号是JQuery的快捷方式。当调用$（somthing）时，相当于是在调用jQuery(something). 
        	             //1. 使这段代码被载入时候自动执行。  2. 避免污染全局变量
            initDatabase();
           
            $("#btnSaveReceiver").click(function () {                //#btnSaveReceiver中相当于某个元素的id为btnSaveReceiver
                var txtName = $("#rname").val();
                var txtProvince = $("#province").val();
                var txtCity = $("#city").val();
                var txtDistrict = $("#district").val();
                var txtAddress = $("#address").val();
                var txtPostcode = $("#postcode").val();
                var txtEmail = $("#email").val();
                var txtIdno = $("#idno").val();
                var txtPhone = $("#phone").val();
                
                var db = getCurrentDb();
                //执行sql脚本，插入数据
                db.transaction(function (trans) {
                   trans.executeSql("insert into Receiver(dname,dprovince,dcity,ddistrict,daddress,dpostcode,demail,didno,dphone) values(?,?,?,?,?,?,?,?,?) ",[txtName, txtProvince, txtCity,txtDistrict, txtAddress, txtPostcode,txtEmail, txtIdno, txtPhone], function (ts, data) {
                    //trans.executeSql("insert into Receiver(dname,dprovince,dcity,ddistrict,daddress) values(?,?,?,?,?) ",[txtName, txtProvince, txtCity,txtDistrict, txtAddress], function (ts, data) {
                     //trans.executeSql("insert into Receiver(dname,dprovince,dcity,ddistrict) values(?,?,?,?) ",[txtName, txtProvince, txtCity,txtDistrict], function (ts, data) {
                     }, function (ts, message) {
                        alert(message);
                    });
                });
                
               showAllTheData();
            });
            
            
            $("#btnSaveNewgoods").click(function () {                //保存物品到数据库
                var txtName = $("#mname").val();
                var txtBrand = $("#mbrand").val();
                var txtCnname = $("#mcnname").val();
                var txtPrice = $("#mprice").val();
                var txtWeight = $("#mweight").val(); 
                         
           	    var db = getCurrentDb();
                //执行sql脚本，插入数据
                db.transaction(function (trans) {
                   trans.executeSql("insert into Medicine(mname,mbrand,mcnname,mprice,mweight) values(?,?,?,?,?) ",[txtName, txtBrand, txtCnname,txtPrice, txtWeight], function (ts, data) {
                 }, function (ts, message) {
                        alert(message);
                    });
                });
                
              showAllTheMedicinData ();
            });
            
           $("#submit1").click(function () {                //保存订单到数据库
            	var txtOrdId = $("#thisorder").val();
            	var txtOmname = appendContentofOrder(); 
            	var txtIndNam = $("#nameindex").val(); //从姓名下拉菜单选择，此值为大于等于0的整数； 否则为空
            	if(txtIndNam!=""){
            		var txtOrname = $("#rname").val()+":"+txtIndNam;
            	}
            	else{
            		var txtOrname = $("#rname").val();
            	}
            	var txtOrdIda = $("#orderID").val();
            	//首先判断单号中是否含有fang:,有的话需要去掉
            	if (txtOrdIda.indexOf(":")!=-1){      //如果有:
            		var tmpordid = txtOrdIda.split(":");
            		txtOrdIda = tmpordid[tmpordid.length-1];
            	}
       				var txtSelComp = $("#selectedCompany").val();
        			var txtCol = txtSelComp+": "+txtOrdIda;
            	var db = getCurrentDb();
            	db.transaction(function (trans) {
                //trans.executeSql("select * from MyOrders ", [], function (ts, data) {
                //选择最后一行 select * from sensor where address = 'aaaa::11:22ff:fe33:4461' order by id desc limit 0,1;  其中order by id desc 是按照id降序排列；limit 0,1中0是指从偏移量为0（也就是从第1条记录）开始，1是指需要查询的记录数，这里只查询1条记录 
                trans.executeSql("select * from MyOrders", [], function (ts, data) {
                    if (data) {
                    	//var lastcnt = data.rows.length - 1;
               				var getordid = data.rows.item(data.rows.length-1).ordid;
                    	//将订单号加1
                    	var getnewordid = ordaddone(getordid);
                    	//新订单号update
                    	txtOrdId = getnewordid; 
                       // $("#thisorder").val(getnewordid);  
                      
                  }
                  else {
                  	//var instance = 0;
                  	txtOrdId = cal_ordnum(0);
                  	
                  	
                  }
                  $("#thisorder").val(ordaddone(txtOrdId));
                }, function (ts, message) {alert(message);var tst = message;});
            });
            
                //执行sql脚本，插入数据
                db.transaction(function (trans) {
                   trans.executeSql("insert into MyOrders(ordid,orname,omname,realID) values(?,?,?,?) ",[txtOrdId, txtOrname, txtOmname,txtCol], function (ts, data) {
                   	 //显示当前记录
                   	var obData = {ordid:txtOrdId,orname:txtOrname,omname:txtOmname,realID:txtCol} ;
             	 			showThisTheOrderData (obData);
           	
                 }, function (ts, message) {
                        alert(message);
                    });
                });
                
                //清除当前显示
                clearThisOrderContent();
                 	
              
            });
            
            
        $("#wirtebackOderID").click(function () { //单号回填
        var txtOrdIda = $("#orderID").val();
        var txtSelComp = $("#selectedCompany").val();
        var txtCol = txtSelComp+": "+txtOrdIda;
				var txtOrdId = $("#findorder").val();;
//        var txtOmname = appendContentofOrder(); 
//        var txtOrname = $("#rname").val();
        
				var db = getCurrentDb();   //打开当前数据库
				//UPDATE Teachers SET Country='America' WHERE Id=3;  该语句用来改某列数据
/////////////////////////增加字段///////////////////////////只用运行一次/////////////// 				
				// ALTER TABLE OLD_COMPANY ADD COLUMN SEX char(1);  alter语句的用法
// 		db.transaction(function (trans) {
//                    trans.executeSql("alter table MyOrders add column realID",[], function (ts, data) {
//                    	
//            	
//                  }, function (ts, message) {
//                         alert(message);
//                     });
//                 });
////////////////////////////////
				
								//执行sql脚本，插入单元格数据
               	 db.transaction(function (trans) {
                   trans.executeSql("update MyOrders set realID = ? where ordid = ? ",[txtCol,txtOrdId], function (ts, data) {
                   	 //显示当前记录
                   	//var obData = {ordid:txtOrdId,orname:txtOrname,omname:txtOmname} ;
             	 			//showThisTheOrderData (obData);
           	
                 }, function (ts, message) {
                        alert(message);
                    });
                });
				
       });
                	
            
   });
   
   
   ///////////////////////////////////////////////////////////
        function getCurrentDb() {
            //打开数据库，或者直接连接数据库参数：数据库名称，版本，概述，大小
            //如果数据库不存在那么创建之
            var db = openDatabase("myDb", "1.0", "it's to save receiver and goods!", 10240 * 1024); 
            return db;
        }
        //显示所有数据库中的数据到页面上去
        function showAllTheData() {
            $("#tblData").empty();
            var db = getCurrentDb();
            db.transaction(function (trans) {
                trans.executeSql("select * from Receiver ", [], function (ts, data) {
                    if (data) {
                        for (var i = data.rows.length-1; i >=0; i--) {
                            appendDataToTable(data.rows.item(i));//获取某行数据的json对象
                        }
                        
                    }
                }, function (ts, message) {alert(message);var tst = message;});
            });
        }
        //显示所有数据库中的数据到页面上去
        function showAllTheMedicinData() {
            $("#tblMedData").empty();
            var db = getCurrentDb();
            db.transaction(function (trans) {
                trans.executeSql("select * from Medicine ", [], function (ts, data) {
                    if (data) {
                        for (var i = data.rows.length-1; i >=0; i--) {
                            appendMedDataToTable(data.rows.item(i));//获取某行数据的json对象
                        }
                    }
                }, function (ts, message) {alert(message);var tst = message;});
            });
        }
        //显示当前数据库中的数据到页面上去
        function showThisTheOrderData(data) {
            $("#tblOrderData").empty();
            appendOrderDataToTable(data);

        }
        

        //显示所有数据库中的数据到页面上去
        function showAllTheOrderData(data) {
            $("#tblOrderData").empty();
            //appendOrderDataToTable(data);
           
            var db = getCurrentDb();
            db.transaction(function (trans) {
                trans.executeSql("select * from MyOrders ", [], function (ts, data) {
                    if (data) {
                    	//appendOrderDataToTable(data.rows.item(data.rows.length-1));
                        for (var i = data.rows.length-1; i >=0; i--) {
                            appendOrderDataToTable(data.rows.item(i));//获取某行数据的json对象
                        }
                    }
                }, function (ts, message) {alert(message);var tst = message;});
            });
        }
        
        function appendOrderDataToTable(data) {
        		var txtOrdid = data.ordid;
        		var txtRealid = data.realID;
            var txtOrname = data.orname;
            var txtOmname = data.omname;
            var strHtml = "";
            strHtml += "<tr>";
            strHtml += "<td>"+txtOrdid+"</td>";
            strHtml += "<td>  <nobr>"+txtRealid+"</nobr> </td>";
            strHtml += "<td>  <nobr>" + txtOrname + "</nobr> </td>";
            strHtml += "<td>" + txtOmname + "</td>";
            strHtml += "</tr>";
            $("#tblOrderData").append(strHtml);
        }
        
        function appendMedDataToTable(data) {
            
        		var txtName = data.mname;
            var txtBrand = data.mbrand;
            var txtCnname = data.mcnname;
            var txtPrice = data.mprice;
            var txtWeight = data.mweight;
            var strHtml = "";
            strHtml += "<tr>";
            strHtml += "<td>"+txtName+"</td>";
            strHtml += "<td>" + txtBrand + "</td>";
            strHtml += "<td>" + txtCnname + "</td>";
            strHtml += "<td>"+txtPrice+"</td>";
            strHtml += "<td>" + txtWeight + "</td>";
            strHtml += "</tr>";
            $("#tblMedData").append(strHtml);
        }
        
        function appendDataToTable(data) {//将数据展示到表格里面     
            var txtName = data.dname;
            var txtProvince = data.dprovince;
            var txtCity = data.dcity;
            var txtDistrict = data.ddistrict;
            var txtAddress = data.daddress;
            var txtPostcode = data.dpostcode;
            var txtEmail = data.demail;
            var txtIdno = data.didno;
            var txtPhone = data.dphone;
            var strHtml = "";
            strHtml += "<tr>";
            strHtml += "<td>"+txtName+"</td>";
            strHtml += "<td>" + txtProvince + "</td>";
            strHtml += "<td>" + txtCity + "</td>";
            strHtml += "<td>"+txtDistrict+"</td>";
            strHtml += "<td>" + txtAddress + "</td>";
            strHtml += "<td>" + txtPostcode + "</td>";
            strHtml += "<td>"+txtEmail+"</td>";
            strHtml += "<td>" + txtIdno + "</td>";
            strHtml += "<td>" + txtPhone + "</td>";
            strHtml += "</tr>";
            $("#tblData").append(strHtml);
        }
       function clearScreen() {
          $("#tblData").empty();
        }
        
       function clearMedScreen() {
          $("#tblMedData").empty();
        }
        
       function clearOrderScreen() {
          $("#tblOrderData").empty();
        }
        
        function clearOrderForm() {
          //$("#myorderform").content("");
         $('.input').val("");
         
         $('.ui-autocomplete-input').val("");
					//$("tbody").empty();
					//$("table tr").text("").find(":not(:first)").val("");
					
        }
        
        
        //修改数据功能
        
         function modiItem() {
         	var oldName =  $( "#rname").val();
          var txtProvince = $("#province").val();
          var txtCity = $("#city").val();
          var txtDistrict = $("#district").val();
          var txtAddress = $("#address").val();
          var txtPostcode = $("#postcode").val();
          var txtEmail = $("#email").val();
          var txtIdno = $("#idno").val();
          var txtPhone = $("#phone").val();
          var idnum = $("#nameindex").val();
          
          var db = getCurrentDb();
    

                //执行sql脚本，插入数据  //不行，所有的同名都被刷新 //该方法也不行， 无法读取
        //        	 db.transaction(function (trans) {
// 					 trans.executeSql("update Receiver set  dname = ?,dprovince = ?,dcity = ?,ddistrict = ?,daddress = ?,dpostcode = ?,demail = ?,didno = ?,dphone = ? where rowid = ?",[oldName,txtProvince, txtCity,txtDistrict, txtAddress, txtPostcode,txtEmail, txtIdno, txtPhone, idnum], function (ts, data){
//      	
//                  }, function (ts, message) {
//                         alert(message);});
//                 });
          
//             var db = getCurrentDb();
            //删除当前记录
            // db.transaction(function (trans) {
//                 trans.executeSql("delete  from Receiver where dname = ?", [oldName], function (ts, data) {
//                     if (data) {
//                     	//appendOrderDataToTable(data.rows.item(data.rows.length-1));
//                         //for (var i = data.rows.length-1; i >=0; i--) {
//                           //  appendOrderDataToTable(data.rows.item(i));//获取某行数据的json对象
//                         //}
//                     }
//                 }, function (ts, message) {alert(message);var tst = message;});
//             });

                //执行sql脚本，插入修改后的数据
//                 db.transaction(function (trans) {
//                    trans.executeSql("insert into Receiver(dname,dprovince,dcity,ddistrict,daddress,dpostcode,demail,didno,dphone) values(?,?,?,?,?,?,?,?,?) ",[oldName, txtProvince, txtCity,txtDistrict, txtAddress, txtPostcode,txtEmail, txtIdno, txtPhone], function (ts, data) {
//                            }, function (ts, message) {
//                         alert(message);
//                     });
//                 });
                
                
               //showAllTheData();
        }
        
        function modiMedItem() {
         	var txtName = $("#mname").val();
          var txtBrand = $("#mbrand").val();
          var txtCnname = $("#mcnname").val();
          var txtPrice = $("#mprice").val();
          var txtWeight = $("#mweight").val(); 
          
            var db = getCurrentDb();
            //删除当前记录
            db.transaction(function (trans) {
                trans.executeSql("delete  from Medicine where mname = ?", [txtName], function (ts, data) {
                    if (data) {
                    	
                    }
                }, function (ts, message) {alert(message);var tst = message;});
            });

                //执行sql脚本，插入数据
                db.transaction(function (trans) {
                   trans.executeSql("insert into Medicine(mname,mbrand,mcnname,mprice,mweight) values(?,?,?,?,?) ",[txtName, txtBrand, txtCnname,txtPrice, txtWeight], function (ts, data) {
                 }, function (ts, message) {
                        alert(message);
                    });
                });
        }
        
        
        function modiOrderItem() {
         		var txtOrdId = $("#findorder").val();;
            	var txtOmname = appendContentofOrder(); 
            	//var txtOrname = $("#rname").val();
            	//var txtOrdrealID = $("#orderID").val();
            	//var txtOrdrealID = $("#selectedCompany").val()+":"+$("#orderID").val();
            	var txtOrdIda = $("#orderID").val();
            	//首先判断单号中是否含有fang:,有的话需要去掉
            	if (txtOrdIda.indexOf(":")!=-1){      //如果有:,则去掉前缀
            		var tmpordid = txtOrdIda.split(":");
            		txtOrdIda = tmpordid[tmpordid.length-1];
            	}
       				var txtSelComp = $("#selectedCompany").val();
        			var txtOrdrealID = txtSelComp+": "+txtOrdIda;
            	
            	var txtIndNam = $("#nameindex").val(); //从姓名下拉菜单选择，此值为大于等于0的整数； 否则为空
            	if(txtIndNam!=""){
            		var txtOrname = $("#rname").val()+":"+txtIndNam;
            	}
            	else{
            		var txtOrname = $("#rname").val();
            	}
            	
            	var db = getCurrentDb();
       
            //删除当前记录
//             db.transaction(function (trans) {
//                 trans.executeSql("delete  from MyOrders where ordid = ?", [txtOrdId], function (ts, data) {
//                     if (data) {
//                     	
//                     }
//                 }, function (ts, message) {alert(message);var tst = message;});
//             });

                //执行sql脚本，插入数据
               	 db.transaction(function (trans) {
                   //trans.executeSql("insert into MyOrders(ordid,orname,omname,realID) values(?,?,?,?) ",[txtOrdId, txtOrname, txtOmname,txtOrdrealID], function (ts, data) {
                   	 trans.executeSql("update MyOrders set realID = ?, orname = ? , omname = ? where ordid = ? ",[txtOrdrealID,txtOrname,txtOmname,txtOrdId], function (ts, data){
     	
                 }, function (ts, message) {
                        alert(message);
                    });
                });
        }
        
         function deleteTheLastData() {
         		var txtOrdId = $("#findorder").val();;
            	var txtOmname = appendContentofOrder(); 
            	var txtOrname = $("#rname").val();
            	var db = getCurrentDb();
            	var lastnum = 0;
         	
            
//            db.transaction(function (trans) {
//                trans.executeSql("select * from MyOrders ", [], function (ts, data) {
//                    if (data) {
//                        lastnum = data.rows.length;
//                        
//                    }
//                }, function (ts, message) {alert(message);var tst = message;});
//            });
            
//             删除最后记录
//            db.transaction(function (trans) {
//               //trans.executeSql("delete  from MyOrders where rowid = ?", [lastnum], function (ts, data) {
//                	trans.executeSql("delete  from MyOrders where rowid > 159", [], function (ts, data) {
//                    if (data) {
//                    }
//                }, function (ts, message) {alert(message);var tst = message;});
//            });

        }
        
        
        function deleteMedItem() {
         	var txtName = $("#mname").val();
          
            var db = getCurrentDb();
            //删除当前记录
            db.transaction(function (trans) {
                trans.executeSql("delete  from Medicine where mname = ?", [txtName], function (ts, data) {
                    if (data) {
                    	
                    }
                }, function (ts, message) {alert(message);var tst = message;});
            });

               
        }
        
        
       //慎用清除数据库
       function clearDatebase() {
          $("#tblData").empty();
       /*
          var db = getCurrentDb();
            db.transaction(function (trans) {
                trans.executeSql("delete from MyOrders ", [], function (ts, data) {        //清除表中的数据 
               // trans.executeSql("drop table Medicine ", [], function (ts, data) {          //直接将表删除
               }, function (ts, message) {alert(message);});
            });
       */
        }
        function clearMedDatebase() {
          $("#tblMedData").empty();
       /*
          var db = getCurrentDb();
            db.transaction(function (trans) {
                trans.executeSql("delete from Medicine ", [], function (ts, data) {        //清除表中的数据 
               // trans.executeSql("drop table Medicine ", [], function (ts, data) {          //直接将表删除
               }, function (ts, message) {alert(message);});
            });
       */
        }
        function clearOrderDatebase() {
          $("#tblOrderData").empty();
       /*
          var db = getCurrentDb();
            db.transaction(function (trans) {
                trans.executeSql("delete from MyOrders ", [], function (ts, data) {        //清除表中的数据 
               // trans.executeSql("drop table Medicine ", [], function (ts, data) {          //直接将表删除
               }, function (ts, message) {alert(message);});
            });
       */
        }
        function getRawTheData() {
						var db = getCurrentDb();
						var getrecodname = new Array();
            db.transaction(function (trans) {
                trans.executeSql("select * from Receiver ", [], function (ts, data) {
                    if (data) {
                    	 // RowofReciever = data.rows.length;
                    	  for (var i = 0; i < data.rows.length; i++) {
                           getrecodname[i] = data.rows.item(i).dname;   //获取某行数据的dname字段
                        }
                  }
                }, function (ts, message) {alert(message);var tst = message;});
            });
           // var rnamesel = window.RecordofReciever;
	 					//$( "#rname" ).autocomplete({
						//source: getrecodname,
							//});
							return getrecodname;
        }
        
		  function ordaddone(oldord){
			//对原来的值加1
			if(oldord != "")
			{
			var strInstance = oldord.substring(1,9);
			var newnum = parseInt(strInstance) + 1;
			var strNewnum = newnum+"";
		  var sixZore = "A00000000";
		  var newordernum = "";
		   if(strNewnum.length < 9)
		   {
		       newordernum =  sixZore.substring(0,(9 - strNewnum.length)) + strNewnum;
		      //alert(value);
		    }
		  }
		  else
		  	{
		  		newordernum = "A00000001";
		  	}
		    return newordernum;
		}

		function cal_ordnum(instance){
			 var strInstance = instance + "";
		   var sixZore = "A00000000";
		   if(strInstance.length < 9)
		   {
		      var ordernum =  sixZore.substring(0,(9 - strInstance.length)) + strInstance;
		    
		    }
		    else
		    	{
		    		alert(strInstance+"beyond the limits");
		    	}
		    return ordernum;
		}
    
    function appendContentofOrder(){  //需要存储的信息
    	var strHtml = "";
    	for(var i=1;i<=8;i++)
			{
				strHtml += $( "#itemdesc_" + i ).val();
				strHtml += "*";
				strHtml += $( "#itemqty" + i ).val();
				strHtml += "*";
				strHtml += $( "#itemvalue" + i ).val();
				strHtml += "---";
			}
			strHtml += "邮费:" + $( "#povalue" ).val() + "$   ";
			strHtml +=  "总价:" + $( "#allvalue" ).val() + "$";
			return strHtml;
     // strHtml += $("#itemdesc_1").val();
     // strHtml += $("#itemqty1").val();
    } 
    
    function clearThisOrderContent(){
	    for(var i=1;i<=8;i++)
			{
				$( "#itemdesc_" + i ).val("");
				$( "#itembrand_" + i ).val("");
				$( "#itemname_" + i ).val("");
				$( "#itemvalue" + i ).val("");
				$( "#itemqty" + i ).val("");
			} 
			$("#orderID").val("");
			$("#povalue").val("");
			$("#allvalue").val("");
			    
		}
		



//	var getrowname 
	function getRawTheData() {
						var db = getCurrentDb();
						var getrecodname = new Array();
            db.transaction(function (trans) {
                trans.executeSql("select * from Receiver ", [], function (ts, data) {
                    if (data) {
                    	 // RowofReciever = data.rows.length;
                    	  for (var i = 0; i < data.rows.length; i++) {
                           getrecodname[i] = data.rows.item(i).dname;   //获取某行数据的dname字段
                        }
                  }
                }, function (ts, message) {alert(message);var tst = message;});
            });
           // var rnamesel = window.RecordofReciever;
	 					//$( "#rname" ).autocomplete({
						//source: getrecodname,
							//});
							return getrecodname;
        }
        
	$(function() 
	{
		
	//自动完成	
	var testv = ["a1","a2","a3","石云1"];
	//var rnamesel = new Array;
	
	//var db = getCurrentDb();
	var db = openDatabase("myDb", "1.0", "it's to save receiver!", 10240 * 1024);
						var getrecodname = new Array();
						var getobject = {};
						var getobjectarr = new Array();
            db.transaction(function (trans) {
                trans.executeSql("select * from Receiver ", [], function (ts, data) {
                    if (data) {
                    	 // RowofReciever = data.rows.length;
                    	  for (var i = 0; i < data.rows.length; i++) {
                          getrecodname[i] = data.rows.item(i).dname;   //获取某行数据的dname字段
                         // getobject.label = i;                        //测试对象数组的使用
                          //getobject.value = data.rows.item(i).dname;
                          //getobjectarr[i] = getobject;
                          //getobjectarr[i] = {label:data.rows.item(i).dname,value:data.rows.item(i).dname,ind:i};  //对象数组，给lable赋值。
                          getobjectarr[i] = {label:data.rows.item(i).dname,ind:i};
                         }
                            $( "#rname" ).autocomplete({                 //自动填充
								        		source:getobjectarr,
								        		//source: testv,
								        		minLength: 1,
								        		autoFocus: true,
								        		select: function(e, ui) {                 //选择函数，选择某一项后作如何处理
								        			$( "#province").val(data.rows.item(ui.item.ind).dprovince);
								        			$( "#city").val(data.rows.item(ui.item.ind).dcity);
								        			$( "#district").val(data.rows.item(ui.item.ind).ddistrict);
								        			$( "#address").val(data.rows.item(ui.item.ind).daddress);
								        			$( "#postcode").val(data.rows.item(ui.item.ind).dpostcode);
								        			$( "#email").val(data.rows.item(ui.item.ind).demail);
								        			$( "#idno").val(data.rows.item(ui.item.ind).didno);
								        			$( "#phone").val(data.rows.item(ui.item.ind).dphone);
								        			$( "#nameindex").val(ui.item.ind);
								        			
								        	    /*temp=$(this).attr("id");
								        			temp1=temp.split("_");
								        			id=temp1[1];
								        			$( "#province").val(data.rows.item(temp).dprovince);
								        			$( "#itemvalue_"+id ).val(ui.item.price);
								        			$( "#itemname_"+id ).val(ui.item.name);
								        			$( "#itemtaxcode_"+id ).val(ui.item.taxcode); */
								        		},
								        		change: function(event, ui) {
								        		//	 $( this ).val(ui.item.cnname);  //这句话出错，原因待查
								        		 }
								        		 
								        	});
	
                       
                        
                  }
                }, function (ts, message) {alert(message);var tst = message;});
            });
	
   //rnamesel = getRawTheData();//window.RecordofReciever;
	
	//自动完成--Medicine数据库
	var getMedrecodname = new Array();
						var getMedobject = {};
						var getMedobjectarr = new Array();
						db.transaction(function (trans) {
                trans.executeSql("select * from Medicine ", [], function (ts, data) {
                    if (data) {
                    	  for (var i = 0; i < data.rows.length; i++) {
                          getMedrecodname[i] = data.rows.item(i).mname;   //获取某行数据的dname字段
                          getMedobjectarr[i] = {label:data.rows.item(i).mname,ind:i};
                         }
                            $( "#mname" ).autocomplete({                 //自动填充
								        		source:getMedobjectarr,
								        		minLength: 2,
								        		autoFocus: true,
								        		select: function(e, ui) {                 //选择函数，选择某一项后作如何处理
								        			$( "#mbrand").val(data.rows.item(ui.item.ind).mbrand);
								        			$( "#mcnname").val(data.rows.item(ui.item.ind).mcnname);
								        			$( "#mprice").val(data.rows.item(ui.item.ind).mprice);
								        			$( "#mweight").val(data.rows.item(ui.item.ind).mweight);
								        			},
								        		change: function(event, ui) {
								        			// $( this ).val(ui.item.cnname);
								        		 }
								        		 
								        	});
								        	
								        	//自动填充订单
								        	for(var i=1; i<=8; i++){
								        	$( "#itemdesc_" + i ).autocomplete({                 //自动填充
								        		source:getMedobjectarr,
								        		minLength: 2,
								        		autoFocus: true,
								        		select: function(e, ui) {                 //选择函数，选择某一项后作如何处理
								        			var temp=$(this).attr("id");
															var temp1=temp.split("_");
															var id=temp1[1];
								        			$( "#itembrand_" + id).val(data.rows.item(ui.item.ind).mbrand);
								        			$( "#itemname_" + id).val(data.rows.item(ui.item.ind).mcnname);
								        			//$( "#itemvalue_" + id).val(data.rows.item(ui.item.ind).mprice);
								        			$( "#itemvalue"+ id).val(data.rows.item(ui.item.ind).mprice);
								        			},
								        		change: function(event, ui) {
								        			// $( this ).val(ui.item.cnname);
								        		 }
								        		 
								        	});
								        }
												
												
                       
                        
                  }
                }, function (ts, message) {alert(message);var tst = message;});
            });
            
            
            //自动完成，订单查询
            var getordidnum = new Array();
						//var getobject = {};
						var getobjectord = new Array();
						var getnamea = "";
            db.transaction(function (trans) {
                trans.executeSql("select * from MyOrders ", [], function (ts, data) {
                    if (data) {
                    	
                    	  for (var i = 0; i < data.rows.length; i++) {
                          getordidnum[i] = data.rows.item(i).ordid;   //获取某行数据的 字段
                          getobjectord[i] = {label:data.rows.item(i).ordid,ind:i};
                         }
                            $( "#findorder" ).autocomplete({                 //自动填充
								        		source:getobjectord,								        	
								        		minLength: 1,
								        		autoFocus: true,
								        		select: function(e, ui) {                 //选择函数，选择某一项后作如何处理
								        			//$('.input').val("");  //先清理数据
								        			//先判断有无重名再做处理
								        			getnamea = data.rows.item(ui.item.ind).orname;
								        			var namesp = new Array;
								        			namesp = getnamea.split(":");
								        			$( "#rname").val(namesp[0]); //根据名字查找其他数据
								        			//var getnameoford = data.rows.item(ui.item.ind).orname;
								        			if(namesp[1]!=undefined){ 
								        				$( "#nameindex").val(namesp[1]);
								        		
								        			}
								        			getrelateinfo($( "#nameindex").val());
								        			var realidsp = data.rows.item(ui.item.ind).realID;
								        			if(realidsp!=null){
							            				$( "#orderID").val(realidsp.split(":")[1]); //单号
							            			}
								        			getrelategoodsinfo(data.rows.item(ui.item.ind).omname);  
								        		},
								        		change: function(event, ui) {
								        		//	 $( this ).val(ui.item.cnname);  //这句话出错，原因待查
								        		 }
								        		 
								        	});
	
                       
                        
                  }
                }, function (ts, message) {alert(message);var tst = message;});
            });

        //自动完成，实际订单查询
            var getordidnumb = new Array();
			var getobjectordb = new Array();
			var getidobj = new Array();
			var getnameab = "";
            db.transaction(function (trans) {
                trans.executeSql("select * from MyOrders ", [], function (ts, data) {
                    if (data) {
                    	
                    	  for (var i = 0; i < data.rows.length; i++) {
// 						  if( data.rows.item(i).realID!=null)
                    	  {
							  // getidobj = data.rows.item(i).realID.split(":");
// 							  getordidnumb[i] = getidobj[1];   //获取某行数据的 字段
// 							  getobjectordb[i] = {label:getordidnumb[i],ind:i};
							   
							  getordidnumb[i] =  data.rows.item(i).realID;   //获取某行数据的 字段
							  getobjectordb[i] = {label:getordidnumb[i],ind:i};
                          }
                         }
                            $( "#orderID" ).autocomplete({                 //自动填充
								        		source:getobjectordb,								        	
								        		minLength: 1,
								        		autoFocus: true,
								        		select: function(e, ui) {                 //选择函数，选择某一项后作如何处理
								        			//$('.input').val("");  //先清理数据
								        			//先判断有无重名再做处理
								        			// var realidsp = data.rows.item(ui.item.ind).realID;
// 								        			if(realidsp!=null){
// 							            				$( "#orderID").val(realidsp.split(":")[1]); //单号
// 							            			}
							            			
								        			getnameab = data.rows.item(ui.item.ind).orname;
								        			var namespb = new Array;
								        			namespb = getnameab.split(":");
								        			$( "#rname").val(namespb[0]); //根据名字查找其他数据
								        			//var getnameoford = data.rows.item(ui.item.ind).orname;
								        			if(namespb[1]!=undefined){
								        			$( "#nameindex").val(namespb[1]);
								        			getrelateinfo(namespb[1]);
								        			}
								        			else{
								        			getrelateinfo("");
								        			}
								        			//var realidsp = data.rows.item(ui.item.ind).ordid;
							            			$( "#findorder").val(data.rows.item(ui.item.ind).ordid); //单号
								        			getrelategoodsinfo(data.rows.item(ui.item.ind).omname);  
								        		},
								        		change: function(event, ui) {
								        		//	 $( this ).val(ui.item.cnname);  //这句话出错，原因待查
								        		 }
								        		 
								        	});
	
                    
                        
                  }
                }, function (ts, message) {alert(message);var tst = message;});
            });            
            //////////////
	
	 });

function getrelateinfo(ind)
{
			var db = openDatabase("myDb", "1.0", "it's to save receiver!", 10240 * 1024);
			var getnameoford = $( "#rname").val();
			//var getnameobj = {val:getnameoford};
		if(ind!=""){	
				db.transaction(function (trans) {
		  trans.executeSql("select * from Receiver", [ ], function (ts, data) {  //select * from class where name='hongdy';
			 if (data) {
				$( "#province").val(data.rows.item(ind).dprovince);
						$( "#city").val(data.rows.item(ind).dcity);
						$( "#district").val(data.rows.item(ind).ddistrict);
						$( "#address").val(data.rows.item(ind).daddress);
						$( "#postcode").val(data.rows.item(ind).dpostcode);
						$( "#email").val(data.rows.item(ind).demail);
						$( "#idno").val(data.rows.item(ind).didno);
						$( "#phone").val(data.rows.item(ind).dphone);
			 
		   }
		 }, function (ts, message) {alert(message);var tst = message;});
			});
	}
	else{
		db.transaction(function (trans) {
		  trans.executeSql("select * from Receiver where dname = ?", [getnameoford], function (ts, data) {  //select * from class where name='hongdy';
			 if (data) {
				$( "#province").val(data.rows.item(0).dprovince);
						$( "#city").val(data.rows.item(0).dcity);
						$( "#district").val(data.rows.item(0).ddistrict);
						$( "#address").val(data.rows.item(0).daddress);
						$( "#postcode").val(data.rows.item(0).dpostcode);
						$( "#email").val(data.rows.item(0).demail);
						$( "#idno").val(data.rows.item(0).didno);
						$( "#phone").val(data.rows.item(0).dphone);
			 
		   }
		 }, function (ts, message) {alert(message);var tst = message;});
			});
	}
	
}

function getrelategoodsinfo(datain)   //将datain的数据分解
{
// 			var db = openDatabase("myDb", "1.0", "it's to save receiver!", 10240 * 1024);
			//var getnameoford = $( "#rname").val();
				//temp=$(this).attr("id");

		var	itemmed=datain.split("---");
		var ordname =  new Array();
		var sizeofitem = 0;
	// 	for(var i=0;i < itemmed.length;i++)
// 		{
// 			
// 		}	
		
		for(var i=1;i < itemmed.length;i++){
			var	itemmed1=itemmed[i-1].split("*");
			if (itemmed1[0]!= undefined){
				$( "#itemdesc_" + i).val(itemmed1[0]);
				$( "#itemqty" + i).val(itemmed1[1]);
				$( "#itemvalue" + i).val(itemmed1[2]);
				ordname[i-1] = itemmed1[0];
				getrelatemedinfo(itemmed1[0],i);
			}
		}
		if(itemmed[itemmed.length-1].indexOf("$")!= -1){
			var itemlast = itemmed[itemmed.length-1].split("$");
			if (itemlast[0]!= undefined){
				var itemv = itemlast[0].split(":");
				$( "#povalue" ).val(itemv[1]);
				var itemu = itemlast[1].split(":");
				$( "#allvalue" ).val(itemu[1]);
		
			}
		}
		

 		
}

function getrelatemedinfo(datain,ind)   //从medcine数据库里取值
{
	var db = openDatabase("myDb", "1.0", "it's to save receiver!", 10240 * 1024);
	var getname = datain;
  db.transaction(function (trans) {
     trans.executeSql("select * from Medicine where mname = ? ", [datain], function (ts, data) {  
     //	trans.executeSql("select * from Medicine ", [], function (ts, data) {    //这句话是正确的，问题出在where那儿,数据库中字段选错了
         if (data) {
   		  	$( "#itembrand_"+ ind).val(data.rows.item(0).mbrand);
					$( "#itemname_" + ind).val(data.rows.item(0).mcnname);		    	 
       }
     }, function (ts, message) {alert(message);var tst = message;});
 		});
}



 function chk_form(){

// decide which target will be sent to the form data
var primethod = document.getElementById("action").value;
     switch (primethod)
     {
         case "1":
             document.myform1.action="./printa.html";
             break;
         case "2":
             document.myform1.action="./printa_10.html";
             break;
         case "3":
             document.myform1.action="./printc.html";
             break;
            case "4":
             document.myform1.action="./printd.html";
             break;
        }

	var name = document.getElementById("dname");
	if(name.value==""){
		alert("姓名不能为空！");
		return false;
		//user.focus();
	}
	var address = document.getElementById("daddress");
	if(address.value==""){
		alert(" 地址不能为空！");
		return false;
		//user.focus();
	}

	var phone = document.getElementById("dphone");
	if(phone.value.length != 11){
		alert("电话号码为11位手机号去掉国家代码！");
		return false;
		//user.focus();
	}
	var idno = document.getElementById("didno");
	if(idno.value=="" || idno.value.length < 15){
		alert("身份证号出错！");
		return false;
		//user.focus();
	}
	
	var patten=new RegExp(/^[0-9]+$/);
	var re=/^\d+(?=\.{0,1}\d+$|$)/;
	var tweight = document.getElementById("tweight");
	if(!re.test(tweight.value)) 
	{ 

		alert("请检查包裹重量一栏，请填写实际数字！"); 
		return false; 
	} 
		
	var depotselect = document.getElementById("depotselect");
	if(depotselect.value=="") 
	{ 

		alert("请选择包裹接收方式！"); 
		return false; 
	} 

	if(confirm('确认提交订单?')){
		return true;
	}else{
		return false;
	}	
}

function decideTrueAddress(){   //调用数据库的时候不能直接返回值，要采取迂回做法
	var getnameoford = $( "#rname").val();
	var getaddoford = $( "#address").val();
	var recindex = 0;
	var db = getCurrentDb();
	db.transaction(function (trans) {
	trans.executeSql("select * from Receiver where dname = ?", [getnameoford], function (ts, data) {
		if (data) {
			//var lastcnt = data.rows.length - 1;
			for(var i=0;i < data.rows.length;i++){
				if (getaddoford == data.rows.item(i).daddress){
					 recindex = i;
					
				}
				
			 }

		}
		
		$( "#nameindex").val(recindex);	
		//$("#thisorder").val(ordaddone(txtOrdId));
		}, function (ts, message) {alert(message);var tst = message;});
	});
	
	//  var getind = $("#nameindex").val();
// 	 return getind;
					

}


function writeDatatoMyorder(){   //调用数据库的时候不能直接返回值，要采取迂回做法
	var db = getCurrentDb();
	var txtOrdId = $("#thisorder").val();
	var txtOmname = appendContentofOrder(); 
	var txtOrname = $("#rname").val();
	var txtCol = $("#selectedCompany").val()+":"+$("#orderID").val();   //回填的订单号
	// var getaddoford = $( "#address").val();
// 	var getnameoford = $( "#rname").val();
// 	var getaddoford = $( "#address").val();
// 	var recindex = 0;

	var nameindexa = $("#nameindex").val();
	if(nameindexa!="" && nameindexa!="0"){
		txtOrname += ":"+nameindexa;   //加上姓名的序号, 如果有重名 存储方式不同
	}
            	
	db.transaction(function (trans) {
 //执行sql脚本，插入数据
               // db.transaction(function (trans) {
                   trans.executeSql("insert into MyOrders(ordid,orname,omname,realID) values(?,?,?,?) ",[txtOrdId, txtOrname, txtOmname,txtCol], function (ts, data) {
                   	 //显示当前记录
                   	var obData = {ordid:txtOrdId,orname:txtOrname,omname:txtOmname,realID:txtCol} ;
             	 			showThisTheOrderData (obData);
           	
                 }, function (ts, message) {
                        alert(message);
                    });
         });
	}		