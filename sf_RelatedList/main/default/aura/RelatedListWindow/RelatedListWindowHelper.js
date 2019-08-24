({
    setInit : function(cmp,event,helper){
        var object = cmp.get("v.pageReference").state.c__object;
        var objectLabel = cmp.get("v.pageReference").state.c__objectLabel ;
        var iconName = cmp.get("v.pageReference").state.c__iconName;
        var fields = cmp.get("v.pageReference").state.c__fields ;
        var relationship = cmp.get("v.pageReference").state.c__relationship;
        var sortOrder = cmp.get("v.pageReference").state.c__sortOrder;
        var conditions = cmp.get("v.pageReference").state.c__conditions;
        var recordId = cmp.get("v.pageReference").state.c__recordId;
        var fields = cmp.get("v.pageReference").state.c__fields;
        var maxCount = cmp.get("v.pageReference").state.c__maxCount;
        var actionList = cmp.get("v.pageReference").state.c__actionList;
        
        cmp.set("v.object",object);
        cmp.set("v.objectLabel",objectLabel);
        cmp.set("v.iconName",iconName);
        cmp.set("v.fields",fields);
        cmp.set("v.relationship",relationship);
        cmp.set("v.sortOrder",sortOrder);
        cmp.set("v.conditions",conditions);
        cmp.set("v.recordId",recordId);
        cmp.set("v.fields",fields);
        cmp.set("v.maxCount",maxCount);
        cmp.set("v.actionList",actionList);
        
        cmp.set('v.actionNew',cmp.get('v.actionList') ? cmp.get('v.actionList').includes('new') : false);
        
        cmp.set("v.updatedAgo",0);
        helper.setTabLabelIcon(cmp,objectLabel,iconName); 
        
        helper.getParentNames(cmp,recordId);
        
        helper.fetchColumns(cmp,event,helper, recordId, fields, object);
        
        var promiseData = helper.loadMore(cmp,helper,0);
        promiseData.then(function(results) {
            cmp.set('v.data', results);
            console.log('data returned');
        });
        
 
    },
    fetchData : function(cmp, recordId, fields, relatedObjectName, sortOrder, conditions, relationship,limit, offset) {
        var action = cmp.get("c.getRecords");
        action.setParams({
            "recId": recordId,
            "fields": fields,
            "relatedObjectName": relatedObjectName, 
            "sortOrder": sortOrder, 
            "conditions": conditions, 
            "relationship": relationship,
            "recordLimit":limit.toString(),
            "offset": offset.toString()
        });
        
        var promisedata = new Promise(function(resolve, reject) {
            action.setCallback(this, $A.getCallback(function (response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var data = response.getReturnValue();
                    console.log('DATA Original: ' + JSON.stringify(data));
                    
                    data.forEach(function(record){
                        for (var field of cmp.get("v.columns")){
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
                            } else if (field.type =='percent'){
                                record[field.fieldName] = record[field.fieldName] /100;
                            }else if (field.type == 'textarea'){
                                record[field.fieldName] = record[field.fieldName];
                            }
                        }
                        record.linkName = '/'+ record.Id;
                        record.urlName = record.Name;
                    });
                    
                    console.log('DATA: ' + JSON.stringify(data));
                    resolve(data);
                } else if (state === "ERROR") {
                    var errors = response.getError();
                    console.error(errors);
                    return null;
                }
            }));
        });
        
        $A.enqueueAction(action);
        return promisedata;
    },
    loadMore:function(cmp,helper,offset){
        var object = cmp.get("v.object");
        var fields = cmp.get("v.fields");    
        var relationship = cmp.get("v.relationship");
        var sortOrder = cmp.get("v.sortOrder");
        var conditions = cmp.get("v.conditions");
        var recordId = cmp.get("v.recordId");
        var rowsToLoad = cmp.get('v.rowsToLoad');
        
        return helper.fetchData(cmp, recordId, fields, object, sortOrder, conditions, relationship,rowsToLoad,offset);
    },
    setTabLabelIcon:function(cmp,title,iconName){
        //set title and heading
        var workspaceAPI = cmp.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            workspaceAPI.setTabLabel({
                tabId: focusedTabId,
                label: title
            });
            workspaceAPI.setTabIcon({
                tabId: focusedTabId,
                icon: iconName,
                iconAlt: iconName
            });
        }).catch(function(error) {
            console.log(error);
        });
    },
    getParentNames:function(cmp,recordId){
        //set scrumbread
        var action = cmp.get("c.getParentObjectName");
        action.setParams({
            "recordId": recordId
        });
        action.setCallback(this, $A.getCallback(function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var names = response.getReturnValue();
                cmp.set('v.parentObjLabel', names['parentObjLabel']);
                cmp.set('v.parentObjAPI', names['parentObjAPI']);
                cmp.set('v.parentRecName', names['parentRecName']);
                console.log('parentNames: ' + names);
            } else if (state === "ERROR") {
                var errors = response.getError();
                console.error(errors);
            }
        }));
        $A.enqueueAction(action);
    },    
    fetchColumns : function(cmp,evt,hlp, recordId, fields, relatedObjectName) {
        var tableAction = hlp.getTableActions(cmp);
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
                tableAction.length != 0 ? columns.push({ type: 'action', typeAttributes: { rowActions: tableAction } }) : '';
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
        };
        var tableAction = [];
        var actionLists = cmp.get('v.actionList') ? cmp.get('v.actionList').split(';') : [];
        for (var i = 0; i<actionLists.length;i++){
            actionListMap[actionLists[i]] ? tableAction.push(actionListMap[actionLists[i]]) : '';
        }
        return tableAction;
    },
    editRecord:function(recordId){
        var editRecordEvent = $A.get("e.force:editRecord");
        editRecordEvent.setParams({
            "recordId": recordId
        });
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