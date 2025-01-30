parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"O8A1":[function(require,module,exports) {
function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(t)}function t(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function n(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,o(a.key),a)}}function a(e,t,a){return t&&n(e.prototype,t),a&&n(e,a),Object.defineProperty(e,"prototype",{writable:!1}),e}function o(t){var n=i(t,"string");return"symbol"==e(n)?n:n+""}function i(t,n){if("object"!=e(t)||!t)return t;var a=t[Symbol.toPrimitive];if(void 0!==a){var o=a.call(t,n||"default");if("object"!=e(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===n?String:Number)(t)}jQuery(function(e){"use strict";window.SV_WC_Google_Pay_Handler_v5_15_3=function(){return a(function e(n){t(this,e);var a=n.plugin_id,o=n.merchant_id,i=n.merchant_name,r=n.gateway_id,s=(n.gateway_id_dasherized,n.gateway_merchant_id),c=n.environment,l=n.ajax_url,u=n.recalculate_totals_nonce,d=n.process_nonce,h=n.button_style,m=n.card_types,y=n.available_countries,g=n.currency_code,p=n.needs_shipping,f=n.generic_error;this.gatewayID=r,this.gatewayMerchantID=s,this.merchantID=o,this.merchantName=i,this.environment=c,this.ajaxURL=l,this.recalculateTotalsNonce=u,this.processNonce=d,this.buttonStyle=h,this.availableCountries=y,this.currencyCode=g,this.needsShipping=p,this.genericError=f,n.product_id&&(this.productID=n.product_id);var P=m;this.baseRequest={apiVersion:2,apiVersionMinor:0};var _={type:"PAYMENT_GATEWAY",parameters:{gateway:a,gatewayMerchantId:this.gatewayMerchantID}};this.baseCardPaymentMethod={type:"CARD",parameters:{allowedAuthMethods:["PAN_ONLY","CRYPTOGRAM_3DS"],allowedCardNetworks:P,billingAddressRequired:!0,billingAddressParameters:{format:"FULL",phoneNumberRequired:!0}}},this.cardPaymentMethod=Object.assign({},this.baseCardPaymentMethod,{tokenizationSpecification:_}),this.paymentsClient=null},[{key:"getGoogleIsReadyToPayRequest",value:function(){return Object.assign({},this.baseRequest,{allowedPaymentMethods:[this.baseCardPaymentMethod]})}},{key:"getGooglePaymentDataRequest",value:function(e){var t=this;return this.getGoogleTransactionInfo(function(n){var a=Object.assign({},t.baseRequest);a.allowedPaymentMethods=[t.cardPaymentMethod],a.transactionInfo=n,a.merchantInfo={merchantId:t.merchantID,merchantName:t.merchantName},a.emailRequired=!0,a.callbackIntents=["PAYMENT_AUTHORIZATION"],t.needsShipping&&(a.callbackIntents=["SHIPPING_ADDRESS","SHIPPING_OPTION","PAYMENT_AUTHORIZATION"],a.shippingAddressRequired=!0,a.shippingAddressParameters=t.getGoogleShippingAddressParameters(),a.shippingOptionRequired=!0),e(a)})}},{key:"getGooglePaymentsClient",value:function(){var e=this;if(null===this.paymentsClient){var t={environment:this.environment,merchantInfo:{merchantName:this.merchantName,merchantId:this.merchantID},paymentDataCallbacks:{onPaymentAuthorized:function(t){return e.onPaymentAuthorized(t)}}};this.needsShipping&&(t.paymentDataCallbacks.onPaymentDataChanged=function(t){return e.onPaymentDataChanged(t)}),this.paymentsClient=new google.payments.api.PaymentsClient(t)}return this.paymentsClient}},{key:"onPaymentAuthorized",value:function(e){var t=this;return this.blockUI(),new Promise(function(n,a){try{t.processPayment(e,n)}catch(o){a({transactionState:"ERROR",error:{intent:"PAYMENT_AUTHORIZATION",message:"Payment could not be processed",reason:"PAYMENT_DATA_INVALID"}})}t.unblockUI()})}},{key:"onPaymentDataChanged",value:function(e){var t=this;return this.blockUI(),new Promise(function(n,a){try{var o=e.shippingAddress,i=e.shippingOptionData,r="";"SHIPPING_OPTION"==e.callbackTrigger&&(r=i.id),t.getUpdatedTotals(o,r,function(e){0==e.newShippingOptionParameters.shippingOptions.length&&(e={error:t.getGoogleUnserviceableAddressError()}),n(e)})}catch(s){t.failPayment("Could not load updated totals or process payment data request update. "+s)}t.unblockUI()})}},{key:"getGoogleTransactionInfo",value:function(t){var n=this,a={action:"wc_".concat(this.gatewayID,"_google_pay_get_transaction_info")};this.productID&&(a.productID=this.productID),e.post(this.ajaxURL,a,function(e){e.success?t(JSON.parse(e.data)):n.failPayment("Could not build transaction info. "+e.data.message)})}},{key:"getUpdatedTotals",value:function(t,n,a){var o=this,i={action:"wc_".concat(this.gatewayID,"_google_pay_recalculate_totals"),nonce:this.recalculateTotalsNonce,shippingAddress:t,shippingMethod:n};this.productID&&(i.productID=this.productID),e.post(this.ajaxURL,i,function(e){e.success?a(JSON.parse(e.data)):o.failPayment("Could not recalculate totals. "+e.data.message)})}},{key:"getGoogleShippingAddressParameters",value:function(){return{allowedCountryCodes:this.availableCountries}}},{key:"getGoogleUnserviceableAddressError",value:function(){return{reason:"SHIPPING_ADDRESS_UNSERVICEABLE",message:"Cannot ship to the selected address",intent:"SHIPPING_ADDRESS"}}},{key:"addGooglePayButton",value:function(){var e=this,t=this.getGooglePaymentsClient().createButton({onClick:function(t){return e.onGooglePaymentButtonClicked(t)},buttonColor:this.buttonStyle,buttonSizeMode:"fill"});document.getElementById("sv-wc-google-pay-button-container").appendChild(t)}},{key:"prefetchGooglePaymentData",value:function(){var e=this;this.getGooglePaymentDataRequest(function(t){t.transactionInfo={totalPriceStatus:"NOT_CURRENTLY_KNOWN",currencyCode:e.currencyCode},e.getGooglePaymentsClient().prefetchPaymentData(t)})}},{key:"processPayment",value:function(t,n){var a=this,o={action:"wc_".concat(this.gatewayID,"_google_pay_process_payment"),nonce:this.processNonce,paymentData:JSON.stringify(t)};return this.productID&&!this.needsShipping&&(o.productID=this.productID),e.post(this.ajaxURL,o,function(e){e.success?(n({transactionState:"SUCCESS"}),window.location=e.data.redirect):(n({transactionState:"ERROR",error:{intent:"SHIPPING_ADDRESS",message:"Invalid data",reason:"PAYMENT_DATA_INVALID"}}),a.failPayment("Payment could not be processed. "+e.data.message))})}},{key:"onGooglePaymentButtonClicked",value:function(e){var t=this;e.preventDefault(),this.blockUI(),this.getGooglePaymentDataRequest(function(e){var n=t.getGooglePaymentsClient();try{n.loadPaymentData(e)}catch(a){t.failPayment("Could not load payment data. "+a)}t.unblockUI()})}},{key:"init",value:function(){if(e("form.cart").length)this.initProductPage();else if(e("form.woocommerce-cart-form").length)this.initCartPage();else{if(!e("form.woocommerce-checkout").length)return;this.initCheckoutPage()}this.initGooglePay()}},{key:"initGooglePay",value:function(){var e=this;this.getGooglePaymentsClient().isReadyToPay(this.getGoogleIsReadyToPayRequest()).then(function(t){t.result&&(e.addGooglePayButton(),e.prefetchGooglePaymentData())}).catch(function(t){e.failPayment("Google Pay is not ready. "+t)})}},{key:"initProductPage",value:function(){this.uiElement=e("form.cart")}},{key:"initCartPage",value:function(){var t=this;this.uiElement=e("form.woocommerce-cart-form").parents("div.woocommerce"),e(document.body).on("updated_cart_totals",function(){t.initGooglePay()})}},{key:"initCheckoutPage",value:function(){this.uiElement=e("form.woocommerce-checkout")}},{key:"failPayment",value:function(e){console.error("[Google Pay] "+e),this.unblockUI(),this.renderErrors([this.genericError])}},{key:"renderErrors",value:function(t){e(".woocommerce-error, .woocommerce-message").remove(),this.uiElement.prepend('<ul class="woocommerce-error"><li>'+t.join("</li><li>")+"</li></ul>"),this.uiElement.removeClass("processing").unblock(),e("html, body").animate({scrollTop:this.uiElement.offset().top-100},1e3)}},{key:"blockUI",value:function(){this.uiElement.block({message:null,overlayCSS:{background:"#fff",opacity:.6}})}},{key:"unblockUI",value:function(){this.uiElement.unblock()}}])}(),e(document.body).trigger("sv_wc_google_pay_handler_v5_15_3_loaded")});
},{}]},{},["O8A1"], null)
//# sourceMappingURL=../frontend/sv-wc-payment-gateway-google-pay.js.map