'use strict'
const datbase = require('./datbase');
const allItemsInfo = datbase.loadAllItems();
const promotionsInfo = datbase.loadPromotions();
const sameBarcodeSet = [ { barcode: 'ITEM000001',
    count: 5,
    offset: 1,
    giftCount: 1,
    site: 1,
    afterPrice: 12,
    beforePrice: 15 },
  { barcode: 'ITEM000003',
    count: 2,
    offset: 0,
    giftCount: -1,
    site: 3,
    afterPrice: 30,
    beforePrice: 30 },
  { barcode: 'ITEM000005',
    count: 3,
    offset: 1,
    giftCount: 0,
    site: 5,
    afterPrice: 9,
    beforePrice: 13.5 } ];

let price={ totalPrice: 51, cutPrice: 7.5 }; 

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
console.log(showInfo(sameBarcodeSet,price))

















