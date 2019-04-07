/*****************************************************************************
@Author     : hanning.gong@icloud.com
@CreateDate : 01/03/2019
@Description: Test class for RelatedListController
@History: 
NAME              CHANGES  
********************************************************************************/
@isTest
private class RelatedListControllerTest {

	@testSetup static void setup(){
		Id profId = [SELECT Id FROM Profile WHERE Name = 'System Administrator'].Id;

		String orgId = UserInfo.getOrganizationId();
        String dateString = String.valueof(Datetime.now()).replace(' ','').replace(':','').replace('-','');
       
        Integer randomInt = Integer.valueOf(math.rint(math.random()*1000000));
        String uniqueName = orgId + dateString + randomInt;
	    User userCems = new User(  firstname = 'Test',
	                            lastName = 'User',
	                            email = uniqueName + '@test' + orgId + '.org',
	                            Username = uniqueName + '@test' + orgId + '.org',
	                            EmailEncodingKey = 'ISO-8859-1',
	                            Alias = uniqueName.substring(18, 23),
	                            TimeZoneSidKey = 'Australia/Sydney',
	                            LocaleSidKey = 'en_US',
	                            LanguageLocaleKey = 'en_US',
	                            ProfileId = profId);


        System.runas(userCems){
	        Account acct = new Account(
		 		Name = 'TestAcct0',
	            Website = 'www.test.com'
		 	);	

		 	insert acct; 

		 	Account acctRec = [SELECT id from Account where Name = 'TestAcct0'];
		    List<Contact> testContacts = new List<Contact>();
	        for(Integer i=0;i<2;i++) {
	            testContacts.add(new Contact(LastName = 'TestCont'+i,
	            	AccountId = acctRec.id,
	            	Email = 'test' + i + '@corp.com',
	            	Phone = '0456789009'));
	        }
	        insert testContacts;  	
	    }
		 
	}

	 @isTest
	 static void getParentObjectNameTest(){
	 	Account acct = [SELECT id FROM Account WHERE Name = 'TestAcct0' LIMIT 1];
        
        Test.startTest();
        Object returnObject = RelatedListController.getParentObjectName(acct.id);
        Test.stopTest();

        System.assertNotEquals(null, returnObject);


	 }

	 @isTest
	 static void geticonNameTest(){
        
        Test.startTest();
        String iconName = RelatedListController.getIconName('Contact');
        Test.stopTest();

        System.assertEquals('standard:contact', iconName);

	 }

	 @isTest
	 static void getObjLabelTest(){
        
        Test.startTest();
        String objectLabel = RelatedListController.getObjLabel('Contact');
        Test.stopTest();

        System.assertEquals('Contact', objectLabel);

	 }

	 @isTest
	 static void getCountRecordsTest(){
	 	Account acct = [SELECT id FROM Account WHERE Name = 'TestAcct0' LIMIT 1];
        
        Test.startTest();
        Integer numberOfRecords = RelatedListController.getCountRecords(acct.id, 'Contact', '', 'AccountId');
        Test.stopTest();

        System.assertEquals(2, numberOfRecords);

	 }

	 @isTest
	 static void getCountRecordsNegativeTest(){
	 	Account acct = [SELECT id FROM Account WHERE Name = 'TestAcct0' LIMIT 1];
        
        Test.startTest();
        Integer numberOfRecords = RelatedListController.getCountRecords(acct.id, 'DummyObject', '', 'AccountId');
        Test.stopTest();

        System.assertEquals(null, numberOfRecords);

	 }

	 @isTest
	 static void getRecordsTest(){
	 	Account acct = [SELECT id FROM Account WHERE Name = 'TestAcct0' LIMIT 1];
	 	String fields = 'Name,AccountId';
        
        Test.startTest();
        List<sObject> recordList = RelatedListController.getRecords(acct.id, fields, 'Contact', null, null,'AccountId',null,null);
        Test.stopTest();

        System.assertEquals(2, recordList.size());

	 }

	 @isTest
	 static void getColumnsTest(){
	 	Account acct = [SELECT id FROM Account WHERE Name = 'TestAcct0' LIMIT 1];
	 	String fields = 'Name,AccountId';
        
        Test.startTest();
        List<RelatedListController.ColumnWrapper> columnSize = RelatedListController.getColumns(acct.id, fields, 'Contact');
        Test.stopTest();

        System.assertEquals(2, columnSize.size());

	 }

	 @isTest
	 static void getColumnsCaseTest(){
	 	Account acct = [SELECT id FROM Account WHERE Name = 'TestAcct0' LIMIT 1];
	 	String fields = 'CaseNumber,Type,ClosedDate,Status,OwnerId';
        
        Test.startTest();
        List<RelatedListController.ColumnWrapper> columnSize = RelatedListController.getColumns(acct.id, fields, 'Case');
        Test.stopTest();

        System.assertEquals(5, columnSize.size());

	 }

	 @isTest
	 static void getRecordsTestNegative(){
	 	Account acct = [SELECT id FROM Account WHERE Name = 'TestAcct0' LIMIT 1];
	 	String fields = 'Name,AccountId';
        
        Test.startTest();
        List<sObject> recordList = RelatedListController.getRecords(acct.id, fields, 'Contact', '', '','AccountId','','');
        Test.stopTest();

        System.assertEquals(0, recordList.size());


	 }


}