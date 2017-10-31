({
    doInit: function(component, event, helper) {
        var main = component.find('main');
        var recID = component.get("v.recordId");
        
        if (recID) {
            helper.getLocalWeather(component, recID);
        }
    },
    showDetails: function (component, event, helper) {
        var weatherDetails = component.find('weatherDetails');
        if (weatherDetails) {
	        $A.util.toggleClass(weatherDetails, 'slds-hide');
        }
    }
})
({
    rerender: function(cmp, helper) {
        console.log('rerender'); 
        return this.superRerender()
    },
})