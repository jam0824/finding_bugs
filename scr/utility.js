if (!HTMLElement.prototype.hasOwnProperty("html")) {
    Object.defineProperty(HTMLElement.prototype, "html", {
        enumerable: true,
        set: function(source) {
            while (this.hasChildNodes()) {
                this.removeChild(this.firstChild);
            }
            
            if (typeof source !== "string" || source instanceof String || !source) return;
            
            var doc = this.ownerDocument || document;
            var range = doc.createRange();
            range.selectNode(doc.body);
            
            var df = range.createContextualFragment(source);
            this.appendChild(df);
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
