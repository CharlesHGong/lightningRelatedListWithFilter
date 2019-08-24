({
    init : function(cmp, event, helper) {
        
        helper.setInit(cmp,event,helper);
        
        setInterval(function() {
            cmp.set("v.updatedAgo",cmp.get("v.updatedAgo")+1);
        },60000);
    },
    refresh : function(cmp,event,helper){
        helper.setInit(cmp,event,helper);
    },
    loadMoreData: function (cmp, event, helper) {
        
        var promiseData;
        
        event.getSource().set("v.isLoading", true);
        cmp.set('v.loadMoreStatus', 'Loading');
        
        promiseData = helper.loadMore(cmp,helper,cmp.get("v.data").length);
        
        promiseData.then($A.getCallback(function (data) {
            if (cmp.get('v.data').length >= cmp.get('v.maxCount')) {
                cmp.set('v.enableInfiniteLoading', false);
                cmp.set('v.loadMoreStatus', 'No more data to load');
            } else {
                var currentData = cmp.get('v.data');
                var newData = currentData.concat(data);
                cmp.set('v.data', newData);
                cmp.set('v.loadMoreStatus', '');
            }
            event.getSource().set("v.isLoading", false);
        }));
    },
    updateColumnSorting:function(component, event, helper){
        var sortName = event.getParam("fieldName");
        var sortDirection = event.getParam("sortDirection");
        component.set("v.sortedBy", sortName);
        component.set("v.sortedDirection", sortDirection);
        if (sortName == "linkName") {sortName = "Name" ;}				//if sort by name
        component.set("v.sortOrder",sortName + " " + sortDirection);
        console.log("SortOrder: "+component.get("v.sortOrder"));
        
        var promiseData = helper.loadMore(component,helper,0);
        promiseData.then(function(results) {
            component.set('v.data', results);
        });
    },
    newRecord:function(cmp,event,helper){
        console.log("Clicked related");
        var recordTypeModal = cmp.find("rTModal");
        recordTypeModal.createRecord();
    },
    navObjHome:function(cmp,event,helper){
        var navService = cmp.find("navService");
        var pageReference =        {    
            "type": "standard__objectPage",
            attributes: {
                objectApiName: "Account",
                actionName: "list"
            },
            state: {
                filterName: "Recent"
            }
        };
        navService.navigate(pageReference);
    },
    navRecord:function(cmp,event,helper){
        var navService = cmp.find("navService");
        var pageReference =        {    
            "type": "standard__recordPage",
            attributes: {
                recordId: cmp.get("v.recordId"),
                objectApiName: cmp.get("v.parentObjAPI"),
                actionName: "view"
            },
            state: {
                filterName: "Recent"
            }
        };
        navService.navigate(pageReference);
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
    }
})