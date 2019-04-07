({
    init : function(component, event, helper) {
        console.log("Clicked RT");
        var options = component.get("v.options");
        if (options && options[0] == 'null'){
            console.log("no options");
            helper.getRecordTypes(component,helper);            
        } else if (options.length > 1){
            cmp.set('v.show',true);
        } else if (options.length == 1){
            console.log("option is 1");
            console.log(options);
            helper.createRecord(component,options[0].Id);
        } else {
            console.log("options is 0")
            helper.createRecord(component,null);
        }
    },
    closeModal: function(cmp,event,helper){
        console.log('RT Close');
        cmp.set('v.show',false);
    },
    cRecord: function(cmp,event,helper){
        console.log('Create Record');
        var rt = cmp.get('v.value')
        helper.createRecord(cmp,rt);
    }
})