({
    init: function (cmp, event, helper) {
        var object = cmp.get("v.object");
        var fields = cmp.get("v.fields");    
        var relationship = cmp.get("v.relationship");
        var sortOrder = cmp.get("v.sortOrder");
        var conditions = cmp.get("v.conditions");
        var recordId = cmp.get("v.recordId");
        var recordLimit = cmp.get("v.recordLimit");
        
        cmp.set('v.actionNew',cmp.get('v.actionList') ? cmp.get('v.actionList').includes('new') : false);
        
        helper.getObjLabel(cmp,object);
        helper.getIconName(cmp,object);
        helper.getMaxCount(cmp,recordId,object,conditions,relationship);

        
        helper.fetchColumns(cmp,event,helper, recordId, fields, object);
        helper.fetchData(cmp,event,helper, recordId, fields, object, sortOrder, conditions, relationship,recordLimit);
    },
    newRecord:function(cmp,event,helper){
        console.log("Clicked related");
        var recordTypeModal = cmp.find("rTModal");
        recordTypeModal.createRecord();
    },
    handleRowAction: function (cmp, event, helper) {
        var action = event.getParam('action');
        var row = event.getParam('row');
        switch (action.name) {
            case 'editRecord':
                helper.editRecord(row['Id']);
                break;
            case 'viewRecord':
                helper.viewRecord(row['Id']);
                break;
        }
    },
    viewAll:function(cmp,event,helper){
        var navService = cmp.find("navService");
        var pageReference =        {    
            "type": "standard__component",
            "attributes": {
                "componentName": "c__RelatedListWindow"    
            },    
            "state": {
                "object": cmp.get("v.object"),
                "objectLabel":cmp.get("v.objectLabel"),
                "iconName":cmp.get("v.iconName"),
                "fields":cmp.get('v.fields'),
                "relationship" : cmp.get("v.relationship"),
                "sortOrder" : cmp.get("v.sortOrder"),
                "conditions" : cmp.get("v.conditions"),
                "recordId" : cmp.get("v.recordId"),
                "columns" : cmp.get("v.columns"),
                "maxCount" : cmp.get("v.maxCount"),
                'actionList': cmp.get("v.actionList") 
            }
        };
        navService.navigate(pageReference);
    },
    onTabRefreshed : function(component, event, helper) {
        var refreshedTabId = event.getParam("tabId"); 
        var workspaceAPI = component.find("workspace"); 
        workspaceAPI.getEnclosingTabId().then(function(tabId) {
            if (refreshedTabId == tabId){
                var action = component.get('c.init');
                component.set('v.data','Spinner');
                $A.enqueueAction(action);
            }
       })
        .catch(function(error) {
            console.log(error);
        });
    } 
})