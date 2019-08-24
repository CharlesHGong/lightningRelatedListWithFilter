({
    getMaxCount : function(cmp,recordId,object,conditions,relationship){
        var action = cmp.get("c.getCountRecords");
        action.setParams({
            "recId": recordId,
            "relatedObjectName" : object,
            "conditions" : conditions,
            "relationship" : relationship
        });
        action.setCallback(this, $A.getCallback(function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var maxCount = response.getReturnValue();
                cmp.set('v.maxCount', maxCount);
                console.log('maxCount: ' + cmp.get('v.maxCount'));
            } else if (state === "ERROR") {
                var errors = response.getError();
                console.error(errors);
            }
        }));
        $A.enqueueAction(action);
    },
    getIconName : function(cmp,obj){
        var action = cmp.get("c.getIconName");
        action.setParams({
            "sObjectName": obj
        });
        action.setCallback(this, $A.getCallback(function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var iconName = response.getReturnValue();
                if (!cmp.get('v.iconName')) {cmp.set('v.iconName', iconName)};
                console.log('iconName: ' + cmp.get('v.iconName'));
            } else if (state === "ERROR") {
                var errors = response.getError();
                console.error(errors);
            }
        }));
        $A.enqueueAction(action);
    },
    getObjLabel : function(cmp,obj){
        var action = cmp.get("c.getObjLabel");
        console.log(obj);
        action.setParams({
            "objAPIName": obj
        });
        action.setCallback(this, $A.getCallback(function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var label = response.getReturnValue();
                cmp.set('v.objectLabel', label);
                console.log('ObjLabel: ' + cmp.get('v.objectLabel'));
            } else if (state === "ERROR") {
                var errors = response.getError();
                console.error(errors);
            }
        }));
        $A.enqueueAction(action);
    },
    fetchData : function(cmp,evt,hlp, recordId, fields, relatedObjectName, sortOrder, conditions, relationship,recordLimit) {
        var action = cmp.get("c.getRecords");
        action.setParams({
            "recId": recordId,
            "fields": fields,
            "relatedObjectName": relatedObjectName, 
            "conditions": conditions,
            "sortOrder": sortOrder, 
            "relationship": relationship,
            "recordLimit" : recordLimit.toString()
        });
        console.log("sortOrder: "+ sortOrder);
        action.setCallback(this, $A.getCallback(function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var data = response.getReturnValue();
                console.log("raw data:"+JSON.stringify(data));

                if (cmp.get("v.displayFormat") == "List"){
                    cmp.set('v.data', hlp.toListData(data,cmp.get("v.columns")));    
                } else {
                    cmp.set('v.data', hlp.toTileData(data,cmp.get("v.columns")));  
                }
                console.log('DATA: ' + JSON.stringify(cmp.get('v.data')));
                
            } else if (state === "ERROR") {
                var errors = response.getError();
                console.error(errors);
            }
        }));
        $A.enqueueAction(action);
    },
    toListData:function(data,columns){
        data.forEach(function(record){
            for (var field of columns){
                if (field.typeAttributes && field.typeAttributes.relationship){
                    if (record[field.typeAttributes.relationship]){
                        record[field.typeAttributes.relationship+"_Id"] = "/" +record[field.typeAttributes.relationship]['Id'];
                        record[field.typeAttributes.relationship+"_Name"] = record[field.typeAttributes.relationship]['Name'];    
                    } else {
                        record[field.typeAttributes.relationship+"_Id"] = "";
                        record[field.typeAttributes.relationship+"_Name"] = "";    
                    }
                } else if (field.type == 'datetime'){
                    var d = new Date(record[field.fieldName]);
                    record[field.fieldName] = d.toLocaleString();
                } else if (field.type == 'text'){
                    var converted = record[field.fieldName];
                    console.log('TEST:' + converted)
                    if(converted != null){
                        converted.toString();
                        record[field.fieldName] = converted + '%';
                    }
                    
                }else if (field.type == 'textarea'){
                    record[field.fieldName] = record[field.fieldName];
                }
            }
            record.linkName = '/'+ record.Id;
            record.urlName = record.Name;
        });
        return data;
    },
    toTileData:function(data,columns){
        var tileData = [];
        data.forEach(function(record){
            var tileRecord = [];
            for (var field of columns){
                if (field.type != 'action'){
                    var tileCell = {label:field.label};
                    if (field.fieldName == 'linkName'){
                        tileCell['data']	= record[field.typeAttributes.label.fieldName];
                        tileCell['url']		= "/" + record['Id'];
                    } else if (field.typeAttributes && field.typeAttributes.label && field.typeAttributes.label.fieldName){
                        if (record[field.typeAttributes.relationship]){
                            tileCell['data'] 	= record[field.typeAttributes.relationship]['Name'];
                            tileCell['url'] 	= "/" +record[field.typeAttributes.relationship]['Id'];
                         } else {
                             tileCell['data'] = "";                             
                         }
                    } else if (field.type == "boolean"){
                        tileCell['icon'] = record[field.fieldName] ? 'utility:check':'' ;
                    } else if (field.type == 'datetime'){
                        var d = new Date(record[field.fieldName]);
                        tileCell['data'] = record[field.fieldName] ? d.toLocaleDateString() : '';
                    } else if (field.type == 'date'){
                        var d = new Date(record[field.fieldName]);
                        tileCell['data'] = record[field.fieldName] ? d.toLocaleDateString() : '';
                    } else if (field.type == 'textarea'){
                        tileCell['data'] = record[field.fieldName].split('\n')[0];
                    } else if (field.type =='percent'){
                        tileCell['data'] = record[field.fieldName] + '%';
                    } else {
                        tileCell['data'] = record[field.fieldName];
                    }
                    tileRecord.push(tileCell);
                }
            }
            tileData.push({id:record.Id,fields:tileRecord});
        });
        console.log(tileData);
        return tileData;
    },
    fetchColumns : function(cmp,evt,hlp, recordId, fields, relatedObjectName) {
        var tableActions = hlp.getTableActions(cmp);
        var tileAction 	= hlp.setTileActions(cmp);
        var action = cmp.get("c.getColumns");
        action.setParams({
            "recId": recordId,
            "fields": fields,
            "relatedObjectName": relatedObjectName
        });
        action.setCallback(this, $A.getCallback(function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var columns = response.getReturnValue();
                tableActions.length != 0 ? columns.push({ type: 'action', typeAttributes: { rowActions: tableActions } }) : '';
                cmp.set('v.columns', columns);
                console.log('COLUMNS: ' + JSON.stringify(columns));
            } else if (state === "ERROR") {
                var errors = response.getError();
                console.error(errors);
            }
        }));
        $A.enqueueAction(action);
    },
    getTableActions:function(cmp){
        var actionListMap = {
            'view' : { label: 'View', name: 'viewRecord' },
            'edit' : { label: 'Edit', name: 'editRecord' }
            //TODO add delete
        };
        var tableActions = [];
        var actionList = cmp.get('v.actionList') ? cmp.get('v.actionList').split(';') : [];
        for (var i = 0; i<actionList.length;i++){
            actionListMap[actionList[i]] ? tableActions.push(actionListMap[actionList[i]]) : '';
        }
        return tableActions;
    },
    setTileActions:function(cmp){
        var actionListMap = {
            'view' : { label: 'View', name: 'viewRecord' },
            'edit' : { label: 'Edit', name: 'editRecord' }
            //TODO add delete
        };
        var tileActions = [];
        var actionList = cmp.get('v.actionList') ? cmp.get('v.actionList').split(';') : [];
        for (var i = 0; i<actionList.length;i++){
            actionListMap[actionList[i]] ? tileActions.push(actionListMap[actionList[i]]) : '';
        }
        return cmp.set("v.tileActions",tileActions);
    },
    editRecord:function(recordId){
        var editRecordEvent = $A.get("e.force:editRecord");
        editRecordEvent.setParams({
            "recordId": recordId
        });
        //editRecordEvent.setCallback(this, $A.getCallback(function (response) {
        //    console.log(JSON.stringify(response));
        //}));
        editRecordEvent.fire();
    },
    viewRecord:function(recordId){
        var editRecordEvent = $A.get("e.force:navigateToSObject");
        editRecordEvent.setParams({
            "recordId": recordId
        });
        editRecordEvent.fire();
    }
})