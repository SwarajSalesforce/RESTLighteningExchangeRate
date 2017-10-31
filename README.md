# RESTLightening Exchange Rate

## Step 1 :  Authorize the endpoint URL For Apex Callout.

 For Authorize the endpoint URL -:

From Setup, enter Remote Site Settings in the Quick Find box

Click on the Remote Site Settings.

Click New Remote Site.

For the remote site name, enter foreign_exchange_rates .

For the remote site URL, enter http://api.fixer.io  ,This URL authorizes all subfolders for the endpoint, like http://api.fixer.io/latest

Make sure your Active checkbox is Equal to True.

Click Save.

## Step 2 :  Create Apex Class For Make HTTP Callouts.

Apex class httpCallOutCtrl.apxc

public class httpCallOutCtrl {
	// Pass in the endpoint to be used using the string url
	@AuraEnabled
	public static Map < String,
	Object > getCalloutResponseContents(String url) {
 
		// Instantiate a new http object
		Http h = new Http();
 
		// Instantiate a new HTTP request, specify the method (GET) as well as the endpoint
		HttpRequest req = new HttpRequest();
		req.setEndpoint(url);
		req.setMethod('GET');
 
		// Send the request, and return a response
		HttpResponse res = h.send(req);
		System.debug('response:--> ' + res.getBody());
 
		// Deserialize the JSON string into collections of primitive data types.
		Map < String,
		Object > resultsMap = (Map < String, Object > ) JSON.deserializeUntyped(res.getBody());
		system.debug('resultsMap-->' + resultsMap);
 
		return resultsMap;
	}
}

In above apex class controller we have a getCalloutResponseContents @AuraEnabled class method with one parameter url as string type. And the Return type is Map type where String is key and object as value of the Map.

In getCalloutResponseContents Method ,first we created a new HTTP object. and set the EndPoint url with url parameter.

In the url parameter we set url from lightning component js controller.

and when the HttpResponse come from callout, Deserialize the JSON string into the Map collection and return the map.

## Step 3 :  Create Lightning Component

Use the lightening component in the repository.

In above Lightning component we are use two aura:attribute one is type of map and one is type of array of String

JS controller

({
    calloutCtrl: function(component, event, helper) {
        // Rates are quoted against the Euro by default. 
        // Quote against a different currency by setting the base parameter in your request.        
        var base = 'USD';
        helper.getResponse(component, base);
    },
    
  JS Helper
 
({
    getResponse: function(component, base) {
        // create a server side action.       
        var action = component.get("c.getCalloutResponseContents");
        // set the url parameter for getCalloutResponseContents method (to use as endPoint) 
        action.setParams({
            "url": 'http://api.fixer.io/latest?base=' + base
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                // set the response(return Map<String,object>) to response attribute.      
                component.set("v.response", response.getReturnValue());
 
                // get the all rates from map by using key              
                var getAllRates = component.get("v.response")['rates'];
                var CurrencyList = [];
                // play a loop on rates object 
                for (var key in getAllRates) {
                    // push all rates with there Name in CurrencyList variable.        
                    CurrencyList.push(key + ' = ' + getAllRates[key]); // i.e : INR = 67.919  
                }
                // set the CurrencyList to ListOfCurrency attribute on component.           
                component.set("v.ListOfCurrency", CurrencyList);
            }
        });
 
        $A.enqueueAction(action);
    },
})
 
})

Lightning App:ExchangeRateApp

<aura:application extends="force:slds">
   <c:SampleComponent/>
  <!-- here c: is org. namespace prefix-->
</aura:application>
 
