# Lightning Related List With Filter

This repository is a lightning component which mimimic the look and feel with the out of box related list but give you more control on:

1. You can apply filter of your choice on the related list.
2. You are not limited to child object but any grand-child object as long as it can reference back to the parent.
3. You can specify the title of the related list that is meaningful to you.
4. You are not limited to only four fields to show.
5. You are not limited to 6 records but have more control on how many records you want to show,
6. You don't have to show the ugly bar code for you child object.
7. You can choose from display types of List or Tile.


#### Currently the related list supports the following field type:
1. Text
2. Date
3. Datetime
4. Checkbox
5. Picklist
6. Muti-picklist
7. Lookup
8. Master-Detail

## Getting Started
### If you are using sfdx
1. Clone this repo
2. Direct to the root
3. Deploy to your desired org

### If you are using meta-data
1. Clone this repo
2. Direct to the root/package
3. Ant deploy the package

## How to use the related list on your lightning record page
1. Navigate to the parent object record page and click edit page
2. Drag the RelatedListComponent to the desired space
3. Type in the relevant attributes
4. The related list will show

### Key Attributes
1. Object
This field is used in the SOQL after FROM Clause. This is the API name of your related object, be careful with the letter case, it matters when you try to create a related record. It supports custom objects as well.
Example 1: Contact
![Alt text](ReadMeImg/object1.png?raw=true "Title")
Example 2: Bank_Account__c
![Alt text](ReadMeImg/object2.png?raw=true "Title")

2. Title
This the title of your realted list.
![Alt text](ReadMeImg/title1.png?raw=true "Title")

3. Fields
This field is used in the SOQL after SELECT Clause. Specify all the fields API name that you want to display for the related object. Seperate each field with a semi-column.
Example 1: Contact
![Alt text](ReadMeImg/fieldName1.png?raw=true "Title")

4. Sort Order
This field is used in the SOQL after ORDER BY Clause. If you want to sord your related list, specify the 'Order By' field and the sort order (desc or asc). Otherwise leave blank.
Example, birthdate desc
Example 1:
![Alt text](ReadMeImg/sortorder1.png?raw=true "Title")
Example 2:
![Alt text](ReadMeImg/sortorder2.png?raw=true "Title")

5. Conditions
This field is used in the SOQL after WHERE Clause. You can use this field to filter your related list. Use the variable "recordId" to specify the relationship column (e.g. AccountId =: recordId) or otherwise the component will choose from all record.
Example 1:
![Alt text](ReadMeImg/conditions1.png?raw=true "Title")

6. Relationship
This field is used to prepopulate the relationship field if the user clicks "New" button.
![Alt text](ReadMeImg/relationship1.png?raw=true "Title")

7. Limit
This field is used in the SOQL after LIMIT Clause. This will limit the maximum records showing in the related list. The remaining records can be seen by clicking "View More"
Example 1:
![Alt text](ReadMeImg/limit1.png?raw=true "Title")


8. ActionList
Choose from create,view and edit to show in the action list of the related record. User semi-column to seperate each action.
a. Create
![Alt text](ReadMeImg/relationship1.png?raw=true "Title")
b. Edit
c. View
![Alt text](ReadMeImg/actionlist1.png?raw=true "Title")

9. IconName
If you want to override the icon, choose the icon from https://www.lightningdesignsystem.com/icons/ (e.g. standard:Contact). Otherwise leave it blank, the component will choose the default icon from the Tab setting for this related object.
Example 1:
![Alt text](ReadMeImg/iconName1.png?raw=true "Title")

10. DisplayFormat
Choose from Tile or List.
Example 1: List
![Alt text](ReadMeImg/displayFormat1.png?raw=true "Title")
Example 2: Tile
![Alt text](ReadMeImg/displayFormat2.png?raw=true "Title")