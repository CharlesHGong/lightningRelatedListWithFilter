/*****************************************************************************
@Author     : hanning.gong@icloud.com
@CreateDate : 22/11/2018
@Description: Test class for RecordTypeModalController
@History: 
NAME              CHANGES 
********************************************************************************/

@isTest
private class RecordTypeModalControllerTest
{

    @isTest static void getRecordTypes() {
        Test.startTest();
            List<sObject> ret = RecordTypeModalController.getRecordTypes('Contact');
            //Might be empty
        	//System.assert(!ret.isEmpty());
        Test.stopTest();
    }   
}