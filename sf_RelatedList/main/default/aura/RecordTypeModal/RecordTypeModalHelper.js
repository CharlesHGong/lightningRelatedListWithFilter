({
	getRecordTypes : function(component,helper) {
		var action = component.get("c.getRecordTypes");
        action.setParams({
            "objAPIName": component.get("v.objectAPIName")
        });
        
        action.setCallback(this, $A.getCallback(function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var data = response.getReturnValue();
                console.log('RecordTypes: ' + data.length);
                if (data.length > 1){
                    cmp.set('v.show',true);
                    var options = [];
                    for (var j = 0;j<data.length;j++){
                        options[j] = {};
                        options[j]['label'] = data[j].Name;
                        options[j]['value'] = data[j].Id;
                    }
                    console.log('RecordTypes: ' + options);
                    component.set('v.value',options[0]['value']);
                    component.set('v.options', options);    
                } else if (data.length == 1){
                    helper.createRecord(component,data[0].Id);
                } else {
                    helper.createRecord(component,null);
                }
            } else if (state === "ERROR") {
                var errors = response.getError();
                console.error(errors);
            }
        }));
        $A.enqueueAction(action);
	},
    createRecord: function(cmp,recordType){
        var defaultValue = {};
        defaultValue[cmp.get("v.relationship")] = cmp.get('v.recordId');
        
        var createRecordEvent = $A.get("e.force:createRecord");
        createRecordEvent.setParams({
            "entityApiName": cmp.get("v.objectAPIName"),
            'recordTypeId' : recordType,
            "defaultFieldValues": defaultValue
        });
        createRecordEvent.fire();
        cmp.set('v.show',false);
    }
})