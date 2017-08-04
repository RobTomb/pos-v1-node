'use strict'

const BARCODE_LENGTH = 10;
const datbase = require('./datbase');
const allItemsInfo = datbase.loadAllItems();
const promotionsInfo = datbase.loadPromotions();


function getBarSite(collection,barcode){
	return collection.findIndex( (item)=>{
		return item.barcode === barcode;
	})
}

function getNum(barcode){
	let num = 1;
	if(barcode.length !== BARCODE_LENGTH)
		num = parseInt(barcode.split('-')[1]);
	return num;
}

function countSameBarcode(inputs){
	let collection = [];
	inputs.forEach( (item)=>{
		let barcode = item.substring(0,BARCODE_LENGTH);
		let site = getBarSite(collection,barcode);

		if( site === -1 )
			collection.push({barcode:barcode, count:getNum(item)});
		else
			collection[site].count += getNum(item);
	})
	return collection;
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
function countTotalPrice(sameBarcodeSet){
	sameBarcodeSet = tagOffsetAndGift(sameBarcodeSet);
	return countPrice(sameBarcodeSet);
}





module.exports = function main(inputs) {
	let sameBarcodeSet = countSameBarcode(inputs);
	let price = countTotalPrice(sameBarcodeSet);

	/*
	outputs = '***<没钱赚商店>购物清单***\n' +
            '名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)\n' +
            '名称：荔枝，数量：2斤，单价：15.00(元)，小计：30.00(元)\n' +
            '名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)\n' +
            '----------------------\n' +
            '挥泪赠送商品：\n' +
            '名称：雪碧，数量：1瓶\n' +
            '名称：方便面，数量：1袋\n' +
            '----------------------\n' +
            '总计：51.00(元)\n' +
            '节省：7.50(元)\n' +
            '**********************';
	*/
    console.log(price);
};