/*****************************************************************************
@Author     : hanning.gong@icloud.com
@CreateDate : 05/11/2018
@Description: Controller for RecordTypeComponent
@History: 
NAME              CHANGES  
********************************************************************************/


public with sharing class RecordTypeModalController {
    @AuraEnabled
    public static List<sObject> getRecordTypes(String objAPIName){
        List<RecordType> recordTypeList = new List<RecordType>(); 
        Schema.SObjectType objType = Schema.getGlobalDescribe().get(objAPIName);
        List<RecordTypeInfo> recordTypeInfoList = objType.getDescribe().getRecordTypeInfos();

        if (recordTypeInfoList.size() > 1) {
            for (RecordTypeInfo i : recordTypeInfoList) {
                // Ignore the Master Record Type, whose Id always ends with 'AAA'. We check the Id because Name can change depending on the user's language.
                if (i.isAvailable() && !String.valueOf(i.getRecordTypeId()).endsWith('AAA')){
                    recordTypeList.add(new RecordType (id =i.getRecordTypeId(),Name = i.getName()));
                }
            }
        }

        return recordTypeList;
    }
}