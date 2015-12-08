if (!HTMLElement.prototype.hasOwnProperty("html")) {
    Object.defineProperty(HTMLElement.prototype, "html", {
        enumerable: true,
        set: function(source) {
            var doc = this.ownerDocument || document;
            var range = doc.createRange();
            
            range.selectNodeContents(this);
            range.deleteContents();
            
            if (typeof source !== "string" || !source instanceof String || !source) return;
            
            var df = range.createContextualFragment(source);
            this.appendChild(df);
            
            range.detach();
        },
        get: function() { return this.innerHTML; }
    });
}

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
