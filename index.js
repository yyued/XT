if (typeof window === "object") {
    window.XTFrameworkLoader = {
        distUrl: "https://cdn.jsdelivr.net/npm/xt-studio@0.4.5/dist",
        componentsUrl: {
            "SparkMD5": function () { return "https://cdn.jsdelivr.net/npm/spark-md5@3.0.0/spark-md5.min.js" },
            "sha1": function () { return "https://cdn.jsdelivr.net/npm/js-sha1@0.6.0/build/sha1.min.js" },
            "pako": function () { return "https://cdn.jsdelivr.net/npm/pako@1.0.6/dist/pako.min.js" },
            "XT": function () { return window.XTFrameworkLoader.distUrl + "/Core/xt.core.web.min.js" },
            "NS": function () { return window.XTFrameworkLoader.distUrl + "/Foundation/xt.foundation.web.min.js" },
            "UI": function () { return window.XTFrameworkLoader.distUrl + "/UIKit/xt.uikit.web.min.js" },
        },
        loadUrl: function (url, onLoad) {
            var codeRequest = new XMLHttpRequest();
            codeRequest.open("GET", url, true);
            codeRequest.addEventListener("loadend", function () {
                if (codeRequest.readyState == 4 && codeRequest.status < 400) {
                    var code = codeRequest.responseText;
                    this.loadComponents(code, ["XT", "UI"], function () {
                        onLoad(URL.createObjectURL(new Blob([code], { type: "text/plain" })));
                    });
                }
            }.bind(this));
            codeRequest.send();
        },
        loadComponents: function (code, components, completion, failure) {
            if (code.indexOf(".md5()") >= 0) {
                components.push("SparkMD5")
            }
            if (code.indexOf(".sha1()") >= 0) {
                components.push("sha1")
            }
            if (code.indexOf("FileManager") >= 0) {
                components.push("pako")
            }
            if (code.indexOf("NS.") >= 0) {
                components.push("NS");
            }
            var loadComponent = function () {
                for (var index = 0; index < components.length; index++) {
                    var comID = components[index];
                    if (typeof window[comID] === "undefined") {
                        components.shift()
                        var element = document.createElement("script");
                        element.src = window.XTFrameworkLoader.componentsUrl[comID]();
                        element.onload = loadComponent;
                        document.body.appendChild(element);
                        return;
                    }
                }
                completion()
            }
            loadComponent()
        },
        autoload: function () {
            var elements = document.querySelectorAll('.UIContext')
            for (var index = 0; index < elements.length; index++) {
                (function (element) {
                    if (element.xtloaded === true) { return; }
                    element.xtloaded = true
                    XTFrameworkLoader.loadUrl(element.getAttribute('src'), function (sourceURL) {
                        var options = {}
                        try {
                            options = JSON.parse(element.getAttribute('options'))
                        } catch (error) { }
                        UI.Context.startWithURL(sourceURL, options, function (_, context) {
                            context.attachTo(element)
                        })
                    })
                })(elements[index])
            }
        }
    };
    setTimeout(window.XTFrameworkLoader.autoload, 100);
}

