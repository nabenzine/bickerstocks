function resetShipping() 
{
	var data = $('form.cart').serialize();

	$.ajax({
		type: "POST",
		url: "/cart", 
		data:data,
		xhrFields: {
			  withCredentials: true
	    },
		success: function(result)
		{
			message("check next page");
			var shipUrlRes = result.match(/https:\/\/checkout.shopify.com\/([0-9]+)\/checkouts\/([^?]+)[?]step=shipping_method/);  
			if (shipUrlRes)
			{
				var shipUrl = shipUrlRes[0];
				message("URL shipping method = "+shipUrl);

				$.ajax({
					type: "GET",
					xhrFields: {
						  withCredentials: true
					},
					url: shipUrl, 
					success: function(result2)
					{
						var shipCost = result2.match(/data-checkout-total-shipping-target="[^"]+"[>]([^<]+)/);
						if(shipCost)
							message("ok, shipping costs = "+shipCost[1]);
						else
							message("no shipping cost found...");
					}
				});
			}
			else
			{
				message("URL shipping method not found");
			}
	}});
}


function message(s) {
	console.log(s);
}


function checkContactUrl() {
  var contactUrl = null;
  var referrer =  document.referrer;
  var checkOutMatch = referrer.match(/(https:\/\/checkout.shopify.com\/([0-9]+)\/checkouts\/([^?]+))[?]?/);
  if (checkOutMatch)
  {
    var contactUrl = checkOutMatch[1]+"?previous_step=contact_information&step=shipping_method";
    if(sessionStorage)
      sessionStorage.setItem("contactUrl",contactUrl);
  }
}

function nextStep(e) {
   var contactUrl = null;
   if(sessionStorage)
		contactUrl = sessionStorage.getItem("contactUrl");
  
	if (contactUrl)
	{
	   if(sessionStorage)
		   sessionStorage.removeItem("contactUrl");

	   window.location.href = contactUrl;
	   return false;
	}
      
   return true;
}

/* FY : gros hack pour corriger le bug du panier 

	cette fonction vérifie si on vient du checkout

*/
function _AAFY() {
  var contactUrl = null;
  var referrer =  document.referrer;
  var checkOutMatch = referrer.match(/(https:\/\/checkout.shopify.com\/([0-9]+)\/checkouts\/([^?]+))[?]?/);
  if (checkOutMatch)
  {
    console.log('coming from checkout, set fix');
    var UU = checkOutMatch[1]+"?previous_step=contact_information&step=shipping_method";
    if(sessionStorage)
      sessionStorage.setItem("UU",UU);
  }
}

function nextStep(e) {
   var contactUrl = null;
   if(sessionStorage)
		contactUrl = sessionStorage.getItem("UU");
  
	if (contactUrl)
	{
	   console.log('fix requested => go to SM');
	   if(sessionStorage)
		   sessionStorage.removeItem("UU");

	   window.location.href = contactUrl;
	   return false;
	}
      
   return true;
}
