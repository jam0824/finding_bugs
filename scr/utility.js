injectMethod(Array.prototype, "contains", function(item) {
    return this.indexOf(item) !== -1;
});
injectMethod(Array.prototype, "random", function(){
    return this[Math.random() * this.length | 0];
});
injectMethod(Array.prototype, "distinct", function(){
    return this.filter(function(e, i, arr) { return arr.indexOf(e) === i; });
})

injectProperty(HTMLElement.prototype, "html",
    function() { return this.innerHTML; },
    function(source) {
        var doc = this.ownerDocument || document;
        var range = doc.createRange();
        
        range.selectNodeContents(this);
        range.deleteContents();
        
        if (typeof source !== "string" || !source instanceof String || !source) return;
        
        var df = range.createContextualFragment(source);
        this.appendChild(df);
        
        range.detach();
    });

function sanitizeText(text) {
    var maliciousCharsMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "`": "&#x60;",
    };
    
    for (var c in maliciousCharsMap) {
        text = text.split(c).join(maliciousCharsMap[c]);
    }
    return text;
}

function injectMethod(target, name, func) {
    if (!target.hasOwnProperty(name)) {
        Object.defineProperty(target, name, {
            enumerable: true,
            value: func,
        });
    }
}
function injectProperty(target, name, getter, setter) {
    if (!target.hasOwnProperty(name)) {
        Object.defineProperty(target, name, {
            enumerable: true,
            get: getter,
            set: setter,
        });
    }
}