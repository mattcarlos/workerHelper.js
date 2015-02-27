;
(function () {
    
    window.workerHelper = {
        createWorker: function (method, data, callback) {
            if (!!window.Worker && !(navigator.userAgent.indexOf("MSIE ") > -1 || navigator.userAgent.indexOf("Trident/") > -1)) {
                data = this.renderDataType(data);
                
                if (data.indexOf("!!!---ERROR---!!!") > -1) {
                    return false;
                }
                
                var blobURL = URL.createObjectURL(new Blob([
                    "(" + method.toString() + ")(" + data + ")"
                ], {
                    type: 'application/javascript'
                }));
                
                var worker = new Worker(blobURL);
                
                worker.onmessage = function (e) {
                    callback(e.data);
                };
                
                URL.revokeObjectURL(blobURL);
            } else {
                callback(method(data));
            }
        },
        renderDataType: function (data) {
            var newData;
            if (typeof data == "string") {
                data = "\"" + data + "\"";
            } else if (typeof data == "object" && Array.isArray(data)) {
                newData = "[";
                
                for (var i = 0; i < data.length; i++) {
                    if (typeof data[i] == "string") {
                        newData += "\"" + data[i] + "\",";
                    } else if (typeof data[i] == "number" || typeof data[i] == "boolean") {
                        newData += data[i] + ",";
                    } else {
                        newData += this.renderDataType(data[i]) + ",";
                    }
                }
                
                newData = newData.substring(0, newData.length - 1) + "]";
                data = newData;
            } else if (typeof data == "object") {
                newData = "{";
                
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        if (typeof data[key] == "string") {
                            newData += "\"" + key + "\": \"" + data[key] + "\",";
                        } else if (typeof data[key] == "number" || typeof data[key] == "boolean") {
                            newData += "\"" + key + "\": " + data[key] + ",";
                        } else {
                            newData += "\"" + key + "\": " + this.renderDataType(data[key]) + ",";
                        }
                    }
                }
                
                newData = newData.substring(0, newData.length - 1) + "}";
                data = newData;
            } else if (typeof data !== "number" || typeof data != "boolean") {
                data = "!!!---ERROR---!!!";
            }
            
            return data;
        }
    };
    
})();





















