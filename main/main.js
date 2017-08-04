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
			item['giftCount'] = -1;
		}
		else{
			item['offset'] = parseInt(item.count / 3);
			item['giftCount'] = parseInt((item.count - item.offset * 3 ) / 2 + item.offset); 
		}
	})
	return sameBarcodeSet;
}

function countTotalPrice(sameBarcodeSet){
	sameBarcodeSet = tagOffsetAndGift(sameBarcodeSet);
	return countPrice(sameBarcodeSet);
}

function showInfo(sameBarcodeSet,price){
	let info = '***<没钱赚商店>购物清单***\n';
	let gift = [];
	sameBarcodeSet.forEach( (item)=>{
		info += '名称：' + allItemsInfo[item.site].name 
			  + '，数量：' + item.count 
			  + allItemsInfo[item.site].unit 
			  + '，单价：' + allItemsInfo[item.site].price.toFixed(2) 
			  + '(元)，'
			  + '小计：' + item.afterPrice.toFixed(2)
			  + '(元)\n';
		if( item.giftCount !== -1 )
			gift.push({barcode:item.barcode , giftCount:item.giftCount , site:item.site});
	})
	info += '----------------------\n' + '挥泪赠送商品：\n';
	gift.forEach( (item)=>{
		info += '名称：' + allItemsInfo[item.site].name 
		      + '，数量：' + item.giftCount + allItemsInfo[item.site].unit + '\n';
	})
	info += '----------------------\n';
	info += '总计：' + price.totalPrice.toFixed(2) + '(元)\n' +
            '节省：' + price.cutPrice.toFixed(2) + '(元)\n' +
            '**********************';
	return info;
}

module.exports = function main(inputs) {
	let sameBarcodeSet = countSameBarcode(inputs);
	let price = countTotalPrice(sameBarcodeSet);
	let info = showInfo(sameBarcodeSet,price);
    console.log(info);
};