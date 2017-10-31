({
    calloutCtrl: function(component, event, helper) {
        // Rates are quoted against the Euro by default. 
        // Quote against a different currency by setting the base parameter in your request.        
        var base = 'USD';
        helper.getResponse(component, base);
    },
 
})