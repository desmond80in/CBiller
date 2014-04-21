var AbstractBillItemState = function(billItem){
	this.billItem = billItem;
	/*
	this.onPublished = function(){ console.log("Not Implemented.."); };
	this.onAccepted = function(){ console.log("Not Implemented.."); };
	this.onRejected = function(){ console.log("Not Implemented.."); };
	this.onSettlement = function(settlement){ console.log("Not Implemented.."); };
	this.onParticipantAdd = function(){ console.log("Not Implemented.."); };
	this.onWithdrawal = function(){ console.log("Not Implemented.."); };
	this.onClose = function(){ console.log("Not Implemented.."); };
	this.onDelete = function(){ console.log("Not Implemented.."); };
	*/
	this.currentState = "AbstractBillItemState";
}

AbstractBillItemState.prototype.onPublished = function(){
	console.log("Not Implemented");
	return this;
};

AbstractBillItemState.prototype.onAccepted = function(){
	console.log("Not Implemented");
	return this;
};

AbstractBillItemState.prototype.onRejected = function(){
	console.log("Not Implemented");
	return this;
};

AbstractBillItemState.prototype.onSettlement = function(){
	console.log("Not Implemented");
	return this;
};

AbstractBillItemState.prototype.onParticipantAdd = function(){
	console.log("Not Implemented");
	return this;
};

AbstractBillItemState.prototype.onWithdrawal = function(){
	console.log("Not Implemented");
	return this;
};

AbstractBillItemState.prototype.onClose = function(){
	console.log("Not Implemented");
	return this;
};

AbstractBillItemState.prototype.onDelete = function(){
	console.log("Not Implemented");
	return this;
};

AbstractBillItemState.prototype.toString = function(){
	//console.log("BiState currentState" + this.currentState);
	return "Bill ID : " + this.billItem.parentBill.billID + " State : " + this.currentState;
};

//Assigned State
var BiAssigned = function(billItem){
	AbstractBillItemState.call(this, billItem);
	this.currentState = "BiAssigned";
}

BiAssigned.prototype = new AbstractBillItemState(null);

BiAssigned.prototype.constructor = AbstractBillItemState;

BiAssigned.prototype.onAccepted = function(){
	this.billItem.currentState = (new BiAccepted(this.billItem));
	console.log("Bill item for : " + this.billItem.owner.name + " is now Accepted and on " + this.billItem.currentState.toString());
	return this.billItem.currentState;
};

BiAssigned.prototype.onRejected = function(){
	this.billItem.currentState = (new BiRejected(this.billItem));
	console.log("Bill item for : " + this.billItem.owner.name + " is now Rejected and on " + this.billItem.currentState.toString());
	return this.billItem.currentState;
};

BiAssigned.prototype.onDelete = function(){
	console.log(this.billItem.parentBill.billID + " will be removed from the system");
	console.log("Bill item for : " + this.billItem.owner.name + " is now Deleted and on " + this.billItem.currentState.toString());
};

//Accepted State
var BiAccepted = function(billItem){
	AbstractBillItemState.call(this, billItem);
	this.currentState = "BiAccepted";
}

BiAccepted.prototype = new AbstractBillItemState(null);

BiAccepted.prototype.constructor = AbstractBillItemState;

BiAccepted.prototype.onSettlement = function(settlement){
	console.log("Bill item for : " + this.billItem.owner.name + " is now Settled and on " + this.billItem.currentState.toString());
	//checks if the amount is same as the shareing amount
	if((this.billItem.parentBill.amount / this.billItem.parentBill.sharePersons.length) == amount){
		this.billItem.currentState = (new BiSettled(this.billItem));
		return this.billItem.currentState;
	}else
	{
		this.billItem.currentState = (new BiPartiallySettled(this.billItem));
		return this.billItem.currentState;
	}
};

BiAccepted.prototype.onRejected = function(){
	this.billItem.currentState = (new BiRejected(this.billItem));
	console.log("Bill item for : " + this.billItem.owner.name + " is now Rejected and on " + this.billItem.currentState.toString());
	return this.billItem.currentState;
};

BiAccepted.prototype.onWithdrawal = function(){
	this.billItem.currentState = (new BiWithdrawal(this.billItem));
	console.log("Bill item for : " + this.billItem.owner.name + " is now Withdrawal and on " + this.billItem.currentState.toString());
	return this.billItem.currentState;
};

//Rejected State
var BiRejected = function(billItem){
	AbstractBillItemState.call(this, billItem);
	this.currentState = "BiRejected";
}

BiRejected.prototype = new AbstractBillItemState(null);

BiRejected.prototype.constructor = AbstractBillItemState;

BiRejected.prototype.onAccepted = function(){
	this.billItem.currentState = (new BiAccepted(this.billItem));	
	console.log("Bill item for : " + this.billItem.owner.name + " is now Accepted and on " + this.billItem.currentState.toString());
	return this.billItem.currentState;
};

BiRejected.prototype.onWithdrawal = function(){
	this.billItem.currentState = (new BiWithdrawal(this.billItem));
	console.log("Bill item for : " + this.billItem.owner.name + " is now Withdrawal and on " + this.billItem.currentState.toString());
	return this.billItem.currentState;
};

//PartiallySettled
var BiPartiallySettled = function(billItem){
	AbstractBillItemState.call(this, billItem);
	this.currentState = "BiPartiallySettled";
}

