({
    handleTileButtonMenuSelect: function (cmp, event, helper) {
        console.log("called");
        var action = event.getParam("value");
        var params = action.split(':');
        switch (params[0]) {
            case 'editRecord':
                helper.editRecord(params[1]);
                break;
            case 'viewRecord':
                helper.viewRecord(params[1]);
                break;
        }
    }
})