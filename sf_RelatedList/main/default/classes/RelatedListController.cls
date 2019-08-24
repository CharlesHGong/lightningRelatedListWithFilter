/*****************************************************************************
@Author     : hanning.gong@icloud.com
@CreateDate : 01/03/2019
@Description: Controller for RelatedListComponent
@History: 
NAME              CHANGES  
********************************************************************************/

public without sharing class RelatedListController {
    @AuraEnabled
    public static Object getParentObjectName(Id recordId){
        recordId = Id.valueOf(recordId);
        String sObjLabel = recordId.getSObjectType().getDescribe().getLabel();
        String sObjAPI = recordId.getSobjectType().getDescribe().getName();
        String nameAPI;
        if (sObjAPI != 'Case'){ nameAPI = 'Name'; } else { nameAPI = 'CaseNumber';}
        String query = 'Select ' + nameAPI +' From ' + sObjAPI + ' Where Id =: recordId';
        sObject record = database.query(query);
        Map<String,String> names = new Map<String,String>();
        names.put('parentObjLabel', sObjLabel);
        names.put('parentObjAPI',sObjAPI);
        names.put('parentRecName',string.valueOf(record.get(nameAPI)));
        return names;
    }

    @AuraEnabled
    public static String getIconName(String sObjectName){
        
        String u;
        
        List<Schema.DescribeTabSetResult> tabSetDesc = Schema.describeTabs();
        List<Schema.DescribeTabResult> tabDesc = new List<Schema.DescribeTabResult>();
        List<Schema.DescribeIconResult> iconDesc = new List<Schema.DescribeIconResult>();
        
        for(Schema.DescribeTabSetResult tsr : tabSetDesc) { tabDesc.addAll(tsr.getTabs()); }
        
        for(Schema.DescribeTabResult tr : tabDesc) {
            if( sObjectName == tr.getSobjectName() ) {
                if( tr.isCustom() == true ) {
                    iconDesc.addAll(tr.getIcons());
                } else {
                    u = 'standard:' + sObjectName.toLowerCase();
                }
            }
        }
        for (Schema.DescribeIconResult ir : iconDesc) {
            if (ir.getContentType() == 'image/svg+xml'){
                u = 'custom:' + ir.getUrl().substringBetween('custom/','.svg').substringBefore('_');
                break;
            }
        }            
        
        return u;
    }
    
    @AuraEnabled 
    public static String getObjLabel(String objAPIName){
        system.debug(objAPIName);
        List<Schema.DescribeSObjectResult> describeSobjectsResult = Schema.describeSObjects(new List<String>{objAPIName}); // this can accept list of strings, we describe only one object here
        String objectLabel = describeSobjectsResult[0].getLabel();
        return objectLabel;
    }
    
    @AuraEnabled
    public static Integer getCountRecords(String recId, String relatedObjectName, String conditions, String relationship) {
        Integer count;
        Id recordId = Id.valueOf(recId);
        try{
            count = Database.countQuery(countQueryGenerator(relatedObjectName,recordId,conditions));
        }catch(Exception e){
            System.debug('Exception: '+ e);
        }
        return count;
    }
    
    
    @AuraEnabled
    public static List<sObject> getRecords(String recId, String fields, String relatedObjectName, 
                                           String conditions, String sortOrder, String relationship, String recordLimit, String offset) {
        
        List<sObject> relatedRecords = new List<sObject>();
        
        Id recordId = Id.valueOf(recId);
        Schema.SObjectType objectType = recordId.getSObjectType();
        String sObjectName = objectType.getDescribe().getName();
        DescribeSObjectResult objectResult = Schema.getGlobalDescribe().get(relatedObjectName).getDescribe();
        String finalFields = '';
        
        for (String field : fields.split(',')){
            if (string.valueOf(objectResult.fields.getMap().get(field).getDescribe().getType()) == 'REFERENCE' ){
                finalFields = finalFields + ', ' + objectResult.fields.getMap().get(field).getDescribe().getRelationshipName() + '.Name' ;
            } else {
                finalFields = finalFields + ', ' + field;
            }
        }
        
        try{
            relatedRecords = Database.query(queryGenerator(finalFields.substring(1), relatedObjectName,recordLimit,offset, recordId,conditions,sortOrder));
            System.debug('RelatedRecords: ' + relatedRecords);
            
        }catch(Exception e){
            System.debug('Exception: '+ e);
        }
        
        return relatedRecords;
    }
    
    @AuraEnabled
    public static List<ColumnWrapper> getColumns(String recId, String fields, String relatedObjectName) {

        List<ColumnWrapper> columns = new List<ColumnWrapper>();
        Map<String, Schema.SObjectField> fieldDescriptionMap = getFieldDescriptionDetails(relatedObjectName);
        List<String> fieldNamesList = fields.split(',');
        Set<String> fieldNamesSet = new Set<String>(fieldNamesList); 
        DescribeSObjectResult objectResult = Schema.getGlobalDescribe().get(relatedObjectName).getDescribe();
        
        for(String field : fieldNamesSet){
            if(field.equalsIgnoreCase('Name')){
                TypeAttributes typeAttrib = new TypeAttributes('_self', new Label('Name'),null);
                columns.add(new ColumnWrapper('linkName', 'url', 'Name', typeAttrib, true));
            } else if (field.equalsIgnoreCase('Subject')){
                TypeAttributes typeAttrib = new TypeAttributes('_self', new Label('Subject'),null);
                columns.add(new ColumnWrapper('linkName', 'url', 'Subject', typeAttrib, false));
            } else if (field.equalsIgnoreCase('CaseNumber')){
                TypeAttributes typeAttrib = new TypeAttributes('_self', new Label('CaseNumber'),null);
                columns.add(new ColumnWrapper('linkName', 'url', 'CaseNumber', typeAttrib, false));
            } else{
                columns.add(createColumns(objectResult, field));
            }
        }
        
        System.debug('COLUMNS: ' + columns);
        return columns;
    }
    

    private static String queryGenerator(String fields, String relatedObjectName,
                                            String recordLimit,String offset, String recordId,String conditions,String sortOrder){
        recordLimit = recordLimit == null  ? ' ' : ' LIMIT ' + string.valueOf(recordLimit);
        offset = offset == null ? ' ' : ' OFFSET '+ string.valueOf(offset);
        conditions = conditions == null || conditions == '' ? ' ' : ' WHERE ' + conditions ;
        sortOrder = sortOrder == null || sortOrder =='' ? ' ' : ' Order By ' + sortOrder;
        String query = 'SELECT Id,' + fields + ' FROM ' + relatedObjectName + conditions + sortOrder + recordLimit + offset;
        system.debug(query);
        return query;
    }
    
    private static String countQueryGenerator(String relatedObjectName, String recordId,String conditions){
        conditions = conditions == null || conditions == '' ? ' ' : ' WHERE ' + conditions ;
        String query = 'SELECT count() FROM ' + relatedObjectName + conditions ;
        System.debug(query);
        return query;
    }
    
    private static ColumnWrapper createColumns(DescribeSObjectResult objectResult, String field){
        
        DescribeFieldResult fieldResult = objectResult.fields.getMap().get(field).getDescribe();
        
        if(String.valueOf(fieldResult.getType()) == 'REFERENCE'){
            System.debug('REFERENCE: ' + fieldResult.getName());
            return new ColumnWrapper(fieldResult.getRelationshipName()+'_Id', 'url', fieldResult.getLabel(), new TypeAttributes('_self', new Label(fieldResult.getRelationshipName()+'_Name'),fieldResult.getRelationshipName()),false);  
        } else if(String.valueOf(fieldResult.getType()) == 'PERCENT'){
            return new ColumnWrapper(fieldResult.getName(), 'text' , fieldResult.getLabel(), true);
        } else {
            return new ColumnWrapper(fieldResult.getName(), String.valueOf(fieldResult.getType()).tolowercase() , fieldResult.getLabel(), true);
        }
    }

    private static Map<String, Schema.SObjectField> getFieldDescriptionDetails(String objectName){

        Map<String, Schema.SObjectType> objectDescriptionMap = Schema.getGlobalDescribe();

        Schema.Describesobjectresult result = objectDescriptionMap.get(objectName).getDescribe();
        Map<String, Schema.SObjectField> fieldsDescriptionMap = result.fields.getMap();

        return fieldsDescriptionMap;
    }
    
    //Wrapper class for column attributes
    public class ColumnWrapper{
        
        @AuraEnabled
        public String fieldName {get; set;}
        @AuraEnabled
        public String type {get; set;}
        @AuraEnabled
        public String label {get; set;}
        @AuraEnabled
        public TypeAttributes typeAttributes{get; set;}
        @AuraEnabled
        public CellAttributes cellAttributes{get; set;}
        @AuraEnabled        
        public Boolean sortable {get;set;}
        
        public ColumnWrapper(String name, String dataType, String fieldLabel, Boolean sortable){
            this.fieldName = name;
            this.type = dataType;
            this.label = fieldLabel;
            this.sortable = sortable;
            this.CellAttributes = new CellAttributes();
        }
        
        public ColumnWrapper(String name, String dataType, String fieldLabel, TypeAttributes labelName, Boolean sortable){
            this.fieldName = name;
            this.type = dataType;
            this.label = fieldLabel;
            this.TypeAttributes = labelName;
            this.sortable = sortable;
            this.CellAttributes = new CellAttributes();
        }
        
    }
    
    public class TypeAttributes{
        @AuraEnabled
        public Label label {get;set;}  
        @AuraEnabled
        public String target {get;set;}
        @AuraEnabled
        public String relationship{get;set;}
        
        public TypeAttributes(String target, Label label,String relationship){
            this.target = target;
            this.Label = label;
            this.relationship = relationship;
        }      
    }
    
    public class cellAttributes{
        @AuraEnabled
        public String alignment {get;set;}   
        
        public CellAttributes(){
            this.alignment = 'left';
        }
    }
    
    public class Label{
        @AuraEnabled
        public String fieldName {get;set;}
        
        public Label(String fieldName){
            this.fieldName = fieldName;
        }
    }  
}