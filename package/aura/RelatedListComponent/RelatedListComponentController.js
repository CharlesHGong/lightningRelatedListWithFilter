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
                "c__object": cmp.get("v.object"),
                "c__objectLabel":cmp.get("v.objectLabel"),
                "c__iconName":cmp.get("v.iconName"),
                "c__fields":cmp.get('v.fields'),
                "c__relationship" : cmp.get("v.relationship"),
                "c__sortOrder" : cmp.get("v.sortOrder"),
                "c__conditions" : cmp.get("v.conditions"),
                "c__recordId" : cmp.get("v.recordId"),
                "c__columns" : cmp.get("v.columns"),
                "c__maxCount" : cmp.get("v.maxCount"),
                'c__actionList': cmp.get("v.actionList") 
            }
        };
        navService.navigate(pageReference);
    },
    refreshTab:function(component,event,helper){
      var workspaceAPI = component.find("workspace");
        workspaceAPI.getEnclosingTabId().then(function(tabId) {
            workspaceAPI.refreshTab({
                      tabId: tabId,
                      includeAllSubtabs: true
             });
        })
        .catch(function(error) {
            console.log(error);
        });  
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