BiPartiallySettled.prototype = new AbstractBillItemState(null);

BiPartiallySettled.prototype.constructor = AbstractBillItemState;

BiPartiallySettled.prototype.onSettlement = function(amount){
	console.log("Bill item for : " + this.billItem.owner.name + " is now Settled and on " + this.billItem.currentState.toString());
	//checks if the amount is same as the shareing amount
	if((this.billItem.parentBill.amount / this.billItem.parentBill.sharePersons.length) == amount){
		this.billItem.currentState = (new BiSettled(this.billItem));
	}
	return this.billItem.currentState;
};

//BiSettled
var BiSettled = function(billItem){
	AbstractBillItemState.call(this, billItem);
	this.currentState = "BiSettled";
}
BiSettled.prototype = new AbstractBillItemState(null);

BiSettled.prototype.constructor = AbstractBillItemState;

BiSettled.prototype.onParticipantAdd = function(billItem){
	console.log("Bill item for : " + this.billItem.owner.name + " is now Participant Added and on " + this.billItem.currentState.toString());
	this.billItem.currentState = (new BiPartiallySettled(this,billItem));
	return this.billItem.currentState;
};

BiSettled.prototype.onClose = function(amount){
	console.log("Bill item for : " + this.billItem.owner.name + " is now Closed and on " + this.billItem.currentState.toString());
	this.billItem.currentState = (new BiClosed(this,billItem));
	return this.billItem.currentState;
};

//BiWithdrawal
var BiWithdrawal = function(billItem){
	AbstractBillItemState.call(this, billItem);
	this.currentState = "BiWithdrawal";
}
BiWithdrawal.prototype = new AbstractBillItemState(null);

BiWithdrawal.prototype.constructor = AbstractBillItemState;

BiWithdrawal.prototype.onClose = function(amount){
	console.log("Bill item for : " + this.billItem.owner.name + " is now Closed and on " + this.billItem.currentState.toString());
	this.billItem.currentState = (new BiClosed(this,billItem));
	return this.billItem.currentState;
};

var Person = function(personId,name){
	this.personId = personId;
	this.name = name;
}

var BillItem = function(commonBill,owner){
	this.parentBill = commonBill;
	this.amount = this.parentBill.amount/this.parentBill.sharePersons.length;
	this.settlements = null;
	this.owner = owner;
	this.currentState = (new BiAssigned(this));
	//console.log(this.parentBill.billID);

	this.onPublished = function(){ this.currentState.onPublished(); };
	this.onAccepted = function(){ this.currentState.onAccepted(); };
	this.onRejected = function(){ this.currentState.onRejected(); };
	this.onSettlement = function(settlement){ this.currentState.onSettlement(settlement); };
	this.onParticipantAdd = function(){ this.currentState.onParticipantAdd(); };
	this.onWithdrawal = function(){ this.currentState.onWithdrawal(); };
	this.onClose = function(){ this.currentState.onClose(); };
	this.onDelete = function(){ this.currentState.onDelete(); };
	this.changeState=function(State){
		this.currentState = State;
	};
}

var Settlement = function(user,amount){
	this.user = user;
	this.amount = amount;
	this.settlementDate = (new Date);
}

var CommonBill = function(category, subcategory, name, amount, owner, sharePersons){
	this.billID			= 0;
	this.category 		= category;
	this.subcategory 	= subcategory;
	this.amount 		= amount;
	this.name			= name;
	this.sharePersons	= sharePersons;
	this.owner			= owner;
	this.createDate 	= (new Date);	
	this.billItems 		= [];
	//this.currentState 	= (new FreshState(this));
 }

CommonBill.prototype.generateBill = function(){
		if(this.billItems.length==0)
		{
			for (var i = this.sharePersons.length - 1; i >= 0; i--) {
				 this.billItems.push(new BillItem(this,this.sharePersons[i]));
			};
		} else {
			console.log("Bill ID : "+ this.billID + "Bill has already been genreated. can only be modified \n by changing the bill amount or adding new share person");
		}
};


CommonBill.prototype.toString = function(){
	return "Bill Created by : " + this.owner.name+ "\n" +
				"Bill ID : " + this.billID + "\n" +
				"Category : " + this.category + "\n" +
				"Subcategory : " + this.subcategory + "\n" +
				"Amount : " + this.amount + "\n" +
				"Name : " + this.name + "\n" +
				"SharePersons : " + this.sharePersons.length + "\n" +
				"Create Date : " + this.createDate;
};


var cb = new CommonBill("Food","Dinner","Birthday",12.50,new Person(0,"Desmond"),[new Person(1,"Gana"),new Person(2,"Thompson")]);
cb.billID = 1;
console.log(cb.toString());

cb.generateBill(cb);


var _billItem = cb.billItems;

_billItem[0].onAccepted();
_billItem = cb.billItems;

for (var i = _billItem.length - 1; i >= 0; i--) {
	//console.log(_billItem[i].currentState.currentState.toString());
	console.log(_billItem[i].currentState.toString());	
};


/*
var _billItem1 = cb.billItems;
//_billItem[0].onWithdrawal();
for (var i = _billItem1.length - 1; i >= 0; i--) {
	//console.log(_billItem[i].currentState.currentState.toString());
	console.log(_billItem1[i].currentState.toString());	
};

*/