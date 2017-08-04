'use strict'
const datbase = require('./datbase');
const allItemsInfo = datbase.loadAllItems();
const promotionsInfo = datbase.loadPromotions();
const sameBarcodeSet = [{ barcode: 'ITEM000001', count: 5 },
  					  { barcode: 'ITEM000003', count: 2 },
  					  { barcode: 'ITEM000005', count: 3 }];

// console.log(allItemsInfo);

function countBarcodePirce(barcodeInfo){

}

function countOffsetNum(barcodeInfo){
	let num = 0;
	// if()
}

function getAllItemsSite(barcodeInfo){
	return allItemsInfo.findIndex( (item)=>{
		return item.barcode === barcodeInfo.barcode;
	})
}

function countPrice(sameBarcodeSet){
	let price = [0,0];
	let totalPrice = 0;
	let cutPrice = 0;
	sameBarcodeSet.forEach( (item)=>{
		let site = getAllItemsSite(item);
		if( site !== -1 ){
			item['site'] = site;
			item['afterPrice'] = allItemsInfo[site].price * (item.count - item.offset);
			item['beforePrice'] = allItemsInfo[site].price * item.count;
			totalPrice += item.afterPrice;
			cutPrice += item.beforePrice;
		} 
	})
	return {totalPrice:totalPrice, cutPrice:cutPrice - totalPrice};
}

function tagOffsetAndGift(sameBarcodeSet){
	sameBarcodeSet.forEach( (item)=>{
		let barcodePrice = 0;
		let site = promotionsInfo[0].barcodes.indexOf(item.barcode);
		if(  site === -1 ){
			item['offset'] = 0;
			item['gift'] = -1;
		}
		else{
			item['offset'] = parseInt(item.count / 3);
			item['gift'] = parseInt((item.count - item.offset * 3 ) / 2); 
		}
	})
	return sameBarcodeSet;
}
let price=countPrice(tagOffsetAndGift(sameBarcodeSet)); 
console.log(price,sameBarcodeSet);
function countTotalPrice(sameBarcodeSet){
	sameBarcodeSet = tagOffsetAndGift(sameBarcodeSet);
	let price = countPrice(sameBarcodeSet);
}


















